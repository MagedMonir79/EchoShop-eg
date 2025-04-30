import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

// Define the translations type
type Translations = {
  [key: string]: {
    ar: string;
    en: string;
  };
};

// Define the language type (supported languages)
type Language = 'ar' | 'en';

// Define the translation context type
type TranslationContextType = {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
  rtl: boolean;
};

// Create translation context
const TranslationContext = createContext<TranslationContextType | null>(null);

// Default translations
const defaultTranslations: Translations = {
  // General
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  welcomeToAdminDashboard: { 
    ar: 'مرحبًا بك في لوحة تحكم المسؤول. راقب المبيعات والطلبات وأداء متجرك.', 
    en: 'Welcome to the admin dashboard. Monitor your sales, orders, and store performance.' 
  },
  analytics: { ar: 'التحليلات', en: 'Analytics' },
  orders: { ar: 'الطلبات', en: 'Orders' },
  products: { ar: 'المنتجات', en: 'Products' },
  users: { ar: 'المستخدمين', en: 'Users' },
  customers: { ar: 'العملاء', en: 'Customers' },
  sellers: { ar: 'البائعين', en: 'Sellers' },
  admins: { ar: 'المسؤولين', en: 'Admins' },
  marketing: { ar: 'التسويق', en: 'Marketing' },
  ads: { ar: 'الإعلانات', en: 'Ads' },
  banners: { ar: 'البانرات', en: 'Banners' },
  loyaltyProgram: { ar: 'برنامج الولاء', en: 'Loyalty Program' },
  shipping: { ar: 'الشحن', en: 'Shipping' },
  payment: { ar: 'الدفع', en: 'Payment' },
  suppliers: { ar: 'الموردين', en: 'Suppliers' },
  reports: { ar: 'التقارير', en: 'Reports' },
  sales: { ar: 'المبيعات', en: 'Sales' },
  inventory: { ar: 'المخزون', en: 'Inventory' },
  content: { ar: 'المحتوى', en: 'Content' },
  pages: { ar: 'الصفحات', en: 'Pages' },
  blog: { ar: 'المدونة', en: 'Blog' },
  faqs: { ar: 'الأسئلة الشائعة', en: 'FAQs' },
  localization: { ar: 'التعريب', en: 'Localization' },
  customization: { ar: 'التخصيص', en: 'Customization' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  profile: { ar: 'الملف الشخصي', en: 'Profile' },
  logout: { ar: 'تسجيل الخروج', en: 'Logout' },
  notifications: { ar: 'الإشعارات', en: 'Notifications' },
  markAllRead: { ar: 'تعيين الكل كمقروء', en: 'Mark All Read' },
  seeAllNotifications: { ar: 'مشاهدة كل الإشعارات', en: 'See All Notifications' },

  // Time
  today: { ar: 'اليوم', en: 'Today' },
  thisWeek: { ar: 'هذا الأسبوع', en: 'This Week' },
  thisMonth: { ar: 'هذا الشهر', en: 'This Month' },
  thisYear: { ar: 'هذا العام', en: 'This Year' },
  minutesAgo: { ar: 'دقائق مضت', en: 'minutes ago' },
  hoursAgo: { ar: 'ساعات مضت', en: 'hours ago' },
  daysAgo: { ar: 'أيام مضت', en: 'days ago' },

  // Analytics
  revenue: { ar: 'الإيرادات', en: 'Revenue' },
  increase: { ar: 'زيادة', en: 'increase' },
  decrease: { ar: 'انخفاض', en: 'decrease' },
  noChange: { ar: 'لا تغيير', en: 'no change' },

  // Orders
  orderStatus: { ar: 'حالة الطلبات', en: 'Order Status' },
  currentOrderStatusDistribution: { ar: 'توزيع حالة الطلبات الحالية', en: 'Current Order Status Distribution' },
  newOrder: { ar: 'طلب جديد', en: 'New Order' },
  orderReceivedId: { ar: 'تم استلام الطلب رقم', en: 'Order received ID' },
  recentOrders: { ar: 'الطلبات الأخيرة', en: 'Recent Orders' },
  recentOrdersDescription: { ar: 'آخر 5 طلبات في النظام', en: 'Last 5 orders in the system' },

  // Inventory
  inventoryAlerts: { ar: 'تنبيهات المخزون', en: 'Inventory Alerts' },
  lowStockProductsDescription: { ar: 'المنتجات التي وصلت إلى الحد الأدنى للمخزون', en: 'Products that have reached minimum stock level' },
  lowStockAlert: { ar: 'تنبيه المخزون المنخفض', en: 'Low Stock Alert' },
  productLowStockAlert: { ar: '3 منتجات أقل من حد المخزون الآمن', en: '3 products below safe stock level' },

  // Products
  allProducts: { ar: 'جميع المنتجات', en: 'All Products' },
  addNewProduct: { ar: 'إضافة منتج جديد', en: 'Add New Product' },
  categories: { ar: 'التصنيفات', en: 'Categories' },
  reviews: { ar: 'المراجعات', en: 'Reviews' },

  // Shipping
  shippingCompanies: { ar: 'شركات الشحن', en: 'Shipping Companies' },
  shippingOptions: { ar: 'خيارات الشحن', en: 'Shipping Options' },
  shippingZones: { ar: 'مناطق الشحن', en: 'Shipping Zones' },
  pickupPoints: { ar: 'نقاط الاستلام', en: 'Pickup Points' },

  // Settings
  siteSettings: { ar: 'إعدادات الموقع', en: 'Site Settings' },
  paymentSettings: { ar: 'إعدادات الدفع', en: 'Payment Settings' },
  emailSettings: { ar: 'إعدادات البريد الإلكتروني', en: 'Email Settings' },
  securitySettings: { ar: 'إعدادات الأمان', en: 'Security Settings' },
  themeSettings: { ar: 'إعدادات المظهر', en: 'Theme Settings' },
  generalSettings: { ar: 'الإعدادات العامة', en: 'General Settings' },
  saveChanges: { ar: 'حفظ التغييرات', en: 'Save Changes' },
  settingsSaved: { ar: 'تم حفظ الإعدادات بنجاح', en: 'Settings saved successfully' },
  siteLogoImage: { ar: 'صورة شعار الموقع', en: 'Site Logo Image' },
  selectImage: { ar: 'اختر صورة', en: 'Select Image' },
  upload: { ar: 'رفع', en: 'Upload' },
  primaryColor: { ar: 'اللون الرئيسي', en: 'Primary Color' },
  secondaryColor: { ar: 'اللون الثانوي', en: 'Secondary Color' },
  accentColor: { ar: 'لون التمييز', en: 'Accent Color' },
  backgroundColor: { ar: 'لون الخلفية', en: 'Background Color' },
};

// Provider props
interface TranslationProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
  customTranslations?: Translations;
}

// Provider component
export const TranslationProvider: React.FC<TranslationProviderProps> = (props) => {
  const { 
    children, 
    initialLanguage = 'ar', // Default to Arabic 
    customTranslations = {} 
  } = props;
  
  // Merge default and custom translations
  const allTranslations = { ...defaultTranslations, ...customTranslations };
  
  // Get stored language from localStorage or use initial
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('language') as Language;
      return storedLang || initialLanguage;
    }
    return initialLanguage;
  });
  
  // Set RTL direction based on language
  const rtl = language === 'ar';
  
  // Update document direction and language attributes
  useEffect(() => {
    if (document) {
      document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
  }, [language, rtl]);
  
  // Handle language change
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, []);
  
  // Translation function
  const t = useCallback(
    (key: string): string => {
      if (allTranslations[key] && allTranslations[key][language]) {
        return allTranslations[key][language];
      }
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    },
    [language, allTranslations]
  );
  
  // Context value
  const value: TranslationContextType = {
    t,
    language,
    setLanguage,
    translations: allTranslations,
    rtl,
  };
  
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use translation context
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  return context;
};