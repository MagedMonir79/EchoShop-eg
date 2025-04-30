import React, { useContext } from 'react';
import { Heart, Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { BaseWidget } from './base-widget';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LanguageContext } from '@/hooks/use-translation-provider';

// Mock favorite products data
const mockFavoriteProducts = [
  {
    id: 1,
    name: 'Wireless Noise Cancelling Headphones',
    price: 149.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 2,
    name: 'Smartphone Stabilizer Gimbal',
    price: 89.95,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=684&q=80'
  },
  {
    id: 3,
    name: 'Smart Watch Series 5',
    price: 279.00,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80'
  }
];

interface FavoriteProductsWidgetProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function FavoriteProductsWidget({ 
  onMoveUp, 
  onMoveDown, 
  onRemove,
  className
}: FavoriteProductsWidgetProps) {
  const { t } = useContext(LanguageContext);
  
  return (
    <BaseWidget
      title={t('favoriteProducts')}
      description={t('favoriteProductsDescription')}
      icon={<Heart className="text-red-400" />}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onRemove={onRemove}
      className={className}
    >
      <div className="space-y-4">
        {mockFavoriteProducts.length > 0 ? (
          <div className="space-y-3">
            {mockFavoriteProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex p-3 bg-darkBlue rounded-md border border-gray-700 gap-3"
              >
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <Link 
                    href={`/product/${product.id}`}
                    className="font-medium text-white hover:text-primary truncate block"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center gap-1 mr-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-300">{product.rating}</span>
                    </div>
                    <div className="text-primary font-semibold">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-start">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-7 px-2 rounded-full text-xs flex items-center gap-1"
                      asChild
                    >
                      <Link href={`/product/${product.id}`}>
                        <ShoppingCart className="h-3 w-3" />
                        {t('addToCart')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Heart className="h-12 w-12 text-gray-600 mb-3" />
            <h3 className="text-gray-300 font-medium mb-2">{t('noFavoriteProducts')}</h3>
            <p className="text-gray-400 text-sm mb-4">{t('noFavoriteProductsDescription')}</p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 border-gray-700 text-primary hover:text-primary hover:bg-primary/10"
          asChild
        >
          <Link href="/user/favorites">
            {t('viewAllFavorites')} <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </BaseWidget>
  );
}