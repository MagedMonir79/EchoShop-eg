import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { Redirect, Route } from 'wouter';

// Protected route props
interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  adminOnly?: boolean;
}

// Protected route component
export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  
  return (
    <Route path={path}>
      {() => {
        // Show loading indicator
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }
        
        // Redirect if not authenticated
        if (!user) {
          // يمكن للمستخدم اختيار استخدام مصادقة Firebase أو Supabase
          return <Redirect to="/supabase-auth" />;
        }
        
        // Check for admin role if required
        if (adminOnly && user.role !== 'admin') {
          return <Redirect to="/" />;
        }
        
        // Render the protected component
        return <Component />;
      }}
    </Route>
  );
}