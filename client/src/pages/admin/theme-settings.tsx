import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getSettings, updateSettings } from "@/lib/firebase";
import { useLocation } from "wouter";

export default function AdminThemeSettings() {
  const { t, language } = useContext(LanguageContext);
  const { user, userData } = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  
  // Theme state
  const [themeSettings, setThemeSettings] = useState({
    mainBackground: "#0f172a",
    primaryColor: "#a3e635",
    secondaryColor: "#2563eb",
    headerColor: "#1e293b",
    titleFont: "Roboto",
    bodyFont: "Roboto",
    logoUrl: "",
    mainBannerUrl: "",
    additionalBanners: [],
    bannerCount: 3,
    showFeaturedOffers: true,
    showCustomerReviews: true,
    showDiscounts: true,
    enableScrollEffects: false,
    showWhatsAppButton: true,
    enableNotifications: false,
    maintenanceMode: false,
    sessionDuration: 60,
  });
  
  // Banner file uploads
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mainBannerFile, setMainBannerFile] = useState<File | null>(null);
  const [additionalBannerFiles, setAdditionalBannerFiles] = useState<File[]>([]);
  
  useEffect(() => {
    // Check if user is admin
    if (user && userData && userData.role !== "admin") {
      toast({
        title: t("accessDenied"),
        description: t("adminOnly"),
        variant: "destructive",
      });
      navigate("/");
    }
    
    // Fetch current settings
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings) {
          setThemeSettings(prev => ({
            ...prev,
            ...settings
          }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    
    fetchSettings();
  }, [user, userData, navigate, toast, t]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setThemeSettings({
        ...themeSettings,
        [name]: parseInt(value)
      });
    } else {
      setThemeSettings({
        ...themeSettings,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setThemeSettings({
      ...themeSettings,
      [name]: value
    });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setThemeSettings({
      ...themeSettings,
      [name]: checked
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (!files) return;
    
    if (type === "logo" && files[0]) {
      setLogoFile(files[0]);
    } else if (type === "mainBanner" && files[0]) {
      setMainBannerFile(files[0]);
    } else if (type === "additionalBanners") {
      const fileArray = Array.from(files);
      setAdditionalBannerFiles(fileArray);
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, we would upload the files to Firebase Storage
      // and update the URLs in the settings
      
      // For now, we'll just update the settings without the file uploads
      await updateSettings(themeSettings);
      
      toast({
        title: t("success"),
        description: t("settingsSaved"),
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: t("error"),
        description: t("errorSavingSettings"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const resetToDefault = () => {
    setThemeSettings({
      mainBackground: "#0f172a",
      primaryColor: "#a3e635",
      secondaryColor: "#2563eb",
      headerColor: "#1e293b",
      titleFont: "Roboto",
      bodyFont: "Roboto",
      logoUrl: "",
      mainBannerUrl: "",
      additionalBanners: [],
      bannerCount: 3,
      showFeaturedOffers: true,
      showCustomerReviews: true,
      showDiscounts: true,
      enableScrollEffects: false,
      showWhatsAppButton: true,
      enableNotifications: false,
      maintenanceMode: false,
      sessionDuration: 60,
    });
    
    setLogoFile(null);
    setMainBannerFile(null);
    setAdditionalBannerFiles([]);
    
    toast({
      title: t("success"),
      description: t("settingsReset"),
    });
  };
  
  const themePresets = [
    { name: "Dark", mainBg: "#0f172a", primary: "#a3e635", secondary: "#2563eb", header: "#1e293b" },
    { name: "Light", mainBg: "#ffffff", primary: "#a3e635", secondary: "#2563eb", header: "#f8fafc" },
    { name: "Blue-Green", mainBg: "#0f172a", primary: "#14b8a6", secondary: "#0ea5e9", header: "#1e293b" },
    { name: "Yellow", mainBg: "#0f172a", primary: "#facc15", secondary: "#2563eb", header: "#1e293b" },
    { name: "Red", mainBg: "#0f172a", primary: "#dc2626", secondary: "#2563eb", header: "#1e293b" },
    { name: "Purple", mainBg: "#0f172a", primary: "#9333ea", secondary: "#2563eb", header: "#1e293b" },
  ];
  
  const applyThemePreset = (preset: typeof themePresets[0]) => {
    setThemeSettings({
      ...themeSettings,
      mainBackground: preset.mainBg,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      headerColor: preset.header,
    });
  };
  
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">{t("themeSettings")}</h1>
      
      <Tabs defaultValue="colors">
        <TabsList className="mb-6">
          <TabsTrigger value="colors">{t("colors")}</TabsTrigger>
          <TabsTrigger value="fonts">{t("fonts")}</TabsTrigger>
          <TabsTrigger value="banners">{t("banners")}</TabsTrigger>
          <TabsTrigger value="components">{t("components")}</TabsTrigger>
          <TabsTrigger value="general">{t("general")}</TabsTrigger>
        </TabsList>
        
        {/* Colors Tab */}
        <TabsContent value="colors">
          <Card className="bg-mediumBlue border-0">
            <CardHeader>
              <CardTitle>{t("themeColors")}</CardTitle>
              <CardDescription>{t("themeColorsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">{t("presets")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {themePresets.map((preset, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => applyThemePreset(preset)}
                    >
                      <div 
                        className="w-16 h-16 rounded-lg mb-2 border-2 border-transparent hover:border-primary"
                        style={{ background: preset.mainBg }}
                      >
                        <div 
                          className="w-full h-1/3" 
                          style={{ background: preset.header }}
                        ></div>
                        <div 
                          className="w-1/2 h-1/3 mx-auto" 
                          style={{ background: preset.primary }}
                        ></div>
                        <div 
                          className="w-1/2 h-1/3 mx-auto" 
                          style={{ background: preset.secondary }}
                        ></div>
                      </div>
                      <span className="text-sm">{preset.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="mainBackground">{t("mainBackground")}</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      type="color"
                      id="mainBackground"
                      name="mainBackground"
                      value={themeSettings.mainBackground}
                      onChange={handleInputChange}
                      className="w-12 h-12 p-1 mr-2"
                    />
                    <Input
                      type="text"
                      value={themeSettings.mainBackground}
                      onChange={handleInputChange}
                      name="mainBackground"
                      className="bg-darkBlue border-gray-700 flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="primaryColor">{t("primaryColor")}</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      type="color"
                      id="primaryColor"
                      name="primaryColor"
                      value={themeSettings.primaryColor}
                      onChange={handleInputChange}
                      className="w-12 h-12 p-1 mr-2"
                    />
                    <Input
                      type="text"
                      value={themeSettings.primaryColor}
                      onChange={handleInputChange}
                      name="primaryColor"
                      className="bg-darkBlue border-gray-700 flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">{t("secondaryColor")}</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      type="color"
                      id="secondaryColor"
                      name="secondaryColor"
                      value={themeSettings.secondaryColor}
                      onChange={handleInputChange}
                      className="w-12 h-12 p-1 mr-2"
                    />
                    <Input
                      type="text"
                      value={themeSettings.secondaryColor}
                      onChange={handleInputChange}
                      name="secondaryColor"
                      className="bg-darkBlue border-gray-700 flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="headerColor">{t("headerColor")}</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      type="color"
                      id="headerColor"
                      name="headerColor"
                      value={themeSettings.headerColor}
                      onChange={handleInputChange}
                      className="w-12 h-12 p-1 mr-2"
                    />
                    <Input
                      type="text"
                      value={themeSettings.headerColor}
                      onChange={handleInputChange}
                      name="headerColor"
                      className="bg-darkBlue border-gray-700 flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-4">{t("preview")}</h3>
                <div 
                  className="rounded-lg overflow-hidden shadow-lg"
                  style={{ background: themeSettings.mainBackground }}
                >
                  <div 
                    className="p-4 text-white"
                    style={{ background: themeSettings.headerColor }}
                  >
                    <div className="flex justify-between items-center">
                      <div 
                        className="font-bold text-lg"
                        style={{ color: themeSettings.primaryColor }}
                      >
                        EchoShop
                      </div>
                      <div className="flex space-x-2">
                        <div 
                          className="px-3 py-1 rounded-full text-white text-sm"
                          style={{ background: themeSettings.secondaryColor }}
                        >
                          {t("login")}
                        </div>
                        <div 
                          className="px-3 py-1 rounded-full text-white text-sm"
                          style={{ background: themeSettings.secondaryColor }}
                        >
                          {t("signup")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 text-white">
                    <div className="mb-3">{t("sampleContent")}</div>
                    <div 
                      className="px-4 py-2 rounded-full inline-block text-black"
                      style={{ background: themeSettings.primaryColor }}
                    >
                      {t("button")}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Fonts Tab */}
        <TabsContent value="fonts">
          <Card className="bg-mediumBlue border-0">
            <CardHeader>
              <CardTitle>{t("fontSettings")}</CardTitle>
              <CardDescription>{t("fontSettingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="titleFont">{t("titleFont")}</Label>
                  <Select 
                    value={themeSettings.titleFont} 
                    onValueChange={(value) => handleSelectChange("titleFont", value)}
                  >
                    <SelectTrigger id="titleFont" className="mt-2 bg-darkBlue border-gray-700">
                      <SelectValue placeholder={t("selectFont")} />
                    </SelectTrigger>
                    <SelectContent className="bg-darkBlue border-gray-700">
                      <SelectGroup>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Tahoma">Tahoma</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="bodyFont">{t("bodyFont")}</Label>
                  <Select 
                    value={themeSettings.bodyFont} 
                    onValueChange={(value) => handleSelectChange("bodyFont", value)}
                  >
                    <SelectTrigger id="bodyFont" className="mt-2 bg-darkBlue border-gray-700">
                      <SelectValue placeholder={t("selectFont")} />
                    </SelectTrigger>
                    <SelectContent className="bg-darkBlue border-gray-700">
                      <SelectGroup>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Tahoma">Tahoma</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-4">{t("preview")}</h3>
                <div>
                  <h1 
                    className="text-2xl mb-2" 
                    style={{ fontFamily: themeSettings.titleFont }}
                  >
                    {t("sampleTitle")}
                  </h1>
                  <p 
                    className="text-gray-300" 
                    style={{ fontFamily: themeSettings.bodyFont }}
                  >
                    {t("sampleParagraph")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Banners Tab */}
        <TabsContent value="banners">
          <Card className="bg-mediumBlue border-0">
            <CardHeader>
              <CardTitle>{t("bannerSettings")}</CardTitle>
              <CardDescription>{t("bannerSettingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="logoUpload">{t("logoUpload")}</Label>
                  <Input
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    className="mt-2 bg-darkBlue border-gray-700"
                    onChange={(e) => handleFileChange(e, "logo")}
                  />
                  {logoFile && (
                    <p className="mt-2 text-sm text-gray-400">
                      {t("fileSelected")}: {logoFile.name}
                    </p>
                  )}
                  {themeSettings.logoUrl && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">{t("currentLogo")}</p>
                      <img 
                        src={themeSettings.logoUrl} 
                        alt="Current Logo" 
                        className="h-12 border border-gray-700 rounded"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="mainBannerUpload">{t("mainBannerUpload")}</Label>
                  <Input
                    id="mainBannerUpload"
                    type="file"
                    accept="image/*"
                    className="mt-2 bg-darkBlue border-gray-700"
                    onChange={(e) => handleFileChange(e, "mainBanner")}
                  />
                  {mainBannerFile && (
                    <p className="mt-2 text-sm text-gray-400">
                      {t("fileSelected")}: {mainBannerFile.name}
                    </p>
                  )}
                  {themeSettings.mainBannerUrl && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">{t("currentMainBanner")}</p>
                      <img 
                        src={themeSettings.mainBannerUrl} 
                        alt="Current Main Banner" 
                        className="max-h-36 border border-gray-700 rounded"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="additionalBannersUpload">{t("additionalBannersUpload")}</Label>
                  <Input
                    id="additionalBannersUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="mt-2 bg-darkBlue border-gray-700"
                    onChange={(e) => handleFileChange(e, "additionalBanners")}
                  />
                  {additionalBannerFiles.length > 0 && (
                    <p className="mt-2 text-sm text-gray-400">
                      {t("filesSelected")}: {additionalBannerFiles.length}
                    </p>
                  )}
                  {themeSettings.additionalBanners.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">{t("currentAdditionalBanners")}</p>
                      <div className="flex flex-wrap gap-2">
                        {themeSettings.additionalBanners.map((url, index) => (
                          <img 
                            key={index}
                            src={url} 
                            alt={`Banner ${index + 1}`} 
                            className="max-h-24 border border-gray-700 rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="bannerCount">{t("bannerCount")}</Label>
                  <Input
                    id="bannerCount"
                    type="number"
                    min="1"
                    max="10"
                    name="bannerCount"
                    value={themeSettings.bannerCount}
                    onChange={handleInputChange}
                    className="mt-2 bg-darkBlue border-gray-700 w-full max-w-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Components Tab */}
        <TabsContent value="components">
          <Card className="bg-mediumBlue border-0">
            <CardHeader>
              <CardTitle>{t("componentSettings")}</CardTitle>
              <CardDescription>{t("componentSettingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showFeaturedOffers">{t("showFeaturedOffers")}</Label>
                  <Switch
                    id="showFeaturedOffers"
                    checked={themeSettings.showFeaturedOffers}
                    onCheckedChange={(checked) => handleSwitchChange("showFeaturedOffers", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showCustomerReviews">{t("showCustomerReviews")}</Label>
                  <Switch
                    id="showCustomerReviews"
                    checked={themeSettings.showCustomerReviews}
                    onCheckedChange={(checked) => handleSwitchChange("showCustomerReviews", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showDiscounts">{t("showDiscounts")}</Label>
                  <Switch
                    id="showDiscounts"
                    checked={themeSettings.showDiscounts}
                    onCheckedChange={(checked) => handleSwitchChange("showDiscounts", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableScrollEffects">{t("enableScrollEffects")}</Label>
                  <Switch
                    id="enableScrollEffects"
                    checked={themeSettings.enableScrollEffects}
                    onCheckedChange={(checked) => handleSwitchChange("enableScrollEffects", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showWhatsAppButton">{t("showWhatsAppButton")}</Label>
                  <Switch
                    id="showWhatsAppButton"
                    checked={themeSettings.showWhatsAppButton}
                    onCheckedChange={(checked) => handleSwitchChange("showWhatsAppButton", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* General Tab */}
        <TabsContent value="general">
          <Card className="bg-mediumBlue border-0">
            <CardHeader>
              <CardTitle>{t("generalSettings")}</CardTitle>
              <CardDescription>{t("generalSettingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableNotifications">{t("enableNotifications")}</Label>
                  <Switch
                    id="enableNotifications"
                    checked={themeSettings.enableNotifications}
                    onCheckedChange={(checked) => handleSwitchChange("enableNotifications", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenanceMode">{t("maintenanceMode")}</Label>
                  <Switch
                    id="maintenanceMode"
                    checked={themeSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleSwitchChange("maintenanceMode", checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sessionDuration">{t("sessionDuration")}</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      id="sessionDuration"
                      type="number"
                      min="5"
                      max="1440"
                      name="sessionDuration"
                      value={themeSettings.sessionDuration}
                      onChange={handleInputChange}
                      className="bg-darkBlue border-gray-700 w-full max-w-xs mr-2"
                    />
                    <span>{t("minutes")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end gap-4">
        <Button 
          variant="outline" 
          className="border-danger text-danger hover:bg-danger hover:text-white"
          onClick={resetToDefault}
        >
          {t("resetToDefault")}
        </Button>
        <Button 
          className="bg-primary text-black hover:bg-lime-500"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? t("saving") : t("saveSettings")}
        </Button>
      </div>
    </AdminLayout>
  );
}
