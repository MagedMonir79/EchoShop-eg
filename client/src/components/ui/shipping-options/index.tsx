import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Truck, Clock, Check, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

export interface ShippingOption {
  id: number;
  name: string;
  nameAr?: string | null;
  description?: string;
  descriptionAr?: string | null;
  price: string;
  deliveryTimeMinDays: number;
  deliveryTimeMaxDays: number;
  shippingCompanyId: number;
  shippingCompanyName: string;
  shippingCompanyNameAr?: string | null;
  isDefault?: boolean;
  isActive?: boolean;
}

interface ShippingOptionsProps {
  onSelectOption: (option: ShippingOption) => void;
  className?: string;
}

// Shipping options are now fetched from API

export function ShippingOptions({
  onSelectOption,
  className = '',
}: ShippingOptionsProps) {
  const { t, language } = useTranslation();
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  
  // Use React Query to fetch shipping options
  const { data: options = [], isLoading, error } = useQuery<ShippingOption[]>({
    queryKey: ['/api/shipping/options']
  });
  
  // Handle successful data fetch
  useEffect(() => {
    if (options && options.length > 0) {
      // Find default option or use the first one
      const defaultOption = options.find((opt: ShippingOption) => opt.isDefault === true) || options[0];
      setSelectedOptionId(defaultOption.id);
      onSelectOption(defaultOption);
    }
  }, [options, onSelectOption]);

  const handleOptionChange = (value: string) => {
    const optionId = parseInt(value);
    setSelectedOptionId(optionId);
    
    const selectedOption = options.find((opt: ShippingOption) => opt.id === optionId);
    if (selectedOption) {
      onSelectOption(selectedOption);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 2,
    }).format(parseFloat(price));
  };

  return (
    <Card className={`overflow-hidden border border-gray-700 ${className}`}>
      <CardHeader className="bg-mediumBlue">
        <CardTitle className="text-lg font-bold">{t('shippingOptions') || 'خيارات الشحن'}</CardTitle>
        <CardDescription>{t('selectShippingMethod') || 'اختر طريقة الشحن المناسبة لك'}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 pb-2 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full bg-gray-800" />
            <Skeleton className="h-24 w-full bg-gray-800" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <p className="text-gray-400">{t('errorFetchingShippingOptions') || 'حدث خطأ أثناء تحميل خيارات الشحن'}</p>
          </div>
        ) : options.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <AlertTriangle className="h-10 w-10 text-yellow-500" />
            <p className="text-gray-400">{t('noShippingOptionsAvailable') || 'لا توجد خيارات شحن متاحة حاليًا'}</p>
          </div>
        ) : (
          <RadioGroup
            value={selectedOptionId?.toString() || ''}
            onValueChange={handleOptionChange}
            className="space-y-4"
          >
            {options.map((option: ShippingOption) => (
              <div 
                key={option.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  selectedOptionId === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={option.id.toString()} id={`shipping-${option.id}`} />
                  <Label htmlFor={`shipping-${option.id}`} className="flex items-center gap-2 cursor-pointer">
                    <div className="flex-shrink-0">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {language === 'ar' && option.nameAr ? option.nameAr : option.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {language === 'ar' && option.shippingCompanyNameAr ? option.shippingCompanyNameAr : option.shippingCompanyName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-400">
                          {option.deliveryTimeMinDays === option.deliveryTimeMaxDays 
                            ? t('delivered_in_x_days', { count: option.deliveryTimeMinDays }) || `التوصيل خلال ${option.deliveryTimeMinDays} يوم` 
                            : t('delivered_in_x_to_y_days', { min: option.deliveryTimeMinDays, max: option.deliveryTimeMaxDays }) || `التوصيل خلال ${option.deliveryTimeMinDays}-${option.deliveryTimeMaxDays} يوم`}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="font-medium text-primary">{formatPrice(option.price)}</p>
                  {option.isDefault && (
                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">
                      {t('recommended') || 'موصى به'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}