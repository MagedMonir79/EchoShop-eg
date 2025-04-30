import { useContext, useState } from "react";
import { Link, useLocation } from "wouter";
import { LanguageContext } from "@/context/language-context";
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
import { ChevronLeft, ChevronRight, Mail, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const { language } = useContext(LanguageContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, values.email);
      
      // Show success message
      setIsSuccess(true);
      
      toast({
        title: language === "ar" ? "تم إرسال البريد الإلكتروني" : "Email Sent",
        description: language === "ar" 
          ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني." 
          : "Password reset email has been sent.",
      });
    } catch (error: any) {
      let errorMessage = language === "ar" 
        ? "حدث خطأ أثناء إرسال البريد الإلكتروني لإعادة تعيين كلمة المرور." 
        : "An error occurred while sending the password reset email.";
      
      // Customize error messages based on Firebase error codes
      if (error.code === "auth/user-not-found") {
        errorMessage = language === "ar" 
          ? "لم يتم العثور على حساب مرتبط بهذا البريد الإلكتروني." 
          : "No user found with this email.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = language === "ar" 
          ? "البريد الإلكتروني غير صالح." 
          : "Invalid email format.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = language === "ar" 
          ? "تم تجاوز عدد محاولات إعادة تعيين كلمة المرور. يرجى المحاولة لاحقًا." 
          : "Too many password reset attempts. Please try again later.";
      }
      
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary/80 flex items-center gap-1 mr-2"
              >
                {language === "ar" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                {language === "ar" ? "العودة إلى تسجيل الدخول" : "Back to Login"}
              </Button>
            </div>
            <LanguageSwitcher />
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-center text-light">
            {language === "ar" ? "استعادة كلمة المرور" : "Reset Password"}
          </h2>
          
          <p className="text-gray-400 text-center mb-6">
            {language === "ar" 
              ? "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور." 
              : "Enter your email and we'll send you a link to reset your password."}
          </p>
          
          {isSuccess ? (
            <div className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-md p-4 mb-6">
              <p className="text-green-800 dark:text-green-400 text-center">
                {language === "ar" 
                  ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك." 
                  : "Password reset email sent. Please check your inbox."}
              </p>
              <div className="flex justify-center mt-4">
                <Button 
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-primary"
                >
                  {language === "ar" ? "العودة إلى تسجيل الدخول" : "Return to Login"}
                  {language === "ar" ? <ChevronLeft className="ml-1 h-4 w-4" /> : <ArrowRight className="ml-1 h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light">{language === "ar" ? "البريد الإلكتروني" : "Email"}</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                          className="bg-darkBlue border-gray-700 text-light"
                          autoComplete="email"
                          {...field} 
                        />
                      </FormControl>
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
                    ? (language === "ar" ? "جاري الإرسال..." : "Sending...") 
                    : (language === "ar" ? "إرسال رابط إعادة التعيين" : "Send Reset Link")}
                </Button>
              </form>
            </Form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {language === "ar" ? "تذكرت كلمة المرور؟" : "Remember your password?"}{" "}
              <Link href="/login" className="text-blue-400 hover:underline">
                {language === "ar" ? "تسجيل الدخول" : "Sign In"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}