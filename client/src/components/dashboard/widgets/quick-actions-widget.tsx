import React, { useContext } from 'react';
import { Zap, ShoppingCart, Heart, Package, Settings, CreditCard, Headphones, Truck } from 'lucide-react';
import { BaseWidget } from './base-widget';
import { Link } from 'wouter';
import { LanguageContext } from '@/hooks/use-translation-provider';

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

interface QuickActionsWidgetProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function QuickActionsWidget({
  onMoveUp,
  onMoveDown,
  onRemove,
  className
}: QuickActionsWidgetProps) {
  const { t } = useContext(LanguageContext);

  const quickActions: QuickAction[] = [
    {
      title: t('browseProducts'),
      icon: <ShoppingCart className="h-5 w-5" />,
      href: '/products',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    {
      title: t('myOrders'),
      icon: <Package className="h-5 w-5" />,
      href: '/user/orders',
      color: 'bg-green-500/10 text-green-400 border-green-500/30'
    },
    {
      title: t('wishlist'),
      icon: <Heart className="h-5 w-5" />,
      href: '/user/favorites',
      color: 'bg-red-500/10 text-red-400 border-red-500/30'
    },
    {
      title: t('trackOrder'),
      icon: <Truck className="h-5 w-5" />,
      href: '/user/track-order',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    },
    {
      title: t('paymentMethods'),
      icon: <CreditCard className="h-5 w-5" />,
      href: '/user/payment-methods',
      color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    },
    {
      title: t('accountSettings'),
      icon: <Settings className="h-5 w-5" />,
      href: '/user/settings',
      color: 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    },
    {
      title: t('support'),
      icon: <Headphones className="h-5 w-5" />,
      href: '/contact',
      color: 'bg-teal-500/10 text-teal-400 border-teal-500/30'
    },
    {
      title: t('deals'),
      icon: <Zap className="h-5 w-5" />,
      href: '/deals',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    }
  ];

  return (
    <BaseWidget
      title={t('quickActions')}
      description={t('quickActionsDescription')}
      icon={<Zap />}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onRemove={onRemove}
      className={className}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <Link 
            key={index} 
            href={action.href}
            className="no-underline"
          >
            <div className={`p-3 rounded-lg border ${action.color} flex flex-col items-center text-center h-full hover:scale-105 transition-transform cursor-pointer`}>
              <div className="mb-2">
                {action.icon}
              </div>
              <div className="text-sm font-medium">
                {action.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </BaseWidget>
  );
}