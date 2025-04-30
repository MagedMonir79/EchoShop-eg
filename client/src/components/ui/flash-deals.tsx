import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "@/context/language-context";
import ProductCard from "@/components/product/product-card";
import { Product } from "@shared/schema";
import { getProducts } from "@/lib/firebase";

export default function FlashDeals() {
  const { t } = useContext(LanguageContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 10,
    minutes: 45,
    seconds: 22,
  });

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        const allProducts = await getProducts();
        // Filter products with discounted price
        const flashDeals = allProducts.filter((product: any) => 
          product.discountedPrice && product.discountedPrice < product.price
        ).slice(0, 4);
        
        setProducts(flashDeals as unknown as Product[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flash deals:", error);
        setLoading(false);
      }
    };
    
    fetchFlashDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft.seconds > 0) {
        setTimeLeft({
          ...timeLeft,
          seconds: timeLeft.seconds - 1,
        });
      } else if (timeLeft.minutes > 0) {
        setTimeLeft({
          ...timeLeft,
          minutes: timeLeft.minutes - 1,
          seconds: 59,
        });
      } else if (timeLeft.hours > 0) {
        setTimeLeft({
          hours: timeLeft.hours - 1,
          minutes: 59,
          seconds: 59,
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Mock data for development
  const mockProducts = [
    {
      id: 1,
      title: "Wireless Headphones",
      price: "99.99",
      discountedPrice: "59.99",
      imageUrl: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.8",
    },
    {
      id: 2,
      title: "Smart Watch Series 6",
      price: "299.99",
      discountedPrice: "195.99",
      imageUrl: "https://images.unsplash.com/photo-1591370874773-6702dcc9c22c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.9",
    },
    {
      id: 3,
      title: "4K Streaming Camera",
      price: "129.99",
      discountedPrice: "64.99",
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.7",
    },
    {
      id: 4,
      title: "Gaming Controller PRO",
      price: "79.99",
      discountedPrice: "59.99",
      imageUrl: "https://images.unsplash.com/photo-1600186279172-fddCC51dADRe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.5",
    },
  ];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t("flashDeals")}</h2>
          <div className="flex items-center gap-2 bg-mediumBlue rounded-lg px-4 py-2">
            <span className="text-primary font-bold">{t("endsIn")}:</span>
            <div className="bg-darkBlue px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</div> :
            <div className="bg-darkBlue px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</div> :
            <div className="bg-darkBlue px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-mediumBlue rounded-lg overflow-hidden animate-pulse">
                <div className="h-44 bg-darkBlue"></div>
                <div className="p-4">
                  <div className="h-4 bg-darkBlue rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-darkBlue rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-darkBlue rounded w-1/4"></div>
                    <div className="h-8 w-8 bg-darkBlue rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            // Actual products
            products.map((product) => (
              <ProductCard key={product.id} product={product} isFlashDeal />
            ))
          ) : (
            // Mock products for development
            mockProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product as unknown as Product} 
                isFlashDeal 
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
