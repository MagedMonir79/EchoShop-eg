import { useState, useEffect, useContext } from "react";
import { useLocation, useRoute } from "wouter";
import { LanguageContext } from "@/context/language-context";
import { CartContext } from "@/context/cart-context";
import { formatCurrency, convertUSDtoEGP } from "@/lib/currency-formatter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, MapPin, CreditCard, Truck, DollarSign, Check, Info } from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";

// Types
interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  additionalInfo: string;
  paymentMethod: string;
  shippingMethod: string;
}

// Mock shipping methods (would come from API in production)
const shippingMethods = [
  { id: 'standard', name: 'الشحن العادي', nameEn: 'Standard Shipping', price: 50, days: '3-5' },
  { id: 'express', name: 'الشحن السريع', nameEn: 'Express Shipping', price: 100, days: '1-2' },
];

// Payment Methods
const paymentMethods = [
  { 
    id: 'cod', 
    name: 'الدفع عند الاستلام', 
    nameEn: 'Cash on Delivery',
    icon: <DollarSign className="w-5 h-5 text-green-600" />,
    description: 'ادفع نقداً عند استلام طلبك'
  },
  // These will be disabled until payment gateway integration
  { 
    id: 'card', 
    name: 'بطاقة ائتمان', 
    nameEn: 'Credit/Debit Card',
    icon: <CreditCard className="w-5 h-5 text-blue-600" />,
    description: 'الدفع باستخدام فيزا أو ماستركارد',
    disabled: true
  },
  { 
    id: 'wallet', 
    name: 'محفظة إلكترونية', 
    nameEn: 'E-Wallet',
    icon: <Truck className="w-5 h-5 text-purple-600" />,
    description: 'الدفع باستخدام فوداكاش أو اتصالات كاش أو WE Pay',
    disabled: true
  },
];

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { t, language } = useContext(LanguageContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { toast } = useToast();
  const isRtl = language === 'ar';
  
  // State for checkout form
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    area: '',
    additionalInfo: '',
    paymentMethod: 'cod', // Default to cash on delivery
    shippingMethod: 'standard', // Default to standard shipping
  });
  
  // State for order summary
  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 50, // Default shipping cost
    total: 0,
  });
  
  // Loading states
  const [addressTab, setAddressTab] = useState('manual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Calculate order summary whenever cart or shipping method changes
  useEffect(() => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.product.discountedPrice || item.product.price;
      return total + Number(price) * item.quantity;
    }, 0);
    
    const shippingCost = shippingMethods.find(
      method => method.id === formData.shippingMethod
    )?.price || 50;
    
    setSummary({
      subtotal,
      shipping: shippingCost,
      total: subtotal + shippingCost,
    });
  }, [cartItems, formData.shippingMethod]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/orders'] });
      setOrderId(data.id);
      setOrderComplete(true);
      clearCart();
      toast({
        title: t('orderPlacedSuccessfully'),
        description: t('yourOrderHasBeenPlacedSuccessfully'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('errorPlacingOrder'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast({
        title: t('incompleteForm'),
        description: t('pleaseCompleteAllRequiredFields'),
        variant: 'destructive',
      });
      return;
    }
    
    // Prepare order data
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.discountedPrice || item.product.price,
      })),
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        area: formData.area,
        additionalInfo: formData.additionalInfo,
      },
      paymentMethod: formData.paymentMethod,
      shippingMethod: formData.shippingMethod,
      email: formData.email,
      subtotal: summary.subtotal,
      shippingCost: summary.shipping,
      total: summary.total,
    };
    
    // If this were connected to a real backend, we'd call the mutation:
    // createOrderMutation.mutate(orderData);
    
    // For now we'll just simulate a successful order
    setIsSubmitting(true);
    setTimeout(() => {
      setOrderId(Math.floor(Math.random() * 100000) + 10000);
      setOrderComplete(true);
      clearCart();
      setIsSubmitting(false);
      toast({
        title: t('orderPlacedSuccessfully'),
        description: t('yourOrderHasBeenPlacedSuccessfully'),
      });
    }, 2000);
  };
  
  // If order is complete, show success message
  if (orderComplete) {
    return (
      <div className="container max-w-4xl mx-auto p-4 py-8">
        <Card className="w-full">
          <CardHeader className="text-center bg-primary/5 rounded-t-lg">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t('orderPlacedSuccessfully')}</CardTitle>
            <CardDescription className="text-lg">
              {t('orderNumber')}: <span className="font-bold">#{orderId}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 text-sm">
                  {t('cashOnDeliveryNote')}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-lg">{t('whatHappensNext')}</h3>
              <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                <li>{t('orderConfirmationStep')}</li>
                <li>{t('orderPreparationStep')}</li>
                <li>{t('shippingProcessStep')}</li>
                <li>{t('deliveryStep')}</li>
              </ol>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-4">
              <h3 className="font-medium mb-2">{t('orderSummary')}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{t('subtotal')}:</span>
                  <CurrencyDisplay amount={summary.subtotal} />
                </div>
                <div className="flex justify-between">
                  <span>{t('shipping')}:</span>
                  <CurrencyDisplay amount={summary.shipping} />
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>{t('total')}:</span>
                  <CurrencyDisplay amount={summary.total} className="text-base" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center bg-muted/20 p-6 rounded-b-lg">
            <Button variant="outline" onClick={() => setLocation('/')}>
              {t('continueShopping')}
            </Button>
            <Button onClick={() => setLocation('/user/orders')}>
              {t('viewYourOrders')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // If cart is empty, redirect to cart page
  if (cartItems.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto p-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('emptyCart')}</CardTitle>
            <CardDescription>
              {t('yourCartIsEmptyPleaseAddItemsBeforeCheckingOut')}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setLocation('/')}>
              {t('continueShopping')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">{t('checkout')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t('shippingAddress')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs
                  defaultValue="manual"
                  value={addressTab}
                  onValueChange={setAddressTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="manual">{t('enterManually')}</TabsTrigger>
                    <TabsTrigger value="map">{t('selectFromMap')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t('fullName')}</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder={t('enterFullName')}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('phoneNumber')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t('enterPhoneNumber')}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')} ({t('optional')})</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('enterEmail')}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t('city')}</Label>
                        <Select
                          name="city"
                          value={formData.city}
                          onValueChange={(value) => handleSelectChange('city', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectCity')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cairo">القاهرة</SelectItem>
                            <SelectItem value="giza">الجيزة</SelectItem>
                            <SelectItem value="alexandria">الإسكندرية</SelectItem>
                            <SelectItem value="sharmelsheikh">شرم الشيخ</SelectItem>
                            <SelectItem value="hurghada">الغردقة</SelectItem>
                            <SelectItem value="luxor">الأقصر</SelectItem>
                            <SelectItem value="aswan">أسوان</SelectItem>
                            <SelectItem value="mansoura">المنصورة</SelectItem>
                            <SelectItem value="tanta">طنطا</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="area">{t('area')}</Label>
                        <Input
                          id="area"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          placeholder={t('enterArea')}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">{t('detailedAddress')}</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={t('enterDetailedAddress')}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">
                        {t('additionalInfo')} ({t('optional')})
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        placeholder={t('enterAdditionalInfo')}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="map" className="pt-4">
                    <div className="bg-muted h-[300px] rounded-md flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                        <p>{t('mapSelectNotAvailableYet')}</p>
                        <p className="text-sm mt-2">{t('pleaseUseManualEntry')}</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setAddressTab('manual')}
                    >
                      {t('switchToManualEntry')}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Shipping Method */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  {t('shippingMethod')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.shippingMethod}
                  onValueChange={(value) => handleSelectChange('shippingMethod', value)}
                  className="space-y-3"
                >
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.shippingMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleSelectChange('shippingMethod', method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={method.id} id={`shipping-${method.id}`} />
                        <div>
                          <Label htmlFor={`shipping-${method.id}`} className="font-medium">
                            {language === 'ar' ? method.name : method.nameEn}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t('estimatedDelivery')}: {method.days} {t('days')}
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">
                        <CurrencyDisplay amount={method.price} />
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Payment Method */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t('paymentMethod')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-3 space-x-reverse border rounded-lg p-4 cursor-pointer transition-colors ${
                        method.disabled ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        formData.paymentMethod === method.id && !method.disabled
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => !method.disabled && handleSelectChange('paymentMethod', method.id)}
                    >
                      <RadioGroupItem
                        value={method.id}
                        id={`payment-${method.id}`}
                        disabled={method.disabled}
                      />
                      <div className="flex flex-1 items-center gap-3">
                        {method.icon}
                        <div>
                          <Label
                            htmlFor={`payment-${method.id}`}
                            className={`font-medium ${method.disabled ? 'cursor-not-allowed' : ''}`}
                          >
                            {language === 'ar' ? method.name : method.nameEn}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      
                      {method.disabled && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {t('comingSoon')}
                        </span>
                      )}
                    </div>
                  ))}
                </RadioGroup>
                
                {formData.paymentMethod === 'cod' && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    <p className="font-medium mb-1">{t('cashOnDeliveryInfo')}</p>
                    <p>{t('cashOnDeliveryDescription')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Submit Button for Small Screens */}
            <div className="mt-6 lg:hidden">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('processing')}...
                  </>
                ) : (
                  <>
                    {t('placeOrder')} - <CurrencyDisplay amount={summary.total} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>{t('orderSummary')}</CardTitle>
              <CardDescription>
                {cartItems.length} {cartItems.length === 1 ? t('item') : t('items')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div
                      className="w-16 h-16 rounded-md bg-center bg-cover bg-no-repeat flex-shrink-0"
                      style={{ backgroundImage: `url(${item.product.imageUrl})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{language === 'ar' ? item.product.titleAr : item.product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('quantity')}: {item.quantity}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <CurrencyDisplay
                          amount={Number(item.product.discountedPrice || item.product.price) * item.quantity}
                          className="font-medium"
                        />
                        {item.product.discountedPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            <CurrencyDisplay amount={Number(item.product.price) * item.quantity} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cost Breakdown */}
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('subtotal')}:</span>
                  <CurrencyDisplay amount={summary.subtotal} />
                </div>
                <div className="flex justify-between">
                  <span>{t('shipping')}:</span>
                  <CurrencyDisplay amount={summary.shipping} />
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-base pt-1">
                  <span>{t('total')}:</span>
                  <CurrencyDisplay amount={summary.total} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {/* Submit Button for Large Screens */}
              <Button
                type="submit"
                className="w-full hidden lg:flex"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('processing')}...
                  </>
                ) : (
                  t('placeOrder')
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}