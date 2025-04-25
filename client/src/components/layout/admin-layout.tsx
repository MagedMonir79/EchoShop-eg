import { useContext } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Palette, PlusCircle, BarChart3 } from "lucide-react";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { language, t } = useContext(LanguageContext);
  const { logout } = useContext(AuthContext);
  const { toast } = useToast();
  const [location] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t("success"),
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { name: "dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "products", href: "/admin/products", icon: <ShoppingBag className="h-5 w-5" /> },
    { name: "orders", href: "/admin/orders", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "customers", href: "/admin/customers", icon: <Users className="h-5 w-5" /> },
    { name: "themeSettings", href: "/admin/theme-settings", icon: <Palette className="h-5 w-5" /> },
    { name: "addProduct", href: "/admin/add-product", icon: <PlusCircle className="h-5 w-5" /> },
    { name: "settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-darkBlue to-mediumBlue ${language === "ar" ? "rtl" : "ltr"}`}>
      {/* Sidebar */}
      <div className="w-64 bg-darkBlue shadow-lg hidden md:block">
        <div className="p-4">
          <Link href="/">
            <a className="text-2xl font-bold text-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              EchoShop
            </a>
          </Link>
        </div>
        <div className="mt-6">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <a 
                className={`flex items-center gap-3 px-6 py-3 hover:bg-blue-900 ${
                  location === item.href ? "bg-blue-900 border-r-4 border-primary" : ""
                }`}
              >
                {item.icon}
                <span>{t(item.name)}</span>
              </a>
            </Link>
          ))}
          <Button 
            variant="ghost" 
            className="flex items-center gap-3 px-6 py-3 w-full justify-start hover:bg-red-900 rounded-none"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>{t("logout")}</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-mediumBlue shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/">
                <a className="bg-primary text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-lime-500 transition-colors duration-300">
                  {t("backToSite")}
                </a>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
