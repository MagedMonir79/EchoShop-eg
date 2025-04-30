import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { AdminLayout } from '@/components/layout/admin-layout';
import { 
  ChevronDown, 
  Upload,
  Sun,
  Moon,
  RotateCcw,
  Check
} from 'lucide-react';

// Color theme option interface
interface ColorTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDark: boolean;
}

// Font option interface
interface FontOption {
  id: string;
  name: string;
  family: string;
  sample: string;
}

// Settings theme page component
export default function AdminSettingsThemePage() {
  const { t, language } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<string>('default-dark');
  const [primaryColor, setPrimaryColor] = useState<string>('#f59e0b');
  const [secondaryColor, setSecondaryColor] = useState<string>('#4f46e5');
  const [accentColor, setAccentColor] = useState<string>('#10b981');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [selectedFont, setSelectedFont] = useState<string>('cairo');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  // Mock color themes
  const colorThemes: ColorTheme[] = [
    {
      id: 'default-dark',
      name: t('defaultDark'),
      primaryColor: '#f59e0b',
      secondaryColor: '#4f46e5',
      accentColor: '#10b981',
      isDark: true,
    },
    {
      id: 'default-light',
      name: t('defaultLight'),
      primaryColor: '#f59e0b',
      secondaryColor: '#4f46e5',
      accentColor: '#10b981',
      isDark: false,
    },
    {
      id: 'blue-theme',
      name: t('blueTheme'),
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      accentColor: '#0ea5e9',
      isDark: true,
    },
    {
      id: 'green-theme',
      name: t('greenTheme'),
      primaryColor: '#10b981',
      secondaryColor: '#047857',
      accentColor: '#34d399',
      isDark: true,
    },
    {
      id: 'purple-theme',
      name: t('purpleTheme'),
      primaryColor: '#8b5cf6',
      secondaryColor: '#6d28d9',
      accentColor: '#a855f7',
      isDark: true,
    },
    {
      id: 'red-theme',
      name: t('redTheme'),
      primaryColor: '#ef4444',
      secondaryColor: '#b91c1c',
      accentColor: '#f87171',
      isDark: true,
    },
  ];
  
  // Mock font options
  const fontOptions: FontOption[] = [
    {
      id: 'cairo',
      name: 'Cairo',
      family: 'Cairo, sans-serif',
      sample: 'أبجد هوز حطي كلمن ABC 123',
    },
    {
      id: 'tajawal',
      name: 'Tajawal',
      family: 'Tajawal, sans-serif',
      sample: 'أبجد هوز حطي كلمن ABC 123',
    },
    {
      id: 'changa',
      name: 'Changa',
      family: 'Changa, sans-serif',
      sample: 'أبجد هوز حطي كلمن ABC 123',
    },
    {
      id: 'almarai',
      name: 'Almarai',
      family: 'Almarai, sans-serif',
      sample: 'أبجد هوز حطي كلمن ABC 123',
    },
    {
      id: 'sans-serif',
      name: 'Sans Serif',
      family: 'system-ui, sans-serif',
      sample: 'أبجد هوز حطي كلمن ABC 123',
    },
  ];
  
  // Handle theme selection
  const handleSelectTheme = (themeId: string) => {
    const theme = colorThemes.find(theme => theme.id === themeId);
    if (theme) {
      setSelectedTheme(themeId);
      setPrimaryColor(theme.primaryColor);
      setSecondaryColor(theme.secondaryColor);
      setAccentColor(theme.accentColor);
      setIsDarkMode(theme.isDark);
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
  
  // Reset colors to theme defaults
  const resetToThemeDefaults = () => {
    const theme = colorThemes.find(theme => theme.id === selectedTheme);
    if (theme) {
      setPrimaryColor(theme.primaryColor);
      setSecondaryColor(theme.secondaryColor);
      setAccentColor(theme.accentColor);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t('themeSettings')}</h1>
          <p className="text-gray-400 mt-1">{t('themeSettingsDescription')}</p>
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
            {/* Color Theme Selection */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6">{t('colorTheme')}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {colorThemes.map((theme) => (
                  <div 
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`cursor-pointer rounded-lg border ${
                      selectedTheme === theme.id 
                        ? 'border-primary' 
                        : 'border-gray-700 hover:border-gray-600'
                    } p-4 ${theme.isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={theme.isDark ? 'text-gray-200' : 'text-gray-800'}>
                        {theme.name}
                      </span>
                      <div className={`h-5 w-5 rounded-full ${
                        selectedTheme === theme.id ? 'bg-primary' : 'bg-transparent border border-gray-600'
                      } flex items-center justify-center`}>
                        {selectedTheme === theme.id && (
                          <Check className="h-3 w-3 text-black" />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                      <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.secondaryColor }}></div>
                      <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Custom Colors */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{t('customColors')}</h2>
                <button 
                  type="button"
                  onClick={resetToThemeDefaults}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('resetToDefaults')}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('primaryColor')}
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-md border border-gray-700" 
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-full bg-gray-800 border border-gray-700 rounded-md p-1"
                    />
                  </div>
                </div>
                
                {/* Secondary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('secondaryColor')}
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-md border border-gray-700" 
                      style={{ backgroundColor: secondaryColor }}
                    ></div>
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-10 w-full bg-gray-800 border border-gray-700 rounded-md p-1"
                    />
                  </div>
                </div>
                
                {/* Accent Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('accentColor')}
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-md border border-gray-700" 
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-10 w-full bg-gray-800 border border-gray-700 rounded-md p-1"
                    />
                  </div>
                </div>
              </div>
              
              {/* Dark Mode Toggle */}
              <div className="mt-6 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  {t('darkMode')}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{t('lightMode')}</span>
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-700"
                  >
                    <span
                      className={`${
                        isDarkMode ? 'translate-x-5 bg-primary' : 'translate-x-0 bg-white'
                      } pointer-events-none relative inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out`}
                    >
                      {isDarkMode ? (
                        <Moon className="h-3 w-3 text-black" />
                      ) : (
                        <Sun className="h-3 w-3 text-gray-700" />
                      )}
                    </span>
                  </button>
                  <span className="text-sm text-gray-400">{t('darkMode')}</span>
                </div>
              </div>
            </div>
            
            {/* Typography */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6">{t('typography')}</h2>
              
              <div className="space-y-6">
                {/* Font Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('primaryFont')}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="block w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 appearance-none"
                    >
                      {fontOptions.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                
                {/* Font Preview */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('fontPreview')}
                  </label>
                  <div 
                    className="p-4 bg-gray-800 rounded-md"
                    style={{ fontFamily: fontOptions.find(f => f.id === selectedFont)?.family }}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <p className="text-xl mb-2">
                      {fontOptions.find(f => f.id === selectedFont)?.sample}
                    </p>
                    <p className="text-gray-400">
                      {t('fontPreviewDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Logo and Branding */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6">{t('logoAndBranding')}</h2>
              
              <div className="space-y-6">
                {/* Site Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('siteLogo')}
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Logo Preview */}
                    <div className="h-20 w-20 bg-gray-800 rounded-md border border-gray-700 flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="max-h-full max-w-full" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-500">لوجو</span>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div>
                      <label className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm cursor-pointer">
                        <Upload className="h-4 w-4" />
                        {t('uploadLogo')}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('recommendedSize')}: 200x200px
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Favicon */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('favicon')}
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Favicon Preview */}
                    <div className="h-10 w-10 bg-gray-800 rounded-md border border-gray-700 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">F</span>
                    </div>
                    
                    {/* Upload Button */}
                    <div>
                      <label className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm cursor-pointer">
                        <Upload className="h-4 w-4" />
                        {t('uploadFavicon')}
                        <input
                          type="file"
                          accept="image/png,image/x-icon"
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('recommendedSize')}: 32x32px
                      </p>
                    </div>
                  </div>
                </div>
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
                  t('saveChanges')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}