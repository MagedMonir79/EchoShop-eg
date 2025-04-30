/**
 * خدمة التكامل مع بوابة دفع فوري (Fawry)
 */
import crypto from 'crypto';
import axios from 'axios';
import { log } from '../../vite';

// النطاق البيئي للخدمة (اختبار أو إنتاج)
const FAWRY_ENVIRONMENT = process.env.FAWRY_ENVIRONMENT || 'test';

// عنوان API حسب البيئة
const API_BASE_URL = FAWRY_ENVIRONMENT === 'production'
  ? 'https://www.atfawry.com/ECommerceWeb/Fawry/payments/charge'
  : 'https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/charge';

// المعرّفات الخاصة بالتاجر (يجب أن تكون متوفرة في البيئة)
const MERCHANT_CODE = process.env.FAWRY_MERCHANT_CODE;
const MERCHANT_SECRET = process.env.FAWRY_MERCHANT_SECRET;
const MERCHANT_IDENTIFIER = process.env.FAWRY_MERCHANT_IDENTIFIER || 'EchoShop';

// رموز طرق الدفع المتاحة في فوري
export enum FawryPaymentMethod {
  CREDIT_CARD = 'CARD',
  WALLET = 'WALLET',
  CASH_PAYMENT = 'CASHONCASH',
  INSTALLMENTS = 'VALU',
  REFERENCE_NUMBER = 'PAYATFAWRY',
}

interface FawryPaymentRequest {
  merchantRefNum: string;     // رقم مرجعي فريد للطلب
  customerProfileId: string;  // معرّف المستخدم
  customerName: string;       // اسم العميل
  customerMobile: string;     // رقم هاتف العميل
  customerEmail: string;      // بريد العميل الإلكتروني
  chargeItems: {
    itemId: string;           // معرّف المنتج
    description: string;      // وصف المنتج
    price: number;            // سعر المنتج
    quantity: number;         // الكمية
  }[];
  paymentMethod: FawryPaymentMethod; // طريقة الدفع
  amount: number;             // المبلغ الإجمالي
  currencyCode?: string;      // رمز العملة (EGP افتراضياً)
  description?: string;       // وصف إضافي للطلب
  returnUrl?: string;         // عنوان URL للرجوع بعد الدفع
}

interface FawryPaymentResponse {
  type: string;
  referenceNumber: string;
  merchantRefNumber: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  statusCode: string;
  statusDescription: string;
}

/**
 * دالة إنشاء توقيع رقمي لطلب الدفع باستخدام المعلومات السرية للتاجر
 */
function generateSignature(merchantCode: string, merchantRefNum: string, customerProfileId: string, amount: number): string {
  const signatureString = `${merchantCode}${merchantRefNum}${customerProfileId}${amount.toFixed(2)}${MERCHANT_SECRET}`;
  return crypto.createHash('sha256').update(signatureString).digest('hex');
}

/**
 * دالة إنشاء طلب دفع جديد عبر فوري
 */
export async function createFawryPayment(paymentData: FawryPaymentRequest): Promise<FawryPaymentResponse> {
  try {
    if (!MERCHANT_CODE || !MERCHANT_SECRET) {
      throw new Error('Fawry merchant credentials are not configured');
    }

    // إنشاء توقيع رقمي للطلب
    const signature = generateSignature(
      MERCHANT_CODE,
      paymentData.merchantRefNum,
      paymentData.customerProfileId,
      paymentData.amount
    );

    // تحضير بيانات الطلب
    const requestPayload = {
      merchantCode: MERCHANT_CODE,
      merchantRefNum: paymentData.merchantRefNum,
      customerProfileId: paymentData.customerProfileId,
      customerName: paymentData.customerName,
      customerMobile: paymentData.customerMobile,
      customerEmail: paymentData.customerEmail,
      chargeItems: paymentData.chargeItems,
      paymentMethod: paymentData.paymentMethod,
      amount: paymentData.amount,
      currencyCode: paymentData.currencyCode || 'EGP',
      description: paymentData.description || `Order payment #${paymentData.merchantRefNum}`,
      paymentExpiry: 24 * 60, // 24 ساعة بالدقائق
      signature: signature,
      language: 'ar-eg',
      returnUrl: paymentData.returnUrl || `${process.env.APP_URL}/payment/callback`,
    };

    // إرسال طلب الدفع إلى فوري
    const response = await axios.post(API_BASE_URL, requestPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    log('Fawry payment request successful', 'payment-service');

    return response.data;
  } catch (error: any) {
    log(`Fawry payment request failed: ${error.message}`, 'payment-service');
    throw error;
  }
}

/**
 * دالة التحقق من حالة الدفع
 */
export async function checkFawryPaymentStatus(referenceNumber: string): Promise<any> {
  try {
    if (!MERCHANT_CODE || !MERCHANT_SECRET) {
      throw new Error('Fawry merchant credentials are not configured');
    }

    // إنشاء توقيع رقمي للاستعلام
    const signature = crypto
      .createHash('sha256')
      .update(`${MERCHANT_CODE}${referenceNumber}${MERCHANT_SECRET}`)
      .digest('hex');

    // إرسال طلب استعلام عن حالة الدفع
    const response = await axios.get(
      `${API_BASE_URL.replace('/charge', '/status')}?merchantCode=${MERCHANT_CODE}&merchantRefNumber=${referenceNumber}&signature=${signature}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    log('Fawry payment status check successful', 'payment-service');

    return response.data;
  } catch (error: any) {
    log(`Fawry payment status check failed: ${error.message}`, 'payment-service');
    throw error;
  }
}