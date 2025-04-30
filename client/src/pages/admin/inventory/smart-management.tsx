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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DataTable } from "@/components/ui/data-table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart,
  Line,
  AreaChart,
  Area,
  ReferenceLine
} from "recharts";
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowRight, 
  ArrowUp, 
  Bell, 
  Box, 
  ChevronDown, 
  ChevronUp, 
  DollarSign,
  Loader2, 
  Package, 
  PackageCheck, 
  PackageOpen, 
  RefreshCcw, 
  Settings, 
  Store, 
  TrendingDown, 
  TrendingUp, 
  Truck 
} from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/layout/admin-layout";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/date-formatter";
import { convertUSDtoEGP } from "@/lib/currency-formatter";
import { queryClient, apiRequest } from "@/lib/queryClient";

// COLORS for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

// Mock data for product stock levels
const stockLevels = [
  { 
    id: 1, 
    name: "سماعات لاسلكية متطورة", 
    nameEn: "Advanced Wireless Headphones",
    sku: "SKU-001-2845",
    currentStock: 23,
    reorderPoint: 15,
    optimalStock: 50,
    supplier: "متجر إلكترونيات حديثة",
    category: "إلكترونيات",
    price: 129.99,
    lastRestock: "2025-04-10",
    lastSold: "2025-04-26",
    status: "normal", // low, normal, excess
    trend: "decreasing", // increasing, stable, decreasing
    soldLast30Days: 27,
    restockETA: null,
    isAutoRestockEnabled: true,
    alertsEnabled: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100"
  },
  { 
    id: 2, 
    name: "ساعة ذكية متطورة", 
    nameEn: "Advanced Smart Watch",
    sku: "SKU-002-4531",
    currentStock: 8,
    reorderPoint: 10,
    optimalStock: 30,
    supplier: "متجر إلكترونيات حديثة",
    category: "إلكترونيات",
    price: 199.99,
    lastRestock: "2025-04-05",
    lastSold: "2025-04-26",
    status: "low",
    trend: "decreasing",
    soldLast30Days: 22,
    restockETA: "2025-05-02",
    isAutoRestockEnabled: true,
    alertsEnabled: true,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=100"
  },
  { 
    id: 3, 
    name: "هاتف ذكي", 
    nameEn: "Smartphone",
    sku: "SKU-003-7890",
    currentStock: 15,
    reorderPoint: 12,
    optimalStock: 25,
    supplier: "متجر إلكترونيات حديثة",
    category: "إلكترونيات",
    price: 599.99,
    lastRestock: "2025-04-15",
    lastSold: "2025-04-25",
    status: "normal",
    trend: "stable",
    soldLast30Days: 10,
    restockETA: null,
    isAutoRestockEnabled: true,
    alertsEnabled: true,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=100"
  },
  { 
    id: 4, 
    name: "لاب توب", 
    nameEn: "Laptop",
    sku: "SKU-004-1234",
    currentStock: 7,
    reorderPoint: 5,
    optimalStock: 15,
    supplier: "متجر إلكترونيات حديثة",
    category: "إلكترونيات",
    price: 999.99,
    lastRestock: "2025-04-20",
    lastSold: "2025-04-24",
    status: "normal",
    trend: "stable",
    soldLast30Days: 5,
    restockETA: null,
    isAutoRestockEnabled: false,
    alertsEnabled: true,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=100"
  },
  { 
    id: 5, 
    name: "كاميرا رقمية", 
    nameEn: "Digital Camera",
    sku: "SKU-005-5678",
    currentStock: 4,
    reorderPoint: 5,
    optimalStock: 10,
    supplier: "متجر إلكترونيات حديثة",
    category: "إلكترونيات",
    price: 449.99,
    lastRestock: "2025-04-01",
    lastSold: "2025-04-20",
    status: "low",
    trend: "decreasing",
    soldLast30Days: 6,
    restockETA: "2025-05-03",
    isAutoRestockEnabled: true,
    alertsEnabled: true,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=100"
  },
  { 
    id: 6, 
    name: "سماعات رأس بلوتوث", 
    nameEn: "Bluetooth Headphones",
    sku: "SKU-006-9012",
    currentStock: 35,
    reorderPoint: 20,
    optimalStock: 40,
    supplier: "متجر إلكترونيات حديثة",
    category: "إلكترونيات",
    price: 79.99,
    lastRestock: "2025-04-18",
    lastSold: "2025-04-26",
    status: "excess",
    trend: "decreasing",
    soldLast30Days: 15,
    restockETA: null,
    isAutoRestockEnabled: true,
    alertsEnabled: true,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=100"
  },
  { 
    id: 7, 
    name: "شاحن لاسلكي", 
    nameEn: "Wireless Charger",
    sku: "SKU-007-3456",
    currentStock: 42,
    reorderPoint: 15,
    optimalStock: 30,
    supplier: "متجر إلكترونيات حديثة",
    category: "إلكترونيات",
    price: 29.99,
    lastRestock: "2025-04-10",
    lastSold: "2025-04-26",
    status: "excess",
    trend: "increasing",
    soldLast30Days: 18,
    restockETA: null,
    isAutoRestockEnabled: false,
    alertsEnabled: true,
    image: "https://images.unsplash.com/photo-1608751819096-757c135befdf?q=80&w=100"
  },
  { 
    id: 8, 
    name: "مكبر صوت بلوتوث", 
    nameEn: "Bluetooth Speaker",
    sku: "SKU-008-7890",
    currentStock: 18,
    reorderPoint: 10,
    optimalStock: 25,
    supplier: "متجر إلكترونيات حديثة",
    category: "إلكترونيات",
    price: 59.99,
    lastRestock: "2025-04-15",
    lastSold: "2025-04-25",
    status: "normal",
    trend: "increasing",
    soldLast30Days: 20,
    restockETA: null,
    isAutoRestockEnabled: true,
    alertsEnabled: true,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=100"
  },
];

