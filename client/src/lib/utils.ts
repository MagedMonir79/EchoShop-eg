import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to combine class names, used for conditional styling with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currencyCode = 'EGP'): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(date: string | Date, locale = 'ar-EG'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Generate a contrast color (black or white) based on the background color brightness
 */
export function getContrastColor(hexColor: string): 'black' | 'white' {
  const rgb = hexToRgb(hexColor);
  
  if (!rgb) return 'white';
  
  // Calculate brightness using the perceived brightness formula
  const brightness = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) / 255;
  
  // Return black for bright colors, white for dark colors
  return brightness > 0.5 ? 'black' : 'white';
}

/**
 * Function to truncate text and add ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Function to generate a random color
 */
export function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}