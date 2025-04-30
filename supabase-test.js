// برنامج اختبار بسيط للاتصال بـ Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

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
    const { data, error } = await supabase.from('testing').select('*').limit(1);
    const end = Date.now();
    
    if (error) {
      // في حالة حدوث خطأ، قد يكون الجدول غير موجود - نحاول استدعاء وظيفة لاختبار الاتصال
      console.log(`⚠️ خطأ في الاستعلام: ${error.message}`);
      console.log('\nمحاولة استعلام عن وقت الخادم...');
      
      const { data: timeData, error: timeError } = await supabase.rpc('get_server_time');
      
      if (timeError) {
        throw new Error(`فشل الاتصال بـ Supabase: ${timeError.message}`);
      } else {
        console.log(`✓ تم الاتصال بنجاح! وقت الخادم: ${timeData}`);
        console.log(`✓ زمن الاستجابة: ${end - start}ms`);
      }
    } else {
      console.log('✓ تم الاتصال والاستعلام بنجاح!');
      console.log(`✓ زمن الاستجابة: ${end - start}ms`);
      console.log(`✓ البيانات المستلمة: ${JSON.stringify(data)}`);
    }
    
    // محاولة إنشاء جدول للاختبار
    console.log('\nهل تريد محاولة إنشاء جدول اختبار؟ (y/n)');
    // نحن لا نقوم بذلك تلقائيًا في هذا البرنامج النصي البسيط
    // لكن يمكنك إضافة الكود هنا إذا كنت ترغب في ذلك
    
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