// Mock data for inventory alerts
const inventoryAlerts = [
  {
    id: 1,
    type: "low_stock",
    productId: 2,
    productName: "ساعة ذكية متطورة",
    message: "المخزون منخفض (8 قطع) - أقل من نقطة إعادة الطلب (10 قطع)",
    date: "2025-04-25T14:30:00Z",
    severity: "high",
    status: "active",
    actionRequired: true,
    autoActionTaken: "reorder_initiated",
    autoActionDetails: "تم بدء طلب تلقائي - 25 قطعة، التوصيل المتوقع 2025-05-02"
  },
  {
    id: 2,
    type: "low_stock",
    productId: 5,
    productName: "كاميرا رقمية",
    message: "المخزون منخفض (4 قطع) - أقل من نقطة إعادة الطلب (5 قطع)",
    date: "2025-04-26T09:15:00Z",
    severity: "high",
    status: "active",
    actionRequired: true,
    autoActionTaken: "reorder_initiated",
    autoActionDetails: "تم بدء طلب تلقائي - 10 قطع، التوصيل المتوقع 2025-05-03"
  },
  {
    id: 3,
    type: "excess_stock",
    productId: 6,
    productName: "سماعات رأس بلوتوث",
    message: "المخزون زائد عن الحاجة (35 قطعة)، يتجاوز المخزون الأمثل (30 قطعة)",
    date: "2025-04-24T11:00:00Z",
    severity: "medium",
    status: "active",
    actionRequired: true,
    autoActionTaken: null,
    autoActionDetails: null
  },
  {
    id: 4,
    type: "excess_stock",
    productId: 7,
    productName: "شاحن لاسلكي",
    message: "المخزون زائد عن الحاجة (42 قطعة)، يتجاوز المخزون الأمثل (30 قطعة)",
    date: "2025-04-23T13:45:00Z",
    severity: "medium",
    status: "active",
    actionRequired: true,
    autoActionTaken: null,
    autoActionDetails: null
  },
  {
    id: 5,
    type: "trend_alert",
    productId: 1,
    productName: "سماعات لاسلكية متطورة",
    message: "اتجاه بيع متسارع: 27 قطعة مباعة في آخر 30 يومًا. قد تقترب من نقطة إعادة الطلب قريبًا.",
    date: "2025-04-25T16:20:00Z",
    severity: "low",
    status: "active",
    actionRequired: false,
    autoActionTaken: null,
    autoActionDetails: null
  },
  {
    id: 6,
    type: "restock_notification",
    productId: 8,
    productName: "مكبر صوت بلوتوث",
    message: "اتجاه بيع متزايد: 20 قطعة مباعة في آخر 30 يومًا. المخزون الحالي كافي ولكن قد تحتاج إلى إعادة الطلب قريبًا.",
    date: "2025-04-24T10:30:00Z",
    severity: "info",
    status: "active",
    actionRequired: false,
    autoActionTaken: null,
    autoActionDetails: null
  },
];

