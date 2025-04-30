import { useContext, useState, useRef, useEffect } from "react";
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
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import LanguageSwitcher from "@/components/ui/language-switcher";

// Form schema
const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, {
    message: "Username or email must be at least 3 characters"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { t, language } = useContext(LanguageContext);
  const { login, loginWithGoogle } = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lastTypedChar, setLastTypedChar] = useState<string | null>(null);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  // When user types in password field, briefly show the last character
  useEffect(() => {
    return () => {
      // Clean up timer on unmount
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  // Form submission handler
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      await login(values.usernameOrEmail, values.password);
      
      toast({
        title: t("success"),
        description: language === "ar" ? "تم تسجيل الدخول بنجاح." : "You have been logged in successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: error.message || (language === "ar" ? "فشل تسجيل الدخول. يرجى التحقق من بياناتك." : "Failed to log in. Please check your credentials."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    try {
      await loginWithGoogle();
      // Note: The actual navigation happens after the redirect in the AuthProvider
    } catch (error: any) {
      toast({
        title: t("error"),
        description: language === "ar" 
          ? "فشل تسجيل الدخول باستخدام جوجل. حاول مرة أخرى." 
          : "Failed to log in with Google. Please try again.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  // Handle password input to show the last character temporarily
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const lastChar = value[value.length - 1];
    
    // If user is deleting, don't show anything
    if (form.getValues("password").length >= value.length) {
      form.setValue("password", value);
      setLastTypedChar(null);
      return;
    }
    
    // Set the last character to be displayed
    setLastTypedChar(lastChar);
    
    // Clear any existing timer
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    
    // Set a timer to hide the character after 1 second
    timerId.current = setTimeout(() => {
      setLastTypedChar(null);
    }, 1000);
    
    // Update form value
    form.setValue("password", value);
  };

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
          
          <h2 className="text-2xl font-bold mb-4 text-center text-light">{t("loginTitle")}</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-light">{language === "ar" ? "اسم المستخدم أو البريد الإلكتروني" : "Username or Email"}</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder={language === "ar" ? "اسم المستخدم أو البريد الإلكتروني" : "Username or Email"}
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
                name="password"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-light">{language === "ar" ? "كلمة المرور" : "Password"}</FormLabel>
                      <Link href="/auth?tab=forgot-password" className="text-blue-400 text-sm hover:underline">
                        {language === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                      </Link>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••" 
                          className="bg-darkBlue border-gray-700 text-light pr-10"
                          autoComplete="current-password"
                          onChange={handlePasswordChange}
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
                    {lastTypedChar && (
                      <div className="text-xs text-gray-300 mt-1 animate-fadeOut">
                        {language === "ar" ? "آخر حرف: " : "Last character: "}{lastTypedChar}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-blue-700 text-white font-bold"
                disabled={isLoading}
              >
                {isLoading 
                  ? (language === "ar" ? "جاري التحميل..." : "Loading...") 
                  : (language === "ar" ? "تسجيل الدخول" : "Login")}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-mediumBlue px-2 text-gray-400">
                  {language === "ar" ? "أو المتابعة باستخدام" : "OR CONTINUE WITH"}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-darkBlue border-gray-700 hover:bg-slate-800 text-white"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                <FcGoogle className={`${language === "ar" ? "ml-2" : "mr-2"} h-5 w-5`} />
                {isGoogleLoading 
                  ? (language === "ar" ? "جاري التحميل..." : "Loading...") 
                  : (language === "ar" ? "تسجيل باستخدام جوجل" : "Sign in with Google")}
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
              <Link href="/auth?tab=register" className="text-blue-400 hover:underline">
                {language === "ar" ? "إنشاء حساب جديد" : "Create Account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
