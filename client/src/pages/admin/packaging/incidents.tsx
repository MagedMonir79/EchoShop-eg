import { useState, useEffect, useContext } from "react";
import AdminDashboardLayout from "@/components/layout/admin-dashboard-layout";
import { LanguageContext } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Search, AlertCircle, CheckCircle, XCircle, 
  Clock, AlertTriangle, Eye, MessageSquare, Image
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter,
  DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";

// بيانات تجريبية
const incidents = [
  { 
    id: 1, 
    qrCodeId: 12345, 
    orderId: 45678,
    productName: "سماعات بلوتوث لاسلكية",
    reportedBy: "customer", 
    reporterId: 98765, 
    reporterName: "أحمد محمود",
    incidentType: "damaged", 
    description: "وصلت السماعات وبها كسر في الجانب الأيمن نتيجة سوء التغليف",
    evidenceUrls: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"], 
    status: "investigating", 
    resolution: null, 
    createdAt: "2023-06-17T10:30:00", 
    resolvedAt: null 
  },
  { 
    id: 2, 
    qrCodeId: 12346,
    orderId: 45679,
    productName: "ساعة ذكية مقاومة للماء",
    reportedBy: "shipping_company", 
    reporterId: 9876, 
    reporterName: "شركة التوصيل السريع",
    incidentType: "tampered", 
    description: "لاحظنا أن غلاف العلبة تم فتحه وإعادة إغلاقه قبل الاستلام من البائع",
    evidenceUrls: ["https://example.com/img3.jpg"], 
    status: "resolved", 
    resolution: "تم التواصل مع البائع وتنبيهه على ضرورة الالتزام بمعايير التغليف", 
    createdAt: "2023-06-16T09:15:00", 
    resolvedAt: "2023-06-16T14:30:00" 
  },
  { 
    id: 3, 
    qrCodeId: 12347,
    orderId: 45680,
    productName: "مكبر صوت محمول",
    reportedBy: "customer", 
    reporterId: 98764, 
    reporterName: "سارة أحمد",
    incidentType: "wrong_product", 
    description: "استلمت منتج مختلف تماماً عن الذي طلبته. المنتج المستلم هو شاحن وليس مكبر صوت",
    evidenceUrls: ["https://example.com/img4.jpg", "https://example.com/img5.jpg"], 
    status: "pending", 
    resolution: null, 
    createdAt: "2023-06-18T11:45:00", 
    resolvedAt: null 
  },
  { 
    id: 4, 
    qrCodeId: 12348,
    orderId: 45681,
    productName: "طقم أواني طهي",
    reportedBy: "shipping_company", 
    reporterId: 9875, 
    reporterName: "شركة التوصيل الآمن",
    incidentType: "damaged", 
    description: "العبوة تضررت أثناء النقل نظراً لعدم كفاية التغليف الواقي",
    evidenceUrls: ["https://example.com/img6.jpg"], 
    status: "resolved", 
    resolution: "تم تدريب البائع على أساليب التغليف المناسبة للمنتجات القابلة للكسر", 
    createdAt: "2023-06-15T15:20:00", 
    resolvedAt: "2023-06-15T18:30:00" 
  },
  { 
    id: 5, 
    qrCodeId: 12349,
    orderId: 45682,
    productName: "حقيبة ظهر جلدية",
    reportedBy: "customer", 
    reporterId: 98763, 
    reporterName: "محمد علي",
    incidentType: "tampered", 
    description: "وصلت الحقيبة وعليها علامات فتح سابق للعبوة، وبها خدوش لم تكن ظاهرة في صور المنتج",
    evidenceUrls: ["https://example.com/img7.jpg", "https://example.com/img8.jpg"], 
    status: "investigating", 
    resolution: null, 
    createdAt: "2023-06-16T12:10:00", 
    resolvedAt: null 
  }
];

