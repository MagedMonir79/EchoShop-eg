import React, { useState, useContext } from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LanguageContext } from '@/hooks/use-translation-provider';

export interface WidgetOption {
  id: string;
  name: string;
  enabled: boolean;
}

interface WidgetCustomizerProps {
  widgets: WidgetOption[];
  onSave: (widgets: WidgetOption[]) => void;
  className?: string;
}

export function WidgetCustomizer({
  widgets,
  onSave,
  className = ''
}: WidgetCustomizerProps) {
  const { t } = useContext(LanguageContext);
  const [localWidgets, setLocalWidgets] = useState<WidgetOption[]>(widgets);
  const [isOpen, setIsOpen] = useState(false);
  
  // Toggle widget selection
  const handleToggleWidget = (id: string) => {
    setLocalWidgets(localWidgets.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };
  
  // Save changes and close dialog
  const handleSave = () => {
    onSave(localWidgets);
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
            {localWidgets.map((widget) => (
              <div key={widget.id} className="flex items-center space-x-3 p-3 bg-darkBlue rounded-md border border-gray-700">
                <Checkbox 
                  id={`widget-${widget.id}`} 
                  checked={widget.enabled}
                  onCheckedChange={() => handleToggleWidget(widget.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-black"
                />
                <Label htmlFor={`widget-${widget.id}`} className="cursor-pointer text-gray-300">
                  {widget.name}
                </Label>
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