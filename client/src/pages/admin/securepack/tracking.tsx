import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  AlertCircle,
  Package,
  Loader2,
  QrCode,
  Truck,
  Search,
  Filter,
  RefreshCcw,
  MapPin,
  ArrowRightCircle,
  User,
  ShieldCheck,
  AlertTriangle,
  Download
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/layout/admin-layout";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/date-formatter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Steps } from "@/components/ui/steps";
import { QRScanner } from "@/components/ui/qr-scanner";
import { PackageStatus } from "@/components/ui/package-status";

// Mock data for demonstration
const packageData = [
  {
    id: "QR-001-2845-789",
    orderId: "ORD-2023428",
    customerId: 78,
    customerName: "أحمد محمد",
    date: "2025-04-25T10:30:00Z",
    status: "packed",
    verifiedBySeller: true,
    isCompromised: false,
    location: "مستودع القاهرة",
    product: "سماعات لاسلكية متطورة",
    deliveryService: "شركة التوصيل السريع",
    expectedDelivery: "2025-04-28",
    verifications: [
      { id: 1, stage: "packing", date: "2025-04-25T10:30:00Z", status: "verified", verifier: "مشرف التغليف", location: "مستودع القاهرة" },
      { id: 2, stage: "seller_check", date: "2025-04-25T13:45:00Z", status: "verified", verifier: "مندوب البائع", location: "مستودع القاهرة" },
    ]
  },
  {
    id: "QR-001-2845-790",
    orderId: "ORD-2023429",
    customerId: 92,
    customerName: "سارة أحمد",
    date: "2025-04-25T11:15:00Z",
    status: "in_transit",
    verifiedBySeller: true,
    isCompromised: false,
    location: "القاهرة - في الطريق",
    product: "ساعة ذكية",
    deliveryService: "شركة النقل الأمين",
    expectedDelivery: "2025-04-28",
    verifications: [
      { id: 3, stage: "packing", date: "2025-04-25T11:15:00Z", status: "verified", verifier: "مشرف التغليف", location: "مستودع القاهرة" },
      { id: 4, stage: "seller_check", date: "2025-04-25T14:30:00Z", status: "verified", verifier: "مندوب البائع", location: "مستودع القاهرة" },
      { id: 5, stage: "picked_up", date: "2025-04-26T09:20:00Z", status: "verified", verifier: "مندوب التوصيل", location: "مستودع القاهرة" },
    ]
  },
  {
    id: "QR-001-2845-791",
    orderId: "ORD-2023430",
    customerId: 105,
    customerName: "محمد علي",
    date: "2025-04-25T12:00:00Z",
    status: "delivered",
    verifiedBySeller: true,
    isCompromised: false,
    location: "حي المعادي، القاهرة",
    product: "هاتف ذكي",
    deliveryService: "شركة التوصيل السريع",
    expectedDelivery: "2025-04-27",
    verifications: [
      { id: 6, stage: "packing", date: "2025-04-25T12:00:00Z", status: "verified", verifier: "مشرف التغليف", location: "مستودع القاهرة" },
      { id: 7, stage: "seller_check", date: "2025-04-25T15:10:00Z", status: "verified", verifier: "مندوب البائع", location: "مستودع القاهرة" },
      { id: 8, stage: "picked_up", date: "2025-04-26T08:45:00Z", status: "verified", verifier: "مندوب التوصيل", location: "مستودع القاهرة" },
      { id: 9, stage: "in_transit", date: "2025-04-26T10:30:00Z", status: "verified", verifier: "مركز الفرز", location: "مركز الفرز الرئيسي" },
      { id: 10, stage: "delivered", date: "2025-04-27T14:20:00Z", status: "verified", verifier: "مندوب التوصيل", location: "حي المعادي، القاهرة" },
    ]
  },
  {
    id: "QR-001-2845-792",
    orderId: "ORD-2023431",
    customerId: 118,
    customerName: "فاطمة محمود",
    date: "2025-04-25T13:30:00Z",
    status: "confirmed",
    verifiedBySeller: true,
    isCompromised: false,
    location: "حي الدقي، الجيزة",
    product: "لاب توب",
    deliveryService: "شركة النقل الأمين",
    expectedDelivery: "2025-04-27",
    verifications: [
      { id: 11, stage: "packing", date: "2025-04-25T13:30:00Z", status: "verified", verifier: "مشرف التغليف", location: "مستودع القاهرة" },
      { id: 12, stage: "seller_check", date: "2025-04-25T16:00:00Z", status: "verified", verifier: "مندوب البائع", location: "مستودع القاهرة" },
      { id: 13, stage: "picked_up", date: "2025-04-26T09:00:00Z", status: "verified", verifier: "مندوب التوصيل", location: "مستودع القاهرة" },
      { id: 14, stage: "in_transit", date: "2025-04-26T11:00:00Z", status: "verified", verifier: "مركز الفرز", location: "مركز الفرز الرئيسي" },
      { id: 15, stage: "delivered", date: "2025-04-27T13:30:00Z", status: "verified", verifier: "مندوب التوصيل", location: "حي الدقي، الجيزة" },
      { id: 16, stage: "confirmed", date: "2025-04-27T15:45:00Z", status: "verified", verifier: "العميل", location: "حي الدقي، الجيزة" },
    ]
  },
  {
    id: "QR-001-2845-793",
    orderId: "ORD-2023432",
    customerId: 125,
    customerName: "خالد عبدالله",
    date: "2025-04-25T14:15:00Z",
    status: "rejected",
    verifiedBySeller: true,
    isCompromised: true,
    location: "حي المهندسين، الجيزة",
    product: "كاميرا رقمية",
    deliveryService: "شركة الشحن المتحدة",
    expectedDelivery: "2025-04-28",
    verifications: [
      { id: 17, stage: "packing", date: "2025-04-25T14:15:00Z", status: "verified", verifier: "مشرف التغليف", location: "مستودع القاهرة" },
      { id: 18, stage: "seller_check", date: "2025-04-25T16:45:00Z", status: "verified", verifier: "مندوب البائع", location: "مستودع القاهرة" },
      { id: 19, stage: "picked_up", date: "2025-04-26T09:30:00Z", status: "verified", verifier: "مندوب التوصيل", location: "مستودع القاهرة" },
      { id: 20, stage: "in_transit", date: "2025-04-26T11:30:00Z", status: "verified", verifier: "مركز الفرز", location: "مركز الفرز الرئيسي" },
      { id: 21, stage: "delivered", date: "2025-04-28T10:30:00Z", status: "verified", verifier: "مندوب التوصيل", location: "حي المهندسين، الجيزة" },
      { id: 22, stage: "rejected", date: "2025-04-28T10:45:00Z", status: "compromised", verifier: "العميل", location: "حي المهندسين، الجيزة", notes: "تم رفض المنتج بسبب كسر في العبوة ووجود علامات عبث" },
    ]
  },
];

