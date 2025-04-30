import { useState } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Check, X, AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { resetPasswordSchema } from '@shared/supabase-schema';

export default function ResetPasswordPage() {
  const [, navigate] = useLocation();
  const { resetPassword, user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  // نموذج إعادة تعيين كلمة المرور
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  // معالجة إعادة تعيين كلمة المرور
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await resetPassword(data.password);
      
      if (!result.success) {
        setError(result.error || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
        return;
      }
      
      setSuccess('تم إعادة تعيين كلمة المرور بنجاح');
      toast({
        title: 'تم تحديث كلمة المرور',
        description: 'تم تغيير كلمة المرور الخاصة بك بنجاح، يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة',
        duration: 5000,
      });
      
      // توجيه المستخدم إلى صفحة تسجيل الدخول
      setTimeout(() => {
        navigate('/supabase-auth');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  // زر الرجوع
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      {/* شريط علوي بسيط */}
      <header className="w-full bg-primary text-white py-3 px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">EchoShop</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-primary/80" 
          onClick={handleBack}
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          رجوع
        </Button>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              إعادة تعيين كلمة المرور
            </CardTitle>
            <CardDescription>
              الرجاء إدخال كلمة المرور الجديدة
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* رسائل الخطأ والنجاح */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="mb-4 bg-green-50 text-green-700 border-green-200">
                <Check className="h-4 w-4" />
                <AlertTitle>نجاح</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور الجديدة</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تأكيد كلمة المرور</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  تحديث كلمة المرور
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="text-center text-sm text-muted-foreground">
            <span className="mx-auto">
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => navigate('/supabase-auth')}
              >
                العودة لتسجيل الدخول
              </Button>
            </span>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}