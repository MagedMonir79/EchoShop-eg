import { useContext, useState } from "react";
import { Link, useLocation } from "wouter";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { 
  User, 
  Home, 
  Package, 
  ShoppingCart, 
  Heart, 
  Bell, 
  Settings, 
  CreditCard,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const { language, t } = useContext(LanguageContext);
  const { user, logout } = useContext(AuthContext);
  const { toast } = useToast();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isRTL = language === "ar";
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t("success"),
        description: isRTL ? "تم تسجيل الخروج بنجاح" : "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: isRTL ? "فشل تسجيل الخروج. يرجى المحاولة مرة أخرى." : "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      name: isRTL ? "لوحة التحكم" : "Dashboard",
      icon: <Home className="w-5 h-5" />,
      href: "/user/dashboard",
    },
    {
      name: isRTL ? "الطلبات" : "Orders",
      icon: <Package className="w-5 h-5" />,
      href: "/user/orders",
    },
    {
      name: isRTL ? "المفضلة" : "Wishlist",
      icon: <Heart className="w-5 h-5" />,
      href: "/user/wishlist",
    },
    {
      name: isRTL ? "عربة التسوق" : "Cart",
      icon: <ShoppingCart className="w-5 h-5" />,
      href: "/cart",
    },
    {
      name: isRTL ? "نقاط الولاء" : "Loyalty Points",
      icon: <Award className="w-5 h-5" />,
      href: "/user/loyalty",
    },
    {
      name: isRTL ? "المدفوعات" : "Payments",
      icon: <CreditCard className="w-5 h-5" />,
      href: "/user/payments",
    },
    {
      name: isRTL ? "الإشعارات" : "Notifications",
      icon: <Bell className="w-5 h-5" />,
      href: "/user/notifications",
    },
    {
      name: isRTL ? "الإعدادات" : "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/user/settings",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 dark:from-darkBlue dark:to-gray-900 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-darkBlue shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">EchoShop</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <img
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`}
                      alt={user?.displayName || "User"}
                      className="h-8 w-8 rounded-full border-2 border-primary"
                    />
                    <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {user?.displayName}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isRTL ? "تسجيل الخروج" : "Logout"}
              </Button>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar for desktop */}
        <AnimatePresence>
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block bg-white dark:bg-darkBlue w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800"
          >
            <div className="h-full flex flex-col">
              <div className="flex-grow py-4 px-2">
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <motion.div
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: "rgba(59, 130, 246, 0.1)" 
                          }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                            isActive 
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className={`${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                            {item.icon}
                          </div>
                          <span className="ml-3 font-medium text-sm">{item.name}</span>
                          {isActive && (
                            <div className={`ml-auto ${isRTL ? "mr-auto ml-0" : ""}`}>
                              <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800/30"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isRTL ? "تسجيل الخروج" : "Logout"}
                </Button>
              </div>
            </div>
          </motion.aside>
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 md:hidden"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
              <motion.nav
                initial={{ x: isRTL ? "100%" : "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: isRTL ? "100%" : "-100%" }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="fixed top-0 bottom-0 left-0 w-full max-w-xs bg-white dark:bg-darkBlue p-4 overflow-y-auto flex flex-col"
                style={{ [isRTL ? "right" : "left"]: 0 }}
              >
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex-shrink-0 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">EchoShop</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMobileMenu}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="mt-6 flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`}
                      alt={user?.displayName || "User"}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">{user?.displayName}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</div>
                  </div>
                </div>

                <div className="mt-6 flex-1">
                  <div className="space-y-1 px-2">
                    {menuItems.map((item) => {
                      const isActive = location === item.href;
                      return (
                        <Link key={item.name} href={item.href}>
                          <motion.div
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center px-3 py-3 rounded-md cursor-pointer ${
                              isActive 
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                            onClick={toggleMobileMenu}
                          >
                            <div className={`${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                              {item.icon}
                            </div>
                            <span className="ml-3 font-medium">{item.name}</span>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800/30"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isRTL ? "تسجيل الخروج" : "Logout"}
                  </Button>
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}