// Define the columns for the DataTable
const packagesColumns = [
  {
    accessorKey: "id",
    header: "رمز التتبع",
  },
  {
    accessorKey: "orderId",
    header: "رقم الطلب",
  },
  {
    accessorKey: "customerName",
    header: "العميل",
  },
  {
    accessorKey: "product",
    header: "المنتج",
  },
  {
    accessorKey: "date",
    header: "تاريخ الإنشاء",
    cell: ({ row }: any) => (
      formatDate(new Date(row.getValue("date")))
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }: any) => (
      <PackageStatus status={row.getValue("status")} />
    ),
  },
  {
    accessorKey: "isCompromised",
    header: "سلامة العبوة",
    cell: ({ row }: any) => {
      const isCompromised = row.getValue("isCompromised");
      
      return (
        <div className="flex items-center">
          {isCompromised ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> غير سليمة
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-700">
              <ShieldCheck className="h-3 w-3" /> سليمة
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }: any) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>تفاصيل التتبع | {row.original.id}</DialogTitle>
              <DialogDescription>
                عرض تفاصيل وسجل تتبع الشحنة
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">معلومات الشحنة</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">رقم الطلب</p>
                      <p className="font-medium">{row.original.orderId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">العميل</p>
                      <p className="font-medium">{row.original.customerName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">المنتج</p>
                      <p className="font-medium">{row.original.product}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">خدمة التوصيل</p>
                      <p className="font-medium">{row.original.deliveryService}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                      <p className="font-medium">{formatDate(new Date(row.original.date))}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">التوصيل المتوقع</p>
                      <p className="font-medium">{formatDate(new Date(row.original.expectedDelivery))}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">الموقع الحالي</p>
                      <p className="font-medium">{row.original.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">حالة التغليف</p>
                      <p className="font-medium flex items-center">
                        {row.original.isCompromised ? (
                          <span className="text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" /> غير سليمة
                          </span>
                        ) : (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> سليمة
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">حالة الشحنة</p>
                    <PackageStatus status={row.original.status} showLabel size="large" />
                  </div>
                  
                  {row.original.status === "rejected" && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>تم رفض الشحنة</AlertTitle>
                      <AlertDescription>
                        تم رفض الشحنة من قبل العميل بسبب وجود مشاكل في سلامة العبوة أو المنتج.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">سجل حركة الشحنة</h3>
                <div className="border rounded-md overflow-hidden">
                  <Steps
                    steps={[
                      { id: "pending", title: "قيد الانتظار", icon: <Package /> },
                      { id: "packed", title: "تم التغليف", icon: <Package /> },
                      { id: "verified_by_seller", title: "تم التحقق من البائع", icon: <ShieldCheck /> },
                      { id: "picked_up", title: "تم الاستلام", icon: <ArrowRightCircle /> },
                      { id: "in_transit", title: "في الطريق", icon: <Truck /> },
                      { id: "delivered", title: "تم التوصيل", icon: <MapPin /> },
                      { id: "confirmed", title: "تم التأكيد", icon: <CheckCircle2 /> },
                    ]}
                    currentStep={row.original.status}
                    isRejected={row.original.status === "rejected"}
                  />
                </div>
                
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium">سجل عمليات التحقق</h4>
                  <div className="max-h-[300px] overflow-y-auto space-y-3">
                    {row.original.verifications.map((verification: any) => (
                      <div 
                        key={verification.id} 
                        className={`border rounded-md p-3 ${
                          verification.status === "compromised" ? "border-destructive bg-destructive/5" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {verification.status === "verified" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                            <div>
                              <p className="font-medium">
                                {verification.stage === "packing" ? "تم التغليف" :
                                 verification.stage === "seller_check" ? "تحقق البائع" :
                                 verification.stage === "picked_up" ? "استلام الشحنة" :
                                 verification.stage === "in_transit" ? "في الطريق" :
                                 verification.stage === "delivered" ? "تم التوصيل" :
                                 verification.stage === "confirmed" ? "تأكيد الاستلام" :
                                 verification.stage === "rejected" ? "رفض الاستلام" : ""}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(new Date(verification.date))}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm flex items-center gap-1">
                              <User className="h-3 w-3" /> {verification.verifier}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {verification.location}
                            </p>
                          </div>
                        </div>
                        
                        {verification.notes && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p className="font-medium">ملاحظات:</p>
                            <p>{verification.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline">تصدير التقرير</Button>
              {["pending", "packed", "verified_by_seller", "picked_up", "in_transit"].includes(row.original.status) && (
                <Button variant="default">تحديث الحالة</Button>
              )}
              {row.original.status === "rejected" && (
                <Button variant="destructive">بدء عملية الإرجاع</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export default function SecurePackTracking() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [foundPackage, setFoundPackage] = useState<any | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from: Date;
    to: Date;
  } | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
    to: new Date(),
  });
  
  // In a real application, these would be API queries
  const { data: packages, isLoading } = useQuery({
    queryKey: ['/api/admin/securepack/packages'],
    queryFn: () => Promise.resolve(packageData),
  });
  
  // Verify QR code mutation
  const verifyQrMutation = useMutation({
    mutationFn: async (qrCode: string) => {
      // In a real application, this would be an API call
      // return apiRequest('POST', '/api/admin/securepack/verify-qr', { qrCode });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find package by QR code
      const foundPkg = packageData.find(pkg => pkg.id === qrCode);
      
      if (!foundPkg) {
        throw new Error("QR غير صالح أو غير مسجل في النظام");
      }
      
      return foundPkg;
    },
    onSuccess: (data) => {
      setFoundPackage(data);
      toast({
        title: "تم العثور على الشحنة",
        description: `تم التحقق من الرمز بنجاح - ${data.id}`,
      });
    },
    onError: (error: Error) => {
      setFoundPackage(null);
      toast({
        title: "فشل التحقق",
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Handle QR code scan
  const handleScan = (result: string) => {
    setScanResult(result);
    setShowScanner(false);
    verifyQrMutation.mutate(result);
  };
  
  // Handle manual search
  const handleSearch = () => {
    if (!searchQuery) {
      toast({
        title: "حقل البحث فارغ",
        description: "يرجى إدخال رمز التتبع للبحث",
        variant: 'destructive',
      });
      return;
    }
    
    verifyQrMutation.mutate(searchQuery);
  };
  
  // Filter packages based on selected criteria
  const filteredPackages = packages?.filter(pkg => {
    if (selectedStatus !== "all" && pkg.status !== selectedStatus) {
      return false;
    }
    
    if (selectedDateRange) {
      const packageDate = new Date(pkg.date);
      if (packageDate < selectedDateRange.from || packageDate > selectedDateRange.to) {
        return false;
      }
    }
    
    return true;
  }) || [];
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">نظام SecurePack للتتبع</h1>
            <p className="text-muted-foreground">تتبع الطرود وتحقق من سلامتها في كل مراحل الشحن</p>
          </div>
          <Button className="gap-2" variant="outline">
            <Download className="h-4 w-4" />
            تصدير تقرير
          </Button>
        </div>
        
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="search">بحث وتحقق</TabsTrigger>
            <TabsTrigger value="all">جميع الطرود</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>بحث عن طرد</CardTitle>
                <CardDescription>
                  يمكنك البحث عن الطرود باستخدام رمز التتبع أو مسح رمز QR
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        placeholder="أدخل رمز التتبع..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button onClick={handleSearch} disabled={verifyQrMutation.isPending}>
                        {verifyQrMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="mr-2 h-4 w-4" />
                        )}
                        بحث
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowScanner(true)}
                    className="gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    مسح رمز QR
                  </Button>
                </div>
                
                {showScanner && (
                  <Card>
                    <CardContent className="p-6">
                      <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
                    </CardContent>
                  </Card>
                )}
                
                {foundPackage && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        معلومات الطرد | {foundPackage.id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">رقم الطلب</p>
                              <p className="font-medium">{foundPackage.orderId}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">العميل</p>
                              <p className="font-medium">{foundPackage.customerName}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">المنتج</p>
                              <p className="font-medium">{foundPackage.product}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">خدمة التوصيل</p>
                              <p className="font-medium">{foundPackage.deliveryService}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                              <p className="font-medium">{formatDate(new Date(foundPackage.date))}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">التوصيل المتوقع</p>
                              <p className="font-medium">{formatDate(new Date(foundPackage.expectedDelivery))}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">الموقع الحالي</p>
                              <p className="font-medium">{foundPackage.location}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">حالة التغليف</p>
                              <p className="font-medium flex items-center">
                                {foundPackage.isCompromised ? (
                                  <span className="text-destructive flex items-center gap-1">
                                    <AlertTriangle className="h-4 w-4" /> غير سليمة
                                  </span>
                                ) : (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" /> سليمة
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">حالة الشحنة</p>
                            <PackageStatus status={foundPackage.status} showLabel size="large" />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-3">سجل الحركة</h3>
                          <div className="border rounded-md overflow-hidden">
                            <Steps
                              steps={[
                                { id: "pending", title: "قيد الانتظار", icon: <Package /> },
                                { id: "packed", title: "تم التغليف", icon: <Package /> },
                                { id: "verified_by_seller", title: "تم التحقق من البائع", icon: <ShieldCheck /> },
                                { id: "picked_up", title: "تم الاستلام", icon: <ArrowRightCircle /> },
                                { id: "in_transit", title: "في الطريق", icon: <Truck /> },
                                { id: "delivered", title: "تم التوصيل", icon: <MapPin /> },
                                { id: "confirmed", title: "تم التأكيد", icon: <CheckCircle2 /> },
                              ]}
                              currentStep={foundPackage.status}
                              isRejected={foundPackage.status === "rejected"}
                            />
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">آخر التحققات</h4>
                            {foundPackage.verifications.slice(-2).map((verification: any) => (
                              <div 
                                key={verification.id} 
                                className={`border rounded-md p-3 mb-2 ${
                                  verification.status === "compromised" ? "border-destructive bg-destructive/5" : ""
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    {verification.status === "verified" ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <AlertTriangle className="h-4 w-4 text-destructive" />
                                    )}
                                    <div>
                                      <p className="font-medium">
                                        {verification.stage === "packing" ? "تم التغليف" :
                                         verification.stage === "seller_check" ? "تحقق البائع" :
                                         verification.stage === "picked_up" ? "استلام الشحنة" :
                                         verification.stage === "in_transit" ? "في الطريق" :
                                         verification.stage === "delivered" ? "تم التوصيل" :
                                         verification.stage === "confirmed" ? "تأكيد الاستلام" :
                                         verification.stage === "rejected" ? "رفض الاستلام" : ""}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {formatDate(new Date(verification.date))}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{verification.verifier}</p>
                                </div>
                              </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full mt-2">
                              عرض كل السجلات
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" className="gap-2" onClick={() => setFoundPackage(null)}>
                        <RefreshCcw className="h-4 w-4" />
                        بحث جديد
                      </Button>
                      <Button className="gap-2">
                        <ArrowRightCircle className="h-4 w-4" />
                        تحديث الحالة
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>جميع الطرود</CardTitle>
                <CardDescription>
                  قائمة بجميع الطرود المسجلة في نظام SecurePack
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="w-full sm:w-60">
                    <Label htmlFor="statusFilter" className="mb-2 block">فلترة حسب الحالة</Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger id="statusFilter">
                        <SelectValue placeholder="اختر حالة..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="packed">تم التغليف</SelectItem>
                        <SelectItem value="verified_by_seller">تم التحقق من البائع</SelectItem>
                        <SelectItem value="picked_up">تم الاستلام</SelectItem>
                        <SelectItem value="in_transit">في الطريق</SelectItem>
                        <SelectItem value="delivered">تم التوصيل</SelectItem>
                        <SelectItem value="confirmed">تم التأكيد</SelectItem>
                        <SelectItem value="rejected">مرفوض</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full sm:w-auto flex-1">
                    <Label className="mb-2 block">فلترة حسب التاريخ</Label>
                    <DateRangePicker
                      value={selectedDateRange}
                      onChange={setSelectedDateRange}
                    />
                  </div>
                </div>
                
                <DataTable 
                  columns={packagesColumns} 
                  data={filteredPackages}
                  searchKey="id" 
                />
                
                {filteredPackages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Package className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">لا توجد طرود</h3>
                    <p className="text-muted-foreground max-w-md mt-1">
                      لا توجد طرود مطابقة لمعايير الفلترة المحددة
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي الطرود</p>
                        <p className="text-xl font-medium">{packageData.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">تم التسليم بنجاح</p>
                        <p className="text-xl font-medium">
                          {packageData.filter(p => ["delivered", "confirmed"].includes(p.status)).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Truck className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">قيد التوصيل</p>
                        <p className="text-xl font-medium">
                          {packageData.filter(p => ["pending", "packed", "verified_by_seller", "picked_up", "in_transit"].includes(p.status)).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">طرود متضررة</p>
                        <p className="text-xl font-medium">
                          {packageData.filter(p => p.isCompromised).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}