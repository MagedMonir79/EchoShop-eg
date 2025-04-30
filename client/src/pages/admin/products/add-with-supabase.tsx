import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { AdminSupabaseLayout } from '@/components/layout/admin-supabase-layout';
import { PlusCircle, Upload, X } from 'lucide-react';
import { supabaseDb, supabaseStorage } from '@/lib/supabaseClient';

// تعليق: هذه الصفحة تستخدم Supabase لتخزين المنتجات بدلاً من Firebase
// هذا مثال على كيفية التعامل مع ميزة جديدة باستخدام Supabase

// مخطط نموذج إضافة المنتج
const productSchema = z.object({
  name: z.string().min(3, { message: 'اسم المنتج يجب أن يكون 3 أحرف على الأقل' }),
  description: z.string().min(10, { message: 'وصف المنتج يجب أن يكون 10 أحرف على الأقل' }),
  price: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: 'السعر يجب أن يكون رقم موجب' }
  ),
  categoryId: z.string().min(1, { message: 'يرجى اختيار تصنيف' }),
  sku: z.string().optional(),
  stockQuantity: z.string().refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
    { message: 'الكمية يجب أن تكون رقم صحيح غير سالب' }
  ),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductWithSupabase() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const isRtl = language === 'ar';
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // استخدام React Hook Form مع مخطط Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      categoryId: '',
      sku: '',
      stockQuantity: '0',
    }
  });

  // معالجة تغيير الملفات
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  // حذف صورة
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // رفع الصور إلى Supabase Storage
  const uploadImages = async () => {
    if (images.length === 0) return [];

    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      try {
        const filePath = await supabaseStorage.uploadFile('products', fileName, file);
        
        if (filePath) {
          const url = supabaseStorage.getPublicUrl('products', filePath);
          uploadedUrls.push(url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'خطأ في رفع الصورة',
          description: 'حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى',
          variant: 'destructive',
        });
      }
    }
    
    return uploadedUrls;
  };

  // إرسال النموذج
  const onSubmit = async (data: ProductFormData) => {
    try {
      setUploading(true);
      
      // رفع الصور
      const imageUrls = await uploadImages();
      
      // إنشاء كائن المنتج
      const product = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category_id: parseInt(data.categoryId),
        sku: data.sku || null,
        stock_quantity: parseInt(data.stockQuantity),
        images: imageUrls,
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',
      };
      
      // إضافة المنتج إلى Supabase
      const newProduct = await supabaseDb.addProduct(product);
      
      if (newProduct) {
        toast({
          title: 'تمت إضافة المنتج بنجاح',
          description: 'تم إضافة المنتج إلى قاعدة البيانات',
        });
        
        // إعادة تعيين النموذج
        reset();
        setImages([]);
        setImageUrls([]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'خطأ في إضافة المنتج',
        description: 'حدث خطأ أثناء إضافة المنتج، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // تحميل التصنيفات من Supabase
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await supabaseDb.getCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'خطأ في تحميل التصنيفات',
          description: 'حدث خطأ أثناء تحميل التصنيفات، يرجى المحاولة مرة أخرى',
          variant: 'destructive',
        });
      }
    };
    
    fetchCategories();
  }, [toast]);

  return (
    <AdminSupabaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('addNewProduct')} (Supabase)</h1>
          
          <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-md text-sm">
            Supabase Storage
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* معلومات المنتج الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  {t('productName')} *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
                {errors.name && (
                  <span className="text-sm text-red-500">{errors.name.message}</span>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium">
                  {t('price')} ({t('currency')}) *
                </label>
                <input
                  id="price"
                  type="text"
                  {...register('price')}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100"
                  dir="ltr"
                />
                {errors.price && (
                  <span className="text-sm text-red-500">{errors.price.message}</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                {t('productDescription')} *
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100"
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description.message}</span>
              )}
            </div>
            
            {/* معلومات إضافية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="categoryId" className="block text-sm font-medium">
                  {t('category')} *
                </label>
                <select
                  id="categoryId"
                  {...register('categoryId')}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <option value="">{t('selectCategory')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="text-sm text-red-500">{errors.categoryId.message}</span>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="sku" className="block text-sm font-medium">
                  {t('sku')}
                </label>
                <input
                  id="sku"
                  type="text"
                  {...register('sku')}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100"
                  dir="ltr"
                />
                {errors.sku && (
                  <span className="text-sm text-red-500">{errors.sku.message}</span>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="stockQuantity" className="block text-sm font-medium">
                  {t('stockQuantity')} *
                </label>
                <input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  {...register('stockQuantity')}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100"
                  dir="ltr"
                />
                {errors.stockQuantity && (
                  <span className="text-sm text-red-500">{errors.stockQuantity.message}</span>
                )}
              </div>
            </div>
            
            {/* تحميل الصور */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                {t('productImages')}
              </label>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="product-images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <label
                  htmlFor="product-images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('dragOrClickToUpload')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </label>
              </div>
              
              {/* معاينة الصور */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                  {images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Product image ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-md border border-gray-300 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* أزرار الإرسال */}
            <div className="flex justify-end space-x-4 rtl:space-x-reverse">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => reset()}
              >
                {t('cancel')}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="px-4 py-2 bg-primary rounded-md text-white hover:bg-primary/90 disabled:opacity-50 flex items-center"
              >
                {(isSubmitting || uploading) ? (
                  <>
                    <span className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {t('saving')}
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                    {t('addProduct')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminSupabaseLayout>
  );
}