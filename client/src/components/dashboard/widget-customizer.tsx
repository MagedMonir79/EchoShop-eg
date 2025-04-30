import React, { useState, useContext } from 'react';
import { Settings, X, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LanguageContext } from '@/hooks/use-translation-provider';

interface WidgetOption {
  id: string;
  name: string;
  enabled: boolean;
}

interface WidgetCustomizerProps {
  availableWidgets: WidgetOption[];
  onSave: (widgets: WidgetOption[]) => void;
  className?: string;
}

export function WidgetCustomizer({
  availableWidgets,
  onSave,
  className
}: WidgetCustomizerProps) {
  const { t } = useContext(LanguageContext);
  const [widgets, setWidgets] = useState<WidgetOption[]>(availableWidgets);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };
  
  const handleSave = () => {
    onSave(widgets);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`border-gray-700 text-gray-400 hover:text-primary ${className}`}
        >
          <Settings className="h-4 w-4 mr-2" />
          {t('customizeWidgets')}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-mediumBlue border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{t('customizeWidgets')}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t('customizeWidgetsDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            {widgets.map((widget) => (
              <div key={widget.id} className="flex items-center justify-between p-3 bg-darkBlue rounded-md border border-gray-700">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id={`widget-${widget.id}`} 
                    checked={widget.enabled}
                    onCheckedChange={() => handleToggleWidget(widget.id)}
                    className="bg-gray-700 border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:text-black"
                  />
                  <Label htmlFor={`widget-${widget.id}`} className="cursor-pointer text-gray-300">
                    {widget.name}
                  </Label>
                </div>
                
                <div className="flex items-center">
                  {widget.enabled ? (
                    <div className="p-1 rounded-full bg-green-500/20 text-green-400">
                      <Plus className="h-3 w-3" />
                    </div>
                  ) : (
                    <div className="p-1 rounded-full bg-gray-500/20 text-gray-400">
                      <X className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90 text-black"
              onClick={handleSave}
            >
              {t('saveChanges')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}