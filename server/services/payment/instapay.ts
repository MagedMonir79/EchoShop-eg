/**
 * خدمة التكامل مع بوابة دفع انستاباي (InstaPay)
 */
import axios from 'axios';
import crypto from 'crypto';
import { log } from '../../vite';

// النطاق البيئي للخدمة (اختبار أو إنتاج)
const INSTAPAY_ENVIRONMENT = process.env.INSTAPAY_ENVIRONMENT || 'test';

// عنوان API حسب البيئة
const API_BASE_URL = INSTAPAY_ENVIRONMENT === 'production'
  ? 'https://api.instapay.eg/v1'
  : 'https://api-sandbox.instapay.eg/v1';

// المعرّفات الخاصة بالتاجر (يجب أن تكون متوفرة في البيئة)
const MERCHANT_ID = process.env.INSTAPAY_MERCHANT_ID;
const API_KEY = process.env.INSTAPAY_API_KEY;
const API_SECRET = process.env.INSTAPAY_API_SECRET;

interface InstaPayPaymentRequest {
  orderId: string;           // معرّف الطلب
  amount: number;            // المبلغ المطلوب
  customerInfo: {
    firstName: string;       // الاسم الأول للعميل
    lastName: string;        // الاسم الأخير للعميل
    email: string;           // البريد الإلكتروني للعميل
    phoneNumber: string;     // رقم هاتف العميل
  };
  currency?: string;         // رمز العملة (EGP افتراضياً)
  description?: string;      // وصف الطلب (اختياري)
  notificationUrl?: string;  // رابط الإشعار بنتيجة الدفع (اختياري)
  redirectUrl?: string;      // رابط إعادة التوجيه بعد الدفع (اختياري)
}

interface InstaPayPaymentResponse {
  success: boolean;
  paymentId: string;
  orderId: string;
  redirectUrl: string;
  responseCode: string;
  responseMessage: string;
}

/**
 * دالة إنشاء توقيع رقمي لطلب الدفع
 */
function generateSignature(payload: any): string {
  const stringToSign = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', API_SECRET || '')
    .update(stringToSign)
    .digest('hex');
}

/**
 * دالة إنشاء رقم مرجعي فريد للطلب
 */
export function generateOrderId(): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `IP-${timestamp}-${random}`;
}

/**
 * دالة إنشاء طلب دفع جديد عبر انستاباي
 */
export async function createInstaPayPayment(paymentData: InstaPayPaymentRequest): Promise<InstaPayPaymentResponse> {
  try {
    if (!MERCHANT_ID || !API_KEY || !API_SECRET) {
      throw new Error('InstaPay merchant credentials are not configured');
    }

    // تحضير بيانات الطلب
    const requestPayload = {
      merchantId: MERCHANT_ID,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'EGP',
      customerInfo: paymentData.customerInfo,
      description: paymentData.description || `Payment for order ${paymentData.orderId}`,
      notificationUrl: paymentData.notificationUrl || `${process.env.APP_URL}/api/payment/notify`,
      redirectUrl: paymentData.redirectUrl || `${process.env.APP_URL}/payment/callback`,
      timestamp: new Date().toISOString(),
    };

    // إنشاء توقيع رقمي للطلب
    const signature = generateSignature(requestPayload);

    // إرسال طلب الدفع إلى انستاباي
    const response = await axios.post(`${API_BASE_URL}/payments`, requestPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': API_KEY,
        'X-Signature': signature,
      },
    });

    log('InstaPay payment request successful', 'payment-service');

    return {
      success: response.data.status === 'SUCCESS',
      paymentId: response.data.paymentId,
      orderId: response.data.orderId,
      redirectUrl: response.data.redirectUrl,
      responseCode: response.data.responseCode,
      responseMessage: response.data.responseMessage,
    };
  } catch (error: any) {
    log(`InstaPay payment request failed: ${error.message}`, 'payment-service');
    throw error;
  }
}

/**
 * دالة التحقق من حالة الدفع
 */
export async function checkInstaPayPaymentStatus(paymentId: string): Promise<any> {
  try {
    if (!MERCHANT_ID || !API_KEY || !API_SECRET) {
      throw new Error('InstaPay merchant credentials are not configured');
    }

    // تحضير بيانات الطلب
    const requestPayload = {
      merchantId: MERCHANT_ID,
      paymentId: paymentId,
      timestamp: new Date().toISOString(),
    };

    // إنشاء توقيع رقمي للطلب
    const signature = generateSignature(requestPayload);

    // إرسال طلب التحقق من حالة الدفع
    const response = await axios.get(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': API_KEY,
        'X-Signature': signature,
      },
    });

    log('InstaPay payment status check successful', 'payment-service');

    return {
      success: response.data.status === 'SUCCESS',
      paymentId: response.data.paymentId,
      orderId: response.data.orderId,
      paymentStatus: response.data.paymentStatus,
      responseCode: response.data.responseCode,
      responseMessage: response.data.responseMessage,
      paymentDetails: response.data.paymentDetails,
    };
  } catch (error: any) {
    log(`InstaPay payment status check failed: ${error.message}`, 'payment-service');
    throw error;
  }
}