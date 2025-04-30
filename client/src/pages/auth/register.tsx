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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
  User,
  Mail,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Check,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schema
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل")
    .max(30, "اسم المستخدم يجب أن لا يتجاوز 30 حرفاً")
    .regex(/^[a-zA-Z0-9_]+$/, "اسم المستخدم يجب أن يحتوي على أحرف وأرقام وشرطات سفلية فقط"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .refine(
      password => /[A-Z]/.test(password),
      "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل"
    )
    .refine(
      password => /[0-9]/.test(password),
      "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"
    ),
  confirmPassword: z.string(),
  firstName: z.string().min(2, "الاسم الأول مطلوب").max(50, "الاسم الأول طويل جداً"),
  lastName: z.string().min(2, "الاسم الأخير مطلوب").max(50, "الاسم الأخير طويل جداً"),
  agreeTerms: z.literal(true, {
    errorMap: () => ({
      message: "يجب أن توافق على الشروط والأحكام",
    }),
  }),
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  }
);

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { language, t } = useContext(LanguageContext);
  const { user, register: registerUser } = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const isRTL = language === "ar";
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  
  // If user is already logged in, redirect to home
  if (user) {
    navigate("/");
    return null;
  }
  
  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      agreeTerms: false,
    },
  });
  
  // Password requirements check
  const password = form.watch("password");
  const passwordRequirements = [
    { text: "8 أحرف على الأقل", valid: password.length >= 8 },
    { text: "حرف كبير واحد على الأقل", valid: /[A-Z]/.test(password) },
    { text: "رقم واحد على الأقل", valid: /[0-9]/.test(password) },
  ];
  
  // Handle form submission
  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setRegisterError(null);
    
    try {
      // Call register function from AuthContext
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      
      // Show success toast
      toast({
        title: t("registrationSuccessful"),
        description: t("accountCreatedSuccessfully"),
        variant: "success",
      });
      
      // Redirect to login page
      navigate("/auth/login");
      
    } catch (error: any) {
      setRegisterError(error.message || "فشل التسجيل. يرجى المحاولة مرة أخرى.");
      toast({
        title: t("registrationFailed"),
        description: error.message || t("anErrorOccurred"),
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-3/5"
          >
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("createAccount") || "إنشاء حساب جديد"}
                </CardTitle>
                <CardDescription>
                  {t("registerDescription") || "أنشئ حسابك للوصول إلى جميع ميزات المتجر"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {registerError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("registrationFailed") || "فشل التسجيل"}</AlertTitle>
                    <AlertDescription>{registerError}</AlertDescription>
                  </Alert>
                )}
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("firstName") || "الاسم الأول"}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("enterFirstName") || "أدخل الاسم الأول"}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("lastName") || "الاسم الأخير"}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("enterLastName") || "أدخل الاسم الأخير"}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("username") || "اسم المستخدم"}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                className="pl-10"
                                placeholder={t("enterUsername") || "أدخل اسم المستخدم"}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            {t("usernameDescription") || "سيتم استخدام اسم المستخدم لتسجيل الدخول والتعرف عليك في المنصة"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("email") || "البريد الإلكتروني"}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type="email"
                                className="pl-10"
                                placeholder={t("enterEmail") || "أدخل البريد الإلكتروني"}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            
                            {/* Password requirements */}
                            <div className="mt-2 space-y-1">
                              {passwordRequirements.map((req, index) => (
                                <div
                                  key={index}
                                  className={`text-xs flex items-center ${
                                    req.valid ? "text-green-500" : "text-gray-400"
                                  }`}
                                >
                                  {req.valid ? (
                                    <Check className="h-3 w-3 mr-1" />
                                  ) : (
                                    <X className="h-3 w-3 mr-1" />
                                  )}
                                  {req.text}
                                </div>
                              ))}
                            </div>
                            
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("confirmPassword") || "تأكيد كلمة المرور"}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type={showConfirmPassword ? "text" : "password"}
                                  className="pl-10 pr-10"
                                  placeholder={t("confirmYourPassword") || "أكد كلمة المرور"}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                >
                                  {showConfirmPassword ? (
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
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0 rtl:space-x-reverse">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {t("agreeToTerms") || "أوافق على"}{" "}
                              <Link href="/terms" className="text-primary hover:underline">
                                {t("termsAndConditions") || "الشروط والأحكام"}
                              </Link>{" "}
                              {t("and") || "و"}{" "}
                              <Link href="/privacy" className="text-primary hover:underline">
                                {t("privacyPolicy") || "سياسة الخصوصية"}
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
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
                          {t("creatingAccount") || "جاري إنشاء الحساب..."}
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          {t("createAccount") || "إنشاء حساب"}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Separator />
                <div className="text-center w-full">
                  <p className="text-sm text-muted-foreground">
                    {t("alreadyHaveAccount") || "لديك حساب بالفعل؟"}{" "}
                    <Link href="/auth/login" className="text-primary hover:underline">
                      {t("loginHere") || "تسجيل الدخول"}
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Right Column - Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-2/5"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {t("benefitsOfJoining") || "مزايا الانضمام إلى متجر إيكو"}
                </h2>
                
                <ul className="space-y-6">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{t("exclusiveDeals") || "عروض حصرية"}</h3>
                      <p className="text-gray-400">
                        {t("exclusiveDealsDescription") || "الوصول إلى عروض وخصومات حصرية متاحة فقط للأعضاء المسجلين."}
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{t("fastCheckout") || "عملية شراء سريعة"}</h3>
                      <p className="text-gray-400">
                        {t("fastCheckoutDescription") || "اختصر وقت الشراء مع حفظ عناوين الشحن وتفاصيل الدفع للاستخدام السريع."}
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{t("orderTracking") || "تتبع الطلبات"}</h3>
                      <p className="text-gray-400">
                        {t("orderTrackingDescription") || "تتبع حالة طلباتك وتاريخ شرائك في أي وقت من حسابك الشخصي."}
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{t("wishlistFeature") || "قائمة المفضلة"}</h3>
                      <p className="text-gray-400">
                        {t("wishlistDescription") || "حفظ المنتجات المفضلة لديك في قائمة واحدة للرجوع إليها لاحقاً."}
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{t("becomeSeller") || "كن بائعاً"}</h3>
                      <p className="text-gray-400">
                        {t("becomeSellerDescription") || "بعد التسجيل، يمكنك التقدم للحصول على حساب بائع وبدء بيع منتجاتك على المنصة."}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}