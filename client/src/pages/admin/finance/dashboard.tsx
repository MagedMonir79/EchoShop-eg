import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Line 
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Building,
  Calendar,
  Check,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  User,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { DataTable } from "@/components/ui/data-table";
import AdminLayout from "@/components/layout/admin-layout";
import { convertUSDtoEGP } from "@/lib/currency-formatter";
import { useTranslation } from "@/hooks/use-translation";

// COLORS for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

// Mock data for demonstration
const financialOverview = {
  totalRevenue: 128750.25,
  platformCommissions: 12875.95,
  pendingPayouts: 18250.75,
  deliveryFees: 8950.50,
  monthlyGrowth: 8.3,
  sellerCount: 42,
  orderCount: 1245,
  avgOrderValue: 103.41
};

const revenueData = [
  { month: 'Jan', revenue: 85000, commissions: 8500, deliveryFees: 5100 },
  { month: 'Feb', revenue: 92000, commissions: 9200, deliveryFees: 5520 },
  { month: 'Mar', revenue: 89000, commissions: 8900, deliveryFees: 5340 },
  { month: 'Apr', revenue: 102000, commissions: 10200, deliveryFees: 6120 },
  { month: 'May', revenue: 110000, commissions: 11000, deliveryFees: 6600 },
  { month: 'Jun', revenue: 128750, commissions: 12875, deliveryFees: 7725 },
];

const sellerPerformanceData = [
  { name: 'متجر إلكترونيات حديثة', sales: 28750.50, commissions: 2875.05, percentage: 22.3 },
  { name: 'متجر أزياء الشباب', sales: 22500.75, commissions: 2250.08, percentage: 17.5 },
  { name: 'متجر أدوات منزلية', sales: 18900.25, commissions: 1890.03, percentage: 14.7 },
  { name: 'متجر مستلزمات رياضية', sales: 16800.50, commissions: 1680.05, percentage: 13.0 },
  { name: 'متجر كتب وقرطاسية', sales: 15400.75, commissions: 1540.08, percentage: 12.0 },
  { name: 'متجر الهدايا الفاخرة', sales: 13500.25, commissions: 1350.03, percentage: 10.5 },
  { name: 'متجر أجهزة منزلية', sales: 12900.75, commissions: 1290.08, percentage: 10.0 },
];

const categoryData = [
  { name: 'إلكترونيات', value: 35 },
  { name: 'أزياء', value: 25 },
  { name: 'منزل وحديقة', value: 15 },
  { name: 'ألعاب وهوايات', value: 10 },
  { name: 'مستلزمات رياضية', value: 8 },
  { name: 'أخرى', value: 7 },
];

const payoutRequestsColumns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "seller", header: "البائع" },
  { 
    accessorKey: "amount", 
    header: "المبلغ",
    cell: ({ row }: any) => (
      <CurrencyDisplay amount={convertUSDtoEGP(row.getValue("amount"))} />
    ),
  },
  { accessorKey: "method", header: "طريقة الدفع" },
  { accessorKey: "requestDate", header: "تاريخ الطلب" },
  { 
    accessorKey: "status", 
    header: "الحالة",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      
      return (
        <Badge variant={
          status === "pending" ? "outline" : 
          status === "processing" ? "secondary" : 
          status === "completed" ? "success" : 
          "destructive"
        }>
          {status === "pending" ? "قيد الانتظار" :
           status === "processing" ? "قيد المعالجة" :
           status === "completed" ? "مكتمل" :
           "فشل"}
        </Badge>
      );
    }
  },
  { 
    accessorKey: "actions", 
    header: "",
    cell: () => (
      <Button variant="ghost" size="sm">معالجة</Button>
    )
  },
];

const pendingPayouts = [
  { 
    id: 1,
    seller: "متجر إلكترونيات حديثة",
    amount: 2875.50,
    method: "تحويل بنكي",
    requestDate: "2025-04-25",
    status: "pending"
  },
  { 
    id: 2,
    seller: "متجر أزياء الشباب",
    amount: 1980.25,
    method: "تحويل بنكي",
    requestDate: "2025-04-24",
    status: "processing"
  },
  { 
    id: 3,
    seller: "متجر أدوات منزلية",
    amount: 1540.75,
    method: "تحويل بنكي",
    requestDate: "2025-04-24",
    status: "pending"
  },
  { 
    id: 4,
    seller: "متجر مستلزمات رياضية",
    amount: 2100.30,
    method: "تحويل بنكي",
    requestDate: "2025-04-23",
    status: "pending"
  },
  { 
    id: 5,
    seller: "متجر كتب وقرطاسية",
    amount: 1250.60,
    method: "تحويل بنكي",
    requestDate: "2025-04-22",
    status: "processing"
  },
];

