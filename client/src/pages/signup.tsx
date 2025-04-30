import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LanguageSwitcher from "@/components/ui/language-switcher";

// Password strength calculation
function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 25;
  else if (password.length >= 6) strength += 15;
  
  // Contains lowercase letters
  if (/[a-z]/.test(password)) strength += 20;
  
  // Contains uppercase letters
  if (/[A-Z]/.test(password)) strength += 20;
  
  // Contains numbers
  if (/[0-9]/.test(password)) strength += 20;
  
  // Contains special characters
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  
  return Math.min(100, strength);
}

function getPasswordStrengthText(strength: number, language: string): { text: string, color: string } {
  if (strength < 30) {
    return { 
      text: language === "ar" ? "ضعيفة جداً" : "Very Weak",
      color: "bg-red-500"
    };
  } else if (strength < 50) {
    return { 
      text: language === "ar" ? "ضعيفة" : "Weak",
      color: "bg-orange-500"
    };
  } else if (strength < 70) {
    return { 
      text: language === "ar" ? "متوسطة" : "Medium",
      color: "bg-yellow-500"
    };
  } else if (strength < 90) {
    return { 
      text: language === "ar" ? "قوية" : "Strong",
      color: "bg-green-500"
    };
  } else {
    return { 
      text: language === "ar" ? "قوية جداً" : "Very Strong",
      color: "bg-emerald-500"
    };
  }
}

// Form schema
const signupSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters"
  }),
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { t, language } = useContext(LanguageContext);
  const { register } = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  
  // Initialize form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });
  
  // Watch password field to calculate strength
  const password = form.watch("password");
  
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  // Form submission handler
  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      await register(values.email, values.password, values.username);
      
      setIsVerificationSent(true);
      
      toast({
        title: language === "ar" ? "تم إنشاء الحساب بنجاح" : "Account Created",
        description: language === "ar" 
          ? "تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك."
          : "Verification link has been sent to your email. Please check your inbox.",
      });
    } catch (error: any) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: error.message || (language === "ar" 
          ? "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى."
          : "Failed to create account. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get password strength info
  const strengthInfo = getPasswordStrengthText(passwordStrength, language);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-darkBlue to-mediumBlue p-4 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="w-full max-w-md">
        <div className="bg-mediumBlue rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/")}
                className="text-primary hover:text-primary/80 flex items-center gap-1 mr-2"
              >
                {language === "ar" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                {language === "ar" ? "عودة" : "Back"}
              </Button>
              <div className="text-2xl font-bold text-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>EchoShop</span>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-center text-light">{t("signupTitle")}</h2>
          
          {isVerificationSent ? (
            <div className="space-y-4">
              <Alert className="bg-green-900/30 border-green-600/30 text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle className="text-green-400">
                  {language === "ar" ? "تم إنشاء الحساب" : "Account Created"}
                </AlertTitle>
                <AlertDescription>
                  {language === "ar" 
                    ? "تم إرسال رابط التحقق إلى بريدك الإلكتروني. الرجاء التحقق من البريد الوارد وتأكيد عنوان بريدك الإلكتروني."
                    : "A verification link has been sent to your email. Please check your inbox and confirm your email address."}
                </AlertDescription>
              </Alert>
              
              <div className="text-center mt-6">
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-secondary hover:bg-blue-700"
                >
                  {language === "ar" ? "انتقل إلى صفحة تسجيل الدخول" : "Go to Login Page"}
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light">{t("username")}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={language === "ar" ? "اسم المستخدم" : "Username"} 
                          className="bg-darkBlue border-gray-700 text-light"
                          autoComplete="username"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light">{t("email")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"} 
                          className="bg-darkBlue border-gray-700 text-light"
                          autoComplete="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400 text-xs">
                        {language === "ar" 
                          ? "سنرسل رابط تأكيد إلى هذا العنوان" 
                          : "We'll send a verification link to this address"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light">{t("password")}</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••" 
                            className="bg-darkBlue border-gray-700 text-light pr-10"
                            autoComplete="new-password"
                            {...field} 
                          />
                        </FormControl>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-light focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      
                      {password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-300">
                              {language === "ar" ? "قوة كلمة المرور:" : "Password Strength:"}
                            </span>
                            <span className="text-gray-300">{strengthInfo.text}</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${strengthInfo.color}`} 
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light">{t("confirmPassword")}</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="••••••" 
                            className="bg-darkBlue border-gray-700 text-light pr-10"
                            autoComplete="new-password"
                            {...field} 
                          />
                        </FormControl>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-light focus:outline-none"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-secondary hover:bg-blue-700 mt-6"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (language === "ar" ? "جاري التسجيل..." : "Signing up...") 
                    : (language === "ar" ? "إنشاء حساب" : "Create Account")}
                </Button>
              </form>
            </Form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t("alreadyHaveAccount")}{" "}
              <Link href="/auth" className="text-blue-400 hover:underline">
                {t("login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
