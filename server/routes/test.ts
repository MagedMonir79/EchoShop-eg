import { Router } from 'express';
import { supabase } from '../../client/src/lib/supabaseClient';

export const testRouter = Router();

// صفحة اختبار بسيطة لعرض معلومات البيئة والاتصال
testRouter.get('/test', async (req, res) => {
  try {
    // اختبار الاتصال بـ Supabase
    let supabaseStatus = 'غير متصل';
    let supabaseError = null;
    
    try {
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      
      if (error) {
        supabaseStatus = 'فشل الاتصال';
        supabaseError = error.message;
      } else {
        supabaseStatus = 'متصل بنجاح';
      }
    } catch (err: any) {
      supabaseStatus = 'خطأ في الاتصال';
      supabaseError = err.message;
    }

    // جمع معلومات عن البيئة
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!process.env.VITE_SUPABASE_ANON_KEY,
      hasFirebaseApiKey: !!process.env.VITE_FIREBASE_API_KEY,
      hasFirebaseProjectId: !!process.env.VITE_FIREBASE_PROJECT_ID,
      hasFirebaseAppId: !!process.env.VITE_FIREBASE_APP_ID,
    };

    // إرسال HTML بسيط مع النتائج
    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>اختبار الاتصال</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1, h2 { color: #333; }
          .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
          .success { background-color: #d4edda; color: #155724; }
          .error { background-color: #f8d7da; color: #721c24; }
          pre { background-color: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
          .info { background-color: #e2e3e5; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>صفحة اختبار الاتصال بالخادم</h1>
        
        <h2>حالة الخادم</h2>
        <div class="status success">
          الخادم يعمل بشكل صحيح
        </div>
        
        <h2>معلومات البيئة</h2>
        <div class="info">
          <pre>${JSON.stringify(env, null, 2)}</pre>
        </div>
        
        <h2>حالة الاتصال بـ Supabase</h2>
        <div class="status ${supabaseError ? 'error' : 'success'}">
          ${supabaseStatus}
          ${supabaseError ? `<br><small>${supabaseError}</small>` : ''}
        </div>
        
        <h2>اختبار الاتصال بـ API</h2>
        <div class="status success">
          <p>API يعمل بشكل صحيح - تم استدعاء <code>/api/test</code> بنجاح</p>
        </div>
      </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send(`
      <html>
        <body>
          <h1>حدث خطأ</h1>
          <p>${err.message}</p>
        </body>
      </html>
    `);
  }
});