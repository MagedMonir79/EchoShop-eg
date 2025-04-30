import { useContext, useState } from "react";
import { SellerLayout } from "@/components/layout/seller-layout";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Search,
  Filter,
  MoreVertical,
  FileText,
  Truck,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Printer,
  Download,
  Eye,
} from "lucide-react";

// Mock data for orders list
const MOCK_ORDERS = [
  {
    id: "#OR-12345",
    customer: "Ahmed Mohamed",
    email: "ahmed.mohamed@example.com",
    date: "2023-12-08",
    total: 1249.97,
    items: 3,
    status: "delivered",
    paymentStatus: "paid",
  },
  {
    id: "#OR-12346",
    customer: "Sarah Ali",
    email: "sarah.ali@example.com",
    date: "2023-12-07",
    total: 549.99,
    items: 1,
    status: "processing",
    paymentStatus: "paid",
  },
  {
    id: "#OR-12347",
    customer: "Mohamed Hassan",
    email: "mohamed.hassan@example.com",
    date: "2023-12-07",
    total: 899.98,
    items: 2,
    status: "shipped",
    paymentStatus: "paid",
  },
  {
    id: "#OR-12348",
    customer: "Fatima Ahmed",
    email: "fatima.ahmed@example.com",
    date: "2023-12-06",
    total: 1799.97,
    items: 4,
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: "#OR-12349",
    customer: "Omar Ibrahim",
    email: "omar.ibrahim@example.com",
    date: "2023-12-05",
    total: 349.99,
    items: 1,
    status: "cancelled",
    paymentStatus: "refunded",
  },
  {
    id: "#OR-12350",
    customer: "Nour Mahmoud",
    email: "nour.mahmoud@example.com",
    date: "2023-12-04",
    total: 1249.98,
    items: 3,
    status: "delivered",
    paymentStatus: "paid",
  },
];

