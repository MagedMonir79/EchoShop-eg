import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, MapPin, Calendar, Clock, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

interface PackageHistoryItem {
  status: string;
  timestamp: string;
  location: string;
}

interface PackageStatusProps {
  packageId: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: string;
  lastUpdated: string;
  trackingHistory?: PackageHistoryItem[];
  expanded?: boolean;
  className?: string;
}

export function PackageStatus({
  packageId,
  status,
  currentLocation,
  estimatedDelivery,
  lastUpdated,
  trackingHistory = [],
  expanded = false,
  className = '',
}: PackageStatusProps) {
  const { t, language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      'pending': { color: 'bg-yellow-500', label: t('packageStatus.pending') },
      'processing': { color: 'bg-blue-500', label: t('packageStatus.processing') },
      'shipped': { color: 'bg-indigo-500', label: t('packageStatus.shipped') },
      'delivered': { color: 'bg-green-500', label: t('packageStatus.delivered') },
      'failed': { color: 'bg-red-500', label: t('packageStatus.failed') },
    };
    
    return statusMap[status] || { color: 'bg-gray-500', label: status };
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Use Intl.DateTimeFormat to format the date based on the current language
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    // Use Intl.DateTimeFormat to format the time based on the current language
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Sort tracking history by timestamp (newest first)
  const sortedHistory = [...(trackingHistory || [])].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  const { color, label } = getStatusBadge(status);
  
  return (
    <Card className={`overflow-hidden border border-gray-700 ${className}`}>
      <CardHeader className="bg-mediumBlue">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{t('packageTracking')}</CardTitle>
          <Badge className={color}>{label}</Badge>
        </div>
        <CardDescription>{t('packageId')}: {packageId}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 pb-2 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-gray-400">{t('currentLocation')}</p>
            <p className="font-medium">{currentLocation}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-gray-400">{t('estimatedDelivery')}</p>
            <p className="font-medium">{formatDate(estimatedDelivery)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-gray-400">{t('lastUpdated')}</p>
            <p className="font-medium">{formatDate(lastUpdated)} {formatTime(lastUpdated)}</p>
          </div>
        </div>
        
        {isExpanded && trackingHistory && trackingHistory.length > 0 && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="font-bold mb-4">{t('trackingHistory')}</h3>
            <div className="space-y-4">
              {sortedHistory.map((item, index) => (
                <div key={index} className="relative">
                  {/* Timeline connector */}
                  {index !== sortedHistory.length - 1 && (
                    <div className="absolute top-6 bottom-0 left-2.5 w-0.5 bg-gray-700"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`h-5 w-5 rounded-full mt-1.5 ${getStatusBadge(item.status).color} flex-shrink-0`}></div>
                    <div className="flex-1">
                      <p className="font-semibold">{getStatusBadge(item.status).label}</p>
                      <p className="text-sm text-gray-400">{item.location}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.timestamp)} {formatTime(item.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {trackingHistory && trackingHistory.length > 0 && (
        <CardFooter className="border-t border-gray-700 pt-2 pb-2">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-center text-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                {t('hideDetails')}
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                {t('showDetails')}
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}