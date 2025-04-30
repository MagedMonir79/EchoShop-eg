import React, { useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from '@/hooks/use-translation';
import { AdminLayout } from '@/components/layout/admin-layout';
import {
  ArrowLeft,
  Save,
  Image,
  Plus,
  X,
  Check,
  Upload
} from 'lucide-react';

// Add product page component
export default function AdminAddProductPage() {
  const { t, language } = useTranslation();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    salePrice: '',
    cost: '',
    stock: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    categoryId: '',
    brand: '',
    tags: '',
    status: 'draft',
    featured: false,
    hasVariants: false,
  });
  
  // Mock categories
  const categories = [
    { id: 1, name: 'الإلكترونيات' },
    { id: 2, name: 'الملابس' },
    { id: 3, name: 'الأجهزة المنزلية' },
    { id: 4, name: 'مستلزمات المنزل' },
    { id: 5, name: 'الأطعمة والمشروبات' },
    { id: 6, name: 'العناية الشخصية' },
    { id: 7, name: 'الألعاب والترفيه' },
  ];
  
  // Mock brands
  const brands = [
    'سامسونج',
    'آبل',
    'نايكي',
    'أديداس',
    'إل جي',
    'سوني',
    'فيليبس',
    'زارا',
    'اتش اند ام',
    'دايسون',
  ];
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<string, string>),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages]);
    }
  };
  
  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving to the backend
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/admin/products">
                <a className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md">
                  <ArrowLeft className="h-5 w-5" />
                </a>
              </Link>
              <h1 className="text-3xl font-bold">{t('addNewProduct')}</h1>
            </div>
            <p className="text-gray-400 mt-1">{t('addNewProductDescription')}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
            >
              {t('cancel')}
            </button>
            
            <button
              type="submit"
              form="product-form"
              className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                  {t('saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t('saveProduct')}
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Success message */}
        {showSuccess && (
          <div className="bg-green-900/20 border border-green-800 text-green-500 px-4 py-3 rounded-md flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span>{t('productSaved')}</span>
          </div>
        )}
        
        <form id="product-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-6">{t('basicInformation')}</h2>
                
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('productName')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  
                  {/* Product Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('productDescription')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
              </div>
              
              {/* Images */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-6">{t('productImages')}</h2>
                
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="grid grid-cols-5 gap-4">
                    {/* Image Upload Button */}
                    <div className="h-32 border-2 border-dashed border-gray-700 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                      <label htmlFor="image-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="h-6 w-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">{t('addImages')}</span>
                        <input
                          type="file"
                          id="image-upload"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    
                    {/* Image Previews */}
                    {images.map((image, index) => (
                      <div key={index} className="relative h-32 bg-gray-800 rounded-md overflow-hidden">
                        <img src={image} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full"
                          title={t('removeImage')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-blue-500/80 text-white px-1.5 py-0.5 rounded text-xs">
                            {t('main')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    {t('imageUploadHint')}
                  </p>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-6">{t('pricing')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Regular Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('regularPrice')} *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">ج.م</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sale Price */}
                  <div>
                    <label htmlFor="salePrice" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('salePrice')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="salePrice"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">ج.م</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cost Price */}
                  <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('costPrice')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Inventory */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-6">{t('inventory')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SKU */}
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('sku')} *
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  {/* Stock */}
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('stock')} *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              
              {/* Shipping */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-6">{t('shipping')}</h2>
                
                <div className="space-y-6">
                  {/* Weight */}
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('weight')} (كجم)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  {/* Dimensions */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="dimensions.length" className="block text-sm font-medium text-gray-300 mb-2">
                        {t('length')} (سم)
                      </label>
                      <input
                        type="number"
                        id="dimensions.length"
                        name="dimensions.length"
                        value={formData.dimensions.length}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="dimensions.width" className="block text-sm font-medium text-gray-300 mb-2">
                        {t('width')} (سم)
                      </label>
                      <input
                        type="number"
                        id="dimensions.width"
                        name="dimensions.width"
                        value={formData.dimensions.width}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="dimensions.height" className="block text-sm font-medium text-gray-300 mb-2">
                        {t('height')} (سم)
                      </label>
                      <input
                        type="number"
                        id="dimensions.height"
                        name="dimensions.height"
                        value={formData.dimensions.height}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Organization */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-6">{t('organization')}</h2>
                
                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('category')} *
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t('selectCategory')}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id.toString()}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Brand */}
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('brand')}
                    </label>
                    <select
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t('selectBrand')}</option>
                      {brands.map((brand, index) => (
                        <option key={index} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('tags')}
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder={t('tagsPlaceholder')}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <p className="mt-1 text-xs text-gray-400">{t('tagsSeparator')}</p>
                  </div>
                </div>
              </div>
              
              {/* Product Status */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-6">{t('productStatus')}</h2>
                
                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('status')}
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="draft">{t('draft')}</option>
                      <option value="active">{t('active')}</option>
                      <option value="out_of_stock">{t('outOfStock')}</option>
                    </select>
                  </div>
                  
                  {/* Featured */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-200">{t('featuredProduct')}</h3>
                      <p className="text-xs text-gray-400 mt-1">{t('featuredProductDescription')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  {/* Has Variants */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-200">{t('hasVariants')}</h3>
                      <p className="text-xs text-gray-400 mt-1">{t('hasVariantsDescription')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        name="hasVariants"
                        checked={formData.hasVariants}
                        onChange={handleInputChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}