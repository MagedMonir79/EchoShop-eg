import { useState, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { LanguageContext } from "@/context/language-context";
import { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Package, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Loader2,
  Check,
  X
} from "lucide-react";

const productSchema = z.object({
  title: z.string().min(3, {
    message: "العنوان يجب أن يكون على الأقل 3 أحرف",
  }),
  titleAr: z.string().min(3, {
    message: "العنوان بالعربية يجب أن يكون على الأقل 3 أحرف",
  }),
  description: z.string().min(10, {
    message: "الوصف يجب أن يكون على الأقل 10 أحرف",
  }),
  descriptionAr: z.string().min(10, {
    message: "الوصف بالعربية يجب أن يكون على الأقل 10 أحرف",
  }),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "السعر يجب أن يكون رقم موجب",
  }),
  discountedPrice: z.string().optional().refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), {
    message: "السعر المخفض يجب أن يكون رقم موجب",
  }),
  imageUrl: z.string().url({
    message: "يجب إدخال رابط صورة صالح",
  }),
  categoryId: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "يجب اختيار فئة",
  }),
  sellerId: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "يجب اختيار بائع",
  }),
  supplierId: z.string().optional().refine((val) => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0), {
    message: "يجب اختيار مورد صالح",
  }),
  inventory: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "المخزون يجب أن يكون رقم موجب أو صفر",
  }),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminProducts() {
  const { t } = useContext(LanguageContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  
  // Fetch products
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      toast({
        title: t("productDeleted"),
        description: t("productDeletedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error) => {
      toast({
        title: t("error"),
        description: t("productDeleteFailed"),
        variant: "destructive",
      });
    },
  });
  
  // Create or update product mutation
  const productMutation = useMutation({
    mutationFn: (data: ProductFormValues) => {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        discountedPrice: data.discountedPrice ? parseFloat(data.discountedPrice) : undefined,
        categoryId: parseInt(data.categoryId),
        sellerId: parseInt(data.sellerId),
        supplierId: data.supplierId ? parseInt(data.supplierId) : undefined,
        inventory: parseInt(data.inventory),
      };
      
      if (selectedProduct) {
        return apiRequest("PUT", `/api/products/${selectedProduct.id}`, payload);
      } else {
        return apiRequest("POST", "/api/products", payload);
      }
    },
    onSuccess: () => {
      setIsFormDialogOpen(false);
      toast({
        title: selectedProduct ? t("productUpdated") : t("productCreated"),
        description: selectedProduct ? t("productUpdatedSuccess") : t("productCreatedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error) => {
      toast({
        title: t("error"),
        description: selectedProduct ? t("productUpdateFailed") : t("productCreateFailed"),
        variant: "destructive",
      });
    },
  });
  
  // Setup form with react-hook-form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: selectedProduct?.title || "",
      titleAr: selectedProduct?.titleAr || "",
      description: selectedProduct?.description || "",
      descriptionAr: selectedProduct?.descriptionAr || "",
      price: selectedProduct?.price?.toString() || "",
      discountedPrice: selectedProduct?.discountedPrice?.toString() || "",
      imageUrl: selectedProduct?.imageUrl || "",
      categoryId: selectedProduct?.categoryId?.toString() || "",
      sellerId: selectedProduct?.sellerId?.toString() || "",
      supplierId: selectedProduct?.supplierId?.toString() || "",
      inventory: selectedProduct?.inventory?.toString() || "0",
      isActive: selectedProduct?.isActive ?? true,
    },
  });
  
  // Reset form when selectedProduct changes
  React.useEffect(() => {
    if (isFormDialogOpen) {
      form.reset({
        title: selectedProduct?.title || "",
        titleAr: selectedProduct?.titleAr || "",
        description: selectedProduct?.description || "",
        descriptionAr: selectedProduct?.descriptionAr || "",
        price: selectedProduct?.price?.toString() || "",
        discountedPrice: selectedProduct?.discountedPrice?.toString() || "",
        imageUrl: selectedProduct?.imageUrl || "",
        categoryId: selectedProduct?.categoryId?.toString() || "",
        sellerId: selectedProduct?.sellerId?.toString() || "",
        supplierId: selectedProduct?.supplierId?.toString() || "",
        inventory: selectedProduct?.inventory?.toString() || "0",
        isActive: selectedProduct?.isActive ?? true,
      });
    }
  }, [selectedProduct, isFormDialogOpen, form]);
  
  // Open form dialog for creating or editing
  const openFormDialog = (product: Product | null = null) => {
    setSelectedProduct(product);
    setIsFormDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    productMutation.mutate(data);
  };
  
  // Filter products by search term
  const filteredProducts = products?.filter((product) => {
    const searchLower = search.toLowerCase();
    return (
      product.title.toLowerCase().includes(searchLower) ||
      (product.titleAr && product.titleAr.includes(search)) ||
      product.description.toLowerCase().includes(searchLower) ||
      (product.descriptionAr && product.descriptionAr.includes(search))
    );
  });
  
  return (
    <AdminLayout>
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{t("products")}</CardTitle>
              <CardDescription>{t("manageProducts")}</CardDescription>
            </div>
            <Button onClick={() => openFormDialog()} className="bg-primary text-black hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              {t("addProduct")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder={t("searchProducts")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center py-12 text-red-500">
              <p>{t("errorLoadingProducts")}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableCaption>{t("productsList")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t("productName")}</TableHead>
                    <TableHead>{t("price")}</TableHead>
                    <TableHead>{t("category")}</TableHead>
                    <TableHead>{t("inventory")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                              {product.imageUrl ? (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.title} 
                                  className="h-full w-full object-cover" 
                                />
                              ) : (
                                <Package className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div>{product.title}</div>
                              <div className="text-sm text-gray-500">{product.titleAr}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.discountedPrice ? (
                            <div>
                              <span className="text-green-600 font-semibold">${product.discountedPrice}</span>
                              <span className="text-gray-400 line-through text-sm ml-2">${product.price}</span>
                            </div>
                          ) : (
                            <span>${product.price}</span>
                          )}
                        </TableCell>
                        <TableCell>Category {product.categoryId}</TableCell>
                        <TableCell>{product.inventory}</TableCell>
                        <TableCell>
                          {product.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <Check className="h-3 w-3 mr-1" />
                              {t("active")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                              <X className="h-3 w-3 mr-1" />
                              {t("inactive")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("openMenu")}</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openFormDialog(product)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(product)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-32">
                        {search ? t("noProductsMatchSearch") : t("noProductsFound")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Product Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? t("editProduct") : t("addProduct")}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct ? t("editProductDescription") : t("addProductDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("productNameEn")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("productNameEnPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="titleAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("productNameAr")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("productNameArPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("descriptionEn")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("descriptionEnPlaceholder")} 
                          {...field} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("descriptionAr")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("descriptionArPlaceholder")} 
                          {...field} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("price")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("discountedPrice")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>{t("leaveEmptyForNoDiscount")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("imageUrl")}</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("category")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sellerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("seller")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("supplier")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>{t("optionalSupplier")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("inventory")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 p-4 border rounded-md">
                      <div className="space-y-0.5">
                        <FormLabel>{t("active")}</FormLabel>
                        <FormDescription>{t("activateProduct")}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsFormDialogOpen(false)}
                  className="mr-2"
                >
                  {t("cancel")}
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary text-black hover:bg-primary/90"
                  disabled={productMutation.isPending}
                >
                  {productMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {selectedProduct ? t("updateProduct") : t("createProduct")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDelete")}</DialogTitle>
            <DialogDescription>
              {t("deleteProductConfirmation", { product: selectedProduct?.title })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="mr-2"
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedProduct && deleteMutation.mutate(selectedProduct.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}