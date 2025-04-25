import { useContext, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/ui/language-switcher";

// Form schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { t, language } = useContext(LanguageContext);
  const { login } = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      await login(values.email, values.password);
      
      toast({
        title: t("success"),
        description: "You have been logged in successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || "Failed to log in. Please check your credentials.",
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
            <Link href="/">
              <a className="text-2xl font-bold text-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                EchoShop
              </a>
            </Link>
            <LanguageSwitcher />
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-center">{t("loginTitle")}</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        className="bg-darkBlue border-gray-700"
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
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>{t("password")}</FormLabel>
                      <Link href="/forgot-password">
                        <a className="text-sm text-blue-400 hover:underline">{t("forgotPassword")}</a>
                      </Link>
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••" 
                        className="bg-darkBlue border-gray-700"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? t("loading") : t("login")}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t("dontHaveAccount")}{" "}
              <Link href="/signup">
                <a className="text-blue-400 hover:underline">{t("createAccount")}</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
