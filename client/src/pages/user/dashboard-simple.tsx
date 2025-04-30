import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'wouter';
import { LanguageContext } from '@/hooks/use-translation-provider';
import { useAuth } from '@/hooks/use-auth';
import { useFirebaseAuth } from '@/hooks/firebase-auth';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, User, Bell, Package, Heart, Star, ShoppingCart, Play } from 'lucide-react';
import { WidgetOption, WidgetCustomizer } from '@/components/dashboard/widget-customizer-simple';

// Define default widgets
const DEFAULT_WIDGETS: WidgetOption[] = [
  { id: 'accountSummary', name: 'Account Summary', enabled: true },
  { id: 'quickActions', name: 'Quick Actions', enabled: true },
  { id: 'recentOrders', name: 'Recent Orders', enabled: true },
  { id: 'favoriteProducts', name: 'Favorite Products', enabled: true },
];

// Mock orders data
const MOCK_ORDERS = [
  { id: 'ORD-1234', date: '2025-04-20', total: 150, status: 'delivered' },
  { id: 'ORD-5678', date: '2025-04-15', total: 89.99, status: 'processing' },
];

// Mock favorites data
const MOCK_FAVORITES = [
  { id: 1, name: 'Wireless Headphones', price: 129.99, rating: 4.5 },
  { id: 2, name: 'Smart Watch', price: 199.99, rating: 4.7 },
];

export default function Dashboard() {
  const { t } = useContext(LanguageContext);
  const { user } = useAuth();
  const { currentUser, userData, logout } = useFirebaseAuth();
  const { toast } = useToast();
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS);
  
  // Load saved widget configuration
  useEffect(() => {
    try {
      const savedWidgets = localStorage.getItem('dashboard_widgets');
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets));
      }
    } catch (error) {
      console.error('Failed to load saved widgets', error);
    }
  }, []);
  
  // Handle widget customization
  const handleSaveWidgets = (newWidgets: WidgetOption[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('dashboard_widgets', JSON.stringify(newWidgets));
    toast({
      title: t('dashboardUpdated'),
      description: t('dashboardUpdatedDescription'),
    });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('loggedOut'),
        description: t('loggedOutSuccessfully'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('errorLoggingOut'),
        variant: 'destructive',
      });
    }
  };

  // Redirect if not logged in
  if (!currentUser && !user) {
    return <Redirect to="/auth" />;
  }
  
  // Get user display info
  const displayName = currentUser?.displayName || userData?.displayName || user?.username || t('guest');
  const email = currentUser?.email || userData?.email || user?.email || '';
  const photoURL = currentUser?.photoURL || userData?.photoURL || '';
  
  // Check if widget is enabled
  const isWidgetEnabled = (id: string) => widgets.find(w => w.id === id)?.enabled || false;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t('welcomeBack')} {displayName}
            </h1>
            <p className="text-gray-400">
              {t('dashboardDescription')}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <WidgetCustomizer 
              widgets={widgets} 
              onSave={handleSaveWidgets} 
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-700 text-gray-400 hover:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
        
        <Separator className="mb-6 bg-gray-800" />
        
        {/* User Profile Overview */}
        {isWidgetEnabled('accountSummary') && (
          <Card className="bg-mediumBlue border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex items-center gap-4">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt={displayName} 
                      className="w-16 h-16 rounded-full border-2 border-primary"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-darkBlue border-2 border-primary flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  
                  <div>
                    <h2 className="text-xl font-bold text-white">{displayName}</h2>
                    <p className="text-gray-400 text-sm">{email}</p>
                  </div>
                </div>
                
                <Separator orientation="vertical" className="hidden md:block h-14 bg-gray-700" />
                
                <div className="flex-grow">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">{t('memberStatus')}</p>
                      <p className="text-primary font-semibold">{userData?.membership || 'Standard'}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">{t('lastLogin')}</p>
                      <p className="text-white">Today</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">{t('notificationCount')}</p>
                      <div className="flex items-center justify-center gap-1">
                        <Bell className="h-4 w-4 text-blue-400" />
                        <span className="text-white">3</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">{t('accountType')}</p>
                      <p className="text-white">{userData?.role || 'Customer'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Quick Actions */}
        {isWidgetEnabled('quickActions') && (
          <Card className="bg-mediumBlue border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">{t('quickActions')}</CardTitle>
              <CardDescription className="text-gray-400">{t('quickActionsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button asChild variant="outline" className="bg-darkBlue border-gray-700 flex flex-col h-24 p-2">
                  <Link href="/products">
                    <ShoppingCart className="h-6 w-6 mb-2 text-blue-400" />
                    <span className="text-sm">{t('browseProducts')}</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="bg-darkBlue border-gray-700 flex flex-col h-24 p-2">
                  <Link href="/user/orders">
                    <Package className="h-6 w-6 mb-2 text-green-400" />
                    <span className="text-sm">{t('myOrders')}</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="bg-darkBlue border-gray-700 flex flex-col h-24 p-2">
                  <Link href="/user/favorites">
                    <Heart className="h-6 w-6 mb-2 text-red-400" />
                    <span className="text-sm">{t('wishlist')}</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="bg-darkBlue border-gray-700 flex flex-col h-24 p-2">
                  <Link href="/play">
                    <Play className="h-6 w-6 mb-2 text-green-500" />
                    <span className="text-sm">Play</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          {isWidgetEnabled('recentOrders') && (
            <Card className="bg-mediumBlue border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{t('recentOrders')}</CardTitle>
                <CardDescription className="text-gray-400">{t('recentOrdersDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_ORDERS.map((order) => (
                    <div key={order.id} className="p-3 bg-darkBlue rounded-md border border-gray-700 flex justify-between">
                      <div>
                        <div className="font-medium text-white">{order.id}</div>
                        <div className="text-sm text-gray-400">{new Date(order.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">${order.total.toFixed(2)}</div>
                        <div className="text-xs px-2 py-1 rounded-full bg-opacity-20 inline-block"
                          style={{
                            backgroundColor: order.status === 'delivered' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: order.status === 'delivered' ? '#22c55e' : '#3b82f6'
                          }}
                        >
                          {t(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4 border-gray-700 text-primary">
                  <Link href="/user/orders">
                    {t('viewAllOrders')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Favorite Products */}
          {isWidgetEnabled('favoriteProducts') && (
            <Card className="bg-mediumBlue border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{t('favoriteProducts')}</CardTitle>
                <CardDescription className="text-gray-400">{t('favoriteProductsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_FAVORITES.map((product) => (
                    <div key={product.id} className="p-3 bg-darkBlue rounded-md border border-gray-700 flex justify-between">
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="flex items-center text-sm">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-gray-400">{product.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-primary">${product.price.toFixed(2)}</div>
                        <Button asChild variant="secondary" size="sm" className="text-xs mt-1 h-7 px-2">
                          <Link href={`/product/${product.id}?action=add-to-cart`}>
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            {t('addToCart')}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4 border-gray-700 text-primary">
                  <Link href="/user/favorites">
                    {t('viewAllFavorites')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}