import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SimpleActivationCode() {
  const [, navigate] = useLocation();
  
  // رمز تفعيل ثابت للتجربة فقط - في الإنتاج يجب استخدام الرمز من API
  const activationCode = "ADMIN1234";
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">رمز تفعيل المدير</CardTitle>
          <CardDescription>استخدم هذا الرمز للدخول إلى لوحة تحكم المدير</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 p-4">
            <div className="text-center">
              <p className="text-gray-500 mb-2">رمز التفعيل الخاص بك:</p>
              <div className="bg-gray-100 p-4 rounded-md font-mono text-2xl text-primary font-bold select-all border border-primary/20">
                {activationCode}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                صالح حتى: {expiresAt.toLocaleDateString()}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">هام:</h4>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>هذا الرمز للتجربة فقط ويستخدم لمرة واحدة.</li>
                <li>احفظ هذا الرمز في مكان آمن.</li>
                <li>استخدم "ADMIN1234" كرمز تفعيل في صفحة تسجيل الدخول.</li>
              </ul>
            </div>
          </div>
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
          >
            الذهاب إلى صفحة تسجيل الدخول
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}