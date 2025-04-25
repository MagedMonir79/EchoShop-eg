import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { LanguageContext } from "@/context/language-context";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Users, 
  ShoppingBag, 
  Package, 
  Truck, 
  Tag,
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  BarChart4
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardStats {
  userCount: number;
  productCount: number;
  categoryCount: number;
  orderCount: number;
  supplierCount: number;
}

export default function AdminDashboard() {
  const { t } = useContext(LanguageContext);
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard/stats'],
  });

  // Dummy data for charts
  const recentOrders = [
    { id: 1, customer: 'أحمد محمد', amount: 120.50, status: 'قيد المعالجة', date: '2023-09-15' },
    { id: 2, customer: 'فاطمة علي', amount: 89.99, status: 'تم التسليم', date: '2023-09-14' },
    { id: 3, customer: 'محمد عبد الله', amount: 45.75, status: 'قيد التوصيل', date: '2023-09-13' },
    { id: 4, customer: 'نورة سعيد', amount: 210.25, status: 'قيد المعالجة', date: '2023-09-12' },
    { id: 5, customer: 'خالد العلي', amount: 65.00, status: 'تم التسليم', date: '2023-09-11' },
  ];

  const topProducts = [
    { id: 1, name: 'سماعات لاسلكية', sales: 245, amount: 24500 },
    { id: 2, name: 'ساعة ذكية سلسلة 6', sales: 187, amount: 56100 },
    { id: 3, name: 'كاميرا بث 4K', sales: 124, amount: 16120 },
    { id: 4, name: 'وحدة تحكم الألعاب برو', sales: 96, amount: 7680 },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">{t("adminDashboard")}</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="shadow-md">
                <CardContent className="p-6">
                  <div className="h-20 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("totalUsers")}</p>
                    <h3 className="text-2xl font-bold mt-1">{stats?.userCount || 0}</h3>
                  </div>
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("totalProducts")}</p>
                    <h3 className="text-2xl font-bold mt-1">{stats?.productCount || 0}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("totalCategories")}</p>
                    <h3 className="text-2xl font-bold mt-1">{stats?.categoryCount || 0}</h3>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                    <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("totalOrders")}</p>
                    <h3 className="text-2xl font-bold mt-1">{stats?.orderCount || 0}</h3>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("totalSuppliers")}</p>
                    <h3 className="text-2xl font-bold mt-1">{stats?.supplierCount || 0}</h3>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                    <Truck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>{t("recentOrders")}</CardTitle>
              <CardDescription>{t("last5Orders")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-start flex-col">
                      <span className="font-medium">{order.customer}</span>
                      <span className="text-sm text-gray-500">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">{order.amount.toFixed(2)} $</span>
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'تم التسليم' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : order.status === 'قيد التوصيل'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>{t("topSellingProducts")}</CardTitle>
              <CardDescription>{t("bestPerformingProducts")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topProducts.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-gray-500">{product.sales} {t("sold")}</span>
                    </div>
                    <Progress value={product.sales / 2.5} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{t("totalRevenue")}</h3>
                  <p className="text-3xl font-bold mt-2">15,240.50 $</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12.5% {t("fromLastMonth")}
                  </p>
                </div>
                <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{t("avgOrderValue")}</h3>
                  <p className="text-3xl font-bold mt-2">124.30 $</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +3.2% {t("fromLastMonth")}
                  </p>
                </div>
                <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <ShoppingBag className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{t("conversionRate")}</h3>
                  <p className="text-3xl font-bold mt-2">3.6%</p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    -0.5% {t("fromLastMonth")}
                  </p>
                </div>
                <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <BarChart4 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}