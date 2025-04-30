import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { CheckCircle, Award, TrendingUp, Package, Tag, Shield } from 'lucide-react';

export default function SellerLearnMorePage() {
  return (
    <>
      <Helmet>
        <title>تعرف على المزيد | البيع في EchoShop</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white flex flex-col">
        <header className="bg-gray-800 py-4 px-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">EchoShop</h1>
            <a href="/" className="text-sm text-blue-400 hover:text-blue-300">العودة إلى الصفحة الرئيسية</a>
          </div>
        </header>
      
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="py-24 px-6 text-center bg-gradient-to-r from-blue-900 to-indigo-900">
            <div className="container mx-auto max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">ابدأ رحلة البيع مع EchoShop</h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300">
                انضم إلى آلاف التجار الناجحين في مصر واصل إلى ملايين العملاء المحتملين
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8">
                  <Link href="/seller-register">سجل الآن</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <a href="#benefits">تعرف على المزايا</a>
                </Button>
              </div>
            </div>
          </section>
          
          {/* Benefits */}
          <section id="benefits" className="py-16 px-6 bg-gray-800">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">لماذا تبيع على EchoShop؟</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-8 w-8 text-green-400 mr-3" />
                    <h3 className="text-xl font-semibold">نمو سريع</h3>
                  </div>
                  <p className="text-gray-300">
                    انضم إلى منصة التجارة الإلكترونية الأسرع نموًا في مصر وحقق مبيعات تتجاوز توقعاتك.
                  </p>
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Package className="h-8 w-8 text-blue-400 mr-3" />
                    <h3 className="text-xl font-semibold">خدمات لوجستية متكاملة</h3>
                  </div>
                  <p className="text-gray-300">
                    لا تقلق بشأن الشحن والتخزين. نوفر لك خدمات لوجستية شاملة تغطي جميع محافظات مصر.
                  </p>
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Tag className="h-8 w-8 text-yellow-400 mr-3" />
                    <h3 className="text-xl font-semibold">عمولات تنافسية</h3>
                  </div>
                  <p className="text-gray-300">
                    استفد من أفضل نسب عمولة في السوق المصري، بدءًا من 5% فقط من قيمة المبيعات.
                  </p>
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Shield className="h-8 w-8 text-red-400 mr-3" />
                    <h3 className="text-xl font-semibold">حماية البائع</h3>
                  </div>
                  <p className="text-gray-300">
                    نضمن حقوقك كبائع مع سياسات عادلة للمرتجعات وحماية من الاحتيال.
                  </p>
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Award className="h-8 w-8 text-purple-400 mr-3" />
                    <h3 className="text-xl font-semibold">برنامج البائع المميز</h3>
                  </div>
                  <p className="text-gray-300">
                    تأهل لمزايا حصرية وتخفيضات على العمولات من خلال برنامج البائع المميز.
                  </p>
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-8 w-8 text-teal-400 mr-3" />
                    <h3 className="text-xl font-semibold">مدفوعات سريعة وآمنة</h3>
                  </div>
                  <p className="text-gray-300">
                    احصل على مدفوعاتك بسرعة وأمان. تحويلات أسبوعية لأرباحك إلى حسابك البنكي.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Steps */}
          <section className="py-16 px-6 bg-gray-900">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12">خطوات البدء في البيع</h2>
              
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-blue-900 w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold shrink-0">1</div>
                  <div className="md:flex-1">
                    <h3 className="text-xl font-semibold mb-2">التسجيل وتقديم المستندات</h3>
                    <p className="text-gray-300">
                      أنشئ حسابك كتاجر وقم بتحميل المستندات المطلوبة (البطاقة الضريبية والسجل التجاري).
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-blue-900 w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold shrink-0">2</div>
                  <div className="md:flex-1">
                    <h3 className="text-xl font-semibold mb-2">التحقق والموافقة</h3>
                    <p className="text-gray-300">
                      سيقوم فريقنا بمراجعة مستنداتك والتواصل معك خلال 1-3 أيام عمل للموافقة على حسابك.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-blue-900 w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold shrink-0">3</div>
                  <div className="md:flex-1">
                    <h3 className="text-xl font-semibold mb-2">إعداد متجرك وإضافة المنتجات</h3>
                    <p className="text-gray-300">
                      قم بتخصيص صفحة متجرك وأضف منتجاتك مع الصور والأوصاف والأسعار.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-blue-900 w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold shrink-0">4</div>
                  <div className="md:flex-1">
                    <h3 className="text-xl font-semibold mb-2">ابدأ البيع وتتبع أدائك</h3>
                    <p className="text-gray-300">
                      استخدم لوحة تحكم البائع لإدارة مخزونك ومتابعة الطلبات وتحليل أداء مبيعاتك.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8">
                  <Link href="/seller-register">ابدأ الآن</Link>
                </Button>
              </div>
            </div>
          </section>
          
          {/* FAQ */}
          <section className="py-16 px-6 bg-gray-800">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12">الأسئلة الشائعة</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">ما هي المستندات المطلوبة للبيع على EchoShop؟</h3>
                  <p className="text-gray-300">
                    تحتاج إلى تقديم البطاقة الضريبية والسجل التجاري الخاص بنشاطك. في حالة عدم امتلاكك لهذه المستندات، يمكنك التواصل معنا للمساعدة.
                  </p>
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">كم تبلغ نسبة العمولة على المبيعات؟</h3>
                  <p className="text-gray-300">
                    تبدأ نسبة العمولة من 5% وتختلف حسب فئة المنتج. كلما زادت مبيعاتك، كلما انخفضت نسبة العمولة التي تدفعها.
                  </p>
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">متى أحصل على أرباحي؟</h3>
                  <p className="text-gray-300">
                    يتم تحويل الأرباح بشكل أسبوعي إلى حسابك البنكي المسجل لدينا. يمكنك متابعة المبيعات والأرباح من خلال لوحة تحكم البائع.
                  </p>
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">هل يمكنني البيع من أي محافظة في مصر؟</h3>
                  <p className="text-gray-300">
                    نعم، يمكنك البيع من أي محافظة في مصر. خدماتنا اللوجستية تغطي جميع المحافظات.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA */}
          <section className="py-20 px-6 text-center bg-gradient-to-r from-blue-900 to-indigo-900">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">جاهز للانطلاق في رحلة البيع؟</h2>
              <p className="text-xl mb-8 text-gray-300">
                انضم إلى مجتمع EchoShop للبائعين وابدأ في تنمية عملك التجاري اليوم
              </p>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-6 text-xl">
                <Link href="/seller-register">سجل كتاجر الآن</Link>
              </Button>
            </div>
          </section>
        </main>
        
        <footer className="bg-gray-900 py-6 px-6 text-center text-gray-400">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} EchoShop</p>
        </footer>
      </div>
    </>
  );
}