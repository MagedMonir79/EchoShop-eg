import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
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
  Calendar, 
  CreditCard, 
  DollarSign, 
  Download, 
  PieChart as PieChartIcon, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Users 
} from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { DataTable } from "@/components/ui/data-table";
import SellerLayout from "@/components/layout/seller-layout";
import { formatDate } from "@/lib/date-formatter";
import { convertUSDtoEGP } from "@/lib/currency-formatter";
import { useTranslation } from "@/hooks/use-translation";

// Temporary mock data for demonstration
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

const financialSummary = {
  totalEarnings: 8750.25,
  pendingPayouts: 2150.75,
  thisMonthRevenue: 3210.50,
  lastMonthRevenue: 2890.20,
  monthlyGrowth: 11.08,
  totalOrders: 124,
  currentCommissionRate: 10,
  nextPaymentDate: "2025-05-15"
};

const revenueData = [
  { month: 'Jan', revenue: 4000, commissions: 400 },
  { month: 'Feb', revenue: 5000, commissions: 500 },
  { month: 'Mar', revenue: 3000, commissions: 300 },
  { month: 'Apr', revenue: 6000, commissions: 600 },
  { month: 'May', revenue: 5500, commissions: 550 },
  { month: 'Jun', revenue: 6500, commissions: 650 },
];

const productPerformance = [
  { name: 'سماعات لاسلكية', value: 35 },
  { name: 'ساعة ذكية', value: 25 },
  { name: 'شاحن محمول', value: 15 },
  { name: 'كاميرا رقمية', value: 10 },
  { name: 'مكبر صوت', value: 8 },
  { name: 'آخرون', value: 7 },
];

const transactionColumns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "date", header: "التاريخ" },
  { accessorKey: "orderNumber", header: "رقم الطلب" },
  { accessorKey: "type", header: "النوع" },
  { 
    accessorKey: "amount", 
    header: "المبلغ",
    cell: ({ row }: any) => (
      <CurrencyDisplay amount={convertUSDtoEGP(row.getValue("amount"))} />
    ),
  },
  { accessorKey: "status", header: "الحالة" },
];

const recentTransactions = [
  { 
    id: 1, 
    date: "2025-04-25", 
    orderNumber: "ORD-2023428", 
    type: "مبيعات", 
    amount: 325.50, 
    status: "مكتمل" 
  },
  { 
    id: 2, 
    date: "2025-04-22", 
    orderNumber: "ORD-2023415", 
    type: "مبيعات", 
    amount: 198.75, 
    status: "مكتمل" 
  },
  { 
    id: 3, 
    date: "2025-04-20", 
    orderNumber: "ORD-2023401", 
    type: "عمولة", 
    amount: -52.40, 
    status: "محسوم" 
  },
  { 
    id: 4, 
    date: "2025-04-18", 
    orderNumber: "ORD-2023395", 
    type: "استرداد", 
    amount: -145.00, 
    status: "معالج" 
  },
  { 
    id: 5, 
    date: "2025-04-15", 
    orderNumber: "ORD-2023389", 
    type: "مبيعات", 
    amount: 439.99, 
    status: "مكتمل" 
  },
];

const payoutHistory = [
  { 
    id: 1, 
    requestDate: "2025-03-30", 
    amount: 1250.75, 
    method: "حوالة بنكية", 
    status: "مكتمل",
    processedDate: "2025-04-05" 
  },
  { 
    id: 2, 
    requestDate: "2025-02-28", 
    amount: 980.50, 
    method: "حوالة بنكية", 
    status: "مكتمل",
    processedDate: "2025-03-05" 
  },
  { 
    id: 3, 
    requestDate: "2025-01-30", 
    amount: 1540.25, 
    method: "حوالة بنكية", 
    status: "مكتمل",
    processedDate: "2025-02-04" 
  },
];

const payoutColumns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "requestDate", header: "تاريخ الطلب" },
  { 
    accessorKey: "amount", 
    header: "المبلغ",
    cell: ({ row }: any) => (
      <CurrencyDisplay amount={convertUSDtoEGP(row.getValue("amount"))} />
    ),
  },
  { accessorKey: "method", header: "طريقة الدفع" },
  { accessorKey: "status", header: "الحالة" },
  { accessorKey: "processedDate", header: "تاريخ المعالجة" },
];

