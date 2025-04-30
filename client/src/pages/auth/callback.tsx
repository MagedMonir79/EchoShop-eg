import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جاري معالجة طلبك...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { searchParams } = new URL(window.location.href);
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`حدث خطأ: ${error}`);
          return;
        }

        // للتعامل مع رابط التأكيد على البريد الإلكتروني وإعادة تعيين كلمة المرور
        if (searchParams.get('type') === 'recovery') {
          // إعادة تعيين كلمة المرور
          setStatus('success');
          setMessage('يمكنك الآن إعادة تعيين كلمة المرور الخاصة بك');
          navigate('/reset-password');
          return;
        }

        // معالجة رابط التأكيد من Supabase
        const { error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setStatus('error');
          setMessage(`خطأ في الجلسة: ${sessionError.message}`);
          return;
        }

        setStatus('success');
        setMessage('تم التحقق من حسابك بنجاح!');
        
        // انتظر قليلاً ثم انتقل إلى الصفحة الرئيسية
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err: any) {
        setStatus('error');
        setMessage(`حدث خطأ غير متوقع: ${err.message}`);
      }
    };

    handleCallback();
  }, [navigate]);

  // زر الرجوع
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      {/* شريط علوي بسيط */}
      <nav className="bg-primary text-white py-3 px-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold">EchoShop</a>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-primary/80" 
            onClick={handleBack}
          >
            <ArrowRight className="h-4 w-4 ml-1" />
            <span className="hidden sm:inline">العودة للصفحة الرئيسية</span>
            <span className="sm:hidden">العودة</span>
          </Button>
        </div>
      </nav>
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin" />}
              {status === 'success' && <Check className="h-6 w-6 text-green-600" />}
              {status === 'error' && <AlertCircle className="h-6 w-6 text-red-600" />}
              
              {status === 'loading' && 'جاري المعالجة...'}
              {status === 'success' && 'تم بنجاح!'}
              {status === 'error' && 'حدث خطأ'}
            </CardTitle>
            <CardDescription className="text-lg pt-2">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {status !== 'loading' && (
              <Button
                onClick={() => navigate('/')}
                className="mt-4"
              >
                العودة إلى الصفحة الرئيسية
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}