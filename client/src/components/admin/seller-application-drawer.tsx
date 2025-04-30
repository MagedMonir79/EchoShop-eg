import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageContext } from "@/context/language-context";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Building, 
  User,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  FileText
} from "lucide-react";

// Define the application status types
type ApplicationStatus = "pending" | "approved" | "rejected" | "incomplete";

// Define the seller application type
type SellerApplication = {
  id: number;
  userId: number;
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
  status: ApplicationStatus;
  storeName: string;
  storeNameAr: string;
  description: string;
  descriptionAr: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  businessType: string;
  taxId?: string;
  commercialRegistry?: string;
  bankName?: string;
  iban?: string;
  accountHolder?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  createdAt: string;
  updatedAt: string;
  missingDocuments?: string[];
  missingFields?: string[];
  adminNotes?: string;
  adminReviewedAt?: string;
  documents: {
    identityDocument: string | null;
    taxDocument: string | null;
    commercialDocument: string | null;
    productPhotos: string[];
  };
};

interface SellerApplicationDrawerProps {
  application: SellerApplication;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (application: SellerApplication) => void;
  onRequestInfo: (application: SellerApplication) => void;
  isRTL: boolean;
}

export function SellerApplicationDrawer({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
  isRTL,
}: SellerApplicationDrawerProps) {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("basic");

  // Determine the status badge color and icon
  const getStatusDetails = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          label: isRTL ? "قيد المراجعة" : "Under Review"
        };
      case "approved":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
          icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
          label: isRTL ? "تمت الموافقة" : "Approved"
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
          icon: <XCircle className="h-4 w-4 mr-1" />,
          label: isRTL ? "مرفوض" : "Rejected"
        };
      case "incomplete":
        return {
          color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500",
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          label: isRTL ? "غير مكتمل" : "Incomplete"
        };
    }
  };

  const statusDetails = getStatusDetails(application.status);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side={isRTL ? "right" : "left"} className={`w-[90%] sm:w-[600px] max-w-md overflow-auto ${isRTL ? "rtl" : ""}`}>
        <ScrollArea className="h-full pr-4">
          <SheetHeader className="mb-5">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl">
                {isRTL ? "طلب البائع" : "Seller Application"}
              </SheetTitle>
              <Badge className={`${statusDetails.color}`}>
                {statusDetails.icon}
                <span>{statusDetails.label}</span>
              </Badge>
            </div>
            <SheetDescription>
              {isRTL ? "تفاصيل طلب البائع ومراجعة المعلومات المقدمة." : "Seller application details and submitted information review."}
            </SheetDescription>
          </SheetHeader>

          <div className="mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={application.user.avatar} alt={application.user.username} />
                <AvatarFallback>{application.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{application.user.username}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{application.user.email}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{application.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">
                {isRTL ? "أساسي" : "Basic"}
              </TabsTrigger>
              <TabsTrigger value="details">
                {isRTL ? "تفاصيل" : "Details"}
              </TabsTrigger>
              <TabsTrigger value="docs">
                {isRTL ? "مستندات" : "Docs"}
              </TabsTrigger>
              <TabsTrigger value="notes">
                {isRTL ? "ملاحظات" : "Notes"}
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold mb-2">
                    {isRTL ? "معلومات المتجر" : "Store Information"}
                  </h4>
                  <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">
                        {isRTL ? "اسم المتجر (الإنجليزية)" : "Store Name (English)"}
                      </span>
                      <span className="font-medium">{application.storeName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">
                        {isRTL ? "اسم المتجر (العربية)" : "Store Name (Arabic)"}
                      </span>
                      <span className="font-medium">{application.storeNameAr}</span>
                    </div>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">
                        {isRTL ? "وصف المتجر (الإنجليزية)" : "Store Description (English)"}
                      </span>
                      <p className="text-sm">{application.description}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">
                        {isRTL ? "وصف المتجر (العربية)" : "Store Description (Arabic)"}
                      </span>
                      <p className="text-sm">{application.descriptionAr}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-semibold mb-2">
                    {isRTL ? "معلومات الاتصال" : "Contact Information"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground block">
                          {isRTL ? "رقم الهاتف" : "Phone Number"}
                        </span>
                        <span className="font-medium">{application.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground block">
                          {isRTL ? "البريد الإلكتروني" : "Email"}
                        </span>
                        <span className="font-medium">{application.user.email}</span>
                      </div>
                    </div>
                    {application.website && (
                      <div className="flex items-center gap-2 col-span-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="text-sm text-muted-foreground block">
                            {isRTL ? "الموقع الإلكتروني" : "Website"}
                          </span>
                          <a 
                            href={application.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline"
                          >
                            {application.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-semibold mb-2">
                    {isRTL ? "وسائل التواصل الاجتماعي" : "Social Media"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border p-4">
                    {application.instagram && (
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Instagram</span>
                        <span className="font-medium">@{application.instagram}</span>
                      </div>
                    )}
                    {application.facebook && (
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Facebook</span>
                        <span className="font-medium">{application.facebook}</span>
                      </div>
                    )}
                    {application.twitter && (
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Twitter</span>
                        <span className="font-medium">@{application.twitter}</span>
                      </div>
                    )}
                    {!application.instagram && !application.facebook && !application.twitter && (
                      <div className="col-span-3 text-center text-muted-foreground text-sm py-2">
                        {isRTL ? "لم يتم تقديم معلومات التواصل الاجتماعي" : "No social media information provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold mb-2">
                    {isRTL ? "موقع المتجر" : "Store Location"}
                  </h4>
                  <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm text-muted-foreground block">
                          {isRTL ? "العنوان" : "Address"}
                        </span>
                        <span className="font-medium">{application.address}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          {isRTL ? "المدينة" : "City"}
                        </span>
                        <span className="font-medium">{application.city}</span>
                      </div>
                      {application.state && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">
                            {isRTL ? "المحافظة" : "State/Province"}
                          </span>
                          <span className="font-medium">{application.state}</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {application.postalCode && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">
                            {isRTL ? "الرمز البريدي" : "Postal Code"}
                          </span>
                          <span className="font-medium">{application.postalCode}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          {isRTL ? "البلد" : "Country"}
                        </span>
                        <span className="font-medium">{application.country}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-semibold mb-2">
                    {isRTL ? "معلومات قانونية" : "Legal Information"}
                  </h4>
                  <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground block">
                          {isRTL ? "نوع النشاط التجاري" : "Business Type"}
                        </span>
                        <span className="font-medium">
                          {application.businessType === "individual" ? (isRTL ? "فرد/شخصي" : "Individual/Personal") :
                           application.businessType === "company" ? (isRTL ? "شركة" : "Company") :
                           application.businessType === "factory" ? (isRTL ? "مصنع" : "Factory") :
                           application.businessType === "reseller" ? (isRTL ? "وسيط/موزع" : "Reseller/Distributor") :
                           application.businessType === "dropshipper" ? (isRTL ? "دروبشيبر" : "Dropshipper") : 
                           application.businessType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          {isRTL ? "رقم البطاقة الضريبية" : "Tax ID"}
                        </span>
                        {application.taxId ? (
                          <span className="font-medium">{application.taxId}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            {isRTL ? "غير متوفر" : "Not provided"}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          {isRTL ? "رقم السجل التجاري" : "Commercial Registry"}
                        </span>
                        {application.commercialRegistry ? (
                          <span className="font-medium">{application.commercialRegistry}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            {isRTL ? "غير متوفر" : "Not provided"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-semibold mb-2">
                    {isRTL ? "معلومات البنك" : "Banking Information"}
                  </h4>
                  <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                    {application.bankName || application.iban || application.accountHolder ? (
                      <>
                        {application.bankName && (
                          <div>
                            <span className="text-sm text-muted-foreground block mb-1">
                              {isRTL ? "اسم البنك" : "Bank Name"}
                            </span>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{application.bankName}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {application.accountHolder && (
                            <div>
                              <span className="text-sm text-muted-foreground block mb-1">
                                {isRTL ? "اسم صاحب الحساب" : "Account Holder"}
                              </span>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{application.accountHolder}</span>
                              </div>
                            </div>
                          )}
                          
                          {application.iban && (
                            <div>
                              <span className="text-sm text-muted-foreground block mb-1">
                                {isRTL ? "رقم الآيبان" : "IBAN Number"}
                              </span>
                              <span className="font-medium font-mono">{application.iban}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground text-sm py-4">
                        {isRTL ? "لم يتم تقديم معلومات بنكية" : "No banking information provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="docs">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold mb-2">
                    {isRTL ? "المستندات المقدمة" : "Submitted Documents"}
                  </h4>
                  
                  <div className="space-y-4 rounded-lg border p-4">
                    {/* Identity Document */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {isRTL ? "بطاقة الهوية / جواز السفر" : "ID Card / Passport"}
                        </span>
                        {application.documents.identityDocument ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> 
                            {isRTL ? "تم التقديم" : "Submitted"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
                            <XCircle className="h-3 w-3 mr-1" /> 
                            {isRTL ? "غير متوفر" : "Not Submitted"}
                          </Badge>
                        )}
                      </div>
                      
                      {application.documents.identityDocument ? (
                        <div className="rounded-md border overflow-hidden">
                          {application.documents.identityDocument.startsWith('data:image') ? (
                            <img 
                              src={application.documents.identityDocument} 
                              alt="Identity Document" 
                              className="w-full h-auto max-h-[200px] object-contain"
                            />
                          ) : (
                            <div className="p-4 bg-muted flex items-center justify-center">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                              <span className="ml-2 text-sm font-medium">
                                {isRTL ? "عرض المستند" : "View Document"}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/50 rounded-md text-center text-sm text-muted-foreground">
                          {isRTL ? "لم يتم تقديم مستند الهوية" : "No identity document submitted"}
                        </div>
                      )}
                    </div>
                    
                    {/* Tax Document */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {isRTL ? "البطاقة الضريبية" : "Tax Card"}
                        </span>
                        {application.documents.taxDocument ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> 
                            {isRTL ? "تم التقديم" : "Submitted"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
                            <XCircle className="h-3 w-3 mr-1" /> 
                            {isRTL ? "غير متوفر" : "Not Submitted"}
                          </Badge>
                        )}
                      </div>
                      
                      {application.documents.taxDocument ? (
                        <div className="rounded-md border overflow-hidden">
                          {application.documents.taxDocument.startsWith('data:image') ? (
                            <img 
                              src={application.documents.taxDocument} 
                              alt="Tax Document" 
                              className="w-full h-auto max-h-[200px] object-contain"
                            />
                          ) : (
                            <div className="p-4 bg-muted flex items-center justify-center">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                              <span className="ml-2 text-sm font-medium">
                                {isRTL ? "عرض المستند" : "View Document"}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/50 rounded-md text-center text-sm text-muted-foreground">
                          {isRTL ? "لم يتم تقديم البطاقة الضريبية" : "No tax document submitted"}
                        </div>
                      )}
                    </div>
                    
                    {/* Commercial Registry */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {isRTL ? "السجل التجاري" : "Commercial Registry"}
                        </span>
                        {application.documents.commercialDocument ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> 
                            {isRTL ? "تم التقديم" : "Submitted"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
                            <XCircle className="h-3 w-3 mr-1" /> 
                            {isRTL ? "غير متوفر" : "Not Submitted"}
                          </Badge>
                        )}
                      </div>
                      
                      {application.documents.commercialDocument ? (
                        <div className="rounded-md border overflow-hidden">
                          {application.documents.commercialDocument.startsWith('data:image') ? (
                            <img 
                              src={application.documents.commercialDocument} 
                              alt="Commercial Registry Document" 
                              className="w-full h-auto max-h-[200px] object-contain"
                            />
                          ) : (
                            <div className="p-4 bg-muted flex items-center justify-center">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                              <span className="ml-2 text-sm font-medium">
                                {isRTL ? "عرض المستند" : "View Document"}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/50 rounded-md text-center text-sm text-muted-foreground">
                          {isRTL ? "لم يتم تقديم السجل التجاري" : "No commercial registry document submitted"}
                        </div>
                      )}
                    </div>
                    
                    {/* Product Photos */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {isRTL ? "صور المنتجات" : "Product Photos"}
                        </span>
                        {application.documents.productPhotos && application.documents.productPhotos.length > 0 ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> 
                            {isRTL 
                              ? `${application.documents.productPhotos.length} صورة`
                              : `${application.documents.productPhotos.length} Photo${application.documents.productPhotos.length !== 1 ? 's' : ''}`}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                            <AlertTriangle className="h-3 w-3 mr-1" /> 
                            {isRTL ? "لا توجد صور" : "No Photos"}
                          </Badge>
                        )}
                      </div>
                      
                      {application.documents.productPhotos && application.documents.productPhotos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {application.documents.productPhotos.map((photo, index) => (
                            <div key={index} className="rounded-md border overflow-hidden">
                              <img 
                                src={photo} 
                                alt={`Product Photo ${index + 1}`} 
                                className="w-full h-24 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/50 rounded-md text-center text-sm text-muted-foreground">
                          {isRTL ? "لم يتم تقديم صور للمنتجات" : "No product photos submitted"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold mb-2">
                    {isRTL ? "معلومات المراجعة" : "Review Information"}
                  </h4>
                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          {isRTL ? "تاريخ التقديم" : "Submission Date"}
                        </span>
                        <span className="font-medium">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          {isRTL ? "رقم الطلب" : "Application ID"}
                        </span>
                        <span className="font-medium">#{application.id}</span>
                      </div>
                    </div>
                    
                    {application.adminReviewedAt && (
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          {isRTL ? "تاريخ المراجعة" : "Review Date"}
                        </span>
                        <span className="font-medium">
                          {new Date(application.adminReviewedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {application.adminNotes && (
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          {isRTL ? "ملاحظات المراجعة" : "Review Notes"}
                        </span>
                        <p className="text-sm p-2 bg-muted/30 rounded-md">{application.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Missing Information Section */}
                {(application.missingDocuments?.length > 0 || application.missingFields?.length > 0) && (
                  <div>
                    <h4 className="text-base font-semibold mb-2">
                      {isRTL ? "معلومات مفقودة" : "Missing Information"}
                    </h4>
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                        <span className="font-medium text-yellow-800 dark:text-yellow-500">
                          {isRTL ? "معلومات غير مكتملة" : "Incomplete Information"}
                        </span>
                      </div>
                      
                      {application.missingDocuments && application.missingDocuments.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-500 block mb-1">
                            {isRTL ? "المستندات المفقودة:" : "Missing Documents:"}
                          </span>
                          <ul className="list-disc list-inside space-y-1">
                            {application.missingDocuments.map((doc, index) => (
                              <li key={index} className="text-sm text-yellow-700 dark:text-yellow-400">
                                {doc === "identityDocument" ? (isRTL ? "بطاقة الهوية الشخصية" : "Identity Document") :
                                 doc === "taxDocument" ? (isRTL ? "البطاقة الضريبية" : "Tax Card") :
                                 doc === "commercialDocument" ? (isRTL ? "السجل التجاري" : "Commercial Registry") : doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {application.missingFields && application.missingFields.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-500 block mb-1">
                            {isRTL ? "الحقول المفقودة:" : "Missing Fields:"}
                          </span>
                          <ul className="list-disc list-inside space-y-1">
                            {application.missingFields.map((field, index) => (
                              <li key={index} className="text-sm text-yellow-700 dark:text-yellow-400">
                                {field === "phone" ? (isRTL ? "رقم الهاتف" : "Phone Number") :
                                 field === "address" ? (isRTL ? "العنوان" : "Address") :
                                 field === "storeName" ? (isRTL ? "اسم المتجر" : "Store Name") :
                                 field === "businessType" ? (isRTL ? "نوع النشاط التجاري" : "Business Type") : field}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <SheetFooter className="mt-6 border-t pt-6 flex justify-between">
            <Button variant="outline" onClick={onClose}>
              {isRTL ? "إغلاق" : "Close"}
            </Button>
            <div className="flex items-center gap-2">
              {(application.status === "pending" || application.status === "incomplete") && (
                <>
                  <Button 
                    variant="default" 
                    onClick={() => onApprove(application.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {isRTL ? "موافقة" : "Approve"}
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={() => onReject(application)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    {isRTL ? "رفض" : "Reject"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => onRequestInfo(application)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {isRTL ? "طلب معلومات" : "Request Info"}
                  </Button>
                </>
              )}
              
              {application.status === "rejected" && (
                <Button onClick={() => onApprove(application.id)}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {isRTL ? "إعادة تفعيل & موافقة" : "Reactivate & Approve"}
                </Button>
              )}
              
              {application.status === "approved" && (
                <Button 
                  variant="destructive" 
                  onClick={() => onReject(application)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  {isRTL ? "إلغاء الموافقة" : "Revoke Approval"}
                </Button>
              )}
            </div>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// Temporary component for Globe icon which isn't directly imported from Lucide
function Globe(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}