export default function SellerFinanceDashboard() {
  const { t, language } = useTranslation();
  const [timeRange, setTimeRange] = useState("monthly");
  
  // In a real application, these would be API queries
  const { data: financialData, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ['/api/seller/finance/summary'],
    queryFn: () => Promise.resolve(financialSummary),
  });
  
  const { data: revenueChartData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['/api/seller/finance/revenue-chart'],
    queryFn: () => Promise.resolve(revenueData),
  });
  
  const { data: productData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['/api/seller/finance/product-performance'],
    queryFn: () => Promise.resolve(productPerformance),
  });
  
  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['/api/seller/finance/transactions'],
    queryFn: () => Promise.resolve(recentTransactions),
  });
  
  const { data: payoutsData, isLoading: isLoadingPayouts } = useQuery({
    queryKey: ['/api/seller/finance/payouts'],
    queryFn: () => Promise.resolve(payoutHistory),
  });
  
  const isLoading = isLoadingFinancial || isLoadingRevenue || 
    isLoadingProducts || isLoadingTransactions || isLoadingPayouts;
  
  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('financialDashboard')}</h1>
            <p className="text-muted-foreground">{t('manageYourFinancesAndTracRevenue')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download size={18} />
              {t('downloadReport')}
            </Button>
            <Button className="gap-2">
              <Plus size={18} />
              {t('requestPayout')}
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('totalEarnings')}</p>
                  <h3 className="text-2xl font-bold mt-1">
                    <CurrencyDisplay amount={convertUSDtoEGP(financialData.totalEarnings)} />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${financialData.totalEarnings.toFixed(2)} USD
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
                  <p className="text-muted-foreground text-sm">{t('pendingPayouts')}</p>
                  <h3 className="text-2xl font-bold mt-1">
                    <CurrencyDisplay amount={convertUSDtoEGP(financialData.pendingPayouts)} />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${financialData.pendingPayouts.toFixed(2)} USD
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('thisMonthRevenue')}</p>
                  <h3 className="text-2xl font-bold mt-1">
                    <CurrencyDisplay amount={convertUSDtoEGP(financialData.thisMonthRevenue)} />
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs ${financialData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                      {financialData.monthlyGrowth >= 0 ? 
                        <TrendingUp className="h-3 w-3 mr-1" /> : 
                        <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(financialData.monthlyGrowth).toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {t('vsLastMonth')}
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('totalOrders')}</p>
                  <h3 className="text-2xl font-bold mt-1">{financialData.totalOrders}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('commissionRate')}: {financialData.currentCommissionRate}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('revenueOverview')}</CardTitle>
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
              </div>
              <CardDescription>
                {t('revenueAndCommissionsOverTime')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
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
                    <Bar dataKey="revenue" name={t('revenue')} fill="#0088FE" />
                    <Bar dataKey="commissions" name={t('commissions')} fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('topPerformingProducts')}</CardTitle>
              <CardDescription>
                {t('productsSalesDistribution')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productData.map((entry, index) => (
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
        
        {/* Tabs for Transactions and Payouts */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="transactions">{t('transactions')}</TabsTrigger>
            <TabsTrigger value="payouts">{t('payoutHistory')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>{t('recentTransactions')}</CardTitle>
                <CardDescription>
                  {t('viewAllYourRecentSalesAndCommissions')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={transactionColumns} 
                  data={transactionsData} 
                  searchKey="orderNumber"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>{t('payoutHistory')}</CardTitle>
                <CardDescription>
                  {t('allYourPreviousAndPendingPayouts')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={payoutColumns} 
                  data={payoutsData} 
                  searchKey="requestDate"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Payout Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>{t('nextScheduledPayout')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t('yourNextPayoutIsScheduledFor')}
                </p>
                <p className="font-medium text-lg">
                  {formatDate(new Date(financialData.nextPaymentDate))} 
                  <span className="text-muted-foreground ml-2 text-sm">
                    ({t('estimatedAmount')}: <CurrencyDisplay amount={convertUSDtoEGP(financialData.pendingPayouts)} />)
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}