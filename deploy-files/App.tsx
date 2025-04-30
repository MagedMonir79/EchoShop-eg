import React from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/hooks/use-auth';
import { FirebaseAuthProvider } from '@/hooks/firebase-auth'; // Import Firebase Auth Provider
import { SupabaseAuthProvider } from '@/hooks/use-supabase-auth'; // Import Supabase Auth Provider
import { TranslationProvider } from '@/hooks/use-translation-provider';
import { ProtectedRoute } from '@/lib/protected-route';
import { Toaster } from '@/components/ui/toaster';
import { DiagnosticsLink } from '@/components/diagnostics-link';

// Import pages
import HomePage from '@/pages/home';
import AuthPage from '@/pages/auth';
import FirebaseAuthPage from '@/pages/firebase-auth'; // Import the new Firebase Auth page
import FirebaseSimpleAuthPage from '@/pages/firebase-simple-auth'; // Import the simple version
import SupabaseAuthPage from '@/pages/supabase-auth'; // Import the Supabase Auth page
import ResetPasswordPage from '@/pages/reset-password'; // Import Reset Password page
import AuthCallback from '@/pages/auth/callback'; // Import Supabase Auth callback handler
import SupabaseTestPage from '@/pages/supabase-test'; // Import Supabase Test page
import SupabaseDirectTestPage from '@/pages/supabase-direct-test'; // Import Supabase Direct Test page
import SupabaseHealthCheckPage from '@/pages/api-test/supabase-health'; // Import Supabase health check page
import DiagnosticDashboardPage from '@/pages/diagnostic-dashboard'; // Import Diagnostic Dashboard

import NotFoundPage from '@/pages/not-found';
import ProductsPage from '@/pages/products';
import ProductDetailPage from '@/pages/product/[id]';
import CartPage from '@/pages/cart';
import AdminDashboardPage from '@/pages/admin/index';
import AdminProductsPage from '@/pages/admin/products/index';
import AdminAddProductPage from '@/pages/admin/products/add';
import AdminAddProductWithSupabase from '@/pages/admin/products/add-with-supabase';
import ManageCategoriesSupabasePage from '@/pages/admin/categories/manage-supabase';
import AdminOrdersPage from '@/pages/admin/orders';
import AdminCustomersPage from '@/pages/admin/customers';
import AdminSellersPage from '@/pages/admin/sellers/index';
import AdminSettingsGeneralPage from '@/pages/admin/settings/general';
import AdminSettingsThemePage from '@/pages/admin/settings/theme';
import AdminSettingsPaymentPage from '@/pages/admin/settings/payment';
import AdminSettingsShippingPage from '@/pages/admin/settings/shipping';
// import UserDashboardPage from '@/pages/user/dashboard';
import UserDashboardPage from '@/pages/user/dashboard-simple';
// Import new admin pages
import AdminLoginPage from '@/pages/admin/admin-login';
import DirectAdminLoginPage from '@/pages/admin/direct-admin-login';
import DemoAdminLoginPage from '@/pages/admin/demo-login';
import AdminDashboardNewPage from '@/pages/admin/admin-dashboard';
import DemoDashboardPage from '@/pages/admin/demo-dashboard';
import SimpleActivationCodePage from './pages/admin/simple-activation-code';

