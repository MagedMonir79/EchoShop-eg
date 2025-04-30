import { useContext, useState } from "react";
import { SellerLayout } from "@/components/layout/seller-layout";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  DollarSign,
  Store,
  FileText,
  Settings,
  Image,
  Truck,
  Bell,
  Lock,
  User,
  Shield,
  Upload,
  Percent,
  Camera,
  Save,
  CheckCircle,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SellerSettingsPage() {
  const { language, t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const isRTL = language === "ar";
  
  const [formState, setFormState] = useState({
    storeDetails: {
      storeName: "My Awesome Store",
      storeNameAr: "متجري الرائع",
      description: "We sell high-quality products at competitive prices.",
      descriptionAr: "نبيع منتجات عالية الجودة بأسعار تنافسية.",
      email: "contact@mystore.com",
      phone: "+20 123 456 7890",
      address: "123 Main Street, Cairo, Egypt",
      addressAr: "١٢٣ الشارع الرئيسي، القاهرة، مصر",
      logo: "https://placehold.co/400x400",
      banner: "https://placehold.co/1200x400",
    },
    paymentSettings: {
      acceptCashOnDelivery: true,
      acceptCreditCards: true,
      acceptWallets: false,
      bankName: "Cairo Bank",
      accountName: "My Store LLC",
      accountNumber: "1234567890",
      swiftCode: "CAIEGCXX",
    },
    shippingSettings: {
      offerFreeShipping: false,
      freeShippingThreshold: 1000,
      defaultShippingFee: 50,
      shippingTimeMin: 3,
      shippingTimeMax: 7,
      shippingNote: "Delivery times may vary during holidays",
      shippingNoteAr: "قد تختلف أوقات التسليم خلال العطلات",
    },
    notificationSettings: {
      orderNotifications: true,
      stockAlerts: true,
      promotionalEmails: false,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
    supplierSettings: {
      autoOrderingEnabled: false,
      lowStockThreshold: 5,
      markupPercentage: 25,
      defaultSupplier: "supplier-1",
    },
  });
  
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  
  // Mock suppliers list
  const suppliers = [
    { id: "supplier-1", name: "Global Electronics" },
    { id: "supplier-2", name: "Fashion Wholesale Ltd." },
    { id: "supplier-3", name: "Mega Distributors" },
    { id: "supplier-4", name: "Premium Goods Inc." },
  ];
  
  // Handle form updates
  const handleInputChange = (section: string, field: string, value: any) => {
    setFormState(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section as keyof typeof prevState],
        [field]: value,
      },
    }));
  };
  
  // Submit form
  const handleSubmit = (event: React.FormEvent, section: string) => {
    event.preventDefault();
    console.log(`Saving ${section}:`, formState[section as keyof typeof formState]);
    // Would call an API here
    
    // Show saved notification
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };
  
  return (
    <SellerLayout>
      <div className={`p-6 ${isRTL ? "rtl" : ""}`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {t("storeSettings") || "Store Settings"}
            </h1>
            <p className="text-muted-foreground">
              {t("storeSettingsDescription") || "Configure your store preferences and business information."}
            </p>
          </div>
        </div>
        
        {/* Notification when settings are saved */}
        {showSavedNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-black p-3 rounded-md shadow-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {t("settingsSaved") || "Settings saved successfully"}
          </div>
        )}
        
        {/* Settings Tabs */}
        <Tabs defaultValue="store" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="store">
              <Store className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t("storeDetails") || "Store Details"}</span>
              <span className="inline md:hidden">{t("store") || "Store"}</span>
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t("payment") || "Payment"}</span>
              <span className="inline md:hidden">{t("payment") || "Payment"}</span>
            </TabsTrigger>
            <TabsTrigger value="shipping">
              <Truck className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t("shipping") || "Shipping"}</span>
              <span className="inline md:hidden">{t("shipping") || "Shipping"}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t("notifications") || "Notifications"}</span>
              <span className="inline md:hidden">{t("alerts") || "Alerts"}</span>
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              <Percent className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t("suppliers") || "Suppliers"}</span>
              <span className="inline md:hidden">{t("suppliers") || "Suppliers"}</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Store Details */}
          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle>{t("storeDetails") || "Store Details"}</CardTitle>
                <CardDescription>
                  {t("storeDetailsDescription") || "Manage your store's profile and public information."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={(e) => handleSubmit(e, 'storeDetails')}>
                  {/* Store Logo and Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{t("storeLogo") || "Store Logo"}</h3>
                        <div className="flex items-center gap-4">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={formState.storeDetails.logo} alt="Store Logo" />
                            <AvatarFallback>
                              <Store className="h-12 w-12" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Button variant="outline" size="sm" className="mb-2">
                              <Upload className="h-4 w-4 mr-2" />
                              {t("uploadLogo") || "Upload Logo"}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              {t("logoRequirements") || "Square image, at least 500x500px"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">{t("storeBanner") || "Store Banner"}</h3>
                        <div className="border rounded-md overflow-hidden border-gray-700 mb-2 relative">
                          <img 
                            src={formState.storeDetails.banner} 
                            alt="Store Banner" 
                            className="w-full h-32 object-cover"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="absolute bottom-2 right-2 bg-black/70"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            {t("change") || "Change"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t("bannerRequirements") || "Recommended size: 1200x400px"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{t("storeStatus") || "Store Status"}</h3>
                        <Badge className="bg-green-500">
                          {t("active") || "Active"}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {t("storeActive") || "Your store is currently visible to customers."}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">{t("statistics") || "Statistics"}</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">{t("productsListed") || "Products Listed"}:</span>
                            <span>24</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">{t("totalOrders") || "Total Orders"}:</span>
                            <span>158</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">{t("customerReviews") || "Customer Reviews"}:</span>
                            <span>42</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  {/* Store Information Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <FormItem>
                        <FormLabel>{t("storeName") || "Store Name"} ({t("english") || "English"})</FormLabel>
                        <FormControl>
                          <Input 
                            value={formState.storeDetails.storeName}
                            onChange={(e) => handleInputChange('storeDetails', 'storeName', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                      
                      <FormItem>
                        <FormLabel>{t("storeDescription") || "Store Description"} ({t("english") || "English"})</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={3}
                            value={formState.storeDetails.description}
                            onChange={(e) => handleInputChange('storeDetails', 'description', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                      
                      <FormItem>
                        <FormLabel>{t("contactEmail") || "Contact Email"}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            value={formState.storeDetails.email}
                            onChange={(e) => handleInputChange('storeDetails', 'email', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                      
                      <FormItem>
                        <FormLabel>{t("phoneNumber") || "Phone Number"}</FormLabel>
                        <FormControl>
                          <Input 
                            value={formState.storeDetails.phone}
                            onChange={(e) => handleInputChange('storeDetails', 'phone', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    
                    <div className="space-y-4">
                      <FormItem>
                        <FormLabel>{t("storeName") || "Store Name"} ({t("arabic") || "Arabic"})</FormLabel>
                        <FormControl>
                          <Input 
                            value={formState.storeDetails.storeNameAr}
                            onChange={(e) => handleInputChange('storeDetails', 'storeNameAr', e.target.value)}
                            className="text-right"
                            dir="rtl"
                          />
                        </FormControl>
                      </FormItem>
                      
                      <FormItem>
                        <FormLabel>{t("storeDescription") || "Store Description"} ({t("arabic") || "Arabic"})</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={3}
                            value={formState.storeDetails.descriptionAr}
                            onChange={(e) => handleInputChange('storeDetails', 'descriptionAr', e.target.value)}
                            className="text-right"
                            dir="rtl"
                          />
                        </FormControl>
                      </FormItem>
                      
                      <FormItem>
                        <FormLabel>{t("address") || "Address"} ({t("english") || "English"})</FormLabel>
                        <FormControl>
                          <Input 
                            value={formState.storeDetails.address}
                            onChange={(e) => handleInputChange('storeDetails', 'address', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                      
                      <FormItem>
                        <FormLabel>{t("address") || "Address"} ({t("arabic") || "Arabic"})</FormLabel>
                        <FormControl>
                          <Input 
                            value={formState.storeDetails.addressAr}
                            onChange={(e) => handleInputChange('storeDetails', 'addressAr', e.target.value)}
                            className="text-right"
                            dir="rtl"
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {t("saveChanges") || "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Settings */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>{t("paymentSettings") || "Payment Settings"}</CardTitle>
                <CardDescription>
                  {t("paymentSettingsDescription") || "Configure payment methods and account details."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'paymentSettings')}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t("paymentMethods") || "Payment Methods"}</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <Label>{t("acceptCreditCards") || "Accept Credit Cards"}</Label>
                          </div>
                          <Switch 
                            checked={formState.paymentSettings.acceptCreditCards}
                            onCheckedChange={(value) => handleInputChange('paymentSettings', 'acceptCreditCards', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <Label>{t("acceptCashOnDelivery") || "Accept Cash on Delivery"}</Label>
                          </div>
                          <Switch 
                            checked={formState.paymentSettings.acceptCashOnDelivery}
                            onCheckedChange={(value) => handleInputChange('paymentSettings', 'acceptCashOnDelivery', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            <Label>{t("acceptWallets") || "Accept E-Wallets"}</Label>
                          </div>
                          <Switch 
                            checked={formState.paymentSettings.acceptWallets}
                            onCheckedChange={(value) => handleInputChange('paymentSettings', 'acceptWallets', value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t("bankDetails") || "Bank Details"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel>{t("bankName") || "Bank Name"}</FormLabel>
                          <FormControl>
                            <Input 
                              value={formState.paymentSettings.bankName}
                              onChange={(e) => handleInputChange('paymentSettings', 'bankName', e.target.value)}
                            />
                          </FormControl>
                        </FormItem>
                        
                        <FormItem>
                          <FormLabel>{t("accountName") || "Account Name"}</FormLabel>
                          <FormControl>
                            <Input 
                              value={formState.paymentSettings.accountName}
                              onChange={(e) => handleInputChange('paymentSettings', 'accountName', e.target.value)}
                            />
                          </FormControl>
                        </FormItem>
                        
                        <FormItem>
                          <FormLabel>{t("accountNumber") || "Account Number"}</FormLabel>
                          <FormControl>
                            <Input 
                              value={formState.paymentSettings.accountNumber}
                              onChange={(e) => handleInputChange('paymentSettings', 'accountNumber', e.target.value)}
                            />
                          </FormControl>
                        </FormItem>
                        
                        <FormItem>
                          <FormLabel>{t("swiftCode") || "Swift Code"}</FormLabel>
                          <FormControl>
                            <Input 
                              value={formState.paymentSettings.swiftCode}
                              onChange={(e) => handleInputChange('paymentSettings', 'swiftCode', e.target.value)}
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {t("saveChanges") || "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Shipping Settings */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>{t("shippingSettings") || "Shipping Settings"}</CardTitle>
                <CardDescription>
                  {t("shippingSettingsDescription") || "Configure shipping methods, fees, and delivery options."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'shippingSettings')}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">{t("offerFreeShipping") || "Offer Free Shipping"}</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("freeShippingDescription") || "Enable free shipping for orders above a certain amount."}
                        </p>
                      </div>
                      <Switch 
                        checked={formState.shippingSettings.offerFreeShipping}
                        onCheckedChange={(value) => handleInputChange('shippingSettings', 'offerFreeShipping', value)}
                      />
                    </div>
                    
                    {formState.shippingSettings.offerFreeShipping && (
                      <FormItem>
                        <FormLabel>{t("freeShippingThreshold") || "Free Shipping Threshold"} (EGP)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            value={formState.shippingSettings.freeShippingThreshold}
                            onChange={(e) => handleInputChange('shippingSettings', 'freeShippingThreshold', Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("freeShippingThresholdDescription") || "Orders above this amount will qualify for free shipping."}
                        </FormDescription>
                      </FormItem>
                    )}
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormItem className="mb-4">
                          <FormLabel>{t("defaultShippingFee") || "Default Shipping Fee"} (EGP)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              value={formState.shippingSettings.defaultShippingFee}
                              onChange={(e) => handleInputChange('shippingSettings', 'defaultShippingFee', Number(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                        
                        <FormItem>
                          <FormLabel>{t("estimatedDeliveryTime") || "Estimated Delivery Time"} ({t("days") || "days"})</FormLabel>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number"
                              className="w-20"
                              value={formState.shippingSettings.shippingTimeMin}
                              onChange={(e) => handleInputChange('shippingSettings', 'shippingTimeMin', Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">to</span>
                            <Input 
                              type="number"
                              className="w-20"
                              value={formState.shippingSettings.shippingTimeMax}
                              onChange={(e) => handleInputChange('shippingSettings', 'shippingTimeMax', Number(e.target.value))}
                            />
                            <span className="text-sm text-muted-foreground">{t("days") || "days"}</span>
                          </div>
                        </FormItem>
                      </div>
                      
                      <div>
                        <FormItem>
                          <FormLabel>{t("shippingNote") || "Shipping Note"} ({t("english") || "English"})</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={2}
                              value={formState.shippingSettings.shippingNote}
                              onChange={(e) => handleInputChange('shippingSettings', 'shippingNote', e.target.value)}
                              placeholder={t("shippingNotePlaceholder") || "Additional information about shipping..."}
                            />
                          </FormControl>
                        </FormItem>
                        
                        <FormItem>
                          <FormLabel>{t("shippingNote") || "Shipping Note"} ({t("arabic") || "Arabic"})</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={2}
                              value={formState.shippingSettings.shippingNoteAr}
                              onChange={(e) => handleInputChange('shippingSettings', 'shippingNoteAr', e.target.value)}
                              placeholder={t("shippingNotePlaceholder") || "Additional information about shipping..."}
                              className="text-right"
                              dir="rtl"
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {t("saveChanges") || "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t("notificationSettings") || "Notification Settings"}</CardTitle>
                <CardDescription>
                  {t("notificationSettingsDescription") || "Manage how and when you receive notifications."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'notificationSettings')}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t("notificationTypes") || "Notification Types"}</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>{t("orderNotifications") || "Order Notifications"}</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("orderNotificationsDescription") || "Get notified when you receive new orders."}
                            </p>
                          </div>
                          <Switch 
                            checked={formState.notificationSettings.orderNotifications}
                            onCheckedChange={(value) => handleInputChange('notificationSettings', 'orderNotifications', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>{t("stockAlerts") || "Stock Alerts"}</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("stockAlertsDescription") || "Get notified when products are running low on stock."}
                            </p>
                          </div>
                          <Switch 
                            checked={formState.notificationSettings.stockAlerts}
                            onCheckedChange={(value) => handleInputChange('notificationSettings', 'stockAlerts', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>{t("promotionalEmails") || "Promotional Emails"}</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("promotionalEmailsDescription") || "Receive emails about EchoShop features and promotions."}
                            </p>
                          </div>
                          <Switch 
                            checked={formState.notificationSettings.promotionalEmails}
                            onCheckedChange={(value) => handleInputChange('notificationSettings', 'promotionalEmails', value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t("notificationChannels") || "Notification Channels"}</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>{t("emailNotifications") || "Email Notifications"}</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("emailNotificationsDescription") || "Receive notifications via email."}
                            </p>
                          </div>
                          <Switch 
                            checked={formState.notificationSettings.emailNotifications}
                            onCheckedChange={(value) => handleInputChange('notificationSettings', 'emailNotifications', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>{t("smsNotifications") || "SMS Notifications"}</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("smsNotificationsDescription") || "Receive notifications via SMS."}
                            </p>
                          </div>
                          <Switch 
                            checked={formState.notificationSettings.smsNotifications}
                            onCheckedChange={(value) => handleInputChange('notificationSettings', 'smsNotifications', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>{t("pushNotifications") || "Push Notifications"}</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("pushNotificationsDescription") || "Receive notifications in your browser."}
                            </p>
                          </div>
                          <Switch 
                            checked={formState.notificationSettings.pushNotifications}
                            onCheckedChange={(value) => handleInputChange('notificationSettings', 'pushNotifications', value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {t("saveChanges") || "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Supplier Settings */}
          <TabsContent value="suppliers">
            <Card>
              <CardHeader>
                <CardTitle>{t("supplierSettings") || "Supplier & Dropshipping Settings"}</CardTitle>
                <CardDescription>
                  {t("supplierSettingsDescription") || "Configure your supplier connections and inventory automation."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'supplierSettings')}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">{t("autoOrderingEnabled") || "Automatic Ordering"}</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("autoOrderingDescription") || "Automatically place orders with suppliers when inventory is low."}
                        </p>
                      </div>
                      <Switch 
                        checked={formState.supplierSettings.autoOrderingEnabled}
                        onCheckedChange={(value) => handleInputChange('supplierSettings', 'autoOrderingEnabled', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormItem className="mb-4">
                          <FormLabel>{t("lowStockThreshold") || "Low Stock Threshold"}</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              value={formState.supplierSettings.lowStockThreshold}
                              onChange={(e) => handleInputChange('supplierSettings', 'lowStockThreshold', Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            {t("lowStockThresholdDescription") || "Products with stock below this number will trigger alerts."}
                          </FormDescription>
                        </FormItem>
                        
                        <FormItem>
                          <FormLabel>{t("defaultSupplier") || "Default Supplier"}</FormLabel>
                          <Select 
                            value={formState.supplierSettings.defaultSupplier}
                            onValueChange={(value) => handleInputChange('supplierSettings', 'defaultSupplier', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectSupplier") || "Select a supplier"} />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers.map(supplier => (
                                <SelectItem key={supplier.id} value={supplier.id}>
                                  {supplier.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t("defaultSupplierDescription") || "The supplier to use for automatic ordering if not specified at the product level."}
                          </FormDescription>
                        </FormItem>
                      </div>
                      
                      <div>
                        <FormItem>
                          <FormLabel>{t("markupPercentage") || "Default Markup Percentage"}</FormLabel>
                          <div className="flex items-center">
                            <Input 
                              type="number"
                              value={formState.supplierSettings.markupPercentage}
                              onChange={(e) => handleInputChange('supplierSettings', 'markupPercentage', Number(e.target.value))}
                              className="w-20"
                            />
                            <span className="text-lg ml-2">%</span>
                          </div>
                          <FormDescription>
                            {t("markupPercentageDescription") || "Default profit margin to add to supplier prices."}
                          </FormDescription>
                        </FormItem>
                        
                        <div className="mt-4">
                          <h3 className="text-sm font-medium mb-2">{t("connectedSuppliers") || "Connected Suppliers"}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {t("connectedSuppliersDescription") || "You currently have 4 connected suppliers."}
                          </p>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            {t("manageSuppliers") || "Manage Suppliers"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {t("saveChanges") || "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SellerLayout>
  );
}

// Component for form labels
function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium leading-none ${className}`} {...props}>
      {children}
    </label>
  );
}

// Wallet icon component
function Wallet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
      <path d="M22 10V8a2 2 0 0 0-2-2h-4l-2-2H8L6 6H4a2 2 0 0 0-2 2v2" />
      <path d="M18 12a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4z" />
    </svg>
  );
}