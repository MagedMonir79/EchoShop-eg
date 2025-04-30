import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
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
  Truck,
  CreditCard,
  PaintBucket,
  Plus
} from 'lucide-react';

// Admin layout props
interface AdminLayoutProps {
  children: React.ReactNode;
}

// Admin layout component
export function AdminLayout({ children }: AdminLayoutProps) {
  const { t, language, setLanguage, rtl } = useTranslation();
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };
  
  // Check if link is active
  const isActive = (path: string, itemIsActive?: (path: string) => boolean) => {
    if (itemIsActive) {
      return itemIsActive(location);
    }
    return location === path;
  };
  
  // Check if current path is a setting page
  const isSettingsPath = (path: string) => {
    return path.startsWith('/admin/settings');
  };
  
  // Check if current path is a products page
  const isProductsPath = (path: string) => {
    return path.startsWith('/admin/products');
  };
  
  // Menu items
  const menuItems = [
    {
      title: t('dashboard'),
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: t('products'),
      path: '/admin/products',
      icon: <ShoppingBag size={20} />,
      isActive: isProductsPath,
      submenu: [
        {
          title: t('allProducts'),
          path: '/admin/products',
          icon: <ShoppingBag size={16} />,
        },
        {
          title: t('addProduct'),
          path: '/admin/products/add',
          icon: <Plus size={16} />,
        }
      ]
    },
    {
      title: t('orders'),
      path: '/admin/orders',
      icon: <ShoppingCart size={20} />,
    },
    {
      title: t('customers'),
      path: '/admin/customers',
      icon: <User size={20} />,
    },
    {
      title: t('sellers'),
      path: '/admin/sellers',
      icon: <Users size={20} />,
    },
    {
      title: t('settings'),
      path: '/admin/settings/general',
      icon: <Settings size={20} />,
      isActive: isSettingsPath,
      submenu: [
        {
          title: t('generalSettings'),
          path: '/admin/settings/general',
          icon: <Settings size={16} />,
        },
        {
          title: t('themeSettings'),
          path: '/admin/settings/theme',
          icon: <PaintBucket size={16} />,
        },
        {
          title: t('paymentSettings'),
          path: '/admin/settings/payment',
          icon: <CreditCard size={16} />,
        },
        {
          title: t('shipping'),
          path: '/admin/settings/shipping',
          icon: <Truck size={16} />,
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 h-16 border-b border-gray-800 bg-gray-900">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 rounded-md hover:bg-gray-800">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side={rtl ? "right" : "left"} className="w-[300px] bg-gray-900 p-0">
              <div className="p-6 border-b border-gray-800">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
                  EchoShop
                </Link>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {menuItems.map((item) => (
                  <div key={item.path} className="flex flex-col">
                    <Link href={item.path}>
                      <a className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive(item.path, item.isActive) ? 'bg-primary text-black' : 'hover:bg-gray-800'
                      }`}>
                        {item.icon}
                        {item.title}
                      </a>
                    </Link>
                    {item.submenu && (
                      <div className="mt-1 ms-4 space-y-1 border-s border-gray-800 ps-3">
                        {item.submenu.map((subitem) => (
                          <Link key={subitem.path} href={subitem.path}>
                            <a className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                              isActive(subitem.path) ? 'bg-primary text-black' : 'hover:bg-gray-800'
                            }`}>
                              {subitem.icon && subitem.icon}
                              {subitem.title}
                            </a>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/admin" className="hidden md:flex items-center gap-2 font-bold text-xl">
            EchoShop
          </Link>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="rounded-md p-2 hover:bg-gray-800"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage} 
              className="rounded-md p-2 hover:bg-gray-800 flex items-center gap-1"
            >
              <ArrowLeftRight size={18} />
              <span className="text-xs font-semibold">{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-md p-2 hover:bg-gray-800">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={rtl ? "start" : "end"} className="w-[300px] bg-gray-900 border-gray-800">
                <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="py-2 px-3 hover:bg-gray-800 cursor-pointer">
                    <div className="text-sm font-medium">{t('newOrder')}</div>
                    <div className="text-xs text-gray-400">{t('orderReceivedId')} #12345</div>
                    <div className="text-xs text-gray-500 mt-1">15 {t('minutesAgo')}</div>
                  </div>
                  <div className="py-2 px-3 hover:bg-gray-800 cursor-pointer">
                    <div className="text-sm font-medium">{t('lowStockAlert')}</div>
                    <div className="text-xs text-gray-400">{t('productLowStockAlert')}</div>
                    <div className="text-xs text-gray-500 mt-1">2 {t('hoursAgo')}</div>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-800" />
                <div className="p-2">
                  <Link href="/admin/notifications">
                    <a className="block w-full rounded-md bg-gray-800 p-2 text-center text-sm font-medium hover:bg-gray-700">
                      {t('seeAllNotifications')}
                    </a>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-800">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.profileImage} alt={user?.fullName || user?.username} />
                    <AvatarFallback className="bg-primary text-black">
                      {user?.fullName?.[0] || user?.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm hidden sm:inline">{user?.fullName || user?.username}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={rtl ? "start" : "end"} className="w-[200px] bg-gray-900 border-gray-800">
                <DropdownMenuLabel>{t('profile')}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                  <Link href="/admin/profile">
                    <a className="flex items-center gap-2 w-full">
                      <User size={16} />
                      <span>{t('profile')}</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-gray-800 cursor-pointer text-red-400" 
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-2 w-full">
                    <LogOut size={16} />
                    <span>{t('logout')}</span>
                  </div>
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
                  <a className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive(item.path, item.isActive) ? 'bg-primary text-black' : 'hover:bg-gray-800'
                  }`}>
                    {item.icon}
                    {item.title}
                  </a>
                </Link>
                {item.submenu && (
                  <div className="mt-1 ms-4 space-y-1 border-s border-gray-800 ps-3">
                    {item.submenu.map((subitem) => (
                      <Link key={subitem.path} href={subitem.path}>
                        <a className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive(subitem.path) ? 'bg-primary text-black' : 'hover:bg-gray-800'
                        }`}>
                          {subitem.icon && subitem.icon}
                          {subitem.title}
                        </a>
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