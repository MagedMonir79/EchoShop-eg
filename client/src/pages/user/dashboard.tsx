import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { LanguageContext } from '@/hooks/use-translation-provider';
import { useAuth } from '@/hooks/use-auth';
import { useFirebaseAuth } from '@/hooks/firebase-auth';
import { 
  QuickActionsWidget, 
  UserStatsWidget, 
  RecentOrdersWidget, 
  FavoriteProductsWidget 
} from '@/components/dashboard/widgets';
import { WidgetCustomizer } from '@/components/dashboard/widget-customizer';
import { Separator } from '@/components/ui/separator';
import { User, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Redirect } from 'wouter';

// Widget options
const defaultWidgetsConfig = [
  { id: 'quickActions', name: 'Quick Actions', enabled: true },
  { id: 'userStats', name: 'Account Stats', enabled: true },
  { id: 'recentOrders', name: 'Recent Orders', enabled: true },
  { id: 'favoriteProducts', name: 'Favorite Products', enabled: true },
];

export default function UserDashboard() {
  const { t } = useContext(LanguageContext);
  const { user } = useAuth();
  const { currentUser, userData, logout } = useFirebaseAuth();
  const { toast } = useToast();
  const [widgets, setWidgets] = useState(defaultWidgetsConfig);
  
  // Load saved widget configuration
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboard_widgets');
    if (savedWidgets) {
      try {
        setWidgets(JSON.parse(savedWidgets));
      } catch (error) {
        console.error('Failed to parse saved widgets', error);
      }
    }
  }, []);
  
  // Save widget configuration
  const handleSaveWidgets = (newWidgets: typeof widgets) => {
    setWidgets(newWidgets);
    localStorage.setItem('dashboard_widgets', JSON.stringify(newWidgets));
    toast({
      title: t('dashboardUpdated'),
      description: t('dashboardUpdatedDescription'),
    });
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('loggedOut'),
        description: t('loggedOutSuccessfully'),
      });
    } catch (error: any) {
      toast({
        title: t('error'),
        description: t('errorLoggingOut'),
        variant: 'destructive',
      });
    }
  };
  
  // If no user is logged in, redirect to login page
  if (!currentUser && !user) {
    return <Redirect to="/auth" />;
  }
  
  // Get actual user data
  const displayName = currentUser?.displayName || userData?.displayName || user?.username || t('guest');
  const email = currentUser?.email || userData?.email || user?.email || '';
  const photoURL = currentUser?.photoURL || userData?.photoURL || '';
  
  // Determine if widget should be shown
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
              availableWidgets={widgets} 
              onSave={handleSaveWidgets} 
              className="mr-2"
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
        <div className="bg-mediumBlue border border-gray-700 rounded-lg p-4 md:p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
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
        
        {/* Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - Full Width */}
          {isWidgetEnabled('quickActions') && (
            <div className="lg:col-span-3">
              <QuickActionsWidget />
            </div>
          )}
          
          {/* User Stats */}
          {isWidgetEnabled('userStats') && (
            <div className="">
              <UserStatsWidget />
            </div>
          )}
          
          {/* Recent Orders */}
          {isWidgetEnabled('recentOrders') && (
            <div className="">
              <RecentOrdersWidget />
            </div>
          )}
          
          {/* Favorite Products */}
          {isWidgetEnabled('favoriteProducts') && (
            <div className="">
              <FavoriteProductsWidget />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}