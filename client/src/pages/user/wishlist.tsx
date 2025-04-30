import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { LanguageContext } from "@/context/language-context";
import UserDashboardLayout from "@/components/layout/user-dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Search, 
  ShoppingCart, 
  Trash2, 
  Star, 
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  dateAdded: string;
  category: string;
}

export default function UserWishlist() {
  const { language, t } = useContext(LanguageContext);
  const isRTL = language === "ar";
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Fetch wishlist data
  const { data: wishlistItems = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["/api/user/wishlist"],
    queryFn: async () => {
      // Mock data for UI demo
      return [
        {
          id: "1",
          productId: "p101",
          name: "Premium Wireless Headphones",
          nameAr: "سماعات رأس لاسلكية ممتازة",
          description: "High-quality noise-canceling wireless headphones with 40-hour battery life",
          descriptionAr: "سماعات رأس لاسلكية عالية الجودة مع خاصية إلغاء الضوضاء وعمر بطارية 40 ساعة",
          price: 249.99,
          discountPrice: 199.99,
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          rating: 4.8,
          reviewCount: 256,
          inStock: true,
          dateAdded: "2023-12-10",
          category: "electronics"
        },
        {
          id: "2",
          productId: "p102",
          name: "Smart Fitness Watch",
          nameAr: "ساعة لياقة ذكية",
          description: "Track your fitness and health with this advanced smartwatch",
          descriptionAr: "تتبع لياقتك وصحتك بهذه الساعة الذكية المتقدمة",
          price: 179.99,
          discountPrice: 149.99,
          imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          rating: 4.6,
          reviewCount: 187,
          inStock: true,
          dateAdded: "2023-12-05",
          category: "electronics"
        },
        {
          id: "3",
          productId: "p103",
          name: "Genuine Leather Wallet",
          nameAr: "محفظة جلدية أصلية",
          description: "Handcrafted genuine leather wallet with RFID protection",
          descriptionAr: "محفظة جلدية أصلية مصنوعة يدويًا مع حماية RFID",
          price: 59.99,
          imageUrl: "https://images.unsplash.com/photo-1606422713885-38107c3596b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          rating: 4.5,
          reviewCount: 142,
          inStock: true,
          dateAdded: "2023-11-28",
          category: "fashion"
        },
        {
          id: "4",
          productId: "p104",
          name: "Portable Bluetooth Speaker",
          nameAr: "سماعة بلوتوث محمولة",
          description: "Waterproof portable speaker with 24-hour playtime",
          descriptionAr: "سماعة محمولة مقاومة للماء مع وقت تشغيل 24 ساعة",
          price: 89.99,
          discountPrice: 69.99,
          imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          rating: 4.7,
          reviewCount: 209,
          inStock: false,
          dateAdded: "2023-11-20",
          category: "electronics"
        },
        {
          id: "5",
          productId: "p105",
          name: "Scented Soy Candle Set",
          nameAr: "مجموعة شموع الصويا المعطرة",
          description: "Set of 3 hand-poured scented soy candles in relaxing fragrances",
          descriptionAr: "مجموعة من 3 شموع صويا معطرة مصبوبة يدويًا بروائح مريحة",
          price: 34.99,
          imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          rating: 4.9,
          reviewCount: 78,
          inStock: true,
          dateAdded: "2023-11-15",
          category: "home"
        },
        {
          id: "6",
          productId: "p106",
          name: "Ceramic Plant Pot Set",
          nameAr: "مجموعة أواني نباتات سيراميك",
          description: "Set of 4 minimalist ceramic plant pots in various sizes",
          descriptionAr: "مجموعة من 4 أواني نباتات سيراميك بتصميم بسيط بأحجام مختلفة",
          price: 49.99,
          discountPrice: 39.99,
          imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          rating: 4.4,
          reviewCount: 56,
          inStock: true,
          dateAdded: "2023-11-10",
          category: "home"
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

  // Filter and sort logic
  const filteredItems = wishlistItems.filter(item => {
    // Search filter
    const searchFields = [
      language === "ar" && item.nameAr ? item.nameAr : item.name,
      language === "ar" && item.descriptionAr ? item.descriptionAr : item.description,
    ].join(' ').toLowerCase();
    
    const matchesSearch = searchTerm === "" || searchFields.includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Sort logic
    if (sortBy === "newest") {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    } else if (sortBy === "price-high") {
      return (b.discountPrice || b.price) - (a.discountPrice || a.price);
    } else if (sortBy === "price-low") {
      return (a.discountPrice || a.price) - (b.discountPrice || b.price);
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      return 0;
    }
  });

  // Get unique categories from items
  const uniqueCategories = Array.from(new Set(wishlistItems.map(item => item.category)));
  const categories = ["all", ...uniqueCategories];

  // Add to cart handler
  const handleAddToCart = (itemId: string) => {
    toast({
      title: isRTL ? "تمت الإضافة إلى السلة" : "Added to Cart",
      description: isRTL ? "تمت إضافة المنتج إلى سلة التسوق الخاصة بك." : "The product has been added to your cart.",
    });
  };

  // Remove from wishlist handler
  const handleRemoveFromWishlist = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete handler
  const confirmDelete = () => {
    if (itemToDelete) {
      // In a real app, this would make an API call
      toast({
        title: isRTL ? "تمت الإزالة من المفضلة" : "Removed from Wishlist",
        description: isRTL ? "تمت إزالة المنتج من قائمة المفضلة الخاصة بك." : "The product has been removed from your wishlist.",
      });
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
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
            {isRTL ? "قائمة المفضلة" : "My Wishlist"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isRTL 
              ? "حفظ منتجاتك المفضلة لاستعراضها لاحقًا أو لإضافتها إلى سلة التسوق." 
              : "Save your favorite products to review later or add to your cart."}
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={isRTL ? "البحث في المفضلة" : "Search in wishlist"}
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isRTL ? "التصنيف" : "Category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" 
                      ? (isRTL ? "جميع التصنيفات" : "All Categories")
                      : (isRTL ? (
                          category === "electronics" ? "إلكترونيات" :
                          category === "fashion" ? "أزياء" :
                          category === "home" ? "منزل" :
                          category === "beauty" ? "جمال" :
                          category
                        ) : (
                          category === "electronics" ? "Electronics" :
                          category === "fashion" ? "Fashion" :
                          category === "home" ? "Home & Garden" :
                          category === "beauty" ? "Beauty" :
                          category
                        ))
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isRTL ? "ترتيب حسب" : "Sort by"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{isRTL ? "الأحدث أولاً" : "Newest First"}</SelectItem>
                <SelectItem value="oldest">{isRTL ? "الأقدم أولاً" : "Oldest First"}</SelectItem>
                <SelectItem value="price-high">{isRTL ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</SelectItem>
                <SelectItem value="price-low">{isRTL ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</SelectItem>
                <SelectItem value="rating">{isRTL ? "التقييم" : "Rating"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Wishlist Items Grid */}
        <motion.div variants={itemVariants}>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 text-center py-12">
              <CardContent>
                <Heart className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {isRTL ? "قائمة المفضلة فارغة" : "Your wishlist is empty"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {isRTL 
                    ? "لم تقم بإضافة أي منتجات إلى قائمة المفضلة الخاصة بك بعد. استعرض منتجاتنا واضغط على أيقونة القلب لإضافتها هنا."
                    : "You haven't added any products to your wishlist yet. Browse our products and click the heart icon to add them here."}
                </p>
                <Button className="bg-primary text-white">
                  {isRTL ? "تسوق الآن" : "Shop Now"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Card className="overflow-hidden bg-white dark:bg-gray-800 h-full flex flex-col">
                    <div className="relative pb-[56.25%] overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={language === "ar" && item.nameAr ? item.nameAr : item.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full h-8 w-8 p-0"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {!item.inStock && (
                        <Badge 
                          variant="destructive" 
                          className="absolute top-2 left-2"
                        >
                          {isRTL ? "غير متوفر" : "Out of Stock"}
                        </Badge>
                      )}
                      {item.discountPrice && (
                        <Badge 
                          className="absolute bottom-2 left-2 bg-green-600"
                        >
                          {Math.round((1 - item.discountPrice / item.price) * 100)}% {isRTL ? "خصم" : "OFF"}
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {language === "ar" && item.nameAr ? item.nameAr : item.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm font-medium">{item.rating.toFixed(1)}</span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.reviewCount} {isRTL ? "تقييمات" : "reviews"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === "ar" && item.descriptionAr ? item.descriptionAr : item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4">
                      <div>
                        {item.discountPrice ? (
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ${item.discountPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddToCart(item.id)}
                        disabled={!item.inStock}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isRTL ? "أضف للسلة" : "Add to Cart"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isRTL ? "تأكيد الإزالة" : "Confirm Removal"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Separator className="mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {isRTL 
                  ? "هل أنت متأكد من أنك تريد إزالة هذا المنتج من قائمة المفضلة؟"
                  : "Are you sure you want to remove this product from your wishlist?"}
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                >
                  {isRTL ? "إزالة" : "Remove"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UserDashboardLayout>
  );
}