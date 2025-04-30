import React from "react";
import { useTranslation } from "@/hooks/use-translation";
import { convertUSDtoEGP } from "@/lib/currency-formatter";

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  showCurrency?: boolean;
  showSymbol?: boolean;
  className?: string;
}

export function CurrencyDisplay({
  amount,
  currency = "EGP",
  showCurrency = true,
  showSymbol = false,
  className,
}: CurrencyDisplayProps) {
  const { language } = useTranslation();
  
  // Format the number according to the locale
  const formatNumber = (value: number): string => {
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Get the appropriate currency symbol
  const getCurrencySymbol = (): string => {
    switch (currency) {
      case 'EGP':
        return 'ج.م';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'SAR':
        return 'ر.س';
      case 'AED':
        return 'د.إ';
      default:
        return '';
    }
  };
  
  // Format the full currency display
  const formattedAmount = formatNumber(amount);
  const symbol = showSymbol ? getCurrencySymbol() : '';
  const currencyCode = showCurrency ? ` ${currency}` : '';
  
  // Arrange based on language direction
  return (
    <span className={className}>
      {language === 'ar' ? (
        <>
          {formattedAmount} {symbol}{currencyCode}
        </>
      ) : (
        <>
          {symbol}{formattedAmount}{currencyCode}
        </>
      )}
    </span>
  );
}