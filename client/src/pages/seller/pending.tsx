import { useContext } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangleIcon, CheckCircleIcon, RefreshCwIcon } from "lucide-react";
import { Link } from "wouter";

export default function SellerPendingPage() {
  const { user } = useContext(AuthContext);
  const { language, t } = useContext(LanguageContext);
  const isRTL = language === "ar";
  const [, navigate] = useLocation();
  
  const { data: sellerApplication, isLoading, isError, refetch } = useQuery({
    queryKey: ["/api/sellers/application", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const response = await fetch(`/api/sellers/application/${user.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch seller application");
      }
      return await response.json();
    },
    enabled: !!user?.id,
  });
  
  const redirectToHome = () => {
    navigate("/");
  };
  
  const redirectToRegister = () => {
    navigate("/seller/register");
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          {isRTL ? "جاري التحميل..." : "Loading..."}
        </p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-3xl mx-auto shadow-md">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangleIcon className="mr-2 h-5 w-5" />
              {isRTL ? "حدث خطأ" : "Error Occurred"}
            </CardTitle>
            <CardDescription>
              {isRTL 
                ? "لم نتمكن من تحميل معلومات طلب البائع الخاص بك. يرجى المحاولة مرة أخرى."
                : "We couldn't load your seller application information. Please try again."}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between py-4">
            <Button variant="outline" onClick={redirectToHome}>
              {isRTL ? "العودة إلى الرئيسية" : "Back to Home"}
            </Button>
            <Button onClick={() => refetch()}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              {isRTL ? "إعادة المحاولة" : "Try Again"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (!sellerApplication) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-3xl mx-auto shadow-md">
          <CardHeader className="bg-muted/50">
            <CardTitle>
              {isRTL ? "لم يتم العثور على طلب" : "No Application Found"}
            </CardTitle>
            <CardDescription>
              {isRTL 
                ? "لم نتمكن من العثور على طلب بائع مقدم من حسابك. يمكنك التقديم كبائع لبدء بيع منتجاتك على EchoShop."
                : "We couldn't find a seller application submitted from your account. You can apply as a seller to start selling your products on EchoShop."}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between py-4">
            <Button variant="outline" onClick={redirectToHome}>
              {isRTL ? "العودة إلى الرئيسية" : "Back to Home"}
            </Button>
            <Button onClick={redirectToRegister}>
              {isRTL ? "التقديم كبائع" : "Apply as Seller"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Determine the status badge color and icon
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
          icon: <AlertTriangleIcon className="h-4 w-4 mr-1" />,
          label: isRTL ? "قيد المراجعة" : "Under Review"
        };
      case "approved":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
          icon: <CheckCircleIcon className="h-4 w-4 mr-1" />,
          label: isRTL ? "تمت الموافقة" : "Approved"
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
          icon: <AlertTriangleIcon className="h-4 w-4 mr-1" />,
          label: isRTL ? "مرفوض" : "Rejected"
        };
      case "incomplete":
        return {
          color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500",
          icon: <AlertTriangleIcon className="h-4 w-4 mr-1" />,
          label: isRTL ? "غير مكتمل" : "Incomplete"
        };
      default:
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
          icon: <RefreshCwIcon className="h-4 w-4 mr-1" />,
          label: isRTL ? "قيد المعالجة" : "Processing"
        };
    }
  };
  
  const statusDetails = getStatusDetails(sellerApplication?.status || "pending");
  
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto shadow-md">
        <CardHeader className={`${sellerApplication?.status === "approved" ? "bg-green-50 dark:bg-green-950/20" : "bg-yellow-50 dark:bg-yellow-950/20"}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {isRTL ? "حالة طلب البائع" : "Seller Application Status"}
              </CardTitle>
              <CardDescription className="mt-1">
                {isRTL 
                  ? "مرحبًا بك في رحلتك نحو بيع منتجاتك على EchoShop!"
                  : "Welcome to your journey towards selling on EchoShop!"}
              </CardDescription>
            </div>
            <div className={`px-3 py-1 rounded-full flex items-center ${statusDetails.color}`}>
              {statusDetails.icon}
              <span>{statusDetails.label}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className={`font-medium text-lg mb-2 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? "تفاصيل الطلب" : "Application Details"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? "تاريخ التقديم" : "Submission Date"}
                  </div>
                  <div className="font-medium">
                    {new Date(sellerApplication?.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? "اسم المتجر" : "Store Name"}
                  </div>
                  <div className="font-medium">
                    {sellerApplication?.storeName}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? "نوع النشاط" : "Business Type"}
                  </div>
                  <div className="font-medium">
                    {sellerApplication?.businessType === "individual" ? (isRTL ? "فرد/شخصي" : "Individual/Personal") :
                      sellerApplication?.businessType === "company" ? (isRTL ? "شركة" : "Company") :
                      sellerApplication?.businessType === "factory" ? (isRTL ? "مصنع" : "Factory") :
                      sellerApplication?.businessType === "reseller" ? (isRTL ? "وسيط/موزع" : "Reseller/Distributor") :
                      sellerApplication?.businessType === "dropshipper" ? (isRTL ? "دروبشيبر" : "Dropshipper") : 
                      sellerApplication?.businessType}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? "رقم الاستعلام" : "Application ID"}
                  </div>
                  <div className="font-medium">
                    #{sellerApplication?.id}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className={`h-6 w-6 ${sellerApplication?.status === "pending" ? "animate-spin" : ""} text-primary`} />
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">
                    {isRTL ? "حالة طلبك" : "Your Application Status"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {sellerApplication?.status === "pending" ? (
                      isRTL 
                        ? "طلبك قيد المراجعة من قبل فريقنا. سنخطرك بمجرد اتخاذ قرار."
                        : "Your application is being reviewed by our team. We'll notify you once a decision is made."
                    ) : sellerApplication?.status === "incomplete" ? (
                      isRTL 
                        ? "هناك معلومات مفقودة في طلبك. يرجى التحقق من بريدك الإلكتروني للحصول على التفاصيل."
                        : "There is missing information in your application. Please check your email for details."
                    ) : sellerApplication?.status === "approved" ? (
                      isRTL 
                        ? "تهانينا! تمت الموافقة على طلبك. يمكنك الآن بدء إضافة منتجاتك."
                        : "Congratulations! Your application has been approved. You can now start adding your products."
                    ) : sellerApplication?.status === "rejected" ? (
                      isRTL 
                        ? "للأسف، تم رفض طلبك. يرجى مراجعة بريدك الإلكتروني للحصول على مزيد من المعلومات."
                        : "Unfortunately, your application has been rejected. Please check your email for more information."
                    ) : (
                      isRTL 
                        ? "طلبك قيد المعالجة."
                        : "Your application is being processed."
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {sellerApplication?.status === "incomplete" && (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30 p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-500 mb-2">
                  {isRTL ? "معلومات مفقودة" : "Missing Information"}
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  {isRTL 
                    ? "لقد وجدنا أن بعض المعلومات مفقودة في طلبك. يرجى تحديث طلبك بالمعلومات التالية:"
                    : "We found that some information is missing in your application. Please update your application with the following information:"}
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                  {sellerApplication?.missingDocuments?.map((doc: string, index: number) => (
                    <li key={index}>
                      {doc === "identityDocument" ? (isRTL ? "بطاقة الهوية الشخصية" : "Identity Document") :
                       doc === "taxDocument" ? (isRTL ? "البطاقة الضريبية" : "Tax Card") :
                       doc === "commercialDocument" ? (isRTL ? "السجل التجاري" : "Commercial Registry") : doc}
                    </li>
                  ))}
                  {sellerApplication?.missingFields?.map((field: string, index: number) => (
                    <li key={`field-${index}`}>
                      {field === "phone" ? (isRTL ? "رقم الهاتف" : "Phone Number") :
                       field === "address" ? (isRTL ? "العنوان" : "Address") :
                       field === "storeName" ? (isRTL ? "اسم المتجر" : "Store Name") :
                       field === "businessType" ? (isRTL ? "نوع النشاط التجاري" : "Business Type") : field}
                    </li>
                  ))}
                </ul>
                <Button className="mt-3" onClick={redirectToRegister}>
                  {isRTL ? "تحديث الطلب" : "Update Application"}
                </Button>
              </div>
            )}
            
            {sellerApplication?.status === "approved" && (
              <div className="rounded-md border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30 p-4">
                <h4 className="font-medium text-green-800 dark:text-green-500 mb-2 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-1" />
                  {isRTL ? "تمت الموافقة على طلبك!" : "Your Application is Approved!"}
                </h4>
                <p className="text-sm text-green-700 dark:text-green-400">
                  {isRTL 
                    ? "تهانينا! لقد تمت الموافقة على طلبك كبائع في EchoShop. يمكنك الآن الوصول إلى لوحة تحكم البائع وبدء إضافة منتجاتك."
                    : "Congratulations! Your application as a seller on EchoShop has been approved. You can now access the seller dashboard and start adding your products."}
                </p>
                <Button className="mt-3">
                  <Link href="/seller/dashboard">
                    {isRTL ? "الذهاب إلى لوحة تحكم البائع" : "Go to Seller Dashboard"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-muted/10 flex justify-between py-4">
          <Button variant="outline" onClick={redirectToHome}>
            {isRTL ? "العودة إلى الرئيسية" : "Back to Home"}
          </Button>
          
          {sellerApplication?.status === "pending" && (
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              {isRTL ? "تحديث الحالة" : "Refresh Status"}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* قسم الأسئلة الشائعة */}
      {/* FAQ Section */}
      <div className="mt-8 w-full max-w-4xl mx-auto">
        <h2 className={`text-xl font-semibold mb-4 ${isRTL ? "text-right" : ""}`}>
          {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
        </h2>
        
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className={`font-medium mb-2 ${isRTL ? "text-right" : ""}`}>
              {isRTL ? "كم من الوقت يستغرق مراجعة طلبي؟" : "How long does it take to review my application?"}
            </h3>
            <p className={`text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
              {isRTL 
                ? "عادةً ما تستغرق مراجعة الطلبات من 24 إلى 48 ساعة. إذا كانت هناك معلومات ناقصة، فقد يستغرق الأمر وقتًا أطول."
                : "Application reviews typically take 24-48 hours. If there's missing information, it may take longer."}
            </p>
          </div>
          
          <div className="rounded-md border p-4">
            <h3 className={`font-medium mb-2 ${isRTL ? "text-right" : ""}`}>
              {isRTL ? "ماذا أفعل إذا تم رفض طلبي؟" : "What should I do if my application is rejected?"}
            </h3>
            <p className={`text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
              {isRTL 
                ? "إذا تم رفض طلبك، سنرسل لك بريدًا إلكترونيًا يشرح السبب. يمكنك معالجة المشكلات المذكورة وإعادة التقديم بعد 14 يومًا."
                : "If your application is rejected, we'll send you an email explaining the reason. You can address the issues mentioned and reapply after 14 days."}
            </p>
          </div>
          
          <div className="rounded-md border p-4">
            <h3 className={`font-medium mb-2 ${isRTL ? "text-right" : ""}`}>
              {isRTL ? "هل يمكنني تحديث معلومات طلبي؟" : "Can I update my application information?"}
            </h3>
            <p className={`text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
              {isRTL 
                ? "نعم، إذا كان طلبك بحالة 'غير مكتمل'، يمكنك تحديثه بالمعلومات المطلوبة. إذا كان طلبك 'قيد المراجعة'، يرجى الانتظار حتى تكتمل المراجعة."
                : "Yes, if your application is marked as 'Incomplete', you can update it with the required information. If your application is 'Under Review', please wait until the review is complete."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}