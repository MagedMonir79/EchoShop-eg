import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

// واجهة لبيانات المستخدم
interface DemoAdminUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

// واجهة لنموذج رمز التفعيل
interface ActivationCode {
  id: number;
  code: string;
  created_at: string;
  expires_at: string;
  is_valid: boolean;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<DemoAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  const [expirationDays, setExpirationDays] = useState(7);
  const [generatingCode, setGeneratingCode] = useState(false);

  useEffect(() => {
    // التحقق من وجود بيانات المستخدم في localStorage
    const storedUser = localStorage.getItem('demo_admin_user');
    
    if (!storedUser) {
      toast({
        title: "غير مصرح بالوصول",
        description: "يرجى تسجيل الدخول أولاً للوصول إلى لوحة التحكم",
        variant: "destructive",
      });
      navigate('/admin/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as DemoAdminUser;
      setUser(parsedUser);
      
      // استرجاع رموز التفعيل من localStorage أو إنشاء مجموعة افتراضية
      const storedCodes = localStorage.getItem('demo_activation_codes');
      
      if (storedCodes) {
        setActivationCodes(JSON.parse(storedCodes));
      } else {
        // إنشاء بيانات تجريبية لرموز التفعيل
        const demoActivationCodes: ActivationCode[] = [
          {
            id: 1,
            code: 'ADMIN1234',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_valid: true
          }
        ];
        
        setActivationCodes(demoActivationCodes);
        localStorage.setItem('demo_activation_codes', JSON.stringify(demoActivationCodes));
      }
      
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast({
        title: "حدث خطأ",
        description: "تعذر قراءة بيانات المستخدم. يرجى تسجيل الدخول مرة أخرى.",
        variant: "destructive",
      });
      navigate('/admin/login');
      return;
    }
    
    setLoading(false);
  }, [navigate, toast]);

  // إنشاء رمز تفعيل جديد
  const generateActivationCode = () => {
    setGeneratingCode(true);
    
    try {
      // إنشاء رمز عشوائي (8 أحرف)
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // إنشاء تاريخ انتهاء الصلاحية
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);
      
      // إنشاء رمز تفعيل جديد
      const newCode: ActivationCode = {
        id: Date.now(), // استخدام الطابع الزمني كمعرف فريد
        code: code,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        is_valid: true
      };
      
      // إضافة الرمز الجديد إلى القائمة
      const updatedCodes = [...activationCodes, newCode];
      setActivationCodes(updatedCodes);
      
      // حفظ في localStorage
      localStorage.setItem('demo_activation_codes', JSON.stringify(updatedCodes));
      
      toast({
        title: "تم إنشاء رمز التفعيل بنجاح",
        description: `الرمز: ${code} | صالح حتى: ${expiresAt.toLocaleDateString()}`,
      });
      
    } catch (error) {
      console.error("Error generating activation code:", error);
      toast({
        title: "خطأ في إنشاء رمز التفعيل",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setGeneratingCode(false);
    }
  };

  // إلغاء صلاحية رمز تفعيل
  const invalidateCode = (id: number) => {
    try {
      // تحديث حالة الرمز إلى غير صالح
      const updatedCodes = activationCodes.map(code => 
        code.id === id ? { ...code, is_valid: false } : code
      );
      
      setActivationCodes(updatedCodes);
      
      // حفظ في localStorage
      localStorage.setItem('demo_activation_codes', JSON.stringify(updatedCodes));
      
      toast({
        title: "تم إلغاء صلاحية الرمز بنجاح",
      });
      
    } catch (error) {
      console.error("Error invalidating activation code:", error);
      toast({
        title: "خطأ في إلغاء صلاحية الرمز",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  // تسجيل الخروج
  const handleSignOut = () => {
    localStorage.removeItem('demo_admin_user');
    toast({
      title: "تم تسجيل الخروج بنجاح",
    });
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* الهيدر */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary ml-2">لوحة تحكم المدير</h1>
          </div>
          <div className="flex items-center">
            {user && (
              <span className="text-gray-300 mr-4">{user.email}</span>
            )}
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* القائمة الجانبية */}
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-primary">القائمة الرئيسية</h2>
            <nav className="space-y-2">
              <a href="#" className="block px-4 py-2 rounded bg-primary text-black hover:bg-primary/90 transition-colors">
                لوحة التحكم
              </a>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                المنتجات
              </a>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                الطلبات
              </a>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                المستخدمين
              </a>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                التجار
              </a>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                الإعدادات
              </a>
            </nav>
          </div>

          {/* لوحة رموز التفعيل */}
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-primary">إدارة رموز تفعيل المديرين</h2>
            
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
                <div className="w-full md:w-1/3">
                  <label htmlFor="expirationDays" className="block text-sm font-medium text-gray-300 mb-1">
                    مدة الصلاحية (أيام)
                  </label>
                  <input
                    id="expirationDays"
                    type="number"
                    min="1"
                    max="30"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(parseInt(e.target.value))}
                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={generateActivationCode}
                  disabled={generatingCode}
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-black font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingCode ? 'جاري الإنشاء...' : 'إنشاء رمز تفعيل جديد'}
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الرمز
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      تاريخ الإنشاء
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      تاريخ الانتهاء
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {activationCodes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                        لا توجد رموز تفعيل حالياً
                      </td>
                    </tr>
                  ) : (
                    activationCodes.map((code) => (
                      <tr key={code.id} className="hover:bg-gray-650">
                        <td className="px-4 py-3 text-sm">
                          <code className="bg-gray-800 px-2 py-1 rounded text-yellow-400">{code.code}</code>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(code.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(code.expires_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            new Date(code.expires_at) > new Date() 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {new Date(code.expires_at) > new Date() ? 'صالح' : 'منتهي الصلاحية'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => invalidateCode(code.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            إلغاء
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}