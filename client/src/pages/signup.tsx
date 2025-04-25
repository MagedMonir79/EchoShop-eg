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
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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

  // Initialize form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      await register(values.email, values.password, values.username);
      
      toast({
        title: t("success"),
        description: "Your account has been created successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || "Failed to create account. Please try again.",
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
          
          <h2 className="text-2xl font-bold mb-6 text-center">{t("signupTitle")}</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("username")}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t("username")} 
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
                    <FormLabel>{t("password")}</FormLabel>
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
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmPassword")}</FormLabel>
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
                className="w-full bg-secondary hover:bg-blue-700 mt-6"
                disabled={isLoading}
              >
                {isLoading ? t("loading") : t("createAccount")}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t("alreadyHaveAccount")}{" "}
              <Link href="/login">
                <a className="text-blue-400 hover:underline">{t("login")}</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
