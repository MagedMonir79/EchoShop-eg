import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { AdminLayout } from '@/components/layout/admin-layout';
import { 
  Check,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from 'lucide-react';

// Settings general page component
export default function AdminSettingsGeneralPage() {
  const { t, language } = useTranslation();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  // Form state
  const [formData, setFormData] = useState({
    storeName: 'إيكو شوب',
    storeDescription: 'متجر إلكتروني متكامل لجميع المنتجات بأفضل الأسعار وجودة عالية',
    storeEmail: 'info@echoshop.com',
    storePhone: '+201234567890',
    storeAddress: 'القاهرة، مصر',
    storeWebsite: 'www.echoshop.com',
    instagramUrl: 'https://instagram.com/echoshop',
    facebookUrl: 'https://facebook.com/echoshop',
    twitterUrl: 'https://twitter.com/echoshop',
    youtubeUrl: 'https://youtube.com/c/echoshop',
    enableReviews: true,
    enableWishlist: true,
    enableCompare: true,
    enableNewsletter: true,
    maintenanceMode: false,
  });
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
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
        <div>
          <h1 className="text-3xl font-bold">{t('generalSettings')}</h1>
          <p className="text-gray-400 mt-1">{t('generalSettingsDescription')}</p>
        </div>
        
        {/* Success message */}
        {showSuccess && (
          <div className="bg-green-900/20 border border-green-800 text-green-500 px-4 py-3 rounded-md flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span>{t('settingsSaved')}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Store Information */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6">{t('storeInformation')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Store Name */}
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('storeName')} *
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                {/* Store Description */}
                <div className="md:col-span-2">
                  <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('storeDescription')}
                  </label>
                  <textarea
                    id="storeDescription"
                    name="storeDescription"
                    value={formData.storeDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                
                {/* Contact Information */}
                <div>
                  <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('storeEmail')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      id="storeEmail"
                      name="storeEmail"
                      value={formData.storeEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="storePhone" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('storePhone')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="storePhone"
                      name="storePhone"
                      value={formData.storePhone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('storeAddress')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="storeAddress"
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="storeWebsite" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('storeWebsite')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="storeWebsite"
                      name="storeWebsite"
                      value={formData.storeWebsite}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6">{t('socialMedia')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('instagram')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Instagram className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="instagramUrl"
                      name="instagramUrl"
                      value={formData.instagramUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('facebook')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Facebook className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="facebookUrl"
                      name="facebookUrl"
                      value={formData.facebookUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('twitter')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Twitter className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="twitterUrl"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('youtube')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Youtube className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="youtubeUrl"
                      name="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Store Features */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6">{t('storeFeatures')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">{t('enableProductReviews')}</h3>
                    <p className="text-xs text-gray-400 mt-1">{t('enableProductReviewsDescription')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="enableReviews"
                      checked={formData.enableReviews}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">{t('enableWishlist')}</h3>
                    <p className="text-xs text-gray-400 mt-1">{t('enableWishlistDescription')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      name="enableWishlist"
                      checked={formData.enableWishlist}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">{t('enableCompareProducts')}</h3>
                    <p className="text-xs text-gray-400 mt-1">{t('enableCompareProductsDescription')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      name="enableCompare"
                      checked={formData.enableCompare}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">{t('enableNewsletter')}</h3>
                    <p className="text-xs text-gray-400 mt-1">{t('enableNewsletterDescription')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      name="enableNewsletter"
                      checked={formData.enableNewsletter}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Maintenance Mode */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{t('maintenanceMode')}</h2>
                  <p className="text-gray-400 mt-1">{t('maintenanceModeDescription')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    name="maintenanceMode"
                    checked={formData.maintenanceMode}
                    onChange={handleInputChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            {/* Save Button */}
            <div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-md font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                    {t('saveChanges')}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}