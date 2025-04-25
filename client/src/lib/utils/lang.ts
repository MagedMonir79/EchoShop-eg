// Language translations for the app
export type LanguageKey = 'en' | 'ar';

export interface Dictionary {
  [key: string]: string;
}

export interface Translations {
  [key: LanguageKey]: Dictionary;
}

export const translations: Translations = {
  en: {
    // Header
    "login": "Login",
    "signup": "Sign Up",
    "logout": "Logout",
    "cart": "Cart",
    "help": "Help",
    "switchToArabic": "العربية",
    "switchToEnglish": "English",
    "searchPlaceholder": "Search products...",
    
    // Navigation
    "home": "Home",
    "allProductsNav": "All Products",
    "electronics": "Electronics",
    "fashion": "Fashion",
    "homeAndGarden": "Home & Garden",
    "beauty": "Beauty",
    "sports": "Sports",
    "toys": "Toys",
    "bestSellersNav": "Best Sellers",
    
    // Hero
    "heroTitle": "Shop the latest collections",
    "heroDescription": "Discover great deals and top quality products from thousands of verified suppliers.",
    "shopNow": "Shop Now",
    "learnMore": "Learn More",
    
    // Features
    "freeShipping": "Free Shipping",
    "onOrdersOver": "On orders over $100",
    "securePayments": "Secure Payments",
    "100SecurePayment": "100% secure payment",
    "24Support": "24/7 Support",
    "dedicatedSupport": "Dedicated support",
    
    // Flash Deals
    "flashDeals": "Flash Deals",
    "endsIn": "Ends in:",
    
    // Categories
    "shopByCategory": "Shop by Category",
    
    // Best Sellers
    "bestSellers": "Best Sellers",
    
    // Seller Section
    "becomeSeller": "Become a Seller on EchoShop",
    "becomeSellerDesc": "Start your online business today. Reach millions of customers and grow your sales with our easy-to-use platform.",
    "easyRegistration": "Easy Registration Process",
    "comprehensiveDashboard": "Comprehensive Seller Dashboard",
    "multipleDropshipping": "Multiple Dropshipping Supplier Options",
    "automatedOrder": "Automated Order Processing",
    "registerAsSeller": "Register as Seller",
    
    // Footer
    "footerDesc": "The leading dropshipping marketplace connecting sellers and buyers.",
    "shop": "Shop",
    "allProducts": "All Products",
    "featuredItems": "Featured Items",
    "newArrivals": "New Arrivals",
    "salesAndDiscounts": "Sales & Discounts",
    "customerService": "Customer Service",
    "contactUs": "Contact Us",
    "faqs": "FAQs",
    "shippingPolicy": "Shipping Policy",
    "returnsRefunds": "Returns & Refunds",
    "about": "About",
    "ourStory": "Our Story",
    "careers": "Careers",
    "privacyPolicy": "Privacy Policy",
    "terms": "Terms of Service",
    "copyright": "© 2025 EchoShop. All rights reserved.",
    
    // Admin
    "dashboard": "Dashboard",
    "orders": "Orders",
    "products": "Products",
    "categories": "Categories",
    "customers": "Customers",
    "settings": "Settings",
    "themeSettings": "Theme Settings",
    "addProduct": "Add Product",
    "bannerControl": "Banner Control",
    "selectTheme": "Select Site Theme",
    "save": "Save Settings",
    "reset": "Reset to Default",
    
    // Cart
    "yourCart": "Your Cart",
    "emptyCart": "No items in your cart yet.",
    "continueShopping": "Continue Shopping",
    "checkout": "Checkout",
    "total": "Total",
    "removeItem": "Remove",
    
    // Product
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock",
    "inStock": "In Stock",
    "reviews": "Reviews",
    "description": "Description",
    "relatedProducts": "Related Products",
    
    // Login/Signup
    "loginTitle": "Login to EchoShop",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "dontHaveAccount": "Don't have an account?",
    "alreadyHaveAccount": "Already have an account?",
    "createAccount": "Create Account",
    "forgotPassword": "Forgot Password?",
    "fullName": "Full Name",
    "username": "Username",
    "signupTitle": "Create an Account",
    "orContinueWith": "Or continue with",
    "continueWithGoogle": "Continue with Google",
    
    // Miscellaneous
    "loading": "Loading...",
    "error": "An error occurred",
    "tryAgain": "Try Again",
    "success": "Success",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "apply": "Apply",
    "clear": "Clear",
    "filter": "Filter",
    "sort": "Sort",
    "search": "Search",
    "noResults": "No results found",
    "back": "Back"
  },
  ar: {
    // Header
    "login": "تسجيل الدخول",
    "signup": "إنشاء حساب",
    "logout": "تسجيل الخروج",
    "cart": "سلة التسوق",
    "help": "المساعدة",
    "switchToArabic": "العربية",
    "switchToEnglish": "English",
    "searchPlaceholder": "البحث عن منتجات...",
    
    // Navigation
    "home": "الرئيسية",
    "allProductsNav": "جميع المنتجات",
    "electronics": "الإلكترونيات",
    "fashion": "الأزياء",
    "homeAndGarden": "المنزل والحديقة",
    "beauty": "الجمال",
    "sports": "الرياضة",
    "toys": "الألعاب",
    "bestSellersNav": "الأكثر مبيعًا",
    
    // Hero
    "heroTitle": "تسوق أحدث المجموعات",
    "heroDescription": "اكتشف عروضًا رائعة ومنتجات عالية الجودة من آلاف الموردين الموثوقين.",
    "shopNow": "تسوق الآن",
    "learnMore": "اعرف المزيد",
    
    // Features
    "freeShipping": "شحن مجاني",
    "onOrdersOver": "للطلبات أكثر من $100",
    "securePayments": "مدفوعات آمنة",
    "100SecurePayment": "دفع آمن 100%",
    "24Support": "دعم على مدار الساعة",
    "dedicatedSupport": "دعم مخصص",
    
    // Flash Deals
    "flashDeals": "عروض سريعة",
    "endsIn": "ينتهي في:",
    
    // Categories
    "shopByCategory": "تسوق حسب الفئة",
    
    // Best Sellers
    "bestSellers": "الأكثر مبيعًا",
    
    // Seller Section
    "becomeSeller": "كن بائعًا على EchoShop",
    "becomeSellerDesc": "ابدأ عملك التجاري عبر الإنترنت اليوم. تواصل مع ملايين العملاء ونمِّ مبيعاتك باستخدام منصتنا سهلة الاستخدام.",
    "easyRegistration": "عملية تسجيل سهلة",
    "comprehensiveDashboard": "لوحة تحكم شاملة للبائع",
    "multipleDropshipping": "خيارات متعددة لموردي دروبشيبينج",
    "automatedOrder": "معالجة آلية للطلبات",
    "registerAsSeller": "التسجيل كبائع",
    
    // Footer
    "footerDesc": "سوق دروبشيبينج الرائد الذي يربط البائعين والمشترين.",
    "shop": "المتجر",
    "allProducts": "جميع المنتجات",
    "featuredItems": "العناصر المميزة",
    "newArrivals": "وصل حديثًا",
    "salesAndDiscounts": "المبيعات والخصومات",
    "customerService": "خدمة العملاء",
    "contactUs": "اتصل بنا",
    "faqs": "الأسئلة الشائعة",
    "shippingPolicy": "سياسة الشحن",
    "returnsRefunds": "الإرجاع والاسترداد",
    "about": "عن الشركة",
    "ourStory": "قصتنا",
    "careers": "وظائف",
    "privacyPolicy": "سياسة الخصوصية",
    "terms": "شروط الخدمة",
    "copyright": "© 2025 EchoShop. جميع الحقوق محفوظة.",
    
    // Admin
    "dashboard": "لوحة التحكم",
    "orders": "الطلبات",
    "products": "المنتجات",
    "categories": "الفئات",
    "customers": "العملاء",
    "settings": "الإعدادات",
    "themeSettings": "إعدادات المظهر",
    "addProduct": "إضافة منتج",
    "bannerControl": "التحكم في البانر",
    "selectTheme": "اختر مظهر الموقع",
    "save": "حفظ الإعدادات",
    "reset": "إعادة تعيين للافتراضي",
    
    // Cart
    "yourCart": "سلة تسوقك",
    "emptyCart": "لا توجد عناصر في سلة التسوق الخاصة بك حتى الآن.",
    "continueShopping": "مواصلة التسوق",
    "checkout": "إتمام الشراء",
    "total": "المجموع",
    "removeItem": "إزالة",
    
    // Product
    "addToCart": "أضف إلى السلة",
    "outOfStock": "نفدت الكمية",
    "inStock": "متوفر",
    "reviews": "التقييمات",
    "description": "الوصف",
    "relatedProducts": "منتجات ذات صلة",
    
    // Login/Signup
    "loginTitle": "تسجيل الدخول إلى EchoShop",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "confirmPassword": "تأكيد كلمة المرور",
    "dontHaveAccount": "ليس لديك حساب؟",
    "alreadyHaveAccount": "لديك حساب بالفعل؟",
    "createAccount": "إنشاء حساب",
    "forgotPassword": "نسيت كلمة المرور؟",
    "fullName": "الاسم الكامل",
    "username": "اسم المستخدم",
    "signupTitle": "إنشاء حساب",
    "orContinueWith": "أو استمر باستخدام",
    "continueWithGoogle": "متابعة باستخدام جوجل",
    
    // Miscellaneous
    "loading": "جاري التحميل...",
    "error": "حدث خطأ",
    "tryAgain": "حاول مرة أخرى",
    "success": "تم بنجاح",
    "cancel": "إلغاء",
    "confirm": "تأكيد",
    "apply": "تطبيق",
    "clear": "مسح",
    "filter": "تصفية",
    "sort": "ترتيب",
    "search": "بحث",
    "noResults": "لم يتم العثور على نتائج",
    "back": "رجوع"
  }
};

export const getTranslation = (key: string, language: LanguageKey): string => {
  if (!translations[language]) return key;
  
  const translation = translations[language][key];
  return translation || key;
};
