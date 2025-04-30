import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
let transporter: nodemailer.Transporter;

// Initialize the transporter with environment variables
export function initializeEmailService() {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    console.log('Email service initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize email service:', error);
    return false;
  }
}

// Email templates
type TemplateType = 'welcome' | 'order_confirmation' | 'shipping_update' | 'password_reset' | 'admin_notification';

interface EmailTemplateData {
  [key: string]: any;
}

// Get email template based on type and data
function getEmailTemplate(templateType: TemplateType, data: EmailTemplateData, language: 'ar' | 'en' = 'ar'): { subject: string; html: string } {
  switch (templateType) {
    case 'welcome':
      return {
        subject: language === 'ar' ? `أهلاً بك في EchoShop، ${data.name}!` : `Welcome to EchoShop, ${data.name}!`,
        html: `
          <div dir="${language === 'ar' ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h1 style="color: #333; text-align: center;">${language === 'ar' ? 'مرحباً بك في EchoShop' : 'Welcome to EchoShop'}</h1>
            <p>${language === 'ar' ? `أهلاً ${data.name},` : `Hello ${data.name},`}</p>
            <p>${language === 'ar' ? 'شكراً لتسجيلك في EchoShop! نحن سعداء لانضمامك إلينا.' : 'Thank you for signing up with EchoShop! We\'re excited to have you onboard.'}</p>
            <p>${language === 'ar' ? 'يمكنك الآن بدء التسوق واستكشاف منتجاتنا المتنوعة.' : 'You can now start shopping and explore our diverse range of products.'}</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${data.loginUrl}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                ${language === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Login to Your Account'}
              </a>
            </div>
            <p style="margin-top: 30px;">${language === 'ar' ? 'مع أطيب التحيات,' : 'Best regards,'}<br>EchoShop Team</p>
          </div>
        `,
      };
      
    case 'order_confirmation':
      return {
        subject: language === 'ar' ? `تأكيد طلبك #${data.orderNumber}` : `Order Confirmation #${data.orderNumber}`,
        html: `
          <div dir="${language === 'ar' ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h1 style="color: #333; text-align: center;">${language === 'ar' ? 'تم تأكيد طلبك!' : 'Your Order is Confirmed!'}</h1>
            <p>${language === 'ar' ? `شكراً لك ${data.name},` : `Thank you ${data.name},`}</p>
            <p>${language === 'ar' ? `تم تأكيد طلبك رقم <strong>#${data.orderNumber}</strong> وجاري تجهيزه.` : `Your order <strong>#${data.orderNumber}</strong> has been confirmed and is being processed.`}</p>
            
            <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px;">${language === 'ar' ? 'تفاصيل الطلب:' : 'Order Details:'}</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: ${language === 'ar' ? 'right' : 'left'}; border-bottom: 1px solid #ddd;">${language === 'ar' ? 'المنتج' : 'Product'}</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${language === 'ar' ? 'الكمية' : 'Quantity'}</th>
                <th style="padding: 10px; text-align: ${language === 'ar' ? 'left' : 'right'}; border-bottom: 1px solid #ddd;">${language === 'ar' ? 'السعر' : 'Price'}</th>
              </tr>
              ${data.items.map((item: any) => `
                <tr>
                  <td style="padding: 10px; text-align: ${language === 'ar' ? 'right' : 'left'}; border-bottom: 1px solid #ddd;">${item.name}</td>
                  <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: ${language === 'ar' ? 'left' : 'right'}; border-bottom: 1px solid #ddd;">${item.price} ${data.currency}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="2" style="padding: 10px; text-align: ${language === 'ar' ? 'left' : 'right'}; font-weight: bold;">${language === 'ar' ? 'المجموع:' : 'Subtotal:'}</td>
                <td style="padding: 10px; text-align: ${language === 'ar' ? 'left' : 'right'};">${data.subtotal} ${data.currency}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: ${language === 'ar' ? 'left' : 'right'}; font-weight: bold;">${language === 'ar' ? 'الشحن:' : 'Shipping:'}</td>
                <td style="padding: 10px; text-align: ${language === 'ar' ? 'left' : 'right'};">${data.shipping} ${data.currency}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: ${language === 'ar' ? 'left' : 'right'}; font-weight: bold;">${language === 'ar' ? 'الإجمالي:' : 'Total:'}</td>
                <td style="padding: 10px; text-align: ${language === 'ar' ? 'left' : 'right'}; font-weight: bold;">${data.total} ${data.currency}</td>
              </tr>
            </table>
            
            <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px;">${language === 'ar' ? 'عنوان الشحن:' : 'Shipping Address:'}</h3>
            <p>${data.shippingAddress}</p>
            
            <p style="margin-top: 30px;">${language === 'ar' ? 'مع أطيب التحيات,' : 'Best regards,'}<br>EchoShop Team</p>
          </div>
        `,
      };
      
    case 'shipping_update':
      return {
        subject: language === 'ar' ? `تحديث شحن طلبك #${data.orderNumber}` : `Shipping Update for Order #${data.orderNumber}`,
        html: `
          <div dir="${language === 'ar' ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h1 style="color: #333; text-align: center;">${language === 'ar' ? 'تحديث حالة الشحن' : 'Shipping Status Update'}</h1>
            <p>${language === 'ar' ? `مرحباً ${data.name},` : `Hello ${data.name},`}</p>
            <p>${language === 'ar' ? `نود إبلاغك بتحديث حالة شحن طلبك رقم <strong>#${data.orderNumber}</strong>.` : `We wanted to let you know that there's an update to your order <strong>#${data.orderNumber}</strong>.`}</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h3 style="margin-top: 0;">${language === 'ar' ? 'حالة الطلب:' : 'Order Status:'} <span style="color: ${data.statusColor};">${data.status}</span></h3>
              <p>${language === 'ar' ? 'تفاصيل التحديث:' : 'Update Details:'} ${data.statusDescription}</p>
              ${data.trackingNumber ? `<p>${language === 'ar' ? 'رقم التتبع:' : 'Tracking Number:'} <strong>${data.trackingNumber}</strong></p>` : ''}
              ${data.trackingUrl ? `<p><a href="${data.trackingUrl}" style="color: #0070f3;">${language === 'ar' ? 'تتبع شحنتك' : 'Track Your Package'}</a></p>` : ''}
            </div>
            
            <p style="margin-top: 30px;">${language === 'ar' ? 'شكراً لتسوقك معنا!' : 'Thank you for shopping with us!'}</p>
            <p>${language === 'ar' ? 'مع أطيب التحيات,' : 'Best regards,'}<br>EchoShop Team</p>
          </div>
        `,
      };
      
    case 'password_reset':
      return {
        subject: language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Password Reset',
        html: `
          <div dir="${language === 'ar' ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h1 style="color: #333; text-align: center;">${language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Your Password'}</h1>
            <p>${language === 'ar' ? `مرحباً ${data.name},` : `Hello ${data.name},`}</p>
            <p>${language === 'ar' ? 'لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. انقر على الزر أدناه لإعادة تعيين كلمة المرور:' : 'We received a request to reset the password for your account. Click the button below to reset your password:'}</p>
            
            <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
              <a href="${data.resetUrl}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                ${language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
              </a>
            </div>
            
            <p>${language === 'ar' ? 'إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.' : 'If you did not request a password reset, you can ignore this email.'}</p>
            <p>${language === 'ar' ? 'ملاحظة: رابط إعادة تعيين كلمة المرور هذا صالح لمدة 24 ساعة فقط.' : 'Note: This password reset link is valid for 24 hours only.'}</p>
            
            <p style="margin-top: 30px;">${language === 'ar' ? 'مع أطيب التحيات,' : 'Best regards,'}<br>EchoShop Team</p>
          </div>
        `,
      };
      
    case 'admin_notification':
      return {
        subject: language === 'ar' ? `إشعار إداري: ${data.title}` : `Admin Notification: ${data.title}`,
        html: `
          <div dir="${language === 'ar' ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h1 style="color: #333; text-align: center;">${language === 'ar' ? 'إشعار إداري' : 'Admin Notification'}</h1>
            <div style="background-color: ${data.priorityColor || '#f8f9fa'}; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h2 style="margin-top: 0; color: ${data.priorityTextColor || '#333'};">${data.title}</h2>
              <p style="white-space: pre-line;">${data.message}</p>
              
              ${data.actionUrl ? `
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${data.actionUrl}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    ${data.actionText || (language === 'ar' ? 'مشاهدة التفاصيل' : 'View Details')}
                  </a>
                </div>
              ` : ''}
            </div>
            
            <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
              <p>${language === 'ar' ? 'تم إرسال هذا الإشعار تلقائياً عبر نظام EchoShop للإشعارات.' : 'This notification was automatically sent via the EchoShop notification system.'}</p>
            </div>
          </div>
        `,
      };
      
    default:
      return {
        subject: 'EchoShop Notification',
        html: `<div><p>${data.message || 'No message provided'}</p></div>`,
      };
  }
}

// Send email function
export async function sendEmail(
  to: string | string[],
  templateType: TemplateType,
  data: EmailTemplateData,
  language: 'ar' | 'en' = 'ar'
): Promise<boolean> {
  if (!transporter) {
    console.error('Email service not initialized');
    return false;
  }
  
  try {
    const { subject, html } = getEmailTemplate(templateType, data, language);
    
    const fromName = language === 'ar' ? 'إيكو شوب' : 'EchoShop';
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@echoshop.com';
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    });
    
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Send a test email to verify configuration
export async function sendTestEmail(to: string): Promise<boolean> {
  return sendEmail(to, 'admin_notification', {
    title: 'Test Email',
    message: 'This is a test email to verify that the email service is configured correctly.',
    priorityColor: '#e6f7ff',
    priorityTextColor: '#0070f3',
  });
}