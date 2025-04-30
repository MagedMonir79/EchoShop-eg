import { useState, useEffect, useContext } from "react";
import AdminDashboardLayout from "@/components/layout/admin-dashboard-layout";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { LanguageContext } from "@/context/language-context";
import { 
  ShoppingCart, Users, Package, TruckIcon, DollarSign, 
  BarChart3, Settings, Clock, AlertTriangle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// مكونات الرسوم البيانية
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";

// بيانات تجريبية
const salesData = [
  { name: 'يناير', revenue: 13500, orders: 120 },
  { name: 'فبراير', revenue: 15000, orders: 135 },
  { name: 'مارس', revenue: 18000, orders: 162 },
  { name: 'أبريل', revenue: 17500, orders: 158 },
  { name: 'مايو', revenue: 21000, orders: 189 },
  { name: 'يونيو', revenue: 22500, orders: 203 },
];

const recentOrders = [
  { id: 12345, customer: "أحمد محمود", status: "completed", amount: 1250, date: "اليوم 10:30 ص" },
  { id: 12344, customer: "سارة علي", status: "processing", amount: 780, date: "اليوم 09:45 ص" },
  { id: 12343, customer: "محمد خالد", status: "processing", amount: 2100, date: "اليوم 08:15 ص" },
  { id: 12342, customer: "فاطمة أحمد", status: "pending", amount: 450, date: "أمس 22:20 م" },
  { id: 12341, customer: "خالد إبراهيم", status: "completed", amount: 3200, date: "أمس 18:50 م" },
];

const bestSellingProducts = [
  { rank: 1, name: "سماعات بلوتوث لاسلكية", category: "إلكترونيات", sales: 132, revenue: 15840 },
  { rank: 2, name: "ساعة ذكية مقاومة للماء", category: "إلكترونيات", sales: 98, revenue: 19600 },
  { rank: 3, name: "حقيبة ظهر جلدية", category: "أزياء", sales: 87, revenue: 8700 },
  { rank: 4, name: "مكبر صوت محمول", category: "إلكترونيات", sales: 76, revenue: 7600 },
  { rank: 5, name: "طقم أواني طهي", category: "منزل", sales: 68, revenue: 10200 },
];

const packagingStats = [
  { name: 'يناير', qualityScore: 92, incidents: 5 },
  { name: 'فبراير', qualityScore: 93, incidents: 4 },
  { name: 'مارس', qualityScore: 95, incidents: 3 },
  { name: 'أبريل', qualityScore: 97, incidents: 2 },
  { name: 'مايو', qualityScore: 98, incidents: 1 },
  { name: 'يونيو', qualityScore: 99, incidents: 1 },
];

export default function AdminDashboard() {
  const { t, language } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // محاكاة الحصول على البيانات
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // تتبع البيانات المختارة للعرض
  const [statsTimeFrame, setStatsTimeFrame] = useState("today");
  const [chartTimeFrame, setChartTimeFrame] = useState("week");

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t("adminDashboard")}</h1>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              {t("dashboardSettings")}
            </Button>
            <Button size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t("generateReport")}
            </Button>
          </div>
        </div>
        
        {/* بطاقات الإحصائيات */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title={t("totalRevenue")}
            value="ج.م 253,450"
            icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
            trend="+12.5%"
            trendType="positive"
            description={t("comparedToLastMonth")}
            loading={isLoading}
          />
          <StatsCard
            title={t("totalOrders")}
            value="1,284"
            icon={<ShoppingCart className="h-4 w-4 text-blue-500" />}
            trend="+8.2%"
            trendType="positive"
            description={t("comparedToLastMonth")}
            loading={isLoading}
          />
          <StatsCard
            title={t("activeUsers")}
            value="12,459"
            icon={<Users className="h-4 w-4 text-indigo-500" />}
            trend="+18.3%"
            trendType="positive"
            description={t("comparedToLastMonth")}
            loading={isLoading}
          />
          <StatsCard
            title={t("packagingQuality")}
            value="98%"
            icon={<Package className="h-4 w-4 text-amber-500" />}
            trend="+2.4%"
            trendType="positive"
            description={t("comparedToLastMonth")}
            loading={isLoading}
          />
        </div>
        
        {/* الرسوم البيانية */}
        <Tabs defaultValue="sales" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="sales">{t("sales")}</TabsTrigger>
              <TabsTrigger value="packaging">{t("packagingQuality")}</TabsTrigger>
              <TabsTrigger value="users">{t("userActivity")}</TabsTrigger>
            </TabsList>
            
            <select
              className="px-2 py-1 rounded border border-border text-sm"
              value={chartTimeFrame}
              onChange={(e) => setChartTimeFrame(e.target.value)}
            >
              <option value="week">{t("lastWeek")}</option>
              <option value="month">{t("lastMonth")}</option>
              <option value="quarter">{t("lastQuarter")}</option>
              <option value="year">{t("lastYear")}</option>
            </select>
          </div>
          
          <TabsContent value="sales" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t("salesOverview")}</CardTitle>
                <CardDescription>{t("viewSalesAndOrderTrends")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                {!isLoading ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        name={t("revenue")}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#82ca9d"
                        name={t("orders")}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="packaging" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t("packagingQualityMetrics")}</CardTitle>
                <CardDescription>{t("trackPackagingQualityAndIncidents")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                {!isLoading ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={packagingStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" domain={[80, 100]} />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="qualityScore"
                        name={t("qualityScore")}
                        fill="#8884d8"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="incidents"
                        name={t("reportedIncidents")}
                        fill="#ff8042"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t("userActivity")}</CardTitle>
                <CardDescription>{t("trackUserEngagementAndRetention")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">{t("comingSoon")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* أحدث الطلبات وأفضل المنتجات مبيعًا */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* أحدث الطلبات */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("recentOrders")}</CardTitle>
              <CardDescription>{t("latestOrdersReceivedByThePlatform")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-2 animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded"></div>
                        <div className="h-3 w-32 bg-muted rounded"></div>
                      </div>
                      <div className="h-4 w-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((order, i) => (
                    <div key={i} className="flex justify-between items-center p-2 hover:bg-muted rounded-md transition-colors">
                      <div>
                        <p className="font-medium">#{order.id} - {order.customer}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{order.date}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {t(order.status)}
                          </span>
                        </div>
                      </div>
                      <p className="font-bold">ج.م {order.amount.toLocaleString()}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2">
                    {t("viewAllOrders")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* أفضل المنتجات مبيعًا */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("bestSellingProducts")}</CardTitle>
              <CardDescription>{t("topPerformingProductsThisMonth")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-2 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-muted rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-muted rounded"></div>
                          <div className="h-3 w-24 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="h-4 w-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {bestSellingProducts.map((product, i) => (
                    <div key={i} className="flex justify-between items-center p-2 hover:bg-muted rounded-md transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                          {product.rank}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{product.sales} {t("sold")}</p>
                        <p className="text-sm text-muted-foreground">ج.م {product.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2">
                    {t("viewAllProducts")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* إحصائيات التغليف ونظام QR */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* إحصائيات التغليف */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t("packagingQualityTracker")}</CardTitle>
              <CardDescription>{t("monitorAndTrackTheQualityOfProductPackaging")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <p className="text-lg font-bold">98.2%</p>
                    <p className="text-sm text-muted-foreground">{t("complianceRate")}</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <p className="text-lg font-bold">1,284</p>
                    <p className="text-sm text-muted-foreground">{t("qrCodesGenerated")}</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <p className="text-lg font-bold">1,205</p>
                    <p className="text-sm text-muted-foreground">{t("qrCodesScanned")}</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <p className="text-lg font-bold">5</p>
                    <p className="text-sm text-muted-foreground">{t("reportedIncidents")}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">{t("recentPackagingAlerts")}</p>
                  
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
                        <AlertTriangle className="h-4 w-4" />
                        <p className="text-sm font-medium">
                          {t("reportedDamageForOrderId", { id: "12338" })} - {t("underInvestigation")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-md">
                        <AlertTriangle className="h-4 w-4" />
                        <p className="text-sm font-medium">
                          {t("qrCodeTamperedForOrderId", { id: "12335" })} - {t("resolved")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-md">
                        <TruckIcon className="h-4 w-4" />
                        <p className="text-sm font-medium">
                          {t("shippingCompanyVerificationPending", { orders: "23" })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* حالة نظام QR */}
          <Card>
            <CardHeader>
              <CardTitle>{t("qrCodeSystemStatus")}</CardTitle>
              <CardDescription>{t("realtimeStatusOfTheQrCodeSystem")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-48 bg-muted rounded animate-pulse"></div>
                  <div className="h-12 bg-muted rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-square max-w-[180px] mx-auto bg-white p-4 rounded-md">
                    <div className="relative aspect-square flex items-center justify-center border-2 border-dashed border-primary/50 rounded">
                      <div className="text-sm text-center text-muted-foreground p-4">
                        {t("qrCodePreviewWillAppearHere")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">{t("systemIsOperating")}</p>
                    <Button variant="outline" size="sm">
                      {t("generateTestQrCode")}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center space-y-1">
                    <p>{t("qrCodesGeneratedToday")}: 68</p>
                    <p>{t("qrCodesScannedToday")}: 52</p>
                    <p>{t("systemUptimePercentage")}: 99.99%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}