import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "@/context/language-context";
import ProductCard from "@/components/product/product-card";
import { Product } from "@shared/schema";
import { getProducts } from "@/lib/firebase";

export default function BestSellers() {
  const { t } = useContext(LanguageContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const allProducts = await getProducts();
        // Sort by rating and slice to get top 4
        const bestSellers = [...allProducts]
          .sort((a: any, b: any) => Number(b.rating) - Number(a.rating))
          .slice(0, 4);
        
        setProducts(bestSellers as unknown as Product[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        setLoading(false);
      }
    };
    
    fetchBestSellers();
  }, []);

  // Mock products for development
  const mockProducts = [
    {
      id: 1,
      title: "Ergonomic Laptop Stand",
      price: "49.99",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.9",
      reviewCount: 120,
    },
    {
      id: 2,
      title: "Wireless Mechanical Keyboard",
      price: "89.99",
      imageUrl: "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.7",
      reviewCount: 85,
    },
    {
      id: 3,
      title: "Smart Speaker with Assistant",
      price: "129.99",
      imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.8",
      reviewCount: 210,
    },
    {
      id: 4,
      title: "Fitness Activity Tracker",
      price: "59.99",
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.6",
      reviewCount: 145,
    },
  ];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{t("bestSellers")}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-mediumBlue rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-darkBlue"></div>
                <div className="p-4">
                  <div className="h-4 bg-darkBlue rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-darkBlue rounded w-1/4 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-darkBlue rounded w-1/3"></div>
                    <div className="h-8 w-8 bg-darkBlue rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            // Actual products
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // Mock products for development
            mockProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product as unknown as Product} 
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
