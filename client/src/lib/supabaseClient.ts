import { createClient } from '@supabase/supabase-js';

// إعداد Supabase client
// هذه المتغيرات البيئية يجب إضافتها إلى بيئة المشروع
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// للتشخيص: طباعة قيم الإعدادات بدون كشف المفاتيح الكاملة
console.log("Firebase Config:", {
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID
});

console.log("Supabase Config:", { 
  hasUrl: !!supabaseUrl, 
  hasKey: !!supabaseKey,
  urlStart: supabaseUrl ? supabaseUrl.substring(0, 10) + '...' : 'missing',
});

// التحقق من وجود المتغيرات البيئية المطلوبة
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Anon Key is missing. Supabase functionality will not work correctly.');
}

// إنشاء عميل Supabase مع إعدادات إضافية
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// توثيق بسيط لطرق معالجة المستخدمين
export const supabaseAuth = {
  // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
  signInWithEmail: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // تسجيل الدخول باستخدام Google
  signInWithGoogle: async () => {
    // استخدام عنوان ثابت إذا كنت تعرف URL النهائي للتطبيق
    const currentDomain = window.location.hostname === 'localhost' 
      ? `${window.location.origin}/auth/callback`
      : 'https://echoshop-eg.web.app/auth/callback';
      
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: currentDomain,
      },
    });
  },

  // تسجيل مستخدم جديد
  signUp: async (email: string, password: string, metadata: any = {}, options: any = {}) => {
    const currentDomain = window.location.hostname === 'localhost' 
      ? `${window.location.origin}/auth/callback`
      : 'https://echoshop-eg.web.app/auth/callback';
      
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: options.emailRedirectTo || currentDomain,
        ...options
      },
    });
  },

  // تسجيل الخروج
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // الحصول على جلسة المستخدم الحالية
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  // الحصول على المستخدم الحالي
  getUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // إعادة تعيين كلمة المرور
  resetPassword: async (email: string) => {
    const currentDomain = window.location.hostname === 'localhost' 
      ? `${window.location.origin}/reset-password`
      : 'https://echoshop-eg.web.app/reset-password';
      
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: currentDomain,
    });
  },
};

// دوال Supabase للتعامل مع البيانات
export const supabaseDb = {
  // الحصول على بيانات المستخدم من جدول profiles
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  },

  // تحديث ملف تعريف المستخدم
  updateUserProfile: async (userId: string, profileData: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    return data;
  },

  // الحصول على المنتجات
  getProducts: async (limit = 10, offset = 0, categoryId?: number) => {
    let query = supabase
      .from('products')
      .select('*')
      .range(offset, offset + limit - 1);
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data;
  },

  // الحصول على تفاصيل منتج
  getProductById: async (productId: number) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    return data;
  },

  // إضافة منتج جديد
  addProduct: async (productData: any) => {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();
    
    if (error) {
      console.error('Error adding product:', error);
      return null;
    }
    
    return data[0];
  },

  // تحديث منتج
  updateProduct: async (productId: number, productData: any) => {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select();
    
    if (error) {
      console.error('Error updating product:', error);
      return null;
    }
    
    return data[0];
  },

  // حذف منتج
  deleteProduct: async (productId: number) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    return true;
  },

  // الحصول على التصنيفات
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data;
  },
  
  // الحصول على تصنيف بواسطة المعرف
  getCategoryById: async (categoryId: number) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();
    
    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }
    
    return data;
  },
  
  // إضافة تصنيف جديد
  addCategory: async (categoryData: any) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select();
    
    if (error) {
      console.error('Error adding category:', error);
      return null;
    }
    
    return data[0];
  },
  
  // تحديث تصنيف
  updateCategory: async (categoryId: number, categoryData: any) => {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', categoryId)
      .select();
    
    if (error) {
      console.error('Error updating category:', error);
      return null;
    }
    
    return data[0];
  },
  
  // حذف تصنيف
  deleteCategory: async (categoryId: number) => {
    // قبل الحذف، تحقق مما إذا كان هناك منتجات مرتبطة بهذا التصنيف
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);
    
    if (countError) {
      console.error('Error checking related products:', countError);
      return { success: false, message: 'Failed to check related products' };
    }
    
    // إذا كان هناك منتجات مرتبطة، لا تسمح بالحذف
    if (count && count > 0) {
      return { 
        success: false, 
        message: `Cannot delete category. ${count} products are using this category.` 
      };
    }
    
    // إذا لم تكن هناك منتجات مرتبطة، قم بالحذف
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
    
    if (error) {
      console.error('Error deleting category:', error);
      return { success: false, message: error.message };
    }
    
    return { success: true };
  },
};

// دوال Supabase للتعامل مع الملفات
export const supabaseStorage = {
  // رفع ملف
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    return data.path;
  },

  // الحصول على رابط عام للملف
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  // حذف ملف
  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  },
};