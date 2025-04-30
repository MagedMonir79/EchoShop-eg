import { useTranslation } from "@/hooks/use-translation";

/**
 * Format a date to a localized string based on the current language
 * @param date The date to format
 * @param options Options for formatting the date
 * @returns A formatted date string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  // Get the language from localStorage, default to Arabic
  const language = localStorage.getItem("language") as "ar" | "en" | null || "ar";
  
  // Default options for date formatting
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  // Merge default options with any provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Return formatted date based on language
  return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', mergedOptions);
}

/**
 * Format a datetime to a localized string based on the current language
 * @param date The date to format
 * @param options Options for formatting the date and time
 * @returns A formatted date and time string
 */
export function formatDateTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
  // Get the language from localStorage, default to Arabic
  const language = localStorage.getItem("language") as "ar" | "en" | null || "ar";
  
  // Default options for datetime formatting
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  // Merge default options with any provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Return formatted datetime based on language
  return date.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', mergedOptions);
}

/**
 * Format a time to a localized string based on the current language
 * @param date The date to extract the time from
 * @param options Options for formatting the time
 * @returns A formatted time string
 */
export function formatTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
  // Get the language from localStorage, default to Arabic
  const language = localStorage.getItem("language") as "ar" | "en" | null || "ar";
  
  // Default options for time formatting
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  // Merge default options with any provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Return formatted time based on language
  return date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', mergedOptions);
}

/**
 * Format a relative time (e.g., "2 hours ago") based on the current language
 * @param date The date to compare with the current time
 * @returns A formatted relative time string
 */
export function formatRelativeTime(date: Date): string {
  // Get the language from localStorage, default to Arabic
  const language = localStorage.getItem("language") as "ar" | "en" | null || "ar";
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(language === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-Math.floor(diffInSeconds), 'second');
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
}