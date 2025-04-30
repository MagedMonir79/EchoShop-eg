import { useEffect, useState } from 'react';
import { supabase, supabaseDb } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SupabaseDirectTest() {
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // تشغيل اختبار الاتصال المباشر بـ Supabase
  const runDirectTest = async () => {
    setIsRefreshing(true);
    setDbStatus('loading');
    setErrorMessage(null);
    setTestResults([]);
    
    const results = [];
    
    try {
      // الاختبار 1: التحقق من حالة الاتصال
      try {
        const start = Date.now();
        const { data, error } = await supabase.from('health_check').select('*').limit(1);
        const duration = Date.now() - start;
        
        if (error) throw error;
        
        results.push({
          name: 'اختبار الاتصال بـ Supabase',
          success: true,
          message: `تم الاتصال بنجاح (${duration}ms)`,
          details: JSON.stringify(data, null, 2)
        });
      } catch (err: any) {
        results.push({
          name: 'اختبار الاتصال بـ Supabase',
          success: false,
          message: `فشل الاتصال: ${err.message}`,
          details: err.stack
        });
      }
      
      // الاختبار 2: محاولة قراءة بيانات التصنيفات
      try {
        const start = Date.now();
        const data = await supabaseDb.getCategories();
        const duration = Date.now() - start;
        
        results.push({
          name: 'قراءة بيانات التصنيفات',
          success: true,
          message: `تم قراءة ${data.length} تصنيف (${duration}ms)`,
          details: data.length > 0 ? JSON.stringify(data.slice(0, 3), null, 2) + (data.length > 3 ? '\n...' : '') : 'لا توجد بيانات'
        });
      } catch (err: any) {
        results.push({
          name: 'قراءة بيانات التصنيفات',
          success: false,
          message: `فشل قراءة البيانات: ${err.message}`,
          details: err.stack
        });
      }
      
      // فحص الحالة العامة
      const failedTests = results.filter(test => !test.success);
      if (failedTests.length === 0) {
        setDbStatus('connected');
      } else {
        setDbStatus('error');
        setErrorMessage(`فشل ${failedTests.length} من الاختبارات`);
      }
    } catch (err: any) {
      setDbStatus('error');
      setErrorMessage(err.message);
    } finally {
      setTestResults(results);
      setIsRefreshing(false);
    }
  };

  // تشغيل الاختبار عند تحميل الصفحة
  useEffect(() => {
    runDirectTest();
  }, []);

  return (
    <div className="container py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">اختبار الاتصال المباشر بـ Supabase</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {dbStatus === 'loading' ? (
              <RefreshCw className="animate-spin h-5 w-5" />
            ) : dbStatus === 'connected' ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-red-500" />
            )}
            حالة الاتصال بقاعدة البيانات
          </CardTitle>
          <CardDescription>
            {dbStatus === 'loading' ? 'جاري الاتصال...' : 
             dbStatus === 'connected' ? 'متصل بنجاح' : 
             `فشل الاتصال: ${errorMessage || 'خطأ غير معروف'}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={dbStatus === 'connected' ? 'default' : 'secondary'}>
                URL: {import.meta.env.VITE_SUPABASE_URL?.substring(0, 15)}...
              </Badge>
              
              <Badge variant={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'default' : 'destructive'}>
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'مفتاح API متاح' : 'مفتاح API غير متاح'}
              </Badge>
            </div>
            
            {testResults.map((test, index) => (
              <Alert key={index} variant={test.success ? 'default' : 'destructive'}>
                <AlertCircle className={`h-4 w-4 ${test.success ? 'text-green-500' : 'text-red-500'}`} />
                <AlertTitle>{test.name}</AlertTitle>
                <AlertDescription>
                  <p>{test.message}</p>
                  {test.details && (
                    <pre className="mt-2 text-xs p-2 bg-gray-100 rounded overflow-auto max-h-40">
                      {typeof test.details === 'string' ? test.details : JSON.stringify(test.details, null, 2)}
                    </pre>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={runDirectTest} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                جاري إعادة الاختبار...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                إعادة الاختبار
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>معلومات التشخيص</CardTitle>
          <CardDescription>تفاصيل تشخيصية إضافية لمساعدة المطورين</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">معلومات البيئة</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>وقت الخادم: {new Date().toLocaleString('ar-EG')}</li>
                <li>بيئة التشغيل: {import.meta.env.MODE}</li>
                <li>عنوان URL الحالي: {window.location.href}</li>
                <li>المتصفح: {navigator.userAgent}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">خطوات استكشاف الأخطاء وإصلاحها</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>تأكد من صحة مفاتيح Supabase في ملف .env</li>
                <li>تحقق من وجود الجداول المطلوبة في قاعدة البيانات</li>
                <li>تأكد من أن السماحات (permissions) مضبوطة بشكل صحيح</li>
                <li>راجع سجلات الخطأ في وحدة تحكم المتصفح</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}