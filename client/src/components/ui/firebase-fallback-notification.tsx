import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// هذا المكون يوفر إشعارًا للمستخدمين عندما يتم استخدام Firebase كبديل لـ API
export function FirebaseFallbackAlert() {
  const [showAlert, setShowAlert] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // سنستمع إلى أحداث محددة تشير إلى استخدام البديل من Firebase
    const handleFallbackUsed = () => {
      setShowAlert(true);
      toast({
        title: "انتبه: وضع الاتصال المحدود",
        description: "يتم استخدام البيانات المخزنة محليًا نظرًا لعدم توفر الخادم. بعض الميزات قد لا تعمل.",
        variant: "destructive",
        duration: 7000,
      });
    };

    // نستمع إلى أحداث مخصصة تشير إلى استخدام Firebase
    window.addEventListener('firebase-fallback-used', handleFallbackUsed);

    // نزيل مستمع الحدث عند تفكيك المكون
    return () => {
      window.removeEventListener('firebase-fallback-used', handleFallbackUsed);
    };
  }, [toast]);

  if (!showAlert) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>وضع الاتصال المحدود</AlertTitle>
      <AlertDescription>
        تعذر الاتصال بالخادم. يتم استخدام البيانات المخزنة محليًا. بعض الميزات مثل إضافة منتجات جديدة أو إجراء عمليات شراء قد لا تعمل.
      </AlertDescription>
    </Alert>
  );
}

// دالة لإطلاق حدث استخدام البديل من Firebase
export const notifyFallbackUsed = () => {
  window.dispatchEvent(new Event('firebase-fallback-used'));
};