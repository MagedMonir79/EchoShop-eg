import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

// إنشاء سياق المصادقة لـ Supabase
type SupabaseAuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, username: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { username?: string; email?: string; phone?: string; avatar_url?: string }) => Promise<{ success: boolean; error?: string }>;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // التحقق من جلسة المستخدم عند تحميل التطبيق
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('خطأ في تحميل الجلسة:', error.message);
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('خطأ غير متوقع:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // الاشتراك في تغييرات الجلسة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      // إلغاء الاشتراك عند إزالة المكون
      subscription.unsubscribe();
    };
  }, []);

  // تسجيل الدخول باستخدام البريد الإلكتروني أو اسم المستخدم وكلمة المرور
  const signIn = async (emailOrUsername: string, password: string) => {
    try {
      setLoading(true);
      // التحقق مما إذا كان الإدخال هو بريد إلكتروني أم اسم مستخدم
      const isEmail = emailOrUsername.includes('@');
      
      if (isEmail) {
        // تسجيل الدخول باستخدام البريد الإلكتروني
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername, 
          password
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } else {
        // البحث عن المستخدم باستخدام اسم المستخدم للحصول على البريد الإلكتروني
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('username', emailOrUsername)
          .maybeSingle();

        if (userError || !userData) {
          return { success: false, error: 'اسم المستخدم غير موجود' };
        }

        // استخدام البريد الإلكتروني المسترجع لتسجيل الدخول
        const { data, error } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      }
    } catch (err: any) {
      console.error('خطأ في تسجيل الدخول:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // إنشاء حساب جديد باستخدام البريد الإلكتروني وكلمة المرور
  const signUp = async (email: string, password: string, username: string, phone?: string) => {
    try {
      setLoading(true);
      
      // التحقق من أن المستخدم غير موجود بالفعل (اسم المستخدم)
      const { data: existingUsername, error: usernameQueryError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (usernameQueryError) {
        console.error('خطأ في التحقق من اسم المستخدم:', usernameQueryError);
        return { success: false, error: 'حدث خطأ أثناء التحقق من اسم المستخدم' };
      }

      if (existingUsername) {
        return { success: false, error: 'اسم المستخدم مستخدم بالفعل. الرجاء اختيار اسم مستخدم آخر.' };
      }
      
      // التحقق من أن البريد الإلكتروني غير موجود بالفعل
      const { data: existingEmail, error: emailQueryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (emailQueryError) {
        console.error('خطأ في التحقق من البريد الإلكتروني:', emailQueryError);
        return { success: false, error: 'حدث خطأ أثناء التحقق من البريد الإلكتروني' };
      }

      if (existingEmail) {
        return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل. الرجاء استخدام بريد إلكتروني آخر أو تسجيل الدخول.' };
      }

      // تحديد عنوان إعادة التوجيه بناءً على البيئة الحالية
      let redirectTo;
      if (window.location.hostname === 'localhost') {
        redirectTo = `${window.location.origin}/auth/callback`;
      } else if (window.location.hostname === 'echoshop-eg.web.app') {
        redirectTo = 'https://echoshop-eg.web.app/auth/callback';
      } else {
        redirectTo = `${window.location.origin}/auth/callback`;
      }

      // إنشاء المستخدم في نظام مصادقة Supabase مع تفعيل ميزة التحقق من البريد الإلكتروني
      console.log('إنشاء مستخدم جديد مع إعادة التوجيه إلى:', redirectTo);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            phone,
            full_name: '',
            role: 'customer'
          },
          emailRedirectTo: redirectTo
        }
      });

      if (error) {
        console.error('خطأ في إنشاء الحساب:', error);
        return { success: false, error: error.message };
      }

      // إنشاء سجل للمستخدم في جدول المستخدمين
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            username,
            password: '*****', // لا نخزن كلمة المرور الفعلية، فقط لإرضاء قيود الجدول
            phone: phone || '',
            role: 'customer',
            created_at: new Date()
          });

        if (profileError) {
          console.error('خطأ في إنشاء ملف المستخدم:', profileError);
          // لا نعيد خطأ للمستخدم النهائي هنا لأن الحساب قد تم إنشاؤه بالفعل في نظام المصادقة
          console.warn('تم إنشاء الحساب في المصادقة ولكن ليس في قاعدة البيانات:', profileError.message);
        }
      }

      // عرض رسالة نجاح
      toast({
        title: 'تم التسجيل بنجاح',
        description: 'تم إنشاء حسابك بنجاح. يرجى تأكيد بريدك الإلكتروني من خلال الرابط المرسل إليك.',
        duration: 6000,
      });

      return { success: true };
    } catch (err: any) {
      console.error('استثناء في عملية التسجيل:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.error('خطأ في تسجيل الخروج:', err);
    } finally {
      setLoading(false);
    }
  };

  // استعادة كلمة المرور المنسية
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: 'تم إرسال رابط إعادة تعيين كلمة المرور',
        description: 'يرجى التحقق من بريدك الإلكتروني للحصول على تعليمات إعادة تعيين كلمة المرور',
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // إعادة تعيين كلمة المرور
  const resetPassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: 'تم تحديث كلمة المرور',
        description: 'تم تغيير كلمة المرور الخاصة بك بنجاح',
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // تحديث الملف الشخصي
  const updateProfile = async (data: { username?: string; email?: string; phone?: string; avatar_url?: string }) => {
    try {
      setLoading(true);
      
      if (!user) {
        return { success: false, error: 'يجب تسجيل الدخول لتحديث الملف الشخصي' };
      }

      // تحديث البريد الإلكتروني في مصادقة Supabase إذا تم تغييره
      if (data.email && data.email !== user.email) {
        const { error } = await supabase.auth.updateUser({
          email: data.email,
        });

        if (error) {
          return { success: false, error: error.message };
        }
      }

      // تحديث البيانات المخصصة في مصادقة Supabase
      const userData: Record<string, any> = {};
      if (data.username) userData.username = data.username;
      if (data.phone) userData.phone = data.phone;
      
      if (Object.keys(userData).length > 0) {
        const { error } = await supabase.auth.updateUser({
          data: userData
        });

        if (error) {
          return { success: false, error: error.message };
        }
      }

      // تحديث سجل المستخدم في جدول المستخدمين
      const { error: profileError } = await supabase
        .from('users')
        .update({
          ...(data.username && { username: data.username }),
          ...(data.email && { email: data.email }),
          ...(data.phone && { phone: data.phone }),
          ...(data.avatar_url && { avatar_url: data.avatar_url }),
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      toast({
        title: 'تم تحديث الملف الشخصي',
        description: 'تم تحديث معلومات ملفك الشخصي بنجاح',
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول باستخدام جوجل
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // تحديد عنوان إعادة التوجيه بناءً على البيئة الحالية
      let redirectTo;
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('repl.co')) {
        redirectTo = `${window.location.origin}/auth/callback`;
      } else if (window.location.hostname === 'echoshop-eg.web.app') {
        redirectTo = 'https://echoshop-eg.web.app/auth/callback';
      } else {
        // في حالة وجود مجالات أخرى في المستقبل
        redirectTo = `${window.location.origin}/auth/callback`;
      }
      
      console.log('تسجيل الدخول باستخدام Google مع إعادة التوجيه إلى:', redirectTo);
      console.log('نطاق الموقع الحالي:', window.location.hostname);
        
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('خطأ في تسجيل الدخول مع Google:', error);
        return { success: false, error: `فشل تسجيل الدخول باستخدام جوجل: ${error.message}` };
      }

      if (!data.url) {
        console.error('لم يتم إرجاع رابط إعادة التوجيه من Supabase');
        return { success: false, error: 'لم يتم إرجاع رابط إعادة التوجيه من Supabase' };
      }

      // توجيه المستخدم تلقائيًا إلى رابط المصادقة من جوجل
      console.log('توجيه المستخدم إلى:', data.url);
      window.location.href = data.url;

      return { success: true };
    } catch (err: any) {
      console.error('استثناء في تسجيل الدخول مع Google:', err);
      return { success: false, error: `خطأ غير متوقع: ${err.message}` };
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    session,
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

// هوك لاستخدام سياق المصادقة في المكونات
export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  
  if (context === undefined) {
    throw new Error('يجب استخدام useSupabaseAuth داخل SupabaseAuthProvider');
  }
  
  return context;
}