// Mock data for sales trend analysis
const salesTrends = [
  { date: '2025-04-01', sales: 10 },
  { date: '2025-04-02', sales: 15 },
  { date: '2025-04-03', sales: 12 },
  { date: '2025-04-04', sales: 18 },
  { date: '2025-04-05', sales: 20 },
  { date: '2025-04-06', sales: 15 },
  { date: '2025-04-07', sales: 22 },
  { date: '2025-04-08', sales: 25 },
  { date: '2025-04-09', sales: 18 },
  { date: '2025-04-10', sales: 20 },
  { date: '2025-04-11', sales: 22 },
  { date: '2025-04-12', sales: 24 },
  { date: '2025-04-13', sales: 16 },
  { date: '2025-04-14', sales: 18 },
  { date: '2025-04-15', sales: 22 },
  { date: '2025-04-16', sales: 24 },
  { date: '2025-04-17', sales: 26 },
  { date: '2025-04-18', sales: 22 },
  { date: '2025-04-19', sales: 20 },
  { date: '2025-04-20', sales: 18 },
  { date: '2025-04-21', sales: 24 },
  { date: '2025-04-22', sales: 28 },
  { date: '2025-04-23', sales: 30 },
  { date: '2025-04-24', sales: 32 },
  { date: '2025-04-25', sales: 35 },
  { date: '2025-04-26', sales: 38 },
  { date: '2025-04-27', sales: 40 },
  { date: '2025-04-28', sales: 45 },
  { date: '2025-04-29', sales: 48 },
  { date: '2025-04-30', sales: 50 },
];

// Mock data for inventory forecast
const inventoryForecast = [
  { date: '2025-05-01', predicted: 18, actual: null },
  { date: '2025-05-02', predicted: 16, actual: null },
  { date: '2025-05-03', predicted: 14, actual: null },
  { date: '2025-05-04', predicted: 12, actual: null },
  { date: '2025-05-05', predicted: 10, actual: null },
  { date: '2025-05-06', predicted: 8, actual: null },
  { date: '2025-05-07', predicted: 6, actual: null },
  { date: '2025-05-08', predicted: 4, actual: null },
  { date: '2025-05-09', predicted: 2, actual: null },
  { date: '2025-05-10', predicted: 0, actual: null },
];