const deliveryCompanyData = [
  { name: 'شركة التوصيل السريع', value: 45, settledAmount: 4025.50, pendingAmount: 1850.25 },
  { name: 'شركة النقل الأمين', value: 30, settledAmount: 2680.30, pendingAmount: 1233.50 },
  { name: 'شركة الشحن المتحدة', value: 15, settledAmount: 1340.15, pendingAmount: 616.75 },
  { name: 'خدمة التوصيل الممتازة', value: 10, settledAmount: 893.40, pendingAmount: 411.20 },
];

const deliverySettlementsColumns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "company", header: "شركة التوصيل" },
  { accessorKey: "period", header: "الفترة" },
  { accessorKey: "orderCount", header: "عدد الطلبات" },
  { 
    accessorKey: "totalAmount", 
    header: "المبلغ الإجمالي",
    cell: ({ row }: any) => (
      <CurrencyDisplay amount={convertUSDtoEGP(row.getValue("totalAmount"))} />
    ),
  },
  { 
    accessorKey: "collectedAmount", 
    header: "المبلغ المحصل",
    cell: ({ row }: any) => (
      <CurrencyDisplay amount={convertUSDtoEGP(row.getValue("collectedAmount"))} />
    ),
  },
  { 
    accessorKey: "percentage", 
    header: "نسبة التحصيل",
    cell: ({ row }: any) => {
      const percentage = row.getValue("percentage");
      
      return (
        <div className="flex items-center gap-2">
          <Progress value={percentage} className="h-2 w-20" />
          <span>{percentage}%</span>
        </div>
      );
    }
  },
  { 
    accessorKey: "status", 
    header: "الحالة",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      
      return (
        <Badge variant={
          status === "pending" ? "outline" : 
          status === "reconciling" ? "secondary" : 
          "success"
        }>
          {status === "pending" ? "قيد الانتظار" :
           status === "reconciling" ? "قيد التسوية" :
           "مكتمل"}
        </Badge>
      );
    }
  },
];

const recentSettlements = [
  { 
    id: 1,
    company: "شركة التوصيل السريع",
    period: "أبريل 2025 (النصف الأول)",
    orderCount: 245,
    totalAmount: 22500.75,
    collectedAmount: 19125.64,
    percentage: 85,
    status: "reconciling"
  },
  { 
    id: 2,
    company: "شركة النقل الأمين",
    period: "أبريل 2025 (النصف الأول)",
    orderCount: 180,
    totalAmount: 16800.50,
    collectedAmount: 15120.45,
    percentage: 90,
    status: "pending"
  },
  { 
    id: 3,
    company: "شركة الشحن المتحدة",
    period: "أبريل 2025 (النصف الأول)",
    orderCount: 120,
    totalAmount: 11200.30,
    collectedAmount: 9856.26,
    percentage: 88,
    status: "reconciling"
  },
  { 
    id: 4,
    company: "شركة التوصيل السريع",
    period: "مارس 2025 (النصف الثاني)",
    orderCount: 235,
    totalAmount: 21250.80,
    collectedAmount: 21250.80,
    percentage: 100,
    status: "completed"
  },
  { 
    id: 5,
    company: "شركة النقل الأمين",
    period: "مارس 2025 (النصف الثاني)",
    orderCount: 165,
    totalAmount: 15375.45,
    collectedAmount: 15375.45,
    percentage: 100,
    status: "completed"
  },
];

