import { ReactNode, useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, PackageSearch, Users, ShoppingCart, 
  Settings, ChevronLeft, ChevronRight, Bell, Search,
  PackagePlus, Store, TruckIcon, BarChart4, ShieldCheck,
  AlertTriangle, PercentCircle, Layers
} from "lucide-react";
import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton } from "@/components/ui/user-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  title: string;
  titleAr: string;
  icon: ReactNode;
  href: string;
  badgeCount?: number;
  submenu?: { 
    title: string; 
    titleAr: string; 
    href: string;
    badgeCount?: number;
  }[];
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { t, language } = useContext(LanguageContext);
  const [location] = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { toast } = useToast();
  const isRtl = language === "ar";
  
  // إعداد عناصر القائمة الجانبية
  const sidebarItems: SidebarItem[] = useMemo(() => [
    { 
      title: "Dashboard", 
      titleAr: "لوحة التحكم", 
      icon: <LayoutDashboard size={20} />, 
      href: "/admin" 
    },
    { 
      title: "Orders", 
      titleAr: "الطلبات", 
      icon: <ShoppingCart size={20} />, 
      href: "/admin/orders", 
      badgeCount: 12 
    },
    { 
      title: "Products", 
      titleAr: "المنتجات", 
      icon: <PackageSearch size={20} />, 
      href: "/admin/products",
      submenu: [
        { title: "All Products", titleAr: "جميع المنتجات", href: "/admin/products" },
        { title: "Add Product", titleAr: "إضافة منتج", href: "/admin/products/add" },
        { title: "Categories", titleAr: "التصنيفات", href: "/admin/products/categories" }
      ]
    },
    { 
      title: "Users", 
      titleAr: "المستخدمين", 
      icon: <Users size={20} />, 
      href: "/admin/users",
      submenu: [
        { title: "Customers", titleAr: "العملاء", href: "/admin/users/customers" },
        { title: "Admins", titleAr: "المشرفين", href: "/admin/users/admins" }
      ]
    },
    { 
      title: "Sellers", 
      titleAr: "البائعين", 
      icon: <Store size={20} />, 
      href: "/admin/sellers",
      badgeCount: 3,
      submenu: [
        { title: "All Sellers", titleAr: "جميع البائعين", href: "/admin/sellers" },
        { title: "Pending Approvals", titleAr: "في انتظار الموافقة", href: "/admin/sellers/pending", badgeCount: 3 }
      ]
    },
    { 
      title: "Packaging", 
      titleAr: "التغليف", 
      icon: <PackagePlus size={20} />, 
      href: "/admin/packaging",
      submenu: [
        { title: "QR Codes", titleAr: "رموز QR", href: "/admin/packaging/qr-codes" },
        { title: "Templates", titleAr: "قوالب التغليف", href: "/admin/packaging/templates" },
        { title: "Quality Metrics", titleAr: "مقاييس الجودة", href: "/admin/packaging/metrics" },
        { title: "Incidents", titleAr: "الحوادث", href: "/admin/packaging/incidents", badgeCount: 2 }
      ]
    },
    { 
      title: "Shipping", 
      titleAr: "الشحن", 
      icon: <TruckIcon size={20} />, 
      href: "/admin/shipping",
      submenu: [
        { title: "Companies", titleAr: "شركات الشحن", href: "/admin/shipping/companies" },
        { title: "Zones", titleAr: "مناطق الشحن", href: "/admin/shipping/zones" }
      ]
    },
    { 
      title: "Analytics", 
      titleAr: "التحليلات", 
      icon: <BarChart4 size={20} />, 
      href: "/admin/analytics" 
    },
    { 
      title: "Security", 
      titleAr: "الأمان", 
      icon: <ShieldCheck size={20} />, 
      href: "/admin/security" 
    },
    { 
      title: "Marketing", 
      titleAr: "التسويق", 
      icon: <PercentCircle size={20} />, 
      href: "/admin/marketing",
      submenu: [
        { title: "Promotions", titleAr: "العروض", href: "/admin/marketing/promotions" },
        { title: "Loyalty Program", titleAr: "برنامج الولاء", href: "/admin/marketing/loyalty" }
      ]
    },
    { 
      title: "System", 
      titleAr: "النظام", 
      icon: <Layers size={20} />, 
      href: "/admin/system",
      submenu: [
        { title: "Logs", titleAr: "السجلات", href: "/admin/system/logs" },
        { title: "Backups", titleAr: "النسخ الاحتياطية", href: "/admin/system/backups" }
      ]
    },
    { 
      title: "Settings", 
      titleAr: "الإعدادات", 
      icon: <Settings size={20} />, 
      href: "/admin/settings" 
    },
  ], [language]);

  // التعامل مع النقر على عنصر القائمة
  const handleItemClick = (item: SidebarItem) => {
    if (item.submenu) {
      setOpenSubmenu(openSubmenu === item.title ? null : item.title);
    } else {
      setOpenSubmenu(null);
    }
  };

  // هل العنصر المحدد نشط؟
  const isActive = (href: string) => {
    return location === href || location.startsWith(href + "/");
  };

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* شريط التنقل العلوي */}
      <header className="sticky top-0 z-50 w-full h-16 bg-secondary flex items-center px-4 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              {isExpanded ? <ChevronLeft /> : <ChevronRight />}
            </Button>
            <h1 className="text-xl font-bold text-primary">
              {isExpanded ? "EchoShop Admin" : "ES"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder={t("searchEverything")}
                className="pl-9 bg-background/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-medium">
                  <p>{t("notifications")}</p>
                </div>
                <div className="p-4 text-center text-muted-foreground">
                  <p>{t("noNewNotifications")}</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <UserButton />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* القائمة الجانبية */}
        <aside 
          className={`fixed lg:static inset-y-0 pt-16 lg:pt-0 h-full bg-secondary border-r border-border transition-all ${
            isExpanded ? "w-64" : "w-[70px]"
          } ${isRtl ? 'right-0' : 'left-0'}`}
        >
          <nav className="flex flex-col h-[calc(100%-60px)] p-3 overflow-y-auto">
            {sidebarItems.map((item) => (
              <div key={item.title} className="mb-1">
                <div 
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    isActive(item.href) ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="mr-2">{item.icon}</div>
                  
                  {isExpanded && (
                    <>
                      <span className="flex-1 truncate">
                        {language === "ar" ? item.titleAr : item.title}
                      </span>
                      
                      {item.badgeCount && (
                        <Badge variant="secondary" className="ml-2">{item.badgeCount}</Badge>
                      )}
                      
                      {item.submenu && (
                        <ChevronRight 
                          size={16} 
                          className={`transition-transform ${openSubmenu === item.title ? "transform rotate-90" : ""}`} 
                        />
                      )}
                    </>
                  )}
                </div>
                
                {isExpanded && item.submenu && openSubmenu === item.title && (
                  <div className="pr-4">
                    {item.submenu.map((subitem) => (
                      <Link key={subitem.href} href={subitem.href}>
                        <a 
                          className={`flex items-center p-2 pl-10 rounded-md mb-1 ${
                            isActive(subitem.href) ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <span className="flex-1 truncate">
                            {language === "ar" ? subitem.titleAr : subitem.title}
                          </span>
                          {subitem.badgeCount && (
                            <Badge variant="secondary" className="ml-2">{subitem.badgeCount}</Badge>
                          )}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          <div className="absolute bottom-0 left-0 w-full p-3 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <div className="flex items-center">
                  <ChevronLeft className="mr-2" size={16} />
                  <span>{t("collapse")}</span>
                </div>
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>
          </div>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-4 md:p-6 mt-2">
          {children}
        </main>
      </div>
    </div>
  );
}