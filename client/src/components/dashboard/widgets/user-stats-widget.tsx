import React, { useContext } from 'react';
import { User, Package, Heart, CreditCard } from 'lucide-react';
import { BaseWidget } from './base-widget';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';
import { LanguageContext } from '@/hooks/use-translation-provider';

// Mock user stats
const mockUserStats = {
  orderCount: 12,
  favoriteCount: 24,
  reviewCount: 8,
  pointsBalance: 350
};

interface UserStatsWidgetProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function UserStatsWidget({
  onMoveUp,
  onMoveDown,
  onRemove,
  className
}: UserStatsWidgetProps) {
  const { t } = useContext(LanguageContext);
  
  return (
    <BaseWidget
      title={t('userStats')}
      icon={<User />}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onRemove={onRemove}
      className={className}
    >
      <div className="grid grid-cols-2 gap-4">
        <Link href="/user/orders" className="no-underline">
          <div className="bg-darkBlue hover:bg-darkBlue/80 border border-gray-700 p-3 rounded-lg transition-colors cursor-pointer h-full">
            <div className="mb-2 flex items-center gap-2">
              <Package className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">{t('orders')}</span>
            </div>
            <div className="text-2xl font-semibold text-white">{mockUserStats.orderCount}</div>
          </div>
        </Link>
        
        <Link href="/user/favorites" className="no-underline">
          <div className="bg-darkBlue hover:bg-darkBlue/80 border border-gray-700 p-3 rounded-lg transition-colors cursor-pointer h-full">
            <div className="mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-sm text-gray-300">{t('favorites')}</span>
            </div>
            <div className="text-2xl font-semibold text-white">{mockUserStats.favoriteCount}</div>
          </div>
        </Link>
        
        <Link href="/user/reviews" className="no-underline">
          <div className="bg-darkBlue hover:bg-darkBlue/80 border border-gray-700 p-3 rounded-lg transition-colors cursor-pointer h-full">
            <div className="mb-2 flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-yellow-400" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-sm text-gray-300">{t('reviews')}</span>
            </div>
            <div className="text-2xl font-semibold text-white">{mockUserStats.reviewCount}</div>
          </div>
        </Link>
        
        <Link href="/user/rewards" className="no-underline">
          <div className="bg-darkBlue hover:bg-darkBlue/80 border border-gray-700 p-3 rounded-lg transition-colors cursor-pointer h-full">
            <div className="mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300">{t('rewardPoints')}</span>
            </div>
            <div className="text-2xl font-semibold text-white">{mockUserStats.pointsBalance}</div>
          </div>
        </Link>
      </div>
      
      <Separator className="my-4 bg-gray-700" />
      
      <div className="text-sm text-center">
        <span className="text-gray-400">
          {t('memberSince')}: <span className="text-gray-300">Apr 2023</span>
        </span>
      </div>
    </BaseWidget>
  );
}