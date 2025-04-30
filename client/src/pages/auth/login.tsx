import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/components/layout/main-layout";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowRight,
  User,
  KeyRound,
  Mail,
  AlertCircle,
  CheckCircle,
  LogIn,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schema
const loginSchema = z.object({
  identifier: z.string().min(1, "البريد الإلكتروني أو اسم المستخدم مطلوب"),
  password: z.string().min(6, "كلمة المرور مطلوبة ويجب أن تحتوي على 6 أحرف على الأقل"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { language, t } = useContext(LanguageContext);
  const { user, login } = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const isRTL = language === "ar";
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // If user is already logged in, redirect to home
  if (user) {
    navigate("/");
    return null;
  }
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Call login function from AuthContext
      await login(values.identifier, values.password);
      
      // Show success toast
      toast({
        title: t("loginSuccessful"),
        description: t("welcomeBack"),
        variant: "success",
      });
      
      // Redirect based on user role
      // This will be handled by AuthContext after login is successful
      
    } catch (error: any) {
      setLoginError(error.message || "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.");
      toast({
        title: t("loginFailed"),
        description: error.message || t("invalidCredentials"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className={`container mx-auto px-4 py-10 ${isRTL ? "rtl" : ""}`}>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 lg:w-2/5"
          >
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("login") || "تسجيل الدخول"}
                </CardTitle>
                <CardDescription>
                  {t("loginDescription") || "أدخل بيانات اعتمادك للوصول إلى حسابك"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="credentials" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="credentials">
                      <User className="h-4 w-4 mr-2" />
                      {t("credentials") || "بيانات الاعتماد"}
                    </TabsTrigger>
                    <TabsTrigger value="email">
                      <Mail className="h-4 w-4 mr-2" />
                      {t("email") || "البريد الإلكتروني"}
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Login with Username or Email */}
                  <TabsContent value="credentials" className="pt-4">
                    {loginError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{t("loginFailed") || "فشل تسجيل الدخول"}</AlertTitle>
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="identifier"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("identifierLabel") || "البريد الإلكتروني أو اسم المستخدم"}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    className="pl-10"
                                    placeholder={t("enterUsername") || "أدخل البريد الإلكتروني أو اسم المستخدم"}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("password") || "كلمة المرور"}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10"
                                    placeholder={t("enterPassword") || "أدخل كلمة المرور"}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="remember"
                              className="h-4 w-4 rounded border-gray-300"
                              {...form.register("rememberMe")}
                            />
                            <Label htmlFor="remember" className="text-sm">
                              {t("rememberMe") || "تذكرني"}
                            </Label>
                          </div>
                          
                          <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                            {t("forgotPassword") || "نسيت كلمة المرور؟"}
                          </Link>
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <span className="animate-spin mr-2">
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              </span>
                              {t("loggingIn") || "جاري تسجيل الدخول..."}
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" />
                              {t("login") || "تسجيل الدخول"}
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  {/* Login with Email */}
                  <TabsContent value="email" className="pt-4">
                    <div className="text-center p-4">
                      <Mail className="h-12 w-12 mb-2 mx-auto text-primary" />
                      <h3 className="text-lg font-medium mb-2">
                        {t("loginWithEmail") || "تسجيل الدخول باستخدام البريد الإلكتروني"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("emailLoginDescription") || "سنرسل لك رابطًا للدخول مباشرة عبر بريدك الإلكتروني"}
                      </p>
                      
                      <div className="space-y-3">
                        <Input
                          type="email"
                          placeholder={t("enterEmail") || "أدخل بريدك الإلكتروني"}
                          className="mb-2"
                        />
                        <Button className="w-full">
                          {t("sendLoginLink") || "إرسال رابط الدخول"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Separator />
                <div className="text-center w-full">
                  <p className="text-sm text-muted-foreground">
                    {t("dontHaveAccount") || "ليس لديك حساب؟"}{" "}
                    <Link href="/auth/register" className="text-primary hover:underline">
                      {t("createAccount") || "إنشاء حساب جديد"}
                    </Link>
                  </p>
                </div>
                
                {/* Social Login Buttons */}
                <div className="space-y-2 w-full">
                  <Button variant="outline" className="w-full">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {t("continueWithGoogle") || "المتابعة باستخدام Google"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Right Column - Hero */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2 lg:w-3/5"
          >
            <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
              <div className="max-w-md mx-auto">
                <div className="bg-primary/20 text-primary inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {t("secureLogin") || "تسجيل دخول آمن"}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("welcomeToEchoShop") || "مرحبًا بك في متجر إيكو"}
                </h2>
                
                <p className="text-lg text-gray-300 mb-6">
                  {t("loginBenefits") || "قم بتسجيل الدخول للوصول إلى حسابك ومتابعة طلباتك وتصفح المنتجات المخصصة لك واستكشاف عروضنا الحصرية."}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("trackOrders") || "تتبع طلباتك"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t("trackOrdersDescription") || "تابع طلباتك وتاريخ الشراء وإدارة المرتجعات بسهولة."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("saveItems") || "حفظ العناصر المفضلة"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t("saveItemsDescription") || "احفظ المنتجات المفضلة وقوائم الرغبات للتسوق بشكل أسرع."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {t("fasterCheckout") || "الدفع السريع"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t("fasterCheckoutDescription") || "احفظ بيانات الشحن والدفع لإتمام عمليات الشراء بشكل أسرع."}
                      </p>
                    </div>
                  </div>
                </div>
                
                {isRTL ? (
                  <div className="mt-8 text-gray-400 text-sm">
                    تسجيل الدخول كمسؤول: سيتم توجيهك تلقائياً إلى لوحة التحكم إذا كنت مسؤولاً.
                  </div>
                ) : (
                  <div className="mt-8 text-gray-400 text-sm">
                    Admin login: You'll be automatically redirected to the admin dashboard if you're an administrator.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}