import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useTranslation } from '@/hooks/use-translation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import {
  ArrowLeftRight,
  BellIcon,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShoppingBag,
  ShoppingCart,
  Sun,
  User,
  Users,
  Settings,
  Package,
  Truck,
  CreditCard,
  PaintBucket,
  GalleryHorizontalEnd,
  Palette,
  SlidersHorizontal,
} from 'lucide-react';
import { useTheme } from 'next-themes';

// props
interface AdminSupabaseLayoutProps {
  children: React.ReactNode;
}

// قائمة عناصر القائمة الجانبية
const menuItems = [
  {
    title: 'لوحة التحكم',
    path: '/admin',
    icon: <LayoutDashboard className="h-4 w-4" />,
    isActive: (path: string) => path === '/admin',
  },
  {
    title: 'المنتجات',
    path: '/admin/products',
    icon: <ShoppingBag className="h-4 w-4" />,
    isActive: (path: string) => path.includes('/admin/products'),
    submenu: [
      {
        title: 'كل المنتجات',
        path: '/admin/products',
        icon: <Package className="h-4 w-4" />,
      },
      {
        title: 'إضافة منتج (Firebase)',
        path: '/admin/products/add',
        icon: <PaintBucket className="h-4 w-4" />,
      },
      {
        title: 'إضافة منتج (Supabase)',
        path: '/admin/products/add-supabase',
        icon: <GalleryHorizontalEnd className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'الفئات',
    path: '/admin/categories/supabase',
    icon: <GalleryHorizontalEnd className="h-4 w-4" />,
    isActive: (path: string) => path.includes('/admin/categories'),
  },
  {
    title: 'الطلبات',
    path: '/admin/orders',
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    title: 'العملاء',
    path: '/admin/customers',
    icon: <User className="h-4 w-4" />,
  },
  {
    title: 'البائعين',
    path: '/admin/sellers',
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: 'الإعدادات',
    path: '/admin/settings/general',
    icon: <Settings className="h-4 w-4" />,
    submenu: [
      {
        title: 'عام',
        path: '/admin/settings/general',
        icon: <SlidersHorizontal className="h-4 w-4" />,
      },
      {
        title: 'السمات',
        path: '/admin/settings/theme',
        icon: <Palette className="h-4 w-4" />,
      },
      {
        title: 'الدفع',
        path: '/admin/settings/payment',
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        title: 'الشحن',
        path: '/admin/settings/shipping',
        icon: <Truck className="h-4 w-4" />,
      },
    ],
  },
];

// Admin Supabase Layout component
export function AdminSupabaseLayout({ children }: AdminSupabaseLayoutProps) {
  const { user, userProfile, signOut } = useSupabaseAuth();
  const { t, language } = useTranslation();
  // استخدام التبديل اليدوي بدلاً من toggleLanguage
  const toggleLanguageManually = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    localStorage.setItem('language', newLanguage);
    window.location.reload();
  };
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const isRtl = language === 'ar';
  
  // التحقق من نشاط المسار الحالي
  const isActive = (path: string, customCheck?: (path: string) => boolean) => {
    if (customCheck) {
      return customCheck(location);
    }
    return location === path;
  };

  // الحصول على ملف المستخدم
  const userDisplayName = userProfile?.username || user?.email?.split('@')[0] || 'User';
  const userInitials = userDisplayName.substring(0, 2).toUpperCase();
  
  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      {/* Admin Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{t('openMenu')}</span>
                </button>
              </SheetTrigger>
              <SheetContent side={isRtl ? 'right' : 'left'} className="w-64 bg-gray-900 p-0">
                <nav className="flex flex-col gap-1 p-4">
                  {menuItems.map((item) => (
                    <div key={item.path} className="flex flex-col">
                      <Link href={item.path}>
                        <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive(item.path, item.isActive) ? 'bg-primary text-black' : 'hover:bg-gray-800'
                        }`}>
                          {item.icon}
                          {item.title}
                        </div>
                      </Link>
                      {item.submenu && (
                        <div className="mt-1 ms-4 space-y-1 border-s border-gray-800 ps-3">
                          {item.submenu.map((subitem) => (
                            <Link key={subitem.path} href={subitem.path}>
                              <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                                isActive(subitem.path) ? 'bg-primary text-black' : 'hover:bg-gray-800'
                              }`}>
                                {subitem.icon && subitem.icon}
                                {subitem.title}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/admin">
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-xl font-bold text-primary">
                  EchoShop <span className="text-white text-opacity-70 text-sm mb-1">Supabase</span>
                </span>
              </div>
            </Link>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* الإشعارات */}
            <button className="relative rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
              <BellIcon className="h-5 w-5" />
              <span className="sr-only">{t('notifications')}</span>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
            </button>
            
            {/* زر تبديل اللغة */}
            <button 
              onClick={toggleLanguageManually}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <ArrowLeftRight className="h-5 w-5" />
              <span className="sr-only">{t('toggleLanguage')}</span>
            </button>
            
            {/* زر تبديل السمة */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">{t('toggleTheme')}</span>
            </button>
            
            {/* قائمة المستخدم */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-800">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary text-black">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{userDisplayName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56 bg-gray-900 text-white border-gray-800" align={isRtl ? 'start' : 'end'}>
                <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="hover:bg-gray-800">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem 
                  className="text-red-500 hover:bg-gray-800 hover:text-red-400"
                  onClick={async () => {
                    await signOut();
                    window.location.href = '/';
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop only) */}
        <aside className="hidden md:block w-64 border-r border-gray-800 bg-gray-900">
          <nav className="flex flex-col gap-1 p-4">
            {menuItems.map((item) => (
              <div key={item.path} className="flex flex-col">
                <Link href={item.path}>
                  <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive(item.path, item.isActive) ? 'bg-primary text-black' : 'hover:bg-gray-800'
                  }`}>
                    {item.icon}
                    {item.title}
                  </div>
                </Link>
                {item.submenu && (
                  <div className="mt-1 ms-4 space-y-1 border-s border-gray-800 ps-3">
                    {item.submenu.map((subitem) => (
                      <Link key={subitem.path} href={subitem.path}>
                        <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive(subitem.path) ? 'bg-primary text-black' : 'hover:bg-gray-800'
                        }`}>
                          {subitem.icon && subitem.icon}
                          {subitem.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-950 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}