import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/auth-context";
import { LanguageContext } from "@/context/language-context";
import ProductCard from "@/components/product/product-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IoSparklesOutline } from "react-icons/io5";
import { motion } from "framer-motion";

interface NewArrivalsProps {
  limit?: number;
}

export function NewArrivals({ limit = 8 }: NewArrivalsProps) {
  const { userData, isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const isRTL = language === "ar";
  
  // استعلام لجلب المنتجات الجديدة
  // Query to fetch new arrivals
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/products/new-arrivals"],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/products?limit=${limit}`);
        if (!response.ok) {
          throw new Error("Failed to fetch new arrivals");
        }
        const products = await response.json();
        // ترتيب المنتجات حسب تاريخ الإضافة (الأحدث أولاً)
        // Sort products by creation date (newest first)
        return products.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
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
          <IoSparklesOutline className="h-5 w-5 text-blue-500" />
        </div>
        <div className={isRTL ? "ml-auto" : ""}>
          <CardTitle className={isRTL ? "text-right" : ""}>
            {isRTL ? "وصل حديثًا" : "New Arrivals"}
          </CardTitle>
          <CardDescription className={isRTL ? "text-right" : ""}>
            {isRTL 
              ? "أحدث المنتجات المضافة إلى EchoShop"
              : "The latest products added to EchoShop"}
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
                ? "لا توجد منتجات جديدة متاحة في الوقت الحالي"
                : "No new products available at the moment"}
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