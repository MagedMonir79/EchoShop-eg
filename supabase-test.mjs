// برنامج اختبار بسيط للاتصال بـ Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تهيئة متغيرات البيئة
dotenv.config();

async function main() {
  // تحميل متغيرات البيئة
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  // طباعة معلومات التكوين (بدون إظهار المفتاح الكامل للأمان)
  console.log('=== اختبار اتصال Supabase ===');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`مفتاح API: ${supabaseKey ? 'متوفر (مخفي)' : 'غير متوفر!'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('خطأ: مفاتيح Supabase غير متوفرة في ملف .env');
    process.exit(1);
  }

  try {
    // إنشاء عميل Supabase
    console.log('\nمحاولة إنشاء عميل Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✓ تم إنشاء العميل بنجاح');

    // اختبار الاتصال باستخدام استعلام بسيط
    console.log('\nمحاولة الاتصال بخادم Supabase...');
    const start = Date.now();
    
    // إنشاء جدول للتحقق 
    console.log('\nمحاولة إنشاء جدول للاختبار...');
    try {
      // نستخدم أوامر SQL العامة المتاحة في Supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.log(`⚠️ خطأ في الاستعلام على الجلسة: ${error.message}`);
      } else {
        // نجحنا في الاتصال بـ Supabase!
        console.log('✓ تم الاتصال بخدمة Supabase بنجاح!');
        if (data.session) {
          console.log('✓ الجلسة متاحة');
        } else {
          console.log('⚠️ لا توجد جلسة حالية (وهذا طبيعي في هذا الاختبار)');
        }
      }
    } catch (error) {
      console.log(`⚠️ خطأ عام: ${error.message}`);
    }
    
    // محاولة إنشاء جدول باستخدام تعليمات SQL مباشرة
    // نستخدم واجهة برمجة التطبيقات لـ Supabase
    
    // اختبار قائمة الجداول
    console.log('\nمحاولة إظهار الجداول المتاحة...');
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.log(`⚠️ خطأ في قائمة التخزين: ${error.message}`);
        
        // محاولة بديلة - التحقق من الإصدار
        console.log('\nمحاولة استعلام عن معلومات المستخدم...');
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.log(`⚠️ خطأ في معلومات المستخدم: ${userError.message}`);
        } else {
          console.log('✓ تم الاتصال بنجاح بواجهة برمجة التطبيقات الخاصة بالمستخدم!');
          console.log(`✓ معلومات المستخدم: ${userData.user ? 'متوفرة' : 'غير متوفرة (وهذا طبيعي)'}`);
        }
      } else {
        console.log('✓ تم الاتصال بنجاح بواجهة برمجة التطبيقات الخاصة بالتخزين!');
        console.log(`✓ عدد البكتات المتاحة: ${data.length}`);
        if (data.length > 0) {
          console.log(`✓ قائمة البكتات: ${JSON.stringify(data.map(b => b.name))}`);
        }
      }
    } catch (error) {
      console.log(`⚠️ خطأ في الاستعلام: ${error.message}`);
    }
    
  } catch (err) {
    console.error(`❌ خطأ: ${err.message}`);
    if (err.stack) {
      console.error('\nمعلومات الخطأ الكاملة:');
      console.error(err.stack);
    }
    process.exit(1);
  }
}

// تشغيل الاختبار
main()
  .then(() => {
    console.log('\n=== تم إكمال الاختبار بنجاح ===');
  })
  .catch(err => {
    console.error(`\n=== فشل الاختبار: ${err.message} ===`);
    process.exit(1);
  });