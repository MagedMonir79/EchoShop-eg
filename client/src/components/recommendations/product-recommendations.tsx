import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/auth-context";
import { LanguageContext } from "@/context/language-context";
import ProductCard from "@/components/product/product-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AiOutlineReload } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ProductRecommendations() {
  const { user, userData, isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const isRTL = language === "ar";
  
  // استخدام استعلام لجلب التوصيات
  // Use query to fetch recommendations
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["/api/recommendations/for-user", userData?.id],
    queryFn: async () => {
      const response = await fetch(`/api/recommendations/for-user/${userData?.id}?limit=8`);
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      return await response.json();
    },
    enabled: !!userData?.id
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
          userId: userData?.id,
          productId
        })
      });
    } catch (error) {
      console.error("Failed to log product view:", error);
    }
  };
  
  useEffect(() => {
    // لا تنفذ أي شيء إذا لم يكن هناك مستخدم موثق
    // Don't do anything if there is no authenticated user
    if (!isAuthenticated || !userData) return;
    
    // عند التركيب، نقوم بجلب التوصيات
    // On mount, fetch recommendations
    refetch();
    
    // استمع للتغييرات في موقع المتصفح لتحديث التوصيات
    // Listen for browser location changes to update recommendations
    const handleLocationChange = () => {
      refetch();
    };
    
    window.addEventListener("popstate", handleLocationChange);
    
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [userData, isAuthenticated, refetch]);
  
  if (!isAuthenticated || !userData) {
    return null;
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className={isRTL ? "text-right" : ""}>
            {isRTL ? "موصى به لك" : "Recommended for You"}
          </CardTitle>
          <CardDescription className={isRTL ? "text-right" : ""}>
            {isRTL 
              ? "منتجات تم اختيارها خصيصًا لك بناءً على أذواقك وتفضيلاتك"
              : "Products specially curated for you based on your tastes and preferences"}
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <AiOutlineReload className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isRTL ? "تحديث" : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-[320px] w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-10 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {isRTL 
                ? "عذرًا، لم نتمكن من تحميل التوصيات. يرجى المحاولة مرة أخرى."
                : "Sorry, we couldn't load recommendations. Please try again."}
            </p>
            <Button onClick={() => refetch()}>
              {isRTL ? "إعادة المحاولة" : "Try Again"}
            </Button>
          </div>
        ) : data?.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {isRTL 
                ? "لم نتمكن من العثور على توصيات في الوقت الحالي. تصفح المزيد من المنتجات لتحسين توصياتنا!"
                : "We couldn't find recommendations at the moment. Browse more products to improve our suggestions!"}
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {data?.map((product: any) => (
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