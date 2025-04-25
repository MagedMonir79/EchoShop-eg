import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "@/context/language-context";
import ProductCard from "@/components/product/product-card";
import { Product } from "@shared/schema";
import { getProducts } from "@/lib/firebase";

interface ProductGridProps {
  categoryId?: string;
  limit?: number;
}

export default function ProductGrid({ categoryId, limit }: ProductGridProps) {
  const { t } = useContext(LanguageContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let fetchedProducts;
        
        if (categoryId) {
          // Fetch products by category if categoryId is provided
          const categoryProducts = await getProducts(); // Replace with getProductsByCategory when API is ready
          fetchedProducts = categoryProducts.filter((p: any) => p.categoryId === categoryId);
        } else {
          // Fetch all products
          fetchedProducts = await getProducts();
        }
        
        // Apply limit if specified
        if (limit && fetchedProducts.length > limit) {
          fetchedProducts = fetchedProducts.slice(0, limit);
        }
        
        setProducts(fetchedProducts as unknown as Product[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryId, limit]);

  // Mock products for development
  const mockProducts = [
    {
      id: 1,
      title: "Wireless Noise-Cancelling Headphones",
      price: "299.99",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.8",
      reviewCount: 156,
    },
    {
      id: 2,
      title: "Smart Watch with Heart Rate Monitor",
      price: "199.99",
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.7",
      reviewCount: 98,
    },
    {
      id: 3,
      title: "4K Ultra HD Smart TV",
      price: "899.99",
      imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.9",
      reviewCount: 210,
    },
    {
      id: 4,
      title: "Mechanical Gaming Keyboard",
      price: "149.99",
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.6",
      reviewCount: 87,
    },
    {
      id: 5,
      title: "Wireless Charging Pad",
      price: "39.99",
      imageUrl: "https://images.unsplash.com/photo-1585338107307-bdd4ea99a9af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.5",
      reviewCount: 63,
    },
    {
      id: 6,
      title: "Bluetooth Portable Speaker",
      price: "79.99",
      imageUrl: "https://images.unsplash.com/photo-1578319822487-24a648dc759e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: "4.7",
      reviewCount: 104,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading ? (
        // Loading skeletons
        Array(limit || 8).fill(0).map((_, index) => (
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
  );
}
