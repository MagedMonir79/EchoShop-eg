import { useContext, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { LanguageContext } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Store,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  User as UserIcon,
  Clock,
  Download,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowDownToDot,
  AlertTriangle,
  SendHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Sample data for seller applications
const SELLER_APPLICATIONS = [
  {
    id: "APP-001",
    storeName: "متجر الإلكترونيات الحديثة",
    storeNameEn: "Modern Electronics Store",
    owner: {
      name: "أيمن الصالح",
      email: "ayman@example.com",
      phone: "+201234567890",
      avatar: "",
    },
    description: "متجر متخصص في الأجهزة الإلكترونية الحديثة وإكسسواراتها",
    descriptionEn: "Store specialized in modern electronic devices and accessories",
    category: "إلكترونيات",
    address: "القاهرة، مصر",
    documents: [
      { name: "السجل التجاري", status: "verified", url: "#" },
      { name: "البطاقة الضريبية", status: "verified", url: "#" },
      { name: "عقد الإيجار", status: "pending", url: "#" },
    ],
    submittedAt: "2023-12-07T15:30:00",
    status: "pending",
    lastUpdateAt: "2023-12-08T10:15:00",
    notes: "بانتظار التحقق من وثائق إضافية",
    missingDocuments: ["صور المتجر", "شهادة الضمان"],
    missingFields: [],
  },
  {
    id: "APP-002",
    storeName: "بوتيك الأزياء الراقية",
    storeNameEn: "Elegant Fashion Boutique",
    owner: {
      name: "ليلى كريم",
      email: "laila@example.com",
      phone: "+201987654321",
      avatar: "",
    },
    description: "بوتيك متخصص في الأزياء النسائية الراقية والإكسسوارات الفاخرة",
    descriptionEn: "Boutique specialized in elegant women's fashion and luxury accessories",
    category: "أزياء",
    address: "الإسكندرية، مصر",
    documents: [
      { name: "السجل التجاري", status: "verified", url: "#" },
      { name: "البطاقة الضريبية", status: "pending", url: "#" },
      { name: "عقد الإيجار", status: "verified", url: "#" },
    ],
    submittedAt: "2023-12-06T12:45:00",
    status: "pending",
    lastUpdateAt: "2023-12-08T09:30:00",
    notes: "يرجى التحقق من البطاقة الضريبية",
    missingDocuments: [],
    missingFields: ["وصف المتجر بالإنجليزية"],
  },
  {
    id: "APP-003",
    storeName: "متجر العطور الفاخرة",
    storeNameEn: "Luxury Perfumes Store",
    owner: {
      name: "فهد العنزي",
      email: "fahad@example.com",
      phone: "+201122334455",
      avatar: "",
    },
    description: "متجر متخصص في العطور الفاخرة والعود والبخور",
    descriptionEn: "Store specialized in luxury perfumes, oud, and incense",
    category: "جمال وعناية",
    address: "الجيزة، مصر",
    documents: [
      { name: "السجل التجاري", status: "verified", url: "#" },
      { name: "البطاقة الضريبية", status: "verified", url: "#" },
      { name: "عقد الإيجار", status: "verified", url: "#" },
    ],
    submittedAt: "2023-12-05T09:15:00",
    status: "pending",
    lastUpdateAt: "2023-12-07T14:45:00",
    notes: "",
    missingDocuments: [],
    missingFields: [],
  },
  {
    id: "APP-004",
    storeName: "أكسسوارات التكنولوجيا",
    storeNameEn: "Tech Accessories",
    owner: {
      name: "سمر الشمري",
      email: "samar@example.com",
      phone: "+201567891234",
      avatar: "",
    },
    description: "متجر متخصص في إكسسوارات الهواتف والحواسيب والتقنيات الحديثة",
    descriptionEn: "Store specialized in phone, computer, and modern technology accessories",
    category: "إلكترونيات",
    address: "المنصورة، مصر",
    documents: [
      { name: "السجل التجاري", status: "pending", url: "#" },
      { name: "البطاقة الضريبية", status: "pending", url: "#" },
      { name: "عقد الإيجار", status: "pending", url: "#" },
    ],
    submittedAt: "2023-12-04T16:00:00",
    status: "incomplete",
    lastUpdateAt: "2023-12-06T11:20:00",
    notes: "مستندات غير مكتملة",
    missingDocuments: ["السجل التجاري", "البطاقة الضريبية", "عقد الإيجار"],
    missingFields: ["فئة المتجر", "عنوان المتجر التفصيلي"],
  },
  {
    id: "APP-005",
    storeName: "دار الكتب والهدايا",
    storeNameEn: "Books & Gifts House",
    owner: {
      name: "محمد عبدالله",
      email: "mohamed@example.com",
      phone: "+201231231231",
      avatar: "",
    },
    description: "متجر متخصص في الكتب والهدايا الثقافية",
    descriptionEn: "Store specialized in books and cultural gifts",
    category: "كتب وترفيه",
    address: "القاهرة، مصر",
    documents: [
      { name: "السجل التجاري", status: "verified", url: "#" },
      { name: "البطاقة الضريبية", status: "verified", url: "#" },
      { name: "عقد الإيجار", status: "verified", url: "#" },
    ],
    submittedAt: "2023-12-03T11:30:00",
    status: "approved",
    lastUpdateAt: "2023-12-05T13:40:00",
    notes: "تمت الموافقة",
    missingDocuments: [],
    missingFields: [],
  },
  {
    id: "APP-006",
    storeName: "منتجات الصحة والعافية",
    storeNameEn: "Health & Wellness Products",
    owner: {
      name: "نورا الحسن",
      email: "noura@example.com",
      phone: "+201234123412",
      avatar: "",
    },
    description: "متجر متخصص في المنتجات الصحية والعضوية",
    descriptionEn: "Store specialized in health and organic products",
    category: "صحة وعافية",
    address: "طنطا، مصر",
    documents: [
      { name: "السجل التجاري", status: "verified", url: "#" },
      { name: "البطاقة الضريبية", status: "verified", url: "#" },
      { name: "عقد الإيجار", status: "verified", url: "#" },
    ],
    submittedAt: "2023-12-02T14:20:00",
    status: "rejected",
    lastUpdateAt: "2023-12-04T09:15:00",
    notes: "المنتجات لا تتوافق مع سياسة المتجر",
    missingDocuments: [],
    missingFields: [],
  },
];

export default function SellerApplicationsPage() {
  const { language, t } = useContext(LanguageContext);
  const isRTL = language === "ar";
  
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // Define types for our application structure
  interface Document {
    name: string;
    status: string;
    url: string;
  }

  interface SellerApplicationOwner {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  }

  interface SellerApplication {
    id: string;
    storeName: string;
    storeNameEn: string;
    owner: SellerApplicationOwner;
    description: string;
    descriptionEn: string;
    category: string;
    address: string;
    documents: Document[];
    submittedAt: string;
    status: string;
    lastUpdateAt: string;
    notes: string;
    missingDocuments: string[];
    missingFields: string[];
  }
  
  const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [applications, setApplications] = useState<SellerApplication[]>(SELLER_APPLICATIONS);
  
  // Handle application approval
  const handleApprove = (applicationId: string): void => {
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === applicationId 
          ? { ...app, status: "approved", lastUpdateAt: new Date().toISOString(), notes: "تمت الموافقة" } 
          : app
      )
    );
  };
  
  // Handle application rejection
  const handleReject = (applicationId: string): void => {
    if (!rejectionReason) return;
    
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: "rejected", 
              lastUpdateAt: new Date().toISOString(), 
              notes: rejectionReason 
            } 
          : app
      )
    );
    
    setRejectionReason("");
    setShowRejectionDialog(false);
  };
  
  // Handle request for additional documents
  const handleRequestDocuments = (applicationId: string, documents: string[]): void => {
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: "incomplete", 
              lastUpdateAt: new Date().toISOString(), 
              notes: "طلب وثائق إضافية",
              missingDocuments: documents
            } 
          : app
      )
    );
  };
  
  // Filter applications based on tab and search
  const filteredApplications = applications.filter(app => {
    // Filter by status
    if (activeTab !== "all" && app.status !== activeTab) return false;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        app.id.toLowerCase().includes(query) ||
        app.storeName.toLowerCase().includes(query) ||
        app.storeNameEn.toLowerCase().includes(query) ||
        app.owner.name.toLowerCase().includes(query) ||
        app.owner.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: string): React.ReactNode => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            {t("pending") || "قيد الانتظار"}
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t("approved") || "تمت الموافقة"}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500">
            <XCircle className="mr-1 h-3 w-3" />
            {t("rejected") || "مرفوض"}
          </Badge>
        );
      case "incomplete":
        return (
          <Badge className="bg-orange-500/20 text-orange-500 border-orange-500">
            <AlertCircle className="mr-1 h-3 w-3" />
            {t("incomplete") || "غير مكتمل"}
          </Badge>
        );
      default:
        return (
          <Badge>
            {status}
          </Badge>
        );
    }
  };
  
  // Get document status badge
  const getDocumentStatusBadge = (status: string): React.ReactNode => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500">
            <Check className="mr-1 h-3 w-3" />
            {t("verified") || "تم التحقق"}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            {t("pending") || "قيد الانتظار"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  return (
    <AdminLayout>
      <div className={`p-6 ${isRTL ? "rtl" : ""}`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {t("sellerApplications") || "طلبات البائعين"}
            </h1>
            <p className="text-muted-foreground">
              {t("sellerApplicationsDescription") || "إدارة ومراجعة طلبات البائعين الجدد"}
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("exportData") || "تصدير البيانات"}
            </Button>
          </div>
        </div>
        
        {/* Filter and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">
                {t("all") || "الكل"} 
                <Badge className="ml-2 bg-gray-500">{applications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t("pending") || "قيد الانتظار"} 
                <Badge className="ml-2 bg-yellow-500">
                  {applications.filter(a => a.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                {t("approved") || "تمت الموافقة"} 
                <Badge className="ml-2 bg-green-500">
                  {applications.filter(a => a.status === "approved").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                {t("rejected") || "مرفوض"} 
                <Badge className="ml-2 bg-red-500">
                  {applications.filter(a => a.status === "rejected").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="incomplete">
                {t("incomplete") || "غير مكتمل"} 
                <Badge className="ml-2 bg-orange-500">
                  {applications.filter(a => a.status === "incomplete").length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("searchApplications") || "البحث في الطلبات..."}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {t("filter") || "تصفية"}
            </Button>
          </div>
        </div>
        
        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("applicationId") || "رقم الطلب"}</TableHead>
                  <TableHead>{t("storeName") || "اسم المتجر"}</TableHead>
                  <TableHead>{t("owner") || "المالك"}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("submittedAt") || "تاريخ التقديم"}</TableHead>
                  <TableHead>{t("status") || "الحالة"}</TableHead>
                  <TableHead className="text-right">{t("actions") || "الإجراءات"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{application.storeName}</span>
                        <span className="text-xs text-muted-foreground">{application.storeNameEn}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{application.owner.name}</span>
                        <span className="text-xs text-muted-foreground">{application.owner.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(application.submittedAt)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isRTL ? "start" : "end"}>
                          <DropdownMenuItem onClick={() => setSelectedApplication(application)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("viewDetails") || "عرض التفاصيل"}
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          {application.status === "pending" && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleApprove(application.id)}
                                className="text-green-500 focus:text-green-500"
                              >
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                {t("approve") || "موافقة"}
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setShowRejectionDialog(true);
                                }}
                                className="text-red-500 focus:text-red-500"
                              >
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                {t("reject") || "رفض"}
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem onClick={() => {
                                setSelectedApplication(application);
                                // Would show a dialog for requesting documents in a real app
                              }}>
                                <ArrowDownToDot className="mr-2 h-4 w-4" />
                                {t("requestDocuments") || "طلب وثائق"}
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          {application.status === "approved" && (
                            <DropdownMenuItem onClick={() => {
                              // Would navigate to the seller's profile in a real app
                            }}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              {t("viewSellerProfile") || "عرض ملف البائع"}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredApplications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-lg font-medium mb-1">
                          {t("noApplicationsFound") || "لم يتم العثور على طلبات"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {searchQuery 
                            ? t("noApplicationsFoundForSearch") || "لم يتم العثور على طلبات تطابق بحثك"
                            : t("noApplicationsExist") || "لا توجد طلبات في هذه الفئة"
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t("previous") || "السابق"}
          </Button>
          <div className="text-sm text-muted-foreground">
            {t("page", { current: 1, total: 1 }) || "صفحة 1 من 1"}
          </div>
          <Button variant="outline" size="sm">
            {t("next") || "التالي"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
      
      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog 
          open={selectedApplication !== null && !showRejectionDialog} 
          onOpenChange={(open) => !open && setSelectedApplication(null)}
        >
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {t("applicationDetails") || "تفاصيل الطلب"} - {selectedApplication.id}
              </DialogTitle>
              <DialogDescription>
                {t("applicationDetailsDescription") || "مراجعة تفاصيل طلب البائع"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Application Status */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("status") || "الحالة"}:
                  </span>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("lastUpdated") || "آخر تحديث"}: {formatDate(selectedApplication.lastUpdateAt)}
                </div>
              </div>
              
              {/* Store Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("storeInformation") || "معلومات المتجر"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <Label>{t("storeName") || "اسم المتجر"} ({t("arabic") || "عربي"})</Label>
                      <div className="font-medium">{selectedApplication.storeName}</div>
                    </div>
                    <div>
                      <Label>{t("storeNameEn") || "اسم المتجر"} ({t("english") || "إنجليزي"})</Label>
                      <div className="font-medium">{selectedApplication.storeNameEn}</div>
                    </div>
                    <div>
                      <Label>{t("category") || "الفئة"}</Label>
                      <div>{selectedApplication.category}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <Label>{t("description") || "الوصف"} ({t("arabic") || "عربي"})</Label>
                      <div className="text-sm">{selectedApplication.description}</div>
                    </div>
                    <div>
                      <Label>{t("descriptionEn") || "الوصف"} ({t("english") || "إنجليزي"})</Label>
                      <div className="text-sm">{selectedApplication.descriptionEn}</div>
                    </div>
                    <div>
                      <Label>{t("address") || "العنوان"}</Label>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        {selectedApplication.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Owner Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("ownerInformation") || "معلومات المالك"}
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedApplication.owner.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedApplication.owner.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedApplication.owner.name}</div>
                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {selectedApplication.owner.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {selectedApplication.owner.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Documents */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("documents") || "المستندات"}
                </h3>
                <div className="space-y-2">
                  {selectedApplication.documents.map((doc, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-md border border-gray-700">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocumentStatusBadge(doc.status)}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("viewDocument") || "عرض المستند"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Missing Documents */}
                {selectedApplication.missingDocuments && selectedApplication.missingDocuments.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{t("missingDocuments") || "المستندات المفقودة"}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedApplication.missingDocuments.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Missing Fields */}
                {selectedApplication.missingFields && selectedApplication.missingFields.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{t("missingFields") || "الحقول المفقودة"}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedApplication.missingFields.map((field, index) => (
                        <li key={index}>{field}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Notes */}
              {selectedApplication.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {t("notes") || "ملاحظات"}
                    </h3>
                    <div className="p-3 bg-gray-800 rounded-md text-sm">
                      {selectedApplication.notes}
                    </div>
                  </div>
                </>
              )}
              
              {/* Action Buttons for Pending Applications */}
              {selectedApplication.status === "pending" && (
                <>
                  <Separator />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Would show a dialog for requesting documents in a real app
                      }}
                    >
                      <ArrowDownToDot className="mr-2 h-4 w-4" />
                      {t("requestDocuments") || "طلب وثائق"}
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => setShowRejectionDialog(true)}
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      {t("reject") || "رفض"}
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApprove(selectedApplication.id);
                        setSelectedApplication(null);
                      }}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {t("approve") || "موافقة"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Rejection Reason Dialog */}
      <Dialog 
        open={showRejectionDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setShowRejectionDialog(false);
            if (!selectedApplication) setRejectionReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("rejectApplication") || "رفض الطلب"}</DialogTitle>
            <DialogDescription>
              {t("rejectApplicationDescription") || "يرجى توضيح سبب رفض طلب البائع. سيتم إرسال هذه المعلومات إلى مقدم الطلب."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">{t("rejectionReason") || "سبب الرفض"}</Label>
              <Textarea
                id="rejection-reason"
                placeholder={t("enterRejectionReason") || "أدخل سبب الرفض..."}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowRejectionDialog(false);
              setRejectionReason("");
            }}>
              {t("cancel") || "إلغاء"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedApplication && handleReject(selectedApplication.id)}
              disabled={!rejectionReason}
            >
              <SendHorizontal className="mr-2 h-4 w-4" />
              {t("sendRejection") || "إرسال الرفض"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}