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
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Download,
  Upload,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Mock data for product list
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Smart Watch Pro",
    nameAr: "ساعة ذكية برو",
    image: "https://placehold.co/100x100",
    category: "Electronics",
    price: 799.99,
    stock: 24,
    status: "active",
    created: "2023-12-01",
  },
  {
    id: 2,
    name: "Premium Leather Wallet",
    nameAr: "محفظة جلدية فاخرة",
    image: "https://placehold.co/100x100",
    category: "Fashion",
    price: 149.99,
    stock: 45,
    status: "active",
    created: "2023-12-02",
  },
  {
    id: 3,
    name: "Professional Camera Lens",
    nameAr: "عدسة كاميرا احترافية",
    image: "https://placehold.co/100x100",
    category: "Photography",
    price: 1299.99,
    stock: 12,
    status: "active",
    created: "2023-12-03",
  },
  {
    id: 4,
    name: "Wireless Gaming Headset",
    nameAr: "سماعة ألعاب لاسلكية",
    image: "https://placehold.co/100x100",
    category: "Gaming",
    price: 349.99,
    stock: 0,
    status: "out-of-stock",
    created: "2023-12-04",
  },
  {
    id: 5,
    name: "Organic Skincare Kit",
    nameAr: "مجموعة العناية بالبشرة العضوية",
    image: "https://placehold.co/100x100",
    category: "Beauty",
    price: 249.99,
    stock: 8,
    status: "active",
    created: "2023-12-05",
  },
  {
    id: 6,
    name: "Fitness Tracker Band",
    nameAr: "سوار تتبع اللياقة",
    image: "https://placehold.co/100x100",
    category: "Fitness",
    price: 129.99,
    stock: 0,
    status: "draft",
    created: "2023-12-06",
  },
];

export default function SellerProductsPage() {
  const { language, t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const isRTL = language === "ar";
  
  // State for product list, we'll replace with API data later
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter products based on tab and search
  const filteredProducts = products.filter(product => {
    // Filter by tab
    if (activeTab === "active" && product.status !== "active") return false;
    if (activeTab === "out-of-stock" && product.status !== "out-of-stock") return false;
    if (activeTab === "draft" && product.status !== "draft") return false;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = isRTL ? product.nameAr.toLowerCase() : product.name.toLowerCase();
      return name.includes(query) || product.category.toLowerCase().includes(query);
    }
    
    return true;
  });
  
  // Placeholder functions for actions
  const handleEdit = (id: number) => {
    console.log(`Edit product ${id}`);
  };
  
  const handleDelete = (id: number) => {
    console.log(`Delete product ${id}`);
    // We would call an API here
    setProducts(products.filter(p => p.id !== id));
  };
  
  const handleViewProduct = (id: number) => {
    console.log(`View product ${id}`);
  };
  
  return (
    <SellerLayout>
      <div className={`p-6 ${isRTL ? "rtl" : ""}`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {t("products") || "Products"}
            </h1>
            <p className="text-muted-foreground">
              {t("manageProductsDescription") || "Manage your product inventory, add new items, and monitor stock levels."}
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("addProduct") || "Add Product"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{t("addNewProduct") || "Add New Product"}</DialogTitle>
                  <DialogDescription>
                    {t("addProductDescription") || "Enter the details of your new product below."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* This would be a form with fields for name, description, price, etc. */}
                  <p className="text-center text-muted-foreground">
                    {t("productFormPlaceholder") || "Product form will be implemented here"}
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline">{t("cancel") || "Cancel"}</Button>
                  <Button>{t("save") || "Save"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              {t("import") || "Import"}
            </Button>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("export") || "Export"}
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
                <Badge className="ml-2 bg-gray-500">{products.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active">
                {t("active") || "Active"} 
                <Badge className="ml-2 bg-green-500">
                  {products.filter(p => p.status === "active").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="out-of-stock">
                {t("outOfStock") || "Out of Stock"} 
                <Badge className="ml-2 bg-red-500">
                  {products.filter(p => p.status === "out-of-stock").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="draft">
                {t("draft") || "Draft"} 
                <Badge className="ml-2 bg-yellow-500">
                  {products.filter(p => p.status === "draft").length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("searchProducts") || "Search products..."}
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
        
        {/* Products Table */}
        <Card>
          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("product") || "Product"}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("category") || "Category"}</TableHead>
                    <TableHead>{t("price") || "Price"}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("stock") || "Stock"}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("status") || "Status"}</TableHead>
                    <TableHead className="text-right">{t("actions") || "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-lg font-medium">
                          {t("noProductsFound") || "No products found"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {searchQuery 
                            ? t("tryDifferentSearch") || "Try a different search term" 
                            : t("addYourFirstProduct") || "Start by adding your first product"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={isRTL ? product.nameAr : product.name} 
                              className="h-10 w-10 rounded-md object-cover"
                            />
                            <div>
                              <p className="font-medium">
                                {isRTL ? product.nameAr : product.name}
                              </p>
                              <p className="text-xs text-muted-foreground md:hidden">
                                {product.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.category}
                        </TableCell>
                        <TableCell>
                          {/* Would convert to EGP currency format */}
                          {`EGP ${product.price.toFixed(2)}`}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className={product.stock === 0 ? "text-red-500" : ""}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.status === "active" && (
                            <Badge className="bg-green-500">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              {t("active") || "Active"}
                            </Badge>
                          )}
                          {product.status === "out-of-stock" && (
                            <Badge className="bg-red-500">
                              <XCircle className="mr-1 h-3 w-3" />
                              {t("outOfStock") || "Out of Stock"}
                            </Badge>
                          )}
                          {product.status === "draft" && (
                            <Badge className="bg-yellow-500">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {t("draft") || "Draft"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isRTL ? "start" : "end"}>
                              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t("view") || "View"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t("edit") || "Edit"}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(product.id)}
                                className="text-red-500 focus:text-red-500"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {t("delete") || "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* We only need one TabsContent since we're filtering the same data */}
          <TabsContent value="active" className="m-0">
            <div className="rounded-md border">
              {/* Same Table structure as above */}
            </div>
          </TabsContent>
          
          <TabsContent value="out-of-stock" className="m-0">
            <div className="rounded-md border">
              {/* Same Table structure as above */}
            </div>
          </TabsContent>
          
          <TabsContent value="draft" className="m-0">
            <div className="rounded-md border">
              {/* Same Table structure as above */}
            </div>
          </TabsContent>
        </Card>
      </div>
    </SellerLayout>
  );
}