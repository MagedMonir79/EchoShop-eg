import { useCallback } from 'react';

interface Translations {
  [key: string]: string;
}

// إضافة ترجمات باللغة العربية الافتراضية
const ar: Translations = {
  // ترجمات عامة
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
  
  // معلومات الملف الشخصي
  memberStatus: 'نوع العضوية',
  lastLogin: 'آخر دخول',
  notificationCount: 'الإشعارات',
  accountType: 'نوع الحساب',
  
  // وحدات لوحة التحكم
  customizeWidgets: 'تخصيص الوحدات',
  customizeWidgetsDescription: 'تخصيص الوحدات التي تظهر في لوحة التحكم الخاصة بك',
  saveChanges: 'حفظ التغييرات',
  cancel: 'إلغاء',
  
  // وحدة الإجراءات السريعة
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
  
  // وحدة الطلبات الحديثة
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
  
  // وحدة المنتجات المفضلة
  favoriteProducts: 'المنتجات المفضلة',
  favoriteProductsDescription: 'تصفح منتجاتك المفضلة بسرعة',
  addToCart: 'أضف للسلة',
  viewAllFavorites: 'عرض جميع المفضلة',
  noFavoriteProducts: 'لا توجد منتجات مفضلة',
  noFavoriteProductsDescription: 'أضف منتجات للمفضلة لتظهر هنا',
  
  // وحدة إحصائيات المستخدم
  userStats: 'إحصائيات الحساب',
  orders: 'الطلبات',
  favorites: 'المفضلة',
  reviews: 'التقييمات',
  rewardPoints: 'نقاط المكافآت',
  memberSince: 'عضو منذ',
};

// الترجمات الإنجليزية
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

// استيراد hook لوضع اللغة المفضلة
export function useTranslation() {
  // TODO: يتم استخراج اللغة المفضلة من localStorage أو إعدادات المستخدم
  // في هذه المرحلة، نستخدم العربية كلغة افتراضية
  const language = 'ar'; // يمكن تغييرها للتبديل بين 'ar' و 'en'
  
  // اختيار مجموعة الترجمات المناسبة
  const translations = language === 'ar' ? ar : en;
  
  // دالة الترجمة
  const t = useCallback((key: string) => {
    return translations[key] || key;
  }, [translations]);
  
  return {
    t,
    language,
  };
}