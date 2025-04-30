import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Settings, Save, PaintBucket, Upload, Trash2, Store, Truck, CreditCard, AlertTriangle } from "lucide-react";

export default function AdminSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "EchoShop",
    siteNameAr: "إيكو شوب",
    siteDescription: "Advanced multilingual e-commerce platform",
    siteDescriptionAr: "منصة تجارة إلكترونية متقدمة متعددة اللغات",
    customerSupportEmail: "support@echoshop.com",
    customerSupportPhone: "+201234567890"
  });
  
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#84cc16",
    secondaryColor: "#1e293b",
    accentColor: "#0ea5e9",
    backgroundColor: "#0f172a",
    textColor: "#f8fafc",
    cardBackgroundColor: "#1e293b",
    borderColor: "#334155",
    logoUrl: ""
  });
  
  const [shippingCompanies, setShippingCompanies] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  
  // Fetch settings
  const { data: appSettings, isLoading } = useQuery({
    queryKey: ['/api/settings'],
    onSuccess: (data) => {
      // Update state with fetched settings
      if (data) {
        if (data.general) {
          setGeneralSettings(data.general);
        }
        if (data.theme) {
          setThemeSettings(data.theme);
        }
      }
    }
  });
  
  // Fetch shipping companies
  const { data: companies } = useQuery({
    queryKey: ['/api/shipping/companies'],
    onSuccess: (data) => {
      if (data) {
        setShippingCompanies(data);
      }
    }
  });
  
  // Fetch payment methods
  const { data: payments } = useQuery({
    queryKey: ['/api/payment/methods'],
    onSuccess: (data) => {
      if (data) {
        setPaymentMethods(data);
      }
    }
  });
  
  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      const res = await apiRequest("PUT", "/api/settings", settings);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: t("settingsSaved") || "تم حفظ الإعدادات",
        description: t("settingsUpdatedSuccessfully") || "تم تحديث إعدادات الموقع بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("errorSavingSettings") || "خطأ في حفظ الإعدادات",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Upload logo mutation
  const uploadLogoMutation = useMutation({
    mutationFn: async (logoFile: File) => {
      const formData = new FormData();
      formData.append("logo", logoFile);
      
      const res = await apiRequest("POST", "/api/settings/logo", formData, {
        headers: {}  // Let the browser set the correct Content-Type with boundary
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setThemeSettings(prev => ({
        ...prev,
        logoUrl: data.logoUrl
      }));
      
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: t("logoUploaded") || "تم رفع الشعار",
        description: t("logoUploadedSuccessfully") || "تم رفع الشعار بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("errorUploadingLogo") || "خطأ في رفع الشعار",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleThemeSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThemeSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadLogo = () => {
    if (newLogoFile) {
      uploadLogoMutation.mutate(newLogoFile);
    }
  };
  
  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      general: generalSettings,
      theme: themeSettings
    });
  };
  
  // Apply theme colors to preview
  useEffect(() => {
    document.documentElement.style.setProperty('--admin-preview-primary', themeSettings.primaryColor);
    document.documentElement.style.setProperty('--admin-preview-secondary', themeSettings.secondaryColor);
    document.documentElement.style.setProperty('--admin-preview-accent', themeSettings.accentColor);
    document.documentElement.style.setProperty('--admin-preview-background', themeSettings.backgroundColor);
    document.documentElement.style.setProperty('--admin-preview-text', themeSettings.textColor);
    document.documentElement.style.setProperty('--admin-preview-card', themeSettings.cardBackgroundColor);
    document.documentElement.style.setProperty('--admin-preview-border', themeSettings.borderColor);
    
    return () => {
      // Clean up
      document.documentElement.style.removeProperty('--admin-preview-primary');
      document.documentElement.style.removeProperty('--admin-preview-secondary');
      document.documentElement.style.removeProperty('--admin-preview-accent');
      document.documentElement.style.removeProperty('--admin-preview-background');
      document.documentElement.style.removeProperty('--admin-preview-text');
      document.documentElement.style.removeProperty('--admin-preview-card');
      document.documentElement.style.removeProperty('--admin-preview-border');
    };
  }, [themeSettings]);
  
  return (
    <AdminLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("siteSettings") || "إعدادات الموقع"}</h1>
          <Button 
            onClick={handleSaveSettings}
            className="bg-primary hover:bg-lime-500 text-black gap-2"
            disabled={updateSettingsMutation.isPending}
          >
            <Save className="h-4 w-4" />
            {updateSettingsMutation.isPending
              ? t("saving") || "جاري الحفظ..."
              : t("saveSettings") || "حفظ الإعدادات"}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-4 w-full max-w-4xl bg-mediumBlue">
            <TabsTrigger value="general" className="gap-2 py-3">
              <Settings className="h-4 w-4" />
              {t("general") || "عام"}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2 py-3">
              <PaintBucket className="h-4 w-4" />
              {t("appearance") || "المظهر"}
            </TabsTrigger>
            <TabsTrigger value="shipping" className="gap-2 py-3">
              <Truck className="h-4 w-4" />
              {t("shipping") || "الشحن"}
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2 py-3">
              <CreditCard className="h-4 w-4" />
              {t("payment") || "الدفع"}
            </TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("generalSiteSettings") || "الإعدادات العامة للموقع"}</CardTitle>
                <CardDescription>
                  {t("configureBasicSiteSettings") || "تكوين الإعدادات الأساسية للموقع"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="siteName">{t("siteName") || "اسم الموقع (الإنجليزية)"}</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={generalSettings.siteName}
                      onChange={handleGeneralSettingsChange}
                      className="bg-mediumBlue border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="siteNameAr">{t("siteNameAr") || "اسم الموقع (العربية)"}</Label>
                    <Input
                      id="siteNameAr"
                      name="siteNameAr"
                      value={generalSettings.siteNameAr}
                      onChange={handleGeneralSettingsChange}
                      className="bg-mediumBlue border-gray-700"
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="siteDescription">{t("siteDescription") || "وصف الموقع (الإنجليزية)"}</Label>
                    <Input
                      id="siteDescription"
                      name="siteDescription"
                      value={generalSettings.siteDescription}
                      onChange={handleGeneralSettingsChange}
                      className="bg-mediumBlue border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="siteDescriptionAr">{t("siteDescriptionAr") || "وصف الموقع (العربية)"}</Label>
                    <Input
                      id="siteDescriptionAr"
                      name="siteDescriptionAr"
                      value={generalSettings.siteDescriptionAr}
                      onChange={handleGeneralSettingsChange}
                      className="bg-mediumBlue border-gray-700"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="customerSupportEmail">{t("customerSupportEmail") || "البريد الإلكتروني لدعم العملاء"}</Label>
                    <Input
                      id="customerSupportEmail"
                      name="customerSupportEmail"
                      type="email"
                      value={generalSettings.customerSupportEmail}
                      onChange={handleGeneralSettingsChange}
                      className="bg-mediumBlue border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="customerSupportPhone">{t("customerSupportPhone") || "رقم هاتف دعم العملاء"}</Label>
                    <Input
                      id="customerSupportPhone"
                      name="customerSupportPhone"
                      value={generalSettings.customerSupportPhone}
                      onChange={handleGeneralSettingsChange}
                      className="bg-mediumBlue border-gray-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("themeCustomization") || "تخصيص المظهر"}</CardTitle>
                <CardDescription>
                  {t("customizeAppearanceOfYourSite") || "تخصيص مظهر موقعك"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="primaryColor" className="flex justify-between">
                          {t("primaryColor") || "اللون الرئيسي"}
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: themeSettings.primaryColor }}></span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            name="primaryColor"
                            type="color"
                            value={themeSettings.primaryColor}
                            onChange={handleThemeSettingsChange}
                            className="w-12 h-9 p-1 cursor-pointer"
                          />
                          <Input
                            value={themeSettings.primaryColor}
                            name="primaryColor"
                            onChange={handleThemeSettingsChange}
                            className="bg-mediumBlue border-gray-700 flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="secondaryColor" className="flex justify-between">
                          {t("secondaryColor") || "اللون الثانوي"}
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: themeSettings.secondaryColor }}></span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondaryColor"
                            name="secondaryColor"
                            type="color"
                            value={themeSettings.secondaryColor}
                            onChange={handleThemeSettingsChange}
                            className="w-12 h-9 p-1 cursor-pointer"
                          />
                          <Input
                            value={themeSettings.secondaryColor}
                            name="secondaryColor"
                            onChange={handleThemeSettingsChange}
                            className="bg-mediumBlue border-gray-700 flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="accentColor" className="flex justify-between">
                          {t("accentColor") || "لون التمييز"}
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: themeSettings.accentColor }}></span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="accentColor"
                            name="accentColor"
                            type="color"
                            value={themeSettings.accentColor}
                            onChange={handleThemeSettingsChange}
                            className="w-12 h-9 p-1 cursor-pointer"
                          />
                          <Input
                            value={themeSettings.accentColor}
                            name="accentColor"
                            onChange={handleThemeSettingsChange}
                            className="bg-mediumBlue border-gray-700 flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="backgroundColor" className="flex justify-between">
                          {t("backgroundColor") || "لون الخلفية"}
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: themeSettings.backgroundColor }}></span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="backgroundColor"
                            name="backgroundColor"
                            type="color"
                            value={themeSettings.backgroundColor}
                            onChange={handleThemeSettingsChange}
                            className="w-12 h-9 p-1 cursor-pointer"
                          />
                          <Input
                            value={themeSettings.backgroundColor}
                            name="backgroundColor"
                            onChange={handleThemeSettingsChange}
                            className="bg-mediumBlue border-gray-700 flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="textColor" className="flex justify-between">
                          {t("textColor") || "لون النص"}
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: themeSettings.textColor }}></span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="textColor"
                            name="textColor"
                            type="color"
                            value={themeSettings.textColor}
                            onChange={handleThemeSettingsChange}
                            className="w-12 h-9 p-1 cursor-pointer"
                          />
                          <Input
                            value={themeSettings.textColor}
                            name="textColor"
                            onChange={handleThemeSettingsChange}
                            className="bg-mediumBlue border-gray-700 flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="cardBackgroundColor" className="flex justify-between">
                          {t("cardBackgroundColor") || "لون خلفية البطاقات"}
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: themeSettings.cardBackgroundColor }}></span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="cardBackgroundColor"
                            name="cardBackgroundColor"
                            type="color"
                            value={themeSettings.cardBackgroundColor}
                            onChange={handleThemeSettingsChange}
                            className="w-12 h-9 p-1 cursor-pointer"
                          />
                          <Input
                            value={themeSettings.cardBackgroundColor}
                            name="cardBackgroundColor"
                            onChange={handleThemeSettingsChange}
                            className="bg-mediumBlue border-gray-700 flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="borderColor" className="flex justify-between">
                          {t("borderColor") || "لون الحدود"}
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: themeSettings.borderColor }}></span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="borderColor"
                            name="borderColor"
                            type="color"
                            value={themeSettings.borderColor}
                            onChange={handleThemeSettingsChange}
                            className="w-12 h-9 p-1 cursor-pointer"
                          />
                          <Input
                            value={themeSettings.borderColor}
                            name="borderColor"
                            onChange={handleThemeSettingsChange}
                            className="bg-mediumBlue border-gray-700 flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <Label>{t("siteLogo") || "شعار الموقع"}</Label>
                      
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 bg-mediumBlue border border-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                          {(logoPreview || themeSettings.logoUrl) ? (
                            <img 
                              src={logoPreview || themeSettings.logoUrl} 
                              alt="Site Logo" 
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Store className="h-10 w-10 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="relative"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                              <input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleLogoChange}
                              />
                              <Upload className="h-4 w-4 mr-2" />
                              {t("selectLogo") || "اختر شعارًا"}
                            </Button>
                            
                            {newLogoFile && (
                              <Button
                                type="button"
                                className="bg-primary hover:bg-lime-500 text-black"
                                onClick={handleUploadLogo}
                                disabled={uploadLogoMutation.isPending}
                              >
                                {uploadLogoMutation.isPending
                                  ? t("uploading") || "جاري الرفع..."
                                  : t("uploadLogo") || "رفع الشعار"}
                              </Button>
                            )}
                            
                            {themeSettings.logoUrl && (
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  // Remove logo logic here
                                  setThemeSettings(prev => ({
                                    ...prev,
                                    logoUrl: ""
                                  }));
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("removeLogo") || "إزالة الشعار"}
                              </Button>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-400">
                            {t("recommendedLogoSize") || "الحجم الموصى به: 200 × 80 بكسل. الصيغ المسموحة: PNG، JPG، SVG."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Theme Preview */}
                  <div className="lg:col-span-1">
                    <Card className="bg-mediumBlue">
                      <CardHeader>
                        <CardTitle>{t("themePreview") || "معاينة السمة"}</CardTitle>
                        <CardDescription>
                          {t("seeHowThemeWillLook") || "شاهد كيف ستبدو السمة"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="rounded-lg p-4 h-96 overflow-hidden"
                          style={{
                            backgroundColor: themeSettings.backgroundColor,
                            color: themeSettings.textColor,
                            border: `1px solid ${themeSettings.borderColor}`
                          }}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              {(logoPreview || themeSettings.logoUrl) ? (
                                <img 
                                  src={logoPreview || themeSettings.logoUrl} 
                                  alt="Logo" 
                                  className="h-8"
                                />
                              ) : (
                                <Store className="h-6 w-6" style={{ color: themeSettings.primaryColor }} />
                              )}
                              <span className="font-bold">{generalSettings.siteName}</span>
                            </div>
                            <div 
                              className="h-8 w-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: themeSettings.secondaryColor }}
                            >
                              <span style={{ color: themeSettings.textColor }}>A</span>
                            </div>
                          </div>
                          
                          <div 
                            className="rounded-lg p-3 mb-4"
                            style={{ 
                              backgroundColor: themeSettings.cardBackgroundColor,
                              border: `1px solid ${themeSettings.borderColor}`
                            }}
                          >
                            <h3 className="font-medium mb-2">{t("featuredProduct") || "منتج مميز"}</h3>
                            <div className="rounded bg-gray-700 h-24 mb-2"></div>
                            <p className="text-sm mb-2">{t("productDescription") || "وصف المنتج"}</p>
                            <button 
                              className="px-3 py-1 rounded text-sm font-medium"
                              style={{ 
                                backgroundColor: themeSettings.primaryColor,
                                color: "#000000"
                              }}
                            >
                              {t("addToCart") || "أضف للسلة"}
                            </button>
                          </div>
                          
                          <div className="flex gap-2 mb-2">
                            <span 
                              className="px-2 py-1 rounded text-xs"
                              style={{ 
                                backgroundColor: themeSettings.primaryColor,
                                color: "#000000"
                              }}
                            >
                              {t("category") || "التصنيف"}
                            </span>
                            <span 
                              className="px-2 py-1 rounded text-xs"
                              style={{ 
                                backgroundColor: themeSettings.accentColor,
                                color: "#000000"
                              }}
                            >
                              {t("sale") || "تخفيض"}
                            </span>
                          </div>
                          
                          <div 
                            className="h-1 rounded mb-2"
                            style={{ backgroundColor: themeSettings.primaryColor }}
                          ></div>
                          
                          <div 
                            className="rounded-lg p-2 text-xs"
                            style={{ 
                              backgroundColor: themeSettings.secondaryColor,
                              color: themeSettings.textColor
                            }}
                          >
                            {t("footerContent") || "محتوى التذييل"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("shippingCompanies") || "شركات الشحن"}</CardTitle>
                <CardDescription>
                  {t("manageAvailableShippingCompanies") || "إدارة شركات الشحن المتاحة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-end">
                  <Button className="bg-primary hover:bg-lime-500 text-black gap-2">
                    <Truck className="h-4 w-4" />
                    {t("addNewShippingCompany") || "إضافة شركة شحن جديدة"}
                  </Button>
                </div>
                
                {shippingCompanies.length === 0 ? (
                  <div className="text-center py-6 rounded-lg border border-dashed border-gray-700">
                    <AlertTriangle className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
                    <h3 className="font-medium mb-1">
                      {t("noShippingCompanies") || "لا توجد شركات شحن"}
                    </h3>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                      {t("noShippingCompaniesDescription") || "لم يتم إضافة شركات شحن بعد. أضف شركة شحن جديدة لتظهر هنا."}
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg border-gray-700 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-mediumBlue">
                        <tr>
                          <th className="text-left p-3">{t("name") || "الاسم"}</th>
                          <th className="text-left p-3">{t("contactInfo") || "معلومات الاتصال"}</th>
                          <th className="text-left p-3">{t("status") || "الحالة"}</th>
                          <th className="text-right p-3">{t("actions") || "الإجراءات"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {shippingCompanies.map((company: any) => (
                          <tr key={company.id} className="hover:bg-mediumBlue/50">
                            <td className="p-3">
                              <div className="font-medium">{company.name}</div>
                              <div className="text-sm text-gray-400">{company.nameAr}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-sm">{company.contactEmail}</div>
                              <div className="text-sm">{company.contactPhone}</div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <Switch
                                  checked={company.isActive}
                                  // onCheckedChange logic here
                                />
                                <span className="ml-2">
                                  {company.isActive ? 
                                    t("active") || "نشط" : 
                                    t("inactive") || "غير نشط"}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  {t("edit") || "تعديل"}
                                </Button>
                                <Button variant="destructive" size="sm">
                                  {t("delete") || "حذف"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("shippingOptions") || "خيارات الشحن"}</CardTitle>
                <CardDescription>
                  {t("manageAvailableShippingOptions") || "إدارة خيارات الشحن المتاحة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-end">
                  <Button className="bg-primary hover:bg-lime-500 text-black gap-2">
                    <Truck className="h-4 w-4" />
                    {t("addNewShippingOption") || "إضافة خيار شحن جديد"}
                  </Button>
                </div>
                
                <div className="border rounded-lg border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-mediumBlue">
                      <tr>
                        <th className="text-left p-3">{t("option") || "الخيار"}</th>
                        <th className="text-left p-3">{t("company") || "الشركة"}</th>
                        <th className="text-left p-3">{t("price") || "السعر"}</th>
                        <th className="text-left p-3">{t("deliveryTime") || "وقت التوصيل"}</th>
                        <th className="text-left p-3">{t("default") || "افتراضي"}</th>
                        <th className="text-right p-3">{t("actions") || "الإجراءات"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {/* Here we would map over shipping options */}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("paymentMethods") || "طرق الدفع"}</CardTitle>
                <CardDescription>
                  {t("manageAvailablePaymentMethods") || "إدارة طرق الدفع المتاحة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-end">
                  <Button className="bg-primary hover:bg-lime-500 text-black gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t("addNewPaymentMethod") || "إضافة طريقة دفع جديدة"}
                  </Button>
                </div>
                
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-6 rounded-lg border border-dashed border-gray-700">
                    <AlertTriangle className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
                    <h3 className="font-medium mb-1">
                      {t("noPaymentMethods") || "لا توجد طرق دفع"}
                    </h3>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                      {t("noPaymentMethodsDescription") || "لم يتم إضافة طرق دفع بعد. أضف طريقة دفع جديدة لتظهر هنا."}
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg border-gray-700 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-mediumBlue">
                        <tr>
                          <th className="text-left p-3">{t("method") || "الطريقة"}</th>
                          <th className="text-left p-3">{t("description") || "الوصف"}</th>
                          <th className="text-left p-3">{t("status") || "الحالة"}</th>
                          <th className="text-right p-3">{t("actions") || "الإجراءات"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {paymentMethods.map((method: any) => (
                          <tr key={method.id} className="hover:bg-mediumBlue/50">
                            <td className="p-3">
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-400">{method.nameAr}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-sm">{method.description || '-'}</div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <Switch
                                  checked={method.isActive}
                                  // onCheckedChange logic here
                                />
                                <span className="ml-2">
                                  {method.isActive ? 
                                    t("active") || "نشط" : 
                                    t("inactive") || "غير نشط"}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  {t("edit") || "تعديل"}
                                </Button>
                                <Button variant="destructive" size="sm">
                                  {t("delete") || "حذف"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}