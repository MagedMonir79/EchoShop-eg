import { useContext, useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { LanguageContext } from "@/context/language-context";
import { CartContext } from "@/context/cart-context";
import { AuthContext } from "@/context/auth-context";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Star, Tag, Box, TruckIcon, Share2, Heart } from "lucide-react";
import { type Product } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SimilarProducts } from "@/components/recommendations";
import { CurrencyDisplay, DiscountDisplay } from "@/components/ui/currency-display";
import { convertUSDtoEGP } from "@/lib/currency-formatter";

export default function ProductDetails() {
  const { t, language } = useContext(LanguageContext);
  const { addToCart } = useContext(CartContext);
  const [match, params] = useRoute<{ id: string }>("/product/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['/api/products', params?.id],
    enabled: !!params?.id,
  });

  if (!match) {
    return <div>Product not found</div>;
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (isError || !product) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">{t("productNotFound")}</h2>
          <Button asChild>
            <Link href="/products">{t("backToProducts")}</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: t("addedToCart"),
      description: t("productAddedToCartMessage"),
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Display title & description based on language
  const title = language === 'ar' && product.titleAr ? product.titleAr : product.title;
  const description = language === 'ar' && product.descriptionAr 
    ? product.descriptionAr 
    : product.description;

  // Price calculation
  const displayPrice = product.discountedPrice ?? product.price;
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((Number(product.price) - Number(product.discountedPrice!)) / Number(product.price)) * 100) 
    : 0;
    
  // Convert to Egyptian Pound (EGP) using our currency formatter
  const displayPriceEGP = convertUSDtoEGP(displayPrice);
  const originalPriceEGP = convertUSDtoEGP(product.price);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex flex-wrap items-center space-x-2 rtl:space-x-reverse">
            <li><Link href="/" className="text-gray-500 hover:text-primary">{t("home")}</Link></li>
            <li><span className="text-gray-400 mx-2">/</span></li>
            <li><Link href="/products" className="text-gray-500 hover:text-primary">{t("products")}</Link></li>
            <li><span className="text-gray-400 mx-2">/</span></li>
            <li className="text-primary font-medium">{title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden h-[400px] flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={title} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <Box className="h-16 w-16 text-gray-400" />
              )}
            </div>
            
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{discountPercentage}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${star <= Number(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400 ms-2">
                ({product.reviewCount || 0} {t("reviews")})
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {hasDiscount ? (
                <div>
                  <div className="flex items-center gap-2">
                    <CurrencyDisplay 
                      amount={displayPriceEGP} 
                      className="text-3xl font-bold text-primary"
                    />
                    <CurrencyDisplay 
                      amount={originalPriceEGP} 
                      className="text-xl text-gray-400 line-through"
                    />
                  </div>
                  <p className="text-green-500 mt-1">
                    {t("youSave")} <CurrencyDisplay amount={(originalPriceEGP - displayPriceEGP)} />
                  </p>
                </div>
              ) : (
                <CurrencyDisplay 
                  amount={displayPriceEGP} 
                  className="text-3xl font-bold text-primary"
                />
              )}
              <p className="text-sm text-gray-500 mt-1">${displayPrice} USD</p>
            </div>
            
            {/* Short Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6">{description.substring(0, 150)}...</p>
            
            {/* Availability */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Box className="mr-2 h-5 w-5 text-gray-600" />
                <span>
                  {t("availability")}: 
                  <span className={`ml-1 font-medium ${product.inventory > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.inventory > 0 ? t("inStock") : t("outOfStock")}
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <TruckIcon className="mr-2 h-5 w-5 text-gray-600" />
                <span>{t("fastDelivery")}</span>
              </div>
            </div>
            
            {/* Quantity */}
            <div className="flex items-center mb-6">
              <span className="mr-4">{t("quantity")}:</span>
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border-r"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <div className="w-12 h-10 flex items-center justify-center">
                  {quantity}
                </div>
                <button 
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border-l"
                  disabled={product.inventory <= quantity}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button 
                onClick={handleAddToCart}
                disabled={product.inventory <= 0}
                className="flex-1 bg-primary text-black hover:bg-lime-500"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t("addToCart")}
              </Button>
              <Button variant="outline" className="w-12 h-12 p-0 flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="w-12 h-12 p-0 flex items-center justify-center">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Categories */}
            <div className="flex items-center text-sm">
              <Tag className="mr-2 h-4 w-4 text-gray-600" />
              <span className="text-gray-600">{t("category")}:</span>
              <Link href={`/products?category=${product.categoryId}`} className="ml-2 text-primary hover:underline">
                {`Category ${product.categoryId}`}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">{t("description")}</TabsTrigger>
              <TabsTrigger value="specifications">{t("specifications")}</TabsTrigger>
              <TabsTrigger value="reviews">{t("reviews")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p>{description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">{t("productId")}</h3>
                  <p>{product.id}</p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">{t("sku")}</h3>
                  <p>SKU-{product.id}-{Math.floor(Math.random() * 1000)}</p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">{t("weight")}</h3>
                  <p>0.5 kg</p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">{t("dimensions")}</h3>
                  <p>10 × 10 × 10 cm</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 mb-4">{t("noReviewsYet")}</p>
                <Button variant="outline">{t("beTheFirstToReview")}</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Similar Products Section */}
        <div className="mt-16">
          <SimilarProducts 
            productId={product.id} 
            categoryId={product.categoryId}
            sellerId={product.sellerId}
            limit={4}
          />
        </div>
      </div>
    </MainLayout>
  );
  
  // تسجيل مشاهدة المنتج عند تحميل الصفحة
  // Log product view when page loads
  useEffect(() => {
    if (product) {
      const { userData } = useContext(AuthContext);
      // تسجيل مشاهدة المنتج
      fetch("/api/analytics/product-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userData?.userId || null,
          productId: product.id
        })
      }).catch(error => {
        console.error("Failed to log product view:", error);
      });
    }
  }, [product]);
}