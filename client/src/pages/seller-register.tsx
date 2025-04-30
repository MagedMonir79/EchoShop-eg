import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, ArrowLeft, Store, FileText, Upload, Clock } from 'lucide-react';
import { LanguageContext } from '@/hooks/use-translation-provider';

export default function SellerRegisterPage() {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const { language } = useContext(LanguageContext);
  const isArabic = language === 'ar';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      setSubmitted(true);
      toast({
        title: isArabic ? "تم تقديم طلبك بنجاح" : "Application Submitted Successfully",
        description: isArabic 
          ? "سيقوم فريقنا بمراجعة المستندات والتواصل معك قريبًا" 
          : "Our team will review your documents and contact you shortly",
        variant: "default",
      });
    }, 1500);
  };
  
  const pageTitle = isArabic ? "سجل كتاجر | EchoShop" : "Register as Seller | EchoShop";
  const backToHome = isArabic ? "العودة إلى الصفحة الرئيسية" : "Back to Homepage";
  const formTitle = isArabic ? "سجل كتاجر في EchoShop" : "Register as a Seller on EchoShop";
  const formDescription = isArabic 
    ? "قم بتحميل المستندات المطلوبة للتحقق من حسابك والبدء في البيع" 
    : "Upload the required documents to verify your account and start selling";
  
  const taxCardLabel = isArabic ? "البطاقة الضريبية" : "Tax Card";
  const commercialRegisterLabel = isArabic ? "السجل التجاري" : "Commercial Register";
  const businessDetailsLabel = isArabic ? "تفاصيل النشاط التجاري" : "Business Details";
  const businessDetailsPlaceholder = isArabic 
    ? "اكتب وصفًا موجزًا لنشاطك التجاري والمنتجات التي ترغب في بيعها"
    : "Write a brief description of your business and the products you want to sell";
  
  const submitButtonText = isArabic 
    ? (uploading ? "جارٍ الإرسال..." : "إرسال للمراجعة") 
    : (uploading ? "Submitting..." : "Submit for Review");
  
  const footerText = isArabic 
    ? "سيتم مراجعة طلبك من قبل فريق EchoShop وسيتم إعلامك بالنتيجة خلال 1-3 أيام عمل"
    : "Your application will be reviewed by the EchoShop team and you will be notified of the result within 1-3 business days";
  
  // Success view content
  const successTitle = isArabic ? "تم تقديم طلبك بنجاح!" : "Application Submitted Successfully!";
  const successMessage = isArabic 
    ? "شكرًا لاهتمامك بالبيع على EchoShop. سيقوم فريقنا بمراجعة معلوماتك في أقرب وقت ممكن."
    : "Thank you for your interest in selling on EchoShop. Our team will review your information as soon as possible.";
  const whatNextTitle = isArabic ? "ماذا بعد؟" : "What's Next?";
  const step1 = isArabic ? "سيقوم فريقنا بمراجعة المستندات خلال 1-3 أيام عمل" : "Our team will review your documents within 1-3 business days";
  const step2 = isArabic ? "ستتلقى بريدًا إلكترونيًا بتأكيد الموافقة" : "You'll receive an email confirming approval";
  const step3 = isArabic ? "قم بإعداد متجرك وإضافة المنتجات" : "Set up your store and add products";
  const step4 = isArabic ? "ابدأ البيع والربح مع EchoShop!" : "Start selling and earning with EchoShop!";
  const backToBrowsingText = isArabic ? "العودة إلى التسوق" : "Back to Shopping";
  const learnMoreText = isArabic ? "معرفة المزيد عن البيع" : "Learn More About Selling";
  
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white flex flex-col">
        <header className="bg-gray-800 py-4 px-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/">
              <h1 className="text-xl font-bold cursor-pointer">EchoShop</h1>
            </Link>
            <Link href="/" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              {!isArabic && <ArrowLeft className="h-4 w-4" />}
              {backToHome}
              {isArabic && <ArrowLeft className="h-4 w-4" />}
            </Link>
          </div>
        </header>
      
        <main className="flex-grow flex items-center justify-center p-6">
          {submitted ? (
            <Card className="w-full max-w-lg bg-gray-800 border-gray-700">
              <CardHeader className="text-center">
                <div className="mx-auto bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-400">{successTitle}</CardTitle>
                <CardDescription className="text-gray-300 mt-2">
                  {successMessage}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-300">{whatNextTitle}</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-gray-700 rounded-full p-1 mt-0.5">
                        <Clock className="h-4 w-4 text-blue-300" />
                      </div>
                      <span className="text-gray-300 text-sm">{step1}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-gray-700 rounded-full p-1 mt-0.5">
                        <FileText className="h-4 w-4 text-blue-300" />
                      </div>
                      <span className="text-gray-300 text-sm">{step2}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-gray-700 rounded-full p-1 mt-0.5">
                        <Store className="h-4 w-4 text-blue-300" />
                      </div>
                      <span className="text-gray-300 text-sm">{step3}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-gray-700 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-blue-300" />
                      </div>
                      <span className="text-gray-300 text-sm">{step4}</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="outline" className="flex-1 border-gray-600 text-white hover:bg-gray-700">
                    <Link href="/">
                      {backToBrowsingText}
                    </Link>
                  </Button>
                  <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/seller-learn-more">
                      {learnMoreText}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-blue-400">{formTitle}</CardTitle>
                <CardDescription className="text-gray-400">
                  {formDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxCard" className="text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-300" />
                      {taxCardLabel}
                    </Label>
                    <Input 
                      id="taxCard" 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      required 
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commercialRegister" className="text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-300" />
                      {commercialRegisterLabel}
                    </Label>
                    <Input 
                      id="commercialRegister" 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      required
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessDetails" className="text-white flex items-center gap-2">
                      <Store className="h-4 w-4 text-blue-300" />
                      {businessDetailsLabel}
                    </Label>
                    <textarea 
                      id="businessDetails" 
                      rows={3} 
                      className="w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
                      placeholder={businessDetailsPlaceholder}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2" 
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {submitButtonText}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-center text-sm text-gray-400">
                {footerText}
              </CardFooter>
            </Card>
          )}
        </main>
      </div>
    </>
  );
}