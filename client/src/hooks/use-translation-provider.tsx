import React, { createContext, ReactNode, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  rtl: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (key: string) => key,
  rtl: true,
});

interface TranslationProviderProps {
  children: ReactNode;
  initialLanguage?: string;
}

interface Translations {
  [key: string]: string;
}

// Arabic translations
const ar: Translations = {
  // General translations
  welcomeBack: 'مرحبًا بعودتك',
  logout: 'تسجيل الخروج',
  guest: 'زائر',
  dashboard: 'لوحة التحكم',
  dashboardDescription: 'إدارة حسابك، تتبع طلباتك، وتصفح منتجاتك المفضلة',
  dashboardUpdated: 'تم تحديث لوحة التحكم',
  dashboardUpdatedDescription: 'تم حفظ تفضيلات لوحة التحكم بنجاح',
  loggedOut: 'تم تسجيل الخروج',
  loggedOutSuccessfully: 'تم تسجيل خروجك بنجاح',
  error: 'خطأ',
  errorLoggingOut: 'حدث خطأ أثناء تسجيل الخروج',
  
  // Navigation
  home: 'الرئيسية',
  allProductsNav: 'جميع المنتجات',
  electronics: 'إلكترونيات',
  fashion: 'أزياء',
  homeAndGarden: 'المنزل والحديقة',
  beauty: 'الجمال',
  sports: 'رياضة',
  toys: 'ألعاب',
  bestSellers: 'الأكثر مبيعًا',
  
  // Auth
  login: 'تسجيل الدخول',
  signup: 'إنشاء حساب',
  
  // Cart
  cart: 'عربة التسوق',
  hello: 'مرحبًا',
  
  // Footer
  footerDesc: 'منصة التسوق الأفضل للمنتجات عالية الجودة بأسعار منافسة',
  shop: 'تسوق',
  allProducts: 'جميع المنتجات',
  featuredItems: 'منتجات مميزة',
  newArrivals: 'وصل حديثًا',
  salesAndDiscounts: 'عروض وخصومات',
  customerService: 'خدمة العملاء',
  contactUs: 'اتصل بنا',
  faqs: 'الأسئلة الشائعة',
  shippingPolicy: 'سياسة الشحن',
  returnsRefunds: 'الإرجاع والاسترداد',
  about: 'عن الشركة',
  ourStory: 'قصتنا',
  careers: 'وظائف',
  privacyPolicy: 'سياسة الخصوصية',
  terms: 'الشروط والأحكام',
  copyright: 'جميع الحقوق محفوظة',
  searchPlaceholder: 'ابحث عن منتجات...',
  success: 'نجاح',
  
  // Profile information
  memberStatus: 'نوع العضوية',
  lastLogin: 'آخر دخول',
  notificationCount: 'الإشعارات',
  accountType: 'نوع الحساب',
  
  // Dashboard widgets
  customizeWidgets: 'تخصيص الوحدات',
  customizeWidgetsDescription: 'تخصيص الوحدات التي تظهر في لوحة التحكم الخاصة بك',
  saveChanges: 'حفظ التغييرات',
  cancel: 'إلغاء',
  
  // Quick actions widget
  quickActions: 'إجراءات سريعة',
  quickActionsDescription: 'روابط سريعة للوصول إلى المهام الشائعة',
  browseProducts: 'تصفح المنتجات',
  myOrders: 'طلباتي',
  wishlist: 'المفضلة',
  trackOrder: 'تتبع الطلب',
  paymentMethods: 'طرق الدفع',
  accountSettings: 'إعدادات الحساب',
  support: 'الدعم',
  deals: 'العروض',
  
  // Recent orders widget
  recentOrders: 'الطلبات الحديثة',
  recentOrdersDescription: 'تتبع حالة طلباتك الأخيرة',
  items: 'منتجات',
  viewAllOrders: 'عرض جميع الطلبات',
  noRecentOrders: 'لا توجد طلبات حديثة',
  noRecentOrdersDescription: 'ستظهر طلباتك الحديثة هنا عند إتمام شراء',
  delivered: 'تم التوصيل',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  cancelled: 'تم الإلغاء',
  
  // Favorite products widget
  favoriteProducts: 'المنتجات المفضلة',
  favoriteProductsDescription: 'تصفح منتجاتك المفضلة بسرعة',
  addToCart: 'أضف للسلة',
  viewAllFavorites: 'عرض جميع المفضلة',
  noFavoriteProducts: 'لا توجد منتجات مفضلة',
  noFavoriteProductsDescription: 'أضف منتجات للمفضلة لتظهر هنا',
  
  // User stats widget
  userStats: 'إحصائيات الحساب',
  orders: 'الطلبات',
  favorites: 'المفضلة',
  reviews: 'التقييمات',
  rewardPoints: 'نقاط المكافآت',
  memberSince: 'عضو منذ',
};