// Define the columns for the Inventory DataTable
const inventoryColumns = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }: any) => (
      <div 
        className="h-10 w-10 rounded-md bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${row.original.image})` }}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "المنتج",
  },
  {
    accessorKey: "sku",
    header: "الرمز",
  },
  {
    accessorKey: "currentStock",
    header: "المخزون الحالي",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      
      return (
        <div className="font-medium flex items-center gap-2">
          {status === "low" ? (
            <Badge variant="destructive" className="mr-2">{row.getValue("currentStock")}</Badge>
          ) : status === "excess" ? (
            <Badge variant="warning" className="mr-2 bg-amber-500">{row.getValue("currentStock")}</Badge>
          ) : (
            <span>{row.getValue("currentStock")}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "reorderPoint",
    header: "نقطة إعادة الطلب",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      const trend = row.getValue("trend");
      
      return (
        <div className="flex gap-2 items-center">
          {status === "low" ? (
            <Badge variant="destructive">منخفض</Badge>
          ) : status === "normal" ? (
            <Badge variant="outline">عادي</Badge>
          ) : (
            <Badge variant="warning" className="bg-amber-500">زائد</Badge>
          )}
          
          {trend === "increasing" ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : trend === "decreasing" ? (
            <TrendingDown className="h-4 w-4 text-red-500" />
          ) : (
            <ArrowRight className="h-4 w-4 text-gray-500" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "السعر",
    cell: ({ row }: any) => {
      return <CurrencyDisplay amount={convertUSDtoEGP(row.getValue("price"))} />;
    },
  },
  {
    accessorKey: "supplier",
    header: "المورد",
  },
  {
    accessorKey: "lastSold",
    header: "آخر بيع",
    cell: ({ row }: any) => formatDate(new Date(row.getValue("lastSold"))),
  },
  {
    accessorKey: "restockETA",
    header: "موعد إعادة التخزين",
    cell: ({ row }: any) => {
      const restockETA = row.getValue("restockETA");
      return restockETA ? formatDate(new Date(restockETA)) : "-";
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }: any) => {
      return (
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant={row.original.status === "low" ? "default" : "outline"} 
            size="sm"
          >
            إعادة طلب
          </Button>
        </div>
      );
    },
  },
];

// Define the columns for the Alerts DataTable
const alertsColumns = [
  {
    accessorKey: "severity",
    header: "الأهمية",
    cell: ({ row }: any) => {
      const severity = row.getValue("severity");
      
      return (
        <div className="flex items-center">
          {severity === "high" ? (
            <Badge variant="destructive">عالية</Badge>
          ) : severity === "medium" ? (
            <Badge variant="warning" className="bg-amber-500">متوسطة</Badge>
          ) : severity === "low" ? (
            <Badge variant="default">منخفضة</Badge>
          ) : (
            <Badge variant="outline">معلومات</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "productName",
    header: "المنتج",
  },
  {
    accessorKey: "message",
    header: "التنبيه",
  },
  {
    accessorKey: "date",
    header: "التاريخ",
    cell: ({ row }: any) => formatDate(new Date(row.getValue("date"))),
  },
  {
    accessorKey: "autoActionTaken",
    header: "الإجراء التلقائي",
    cell: ({ row }: any) => {
      const autoAction = row.getValue("autoActionTaken");
      
      return (
        <div>
          {autoAction === "reorder_initiated" ? (
            <Badge variant="outline" className="border-green-500 text-green-700">
              تم بدء إعادة الطلب
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }: any) => {
      const actionRequired = row.original.actionRequired;
      
      return (
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          {actionRequired && (
            <Button variant="default" size="sm">
              اتخاذ إجراء
            </Button>
          )}
        </div>
      );
    },
  },
];

export default function SmartInventoryManagement() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showPrediction, setShowPrediction] = useState<boolean>(true);
  const [updateInterval, setUpdateInterval] = useState<string>("daily");
  
  // In a real application, these would be API queries
  const { data: inventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['/api/admin/inventory/stock-levels'],
    queryFn: () => Promise.resolve(stockLevels),
  });
  
  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['/api/admin/inventory/alerts'],
    queryFn: () => Promise.resolve(inventoryAlerts),
  });
  
  const { data: trends, isLoading: isLoadingTrends } = useQuery({
    queryKey: ['/api/admin/inventory/sales-trends'],
    queryFn: () => Promise.resolve(salesTrends),
  });
  
  const { data: forecast, isLoading: isLoadingForecast } = useQuery({
    queryKey: ['/api/admin/inventory/forecast'],
    queryFn: () => Promise.resolve(inventoryForecast),
  });
  
  // Restock product mutation
  const restockMutation = useMutation({
    mutationFn: async (productId: number) => {
      // In a real application, this would be an API call
      // return apiRequest('POST', '/api/admin/inventory/restock', { productId });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "تم بدء عملية إعادة التخزين",
        description: "تم بدء عملية إعادة التخزين بنجاح",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory/stock-levels'] });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل في بدء عملية إعادة التخزين",
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Calculate inventory statistics
  const inventoryStats = React.useMemo(() => {
    if (!inventory) return null;
    
    const total = inventory.length;
    const lowStock = inventory.filter(item => item.status === "low").length;
    const excessStock = inventory.filter(item => item.status === "excess").length;
    const normalStock = total - lowStock - excessStock;
    
    const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.currentStock), 0);
    
    return {
      total,
      lowStock,
      excessStock,
      normalStock,
      totalValue,
    };
  }, [inventory]);
  
  // Filter inventory based on selected criteria
  const filteredInventory = React.useMemo(() => {
    if (!inventory) return [];
    
    return inventory.filter(item => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      
      if (selectedSupplier !== "all" && item.supplier !== selectedSupplier) {
        return false;
      }
      
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }
      
      return true;
    });
  }, [inventory, selectedCategory, selectedSupplier, selectedStatus]);
  
  const isLoading = isLoadingInventory || isLoadingAlerts || isLoadingTrends || isLoadingForecast;
  
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
            <h1 className="text-2xl font-bold">الإدارة الذكية للمخزون</h1>
            <p className="text-muted-foreground">إدارة المخزون والإشعارات بشكل ذكي ومؤتمت</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              تحديث البيانات
            </Button>
            <Button className="gap-2">
              <Settings className="h-4 w-4" />
              إعدادات النظام
            </Button>
          </div>
        </div>
        
        {/* Inventory Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">إجمالي المنتجات</p>
                  <h3 className="text-2xl font-bold mt-1">{inventoryStats?.total}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {inventoryStats?.normalStock} منتج بمخزون عادي
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <PackageOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">منتجات بمخزون منخفض</p>
                  <h3 className="text-2xl font-bold mt-1">{inventoryStats?.lowStock}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((inventoryStats?.lowStock || 0) / (inventoryStats?.total || 1) * 100).toFixed(1)}% من المنتجات
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">منتجات بمخزون زائد</p>
                  <h3 className="text-2xl font-bold mt-1">{inventoryStats?.excessStock}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((inventoryStats?.excessStock || 0) / (inventoryStats?.total || 1) * 100).toFixed(1)}% من المنتجات
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <ArrowUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">قيمة المخزون</p>
                  <h3 className="text-2xl font-bold mt-1">
                    <CurrencyDisplay amount={convertUSDtoEGP(inventoryStats?.totalValue || 0)} showCurrency={false} /> ج.م
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${Number(inventoryStats?.totalValue || 0).toFixed(2)} USD
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="inventory">المخزون</TabsTrigger>
            <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
            <TabsTrigger value="analysis">التحليل والتوقعات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المخزون</CardTitle>
                <CardDescription>إدارة مستويات المخزون وإعادة الطلب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="w-full sm:w-44">
                    <Label htmlFor="categoryFilter" className="mb-2 block">الفئة</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger id="categoryFilter">
                        <SelectValue placeholder="اختر فئة..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الفئات</SelectItem>
                        <SelectItem value="إلكترونيات">إلكترونيات</SelectItem>
                        <SelectItem value="ملابس">ملابس</SelectItem>
                        <SelectItem value="أدوات منزلية">أدوات منزلية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full sm:w-44">
                    <Label htmlFor="supplierFilter" className="mb-2 block">المورد</Label>
                    <Select
                      value={selectedSupplier}
                      onValueChange={setSelectedSupplier}
                    >
                      <SelectTrigger id="supplierFilter">
                        <SelectValue placeholder="اختر مورد..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الموردين</SelectItem>
                        <SelectItem value="متجر إلكترونيات حديثة">متجر إلكترونيات حديثة</SelectItem>
                        <SelectItem value="متجر أزياء الشباب">متجر أزياء الشباب</SelectItem>
                        <SelectItem value="متجر أدوات منزلية">متجر أدوات منزلية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full sm:w-44">
                    <Label htmlFor="statusFilter" className="mb-2 block">حالة المخزون</Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger id="statusFilter">
                        <SelectValue placeholder="اختر حالة..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="low">منخفض</SelectItem>
                        <SelectItem value="normal">عادي</SelectItem>
                        <SelectItem value="excess">زائد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DataTable 
                  columns={inventoryColumns} 
                  data={filteredInventory}
                  searchKey="name" 
                />
                
                {filteredInventory.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <PackageOpen className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">لا توجد منتجات</h3>
                    <p className="text-muted-foreground max-w-md mt-1">
                      لا توجد منتجات مطابقة لمعايير الفلترة المحددة
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>إعدادات النظام الذكي</CardTitle>
                <CardDescription>ضبط إعدادات الإدارة الذكية للمخزون</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">إعدادات التخزين التلقائي</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تفعيل إعادة الطلب التلقائي</Label>
                        <p className="text-sm text-muted-foreground">
                          يعيد النظام طلب المنتجات تلقائيًا عند وصولها إلى نقطة إعادة الطلب
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>الحد الأدنى للتخزين التلقائي (% من المخزون الأمثل)</Label>
                        <span className="font-medium">30%</span>
                      </div>
                      <Slider defaultValue={[30]} max={100} step={5} />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>عتبة إعادة الطلب الافتراضية</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر عتبة..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20">20% من المخزون الأمثل</SelectItem>
                          <SelectItem value="30">30% من المخزون الأمثل</SelectItem>
                          <SelectItem value="40">40% من المخزون الأمثل</SelectItem>
                          <SelectItem value="50">50% من المخزون الأمثل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">إعدادات التنبيهات</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تفعيل تنبيهات المخزون المنخفض</Label>
                        <p className="text-sm text-muted-foreground">
                          إرسال تنبيهات عند انخفاض المخزون عن الحد الأدنى
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تفعيل تنبيهات المخزون الزائد</Label>
                        <p className="text-sm text-muted-foreground">
                          إرسال تنبيهات عند زيادة المخزون عن الحد الأمثل
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تفعيل تنبيهات اتجاهات البيع</Label>
                        <p className="text-sm text-muted-foreground">
                          إرسال تنبيهات عند اكتشاف اتجاهات بيع متغيرة
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>جدول تحديث التنبؤات والتحليل</Label>
                      <Select 
                        value={updateInterval}
                        onValueChange={setUpdateInterval}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر جدول..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">كل ساعة</SelectItem>
                          <SelectItem value="daily">كل يوم</SelectItem>
                          <SelectItem value="weekly">كل أسبوع</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>حفظ الإعدادات</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تنبيهات المخزون</CardTitle>
                <CardDescription>إدارة تنبيهات المخزون والإجراءات المطلوبة</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={alertsColumns} 
                  data={alerts}
                  searchKey="productName" 
                />
                
                {alerts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">لا توجد تنبيهات</h3>
                    <p className="text-muted-foreground max-w-md mt-1">
                      لا توجد تنبيهات نشطة في الوقت الحالي
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ملخص تنبيهات المخزون</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>تنبيهات المخزون المنخفض</span>
                        <span className="font-medium">
                          {alerts.filter(alert => alert.type === "low_stock").length}
                        </span>
                      </div>
                      <Progress 
                        value={
                          (alerts.filter(alert => alert.type === "low_stock").length / alerts.length) * 100
                        } 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>تنبيهات المخزون الزائد</span>
                        <span className="font-medium">
                          {alerts.filter(alert => alert.type === "excess_stock").length}
                        </span>
                      </div>
                      <Progress 
                        value={
                          (alerts.filter(alert => alert.type === "excess_stock").length / alerts.length) * 100
                        } 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>تنبيهات اتجاهات البيع</span>
                        <span className="font-medium">
                          {alerts.filter(alert => 
                            alert.type === "trend_alert" || alert.type === "restock_notification"
                          ).length}
                        </span>
                      </div>
                      <Progress 
                        value={
                          (alerts.filter(alert => 
                            alert.type === "trend_alert" || alert.type === "restock_notification"
                          ).length / alerts.length) * 100
                        } 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>إجراءات آلية متخذة</span>
                        <span className="font-medium">
                          {alerts.filter(alert => alert.autoActionTaken).length}
                        </span>
                      </div>
                      <Progress 
                        value={
                          (alerts.filter(alert => alert.autoActionTaken).length / alerts.length) * 100
                        } 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>أكثر المنتجات تنبيهًا</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stockLevels
                      .filter(item => item.status === "low" || item.status === "excess")
                      .slice(0, 5)
                      .map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div 
                            className="h-10 w-10 rounded-md bg-center bg-cover bg-no-repeat flex-shrink-0"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{item.name}</p>
                              {item.status === "low" ? (
                                <Badge variant="destructive">منخفض</Badge>
                              ) : (
                                <Badge variant="warning" className="bg-amber-500">زائد</Badge>
                              )}
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-muted-foreground">
                                المخزون: {item.currentStock} / {item.optimalStock}
                              </span>
                              <span className="text-sm font-medium">
                                {Math.round(item.currentStock / item.optimalStock * 100)}%
                              </span>
                            </div>
                            <Progress 
                              value={(item.currentStock / item.optimalStock) * 100} 
                              className="h-1 mt-1" 
                            />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>اتجاهات المبيعات (آخر 30 يوم)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                          }} 
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => formatDate(new Date(value))}
                          formatter={(value) => [`${value} منتج`, 'المبيعات']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="sales" 
                          name="المبيعات" 
                          stroke="#0088FE" 
                          fill="#0088FE50" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>توقعات المخزون</CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="showPrediction" className="cursor-pointer">عرض التوقعات</Label>
                    <Switch 
                      id="showPrediction"
                      checked={showPrediction}
                      onCheckedChange={setShowPrediction}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        ...salesTrends.slice(-10).map(item => ({
                          date: item.date,
                          actual: stockLevels[1].currentStock + 10 - salesTrends.slice(-10).findIndex(i => i.date === item.date),
                          predicted: null
                        })),
                        ...forecast
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                          }} 
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => formatDate(new Date(value))}
                          formatter={(value, name) => [
                            value !== null ? `${value} قطعة` : '-', 
                            name === 'actual' ? 'المخزون الفعلي' : 'المخزون المتوقع'
                          ]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          name="المخزون الفعلي" 
                          stroke="#82ca9d" 
                          strokeWidth={2}
                          dot={true} 
                        />
                        {showPrediction && (
                          <Line 
                            type="monotone" 
                            dataKey="predicted" 
                            name="المخزون المتوقع" 
                            stroke="#ff7300" 
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            dot={false} 
                          />
                        )}
                        <ReferenceLine 
                          y={stockLevels[1].reorderPoint} 
                          stroke="red" 
                          strokeDasharray="3 3" 
                          label={{ 
                            value: 'نقطة إعادة الطلب', 
                            position: 'insideBottomRight',
                            fill: 'red',
                            fontSize: 12
                          }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <Alert variant="warning" className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <AlertTitle>توقع نفاد المخزون</AlertTitle>
                      <AlertDescription>
                        من المتوقع أن ينفد مخزون المنتج <span className="font-medium">ساعة ذكية متطورة</span> في 10 مايو 2025.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>تحليل المنتجات حسب معدل الدوران</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-3">المنتجات سريعة الحركة</h3>
                      <div className="space-y-4">
                        {stockLevels
                          .sort((a, b) => b.soldLast30Days - a.soldLast30Days)
                          .slice(0, 3)
                          .map(item => (
                            <div key={item.id} className="flex items-start gap-4">
                              <div 
                                className="h-10 w-10 rounded-md bg-center bg-cover bg-no-repeat flex-shrink-0"
                                style={{ backgroundImage: `url(${item.image})` }}
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  <div className="text-center border rounded-md p-2">
                                    <p className="text-xs text-muted-foreground">المباع</p>
                                    <p className="font-medium">{item.soldLast30Days}</p>
                                  </div>
                                  <div className="text-center border rounded-md p-2">
                                    <p className="text-xs text-muted-foreground">المخزون</p>
                                    <p className="font-medium">{item.currentStock}</p>
                                  </div>
                                  <div className="text-center border rounded-md p-2">
                                    <p className="text-xs text-muted-foreground">الدوران</p>
                                    <p className="font-medium">
                                      {(item.soldLast30Days / item.currentStock).toFixed(1)}×
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-3">المنتجات بطيئة الحركة</h3>
                      <div className="space-y-4">
                        {stockLevels
                          .sort((a, b) => a.soldLast30Days / a.currentStock - b.soldLast30Days / b.currentStock)
                          .slice(0, 3)
                          .map(item => (
                            <div key={item.id} className="flex items-start gap-4">
                              <div 
                                className="h-10 w-10 rounded-md bg-center bg-cover bg-no-repeat flex-shrink-0"
                                style={{ backgroundImage: `url(${item.image})` }}
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  <div className="text-center border rounded-md p-2">
                                    <p className="text-xs text-muted-foreground">المباع</p>
                                    <p className="font-medium">{item.soldLast30Days}</p>
                                  </div>
                                  <div className="text-center border rounded-md p-2">
                                    <p className="text-xs text-muted-foreground">المخزون</p>
                                    <p className="font-medium">{item.currentStock}</p>
                                  </div>
                                  <div className="text-center border rounded-md p-2">
                                    <p className="text-xs text-muted-foreground">الدوران</p>
                                    <p className="font-medium">
                                      {(item.soldLast30Days / item.currentStock).toFixed(1)}×
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {item.status === "excess" && (
                                <Badge variant="warning" className="bg-amber-500">زائد</Badge>
                              )}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">توزيع المخزون</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'منخفض', value: inventoryStats?.lowStock || 0 },
                              { name: 'عادي', value: inventoryStats?.normalStock || 0 },
                              { name: 'زائد', value: inventoryStats?.excessStock || 0 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'منخفض', value: inventoryStats?.lowStock || 0 },
                              { name: 'عادي', value: inventoryStats?.normalStock || 0 },
                              { name: 'زائد', value: inventoryStats?.excessStock || 0 },
                            ].map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index === 0 ? '#ff6b6b' : index === 1 ? '#51cf66' : '#fcc419'} 
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} منتج`, '']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <h3 className="font-medium">توصيات النظام</h3>
                      
                      <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <p className="font-medium text-green-800">إعادة طلب منتجات منخفضة</p>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          يوصى بإعادة طلب المنتجات منخفضة المخزون (2 منتج) لتجنب نفاد المخزون.
                        </p>
                      </div>
                      
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          <p className="font-medium text-amber-800">تخفيض المنتجات الزائدة</p>
                        </div>
                        <p className="text-sm text-amber-700 mt-1">
                          يوصى بتطبيق عروض خاصة على المنتجات ذات المخزون الزائد (2 منتج) لتسريع حركة البيع.
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