export default function SellerOrdersPage() {
  const { language, t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const isRTL = language === "ar";
  
  // State for orders list, we'll replace with API data later
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Filter orders based on tab and search
  const filteredOrders = orders.filter(order => {
    // Filter by tab
    if (activeTab === "pending" && order.status !== "pending") return false;
    if (activeTab === "processing" && order.status !== "processing") return false;
    if (activeTab === "shipped" && order.status !== "shipped") return false;
    if (activeTab === "delivered" && order.status !== "delivered") return false;
    if (activeTab === "cancelled" && order.status !== "cancelled") return false;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) || 
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            {t("pending") || "Pending"}
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-500">
            <Package className="mr-1 h-3 w-3" />
            {t("processing") || "Processing"}
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-500">
            <Truck className="mr-1 h-3 w-3" />
            {t("shipped") || "Shipped"}
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t("delivered") || "Delivered"}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500">
            <XCircle className="mr-1 h-3 w-3" />
            {t("cancelled") || "Cancelled"}
          </Badge>
        );
      default:
        return (
          <Badge>
            {status}
          </Badge>
        );
    }
  };

  // Payment Status Badge Component
  const PaymentStatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500">
            {t("paid") || "Paid"}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            {t("pending") || "Pending"}
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-red-500">
            {t("refunded") || "Refunded"}
          </Badge>
        );
      default:
        return (
          <Badge>
            {status}
          </Badge>
        );
    }
  };
  
  // Placeholder functions for actions
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
  };
  
  const handleUpdateOrderStatus = (id: string, newStatus: string) => {
    console.log(`Update order ${id} to status ${newStatus}`);
    // We would call an API here
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };
  
  const handlePrint = (id: string) => {
    console.log(`Print order ${id}`);
  };
  
  return (
    <SellerLayout>
      <div className={`p-6 ${isRTL ? "rtl" : ""}`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {t("orders") || "Orders"}
            </h1>
            <p className="text-muted-foreground">
              {t("manageOrdersDescription") || "Track and manage your customer orders in one place."}
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("exportOrders") || "Export Orders"}
            </Button>
          </div>
        </div>
        
        {/* Tabs and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">
                {t("all") || "All"} 
                <Badge className="ml-2 bg-gray-500">{orders.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t("pending") || "Pending"} 
                <Badge className="ml-2 bg-yellow-500">
                  {orders.filter(o => o.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="processing">
                {t("processing") || "Processing"} 
                <Badge className="ml-2 bg-blue-500">
                  {orders.filter(o => o.status === "processing").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="shipped">
                {t("shipped") || "Shipped"} 
                <Badge className="ml-2 bg-purple-500">
                  {orders.filter(o => o.status === "shipped").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="delivered">
                {t("delivered") || "Delivered"} 
                <Badge className="ml-2 bg-green-500">
                  {orders.filter(o => o.status === "delivered").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                {t("cancelled") || "Cancelled"} 
                <Badge className="ml-2 bg-red-500">
                  {orders.filter(o => o.status === "cancelled").length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("searchOrders") || "Search orders..."}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {t("filter") || "Filter"}
            </Button>
          </div>
        </div>
        
        {/* Orders Table */}
        <Card>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("orderId") || "Order ID"}</TableHead>
                  <TableHead>{t("customer") || "Customer"}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("date") || "Date"}</TableHead>
                  <TableHead>{t("total") || "Total"}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("status") || "Status"}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("paymentStatus") || "Payment"}</TableHead>
                  <TableHead className="text-right">{t("actions") || "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-lg font-medium">
                        {t("noOrdersFound") || "No orders found"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {searchQuery 
                          ? t("tryDifferentSearch") || "Try a different search term" 
                          : t("ordersWillAppearHere") || "New orders will appear here"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{order.customer}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {/* Would convert to EGP currency format */}
                        <div>{`EGP ${order.total.toFixed(2)}`}</div>
                        <div className="text-xs text-muted-foreground">
                          {t("itemsCount", { count: order.items }) || `${order.items} items`}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRTL ? "start" : "end"}>
                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("viewDetails") || "View Details"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(order.id)}>
                              <Printer className="mr-2 h-4 w-4" />
                              {t("printInvoice") || "Print Invoice"}
                            </DropdownMenuItem>
                            
                            {/* Status Update Actions */}
                            {order.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "processing")}>
                                <Package className="mr-2 h-4 w-4" />
                                {t("markProcessing") || "Mark as Processing"}
                              </DropdownMenuItem>
                            )}
                            {order.status === "processing" && (
                              <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "shipped")}>
                                <Truck className="mr-2 h-4 w-4" />
                                {t("markShipped") || "Mark as Shipped"}
                              </DropdownMenuItem>
                            )}
                            {order.status === "shipped" && (
                              <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "delivered")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {t("markDelivered") || "Mark as Delivered"}
                              </DropdownMenuItem>
                            )}
                            {(order.status === "pending" || order.status === "processing") && (
                              <DropdownMenuItem 
                                onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                className="text-red-500 focus:text-red-500"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                {t("markCancelled") || "Cancel Order"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      
      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {t("orderDetails") || "Order Details"} - {selectedOrder.id}
              </DialogTitle>
              <DialogDescription>
                {t("orderDetailsDescription") || "View complete order information"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t("customer") || "Customer"}
                  </h3>
                  <p>{selectedOrder.customer}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t("orderInfo") || "Order Info"}
                  </h3>
                  <p>
                    {t("date") || "Date"}: {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <StatusBadge status={selectedOrder.status} />
                    <PaymentStatusBadge status={selectedOrder.paymentStatus} />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("orderItems") || "Order Items"}
                </h3>
                <p className="text-center text-sm text-muted-foreground py-4">
                  {t("orderItemsPlaceholder") || "Order items will be displayed here"}
                </p>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <div>
                  <h3 className="text-sm font-medium">{t("total") || "Total"}</h3>
                </div>
                <div className="text-xl font-bold">
                  {`EGP ${selectedOrder.total.toFixed(2)}`}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handlePrint(selectedOrder.id)}>
                <Printer className="mr-2 h-4 w-4" />
                {t("printInvoice") || "Print Invoice"}
              </Button>
              <Button onClick={() => setSelectedOrder(null)}>
                {t("close") || "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </SellerLayout>
  );
}