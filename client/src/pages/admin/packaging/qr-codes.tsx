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
import { Badge } from "@/components/ui/badge";
import { 
  Search, Plus, FileDown, Printer, QrCode, RefreshCw,
  CheckCircle, XCircle, Clock, AlertTriangle, Eye
} from "lucide-react";
import QRCode from "react-qr-code";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

// بيانات تجريبية
const qrCodes = [
  { 
    id: 1, 
    orderId: 12345, 
    orderItemId: 54321, 
    status: "verified_by_seller", 
    content: {
      productId: 123,
      productName: "سماعات بلوتوث لاسلكية",
      productSku: "BT-HP-001",
      seller: "إلكترونيات أمازون",
      price: 799,
      orderDate: "2023-06-15",
      packingDate: "2023-06-16"
    },
    isVerified: true,
    isScanned: true,
    scannedAt: "2023-06-17T09:30:00",
    scannedBy: "seller",
    createdAt: "2023-06-15T14:30:00"
  },
  { 
    id: 2, 
    orderId: 12346, 
    orderItemId: 54322, 
    status: "picked_up", 
    content: {
      productId: 124,
      productName: "ساعة ذكية مقاومة للماء",
      productSku: "SM-WT-002",
      seller: "إلكترونيات المستقبل",
      price: 1799,
      orderDate: "2023-06-15",
      packingDate: "2023-06-15"
    },
    isVerified: true,
    isScanned: true,
    scannedAt: "2023-06-16T11:45:00",
    scannedBy: "shipping_company",
    createdAt: "2023-06-15T10:20:00"
  },
  { 
    id: 3, 
    orderId: 12347, 
    orderItemId: 54323, 
    status: "pending", 
    content: {
      productId: 125,
      productName: "مكبر صوت محمول",
      productSku: "SP-BT-003",
      seller: "الصوتيات الحديثة",
      price: 599,
      orderDate: "2023-06-16",
      packingDate: null
    },
    isVerified: false,
    isScanned: false,
    scannedAt: null,
    scannedBy: null,
    createdAt: "2023-06-16T09:15:00"
  },
  { 
    id: 4, 
    orderId: 12348, 
    orderItemId: 54324, 
    status: "rejected", 
    content: {
      productId: 126,
      productName: "شاحن لاسلكي سريع",
      productSku: "CH-WL-004",
      seller: "إكسسوارات موبايل",
      price: 299,
      orderDate: "2023-06-14",
      packingDate: "2023-06-14"
    },
    isVerified: false,
    isScanned: true,
    scannedAt: "2023-06-15T13:20:00",
    scannedBy: "shipping_company",
    createdAt: "2023-06-14T16:40:00"
  },
  { 
    id: 5, 
    orderId: 12349, 
    orderItemId: 54325, 
    status: "delivered", 
    content: {
      productId: 127,
      productName: "طقم أواني طهي",
      productSku: "HM-CK-005",
      seller: "المنزل الأنيق",
      price: 1499,
      orderDate: "2023-06-13",
      packingDate: "2023-06-14"
    },
    isVerified: true,
    isScanned: true,
    scannedAt: "2023-06-18T15:10:00",
    scannedBy: "customer",
    createdAt: "2023-06-13T11:30:00"
  }
];