// Import query client
import { queryClient } from '@/lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TranslationProvider initialLanguage="ar">
          {/* التكامل مع مزودي المصادقة للانتقال التدريجي */}
          <FirebaseAuthProvider>
            <SupabaseAuthProvider>
              <AuthProvider>
                <Switch>
                  {/* المسارات العامة */}
                  <Route path="/" component={HomePage} />
                  
                  {/* مسارات مصادقة Firebase (القديمة) */}
                  <Route path="/auth" component={FirebaseAuthPage} />
                  <Route path="/firebase-auth" component={FirebaseAuthPage} />
                  <Route path="/firebase-simple-auth" component={FirebaseSimpleAuthPage} /> 
                  <Route path="/login" component={FirebaseAuthPage} />
                  <Route path="/signup" component={FirebaseAuthPage} />
                  <Route path="/forgot-password" component={FirebaseAuthPage} />
                  <Route path="/register" component={FirebaseAuthPage} />
                  
                  {/* مسارات مصادقة Supabase (الجديدة) */}
                  <Route path="/supabase-auth" component={SupabaseAuthPage} />
                  <Route path="/reset-password" component={ResetPasswordPage} />
                  <Route path="/auth/callback" component={AuthCallback} />
                  <Route path="/supabase-test" component={SupabaseTestPage} />
                  <Route path="/supabase-direct-test" component={SupabaseDirectTestPage} />
                  <Route path="/supabase-health" component={SupabaseHealthCheckPage} />
                  <Route path="/diagnostic" component={DiagnosticDashboardPage} />
                  
                  {/* مسارات المنتجات والسلة */}
                  <Route path="/products" component={ProductsPage} />
                  <Route path="/product/:id" component={ProductDetailPage} />
                  <Route path="/cart" component={CartPage} />
                  
                  {/* مسارات إضافية للتنقل */}
                  <Route path="/categories" component={ProductsPage} />
                  <Route path="/category/:category" component={ProductsPage} />
                  <Route path="/deals" component={ProductsPage} />
                  <Route path="/deal-of-the-day" component={ProductDetailPage} />
                  <Route path="/essentials" component={ProductsPage} />
                  <Route path="/new-arrivals" component={ProductsPage} />
                  <Route path="/best-sellers" component={ProductsPage} />
                  <Route path="/daily-deals" component={ProductsPage} />
                  <Route path="/account-home" component={UserDashboardPage} />
                  <Route path="/orders" component={UserDashboardPage} />
                  <Route path="/play" component={ProductsPage} />
                  
                  {/* مسارات المستخدم - محمية */}
                  <ProtectedRoute path="/user/dashboard" component={UserDashboardPage} />
                  
                  {/* صفحة تسجيل دخول المدير - غير محمية */}
                  <Route path="/admin/login" component={AdminLoginPage} />
                  
                  {/* صفحة تسجيل دخول المدير المباشر - غير محمية */}
                  <Route path="/admin/direct-login" component={DirectAdminLoginPage} />
                  
                  {/* صفحة تسجيل دخول المدير التجريبية - غير محمية */}
                  <Route path="/admin/demo-login" component={DemoAdminLoginPage} />

                  {/* صفحة الحصول على رمز تفعيل المدير - غير محمية */}
                  <Route path="/admin/get-activation-code" component={SimpleActivationCodePage} />

                  {/* لوحة تحكم المدير الجديدة */}
                  <Route path="/admin/dashboard" component={AdminDashboardNewPage} />
                  
                  {/* لوحة تحكم المدير التجريبية */}
                  <Route path="/admin/demo-dashboard" component={DemoDashboardPage} />
                  
                  {/* مسارات المشرف - محمية وتتطلب دور مشرف */}
                  <ProtectedRoute path="/admin" component={AdminDashboardPage} adminOnly />
                  
                  {/* إدارة المنتجات */}
                  <ProtectedRoute path="/admin/products" component={AdminProductsPage} adminOnly />
                  <ProtectedRoute path="/admin/products/add" component={AdminAddProductPage} adminOnly />
                  <ProtectedRoute path="/admin/products/add-supabase" component={AdminAddProductWithSupabase} adminOnly />
                  
                  {/* إدارة الفئات (Supabase) */}
                  <ProtectedRoute path="/admin/categories/supabase" component={ManageCategoriesSupabasePage} adminOnly />
                  
                  {/* الطلبات والعملاء والبائعين */}
                  <ProtectedRoute path="/admin/orders" component={AdminOrdersPage} adminOnly />
                  <ProtectedRoute path="/admin/customers" component={AdminCustomersPage} adminOnly />
                  <ProtectedRoute path="/admin/sellers" component={AdminSellersPage} adminOnly />
                  
                  {/* صفحات الإعدادات */}
                  <ProtectedRoute path="/admin/settings/general" component={AdminSettingsGeneralPage} adminOnly />
                  <ProtectedRoute path="/admin/settings/theme" component={AdminSettingsThemePage} adminOnly />
                  <ProtectedRoute path="/admin/settings/payment" component={AdminSettingsPaymentPage} adminOnly />
                  <ProtectedRoute path="/admin/settings/shipping" component={AdminSettingsShippingPage} adminOnly />
                  
                  {/* صفحة 404 */}
                  <Route component={NotFoundPage} />
                </Switch>
                
                {/* إشعارات Toast */}
                <Toaster />
                <DiagnosticsLink />
              </AuthProvider>
            </SupabaseAuthProvider>
          </FirebaseAuthProvider>
        </TranslationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;