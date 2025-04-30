import { useState, useContext, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { LanguageContext } from '@/context/language-context';
import { AuthContext } from '@/context/auth-context';
import { CartContext } from '@/context/cart-context';
import MainLayout from '@/components/layout/main-layout';
import { PaymentMethods } from '@/components/ui/payment-methods';
import { ShippingOptions, type ShippingOption } from '@/components/ui/shipping-options';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Phone, Mail, CreditCard, CheckCircle2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Checkout() {
  const { t, language } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash_on_delivery');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);
  
  const [formState, setFormState] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    governorate: '',
    postalCode: '',
    notes: '',
  });
  
  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : Number(item.product.price);
    return total + (price * item.quantity);
  }, 0);
  
  // Use selected shipping option price or default to 50 EGP
  const shippingCost = selectedShippingOption 
    ? parseFloat(selectedShippingOption.price) 
    : 50;
    
  const total = subtotal + shippingCost;
  
  // Check if cart is empty and redirect if necessary
  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart');
      toast({
        title: t('emptyCart') || 'سلة التسوق فارغة',
        description: t('addItemsToCartFirst') || 'يرجى إضافة منتجات إلى سلة التسوق أولاً',
        variant: 'destructive',
      });
    }
  }, [cartItems, isSuccess]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectPaymentMethod = (method: string, details?: any) => {
    setPaymentMethod(method);
    setPaymentDetails(details);
  };
  
  const handleSelectShippingOption = (option: ShippingOption) => {
    setSelectedShippingOption(option);
  };
  
  const handlePlaceOrder = () => {
    // Validate form
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'governorate'];
    const missingFields = requiredFields.filter(field => !formState[field as keyof typeof formState]);
    
    if (missingFields.length > 0) {
      toast({
        title: t('formIncomplete') || 'النموذج غير مكتمل',
        description: t('pleaseCompleteAllRequiredFields') || 'يرجى إكمال جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate shipping option selection
    if (!selectedShippingOption) {
      toast({
        title: t('shippingOptionRequired') || 'خيار الشحن مطلوب',
        description: t('pleaseSelectShippingOption') || 'يرجى اختيار طريقة الشحن المناسبة',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Prepare order data
    const orderData = {
      customerInfo: formState,
      items: cartItems,
      shippingOption: selectedShippingOption,
      paymentMethod,
      paymentDetails,
      subtotal,
      shippingCost: parseFloat(selectedShippingOption.price),
      total: subtotal + parseFloat(selectedShippingOption.price)
    };
    
    console.log('Order data:', orderData);
    
    // Simulate API call
    setTimeout(() => {
      // Generate a fake order ID
      const generatedOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedOrderId);
      setIsSuccess(true);
      setIsProcessing(false);
      clearCart();
    }, 2000);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', { 
      style: 'currency', 
      currency: 'EGP',
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  if (isSuccess && orderId) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-mediumBlue/70 rounded-2xl p-6 md:p-10 border border-gray-700 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{t('orderConfirmed') || 'تم تأكيد الطلب'}</h1>
            <p className="text-gray-300 mb-6">{t('thankYouForYourOrder') || 'شكراً لطلبك! تم استلام طلبك وسيتم معالجته في أقرب وقت ممكن.'}</p>
            
            <div className="bg-darkBlue rounded-xl p-6 mb-8 inline-block">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">{t('orderNumber') || 'رقم الطلب'}</h2>
              </div>
              <p className="text-xl font-mono text-primary">{orderId}</p>
            </div>
            
            <div className="space-y-3 text-center max-w-lg mx-auto mb-8">
              <p className="text-sm text-gray-400">
                {t('confirmationEmailSent') || 'تم إرسال رسالة تأكيد إلى بريدك الإلكتروني مع تفاصيل طلبك.'}
              </p>
              <p className="text-sm text-gray-400">
                {t('trackDeliveryInstruction') || 'يمكنك تتبع حالة طلبك وحالة التسليم باستخدام نظام SecurePack الخاص بنا.'}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="bg-primary hover:bg-lime-500 text-black gap-2" 
                onClick={() => navigate('/user/orders')}
              >
                <Package className="h-4 w-4" />
                {t('viewMyOrders') || 'عرض طلباتي'}
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 border-gray-600"
                onClick={() => navigate('/')}
              >
                {t('continueShopping') || 'مواصلة التسوق'}
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('checkout') || 'إتمام الشراء'}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping and Billing Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="bg-mediumBlue">
                <CardTitle>{t('shippingInformation') || 'معلومات الشحن'}</CardTitle>
                <CardDescription>{t('enterYourShippingDetails') || 'أدخل تفاصيل الشحن الخاصة بك'}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('fullName') || 'الاسم الكامل'} *</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      className="bg-mediumBlue border-gray-700" 
                      placeholder={t('enterYourFullName') || 'أدخل اسمك الكامل'} 
                      value={formState.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email') || 'البريد الإلكتروني'}</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      className="bg-mediumBlue border-gray-700" 
                      placeholder={t('enterYourEmail') || 'أدخل بريدك الإلكتروني'} 
                      value={formState.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phoneNumber') || 'رقم الهاتف'} *</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      className="bg-mediumBlue border-gray-700" 
                      placeholder={t('enterYourPhoneNumber') || 'أدخل رقم هاتفك'} 
                      value={formState.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="governorate">{t('governorate') || 'المحافظة'} *</Label>
                    <Input 
                      id="governorate" 
                      name="governorate" 
                      className="bg-mediumBlue border-gray-700" 
                      placeholder={t('enterYourGovernorate') || 'أدخل محافظتك'} 
                      value={formState.governorate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('city') || 'المدينة'} *</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      className="bg-mediumBlue border-gray-700" 
                      placeholder={t('enterYourCity') || 'أدخل مدينتك'} 
                      value={formState.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t('postalCode') || 'الرمز البريدي'}</Label>
                    <Input 
                      id="postalCode" 
                      name="postalCode" 
                      className="bg-mediumBlue border-gray-700" 
                      placeholder={t('enterYourPostalCode') || 'أدخل الرمز البريدي'} 
                      value={formState.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">{t('address') || 'العنوان'} *</Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      className="bg-mediumBlue border-gray-700 resize-none min-h-[80px]" 
                      placeholder={t('enterYourDetailedAddress') || 'أدخل عنوانك بالتفصيل: الشارع، رقم المبنى، الطابق، إلخ...'} 
                      value={formState.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">{t('orderNotes') || 'ملاحظات الطلب'}</Label>
                    <Textarea 
                      id="notes" 
                      name="notes" 
                      className="bg-mediumBlue border-gray-700 resize-none" 
                      placeholder={t('anySpecialInstructions') || 'أي تعليمات خاصة للتوصيل أو الطلب'} 
                      value={formState.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Shipping Options */}
            <ShippingOptions
              onSelectOption={handleSelectShippingOption}
              className="mb-6"
            />
            
            {/* Payment Methods */}
            <PaymentMethods 
              onSelectMethod={handleSelectPaymentMethod}
              onSubmit={handlePlaceOrder}
              isProcessing={isProcessing}
            />
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="bg-mediumBlue">
                <CardTitle>{t('orderSummary') || 'ملخص الطلب'}</CardTitle>
                <CardDescription>{t('reviewYourOrder') || 'مراجعة طلبك'}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          {item.product.imageUrl && (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.title} 
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.product.title}</p>
                          <p className="text-xs text-gray-400">{t('quantity')}: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">{formatCurrency(
                        (typeof item.product.price === 'string' ? 
                          parseFloat(item.product.price) : 
                          Number(item.product.price)) * item.quantity
                      )}</p>
                    </div>
                  ))}
                </div>
                
                <Separator className="mb-4 mt-6" />
                
                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-400">{t('subtotal') || 'المجموع الفرعي'}</p>
                    <p>{formatCurrency(subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-400">{t('shipping') || 'الشحن'}</p>
                    <p>{formatCurrency(shippingCost)}</p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold">
                    <p>{t('total') || 'المجموع'}</p>
                    <p className="text-primary text-xl">{formatCurrency(total)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4 border-t border-gray-700 pt-4">
                <Button 
                  className="w-full bg-primary hover:bg-lime-500 text-black"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? t('processingOrder') || 'جاري معالجة الطلب...' : t('placeOrder') || 'إتمام الطلب'}
                </Button>
                <p className="text-xs text-gray-400 text-center">
                  {t('byPlacingOrderYouAgree') || 'بالضغط على "إتمام الطلب"، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا'}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}