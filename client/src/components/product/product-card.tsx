import { useContext } from "react";
import { Link } from "wouter";
import { ShoppingCart, Star } from "lucide-react";
import { LanguageContext } from "@/context/language-context";
import { CartContext } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { CurrencyDisplay, DiscountDisplay } from "@/components/ui/currency-display";

interface ProductCardProps {
  product: Product;
  isFlashDeal?: boolean;
}

export default function ProductCard({ product, isFlashDeal = false }: ProductCardProps) {
  const { language, t } = useContext(LanguageContext);
  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    
    toast({
      title: t("success"),
      description: `${product.title} ${t("addedToCart")}`,
    });
  };

  const calculateDiscount = () => {
    if (!product.discountedPrice) return 0;
    
    const originalPrice = parseFloat(product.price.toString());
    const discountedPrice = parseFloat(product.discountedPrice.toString());
    
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  const displayTitle = language === "ar" && product.titleAr ? product.titleAr : product.title;

  return (
    <div className="product-card bg-mediumBlue rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative">
          {isFlashDeal && product.discountedPrice && (
            <span className="absolute top-2 left-2 bg-danger text-white text-xs px-2 py-1 rounded">
              -{calculateDiscount()}%
            </span>
          )}
          <img 
            src={product.imageUrl} 
            alt={displayTitle} 
            className="w-full h-44 md:h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium mb-1 truncate">{displayTitle}</h3>
          <div className="mb-2">
            {product.discountedPrice ? (
              <DiscountDisplay 
                originalPrice={product.price} 
                discountedPrice={product.discountedPrice} 
              />
            ) : (
              <CurrencyDisplay 
                amount={product.price} 
                className="text-primary font-bold" 
              />
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm ml-1">
                {product.rating} {product.reviewCount && `(${product.reviewCount})`}
              </span>
            </div>
            <Button 
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
