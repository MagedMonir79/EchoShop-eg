/**
 * خدمة التكامل مع بوابة دفع فودافون كاش (Vodafone Cash)
 */
import axios from 'axios';
import crypto from 'crypto';
import { log } from '../../vite';

// النطاق البيئي للخدمة (اختبار أو إنتاج)
const VC_ENVIRONMENT = process.env.VC_ENVIRONMENT || 'test';

// عنوان API حسب البيئة
const API_BASE_URL = VC_ENVIRONMENT === 'production'
  ? 'https://api.vodafone.com.eg/payments/v1'
  : 'https://api-sandbox.vodafone.com.eg/payments/v1';

// المعرّفات الخاصة بالتاجر (يجب أن تكون متوفرة في البيئة)
const MERCHANT_ID = process.env.VODAFONE_MERCHANT_ID;
const MERCHANT_API_KEY = process.env.VODAFONE_API_KEY;
const MERCHANT_SECRET = process.env.VODAFONE_SECRET_KEY;

interface VodafonePaymentRequest {
  amount: number;            // المبلغ المطلوب
  msisdn: string;            // رقم هاتف العميل
  merchantReferenceId: string; // معرف الطلب الخاص بالتاجر
  customerName: string;      // اسم العميل
  customerEmail?: string;    // البريد الإلكتروني للعميل (اختياري)
  description?: string;      // وصف الطلب (اختياري)
  expiryTimeInMinutes?: number; // وقت انتهاء صلاحية الدفع بالدقائق (اختياري)
  language?: 'ar' | 'en';    // لغة الواجهة (اختياري)
  callbackUrl?: string;      // رابط إعادة التوجيه بعد الدفع (اختياري)
}

interface VodafonePaymentResponse {
  success: boolean;
  transactionId: string;
  merchantReferenceId: string;
  redirectUrl?: string;
  responseCode: string;
  responseMessage: string;
}

/**
 * دالة إنشاء توقيع رقمي لطلب الدفع
 */
function generateSignature(payload: any): string {
  const stringToSign = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', MERCHANT_SECRET || '')
    .update(stringToSign)
    .digest('hex');
}

/**
 * دالة إنشاء رقم مرجعي فريد للطلب
 */
export function generateMerchantReferenceId(): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `VC-${timestamp}-${random}`;
}

/**
 * دالة إنشاء طلب دفع جديد عبر فودافون كاش
 */
export async function createVodafonePayment(paymentData: VodafonePaymentRequest): Promise<VodafonePaymentResponse> {
  try {
    if (!MERCHANT_ID || !MERCHANT_API_KEY || !MERCHANT_SECRET) {
      throw new Error('Vodafone Cash merchant credentials are not configured');
    }

    // تحضير بيانات الطلب
    const requestPayload = {
      merchantId: MERCHANT_ID,
      merchantReferenceId: paymentData.merchantReferenceId,
      amount: paymentData.amount,
      msisdn: paymentData.msisdn.startsWith('2') ? paymentData.msisdn : `2${paymentData.msisdn.replace(/^0+/, '')}`,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail || '',
      description: paymentData.description || `Payment for order ${paymentData.merchantReferenceId}`,
      expiryTimeInMinutes: paymentData.expiryTimeInMinutes || 60,
      language: paymentData.language || 'ar',
      callbackUrl: paymentData.callbackUrl || `${process.env.APP_URL}/payment/callback`,
      timestamp: new Date().toISOString(),
    };

    // إنشاء توقيع رقمي للطلب
    const signature = generateSignature(requestPayload);

    // إرسال طلب الدفع إلى فودافون كاش
    const response = await axios.post(`${API_BASE_URL}/checkout`, requestPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': MERCHANT_API_KEY,
        'X-Signature': signature,
      },
    });

    log('Vodafone Cash payment request successful', 'payment-service');

    return {
      success: response.data.status === 'SUCCESS',
      transactionId: response.data.transactionId,
      merchantReferenceId: response.data.merchantReferenceId,
      redirectUrl: response.data.redirectUrl,
      responseCode: response.data.code,
      responseMessage: response.data.message,
    };
  } catch (error: any) {
    log(`Vodafone Cash payment request failed: ${error.message}`, 'payment-service');
    throw error;
  }
}

/**
 * دالة التحقق من حالة الدفع
 */
export async function checkVodafonePaymentStatus(merchantReferenceId: string): Promise<any> {
  try {
    if (!MERCHANT_ID || !MERCHANT_API_KEY || !MERCHANT_SECRET) {
      throw new Error('Vodafone Cash merchant credentials are not configured');
    }

    // تحضير بيانات الطلب
    const requestPayload = {
      merchantId: MERCHANT_ID,
      merchantReferenceId: merchantReferenceId,
      timestamp: new Date().toISOString(),
    };

    // إنشاء توقيع رقمي للطلب
    const signature = generateSignature(requestPayload);

    // إرسال طلب التحقق من حالة الدفع
    const response = await axios.post(`${API_BASE_URL}/status`, requestPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': MERCHANT_API_KEY,
        'X-Signature': signature,
      },
    });

    log('Vodafone Cash payment status check successful', 'payment-service');

    return {
      success: response.data.status === 'SUCCESS',
      paymentStatus: response.data.paymentStatus,
      transactionId: response.data.transactionId,
      merchantReferenceId: response.data.merchantReferenceId,
      responseCode: response.data.code,
      responseMessage: response.data.message,
    };
  } catch (error: any) {
    log(`Vodafone Cash payment status check failed: ${error.message}`, 'payment-service');
    throw error;
  }
}