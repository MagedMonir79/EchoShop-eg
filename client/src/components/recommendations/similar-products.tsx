import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/auth-context";
import { LanguageContext } from "@/context/language-context";
import ProductCard from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface SimilarProductsProps {
  productId: number;
  categoryId: number;
  sellerId: number;
  limit?: number;
}

export function SimilarProducts({ productId, categoryId, sellerId, limit = 4 }: SimilarProductsProps) {
  const { userData, isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const isRTL = language === "ar";
  
  // استعلام لجلب منتجات مشابهة
  // Query to fetch similar products
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/products/similar", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products?categoryId=${categoryId}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch similar products");
      }
      const products = await response.json();
      // استبعاد المنتج الحالي
      // Exclude current product
      return products.filter((product: any) => product.id !== productId);
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
  
  if (isLoading) {
    return (
      <div>
        <h3 className={`text-xl font-medium mb-4 ${isRTL ? "text-right" : ""}`}>
          {isRTL ? "منتجات مشابهة" : "Similar Products"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array(limit).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-[320px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  if (isError || !data || data.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8">
      <h3 className={`text-xl font-medium mb-4 ${isRTL ? "text-right" : ""}`}>
        {isRTL ? "منتجات مشابهة" : "Similar Products"}
      </h3>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
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
    </div>
  );
}