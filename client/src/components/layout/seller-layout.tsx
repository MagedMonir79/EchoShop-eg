import { useContext, useState } from "react";
import { Link, useLocation } from "wouter";
import { AuthContext } from "@/context/auth-context";
import { LanguageContext } from "@/context/language-context";
import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  ShoppingBag, 
  Package,
  Users,
  Settings,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
  TrendingUp,
  Bell,
  Search,
  MessageCircle,
  HelpCircle,
  BarChart3,
  Truck,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@/components/ui/user-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  const { language, t } = useContext(LanguageContext);
  const isRTL = language === "ar";
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Since toggleLanguage might not be available in the context, we'll implement our own
  const handleToggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    localStorage.setItem("language", newLang);
    window.location.reload();
  };

  // Navigation items
  const navItems = [
    {
      title: isRTL ? "لوحة التحكم" : "Dashboard",
      href: "/seller/dashboard",
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      title: isRTL ? "المنتجات" : "Products",
      href: "/seller/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: isRTL ? "الطلبات" : "Orders",
      href: "/seller/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      badge: "5",
    },
    {
      title: isRTL ? "العملاء" : "Customers",
      href: "/seller/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: isRTL ? "التحليلات" : "Analytics",
      href: "/seller/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: isRTL ? "التسويق" : "Marketing",
      href: "/seller/marketing",
      icon: <Percent className="h-5 w-5" />,
    },
    {
      title: isRTL ? "الشحن" : "Shipping",
      href: "/seller/shipping",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: isRTL ? "الإعدادات" : "Settings",
      href: "/seller/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className={`flex min-h-screen bg-darkBlue ${isRTL ? "rtl" : ""}`}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col bg-mediumBlue border-r border-gray-700 w-56 p-4">
        <div className="flex items-center gap-2 px-2 py-3 mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-sm w-8 h-8 flex items-center justify-center text-black font-bold text-xl">E</div>
            <span className="font-bold text-lg">EchoShop</span>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                location === item.href
                  ? "bg-darkBlue text-white"
                  : "text-gray-400 hover:text-white hover:bg-darkBlue"
              } transition-colors`}
            >
              {item.icon}
              <span>{item.title}</span>
              {item.badge && (
                <Badge className="ml-auto bg-primary text-black">{item.badge}</Badge>
              )}
            </Link>
          ))}
        </nav>
        
        <div className="pt-4 mt-6 border-t border-gray-700">
          <div className="px-3 py-2">
            <div className="text-xs text-gray-500 mb-2">{isRTL ? "مركز المساعدة" : "Help Center"}</div>
            <Link
              href="/seller/help"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-darkBlue transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
              <span>{isRTL ? "الدعم والمساعدة" : "Support & Help"}</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet component) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="bg-mediumBlue border-gray-700 p-0">
          <SheetHeader className="p-4 border-b border-gray-700">
            <SheetTitle>
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="bg-primary rounded-sm w-8 h-8 flex items-center justify-center text-black font-bold text-xl">E</div>
                <span className="font-bold text-lg">EchoShop</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          
          <div className="py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    location === item.href
                      ? "bg-darkBlue text-white"
                      : "text-gray-400 hover:text-white hover:bg-darkBlue"
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-primary text-black">{item.badge}</Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="px-4 pt-4 mt-4 border-t border-gray-700">
            <div className="px-2 py-2">
              <div className="text-xs text-gray-500 mb-2">{isRTL ? "مركز المساعدة" : "Help Center"}</div>
              <Link
                href="/seller/help"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-darkBlue transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HelpCircle className="h-5 w-5" />
                <span>{isRTL ? "الدعم والمساعدة" : "Support & Help"}</span>
              </Link>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <Separator className="mb-4 bg-gray-700" />
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <Button variant="outline" size="icon" onClick={handleToggleLanguage}>
                <span className="font-bold text-sm">{language === "ar" ? "EN" : "AR"}</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-gray-700 bg-mediumBlue">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              
              {/* Search bar */}
              <div className="relative hidden md:block w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={isRTL ? "البحث..." : "Search..."}
                  className="pl-9 bg-darkBlue/50 border-gray-700"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Language toggle */}
              <Button variant="ghost" size="sm" onClick={handleToggleLanguage} className="hidden md:flex">
                <span className="font-bold text-sm">{language === "ar" ? "English" : "العربية"}</span>
              </Button>
              
              {/* Theme toggle */}
              <ThemeToggle className="hidden md:flex" />
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
              </Button>
              
              {/* Messages */}
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
              </Button>
              
              {/* User menu */}
              <UserButton />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}