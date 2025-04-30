import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showCurrency?: boolean;
}

export function CurrencyDisplay({
  amount,
  className,
  showCurrency = true,
}: CurrencyDisplayProps) {
  const { language } = useContext(LanguageContext);
  const isRtl = language === "ar";

  // Format currency based on language
  const formatter = new Intl.NumberFormat(isRtl ? "ar-EG" : "en-EG", {
    style: showCurrency ? "currency" : "decimal",
    currency: "EGP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAmount = formatter.format(amount);

  return (
    <span 
      className={cn("whitespace-nowrap", className)}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {formattedAmount}
    </span>
  );
}

interface DiscountDisplayProps {
  originalPrice: number;
  discountedPrice: number;
  className?: string;
}

export function DiscountDisplay({
  originalPrice,
  discountedPrice,
  className,
}: DiscountDisplayProps) {
  const { language } = useContext(LanguageContext);
  const isRtl = language === "ar";
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CurrencyDisplay amount={discountedPrice} className="text-primary font-bold" />
      <span className="text-muted-foreground line-through text-sm">
        <CurrencyDisplay amount={originalPrice} />
      </span>
      <span className="text-success text-xs bg-success/10 px-1.5 py-0.5 rounded">
        {isRtl ? `${discountPercentage}%-` : `-${discountPercentage}%`}
      </span>
    </div>
  );
}