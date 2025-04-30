import { useContext, useState } from "react";
import { SellerLayout } from "@/components/layout/seller-layout";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  ShoppingBag,
  ShoppingCart,
  User,
  Users,
  TrendingUp,
  BarChart3,
  Eye,
} from "lucide-react";

// Mock data for sales
const salesData = [
  { name: "Jan", total: 4500 },
  { name: "Feb", total: 6500 },
  { name: "Mar", total: 5800 },
  { name: "Apr", total: 7200 },
  { name: "May", total: 9000 },
  { name: "Jun", total: 10500 },
  { name: "Jul", total: 11200 },
  { name: "Aug", total: 9800 },
  { name: "Sep", total: 12500 },
  { name: "Oct", total: 13200 },
  { name: "Nov", total: 16500 },
  { name: "Dec", total: 21000 },
];

// Mock data for products
const productData = [
  { name: "Smart Watch Pro", value: 35 },
  { name: "Leather Wallet", value: 25 },
  { name: "Camera Lens", value: 15 },
  { name: "Gaming Headset", value: 15 },
  { name: "Other Products", value: 10 },
];

// Mock data for traffic sources
const trafficData = [
  { name: "Direct", value: 40 },
  { name: "Social Media", value: 25 },
  { name: "Search", value: 20 },
  { name: "Referral", value: 15 },
];

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

export default function SellerAnalyticsPage() {
  const { language, t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const isRTL = language === "ar";
  
  const [timeRange, setTimeRange] = useState("year");
  const [chartView, setChartView] = useState("sales");
  
  // Format currency to EGP
  const formatEGP = (value: number) => {
    return `EGP ${value.toLocaleString()}`;
  };
  
  return (
    <SellerLayout>
      <div className={`p-6 ${isRTL ? "rtl" : ""}`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {t("analytics") || "Analytics"}
            </h1>
            <p className="text-muted-foreground">
              {t("analyticsDescription") || "Track your store performance and customer behavior."}
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("selectTimeRange") || "Select time range"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">{t("today") || "Today"}</SelectItem>
                <SelectItem value="week">{t("thisWeek") || "This Week"}</SelectItem>
                <SelectItem value="month">{t("thisMonth") || "This Month"}</SelectItem>
                <SelectItem value="quarter">{t("thisQuarter") || "This Quarter"}</SelectItem>
                <SelectItem value="year">{t("thisYear") || "This Year"}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("export") || "Export"}
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Total Sales */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("totalSales") || "Total Sales"}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatEGP(127890)}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% <ArrowUp className="h-3 w-3 text-green-500 inline ml-1" />
                {t("fromPreviousPeriod") || "from previous period"}
              </p>
            </CardContent>
          </Card>
          
          {/* Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("orders") || "Orders"}
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">412</div>
              <p className="text-xs text-muted-foreground">
                +12.5% <ArrowUp className="h-3 w-3 text-green-500 inline ml-1" />
                {t("fromPreviousPeriod") || "from previous period"}
              </p>
            </CardContent>
          </Card>
          
          {/* Average Order Value */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("averageOrderValue") || "Avg. Order Value"}
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatEGP(310.41)}</div>
              <p className="text-xs text-muted-foreground">
                +5.2% <ArrowUp className="h-3 w-3 text-green-500 inline ml-1" />
                {t("fromPreviousPeriod") || "from previous period"}
              </p>
            </CardContent>
          </Card>
          
          {/* Customers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("customers") || "Customers"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">287</div>
              <p className="text-xs text-muted-foreground">
                +18.7% <ArrowUp className="h-3 w-3 text-green-500 inline ml-1" />
                {t("fromPreviousPeriod") || "from previous period"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-6">
          {/* Sales Overview - Line Chart */}
          <Card className="col-span-full xl:col-span-2">
            <CardHeader>
              <CardTitle>{t("salesOverview") || "Sales Overview"}</CardTitle>
              <CardDescription>
                {t("salesOverviewDescription") || "Monthly sales trends for the year"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888"
                      tick={{ fill: '#888888' }}
                    />
                    <YAxis 
                      stroke="#888888"
                      tick={{ fill: '#888888' }}
                      tickFormatter={(value) => `EGP ${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`EGP ${value}`, t("total") || "Total"]}
                      contentStyle={{
                        backgroundColor: '#222',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#a3e635"
                      activeDot={{ r: 8 }}
                      name={t("sales") || "Sales"}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Product Analysis - Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t("topSellingProducts") || "Top Selling Products"}</CardTitle>
              <CardDescription>
                {t("productAnalysisDescription") || "Distribution of sales by product"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
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
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, ""]}
                      contentStyle={{
                        backgroundColor: '#222',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend 
                      formatter={(value, entry, index) => (
                        <span style={{ color: '#888888' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Traffic and Order Status */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-6">
          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>{t("trafficSources") || "Traffic Sources"}</CardTitle>
              <CardDescription>
                {t("trafficSourcesDescription") || "Where your customers come from"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, ""]}
                      contentStyle={{
                        backgroundColor: '#222',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend 
                      formatter={(value, entry, index) => (
                        <span style={{ color: '#888888' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t("orderStatus") || "Order Status"}</CardTitle>
              <CardDescription>
                {t("orderStatusDescription") || "Distribution of orders by status"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: t("pending") || "Pending", value: 15 },
                      { name: t("processing") || "Processing", value: 22 },
                      { name: t("shipped") || "Shipped", value: 18 },
                      { name: t("delivered") || "Delivered", value: 40 },
                      { name: t("cancelled") || "Cancelled", value: 5 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      type="number" 
                      stroke="#888888"
                      tick={{ fill: '#888888' }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="name" 
                      stroke="#888888"
                      tick={{ fill: '#888888' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, ""]}
                      contentStyle={{
                        backgroundColor: '#222',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#a3e635" 
                      name={t("percentage") || "Percentage"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerLayout>
  );
}