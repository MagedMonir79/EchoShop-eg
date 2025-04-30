import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function SupabaseHealthCheck() {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  const [canCreateTable, setCanCreateTable] = useState(false);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [tableCreated, setTableCreated] = useState(false);

  const checkConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('connecting');
    setErrorMessage(null);

    try {
      // Check if we can connect at all
      const startTime = performance.now();
      const { data, error } = await supabase.from('testing').select('*').limit(1);
      const endTime = performance.now();

      if (error) {
        console.error('Supabase connection test error:', error);
        
        // Test if we can at least get the server time - this doesn't require table access
        const { data: timeData, error: timeError } = await supabase.rpc('get_server_time');
        
        if (timeError) {
          setConnectionStatus('error');
          setErrorMessage(`Cannot connect to Supabase: ${timeError.message}`);
        } else {
          // We can connect but table might not exist
          setConnectionStatus('connected');
          setCanCreateTable(true);
          setConnectionDetails({
            duration: Math.round(endTime - startTime),
            serverTime: timeData,
            tableError: error.message
          });
        }
      } else {
        // Connection and table access successful
        setConnectionStatus('connected');
        setConnectionDetails({
          duration: Math.round(endTime - startTime),
          data: data
        });
      }
    } catch (err) {
      console.error('Test error:', err);
      setConnectionStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createHealthCheckTable = async () => {
    setIsCreatingTable(true);
    try {
      // Create a simple health_check table
      const { error } = await supabase.rpc('create_health_check_table');
      
      if (error) {
        console.error('Create table error:', error);
        setErrorMessage(`Failed to create health_check table: ${error.message}`);
      } else {
        setTableCreated(true);
        // Check connection again
        await checkConnection();
      }
    } catch (err) {
      console.error('Create table error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsCreatingTable(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="container py-8 max-w-3xl mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-center">فحص اتصال Supabase</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">حالة الاتصال</CardTitle>
            <Badge variant={
              connectionStatus === 'connected' ? 'default' :
              connectionStatus === 'connecting' ? 'outline' : 'destructive'
            }>
              {connectionStatus === 'connected' ? 'متصل' :
               connectionStatus === 'connecting' ? 'جاري الاتصال...' : 'فشل الاتصال'}
            </Badge>
          </div>
          <CardDescription>
            فحص الاتصال بقاعدة بيانات Supabase
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">جاري التحقق من اتصال Supabase...</p>
            </div>
          ) : connectionStatus === 'error' ? (
            <div className="bg-destructive/10 p-4 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 ml-2" />
                <div>
                  <h3 className="font-semibold text-destructive">خطأ في الاتصال</h3>
                  <p className="text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
              
              <div className="mt-4 text-sm">
                <p className="font-semibold">حلول مقترحة:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>تأكد من صحة مفاتيح الـ API في ملف .env</li>
                  <li>تأكد من أن خدمة Supabase تعمل بشكل صحيح</li>
                  <li>إذا كان الخطأ يتعلق بالجداول، قد تحتاج إلى إنشاء الجداول المطلوبة</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 ml-2" />
                  <div>
                    <h3 className="font-semibold text-green-700">الاتصال بـ Supabase ناجح</h3>
                    <p className="text-sm mt-1 text-green-600">تم الاتصال بنجاح بخدمة Supabase</p>
                  </div>
                </div>
              </div>
              
              {connectionDetails && (
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">تفاصيل الاتصال:</h3>
                  <ul className="text-sm space-y-2">
                    <li>
                      <span className="font-medium">زمن الاستجابة:</span> {connectionDetails.duration}ms
                    </li>
                    {connectionDetails.serverTime && (
                      <li>
                        <span className="font-medium">وقت الخادم:</span> {new Date(connectionDetails.serverTime).toLocaleString('ar-EG')}
                      </li>
                    )}
                    {connectionDetails.tableError && (
                      <li className="text-amber-600">
                        <span className="font-medium">تحذير:</span> {connectionDetails.tableError}
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              {canCreateTable && !tableCreated && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-700 mb-3">
                    يمكننا إنشاء جدول اختبار للتحقق من صلاحيات الوصول الكاملة
                  </p>
                  <Button
                    onClick={createHealthCheckTable}
                    disabled={isCreatingTable}
                    size="sm"
                    variant="outline"
                    className="bg-white"
                  >
                    {isCreatingTable ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      'إنشاء جدول اختبار'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            onClick={checkConnection} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            إعادة فحص الاتصال
          </Button>
          
          <Button onClick={() => window.location.href = '/'}>
            العودة للرئيسية
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          URL: {import.meta.env.VITE_SUPABASE_URL?.substring(0, 15)}... | 
          مفتاح API: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ متوفر' : '✗ غير متوفر'}
        </p>
      </div>
    </div>
  );
}