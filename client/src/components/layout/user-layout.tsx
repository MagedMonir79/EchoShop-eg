import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";
import {
  User,
  ShoppingCart,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  ChevronLeft,
  Home,
  LayoutDashboard,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserLayoutProps {
  children: React.ReactNode;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

// Sidebar item component with animations
const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active, badge }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link 
        href={href}
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-lg transition-colors mb-1",
          active 
            ? "bg-primary/10 text-primary dark:bg-primary/20" 
            : "hover:bg-darkBlue"
        )}
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-3" />
          <span>{label}</span>
        </div>
        {badge !== undefined && badge > 0 && (
          <Badge className="bg-primary text-black">{badge}</Badge>
        )}
      </Link>
    </motion.div>
  );
};

export default function UserLayout({ children }: UserLayoutProps) {
  const { t, language } = useContext(LanguageContext);
  const { user, userData, logout } = useContext(AuthContext);
  const { toast } = useToast();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  const isRTL = language === "ar";
  
  // Close sidebar on mobile when location changes
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [location]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t("success"),
        description: t("loggedOut"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: t("logoutFailed"),
        variant: "destructive",
      });
    }
  };
  
  // Sidebar items
  const sidebarItems = [
    { 
      icon: LayoutDashboard, 
      label: t("dashboard"), 
      href: "/user/dashboard",
      active: location === "/user/dashboard",
      badge: 0,
    },
    { 
      icon: ShoppingCart, 
      label: t("myOrders"), 
      href: "/user/orders",
      active: location === "/user/orders" || location.startsWith("/user/orders/"),
      badge: 3,
    },
    { 
      icon: Heart, 
      label: t("wishlist"), 
      href: "/user/wishlist",
      active: location === "/user/wishlist",
      badge: 8,
    },
    { 
      icon: MapPin, 
      label: t("addresses"), 
      href: "/user/addresses",
      active: location === "/user/addresses",
      badge: 0,
    },
    { 
      icon: CreditCard, 
      label: t("paymentMethods"), 
      href: "/user/payment-methods",
      active: location === "/user/payment-methods",
      badge: 0,
    },
    { 
      icon: Package, 
      label: isRTL ? "سجل كبائع" : "Become a Seller", 
      href: "/seller/register",
      active: location === "/seller/register" || location.startsWith("/seller/"),
      badge: 0,
    },
    { 
      icon: User, 
      label: t("profile"), 
      href: "/user/profile",
      active: location === "/user/profile",
      badge: 0,
    },
    { 
      icon: Settings, 
      label: t("settings"), 
      href: "/user/settings",
      active: location === "/user/settings",
      badge: 0,
    },
  ];
  
  // Animation variants for the sidebar
  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  // Animation variants for the main content
  const mainContentVariants = {
    expanded: { marginLeft: isRTL ? 0 : 280, marginRight: isRTL ? 280 : 0 },
    collapsed: { marginLeft: isRTL ? 0 : 80, marginRight: isRTL ? 80 : 0 },
  };
  
  return (
    <div className={`min-h-screen flex ${isRTL ? "flex-row-reverse" : "flex-row"} bg-gray-50 dark:bg-gray-900`}>
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside 
        variants={!isMobile ? sidebarVariants : {}}
        initial={false}
        animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "bg-mediumBlue border-r dark:border-gray-700 fixed inset-y-0 z-30 transition-all duration-300 lg:relative",
          isRTL ? "right-0" : "left-0",
          mobileMenuOpen 
            ? "translate-x-0 rtl:-translate-x-0" 
            : isRTL 
              ? "translate-x-full lg:translate-x-0" 
              : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <motion.div 
            layout 
            className="p-4 border-b dark:border-gray-700 flex items-center justify-between"
          >
            <Link 
              href="/" 
              className={`flex items-center ${isCollapsed && !isMobile ? "justify-center" : ""}`}
            >
              <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center">
                <span className="text-black font-bold">E</span>
              </div>
              {(!isCollapsed || isMobile) && (
                <span className="text-xl font-bold mr-2 rtl:ml-2 rtl:mr-0">
                  {t("userDashboard")}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2">
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex"
                >
                  {isRTL ? (
                    isCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
                  ) : (
                    isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          
          {/* User Info */}
          <div className={`p-4 border-b dark:border-gray-700 ${isCollapsed && !isMobile ? "items-center" : ""}`}>
            <div className={`flex ${isCollapsed && !isMobile ? "justify-center" : "items-center"}`}>
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <img 
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${userData?.username || user?.displayName || "User"}&background=a3e635&color=000&size=200`}
                  alt={userData?.username || user?.displayName || t("user")}
                  className="h-full w-full object-cover"
                />
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="mr-3 rtl:ml-3 rtl:mr-0">
                  <p className="font-medium">{userData?.username || user?.displayName || t("user")}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <SidebarItem
              icon={Home}
              label={t("mainStore")}
              href="/"
              active={location === "/"}
            />
            
            {sidebarItems.map((item, index) => 
              (!isCollapsed || isMobile) ? (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={item.active}
                  badge={item.badge}
                />
              ) : (
                <motion.div
                  key={index}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-lg transition-colors mb-1",
                      item.active 
                        ? "bg-primary/10 text-primary dark:bg-primary/20" 
                        : "hover:bg-darkBlue"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.badge > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full" />
                    )}
                  </Link>
                  <div className={`absolute ${isRTL ? 'right-full mr-2' : 'left-full ml-2'} top-0 z-50 w-48 hidden group-hover:block`}>
                    <div className="py-1 px-2 bg-gray-800 rounded-md shadow-lg">
                      <div className="text-sm">{item.label}</div>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-3 border-t dark:border-gray-700">
            <Button 
              variant="destructive" 
              className={cn(
                "w-full gap-2", 
                isCollapsed && !isMobile ? "justify-center px-0" : ""
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {(!isCollapsed || isMobile) && t("logout")}
            </Button>
          </div>
        </div>
      </motion.aside>
      
      {/* Main Content */}
      <motion.main 
        variants={!isMobile ? mainContentVariants : {}}
        initial={false}
        animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* Navbar */}
        <header className="bg-mediumBlue border-b dark:border-gray-700 py-3 px-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link 
                href="/user/dashboard"
                className="lg:hidden flex items-center"
              >
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center mr-2">
                  <span className="text-black font-bold">E</span>
                </div>
                <span className="font-semibold">{t("userDashboard")}</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                asChild
              >
                <Link href="/user/notifications" className="flex items-center">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full" />
                </Link>
              </Button>
              
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      </motion.main>
    </div>
  );
}