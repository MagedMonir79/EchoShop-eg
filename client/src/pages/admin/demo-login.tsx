import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

// صفحة تسجيل دخول المدير التجريبية - تتجاوز كل أنظمة المصادقة للتجربة فقط
export default function DemoAdminLogin() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('admin@echoshop.eg');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  // دالة معالجة تسجيل الدخول (للتجربة فقط)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // تقبل أي بريد إلكتروني يحتوي على كلمة admin وأي كلمة مرور
      if (email.includes('admin')) {
        // نجاح تسجيل الدخول (نسخة تجريبية فقط)
        toast({
          title: "تم تسجيل الدخول بنجاح (وضع التجربة)",
          description: "مرحبًا بك في لوحة تحكم المدير",
        });

        // التوجيه إلى لوحة تحكم المدير
        setTimeout(() => {
          // ضع المستخدم في localStorage للوصول إليه في الصفحات المحمية
          localStorage.setItem('demo_admin_user', JSON.stringify({
            id: 'admin-123',
            email: email,
            role: 'admin',
            name: 'مدير التجربة'
          }));
          
          navigate('/admin/dashboard');
        }, 500);
      } else {
        // فشل تسجيل الدخول
        toast({
          title: "فشل تسجيل الدخول",
          description: "يجب أن يحتوي البريد الإلكتروني على كلمة 'admin'",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ غير متوقع",
        description: error.message || "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* الجانب الأيسر: نموذج تسجيل الدخول */}
      <div className="flex flex-col justify-center px-8 md:px-16 w-full md:w-1/2">
        <div className="max-w-md mx-auto">
          {/* زر العودة */}
          <div className="flex justify-start mb-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              العودة إلى الصفحة الرئيسية
            </button>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">تسجيل دخول للتجربة فقط</h2>
            <p className="text-gray-400">هذه الصفحة مخصصة للتجربة فقط وتتجاوز أنظمة المصادقة</p>
          </div>

          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-md p-4 mb-6">
            <h3 className="text-yellow-400 text-sm font-bold mb-2">ملاحظة مهمة</h3>
            <p className="text-yellow-300 text-xs">
              هذه صفحة مؤقتة للتجربة فقط. استخدم أي بريد إلكتروني يحتوي على كلمة "admin" 
              وأي كلمة مرور للدخول. سيتم الاحتفاظ بحالة تسجيل الدخول في المتصفح فقط.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                البريد الإلكتروني *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-400">أي بريد إلكتروني يحتوي على كلمة "admin" سيعمل</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                كلمة المرور *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-400">أي كلمة مرور ستعمل في وضع التجربة</p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary px-4 py-3 text-black font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول التجريبي'}
            </button>
          </form>
        </div>
      </div>
      
      {/* الجانب الأيمن: معلومات المدير */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-12 items-center justify-center">
        <div className="max-w-md space-y-6 text-center">
          <div className="bg-white/10 p-4 rounded-full inline-flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">وضع التجربة</h2>
          <p className="text-white/80">
            هذه نسخة مبسطة من لوحة تحكم المدير للتجربة فقط، تتجاوز كل أنظمة المصادقة
            للسماح بتجربة الوظائف الأساسية للمنصة.
          </p>
          <div className="space-y-2 pt-4">
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>تخطي جميع عمليات التحقق</span>
            </div>
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>بيانات تسجيل دخول معبأة مسبقًا</span>
            </div>
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>تخزين الجلسة في المتصفح محليًا</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}