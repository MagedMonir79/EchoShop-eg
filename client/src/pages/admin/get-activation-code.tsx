import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';

export default function GetActivationCode() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activationCode, setActivationCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [error, setError] = useState('');

  // استدعاء API للحصول على رمز تفعيل أولي
  useEffect(() => {
    const fetchActivationCode = async () => {
      try {
        setIsLoading(true);
        const res = await apiRequest('GET', '/api/admin/create-initial-code');
        const data = await res.json();

        if (data.success) {
          setActivationCode(data.data.activationCode);
          setExpiresAt(new Date(data.data.expiresAt).toLocaleDateString());
        } else {
          setError(data.message || 'حدث خطأ أثناء إنشاء رمز التفعيل');
        }
      } catch (err) {
        console.error('Error fetching activation code:', err);
        setError('حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة مرة أخرى');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivationCode();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">رمز تفعيل المدير</CardTitle>
          <CardDescription>استخدم هذا الرمز للدخول إلى لوحة تحكم المدير</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-50 rounded-md">
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                المحاولة مرة أخرى
              </Button>
            </div>
          ) : (
            <div className="space-y-6 p-4">
              <div className="text-center">
                <p className="text-gray-500 mb-2">رمز التفعيل الخاص بك:</p>
                <div className="bg-gray-100 p-4 rounded-md font-mono text-2xl text-primary font-bold select-all border border-primary/20">
                  {activationCode}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  صالح حتى: {expiresAt}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">هام:</h4>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>هذا الرمز يستخدم لمرة واحدة فقط.</li>
                  <li>احفظ هذا الرمز في مكان آمن.</li>
                  <li>بعد استخدام هذا الرمز، يمكنك إنشاء رموز جديدة من لوحة تحكم المدير.</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            العودة للصفحة الرئيسية
          </Button>
          <Button
            onClick={() => navigate('/admin/login')}
            disabled={isLoading || !!error}
          >
            الذهاب إلى صفحة تسجيل الدخول
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}