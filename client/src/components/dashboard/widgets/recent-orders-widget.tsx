import React, { useContext } from 'react';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { BaseWidget } from './base-widget';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { LanguageContext } from '@/hooks/use-translation-provider';

// Mock data for recent orders
const mockRecentOrders = [
  { 
    id: 'ORD-8745231',
    date: '2025-04-22',
    total: 245.99,
    status: 'delivered',
    items: 3
  },
  { 
    id: 'ORD-9871265',
    date: '2025-04-10', 
    total: 128.50,
    status: 'processing',
    items: 2
  },
  { 
    id: 'ORD-7651023',
    date: '2025-03-28',
    total: 349.75,
    status: 'shipped',
    items: 5
  }
];

interface RecentOrdersWidgetProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function RecentOrdersWidget({ 
  onMoveUp, 
  onMoveDown, 
  onRemove,
  className 
}: RecentOrdersWidgetProps) {
  const { t } = useContext(LanguageContext);
  
  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  return (
    <BaseWidget
      title={t('recentOrders')}
      description={t('recentOrdersDescription')}
      icon={<ShoppingBag />}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onRemove={onRemove}
      className={className}
    >
      <div className="space-y-4">
        {mockRecentOrders.length > 0 ? (
          <div className="space-y-3">
            {mockRecentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-3 bg-darkBlue rounded-md border border-gray-700"
              >
                <div>
                  <div className="font-medium text-white">{order.id}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(order.date).toLocaleDateString()} • {order.items} {t('items')}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="font-medium text-white">
                    ${order.total.toFixed(2)}
                  </div>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {t(order.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-600 mb-3" />
            <h3 className="text-gray-300 font-medium mb-2">{t('noRecentOrders')}</h3>
            <p className="text-gray-400 text-sm mb-4">{t('noRecentOrdersDescription')}</p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 border-gray-700 text-primary hover:text-primary hover:bg-primary/10"
          asChild
        >
          <Link href="/user/orders">
            {t('viewAllOrders')} <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </BaseWidget>
  );
}