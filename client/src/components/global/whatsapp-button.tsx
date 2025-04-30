import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  fixed?: boolean;
}

export function WhatsAppButton({
  phoneNumber,
  message = '', 
  size = 'md',
  showLabel = true,
  variant = 'default',
  className = '',
  fixed = false
}: WhatsAppButtonProps) {
  const { t } = useTranslation();
  
  // Format phone number to ensure it's in the correct format for WhatsApp
  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-numeric characters
    const numericPhone = phone.replace(/\D/g, '');
    
    // Ensure phone number starts with country code
    if (numericPhone.startsWith('0')) {
      // Assume Egypt (+20) if starts with 0
      return '20' + numericPhone.substring(1);
    } else if (!numericPhone.startsWith('2')) {
      // Assume Egypt (+20) if doesn't start with country code
      return '20' + numericPhone;
    }
    
    return numericPhone;
  };
  
  const getWhatsAppUrl = (): string => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };
  
  // Define button sizes
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };
  
  // Define icon sizes
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={fixed ? 'fixed bottom-6 right-6 z-50' : ''}
    >
      <Button
        variant={variant}
        className={`${sizeClasses[size]} ${className} ${
          variant === 'default' ? 'bg-[#25D366] hover:bg-[#20BD5C]' : ''
        } ${fixed ? 'rounded-full p-3 shadow-lg' : ''}`}
      >
        <MessageCircle className={`${iconSizes[size]} ${showLabel ? 'mr-2' : ''}`} />
        {showLabel && !fixed && <span>{t('whatsappButton.contactUs')}</span>}
      </Button>
    </a>
  );
}