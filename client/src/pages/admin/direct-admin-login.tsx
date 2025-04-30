import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

// صفحة تسجيل دخول المدير المباشر - بدون التحقق من تأكيد البريد الإلكتروني
export default function DirectAdminLogin() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // دالة معالجة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // التحقق من رمز التفعيل (للتجربة: ADMIN1234)
      if (activationCode !== 'ADMIN1234') {
        // للتجربة فقط نستخدم كود ثابت
        toast({
          title: "رمز التفعيل غير صالح",
          description: "يرجى استخدام رمز التفعيل ADMIN1234 للتجربة.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // استخدام وظيفة تسجيل الدخول المباشر عبر Supabase API
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // في وضع التطوير، سنتجاهل خطأ عدم تأكيد البريد الإلكتروني
        if (error.message.includes('Email not confirmed')) {
          console.log("تجاوز خطأ عدم تأكيد البريد الإلكتروني في وضع التطوير");
          
          // محاولة الحصول على بيانات المستخدم مباشرة من قاعدة البيانات
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

          if (userError || !userData) {
            toast({
              title: "فشل تسجيل الدخول",
              description: "لم يتم العثور على حساب بهذا البريد الإلكتروني",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }

          // التحقق من أن المستخدم ليس لديه صلاحية مدير وتحديثها
          if (userData.role !== 'admin') {
            await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', userData.id);
          }

          // نجاح تسجيل الدخول في وضع التطوير
          toast({
            title: "تم تسجيل الدخول بنجاح (وضع المطور)",
            description: "تم تجاوز التحقق من تأكيد البريد الإلكتروني في وضع التطوير",
          });

          // التوجيه إلى لوحة تحكم المدير
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 500);
          
          setIsLoading(false);
          return;
        }

        // خطأ آخر (غير خطأ عدم تأكيد البريد الإلكتروني)
        toast({
          title: "فشل تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // تسجيل الدخول ناجح
      if (data && data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // تحديث دور المستخدم إلى مدير إذا لم يكن كذلك
        if (profileData && profileData.role !== 'admin') {
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', data.user.id);
        }

        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحبًا بك في لوحة تحكم المدير",
        });

        // التوجيه إلى لوحة تحكم المدير
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
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
            <h2 className="text-3xl font-bold text-white mb-2">تسجيل دخول المدير (مباشر)</h2>
            <p className="text-gray-400">هذه صفحة تسجيل دخول مباشر بدون التحقق من تأكيد البريد الإلكتروني</p>
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
            </div>
            
            <div className="space-y-2">
              <label htmlFor="activationCode" className="block text-sm font-medium text-gray-200">
                رمز التفعيل الخاص بالمدير *
              </label>
              <input
                id="activationCode"
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="أدخل رمز التفعيل (ADMIN1234 للتجربة)"
              />
              <p className="text-xs text-gray-400 mt-1">استخدم ADMIN1234 كرمز تفعيل للتجربة فقط.</p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary px-4 py-3 text-black font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول المباشر'}
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
          <h2 className="text-3xl font-bold text-white">لوحة تحكم المدير (تسجيل دخول مباشر)</h2>
          <p className="text-white/80">
            هذه نسخة مبسطة من تسجيل الدخول تتجاوز مرحلة التحقق من البريد الإلكتروني وتسمح بالوصول المباشر للوحة التحكم.
            هذه الطريقة مناسبة للتطوير والتجربة فقط.
          </p>
          <div className="space-y-2 pt-4">
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>تسجيل دخول مباشر بدون تأكيد</span>
            </div>
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>ترقية الحساب تلقائيًا إلى مدير</span>
            </div>
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>رمز تفعيل ثابت للتجربة: ADMIN1234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}