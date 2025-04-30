import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/context/auth-context";
import { LanguageContext } from "@/context/language-context";
import { apiRequest } from "@/lib/queryClient";
import { FileUploader } from "@/components/ui/file-uploader";
import { BriefcaseIcon, BuildingIcon, TruckIcon, HomeIcon, CheckCircleIcon, InfoIcon, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// تعريف مخطط التحقق من البيانات
// Define validation schema
const sellerFormSchema = z.object({
  // معلومات أساسية
  // Basic information
  storeName: z.string().min(3, { message: "Store name must be at least 3 characters." }),
  storeNameAr: z.string().min(3, { message: "Arabic store name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500),
  descriptionAr: z.string().min(10, { message: "Arabic description must be at least 10 characters." }).max(500),
  phone: z.string().min(6, { message: "Enter a valid phone number." }),
  
  // معلومات العنوان
  // Address information
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(2, { message: "Country is required." }),
  
  // معلومات قانونية
  // Legal information
  businessType: z.string().min(1, { message: "Business type is required." }),
  taxId: z.string().optional(),
  commercialRegistry: z.string().optional(),
  
  // معلومات بنكية
  // Banking information
  bankName: z.string().optional(),
  iban: z.string().optional(),
  accountHolder: z.string().optional(),
  
  // معلومات التواصل
  // Contact information
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  
  // الموافقات
  // Agreements
  termsAgreed: z.boolean().refine(value => value === true, {
    message: "You must agree to the terms and conditions.",
  }),
  sellerAgreement: z.boolean().refine(value => value === true, {
    message: "You must agree to the seller agreement.",
  }),
});

type SellerFormValues = z.infer<typeof sellerFormSchema>;

export default function SellerRegistration() {
  const { user } = useContext(AuthContext);
  const { language, t } = useContext(LanguageContext);
  const isRTL = language === "ar";
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadedFiles, setUploadedFiles] = useState<{
    identityDocument: string | null;
    taxDocument: string | null;
    commercialDocument: string | null;
    productPhotos: string[];
    otherDocuments: string[];
  }>({
    identityDocument: null,
    taxDocument: null,
    commercialDocument: null,
    productPhotos: [],
    otherDocuments: [],
  });
  
  const [formProgress, setFormProgress] = useState(0);
  
  // تكوين نموذج مع التحقق من البيانات
  // Setup form with validation
  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues: {
      storeName: "",
      storeNameAr: "",
      description: "",
      descriptionAr: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Egypt",
      businessType: "",
      taxId: "",
      commercialRegistry: "",
      bankName: "",
      iban: "",
      accountHolder: "",
      website: "",
      instagram: "",
      facebook: "",
      twitter: "",
      termsAgreed: false,
      sellerAgreement: false,
    },
  });
  
  // استخدام TanStack Query لإرسال النموذج
  // Use TanStack Query for form submission
  const sellerRegistrationMutation = useMutation({
    mutationFn: async (formData: SellerFormValues & { 
      userId: number, 
      documents: typeof uploadedFiles 
    }) => {
      const response = await apiRequest("POST", "/api/sellers/register", formData);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register seller");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t("success"),
        description: isRTL 
          ? "تم تقديم طلب البائع بنجاح! سنراجع طلبك ونتواصل معك قريبًا."
          : "Your seller application has been submitted successfully! We will review your application and contact you soon.",
      });
      navigate("/seller/pending");
    },
    onError: (error: Error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // معالجة تقديم النموذج
  // Handle form submission
  const onSubmit = (data: SellerFormValues) => {
    if (!user?.id) {
      toast({
        title: t("error"),
        description: isRTL ? "يجب تسجيل الدخول أولاً" : "You must be logged in to register as a seller",
        variant: "destructive",
      });
      return;
    }
    
    // تحقق مما إذا كانت المستندات الإلزامية موجودة
    // Check if mandatory documents exist
    const isTaxDocumentMissing = !uploadedFiles.taxDocument && data.businessType !== "individual";
    const isIdentityDocumentMissing = !uploadedFiles.identityDocument;
    
    // إذا كانت المستندات الإلزامية مفقودة، اسأل المستخدم عما إذا كان يريد المتابعة
    // If mandatory documents are missing, ask user if they want to proceed
    if (isTaxDocumentMissing || isIdentityDocumentMissing) {
      const missingDocs = [];
      if (isIdentityDocumentMissing) missingDocs.push(isRTL ? "بطاقة الهوية" : "Identity Document");
      if (isTaxDocumentMissing) missingDocs.push(isRTL ? "البطاقة الضريبية" : "Tax Card");
      
      // إظهار نافذة تأكيد بدلاً من إرسال البيانات مباشرة
      // Show confirmation instead of submitting directly
      if (confirm(
        isRTL 
          ? `بعض المستندات المهمة مفقودة: ${missingDocs.join(", ")}. هل ترغب بالمتابعة مع ذلك؟ (سيتم وضع طلبك في قائمة الانتظار)`
          : `Some important documents are missing: ${missingDocs.join(", ")}. Do you want to proceed anyway? (Your application will be placed in pending status)`
      )) {
        sellerRegistrationMutation.mutate({
          ...data,
          userId: user.id,
          documents: uploadedFiles,
        });
      }
    } else {
      // إرسال النموذج إذا كانت جميع المستندات موجودة
      // Submit form if all documents exist
      sellerRegistrationMutation.mutate({
        ...data,
        userId: user.id,
        documents: uploadedFiles,
      });
    }
  };
  
  // تحديث قيمة التقدم عند تغيير قيم النموذج
  // Update progress value when form values change
  const updateProgress = () => {
    const values = form.getValues();
    const totalFields = Object.keys(sellerFormSchema.shape).length;
    let filledFields = 0;
    
    // عد الحقول المعبأة
    // Count filled fields
    Object.entries(values).forEach(([key, value]) => {
      if (value && (typeof value === 'string' ? value.trim() !== "" : value !== false)) {
        filledFields++;
      }
    });
    
    // أضف إلى التقدم إذا تم تحميل المستندات
    // Add to progress if documents are uploaded
    if (uploadedFiles.identityDocument) filledFields++;
    if (uploadedFiles.taxDocument) filledFields++;
    if (uploadedFiles.commercialDocument) filledFields++;
    if (uploadedFiles.productPhotos.length > 0) filledFields++;
    
    const progress = Math.min(100, Math.round((filledFields / (totalFields + 4)) * 100));
    setFormProgress(progress);
  };
  
  // معالجة تغيير التبويب
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateProgress();
  };
  
  // معالجة تحميل الملفات
  // Handle file uploads
  const handleFileUpload = (type: keyof typeof uploadedFiles, files: string | string[]) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      if (Array.isArray(files)) {
        if (Array.isArray(newFiles[type])) {
          (newFiles[type] as string[]) = files;
        }
      } else {
        (newFiles[type] as string | null) = files;
      }
      return newFiles;
    });
    updateProgress();
  };
  
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>{isRTL ? "غير مسجل الدخول" : "Not Logged In"}</AlertTitle>
          <AlertDescription>
            {isRTL 
              ? "يجب عليك تسجيل الدخول أو إنشاء حساب أولاً قبل التسجيل كبائع."
              : "You must be logged in or create an account before registering as a seller."}
          </AlertDescription>
          <Button className="mt-4" onClick={() => navigate("/auth")}>
            {isRTL ? "تسجيل الدخول" : "Login"}
          </Button>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className={`container mx-auto py-8 ${isRTL ? "rtl" : ""}`}>
      <Card className="w-full max-w-6xl mx-auto shadow-lg">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isRTL ? "text-right text-2xl" : "text-2xl"}>
                {isRTL ? "سجل كبائع" : "Register as a Seller"}
              </CardTitle>
              <CardDescription className={isRTL ? "text-right" : ""}>
                {isRTL 
                  ? "أكمل النموذج أدناه لبدء البيع على EchoShop"
                  : "Complete the form below to start selling on EchoShop"}
              </CardDescription>
            </div>
            <div className="text-center">
              <div className="mb-1">{formProgress}% {isRTL ? "مكتمل" : "Complete"}</div>
              <Progress value={formProgress} className="w-[200px]" />
            </div>
          </div>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} onChange={updateProgress}>
            <Tabs defaultValue="basic" value={activeTab} onValueChange={handleTabChange}>
              <div className="px-6 pt-4">
                <TabsList className="w-full">
                  <TabsTrigger value="basic" className="flex-1">
                    {isRTL ? "معلومات أساسية" : "Basic Information"}
                  </TabsTrigger>
                  <TabsTrigger value="location" className="flex-1">
                    {isRTL ? "الموقع والعنوان" : "Location & Address"}
                  </TabsTrigger>
                  <TabsTrigger value="legal" className="flex-1">
                    {isRTL ? "معلومات قانونية" : "Legal Information"}
                  </TabsTrigger>
                  <TabsTrigger value="banking" className="flex-1">
                    {isRTL ? "معلومات البنك" : "Banking Details"}
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex-1">
                    {isRTL ? "المستندات" : "Documents"}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* معلومات أساسية */}
              {/* Basic Information */}
              <TabsContent value="basic">
                <CardContent className="grid gap-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "اسم المتجر (بالإنجليزية)" : "Store Name (English)"} *</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل اسم المتجر بالإنجليزية" : "Enter store name in English"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="storeNameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "اسم المتجر (بالعربية)" : "Store Name (Arabic)"} *</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل اسم المتجر بالعربية" : "Enter store name in Arabic"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "وصف المتجر (بالإنجليزية)" : "Store Description (English)"} *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={isRTL ? "اشرح ما يبيعه متجرك ولماذا يجب على العملاء الشراء منك" : "Explain what your store sells and why customers should buy from you"} 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="descriptionAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "وصف المتجر (بالعربية)" : "Store Description (Arabic)"} *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={isRTL ? "اشرح ما يبيعه متجرك ولماذا يجب على العملاء الشراء منك" : "Explain what your store sells and why customers should buy from you"} 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isRTL ? "رقم الهاتف" : "Phone Number"} *</FormLabel>
                        <FormControl>
                          <Input placeholder={isRTL ? "أدخل رقم الهاتف" : "Enter phone number"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "الموقع الإلكتروني (اختياري)" : "Website (Optional)"}</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل رابط موقعك" : "Enter your website URL"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input placeholder="@username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <Input placeholder="@username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => handleTabChange("location")}>
                      {isRTL ? "التالي: الموقع والعنوان" : "Next: Location & Address"}
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
              
              {/* الموقع والعنوان */}
              {/* Location & Address */}
              <TabsContent value="location">
                <CardContent className="grid gap-6 py-6">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "العنوان" : "Address"} *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={isRTL ? "أدخل عنوان الشارع الكامل" : "Enter full street address"} 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "المدينة" : "City"} *</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل المدينة" : "Enter city"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "المحافظة (اختياري)" : "State/Province (Optional)"}</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل المحافظة" : "Enter state or province"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "الرمز البريدي (اختياري)" : "Postal Code (Optional)"}</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل الرمز البريدي" : "Enter postal code"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "البلد" : "Country"} *</FormLabel>
                          <Select defaultValue={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={isRTL ? "اختر البلد" : "Select country"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Egypt">
                                {isRTL ? "مصر" : "Egypt"}
                              </SelectItem>
                              <SelectItem value="Saudi Arabia">
                                {isRTL ? "المملكة العربية السعودية" : "Saudi Arabia"}
                              </SelectItem>
                              <SelectItem value="UAE">
                                {isRTL ? "الإمارات العربية المتحدة" : "UAE"}
                              </SelectItem>
                              <SelectItem value="Kuwait">
                                {isRTL ? "الكويت" : "Kuwait"}
                              </SelectItem>
                              <SelectItem value="Qatar">
                                {isRTL ? "قطر" : "Qatar"}
                              </SelectItem>
                              <SelectItem value="Bahrain">
                                {isRTL ? "البحرين" : "Bahrain"}
                              </SelectItem>
                              <SelectItem value="Oman">
                                {isRTL ? "عمان" : "Oman"}
                              </SelectItem>
                              <SelectItem value="Jordan">
                                {isRTL ? "الأردن" : "Jordan"}
                              </SelectItem>
                              <SelectItem value="Other">
                                {isRTL ? "أخرى" : "Other"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => handleTabChange("basic")}>
                      {isRTL ? "السابق" : "Previous"}
                    </Button>
                    <Button type="button" onClick={() => handleTabChange("legal")}>
                      {isRTL ? "التالي: المعلومات القانونية" : "Next: Legal Information"}
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
              
              {/* معلومات قانونية */}
              {/* Legal Information */}
              <TabsContent value="legal">
                <CardContent className="grid gap-6 py-6">
                  <Alert variant="default" className="bg-primary/5 border-primary/20">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>
                      {isRTL ? "معلومات هامة" : "Important Information"}
                    </AlertTitle>
                    <AlertDescription>
                      {isRTL 
                        ? "يمكنك تقديم طلبك حتى إذا لم تكن لديك بعض المستندات القانونية. سيتم وضع طلبك في قائمة الانتظار للمراجعة."
                        : "You can submit your application even if you don't have some legal documents. Your application will be placed in a pending queue for review."}
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isRTL ? "نوع النشاط التجاري" : "Business Type"} *</FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? "اختر نوع النشاط التجاري" : "Select business type"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="individual">
                              {isRTL ? "فرد/شخصي" : "Individual/Personal"}
                            </SelectItem>
                            <SelectItem value="company">
                              {isRTL ? "شركة" : "Company"}
                            </SelectItem>
                            <SelectItem value="factory">
                              {isRTL ? "مصنع" : "Factory"}
                            </SelectItem>
                            <SelectItem value="reseller">
                              {isRTL ? "وسيط/موزع" : "Reseller/Distributor"}
                            </SelectItem>
                            <SelectItem value="dropshipper">
                              {isRTL ? "دروبشيبر" : "Dropshipper"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "رقم البطاقة الضريبية (اختياري)" : "Tax ID (Optional)"}</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل رقم البطاقة الضريبية" : "Enter tax ID number"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="commercialRegistry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "رقم السجل التجاري (اختياري)" : "Commercial Registry Number (Optional)"}</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل رقم السجل التجاري" : "Enter commercial registry number"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => handleTabChange("location")}>
                      {isRTL ? "السابق" : "Previous"}
                    </Button>
                    <Button type="button" onClick={() => handleTabChange("banking")}>
                      {isRTL ? "التالي: معلومات البنك" : "Next: Banking Details"}
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
              
              {/* معلومات البنك */}
              {/* Banking Details */}
              <TabsContent value="banking">
                <CardContent className="grid gap-6 py-6">
                  <Alert variant="default" className="bg-primary/5 border-primary/20">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>
                      {isRTL ? "معلومات اختيارية" : "Optional Information"}
                    </AlertTitle>
                    <AlertDescription>
                      {isRTL 
                        ? "معلومات البنك اختيارية في هذه المرحلة. يمكنك إكمالها لاحقًا بعد الموافقة على طلبك."
                        : "Banking information is optional at this stage. You can complete it later after your application is approved."}
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isRTL ? "اسم البنك (اختياري)" : "Bank Name (Optional)"}</FormLabel>
                        <FormControl>
                          <Input placeholder={isRTL ? "أدخل اسم البنك" : "Enter bank name"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="accountHolder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "اسم صاحب الحساب (اختياري)" : "Account Holder Name (Optional)"}</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل اسم صاحب الحساب" : "Enter account holder name"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="iban"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "رقم الـ IBAN (اختياري)" : "IBAN Number (Optional)"}</FormLabel>
                          <FormControl>
                            <Input placeholder={isRTL ? "أدخل رقم الـ IBAN" : "Enter IBAN number"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => handleTabChange("legal")}>
                      {isRTL ? "السابق" : "Previous"}
                    </Button>
                    <Button type="button" onClick={() => handleTabChange("documents")}>
                      {isRTL ? "التالي: المستندات" : "Next: Documents"}
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
              
              {/* المستندات */}
              {/* Documents */}
              <TabsContent value="documents">
                <CardContent className="grid gap-6 py-6">
                  <Alert variant="default" className="bg-primary/5 border-primary/20">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>
                      {isRTL ? "تحميل المستندات" : "Document Upload"}
                    </AlertTitle>
                    <AlertDescription>
                      {isRTL 
                        ? "يمكنك تقديم طلبك حتى إذا لم تتمكن من تحميل جميع المستندات. سنراجع المعلومات المتاحة ونتواصل معك إذا احتجنا إلى مزيد من المعلومات."
                        : "You can submit your application even if you cannot upload all documents. We will review the available information and contact you if we need more information."}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className={`font-medium mb-2 ${isRTL ? "text-right" : ""}`}>
                        {isRTL 
                          ? "بطاقة الهوية الشخصية أو جواز السفر (موصى به)" 
                          : "ID Card or Passport (Recommended)"}
                      </h3>
                      <FileUploader 
                        accept="image/*, application/pdf"
                        onUpload={(files) => handleFileUpload("identityDocument", files[0])}
                        isRTL={isRTL}
                      />
                      {uploadedFiles.identityDocument && (
                        <div className="mt-2 flex items-center text-sm text-green-600">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          {isRTL ? "تم تحميل المستند بنجاح" : "Document uploaded successfully"}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className={`font-medium mb-2 ${isRTL ? "text-right" : ""}`}>
                        {isRTL ? "البطاقة الضريبية (إذا كانت متاحة)" : "Tax Card (If available)"}
                      </h3>
                      <FileUploader 
                        accept="image/*, application/pdf"
                        onUpload={(files) => handleFileUpload("taxDocument", files[0])}
                        isRTL={isRTL}
                      />
                      {uploadedFiles.taxDocument && (
                        <div className="mt-2 flex items-center text-sm text-green-600">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          {isRTL ? "تم تحميل المستند بنجاح" : "Document uploaded successfully"}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className={`font-medium mb-2 ${isRTL ? "text-right" : ""}`}>
                        {isRTL ? "السجل التجاري (إذا كان متاحاً)" : "Commercial Registry (If available)"}
                      </h3>
                      <FileUploader 
                        accept="image/*, application/pdf"
                        onUpload={(files) => handleFileUpload("commercialDocument", files[0])}
                        isRTL={isRTL}
                      />
                      {uploadedFiles.commercialDocument && (
                        <div className="mt-2 flex items-center text-sm text-green-600">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          {isRTL ? "تم تحميل المستند بنجاح" : "Document uploaded successfully"}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className={`font-medium mb-2 ${isRTL ? "text-right" : ""}`}>
                        {isRTL ? "صور للمنتجات (إختياري)" : "Product Photos (Optional)"}
                      </h3>
                      <FileUploader 
                        accept="image/*"
                        multiple
                        onUpload={(files) => handleFileUpload("productPhotos", files)}
                        isRTL={isRTL}
                      />
                      {uploadedFiles.productPhotos.length > 0 && (
                        <div className="mt-2 flex items-center text-sm text-green-600">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          {isRTL 
                            ? `تم تحميل ${uploadedFiles.productPhotos.length} صورة بنجاح` 
                            : `${uploadedFiles.productPhotos.length} photos uploaded successfully`}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="termsAgreed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {isRTL 
                                ? "أوافق على شروط وأحكام EchoShop" 
                                : "I agree to EchoShop's Terms and Conditions"}
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              {isRTL 
                                ? "لقد قرأت وفهمت شروط وأحكام البائعين." 
                                : "I have read and understood the seller terms and conditions."}
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sellerAgreement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {isRTL 
                                ? "أوافق على اتفاقية البائع" 
                                : "I agree to the Seller Agreement"}
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              {isRTL 
                                ? "أفهم المسؤوليات والالتزامات المرتبطة ببيع المنتجات على EchoShop." 
                                : "I understand the responsibilities and obligations associated with selling products on EchoShop."}
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => handleTabChange("banking")}>
                      {isRTL ? "السابق" : "Previous"}
                    </Button>
                    <Button type="submit" disabled={sellerRegistrationMutation.isPending}>
                      {sellerRegistrationMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          {isRTL ? "جاري التقديم..." : "Submitting..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <BriefcaseIcon className="h-4 w-4" />
                          {isRTL ? "تقديم طلب البائع" : "Submit Seller Application"}
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
        
        <CardFooter className="bg-muted/10 border-t">
          <div className={isRTL ? "text-right w-full" : "w-full"}>
            <h3 className="font-medium mb-1">
              {isRTL ? "ماذا سيحدث بعد ذلك؟" : "What happens next?"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? "سيقوم فريق EchoShop بمراجعة طلبك وسيتواصل معك خلال 48 ساعة. قد نطلب معلومات إضافية إذا لزم الأمر."
                : "The EchoShop team will review your application and contact you within 48 hours. We may request additional information if necessary."}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}