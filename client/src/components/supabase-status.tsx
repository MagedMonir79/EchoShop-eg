import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

type StatusType = 'checking' | 'connected' | 'error';

export function SupabaseStatus() {
  const [status, setStatus] = useState<StatusType>('checking');
  const [message, setMessage] = useState<string>('جاري التحقق من الاتصال...');
  const [details, setDetails] = useState<any>(null);

  const checkConnection = async () => {
    setStatus('checking');
    setMessage('جاري التحقق من الاتصال...');
    setDetails(null);

    try {
      // أولاً، نتأكد من أن الاتصال بخدمة المصادقة يعمل
      const authStart = performance.now();
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const authEnd = performance.now();

      if (sessionError) {
        setStatus('error');
        setMessage(`خطأ في الاتصال بخدمة المصادقة: ${sessionError.message}`);
        return;
      }

      // ثانياً، نتحقق من خدمة التخزين
      const storageStart = performance.now();
      const { data: bucketsData, error: bucketsError } = await supabase.storage.listBuckets();
      const storageEnd = performance.now();

      if (bucketsError) {
        setStatus('error');
        setMessage(`خطأ في الاتصال بخدمة التخزين: ${bucketsError.message}`);
        return;
      }

      // إذا وصلنا إلى هنا، فالاتصال يعمل بشكل جيد
      setStatus('connected');
      setMessage('تم الاتصال بنجاح!');
      setDetails({
        auth: {
          responseTime: Math.round(authEnd - authStart),
          hasSession: !!sessionData.session
        },
        storage: {
          responseTime: Math.round(storageEnd - storageStart),
          buckets: bucketsData.length
        },
        timestamp: new Date().toLocaleTimeString('ar-EG'),
        url: import.meta.env.VITE_SUPABASE_URL?.substring(0, 15) + '...'
      });
    } catch (err: any) {
      setStatus('error');
      setMessage(`خطأ غير متوقع: ${err.message}`);
      console.error('Supabase connection error:', err);
    }
  };

  // التحقق من الاتصال عند تحميل المكون
  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">متصل</Badge>;
      case 'error':
        return <Badge variant="destructive">خطأ</Badge>;
      default:
        return <Badge variant="outline">جاري الفحص</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon()}
            حالة اتصال Supabase
          </CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      
      {status === 'connected' && details && (
        <CardContent className="pb-0">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">خدمة المصادقة:</span>
              <span className="font-medium">{details.auth.responseTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">خدمة التخزين:</span>
              <span className="font-medium">{details.storage.responseTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">عنوان السيرفر:</span>
              <span className="font-medium">{details.url}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">آخر تحديث:</span>
              <span className="font-medium">{details.timestamp}</span>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="pt-4">
        <Button 
          onClick={checkConnection}
          disabled={status === 'checking'} 
          variant="outline" 
          size="sm"
          className="w-full"
        >
          {status === 'checking' && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          إعادة فحص الاتصال
        </Button>
      </CardFooter>
    </Card>
  );
}