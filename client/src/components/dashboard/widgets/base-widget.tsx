import React, { ReactNode } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BaseWidgetProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function BaseWidget({
  title,
  description,
  icon,
  children,
  onMoveUp,
  onMoveDown,
  onRemove,
  className = ''
}: BaseWidgetProps) {
  return (
    <Card className={`bg-mediumBlue border-gray-700 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
            {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
          </div>
        </div>
        
        {(onMoveUp || onMoveDown || onRemove) && (
          <div className="flex items-center space-x-1">
            {onMoveUp && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={onMoveUp}
              >
                <ChevronUp className="h-4 w-4" />
                <span className="sr-only">Move up</span>
              </Button>
            )}
            
            {onMoveDown && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={onMoveDown}
              >
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Move down</span>
              </Button>
            )}
            
            {onRemove && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-700"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}