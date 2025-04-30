const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>اختبار الاتصال</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px; 
          max-width: 800px; 
          margin: 0 auto; 
          direction: rtl;
        }
        h1 { color: #2c3e50; margin-bottom: 30px; }
        .card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .success { color: #27ae60; }
        .info { color: #2980b9; }
      </style>
    </head>
    <body>
      <h1>صفحة اختبار EchoShop</h1>
      
      <div class="card">
        <h2 class="success">الخادم يعمل بنجاح! ✓</h2>
        <p>تم التأكد من أن الخادم يعمل بشكل صحيح ويمكن الوصول إليه من المتصفح.</p>
      </div>
      
      <div class="card">
        <h2 class="info">معلومات الخادم:</h2>
        <ul>
          <li>المنفذ: 5000</li>
          <li>بيئة التشغيل: ${process.env.NODE_ENV || 'غير محدد'}</li>
          <li>وقت الخادم: ${new Date().toLocaleString('ar-EG')}</li>
        </ul>
      </div>
      
      <div class="card">
        <h2>خطوات التالية</h2>
        <p>بمجرد التأكد من أن الخادم يعمل بشكل صحيح، سنقوم بمعالجة مشكلة الاتصال بـ Supabase.</p>
      </div>
    </body>
    </html>
  `);
});

app.get('/test-env', (req, res) => {
  res.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'موجود' : 'غير موجود',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'موجود' : 'غير موجود'
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running on http://localhost:${port}`);
});
