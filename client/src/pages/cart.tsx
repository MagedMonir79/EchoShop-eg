import { useContext, useEffect, useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { LanguageContext } from "@/context/language-context";
import { CartContext } from "@/context/cart-context";
import { AuthContext } from "@/context/auth-context";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { t, language } = useContext(LanguageContext);
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toUpperCase() === "ECHO10") {
        setDiscount(totalPrice * 0.1);
        toast({
          title: t("success"),
          description: t("promoApplied"),
        });
      } else {
        toast({
          title: t("error"),
          description: t("invalidPromo"),
          variant: "destructive",
        });
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: t("loginRequired"),
        description: t("loginToCheckout"),
        variant: "destructive",
      });
      return;
    }
    
    // Proceed to checkout
    console.log("Proceeding to checkout");
    // Would redirect to checkout page in a real app
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("yourCart")}</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-mediumBlue rounded-lg">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-4">{t("emptyCart")}</h2>
            <p className="text-gray-400 mb-8">{t("emptyCartMessage")}</p>
            <Button asChild>
              <Link href="/products">
                <a className="flex items-center justify-center gap-2">
                  {t("continueShopping")}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="bg-mediumBlue rounded-lg overflow-hidden">
                <div className="p-4 bg-darkBlue flex justify-between">
                  <h2 className="font-bold">{t("cartItems")}</h2>
                  <span>{cartItems.length} {t("items")}</span>
                </div>
                
                <div>
                  {cartItems.map((item, index) => (
                    <div key={item.product.id} className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-1/4">
                        <img 
                          src={item.product.imageUrl} 
                          alt={language === "ar" && item.product.titleAr ? item.product.titleAr : item.product.title}
                          className="rounded-md w-full object-cover h-32 sm:h-24"
                        />
                      </div>
                      <div className="sm:w-3/4 flex flex-col sm:flex-row justify-between">
                        <div>
                          <h3 className="font-medium text-lg">
                            {language === "ar" && item.product.titleAr ? item.product.titleAr : item.product.title}
                          </h3>
                          <p className="text-primary font-bold mt-1">
                            ${item.product.discountedPrice || item.product.price}
                          </p>
                          {item.product.discountedPrice && (
                            <p className="text-gray-400 line-through text-sm">
                              ${item.product.price}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-row sm:flex-col justify-between items-end mt-4 sm:mt-0">
                          <div className="flex items-center border border-gray-700 rounded-md">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-none" 
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-none" 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="mt-2" 
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    className="text-danger border-danger hover:bg-danger hover:text-white"
                    onClick={() => clearCart()}
                  >
                    {t("clearCart")}
                  </Button>
                  <Button asChild>
                    <Link href="/products">
                      <a>{t("continueShopping")}</a>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <Card className="bg-mediumBlue border-gray-800">
                <CardHeader>
                  <CardTitle>{t("orderSummary")}</CardTitle>
                  <CardDescription>{t("orderSummaryDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>{t("subtotal")}</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-success">
                        <span>{t("discount")}</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>{t("shipping")}</span>
                      <span>{totalPrice > 100 ? t("free") : "$10.00"}</span>
                    </div>
                    
                    <Separator className="my-4 bg-gray-700" />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>{t("total")}</span>
                      <span>
                        ${(totalPrice - discount + (totalPrice > 100 ? 0 : 10)).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-sm mb-2">{t("promoCode")}</p>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="ECHO10" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="bg-darkBlue border-gray-700"
                        />
                        <Button 
                          onClick={applyPromoCode} 
                          disabled={!promoCode || isApplyingPromo}
                        >
                          {isApplyingPromo ? t("applying") : t("apply")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-primary text-black hover:bg-lime-500" 
                    onClick={handleCheckout}
                  >
                    {t("checkout")}
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-6 bg-mediumBlue rounded-lg p-4">
                <h3 className="font-bold mb-2">{t("acceptedPaymentMethods")}</h3>
                <div className="flex gap-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="American Express" className="h-8" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