// حالة الحادثة كمكون
const IncidentStatus = ({ status }: { status: string }) => {
  let color, icon, label;

  switch (status) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800";
      icon = <Clock className="w-3 h-3 mr-1" />;
      label = "في الانتظار";
      break;
    case "investigating":
      color = "bg-blue-100 text-blue-800";
      icon = <AlertTriangle className="w-3 h-3 mr-1" />;
      label = "قيد التحقيق";
      break;
    case "resolved":
      color = "bg-green-100 text-green-800";
      icon = <CheckCircle className="w-3 h-3 mr-1" />;
      label = "تم الحل";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
      icon = <AlertTriangle className="w-3 h-3 mr-1" />;
      label = "غير معروف";
  }

  return (
    <span className={`flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
};

// نوع الحادثة كمكون
const IncidentType = ({ type }: { type: string }) => {
  let color, icon, label;

  switch (type) {
    case "damaged":
      color = "bg-red-100 text-red-800";
      icon = <AlertCircle className="w-3 h-3 mr-1" />;
      label = "تلف";
      break;
    case "tampered":
      color = "bg-purple-100 text-purple-800";
      icon = <AlertTriangle className="w-3 h-3 mr-1" />;
      label = "عبث";
      break;
    case "wrong_product":
      color = "bg-orange-100 text-orange-800";
      icon = <XCircle className="w-3 h-3 mr-1" />;
      label = "منتج خاطئ";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
      icon = <AlertTriangle className="w-3 h-3 mr-1" />;
      label = "آخر";
  }

  return (
    <span className={`flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
};

// مكون تفاصيل الحادثة
function IncidentDetailsDialog({ incident }: { incident: any }) {
  const { t, language } = useContext(LanguageContext);
  const [resolution, setResolution] = useState(incident.resolution || "");
  const { toast } = useToast();

  const handleResolve = () => {
    toast({
      title: t("incidentResolved"),
      description: t("incidentHasBeenResolvedSuccessfully"),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("incidentDetails")}</DialogTitle>
          <DialogDescription>
            {t("incidentForOrderId", { id: incident.orderId })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="md:col-span-1 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("incidentInfo")}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("incidentId")}</span>
                  <span className="text-sm font-medium">#{incident.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("qrCodeId")}</span>
                  <span className="text-sm font-medium">#{incident.qrCodeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("orderId")}</span>
                  <span className="text-sm font-medium">#{incident.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("reportedAt")}</span>
                  <span className="text-sm font-medium">
                    {new Date(incident.createdAt).toLocaleDateString(
                      language === 'ar' ? 'ar-EG' : 'en-US'
                    )}
                  </span>
                </div>
                {incident.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t("resolvedAt")}</span>
                    <span className="text-sm font-medium">
                      {new Date(incident.resolvedAt).toLocaleDateString(
                        language === 'ar' ? 'ar-EG' : 'en-US'
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("status")}</p>
              <IncidentStatus status={incident.status} />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("incidentType")}</p>
              <IncidentType type={incident.incidentType} />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("reportedBy")}</p>
              <div className="p-2 bg-secondary rounded-md">
                <p className="text-sm font-medium">{incident.reporterName}</p>
                <p className="text-xs text-muted-foreground">
                  {incident.reportedBy === 'customer' ? t("customer") : 
                   incident.reportedBy === 'shipping_company' ? t("shippingCompany") : t("other")}
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{t("description")}</p>
                <p className="text-xs text-muted-foreground">{t("product")}: {incident.productName}</p>
              </div>
              <div className="p-3 bg-secondary rounded-md">
                <p className="text-sm">{incident.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("evidence")}</p>
              <div className="grid grid-cols-2 gap-2">
                {incident.evidenceUrls.map((url: string, index: number) => (
                  <div key={index} className="relative aspect-square bg-secondary rounded-md flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/60 rounded-md transition-opacity">
                      <Button variant="secondary" size="sm">
                        {t("view")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {incident.status === "resolved" ? t("resolution") : t("addResolution")}
              </p>
              {incident.status === "resolved" ? (
                <div className="p-3 bg-secondary rounded-md">
                  <p className="text-sm">{incident.resolution}</p>
                </div>
              ) : (
                <Textarea
                  placeholder={t("enterResolutionNotes")}
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="h-24"
                />
              )}
            </div>
            
            {incident.status !== "resolved" && (
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">{t("cancel")}</Button>
                </DialogClose>
                <Button onClick={handleResolve}>{t("markAsResolved")}</Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function IncidentsManagement() {
  const { t, language } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const { toast } = useToast();

  // محاكاة الحصول على البيانات
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // تصفية وفرز البيانات
  const filteredIncidents = incidents.filter(incident => {
    if (currentTab !== 'all' && incident.status !== currentTab) {
      return false;
    }
    
    if (searchQuery) {
      return (
        incident.orderId.toString().includes(searchQuery) ||
        incident.productName.includes(searchQuery) ||
        incident.reporterName.includes(searchQuery)
      );
    }
    
    return true;
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t("packagingIncidentsManagement")}</h1>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("packagingIncidentsList")}</CardTitle>
            <CardDescription>{t("trackAndManagePackagingIncidentsAndComplaints")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <Tabs
                  value={currentTab}
                  onValueChange={setCurrentTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                    <TabsTrigger value="all">{t("all")}</TabsTrigger>
                    <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
                    <TabsTrigger value="investigating">{t("investigating")}</TabsTrigger>
                    <TabsTrigger value="resolved">{t("resolved")}</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full sm:w-auto flex">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder={t("searchByOrderOrReporter")}
                    className="pl-9 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("incidentId")}</TableHead>
                          <TableHead>{t("orderId")}</TableHead>
                          <TableHead>{t("product")}</TableHead>
                          <TableHead>{t("reportedBy")}</TableHead>
                          <TableHead>{t("incidentType")}</TableHead>
                          <TableHead>{t("status")}</TableHead>
                          <TableHead>{t("date")}</TableHead>
                          <TableHead className="text-right">{t("actions")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredIncidents.map((incident) => (
                          <TableRow key={incident.id}>
                            <TableCell className="font-medium">#{incident.id}</TableCell>
                            <TableCell>#{incident.orderId}</TableCell>
                            <TableCell>{incident.productName}</TableCell>
                            <TableCell>{incident.reporterName}</TableCell>
                            <TableCell>
                              <IncidentType type={incident.incidentType} />
                            </TableCell>
                            <TableCell>
                              <IncidentStatus status={incident.status} />
                            </TableCell>
                            <TableCell>
                              {new Date(incident.createdAt).toLocaleDateString(
                                language === 'ar' ? 'ar-EG' : 'en-US'
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <IncidentDetailsDialog incident={incident} />
                                <Button variant="ghost" size="icon">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {t("showing")} {filteredIncidents.length} {t("of")} {incidents.length} {t("incidents")}
                    </p>
                    
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}