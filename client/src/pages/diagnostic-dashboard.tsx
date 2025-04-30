import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SupabaseStatus } from '@/components/supabase-status';
import { supabase } from '@/lib/supabaseClient';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useState } from 'react';
import { Loader2, Server, Database, CloudCog, LayoutDashboard } from 'lucide-react';

// تكوين Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export default function DiagnosticDashboard() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'error'>('checking');
  const [serverMessage, setServerMessage] = useState('جاري التحقق من حالة الخادم...');
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);
  const [firebaseResult, setFirebaseResult] = useState<any>(null);
  const [environmentVariables, setEnvironmentVariables] = useState({
    NODE_ENV: import.meta.env.NODE_ENV || 'غير محدد',
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'متوفر' : 'غير متوفر',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'متوفر' : 'غير متوفر',
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? 'متوفر' : 'غير متوفر',
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'غير محدد',
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? 'متوفر' : 'غير متوفر',
  });

  // التحقق من حالة الخادم
  const checkServerStatus = async () => {
    setServerStatus('checking');
    setServerMessage('جاري التحقق من حالة الخادم...');
    
    try {
      const start = performance.now();
      const response = await fetch('/api/user');
      const end = performance.now();
      
      if (response.ok) {
        setServerStatus('online');
        setServerMessage(`الخادم يعمل بشكل طبيعي (${Math.round(end - start)}ms)`);
      } else {
        setServerStatus('error');
        setServerMessage(`خطأ في الاستجابة: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      setServerStatus('error');
      setServerMessage(`خطأ في الاتصال بالخادم: ${err.message}`);
    }
  };
  
  // اختبار Firebase
  const testFirebaseConnection = async () => {
    setIsTestingFirebase(true);
    setFirebaseResult(null);
    
    try {
      // تهيئة تطبيق Firebase
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      
      // محاولة تسجيل الدخول كمجهول للتحقق من الاتصال
      const start = performance.now();
      const result = await signInAnonymously(auth);
      const end = performance.now();
      
      // تسجيل الخروج مباشرة
      await auth.signOut();
      
      setFirebaseResult({
        success: true,
        responseTime: Math.round(end - start),
        message: 'تم الاتصال بـ Firebase بنجاح',
        uid: result.user?.uid?.substring(0, 8) + '...'
      });
    } catch (err: any) {
      setFirebaseResult({
        success: false,
        message: `خطأ في الاتصال بـ Firebase: ${err.message}`,
        code: err.code
      });
    } finally {
      setIsTestingFirebase(false);
    }
  };
  
  React.useEffect(() => {
    checkServerStatus();
  }, []);

  return (
    <div className="container py-8 mx-auto max-w-6xl" dir="rtl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">لوحة تشخيص EchoShop</h1>
        <p className="text-muted-foreground">استخدم هذه الصفحة للتحقق من حالة الاتصالات والأنظمة في التطبيق</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5" />
              حالة الخادم
            </CardTitle>
            <CardDescription>التحقق من اتصال خادم التطبيق (API)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              {serverStatus === 'checking' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : serverStatus === 'online' ? (
                <Badge className="bg-green-500">متصل</Badge>
              ) : (
                <Badge variant="destructive">خطأ</Badge>
              )}
              <span className="text-sm">{serverMessage}</span>
            </div>
            <Button 
              onClick={checkServerStatus} 
              disabled={serverStatus === 'checking'}
              variant="outline"
              size="sm"
              className="w-full"
            >
              إعادة التحقق
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              حالة Supabase
            </CardTitle>
            <CardDescription>التحقق من اتصال قاعدة البيانات</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <SupabaseStatus />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CloudCog className="h-5 w-5" />
              حالة Firebase
            </CardTitle>
            <CardDescription>التحقق من اتصال خدمات Firebase</CardDescription>
          </CardHeader>
          <CardContent>
            {firebaseResult ? (
              <div className="mb-4">
                {firebaseResult.success ? (
                  <div className="text-sm space-y-2">
                    <Badge className="bg-green-500 mb-1">متصل</Badge>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">زمن الاستجابة:</span>
                      <span>{firebaseResult.responseTime}ms</span>
                    </div>
                    {firebaseResult.uid && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">معرف المستخدم:</span>
                        <span>{firebaseResult.uid}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm">
                    <Badge variant="destructive" className="mb-2">خطأ</Badge>
                    <p className="text-sm text-red-500">{firebaseResult.message}</p>
                    {firebaseResult.code && (
                      <p className="text-xs text-muted-foreground mt-1">رمز الخطأ: {firebaseResult.code}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-2 mb-4">
                <span className="text-sm text-muted-foreground">لم يتم إجراء اختبار بعد</span>
              </div>
            )}
            
            <Button 
              onClick={testFirebaseConnection} 
              disabled={isTestingFirebase}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isTestingFirebase && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              اختبار الاتصال
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="environment" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="environment">متغيرات البيئة</TabsTrigger>
          <TabsTrigger value="browser">معلومات المتصفح</TabsTrigger>
        </TabsList>
        
        <TabsContent value="environment">
          <Card>
            <CardHeader>
              <CardTitle>متغيرات البيئة</CardTitle>
              <CardDescription>المتغيرات البيئية المتاحة للتطبيق</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-2 px-3 font-medium">المتغير</th>
                      <th className="text-right py-2 px-3 font-medium">القيمة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(environmentVariables).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0">
                        <td className="py-2 px-3 font-mono text-sm">{key}</td>
                        <td className="py-2 px-3">
                          {typeof value === 'string' && value.includes('متوفر') ? (
                            <Badge variant={value === 'متوفر' ? 'default' : 'outline'}>
                              {value}
                            </Badge>
                          ) : (
                            value
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="browser">
          <Card>
            <CardHeader>
              <CardTitle>معلومات المتصفح</CardTitle>
              <CardDescription>بيئة تشغيل التطبيق في المتصفح</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">المتصفح والجهاز</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">نوع المتصفح:</span>
                      <span>{navigator.userAgent.split(' ').slice(-1)[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">نظام التشغيل:</span>
                      <span>{
                        /Windows/.test(navigator.userAgent) ? 'Windows' :
                        /Mac/.test(navigator.userAgent) ? 'MacOS' :
                        /Linux/.test(navigator.userAgent) ? 'Linux' :
                        /Android/.test(navigator.userAgent) ? 'Android' :
                        /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'iOS' :
                        'غير معروف'
                      }</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">اللغة المفضلة:</span>
                      <span>{navigator.language}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">الاتصال والشبكة</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">عنوان الصفحة الحالي:</span>
                      <span className="font-mono text-xs">{window.location.pathname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المضيف:</span>
                      <span className="font-mono text-xs">{window.location.host}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">بروتوكول:</span>
                      <span>{window.location.protocol}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-center">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          <LayoutDashboard className="h-4 w-4 ml-2" />
          العودة إلى التطبيق
        </Button>
      </div>
    </div>
  );
}