// حالة QR كمكون
const QrCodeStatus = ({ status }: { status: string }) => {
  let color, icon, label;

  switch (status) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800";
      icon = <Clock className="w-3 h-3 mr-1" />;
      label = "في الانتظار";
      break;
    case "packed":
      color = "bg-blue-100 text-blue-800";
      icon = <QrCode className="w-3 h-3 mr-1" />;
      label = "تم التغليف";
      break;
    case "verified_by_seller":
      color = "bg-indigo-100 text-indigo-800";
      icon = <CheckCircle className="w-3 h-3 mr-1" />;
      label = "تم التحقق من البائع";
      break;
    case "picked_up":
      color = "bg-purple-100 text-purple-800";
      icon = <RefreshCw className="w-3 h-3 mr-1" />;
      label = "تم الاستلام للشحن";
      break;
    case "in_transit":
      color = "bg-blue-100 text-blue-800";
      icon = <RefreshCw className="w-3 h-3 mr-1" />;
      label = "قيد الشحن";
      break;
    case "delivered":
      color = "bg-green-100 text-green-800";
      icon = <CheckCircle className="w-3 h-3 mr-1" />;
      label = "تم التسليم";
      break;
    case "confirmed":
      color = "bg-emerald-100 text-emerald-800";
      icon = <CheckCircle className="w-3 h-3 mr-1" />;
      label = "تم التأكيد";
      break;
    case "rejected":
      color = "bg-red-100 text-red-800";
      icon = <XCircle className="w-3 h-3 mr-1" />;
      label = "مرفوض";
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

// مكون تفاصيل QR
function QrDetailsDialog({ qrCode }: { qrCode: any }) {
  const { t, language } = useContext(LanguageContext);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("qrCodeDetails")}</DialogTitle>
          <DialogDescription>
            {t("fullDetailsOfQrCodeForOrder", { id: qrCode.orderId })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="md:col-span-1 flex flex-col items-center justify-start space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCode
                size={150}
                value={JSON.stringify(qrCode.content)}
                viewBox={`0 0 256 256`}
              />
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Button variant="outline" size="sm" className="w-full">
                <Printer className="h-4 w-4 mr-1" />
                {t("printQrCode")}
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <FileDown className="h-4 w-4 mr-1" />
                {t("downloadQrCode")}
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{t("currentStatus")}</p>
              <QrCodeStatus status={qrCode.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("orderId")}</p>
                <p>{qrCode.orderId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("createdAt")}</p>
                <p>{new Date(qrCode.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("productName")}</p>
                <p>{qrCode.content.productName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("productSku")}</p>
                <p>{qrCode.content.productSku}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("seller")}</p>
                <p>{qrCode.content.seller}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("price")}</p>
                <p>ج.م {qrCode.content.price.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("scanHistory")}</p>
              {qrCode.isScanned ? (
                <div className="space-y-2">
                  <div className="p-2 bg-secondary rounded-md">
                    <p className="text-sm font-medium">
                      {qrCode.scannedBy === 'seller' ? t("scannedBySeller") :
                       qrCode.scannedBy === 'shipping_company' ? t("scannedByShippingCompany") :
                       qrCode.scannedBy === 'customer' ? t("scannedByCustomer") : t("scanned")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(qrCode.scannedAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t("noScanYet")}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function QrCodesManagement() {
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
  const filteredQrCodes = qrCodes.filter(qr => {
    if (currentTab !== 'all' && qr.status !== currentTab) {
      return false;
    }
    
    if (searchQuery) {
      return (
        qr.orderId.toString().includes(searchQuery) ||
        qr.content.productName.includes(searchQuery) ||
        qr.content.seller.includes(searchQuery)
      );
    }
    
    return true;
  });

  // إنشاء QR Code جديد
  const handleCreateQrCode = () => {
    toast({
      title: t("qrCodeGenerated"),
      description: t("newQrCodeCreatedSuccessfully"),
    });
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t("qrCodeManagement")}</h1>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Button size="sm" onClick={handleCreateQrCode}>
              <Plus className="h-4 w-4 mr-2" />
              {t("createNewQrCode")}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("qrCodeList")}</CardTitle>
            <CardDescription>{t("manageAndTrackQrCodesForAllOrders")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <Tabs
                  value={currentTab}
                  onValueChange={setCurrentTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full sm:w-auto">
                    <TabsTrigger value="all">{t("all")}</TabsTrigger>
                    <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
                    <TabsTrigger value="packed">{t("packed")}</TabsTrigger>
                    <TabsTrigger value="verified_by_seller">{t("verified")}</TabsTrigger>
                    <TabsTrigger value="in_transit">{t("inTransit")}</TabsTrigger>
                    <TabsTrigger value="delivered">{t("delivered")}</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full sm:w-auto flex">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder={t("searchByOrderIdOrProduct")}
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
                          <TableHead>{t("qrId")}</TableHead>
                          <TableHead>{t("orderId")}</TableHead>
                          <TableHead>{t("product")}</TableHead>
                          <TableHead>{t("seller")}</TableHead>
                          <TableHead>{t("status")}</TableHead>
                          <TableHead>{t("createdAt")}</TableHead>
                          <TableHead className="text-right">{t("actions")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQrCodes.map((qrCode) => (
                          <TableRow key={qrCode.id}>
                            <TableCell className="font-medium">#{qrCode.id}</TableCell>
                            <TableCell>#{qrCode.orderId}</TableCell>
                            <TableCell>{qrCode.content.productName}</TableCell>
                            <TableCell>{qrCode.content.seller}</TableCell>
                            <TableCell>
                              <QrCodeStatus status={qrCode.status} />
                            </TableCell>
                            <TableCell>
                              {new Date(qrCode.createdAt).toLocaleDateString(
                                language === 'ar' ? 'ar-EG' : 'en-US'
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <QrDetailsDialog qrCode={qrCode} />
                                <Button variant="ghost" size="icon">
                                  <Printer className="h-4 w-4" />
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
                      {t("showing")} {filteredQrCodes.length} {t("of")} {qrCodes.length} {t("qrCodes")}
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
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
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