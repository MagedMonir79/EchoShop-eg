import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import AdminLayout from "@/components/layout/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleUser, ShoppingBag, DollarSign, TrendingUp, Package } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { t, language } = useContext(LanguageContext);
  const { user, userData } = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Check if user is admin
    if (user && userData && userData.role !== "admin") {
      toast({
        title: t("accessDenied"),
        description: t("adminOnly"),
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, userData, navigate, toast, t]);
  
  // Mock data for charts
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 7000 },
    { name: "May", sales: 5000 },
    { name: "Jun", sales: 6000 },
    { name: "Jul", sales: 8000 },
  ];
  
  const categoryData = [
    { name: t("electronics"), value: 35 },
    { name: t("fashion"), value: 25 },
    { name: t("home"), value: 18 },
    { name: t("beauty"), value: 12 },
    { name: t("toys"), value: 10 },
  ];
  
  const recentOrders = [
    { id: "ORD001", customer: "Ahmed Ali", product: "Wireless Headphones", amount: "$159.99", status: "Delivered" },
    { id: "ORD002", customer: "Sara Khan", product: "Smart Watch", amount: "$89.99", status: "Processing" },
    { id: "ORD003", customer: "Mohammed Hassan", product: "Laptop Stand", amount: "$29.99", status: "Shipped" },
    { id: "ORD004", customer: "Layla Mahmoud", product: "Fitness Tracker", amount: "$49.99", status: "Pending" },
    { id: "ORD005", customer: "Omar Ibrahim", product: "Bluetooth Speaker", amount: "$79.99", status: "Delivered" },
  ];
  
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">{t("dashboard")}</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-mediumBlue border-0">
          <CardContent className="p-6 flex items-center">
            <div className="p-4 bg-blue-900 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">{t("totalRevenue")}</p>
              <h3 className="text-2xl font-bold">$24,589</h3>
              <p className="text-sm text-success">+12.5% {t("fromLastMonth")}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-mediumBlue border-0">
          <CardContent className="p-6 flex items-center">
            <div className="p-4 bg-blue-900 rounded-full">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">{t("totalOrders")}</p>
              <h3 className="text-2xl font-bold">1,256</h3>
              <p className="text-sm text-success">+8.2% {t("fromLastMonth")}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-mediumBlue border-0">
          <CardContent className="p-6 flex items-center">
            <div className="p-4 bg-blue-900 rounded-full">
              <CircleUser className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">{t("totalCustomers")}</p>
              <h3 className="text-2xl font-bold">854</h3>
              <p className="text-sm text-success">+5.3% {t("fromLastMonth")}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-mediumBlue border-0">
          <CardContent className="p-6 flex items-center">
            <div className="p-4 bg-blue-900 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">{t("totalProducts")}</p>
              <h3 className="text-2xl font-bold">512</h3>
              <p className="text-sm text-success">+15.7% {t("fromLastMonth")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-mediumBlue border-0">
          <CardHeader>
            <CardTitle>{t("monthlySales")}</CardTitle>
            <CardDescription>{t("monthlySalesDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#a3e635"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-mediumBlue border-0">
          <CardHeader>
            <CardTitle>{t("categorySales")}</CardTitle>
            <CardDescription>{t("categorySalesDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card className="bg-mediumBlue border-0">
        <CardHeader>
          <CardTitle>{t("recentOrders")}</CardTitle>
          <CardDescription>{t("recentOrdersDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("orderId")}</TableHead>
                <TableHead>{t("customer")}</TableHead>
                <TableHead>{t("product")}</TableHead>
                <TableHead>{t("amount")}</TableHead>
                <TableHead>{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered" ? "bg-success/20 text-success" :
                      order.status === "Processing" ? "bg-blue-500/20 text-blue-500" :
                      order.status === "Shipped" ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
