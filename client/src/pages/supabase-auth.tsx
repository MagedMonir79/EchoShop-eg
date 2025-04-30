import { useState } from 'react';
import { useLocation, Link } from 'wouter';
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
      setAuthSuccess('تم إنشاء حسابك بنجاح! جاري توجيهك للصفحة الرئيسية...');
      registerForm.reset();
      
      // التسجيل التلقائي بعد إنشاء الحساب بنجاح
      const loginResult = await signIn(data.email, data.password);
      if (loginResult.success) {
        // تأخير التوجيه لمدة قصيرة للسماح للمستخدم برؤية رسالة النجاح
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // إذا فشل التسجيل التلقائي، انتقل إلى نموذج تسجيل الدخول
        setActiveTab('login');
      }
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
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      {/* شريط علوي بسيط */}
      <nav className="bg-primary text-white py-3 px-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">EchoShop</Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-primary/80" 
            onClick={handleBack}
          >
            <ArrowRight className="h-4 w-4 ml-1" />
            <span className="hidden sm:inline">رجوع للصفحة السابقة</span>
            <span className="sm:hidden">رجوع</span>
          </Button>
        </div>
      </nav>
      
      {/* قسم النموذج */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              {isResettingPassword ? 'استعادة كلمة المرور' : activeTab === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
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
                            <FormLabel>البريد الإلكتروني أو اسم المستخدم</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com أو username" {...field} />
                            </FormControl>
                            <p className="text-xs text-gray-500 mt-1">
                              يمكنك استخدام البريد الإلكتروني أو username لتسجيل الدخول
                            </p>
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
                          try {
                            await signInWithGoogle();
                            // لا نحتاج للتحقق من النتيجة هنا لأن المستخدم سيتم إعادة توجيهه
                          } catch (err: any) {
                            setAuthError('حدث خطأ أثناء تسجيل الدخول بواسطة جوجل: ' + err.message);
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        ) : (
                          <svg viewBox="0 0 24 24" className="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                            </g>
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
                          try {
                            await signInWithGoogle();
                            // لا نحتاج للتحقق من النتيجة هنا لأن المستخدم سيتم إعادة توجيهه
                          } catch (err: any) {
                            setAuthError('حدث خطأ أثناء تسجيل الدخول بواسطة جوجل: ' + err.message);
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        ) : (
                          <svg viewBox="0 0 24 24" className="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                            </g>
                          </svg>
                        )}
                        التسجيل بواسطة جوجل
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

      {/* القسم التوضيحي للشاشات الكبيرة */}
      <div className="flex-1 bg-primary text-primary-foreground hidden lg:flex flex-col items-center justify-center p-8">
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
      
      {/* شريط المميزات المختصر للشاشات المتوسطة */}
      <div className="hidden md:block lg:hidden bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center text-center px-2">
              <Check className="h-5 w-5 mb-1" />
              <span className="text-sm font-medium">منتجات متنوعة</span>
            </div>
            <div className="flex flex-col items-center text-center px-2">
              <Check className="h-5 w-5 mb-1" />
              <span className="text-sm font-medium">توصيل سريع</span>
            </div>
            <div className="flex flex-col items-center text-center px-2">
              <Check className="h-5 w-5 mb-1" />
              <span className="text-sm font-medium">طرق دفع متعددة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}