import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/auth-context";
import { LanguageContext } from "@/context/language-context";
import ProductCard from "@/components/product/product-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

interface TrendingProductsProps {
  limit?: number;
}

export function TrendingProducts({ limit = 8 }: TrendingProductsProps) {
  const { userData, isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const isRTL = language === "ar";
  
  // استعلام لجلب المنتجات الرائجة
  // Query to fetch trending products
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/products/trending"],
    queryFn: async () => {
      // يمكننا استخدام الخدمة الخاصة بنا إذا كان متاحًا، وإلا سنستخدم المنتجات مرتبة حسب التقييم
      // We can use our specialized service if available, otherwise use products sorted by rating
      try {
        const response = await fetch(`/api/products?limit=${limit}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trending products");
        }
        const products = await response.json();
        // ترتيب المنتجات حسب التقييم للحصول على "الأكثر رواجًا"
        // Sort products by rating to get "trending"
        return products.sort((a: any, b: any) => b.rating - a.rating);
      } catch (error) {
        console.error("Error fetching trending products:", error);
        return [];
      }
    }
  });
  
  // تسجيل مشاهدة المنتج عند النقر عليه
  // Log product view when clicked
  const logProductView = async (productId: number) => {
    try {
      await fetch("/api/analytics/product-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userData?.id || null,
          productId
        })
      });
    } catch (error) {
      console.error("Failed to log product view:", error);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center">
        <div className={isRTL ? "mr-auto" : "mr-2"}>
          <FiTrendingUp className="h-5 w-5 text-orange-500" />
        </div>
        <div className={isRTL ? "ml-auto" : ""}>
          <CardTitle className={isRTL ? "text-right" : ""}>
            {isRTL ? "المنتجات الرائجة" : "Trending Products"}
          </CardTitle>
          <CardDescription className={isRTL ? "text-right" : ""}>
            {isRTL 
              ? "المنتجات الأكثر شعبية حاليًا على EchoShop"
              : "Most popular products right now on EchoShop"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(limit).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-[320px] w-full rounded-lg" />
            ))}
          </div>
        ) : isError || !data || data.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {isRTL 
                ? "لا توجد منتجات رائجة في الوقت الحالي"
                : "No trending products available at the moment"}
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {data.map((product: any) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => logProductView(product.id)}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}