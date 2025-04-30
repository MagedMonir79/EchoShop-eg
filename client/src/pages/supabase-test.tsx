import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Info } from 'lucide-react';

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  
  const testConnection = async () => {
    setConnectionStatus('testing');
    setErrorMessage(null);
    
    try {
      // Test a simple query to the Supabase API
      const startTime = Date.now();
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      const endTime = Date.now();
      
      if (error) {
        console.error('Supabase connection error:', error);
        setConnectionStatus('error');
        setErrorMessage(error.message);
        setConnectionDetails({ 
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }
      
      // Get service status
      const { data: healthData } = await supabase.rpc('get_service_status');
      
      setConnectionStatus('success');
      setConnectionDetails({
        responseTime: `${endTime - startTime}ms`,
        countResult: data,
        health: healthData || 'Health check not available'
      });
    } catch (err: any) {
      console.error('Supabase test failed:', err);
      setConnectionStatus('error');
      setErrorMessage(err.message);
    }
  };
  
  useEffect(() => {
    // Auto-test on load
    testConnection();
  }, []);
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">اختبار اتصال Supabase</h1>
      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>فحص الاتصال بقاعدة البيانات</CardTitle>
          <CardDescription>
            هذه الصفحة تختبر اتصال التطبيق بخدمة Supabase
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {connectionStatus === 'testing' && (
            <div className="flex items-center space-x-2 mb-4">
              <Loader2 className="animate-spin ml-2" />
              <span>جاري اختبار الاتصال...</span>
            </div>
          )}
          
          {connectionStatus === 'success' && (
            <Alert className="mb-4 bg-green-50 border-green-500">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">تم الاتصال بنجاح</AlertTitle>
              <AlertDescription className="text-green-700">
                تم الاتصال بنجاح بقاعدة بيانات Supabase
              </AlertDescription>
            </Alert>
          )}
          
          {connectionStatus === 'error' && (
            <Alert className="mb-4 bg-red-50 border-red-500">
              <XCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800">فشل الاتصال</AlertTitle>
              <AlertDescription className="text-red-700">
                {errorMessage || 'حدث خطأ أثناء الاتصال بقاعدة البيانات'}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">معلومات التشخيص</h3>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">
              {JSON.stringify(connectionDetails, null, 2)}
            </pre>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <Alert>
              <Info className="h-5 w-5" />
              <AlertTitle>تفاصيل التكوين</AlertTitle>
              <AlertDescription>
                <p>URL: {!!import.meta.env.VITE_SUPABASE_URL ? '✅ تم تكوينه' : '❌ غير مكوّن'}</p>
                <p>API Key: {!!import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ تم تكوينه' : '❌ غير مكوّن'}</p>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={testConnection} disabled={connectionStatus === 'testing'}>
            {connectionStatus === 'testing' && <Loader2 className="animate-spin ml-2" />}
            إعادة اختبار الاتصال
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}