import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Check, CreditCard, Wallet, DollarSign, Loader2 } from 'lucide-react';

interface PaymentMethodsProps {
  onSelectMethod: (method: string, details?: any) => void;
  onSubmit: () => void;
  isProcessing?: boolean;
  className?: string;
}

export function PaymentMethods({
  onSelectMethod,
  onSubmit,
  isProcessing = false,
  className = '',
}: PaymentMethodsProps) {
  const { t, language } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<string>('cash_on_delivery');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [reference, setReference] = useState<string>('');

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    onSelectMethod(value);
  };

  const handleSubmit = () => {
    if (selectedMethod === 'vodafone_cash' || selectedMethod === 'fawry' || selectedMethod === 'instapay') {
      onSelectMethod(selectedMethod, { phoneNumber, reference });
    } else {
      onSelectMethod(selectedMethod);
    }
    onSubmit();
  };

  return (
    <Card className={`overflow-hidden border border-gray-700 ${className}`}>
      <CardHeader className="bg-mediumBlue">
        <CardTitle className="text-lg font-bold">{t('paymentMethods') || 'طرق الدفع'}</CardTitle>
        <CardDescription>{t('selectPaymentMethod') || 'اختر طريقة الدفع المناسبة لك'}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 pb-2 space-y-6">
        <RadioGroup
          value={selectedMethod}
          onValueChange={handleMethodChange}
          className="space-y-4"
        >
          {/* Cash on Delivery */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${selectedMethod === 'cash_on_delivery' ? 'border-primary bg-primary/5' : 'border-gray-700'}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
              <Label htmlFor="cash_on_delivery" className="flex items-center gap-2 cursor-pointer">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">{t('cashOnDelivery') || 'الدفع عند الاستلام'}</p>
                  <p className="text-sm text-gray-400">{t('payWhenReceivingYourOrder') || 'ادفع عند استلام طلبك'}</p>
                </div>
              </Label>
            </div>
            {selectedMethod === 'cash_on_delivery' && (
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
            )}
          </div>
          
          {/* Fawry */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${selectedMethod === 'fawry' ? 'border-primary bg-primary/5' : 'border-gray-700'}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="fawry" id="fawry" />
              <Label htmlFor="fawry" className="flex items-center gap-2 cursor-pointer">
                <div className="h-5 w-5 bg-yellow-500 text-black font-bold text-xs flex items-center justify-center rounded">F</div>
                <div>
                  <p className="font-medium">{t('fawryPay') || 'فوري'}</p>
                  <p className="text-sm text-gray-400">{t('payViaNearestFawryOutlet') || 'ادفع من خلال أقرب منفذ فوري'}</p>
                </div>
              </Label>
            </div>
            {selectedMethod === 'fawry' && (
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
            )}
          </div>
          
          {/* Vodafone Cash */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${selectedMethod === 'vodafone_cash' ? 'border-primary bg-primary/5' : 'border-gray-700'}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="vodafone_cash" id="vodafone_cash" />
              <Label htmlFor="vodafone_cash" className="flex items-center gap-2 cursor-pointer">
                <div className="h-5 w-5 bg-red-600 text-white font-bold text-xs flex items-center justify-center rounded">V</div>
                <div>
                  <p className="font-medium">{t('vodafoneCash') || 'فودافون كاش'}</p>
                  <p className="text-sm text-gray-400">{t('payUsingVodafoneCash') || 'ادفع باستخدام محفظة فودافون كاش'}</p>
                </div>
              </Label>
            </div>
            {selectedMethod === 'vodafone_cash' && (
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
            )}
          </div>
          
          {/* InstaPay */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${selectedMethod === 'instapay' ? 'border-primary bg-primary/5' : 'border-gray-700'}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="instapay" id="instapay" />
              <Label htmlFor="instapay" className="flex items-center gap-2 cursor-pointer">
                <div className="h-5 w-5 bg-blue-600 text-white font-bold text-xs flex items-center justify-center rounded">IP</div>
                <div>
                  <p className="font-medium">{t('instaPay') || 'انستاباي'}</p>
                  <p className="text-sm text-gray-400">{t('payUsingInstaPay') || 'ادفع باستخدام تطبيق انستاباي'}</p>
                </div>
              </Label>
            </div>
            {selectedMethod === 'instapay' && (
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
            )}
          </div>
          
          {/* Credit Card */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${selectedMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-gray-700'}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{t('creditCard') || 'بطاقة ائتمان'}</p>
                  <p className="text-sm text-gray-400">{t('visa_mastercard_amex') || 'فيزا، ماستركارد، أمريكان إكسبريس'}</p>
                </div>
              </Label>
            </div>
            {selectedMethod === 'credit_card' && (
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
            )}
          </div>
          
          {/* Wallet */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${selectedMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-gray-700'}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                <Wallet className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">{t('walletBalance') || 'رصيد المحفظة'}</p>
                  <p className="text-sm text-gray-400">{t('useYourWalletBalance') || 'استخدم رصيد محفظتك في المتجر'}</p>
                </div>
              </Label>
            </div>
            {selectedMethod === 'wallet' && (
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
            )}
          </div>
        </RadioGroup>
        
        {/* Additional fields for mobile payment methods */}
        {(selectedMethod === 'vodafone_cash' || selectedMethod === 'fawry' || selectedMethod === 'instapay') && (
          <div className="border border-gray-700 rounded-lg p-4 mt-4 space-y-4">
            <h3 className="font-medium text-sm">{t('additionalInfo') || 'معلومات إضافية'}</h3>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('mobileNumber') || 'رقم الهاتف'}</Label>
              <Input 
                id="phoneNumber" 
                type="tel" 
                className="bg-mediumBlue border-gray-700"
                placeholder="01xxxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            
            {selectedMethod === 'fawry' && (
              <div className="space-y-2">
                <Label htmlFor="reference">{t('referenceNumber') || 'رقم المرجع'}</Label>
                <Input 
                  id="reference" 
                  className="bg-mediumBlue border-gray-700"
                  placeholder={t('referenceNumberInSMS') || 'رقم المرجع الموجود في الرسالة النصية'}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4 pb-4">
        <Button 
          className="w-full bg-primary hover:bg-lime-500 text-black"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('processing') || 'جاري المعالجة...'}
            </>
          ) : (
            t('confirmPayment') || 'تأكيد الدفع'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}