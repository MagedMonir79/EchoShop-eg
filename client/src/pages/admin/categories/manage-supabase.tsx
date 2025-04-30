import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { AdminSupabaseLayout } from '@/components/layout/admin-supabase-layout';
import { supabaseDb } from '@/lib/supabaseClient';
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// نموذج Zod للتحقق من الفئة
const categorySchema = z.object({
  name: z.string().min(2, { message: 'اسم الفئة يجب أن يكون أكثر من حرفين' }),
  description: z.string().optional(),
  slug: z
    .string()
    .min(2, { message: 'الاسم المختصر يجب أن يكون أكثر من حرفين' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'الاسم المختصر يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط',
    }),
  image_url: z.string().optional(),
  parent_id: z.number().nullable().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

// واجهة الفئة
interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  parent_id: number | null;
  created_at: string;
}

// صفحة إدارة الفئات باستخدام Supabase
export default function ManageCategoriesSupabase() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const isRtl = language === 'ar';
  
  // حالة الصفحة
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // نموذج React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      image_url: '',
      parent_id: null,
    },
  });

  // تحميل الفئات عند تحميل الصفحة
  useEffect(() => {
    loadCategories();
  }, []);

  // تحميل الفئات من Supabase
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await supabaseDb.getCategories();
      setCategories(data);
      
      // تحديد الفئات الأساسية (التي ليس لها أب)
      const parentCats = data.filter(cat => !cat.parent_id);
      setParentCategories(parentCats);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'خطأ في تحميل الفئات',
        description: 'حدث خطأ أثناء تحميل الفئات، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // الفئات المصفاة حسب البحث
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // فتح نافذة الإضافة
  const openAddDialog = () => {
    reset();
    setIsAddDialogOpen(true);
  };

  // فتح نافذة التعديل
  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setValue('name', category.name);
    setValue('description', category.description || '');
    setValue('slug', category.slug);
    setValue('image_url', category.image_url || '');
    setValue('parent_id', category.parent_id);
    setIsEditDialogOpen(true);
  };

  // فتح نافذة الحذف
  const openDeleteDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // إغلاق جميع النوافذ
  const closeAllDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setCurrentCategory(null);
    reset();
  };

  // إرسال نموذج إضافة فئة جديدة
  const onSubmitAdd = async (data: CategoryFormData) => {
    setIsProcessing(true);
    try {
      const newCategory = await supabaseDb.addCategory({
        name: data.name,
        description: data.description || null,
        slug: data.slug,
        image_url: data.image_url || null,
        parent_id: data.parent_id || null,
        created_at: new Date(),
      });
      
      if (newCategory) {
        toast({
          title: 'تمت إضافة الفئة',
          description: 'تمت إضافة الفئة بنجاح',
        });
        closeAllDialogs();
        loadCategories();
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'خطأ في إضافة الفئة',
        description: 'حدث خطأ أثناء إضافة الفئة، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // إرسال نموذج تعديل الفئة
  const onSubmitEdit = async (data: CategoryFormData) => {
    if (!currentCategory) return;
    
    setIsProcessing(true);
    try {
      const updatedCategory = await supabaseDb.updateCategory(currentCategory.id, {
        name: data.name,
        description: data.description || null,
        slug: data.slug,
        image_url: data.image_url || null,
        parent_id: data.parent_id || null,
      });
      
      if (updatedCategory) {
        toast({
          title: 'تم تحديث الفئة',
          description: 'تم تحديث الفئة بنجاح',
        });
        closeAllDialogs();
        loadCategories();
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'خطأ في تحديث الفئة',
        description: 'حدث خطأ أثناء تحديث الفئة، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // حذف الفئة
  const confirmDelete = async () => {
    if (!currentCategory) return;
    
    setIsProcessing(true);
    try {
      const result = await supabaseDb.deleteCategory(currentCategory.id);
      
      if (result.success) {
        toast({
          title: 'تم حذف الفئة',
          description: 'تم حذف الفئة بنجاح',
        });
        closeAllDialogs();
        loadCategories();
      } else {
        toast({
          title: 'لا يمكن حذف الفئة',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'خطأ في حذف الفئة',
        description: 'حدث خطأ أثناء حذف الفئة، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      closeAllDialogs();
    }
  };

  // الحصول على اسم الفئة الأب
  const getParentCategoryName = (parentId: number | null) => {
    if (!parentId) return '-';
    
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : '-';
  };

  return (
    <AdminSupabaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('manageCategories')} (Supabase)</h1>
          
          <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-md text-sm">
            Supabase Database
          </div>
        </div>
        
        {/* أدوات البحث والإضافة */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('searchCategories')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
          
          <Button onClick={openAddDialog} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            {t('addNewCategory')}
          </Button>
        </div>
        
        {/* جدول الفئات */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              {searchQuery ? t('noSearchResults') : t('noCategories')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? t('tryAnotherSearch')
                : t('addYourFirstCategory')}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('slug')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('parentCategory')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {category.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{category.slug}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getParentCategoryName(category.parent_id)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t('edit')}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(category)}
                          className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t('delete')}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* نافذة إضافة فئة جديدة */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('addNewCategory')}</DialogTitle>
            <DialogDescription>
              {t('fillCategoryDetails')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t('categoryName')} *
              </label>
              <Input
                id="name"
                {...register('name')}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                {t('slug')} *
              </label>
              <Input
                id="slug"
                {...register('slug')}
                dir="ltr"
                placeholder="example-category"
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                {t('description')}
              </label>
              <Input
                id="description"
                {...register('description')}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="parent_id" className="text-sm font-medium">
                {t('parentCategory')}
              </label>
              <select
                id="parent_id"
                {...register('parent_id', { setValueAs: value => value === '' ? null : Number(value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="">{t('noParentCategory')}</option>
                {parentCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image_url" className="text-sm font-medium">
                {t('imageUrl')}
              </label>
              <Input
                id="image_url"
                {...register('image_url')}
                dir="ltr"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeAllDialogs}
                disabled={isProcessing}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  t('add')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* نافذة تعديل الفئة */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('editCategory')}</DialogTitle>
            <DialogDescription>
              {t('editCategoryDetails')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit_name" className="text-sm font-medium">
                {t('categoryName')} *
              </label>
              <Input
                id="edit_name"
                {...register('name')}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit_slug" className="text-sm font-medium">
                {t('slug')} *
              </label>
              <Input
                id="edit_slug"
                {...register('slug')}
                dir="ltr"
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit_description" className="text-sm font-medium">
                {t('description')}
              </label>
              <Input
                id="edit_description"
                {...register('description')}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit_parent_id" className="text-sm font-medium">
                {t('parentCategory')}
              </label>
              <select
                id="edit_parent_id"
                {...register('parent_id', { setValueAs: value => value === '' ? null : Number(value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="">{t('noParentCategory')}</option>
                {parentCategories
                  .filter(category => category.id !== currentCategory?.id)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit_image_url" className="text-sm font-medium">
                {t('imageUrl')}
              </label>
              <Input
                id="edit_image_url"
                {...register('image_url')}
                dir="ltr"
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeAllDialogs}
                disabled={isProcessing}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  t('update')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* نافذة تأكيد الحذف */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteCategoryConfirmation')}
              <span className="font-medium text-black dark:text-white block mt-2">
                {currentCategory?.name}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                t('delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminSupabaseLayout>
  );
}