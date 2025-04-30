/**
 * Convert USD to EGP based on current approximate exchange rate
 * In a real application, this would fetch from a currency API
 * @param usdAmount The amount in USD
 * @returns The equivalent amount in EGP
 */
export function convertUSDtoEGP(usdAmount: number): number {
  // Current approximate exchange rate: 1 USD = ~48 EGP
  const exchangeRate = 48;
  return usdAmount * exchangeRate;
}

/**
 * Convert EGP to USD based on current approximate exchange rate
 * In a real application, this would fetch from a currency API
 * @param egpAmount The amount in EGP
 * @returns The equivalent amount in USD
 */
export function convertEGPtoUSD(egpAmount: number): number {
  // Current approximate exchange rate: 1 USD = ~48 EGP
  const exchangeRate = 48;
  return egpAmount / exchangeRate;
}

/**
 * Format a currency amount based on locale and currency code
 * @param amount The amount to format
 * @param currencyCode The ISO currency code
 * @param locale The locale to format for
 * @returns A formatted currency string
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = "EGP",
  locale: string = "ar-EG"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert a percentage to a decimal value
 * @param percentage The percentage value (e.g., 15 for 15%)
 * @returns The decimal equivalent (e.g., 0.15)
 */
export function percentageToDecimal(percentage: number): number {
  return percentage / 100;
}

/**
 * Calculate tax amount based on a price and tax rate
 * @param price The price before tax
 * @param taxRate The tax rate as a percentage
 * @returns The tax amount
 */
export function calculateTax(price: number, taxRate: number): number {
  return price * percentageToDecimal(taxRate);
}

/**
 * Calculate the profit margin based on cost and selling price
 * @param costPrice The cost price
 * @param sellingPrice The selling price
 * @returns The profit margin as a percentage
 */
export function calculateProfitMargin(costPrice: number, sellingPrice: number): number {
  if (costPrice === 0) return 0;
  const profit = sellingPrice - costPrice;
  return (profit / costPrice) * 100;
}

/**
 * Calculate the selling price based on cost and desired profit margin
 * @param costPrice The cost price
 * @param desiredMargin The desired profit margin as a percentage
 * @returns The recommended selling price
 */
export function calculateSellingPrice(costPrice: number, desiredMargin: number): number {
  return costPrice * (1 + percentageToDecimal(desiredMargin));
}