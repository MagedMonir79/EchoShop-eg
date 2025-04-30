import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

// مخطط نموذج تسجيل دخول المدير
const adminLoginSchema = z.object({
  email: z.string().email({ 
    message: "يرجى إدخال بريد إلكتروني صحيح." 
  }),
  password: z.string().min(6, { 
    message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." 
  }),
  activationCode: z.string().min(4, {
    message: "رمز التفعيل يجب أن يكون 4 أحرف على الأقل."
  }),
});

// صفحة تسجيل دخول المدير
export default function AdminLogin() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // التحقق مما إذا كان المستخدم مسجلاً بالفعل باستخدام localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('demo_admin_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        toast({
          title: "مرحبًا بك مرة أخرى",
          description: "تم تسجيل دخولك تلقائيًا كمدير."
        });
        navigate('/admin/dashboard');
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('demo_admin_user');
      }
    }
  }, [navigate, toast]);

  // إعداد نموذج تسجيل الدخول باستخدام react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: 'admin@echoshop.eg',
      password: 'admin123',
      activationCode: 'ADMIN1234',
    },
  });

  // دالة معالجة تسجيل الدخول
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // التحقق من رمز التفعيل (نقبل ADMIN1234 للتجربة)
      if (data.activationCode !== 'ADMIN1234') {
        toast({
          title: "رمز التفعيل غير صالح",
          description: "يرجى استخدام رمز التفعيل ADMIN1234 للتجربة.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // نجاح تسجيل الدخول كمدير
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك في لوحة تحكم المدير.",
      });

      // حفظ بيانات المستخدم في localStorage
      localStorage.setItem('demo_admin_user', JSON.stringify({
        id: 'admin-123',
        email: data.email,
        role: 'admin',
        name: 'مدير المتجر'
      }));

      // التوجيه إلى لوحة تحكم المدير
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  });

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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              العودة إلى الصفحة الرئيسية
            </button>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">تسجيل دخول المدير</h2>
            <p className="text-gray-400">قم بتسجيل الدخول للوصول إلى لوحة تحكم المدير</p>
          </div>

          <div className="mb-4 text-center">
            <p className="text-yellow-400 text-sm">
              واجهتك مشكلة في تسجيل الدخول؟{' '}
              <a href="/admin/direct-login" className="underline hover:text-yellow-300">
                جرب تسجيل الدخول المباشر
              </a>
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                البريد الإلكتروني *
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                autoComplete="email"
              />
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email.message}</span>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                كلمة المرور *
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password.message}</span>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="activationCode" className="block text-sm font-medium text-gray-200">
                رمز التفعيل الخاص بالمدير *
              </label>
              <input
                id="activationCode"
                type="text"
                {...register('activationCode')}
                className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="أدخل رمز التفعيل الذي حصلت عليه"
              />
              {errors.activationCode && (
                <span className="text-sm text-red-500">{errors.activationCode.message}</span>
              )}
              <p className="text-xs text-gray-400 mt-1">هذا الرمز مطلوب للدخول كمدير ويستخدم لمرة واحدة فقط.</p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary px-4 py-3 text-black font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
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
          <h2 className="text-3xl font-bold text-white">لوحة تحكم المدير</h2>
          <p className="text-white/80">
            الوصول إلى لوحة تحكم المدير يمنحك القدرة على إدارة المتجر بالكامل، 
            إضافة وتعديل المنتجات، إدارة المستخدمين والطلبات، 
            وتخصيص واجهة المستخدم والمزيد من المميزات الحصرية.
          </p>
          <div className="space-y-2 pt-4">
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>إدارة كاملة للمنتجات والفئات</span>
            </div>
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>إدارة المستخدمين والتجار</span>
            </div>
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>تحليلات وتقارير متقدمة</span>
            </div>
            <div className="flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>تخصيص واجهة المتجر</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}