export default function AdminFinanceDashboard() {
  const { t, language } = useTranslation();
  const [timeRange, setTimeRange] = useState("monthly");
  
  // In a real application, these would be API queries
  const { data: financialData, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ['/api/admin/finance/overview'],
    queryFn: () => Promise.resolve(financialOverview),
  });
  
  const { data: revenueChartData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['/api/admin/finance/revenue-chart'],
    queryFn: () => Promise.resolve(revenueData),
  });
  
  const { data: sellerData, isLoading: isLoadingSellers } = useQuery({
    queryKey: ['/api/admin/finance/seller-performance'],
    queryFn: () => Promise.resolve(sellerPerformanceData),
  });
  
  const { data: categoryChartData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/admin/finance/category-distribution'],
    queryFn: () => Promise.resolve(categoryData),
  });
  
  const { data: payoutsData, isLoading: isLoadingPayouts } = useQuery({
    queryKey: ['/api/admin/finance/pending-payouts'],
    queryFn: () => Promise.resolve(pendingPayouts),
  });
  
  const { data: deliveryData, isLoading: isLoadingDelivery } = useQuery({
    queryKey: ['/api/admin/finance/delivery-companies'],
    queryFn: () => Promise.resolve(deliveryCompanyData),
  });
  
  const { data: settlementsData, isLoading: isLoadingSettlements } = useQuery({
    queryKey: ['/api/admin/finance/delivery-settlements'],
    queryFn: () => Promise.resolve(recentSettlements),
  });
  
  const isLoading = isLoadingFinancial || isLoadingRevenue || isLoadingSellers || 
    isLoadingCategories || isLoadingPayouts || isLoadingDelivery || isLoadingSettlements;
  
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
            <h1 className="text-2xl font-bold">{t('financialDashboard')}</h1>
            <p className="text-muted-foreground">{t('overseeAllFinancialOperationsForThePlatform')}</p>
          </div>
          <div className="flex gap-2">
            <Select
              defaultValue={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('selectTimeRange')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">{t('weekly')}</SelectItem>
                <SelectItem value="monthly">{t('monthly')}</SelectItem>
                <SelectItem value="quarterly">{t('quarterly')}</SelectItem>
                <SelectItem value="yearly">{t('yearly')}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download size={18} />
              {t('exportReport')}
            </Button>
            <Button className="gap-2">
              <FileText size={18} />
              {t('generateFinancialReport')}
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('totalRevenue')}</p>
                  <h3 className="text-2xl font-bold mt-1">
                    <CurrencyDisplay amount={convertUSDtoEGP(financialData.totalRevenue)} />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${financialData.totalRevenue.toFixed(2)} USD
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('platformCommissions')}</p>
                  <h3 className="text-2xl font-bold mt-1">
                    <CurrencyDisplay amount={convertUSDtoEGP(financialData.platformCommissions)} />
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs ${financialData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                      {financialData.monthlyGrowth >= 0 ? 
                        <ArrowUp className="h-3 w-3 mr-1" /> : 
                        <ArrowDown className="h-3 w-3 mr-1" />}
                      {Math.abs(financialData.monthlyGrowth).toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {t('vsLastMonth')}
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('pendingPayouts')}</p>
                  <h3 className="text-2xl font-bold mt-1">
                    <CurrencyDisplay amount={convertUSDtoEGP(financialData.pendingPayouts)} />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('forSellers')}: {financialData.sellerCount}
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('deliveryFees')}</p>
                  <h3 className="text-2xl font-bold mt-1">
                    <CurrencyDisplay amount={convertUSDtoEGP(financialData.deliveryFees)} />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('avgOrderValue')}: <CurrencyDisplay amount={convertUSDtoEGP(financialData.avgOrderValue)} showCurrency={false} />
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('revenueBreakdown')}</CardTitle>
            <CardDescription>
              {t('platformRevenueBreakdownOverTime')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [
                      `${new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(Number(value))}`,
                      ''
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name={t('totalRevenue')} fill="#0088FE" />
                  <Bar dataKey="commissions" name={t('platformCommissions')} fill="#00C49F" />
                  <Bar dataKey="deliveryFees" name={t('deliveryFees')} fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Sellers and Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('topPerformingSellers')}</CardTitle>
              <CardDescription>
                {t('sellersWithHighestSalesAndCommissions')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sellerData.slice(0, 5).map((seller, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{seller.name}</span>
                      </div>
                      <div className="text-right">
                        <CurrencyDisplay amount={convertUSDtoEGP(seller.sales)} className="font-medium" />
                        <p className="text-xs text-muted-foreground">
                          {t('commission')}: <CurrencyDisplay amount={convertUSDtoEGP(seller.commissions)} showCurrency={false} />
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={seller.percentage} className="h-2" />
                      <span className="text-xs text-muted-foreground">{seller.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('salesByCategoryName')}</CardTitle>
              <CardDescription>
                {t('revenueDistributionAcrossCategories')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for Payouts and Delivery Settlements */}
        <Tabs defaultValue="payouts" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="payouts">{t('payoutRequests')}</TabsTrigger>
            <TabsTrigger value="deliverySettlements">{t('deliverySettlements')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>{t('pendingPayoutRequests')}</CardTitle>
                <CardDescription>
                  {t('managePayoutRequestsFromSellers')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={payoutRequestsColumns} 
                  data={payoutsData} 
                  searchKey="seller"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deliverySettlements">
            <Card>
              <CardHeader>
                <CardTitle>{t('deliveryCompanySettlements')}</CardTitle>
                <CardDescription>
                  {t('trackAndManageSettlementsWithDeliveryCompanies')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">{t('deliveryCompanyDistribution')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {deliveryData.map((company, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h4 className="font-medium truncate">{company.name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-1">
                              <Check className="h-4 w-4 text-green-600" />
                              <CurrencyDisplay amount={convertUSDtoEGP(company.settledAmount)} className="text-sm" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-yellow-600" />
                              <CurrencyDisplay amount={convertUSDtoEGP(company.pendingAmount)} className="text-sm" />
                            </div>
                          </div>
                          <Progress value={company.value} className="h-2 mt-2" />
                          <p className="text-xs text-muted-foreground text-right mt-1">{company.value}% من الطلبات</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <DataTable 
                  columns={deliverySettlementsColumns} 
                  data={settlementsData} 
                  searchKey="company"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}