// English translations
const en: Translations = {
  // General translations
  welcomeBack: 'Welcome back',
  logout: 'Logout',
  guest: 'Guest',
  dashboard: 'Dashboard',
  dashboardDescription: 'Manage your account, track orders, and browse favorites',
  dashboardUpdated: 'Dashboard Updated',
  dashboardUpdatedDescription: 'Your dashboard preferences have been saved',
  loggedOut: 'Logged Out',
  loggedOutSuccessfully: 'You have been logged out successfully',
  error: 'Error',
  errorLoggingOut: 'Error logging out',
  
  // Navigation
  home: 'Home',
  allProductsNav: 'All Products',
  electronics: 'Electronics',
  fashion: 'Fashion',
  homeAndGarden: 'Home & Garden',
  beauty: 'Beauty',
  sports: 'Sports',
  toys: 'Toys',
  bestSellers: 'Best Sellers',
  
  // Auth
  login: 'Login',
  signup: 'Sign Up',
  
  // Cart
  cart: 'Cart',
  hello: 'Hello',
  
  // Footer
  footerDesc: 'The best platform for high-quality products at competitive prices',
  shop: 'Shop',
  allProducts: 'All Products',
  featuredItems: 'Featured Items',
  newArrivals: 'New Arrivals',
  salesAndDiscounts: 'Sales & Discounts',
  customerService: 'Customer Service',
  contactUs: 'Contact Us',
  faqs: 'FAQs',
  shippingPolicy: 'Shipping Policy',
  returnsRefunds: 'Returns & Refunds',
  about: 'About',
  ourStory: 'Our Story',
  careers: 'Careers',
  privacyPolicy: 'Privacy Policy',
  terms: 'Terms & Conditions',
  copyright: 'All rights reserved',
  searchPlaceholder: 'Search for products...',
  success: 'Success',
  
  // Profile information
  memberStatus: 'Member Status',
  lastLogin: 'Last Login',
  notificationCount: 'Notifications',
  accountType: 'Account Type',
  
  // Dashboard widgets
  customizeWidgets: 'Customize Widgets',
  customizeWidgetsDescription: 'Customize the widgets that appear on your dashboard',
  saveChanges: 'Save Changes',
  cancel: 'Cancel',
  
  // Quick actions widget
  quickActions: 'Quick Actions',
  quickActionsDescription: 'Quick links to common tasks',
  browseProducts: 'Browse Products',
  myOrders: 'My Orders',
  wishlist: 'Wishlist',
  trackOrder: 'Track Order',
  paymentMethods: 'Payment Methods',
  accountSettings: 'Account Settings',
  support: 'Support',
  deals: 'Deals',
  
  // Recent orders widget
  recentOrders: 'Recent Orders',
  recentOrdersDescription: 'Track the status of your recent orders',
  items: 'items',
  viewAllOrders: 'View All Orders',
  noRecentOrders: 'No Recent Orders',
  noRecentOrdersDescription: 'Your recent orders will appear here when you make a purchase',
  delivered: 'Delivered',
  processing: 'Processing',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
  
  // Favorite products widget
  favoriteProducts: 'Favorite Products',
  favoriteProductsDescription: 'Quickly access your favorite products',
  addToCart: 'Add to Cart',
  viewAllFavorites: 'View All Favorites',
  noFavoriteProducts: 'No Favorite Products',
  noFavoriteProductsDescription: 'Add products to your favorites to see them here',
  
  // User stats widget
  userStats: 'Account Stats',
  orders: 'Orders',
  favorites: 'Favorites',
  reviews: 'Reviews',
  rewardPoints: 'Reward Points',
  memberSince: 'Member since',
};

export function TranslationProvider({ children, initialLanguage = 'en' }: TranslationProviderProps) {
  // Use stored preference or initialLanguage (defaulting to English)
  const [language, setLanguage] = useState<string>(() => {
    const storedLang = localStorage.getItem('preferred_language');
    return storedLang || initialLanguage;
  });
  
  // Effect to set the language direction on the document body
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Store preference in local storage
    localStorage.setItem('preferred_language', language);
  }, [language]);
  
  // Function to lookup translations
  const t = (key: string): string => {
    const translations = language === 'ar' ? ar : en;
    return translations[key] || key;
  };
  
  // Determine RTL direction
  const rtl = language === 'ar';
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, rtl }}>
      {children}
    </LanguageContext.Provider>
  );
}