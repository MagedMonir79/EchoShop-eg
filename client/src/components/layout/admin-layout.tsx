import { useContext, useState } from "react";
import { Link, useLocation } from "wouter";
import { LanguageContext } from "@/context/language-context";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  ShoppingCart,
  Truck,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Bell,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center space-x-2 rtl:space-x-reverse p-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
          active && "bg-primary/10 text-primary dark:bg-primary/20"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </a>
    </Link>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { t, language } = useContext(LanguageContext);
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isRTL = language === "ar";
  
  const sidebarItems = [
    { 
      icon: LayoutDashboard, 
      label: t("dashboard"), 
      href: "/admin/dashboard",
      active: location === "/admin/dashboard"
    },
    { 
      icon: Package, 
      label: t("products"), 
      href: "/admin/products",
      active: location === "/admin/products"
    },
    { 
      icon: Tags, 
      label: t("categories"), 
      href: "/admin/categories",
      active: location === "/admin/categories"
    },
    { 
      icon: ShoppingCart, 
      label: t("orders"), 
      href: "/admin/orders",
      active: location === "/admin/orders"
    },
    { 
      icon: Users, 
      label: t("users"), 
      href: "/admin/users",
      active: location === "/admin/users"
    },
    { 
      icon: Truck, 
      label: t("suppliers"), 
      href: "/admin/suppliers",
      active: location === "/admin/suppliers"
    },
    { 
      icon: BarChart, 
      label: t("analytics"), 
      href: "/admin/analytics",
      active: location === "/admin/analytics"
    },
    { 
      icon: Settings, 
      label: t("settings"), 
      href: "/admin/settings",
      active: location === "/admin/settings"
    },
  ];
  
  return (
    <div className={`min-h-screen flex ${isRTL ? "flex-row-reverse" : "flex-row"} bg-gray-50 dark:bg-gray-900`}>
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 fixed inset-y-0 z-30 transition-transform duration-300 lg:translate-x-0 lg:relative",
          mobileMenuOpen ? "translate-x-0" : isRTL ? "translate-x-64" : "-translate-x-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <Link href="/admin/dashboard">
              <a className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-black font-bold">E</span>
                </div>
                <span className="text-xl font-bold">EchoShop</span>
              </a>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 overflow-auto p-3 space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={item.active}
              />
            ))}
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" 
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("adminUser")}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@echoshop.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">{t("adminPanel")}</h1>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full" />
              </Button>
              
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      </main>
    </div>
  );
}