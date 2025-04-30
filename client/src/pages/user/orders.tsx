import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { LanguageContext } from "@/context/language-context";
import UserDashboardLayout from "@/components/layout/user-dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown,
  Truck, 
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  number: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  paymentMethod: string;
}

interface UserOrdersProps {
  id?: string;
}

export default function UserOrders() {
  const { language, t } = useContext(LanguageContext);
  const isRTL = language === "ar";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [match, params] = useRoute<{ id: string }>("/user/orders/:id");
  
  // Get the order ID from the URL params if it exists
  const orderId = match ? params.id : undefined;
  
  // Fetch order data
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/user/orders"],
    queryFn: async () => {
      // Mock data for UI demo
      return [
        {
          id: "1",
          number: "ECH-1001",
          date: "2023-12-20",
          total: 249.99,
          status: "delivered",
          items: 3,
          paymentMethod: "Credit Card"
        },
        {
          id: "2",
          number: "ECH-1002",
          date: "2023-12-15",
          total: 124.50,
          status: "shipped",
          items: 2,
          paymentMethod: "PayPal"
        },
        {
          id: "3",
          number: "ECH-1003",
          date: "2023-12-10",
          total: 85.75,
          status: "processing",
          items: 1,
          paymentMethod: "Credit Card"
        },
        {
          id: "4",
          number: "ECH-1004",
          date: "2023-12-05",
          total: 199.99,
          status: "cancelled",
          items: 2,
          paymentMethod: "Credit Card"
        },
        {
          id: "5",
          number: "ECH-1005",
          date: "2023-12-01",
          total: 349.50,
          status: "delivered",
          items: 4,
          paymentMethod: "PayPal"
        },
        {
          id: "6",
          number: "ECH-1006",
          date: "2023-11-25",
          total: 279.99,
          status: "pending",
          items: 3,
          paymentMethod: "Bank Transfer"
        },
      ];
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isRTL ? 'ar-EG' : 'en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Filter and sort logic
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = order.number.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(order.status);
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort logic
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "price-high") {
      return b.total - a.total;
    } else {
      return a.total - b.total;
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string, icon: JSX.Element, label: string }> = {
      pending: { 
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500", 
        icon: <Clock className="h-4 w-4 mr-1" />,
        label: isRTL ? "قيد الانتظار" : "Pending"
      },
      processing: { 
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500", 
        icon: <Package className="h-4 w-4 mr-1" />,
        label: isRTL ? "قيد المعالجة" : "Processing"
      },
      shipped: { 
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500", 
        icon: <Truck className="h-4 w-4 mr-1" />,
        label: isRTL ? "تم الشحن" : "Shipped"
      },
      delivered: { 
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500", 
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
        label: isRTL ? "تم التسليم" : "Delivered"
      },
      cancelled: { 
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500", 
        icon: <XCircle className="h-4 w-4 mr-1" />,
        label: isRTL ? "ملغي" : "Cancelled"
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge variant="outline" className={`flex items-center ${config.color}`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Order tabs counters
  const orderCountByStatus = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  return (
    <UserDashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isRTL ? "طلباتي" : "My Orders"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isRTL ? "تتبع ومراجعة كل طلباتك السابقة." : "Track and review all your previous orders."}
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6"
        >
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={isRTL ? "البحث برقم الطلب" : "Search by order number"}
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  {isRTL ? "حالة الطلب" : "Order Status"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, status]);
                      } else {
                        setStatusFilter(statusFilter.filter(s => s !== status));
                      }
                    }}
                  >
                    {isRTL ? {
                      pending: "قيد الانتظار",
                      processing: "قيد المعالجة",
                      shipped: "تم الشحن",
                      delivered: "تم التسليم",
                      cancelled: "ملغي"
                    }[status] : {
                      pending: "Pending",
                      processing: "Processing",
                      shipped: "Shipped",
                      delivered: "Delivered",
                      cancelled: "Cancelled"
                    }[status]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isRTL ? "ترتيب حسب" : "Sort by"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{isRTL ? "الأحدث أولاً" : "Newest First"}</SelectItem>
                <SelectItem value="oldest">{isRTL ? "الأقدم أولاً" : "Oldest First"}</SelectItem>
                <SelectItem value="price-high">{isRTL ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</SelectItem>
                <SelectItem value="price-low">{isRTL ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Orders Tab Section */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all">
            <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800/50 p-1">
              <TabsTrigger value="all">
                {isRTL ? "الكل" : "All"} ({orderCountByStatus.all})
              </TabsTrigger>
              <TabsTrigger value="processing">
                {isRTL ? "قيد المعالجة" : "Processing"} ({orderCountByStatus.processing})
              </TabsTrigger>
              <TabsTrigger value="shipped">
                {isRTL ? "تم الشحن" : "Shipped"} ({orderCountByStatus.shipped})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                {isRTL ? "تم التسليم" : "Delivered"} ({orderCountByStatus.delivered})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {isRTL ? "جميع الطلبات" : "All Orders"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {isRTL ? "لم يتم العثور على طلبات" : "No Orders Found"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {isRTL 
                          ? "لم نتمكن من العثور على أي طلبات مطابقة لفلاترك. جرب تعديل معايير البحث." 
                          : "We couldn't find any orders matching your filters. Try adjusting your search criteria."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          whileHover={{ 
                            y: -2, 
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" 
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {isRTL ? `طلب #${order.number}` : `Order #${order.number}`}
                                  </h3>
                                  {getStatusBadge(order.status)}
                                </div>
                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  <div>{formatDate(order.date)}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span>{order.items} {isRTL ? "منتج(ات)" : "item(s)"}</span>
                                    <span>•</span>
                                    <span>{isRTL ? "الدفع: " : "Payment: "}{order.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                              <div className="text-right">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  ${order.total.toFixed(2)}
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="ml-4">
                                {isRTL ? "التفاصيل" : "Details"} <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="processing">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {isRTL ? "الطلبات قيد المعالجة" : "Processing Orders"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Similar content to "all" tab but filtered for processing */}
                  {/* For brevity, showing placeholder content */}
                  <div className="space-y-4">
                    {filteredOrders
                      .filter(order => order.status === "processing")
                      .map((order) => (
                        <motion.div
                          key={order.id}
                          whileHover={{ 
                            y: -2, 
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" 
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {isRTL ? `طلب #${order.number}` : `Order #${order.number}`}
                                  </h3>
                                  {getStatusBadge(order.status)}
                                </div>
                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  <div>{formatDate(order.date)}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span>{order.items} {isRTL ? "منتج(ات)" : "item(s)"}</span>
                                    <span>•</span>
                                    <span>{isRTL ? "الدفع: " : "Payment: "}{order.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                              <div className="text-right">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  ${order.total.toFixed(2)}
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="ml-4">
                                {isRTL ? "التفاصيل" : "Details"} <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tab contents would be similar */}
            <TabsContent value="shipped">
              {/* Shipped orders tab content */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {isRTL ? "الطلبات التي تم شحنها" : "Shipped Orders"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Content would be similar to "all" tab but filtered for shipped */}
                  {/* This is a placeholder for brevity */}
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    {isRTL 
                      ? "يعرض هذا القسم جميع الطلبات التي تم شحنها ولكنها لم تصل بعد."
                      : "This section shows all orders that have been shipped but not yet delivered."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivered">
              {/* Delivered orders tab content */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {isRTL ? "الطلبات التي تم تسليمها" : "Delivered Orders"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Content would be similar to "all" tab but filtered for delivered */}
                  {/* This is a placeholder for brevity */}
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    {isRTL 
                      ? "يعرض هذا القسم جميع الطلبات التي تم تسليمها بنجاح."
                      : "This section shows all orders that have been successfully delivered."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </UserDashboardLayout>
  );
}