import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { 
  ShoppingBag, 
  PackageOpen, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  Boxes, 
  Truck, 
  Calendar,
  ArrowUpRight,
  BarChart3,
  Search,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SellerLayout } from "@/components/layout/seller-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SellerDashboardPage() {
  const { language, t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const isRTL = language === "ar";
  const [, navigate] = useLocation();

  const { data: sellerProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/api/sellers/profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const response = await fetch(`/api/sellers/profile/${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch seller profile");
      }
      return await response.json();
    },
    enabled: !!user?.id,
  });

  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/sellers/stats", sellerProfile?.id],
    queryFn: async () => {
      if (!sellerProfile?.id) return null;
      
      const response = await fetch(`/api/sellers/stats/${sellerProfile.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch seller stats");
      }
      return await response.json();
    },
    enabled: !!sellerProfile?.id,
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["/api/sellers/products", sellerProfile?.id],
    queryFn: async () => {
      if (!sellerProfile?.id) return [];
      
      const response = await fetch(`/api/sellers/products/${sellerProfile.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch seller products");
      }
      return await response.json();
    },
    enabled: !!sellerProfile?.id,
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/sellers/orders", sellerProfile?.id],
    queryFn: async () => {
      if (!sellerProfile?.id) return [];
      
      const response = await fetch(`/api/sellers/orders/${sellerProfile.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch seller orders");
      }
      return await response.json();
    },
    enabled: !!sellerProfile?.id,
  });

  // If no seller profile, redirect to register page
  if (!isLoadingProfile && !sellerProfile) {
    navigate("/seller/register");
    return null;
  }

  // Default stats if not loaded yet
  const stats = dashboardStats || {
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalViews: 0,
    conversionRate: 0,
    revenueChart: [],
    topProducts: []
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get order status badge style
  const getOrderStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">{isRTL ? "قيد الانتظار" : "Pending"}</Badge>;
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">{isRTL ? "قيد المعالجة" : "Processing"}</Badge>;
      case "shipped":
        return <Badge className="bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30">{isRTL ? "تم الشحن" : "Shipped"}</Badge>;
      case "delivered":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">{isRTL ? "تم التسليم" : "Delivered"}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">{isRTL ? "ملغي" : "Cancelled"}</Badge>;
      case "returned":
        return <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">{isRTL ? "مرتجع" : "Returned"}</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30">{status}</Badge>;
    }
  };

  return (
    <SellerLayout>
      <div className={`container py-6 ${isRTL ? "rtl" : ""}`}>
        {/* Welcome Section */}
        {sellerProfile && (
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {isRTL ? `مرحبًا، ${sellerProfile.storeName || user?.firstName}` : `Welcome, ${sellerProfile.storeName || user?.firstName}`}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? "إليك نظرة عامة على متجرك" : "Here's an overview of your store"}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                <Link href="/seller/products">
                  <Boxes className="w-4 h-4" />
                  {isRTL ? "إدارة المنتجات" : "Manage Products"}
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                <Link href="/seller/orders">
                  <ShoppingBag className="w-4 h-4" />
                  {isRTL ? "عرض الطلبات" : "View Orders"}
                </Link>
              </Button>
              <Button variant="default" size="sm" className="flex items-center gap-2" asChild>
                <Link href="/seller/products/new">
                  <Plus className="w-4 h-4" />
                  {isRTL ? "إضافة منتج" : "Add Product"}
                </Link>
              </Button>
            </div>
          </div>
        )}

        {isLoadingProfile ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-mediumBlue border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {isRTL ? "المبيعات" : "Total Sales"}
                        </p>
                        <h3 className="text-2xl font-bold">
                          {formatCurrency(stats.totalSales)}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="bg-mediumBlue border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {isRTL ? "الطلبات" : "Total Orders"}
                        </p>
                        <h3 className="text-2xl font-bold">
                          {stats.totalOrders}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isRTL ? `${stats.pendingOrders} قيد الانتظار` : `${stats.pendingOrders} pending`}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="bg-mediumBlue border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {isRTL ? "المنتجات" : "Products"}
                        </p>
                        <h3 className="text-2xl font-bold">
                          {stats.totalProducts}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Boxes className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="bg-mediumBlue border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {isRTL ? "نسبة التحويل" : "Conversion Rate"}
                        </p>
                        <h3 className="text-2xl font-bold">
                          {stats.conversionRate}%
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isRTL ? `${stats.totalViews} مشاهدة` : `${stats.totalViews} views`}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="mb-4 bg-darkBlue border border-gray-700">
                <TabsTrigger value="overview">
                  {isRTL ? "نظرة عامة" : "Overview"}
                </TabsTrigger>
                <TabsTrigger value="products">
                  {isRTL ? "المنتجات" : "Products"}
                </TabsTrigger>
                <TabsTrigger value="orders">
                  {isRTL ? "الطلبات" : "Orders"}
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Revenue Chart Card */}
                    <Card className="bg-mediumBlue border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{isRTL ? "إيرادات المبيعات" : "Sales Revenue"}</span>
                          <span className="text-primary">{isRTL ? "هذا الشهر" : "This Month"}</span>
                        </CardTitle>
                        <CardDescription>
                          {isRTL ? "مقارنة بالشهر الماضي" : "Compared to last month"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px] w-full">
                          {/* This is a placeholder for the revenue chart */}
                          <div className="h-full w-full flex items-center justify-center bg-darkBlue rounded-md">
                            <BarChart3 className="h-24 w-24 text-gray-600" />
                            <span className="sr-only">{isRTL ? "مخطط الإيرادات" : "Revenue Chart"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Orders Card */}
                    <Card className="bg-mediumBlue border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{isRTL ? "أحدث الطلبات" : "Recent Orders"}</span>
                          <Button variant="outline" size="sm" className="text-xs h-8" asChild>
                            <Link href="/seller/orders">
                              {isRTL ? "عرض الكل" : "View all"}
                              <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoadingOrders ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : orders && orders.length > 0 ? (
                          <div className="space-y-4">
                            {orders.slice(0, 5).map((order: any) => (
                              <div key={order.id} className="flex items-center justify-between border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                                    <PackageOpen className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">#{order.orderNumber}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(order.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <p className="font-medium">{formatCurrency(order.total)}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {order.itemCount} {isRTL ? "منتج" : "items"}
                                    </p>
                                  </div>
                                  <div>
                                    {getOrderStatusBadge(order.status)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <ShoppingBag className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">
                              {isRTL ? "لا توجد طلبات" : "No Orders Yet"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {isRTL ? "طلباتك ستظهر هنا بمجرد أن يقوم العملاء بالشراء" : "Your orders will appear here once customers make purchases"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {/* Top Products Card */}
                    <Card className="bg-mediumBlue border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {isRTL ? "أكثر المنتجات مبيعاً" : "Top Products"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {stats.topProducts && stats.topProducts.length > 0 ? (
                          <div className="space-y-4">
                            {stats.topProducts.map((product: any, index: number) => (
                              <div key={product.id} className="flex items-start gap-3">
                                <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-800">
                                  {product.imageUrl ? (
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.title} 
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-700">
                                      <Boxes className="h-6 w-6 text-gray-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{product.title}</p>
                                  <p className="text-sm text-primary font-medium">{formatCurrency(product.price)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {isRTL 
                                      ? `${product.salesCount} مبيعات، ${product.views} مشاهدة` 
                                      : `${product.salesCount} sales, ${product.views} views`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Boxes className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">
                              {isRTL ? "لا توجد بيانات كافية" : "No Data Yet"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {isRTL ? "ستظهر أكثر منتجاتك مبيعاً هنا" : "Your top selling products will appear here"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Store Health Card */}
                    <Card className="bg-mediumBlue border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {isRTL ? "صحة المتجر" : "Store Health"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-sm">
                                {isRTL ? "حساب مكتمل" : "Complete Profile"}
                              </span>
                            </div>
                            <Badge className="bg-green-500/20 text-green-500">100%</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-yellow-500" />
                              <span className="text-sm">
                                {isRTL ? "متوسط وقت المعالجة" : "Avg. Processing Time"}
                              </span>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-500">1.5 {isRTL ? "يوم" : "days"}</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-sm">
                                {isRTL ? "دقة الشحن" : "Shipping Accuracy"}
                              </span>
                            </div>
                            <Badge className="bg-green-500/20 text-green-500">98%</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="text-sm">
                                {isRTL ? "نسبة الإرجاع" : "Return Rate"}
                              </span>
                            </div>
                            <Badge className="bg-red-500/20 text-red-500">2%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card className="bg-mediumBlue border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {isRTL ? "إجراءات سريعة" : "Quick Actions"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-darkBlue hover:bg-gray-800" asChild>
                            <Link href="/seller/products/new">
                              <Plus className="h-5 w-5 text-primary" />
                              <span className="text-xs">{isRTL ? "إضافة منتج" : "Add Product"}</span>
                            </Link>
                          </Button>
                          
                          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-darkBlue hover:bg-gray-800" asChild>
                            <Link href="/seller/orders">
                              <ShoppingBag className="h-5 w-5 text-primary" />
                              <span className="text-xs">{isRTL ? "إدارة الطلبات" : "Manage Orders"}</span>
                            </Link>
                          </Button>
                          
                          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-darkBlue hover:bg-gray-800" asChild>
                            <Link href="/seller/analytics">
                              <TrendingUp className="h-5 w-5 text-primary" />
                              <span className="text-xs">{isRTL ? "تحليلات المبيعات" : "Sales Analytics"}</span>
                            </Link>
                          </Button>
                          
                          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-darkBlue hover:bg-gray-800" asChild>
                            <Link href="/seller/settings">
                              <Settings className="h-5 w-5 text-primary" />
                              <span className="text-xs">{isRTL ? "إعدادات المتجر" : "Store Settings"}</span>
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products">
                <Card className="bg-mediumBlue border-gray-700">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <CardTitle>
                        {isRTL ? "إدارة المنتجات" : "Manage Products"}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder={isRTL ? "البحث عن المنتجات..." : "Search products..."}
                            className="pl-9 w-full md:w-[250px] bg-darkBlue"
                          />
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-10 bg-darkBlue">
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">{isRTL ? "تصفية" : "Filter"}</span>
                        </Button>
                        <Button className="bg-primary text-black hover:bg-lime-500" asChild>
                          <Link href="/seller/products/new">
                            <Plus className="h-4 w-4 mr-2" />
                            {isRTL ? "منتج جديد" : "New Product"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProducts ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : products && products.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "المنتج" : "Product"}</th>
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "السعر" : "Price"}</th>
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "المخزون" : "Stock"}</th>
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "المبيعات" : "Sales"}</th>
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "الحالة" : "Status"}</th>
                              <th className="text-right py-3 px-4 font-medium text-sm">{isRTL ? "إجراءات" : "Actions"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product: any) => (
                              <tr key={product.id} className="border-b border-gray-700 last:border-0">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-800">
                                      {product.imageUrl ? (
                                        <img 
                                          src={product.imageUrl} 
                                          alt={product.title} 
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-700">
                                          <Boxes className="h-5 w-5 text-gray-500" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-medium truncate max-w-[200px]">{product.title}</p>
                                      <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">{formatCurrency(product.price)}</td>
                                <td className="py-3 px-4">
                                  <Badge className={product.stock > 10 ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}>
                                    {product.stock}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">{product.salesCount || 0}</td>
                                <td className="py-3 px-4">
                                  <Badge className={product.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}>
                                    {product.isActive ? (isRTL ? "نشط" : "Active") : (isRTL ? "غير نشط" : "Inactive")}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" size="sm" className="h-8 px-2 text-xs" asChild>
                                      <Link href={`/seller/products/edit/${product.id}`}>
                                        {isRTL ? "تعديل" : "Edit"}
                                      </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                      {isRTL ? "حذف" : "Delete"}
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Boxes className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">
                          {isRTL ? "لا توجد منتجات" : "No Products Yet"}
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          {isRTL 
                            ? "لم تقم بإضافة أي منتجات بعد. أضف منتجك الأول لتبدأ في البيع."
                            : "You haven't added any products yet. Add your first product to start selling."}
                        </p>
                        <Button className="bg-primary text-black hover:bg-lime-500" asChild>
                          <Link href="/seller/products/new">
                            <Plus className="h-4 w-4 mr-2" />
                            {isRTL ? "إضافة منتج جديد" : "Add New Product"}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? "إجمالي المنتجات:" : "Total Products:"} {products?.length || 0}
                    </div>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/seller/products">
                          {isRTL ? "عرض كل المنتجات" : "View All Products"}
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card className="bg-mediumBlue border-gray-700">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <CardTitle>
                        {isRTL ? "إدارة الطلبات" : "Manage Orders"}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder={isRTL ? "البحث عن الطلبات..." : "Search orders..."}
                            className="pl-9 w-full md:w-[250px] bg-darkBlue"
                          />
                        </div>
                        <div className="w-[130px]">
                          <Select defaultValue="all">
                            <SelectTrigger className="bg-darkBlue">
                              <SelectValue placeholder={isRTL ? "تصفية حسب" : "Filter by"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{isRTL ? "كل الطلبات" : "All Orders"}</SelectItem>
                              <SelectItem value="pending">{isRTL ? "قيد الانتظار" : "Pending"}</SelectItem>
                              <SelectItem value="processing">{isRTL ? "قيد المعالجة" : "Processing"}</SelectItem>
                              <SelectItem value="shipped">{isRTL ? "تم الشحن" : "Shipped"}</SelectItem>
                              <SelectItem value="delivered">{isRTL ? "تم التسليم" : "Delivered"}</SelectItem>
                              <SelectItem value="cancelled">{isRTL ? "ملغي" : "Cancelled"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingOrders ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "رقم الطلب" : "Order #"}</th>
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "العميل" : "Customer"}</th>
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "التاريخ" : "Date"}</th>
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "المجموع" : "Total"}</th>
                              <th className="text-left py-3 px-4 font-medium text-sm">{isRTL ? "الحالة" : "Status"}</th>
                              <th className="text-right py-3 px-4 font-medium text-sm">{isRTL ? "إجراءات" : "Actions"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order: any) => (
                              <tr key={order.id} className="border-b border-gray-700 last:border-0">
                                <td className="py-3 px-4">
                                  <div className="font-medium">#{order.orderNumber}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <div>{order.customerName}</div>
                                  <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                                </td>
                                <td className="py-3 px-4">
                                  {new Date(order.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-medium">{formatCurrency(order.total)}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {order.itemCount} {isRTL ? "منتج" : "items"}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {getOrderStatusBadge(order.status)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" size="sm" className="h-8 px-2 text-xs" asChild>
                                      <Link href={`/seller/orders/${order.id}`}>
                                        {isRTL ? "عرض" : "View"}
                                      </Link>
                                    </Button>
                                    {order.status === "pending" && (
                                      <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                        {isRTL ? "معالجة" : "Process"}
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">
                          {isRTL ? "لا توجد طلبات" : "No Orders Yet"}
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          {isRTL 
                            ? "لم تتلق أي طلبات بعد. ستظهر الطلبات هنا بمجرد أن يقوم العملاء بالشراء."
                            : "You haven't received any orders yet. Orders will appear here once customers make purchases."}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? "إجمالي الطلبات:" : "Total Orders:"} {orders?.length || 0}
                    </div>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/seller/orders">
                          {isRTL ? "عرض كل الطلبات" : "View All Orders"}
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </SellerLayout>
  );
}