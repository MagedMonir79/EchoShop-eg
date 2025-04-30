import { useState } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Check, X, AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { insertUserSchema, loginSchema, forgotPasswordSchema } from '@shared/supabase-schema';

export default function SupabaseAuthPage() {
  const [, navigate] = useLocation();
  const { signIn, signUp, signInWithGoogle, forgotPassword, user, loading } = useSupabaseAuth();
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  // إذا كان المستخدم مسجل بالفعل، انتقل إلى الصفحة الرئيسية
  if (user) {
    navigate('/');
    return null;
  }

  // نموذج تسجيل الدخول
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // نموذج التسجيل
  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    }
  });

  // نموذج استعادة كلمة المرور
  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  // معالجة تسجيل الدخول
  const onLoginSubmit = async (data: any) => {
    setAuthError(null);
    const result = await signIn(data.email, data.password);
    if (!result.success) {
      setAuthError(result.error || 'حدث خطأ أثناء تسجيل الدخول');
    } else {
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحبًا بك مرة أخرى في EchoShop',
        variant: 'default',
      });
      navigate('/');
    }
  };

  // معالجة التسجيل
  const onRegisterSubmit = async (data: any) => {
    setAuthError(null);
    const result = await signUp(data.email, data.password, data.username);
    if (!result.success) {
      setAuthError(result.error || 'حدث خطأ أثناء إنشاء الحساب');
    } else {
      setAuthSuccess('تم إنشاء حسابك بنجاح! تحقق من بريدك الإلكتروني للتفعيل.');
      setActiveTab('login');
      registerForm.reset();
    }
  };

  // معالجة استعادة كلمة المرور
  const onForgotPasswordSubmit = async (data: any) => {
    setAuthError(null);
    const result = await forgotPassword(data.email);
    if (!result.success) {
      setAuthError(result.error || 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور');
    } else {
      setAuthSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      setIsResettingPassword(false);
      forgotPasswordForm.reset();
    }
  };

  // زر الرجوع
  const handleBack = () => {
    window.history.back();
  };
  
  return (
    <div className="flex flex-col sm:flex-row min-h-screen" dir="rtl">
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
      
      {/* قسم النموذج */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {isResettingPassword ? 'استعادة كلمة المرور' : activeTab === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </CardTitle>
            <CardDescription>
              {isResettingPassword 
                ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور' 
                : activeTab === 'login' 
                  ? 'قم بتسجيل الدخول للوصول إلى حسابك' 
                  : 'قم بملء النموذج أدناه لإنشاء حساب جديد'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* رسائل الخطأ والنجاح */}
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            {authSuccess && (
              <Alert variant="default" className="mb-4 bg-green-50 text-green-700 border-green-200">
                <Check className="h-4 w-4" />
                <AlertTitle>نجاح</AlertTitle>
                <AlertDescription>{authSuccess}</AlertDescription>
              </Alert>
            )}

            {isResettingPassword ? (
              // نموذج استعادة كلمة المرور
              <Form {...forgotPasswordForm}>
                <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={forgotPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input placeholder="example@domain.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setIsResettingPassword(false)}
                    >
                      العودة لتسجيل الدخول
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      إرسال الرابط
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              // نماذج تسجيل الدخول والتسجيل
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                  <TabsTrigger value="register">حساب جديد</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="text-left">
                        <Button 
                          type="button" 
                          variant="link" 
                          className="p-0 h-auto" 
                          onClick={() => setIsResettingPassword(true)}
                        >
                          نسيت كلمة المرور؟
                        </Button>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        تسجيل الدخول
                      </Button>
                      
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300"></span>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white px-2 text-gray-500">أو</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        className="w-full flex items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50" 
                        onClick={async () => {
                          setAuthError(null);
                          const result = await signInWithGoogle();
                          if (!result.success) {
                            setAuthError(result.error || 'حدث خطأ أثناء تسجيل الدخول بواسطة جوجل');
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-4 w-4 ml-2">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                          </svg>
                        )}
                        تسجيل الدخول بواسطة جوجل
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your@email.com" 
                                type="email" 
                                autoComplete="email"
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-gray-500 mt-1">
                              سيتم إرسال رابط تأكيد البريد الإلكتروني إليك
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المستخدم</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="username" 
                                autoComplete="username"
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-gray-500 mt-1">
                              يجب أن يكون بين 3-20 حرفاً، ويمكن استخدام الأحرف والأرقام والشرطة السفلية فقط
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="********" 
                                autoComplete="new-password"
                                {...field} 
                              />
                            </FormControl>
                            <div className="text-xs text-gray-500 mt-1 space-y-1">
                              <p>يجب أن تحتوي كلمة المرور على:</p>
                              <ul className="list-disc list-inside space-y-0.5">
                                <li>8 أحرف على الأقل</li>
                                <li>حرف كبير واحد على الأقل</li>
                                <li>حرف صغير واحد على الأقل</li>
                                <li>رقم واحد على الأقل</li>
                              </ul>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تأكيد كلمة المرور</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="********" 
                                autoComplete="new-password"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Alert variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية. بعد التسجيل، سيتم إرسال بريد إلكتروني للتحقق.
                        </AlertDescription>
                      </Alert>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        إنشاء حساب
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            <span className="mx-auto">
              {activeTab === 'login' 
                ? 'ليس لديك حساب؟ ' 
                : 'لديك حساب بالفعل؟ '}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
              >
                {activeTab === 'login' ? 'إنشاء حساب' : 'تسجيل الدخول'}
              </Button>
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* القسم التوضيحي */}
      <div className="flex-1 bg-primary text-primary-foreground hidden sm:flex flex-col items-center justify-center p-8">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            مرحبًا بك في EchoShop
          </h1>
          <p className="text-lg">
            منصة التسوق المفضلة في مصر. استمتع بتجربة تسوق سهلة وآمنة مع توصيل سريع.
          </p>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-start space-x-4 space-x-reverse">
              <Check className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">آلاف المنتجات المتنوعة</h3>
                <p className="text-sm opacity-80">اختر من بين مجموعة واسعة من المنتجات عالية الجودة</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 space-x-reverse">
              <Check className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">توصيل سريع وآمن</h3>
                <p className="text-sm opacity-80">نوصل طلبك بأسرع وقت ممكن إلى باب منزلك</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 space-x-reverse">
              <Check className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">طرق دفع متعددة</h3>
                <p className="text-sm opacity-80">ادفع بالطريقة التي تناسبك - نقدًا عند الاستلام أو إلكترونيًا</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}