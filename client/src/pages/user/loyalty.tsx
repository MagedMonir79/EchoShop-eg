import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import UserDashboardLayout from "@/components/layout/user-dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Award, 
  Gift, 
  Clock, 
  ChevronRight, 
  ShoppingBag, 
  TrendingUp, 
  Tag, 
  Truck,
  Star,
  Calendar,
  Shield,
  Gem
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Types for loyalty account and transactions
interface LoyaltyAccount {
  id: number;
  userId: number;
  points: number;
  balance: number;
  lifetimePoints: number;
  tier: string;
  createdAt: string;
  updatedAt: string | null;
}

interface LoyaltyTransaction {
  id: number;
  userId: number;
  type: string;
  amount: number;
  description: string;
  orderId: number | null;
  expiresAt: string | null;
  createdAt: string;
}

interface LoyaltyReward {
  id: number;
  name: string;
  nameAr: string | null;
  description: string;
  descriptionAr: string | null;
  pointsCost: number;
  type: string;
  discountType: string | null;
  discountValue: number | null;
  productId: number | null;
  active: boolean;
  minimumOrderValue: number | null;
  createdAt: string;
  updatedAt: string | null;
}

interface Redemption {
  redemption: {
    id: number;
    userId: number;
    rewardId: number;
    pointsUsed: number;
    code: string;
    status: string;
    usedAt: string | null;
    expiresAt: string;
    createdAt: string;
  };
  reward: LoyaltyReward;
}

export default function UserLoyalty() {
  const { language, t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const isRTL = language === "ar";
  const { toast } = useToast();
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);
  
  // Fetch user's loyalty account
  const { data: loyaltyAccount, isLoading: isLoadingAccount } = useQuery<LoyaltyAccount>({
    queryKey: ["/api/loyalty/account", user?.uid],
    queryFn: async () => {
      const response = await fetch(`/api/loyalty/account/${user?.uid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch loyalty account");
      }
      return await response.json();
    },
    enabled: !!user?.uid
  });
  
  // Fetch loyalty transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<LoyaltyTransaction[]>({
    queryKey: ["/api/loyalty/transactions", user?.uid],
    queryFn: async () => {
      const response = await fetch(`/api/loyalty/transactions/${user?.uid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch loyalty transactions");
      }
      return await response.json();
    },
    enabled: !!user?.uid
  });
  
  // Fetch available rewards
  const { data: rewards, isLoading: isLoadingRewards } = useQuery<LoyaltyReward[]>({
    queryKey: ["/api/loyalty/rewards"],
    queryFn: async () => {
      const response = await fetch("/api/loyalty/rewards");
      if (!response.ok) {
        throw new Error("Failed to fetch rewards");
      }
      return await response.json();
    }
  });
  
  // Fetch redemption history
  const { data: redemptions, isLoading: isLoadingRedemptions } = useQuery<Redemption[]>({
    queryKey: ["/api/loyalty/redemptions", user?.uid],
    queryFn: async () => {
      const response = await fetch(`/api/loyalty/redemptions/${user?.uid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch redemption history");
      }
      return await response.json();
    },
    enabled: !!user?.uid
  });
  
  // Handle reward redemption
  const handleRedeemPoints = async (rewardId: number) => {
    try {
      const response = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user?.uid,
          rewardId
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to redeem points");
      }
      
      const result = await response.json();
      
      toast({
        title: isRTL ? "تم استبدال النقاط بنجاح!" : "Points Redeemed Successfully!",
        description: isRTL 
          ? `تم إنشاء رمز الاسترداد الخاص بك: ${result.code}` 
          : `Your redemption code is: ${result.code}`,
        variant: "default"
      });
      
      setIsRedeemDialogOpen(false);
      
      // Invalidate queries to refetch data
      // queryClient.invalidateQueries(["/api/loyalty/account", user?.uid]);
      // queryClient.invalidateQueries(["/api/loyalty/transactions", user?.uid]);
      // queryClient.invalidateQueries(["/api/loyalty/redemptions", user?.uid]);
      
    } catch (error) {
      toast({
        title: isRTL ? "فشل الاسترداد" : "Redemption Failed",
        description: error instanceof Error ? error.message : (isRTL ? "حدث خطأ غير متوقع" : "An unexpected error occurred"),
        variant: "destructive"
      });
    }
  };
  
  // Get next tier information
  const getNextTier = () => {
    if (!loyaltyAccount) return { tier: "silver", pointsNeeded: 1000 };
    
    const tiers = {
      bronze: { next: "silver", threshold: 1000 },
      silver: { next: "gold", threshold: 5000 },
      gold: { next: "platinum", threshold: 15000 },
      platinum: { next: null, threshold: null }
    };
    
    const currentTier = loyaltyAccount.tier as keyof typeof tiers;
    const nextTierInfo = tiers[currentTier];
    
    if (!nextTierInfo.next) return null;
    
    return {
      tier: nextTierInfo.next,
      pointsNeeded: nextTierInfo.threshold - loyaltyAccount.lifetimePoints
    };
  };
  
  const nextTierInfo = getNextTier();
  
  // Get tier benefits
  const getTierBenefits = (tier: string) => {
    const benefits = {
      bronze: [
        { icon: <Tag className="h-5 w-5" />, text: isRTL ? "خصم 3% على المشتريات" : "3% discount on purchases" },
        { icon: <Gift className="h-5 w-5" />, text: isRTL ? "هدية ترحيبية" : "Welcome gift" }
      ],
      silver: [
        { icon: <Tag className="h-5 w-5" />, text: isRTL ? "خصم 5% على المشتريات" : "5% discount on purchases" },
        { icon: <Truck className="h-5 w-5" />, text: isRTL ? "شحن مجاني للطلبات فوق 500 جنيه" : "Free shipping on orders over 500 EGP" },
        { icon: <Calendar className="h-5 w-5" />, text: isRTL ? "عروض حصرية شهرية" : "Monthly exclusive offers" }
      ],
      gold: [
        { icon: <Tag className="h-5 w-5" />, text: isRTL ? "خصم 8% على المشتريات" : "8% discount on purchases" },
        { icon: <Truck className="h-5 w-5" />, text: isRTL ? "شحن مجاني على جميع الطلبات" : "Free shipping on all orders" },
        { icon: <Star className="h-5 w-5" />, text: isRTL ? "أولوية في الدعم الفني" : "Priority customer support" },
        { icon: <Gift className="h-5 w-5" />, text: isRTL ? "هدية في عيد ميلادك" : "Birthday gift" }
      ],
      platinum: [
        { icon: <Tag className="h-5 w-5" />, text: isRTL ? "خصم 12% على المشتريات" : "12% discount on purchases" },
        { icon: <Truck className="h-5 w-5" />, text: isRTL ? "شحن مجاني وسريع على جميع الطلبات" : "Free express shipping on all orders" },
        { icon: <Shield className="h-5 w-5" />, text: isRTL ? "ضمان استرداد لمدة 60 يومًا" : "60-day return guarantee" },
        { icon: <Gem className="h-5 w-5" />, text: isRTL ? "وصول حصري للمنتجات الجديدة" : "Exclusive access to new products" },
        { icon: <Gift className="h-5 w-5" />, text: isRTL ? "هدايا فصلية" : "Quarterly free gifts" }
      ]
    };
    
    return benefits[tier as keyof typeof benefits] || benefits.bronze;
  };
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Helper function to get transaction icon and color
  const getTransactionDetails = (type: string) => {
    const details = {
      earn: { 
        icon: <TrendingUp className="h-5 w-5" />, 
        color: "text-green-500",
        label: isRTL ? "مكتسبة" : "Earned"
      },
      redeem: { 
        icon: <Gift className="h-5 w-5" />, 
        color: "text-purple-500",
        label: isRTL ? "مستبدلة" : "Redeemed"
      },
      expire: { 
        icon: <Clock className="h-5 w-5" />, 
        color: "text-red-500",
        label: isRTL ? "منتهية" : "Expired"
      },
      adjust: { 
        icon: <Star className="h-5 w-5" />, 
        color: "text-blue-500",
        label: isRTL ? "تعديل" : "Adjustment"
      }
    };
    
    return details[type as keyof typeof details] || details.earn;
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  // Get tier progress percentage
  const getTierProgressPercentage = () => {
    if (!loyaltyAccount) return 0;
    
    const tierThresholds = {
      bronze: { min: 0, max: 1000 },
      silver: { min: 1000, max: 5000 },
      gold: { min: 5000, max: 15000 },
      platinum: { min: 15000, max: 15000 }
    };
    
    const currentTier = loyaltyAccount.tier as keyof typeof tierThresholds;
    const { min, max } = tierThresholds[currentTier];
    
    if (currentTier === 'platinum') return 100;
    
    const progress = ((loyaltyAccount.lifetimePoints - min) / (max - min)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };
  
  const tierProgressPercentage = getTierProgressPercentage();
  
  return (
    <UserDashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Page Title */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isRTL ? "برنامج الولاء ونقاط المكافآت" : "Loyalty & Rewards Program"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isRTL 
              ? "اكسب نقاطًا في كل مرة تتسوق فيها واستبدلها بمكافآت حصرية ومزايا مميزة."
              : "Earn points every time you shop and redeem them for exclusive rewards and special benefits."}
          </p>
        </motion.div>
        
        {/* Loyalty Account Overview */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
              <div className="bg-white dark:bg-gray-800 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* Points Display */}
                  <div className="text-center md:text-left">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      {isRTL ? "رصيد النقاط الحالي" : "Current Points Balance"}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="text-5xl font-bold text-primary">
                        {isLoadingAccount ? "..." : loyaltyAccount?.balance || 0}
                      </span>
                      <span className="ml-2 text-xl text-gray-500 dark:text-gray-400">
                        {isRTL ? "نقطة" : "pts"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {isRTL 
                        ? `إجمالي النقاط المكتسبة: ${isLoadingAccount ? "..." : loyaltyAccount?.lifetimePoints || 0} نقطة`
                        : `Total earned: ${isLoadingAccount ? "..." : loyaltyAccount?.lifetimePoints || 0} points`}
                    </p>
                  </div>
                  
                  {/* Tier Display */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-2">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {isRTL 
                        ? `مستوى ${loyaltyAccount?.tier === "bronze" ? "برونزي" : 
                            loyaltyAccount?.tier === "silver" ? "فضي" : 
                            loyaltyAccount?.tier === "gold" ? "ذهبي" : "بلاتيني"}`
                        : `${loyaltyAccount?.tier || "Bronze"} Tier`}
                    </h3>
                    {nextTierInfo && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {isRTL 
                          ? `${nextTierInfo.pointsNeeded} نقطة للوصول إلى المستوى ${
                              nextTierInfo.tier === "silver" ? "الفضي" : 
                              nextTierInfo.tier === "gold" ? "الذهبي" : "البلاتيني"
                            }`
                          : `${nextTierInfo.pointsNeeded} points to ${nextTierInfo.tier}`}
                      </p>
                    )}
                  </div>
                  
                  {/* Points Expiry */}
                  <div className="text-center md:text-right">
                    <div className="inline-flex items-center justify-center p-2 rounded-full bg-amber-50 dark:bg-amber-900/30 mb-2">
                      <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      {isRTL ? "تذكير انتهاء الصلاحية" : "Expiry Reminder"}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {isRTL 
                        ? "تنتهي صلاحية النقاط بعد 12 شهرًا من اكتسابها"
                        : "Points expire 12 months after they are earned"}
                    </p>
                  </div>
                </div>
                
                {/* Tier Progress */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isRTL ? "التقدم في المستوى" : "Tier Progress"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(tierProgressPercentage)}%
                    </span>
                  </div>
                  <Progress value={tierProgressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>{isRTL ? "برونزي" : "Bronze"}</span>
                    <span>{isRTL ? "فضي" : "Silver"}</span>
                    <span>{isRTL ? "ذهبي" : "Gold"}</span>
                    <span>{isRTL ? "بلاتيني" : "Platinum"}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Main Content Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="benefits" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="benefits">
                {isRTL ? "المزايا" : "Benefits"}
              </TabsTrigger>
              <TabsTrigger value="rewards">
                {isRTL ? "المكافآت" : "Rewards"}
              </TabsTrigger>
              <TabsTrigger value="history">
                {isRTL ? "سجل النقاط" : "Points History"}
              </TabsTrigger>
              <TabsTrigger value="redemptions">
                {isRTL ? "الاستبدالات" : "Redemptions"}
              </TabsTrigger>
            </TabsList>
            
            {/* Benefits Tab */}
            <TabsContent value="benefits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isRTL 
                      ? `مزايا المستوى ${
                          loyaltyAccount?.tier === "bronze" ? "البرونزي" : 
                          loyaltyAccount?.tier === "silver" ? "الفضي" : 
                          loyaltyAccount?.tier === "gold" ? "الذهبي" : "البلاتيني"
                        }`
                      : `${loyaltyAccount?.tier || "Bronze"} Tier Benefits`}
                  </CardTitle>
                  <CardDescription>
                    {isRTL 
                      ? "استمتع بهذه المزايا الحصرية كعضو في مستوى " + 
                        (loyaltyAccount?.tier === "bronze" ? "البرونزي" : 
                         loyaltyAccount?.tier === "silver" ? "الفضي" : 
                         loyaltyAccount?.tier === "gold" ? "الذهبي" : "البلاتيني")
                      : `Enjoy these exclusive benefits as a ${loyaltyAccount?.tier || "Bronze"} tier member`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getTierBenefits(loyaltyAccount?.tier || "bronze").map((benefit, index) => (
                      <div key={index} className="flex items-start p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="mr-4 text-primary">{benefit.icon}</div>
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{benefit.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {nextTierInfo && (
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                        {isRTL 
                          ? `ترقية إلى المستوى ${
                              nextTierInfo.tier === "silver" ? "الفضي" : 
                              nextTierInfo.tier === "gold" ? "الذهبي" : "البلاتيني"
                            }`
                          : `Upgrade to ${nextTierInfo.tier} Tier`}
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
                        {isRTL 
                          ? `اكسب ${nextTierInfo.pointsNeeded} نقطة إضافية للترقية والحصول على هذه المزايا الإضافية:`
                          : `Earn ${nextTierInfo.pointsNeeded} more points to upgrade and get these additional benefits:`}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getTierBenefits(nextTierInfo.tier)
                          .filter(nextBenefit => 
                            !getTierBenefits(loyaltyAccount?.tier || "bronze")
                              .some(currentBenefit => currentBenefit.text === nextBenefit.text)
                          )
                          .map((benefit, index) => (
                            <div key={index} className="flex items-center">
                              <div className="mr-2 text-blue-600 dark:text-blue-400">{benefit.icon}</div>
                              <p className="text-sm text-blue-700 dark:text-blue-200">{benefit.text}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? "كيفية كسب النقاط" : "How to Earn Points"}</CardTitle>
                  <CardDescription>
                    {isRTL 
                      ? "طرق متعددة لكسب نقاط في برنامج الولاء"
                      : "Multiple ways to earn points in our loyalty program"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <ShoppingBag className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {isRTL ? "المشتريات" : "Purchases"}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isRTL 
                          ? "اكسب نقطة واحدة مقابل كل 1 جنيه مصري تنفقه في متجرنا"
                          : "Earn 1 point for every 1 EGP spent in our store"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {isRTL ? "المراجعات" : "Reviews"}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isRTL 
                          ? "اكسب 50 نقطة لكل مراجعة مع صور للمنتجات التي اشتريتها"
                          : "Earn 50 points for each review with photos on products you've purchased"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {isRTL ? "نقاط يوم الميلاد" : "Birthday Points"}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isRTL 
                          ? "احصل على 200 نقطة كهدية في عيد ميلادك"
                          : "Get 200 bonus points as a gift on your birthday"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {isRTL ? "إحالة الأصدقاء" : "Referrals"}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isRTL 
                          ? "اكسب 300 نقطة عندما يقوم صديق بالتسجيل ويكمل أول طلب"
                          : "Earn 300 points when a friend signs up and completes their first order"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? "سياسة النقاط" : "Points Policy"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {isRTL ? "انتهاء صلاحية النقاط" : "Points Expiry"}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isRTL 
                        ? "تنتهي صلاحية النقاط بعد 12 شهرًا من تاريخ اكتسابها. ستتلقى إشعارًا قبل 30 يومًا من انتهاء الصلاحية."
                        : "Points expire 12 months after the date they were earned. You will receive a notification 30 days before expiry."}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {isRTL ? "استبدال النقاط" : "Redeeming Points"}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isRTL 
                        ? "يمكن استبدال النقاط بمكافآت مختلفة تشمل الخصومات والهدايا والشحن المجاني. لا يمكن استرداد قيمة النقاط نقدًا."
                        : "Points can be redeemed for various rewards including discounts, gifts, and free shipping. Points cannot be redeemed for cash."}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {isRTL ? "المرتجعات والإلغاءات" : "Returns and Cancellations"}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isRTL 
                        ? "في حالة إرجاع منتج أو إلغاء طلب، سيتم خصم النقاط المكتسبة من هذا الطلب من رصيدك."
                        : "If a product is returned or an order is cancelled, the points earned from that purchase will be deducted from your balance."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-6">
              <Alert variant="default" className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">
                  {isRTL ? "نقاطك تنتظر الاستبدال!" : "Your points are waiting to be redeemed!"}
                </AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-200">
                  {isRTL 
                    ? `لديك ${loyaltyAccount?.balance || 0} نقطة متاحة للاستبدال بمكافآت حصرية.`
                    : `You have ${loyaltyAccount?.balance || 0} points available to redeem for exclusive rewards.`}
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingRewards ? (
                  Array(3).fill(0).map((_, index) => (
                    <Card key={index} className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent className="h-24 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </CardContent>
                      <CardFooter>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      </CardFooter>
                    </Card>
                  ))
                ) : rewards && rewards.length > 0 ? (
                  rewards.map((reward) => (
                    <Card key={reward.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-0.5">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex justify-between items-start">
                            <span>{isRTL && reward.nameAr ? reward.nameAr : reward.name}</span>
                            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                              {reward.pointsCost} {isRTL ? "نقطة" : "pts"}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {isRTL && reward.descriptionAr ? reward.descriptionAr : reward.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="flex items-center mb-4">
                            {reward.type === "discount" && (
                              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                                <Tag className="h-6 w-6 text-green-600 dark:text-green-400" />
                              </div>
                            )}
                            {reward.type === "free_product" && (
                              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                              </div>
                            )}
                            {reward.type === "free_shipping" && (
                              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                            <div className="ml-4">
                              {reward.type === "discount" && (
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {reward.discountType === "percentage" 
                                    ? `${reward.discountValue}% ${isRTL ? "خصم" : "discount"}`
                                    : `${reward.discountValue} ${isRTL ? "جنيه خصم" : "EGP off"}`}
                                </span>
                              )}
                              {reward.type === "free_product" && (
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {isRTL ? "منتج مجاني" : "Free product"}
                                </span>
                              )}
                              {reward.type === "free_shipping" && (
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {isRTL ? "شحن مجاني" : "Free shipping"}
                                </span>
                              )}
                            </div>
                          </div>
                          {reward.minimumOrderValue && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {isRTL 
                                ? `الحد الأدنى للطلب: ${reward.minimumOrderValue} جنيه مصري`
                                : `Minimum order: ${reward.minimumOrderValue} EGP`}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button 
                            className="w-full"
                            disabled={!loyaltyAccount || loyaltyAccount.balance < reward.pointsCost}
                            onClick={() => {
                              setSelectedReward(reward);
                              setIsRedeemDialogOpen(true);
                            }}
                          >
                            {isRTL ? "استبدال النقاط" : "Redeem Points"}
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Gift className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {isRTL ? "لا توجد مكافآت متاحة حاليًا" : "No rewards available right now"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {isRTL 
                        ? "سيتم إضافة مكافآت جديدة قريبًا. تحقق مرة أخرى لاحقًا!"
                        : "New rewards will be added soon. Check back later!"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Points History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? "سجل نقاط المكافآت" : "Points History"}</CardTitle>
                  <CardDescription>
                    {isRTL 
                      ? "سجل كامل لنشاط نقاط المكافآت الخاصة بك"
                      : "Complete record of your rewards points activity"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingTransactions ? (
                    <div className="space-y-4">
                      {Array(5).fill(0).map((_, index) => (
                        <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : transactions && transactions.length > 0 ? (
                    <div className="space-y-4">
                      {transactions.map((transaction) => {
                        const { icon, color, label } = getTransactionDetails(transaction.type);
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-start">
                              <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-4 ${color}`}>
                                {icon}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {transaction.description}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(transaction.createdAt)}
                                </p>
                                {transaction.expiresAt && (
                                  <div className="flex items-center mt-1 text-xs text-amber-600 dark:text-amber-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>
                                      {isRTL 
                                        ? `تنتهي في ${formatDate(transaction.expiresAt)}`
                                        : `Expires on ${formatDate(transaction.expiresAt)}`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge 
                                variant={transaction.amount > 0 ? "default" : "destructive"}
                                className={`ml-2 ${transaction.amount > 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
                              >
                                {transaction.amount > 0 ? "+" : ""}{transaction.amount} {isRTL ? "نقطة" : "pts"}
                              </Badge>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {isRTL ? "لا يوجد سجل للنقاط بعد" : "No points history yet"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {isRTL 
                          ? "ابدأ التسوق لكسب النقاط والاستمتاع بالمكافآت!"
                          : "Start shopping to earn points and enjoy rewards!"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Redemptions Tab */}
            <TabsContent value="redemptions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? "استبدالات النقاط" : "Your Redemptions"}</CardTitle>
                  <CardDescription>
                    {isRTL 
                      ? "سجل المكافآت التي استبدلتها بنقاطك"
                      : "Record of rewards you've redeemed with your points"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingRedemptions ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, index) => (
                        <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : redemptions && redemptions.length > 0 ? (
                    <div className="space-y-4">
                      {redemptions.map((item) => (
                        <Card key={item.redemption.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <CardContent className="p-5">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="flex items-start mb-4 md:mb-0">
                                <div className="p-2 rounded-full bg-primary/10 mr-4">
                                  {item.reward.type === "discount" ? (
                                    <Tag className="h-6 w-6 text-primary" />
                                  ) : item.reward.type === "free_shipping" ? (
                                    <Truck className="h-6 w-6 text-primary" />
                                  ) : (
                                    <Gift className="h-6 w-6 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {isRTL && item.reward.nameAr ? item.reward.nameAr : item.reward.name}
                                  </h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(item.redemption.createdAt)}
                                  </p>
                                  <Badge variant="outline" className="mt-2">
                                    -{item.redemption.pointsUsed} {isRTL ? "نقطة" : "pts"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="text-sm font-semibold mb-2">
                                  {isRTL ? "كود الاسترداد:" : "Code:"}
                                </div>
                                <div className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-sm">
                                  {item.redemption.code}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  {isRTL 
                                    ? `ينتهي في ${formatDate(item.redemption.expiresAt)}`
                                    : `Expires on ${formatDate(item.redemption.expiresAt)}`}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Gift className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {isRTL ? "لم تقم باستبدال أي نقاط بعد" : "No redemptions yet"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {isRTL 
                          ? "استبدل نقاطك بمكافآت رائعة واستمتع بها!"
                          : "Redeem your points for great rewards and enjoy them!"}
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4" 
                        onClick={() => {
                          const rewardsTab = document.querySelector('[value="rewards"]') as HTMLElement;
                          if (rewardsTab) rewardsTab.dispatchEvent(new Event('click'));
                        }}
                      >
                        {isRTL ? "استعرض المكافآت المتاحة" : "Browse Available Rewards"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
      
      {/* Redemption Confirmation Dialog */}
      <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isRTL ? "تأكيد استبدال النقاط" : "Confirm Points Redemption"}
            </DialogTitle>
            <DialogDescription>
              {isRTL 
                ? "أنت على وشك استبدال نقاطك بالمكافأة التالية:"
                : "You are about to redeem your points for the following reward:"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReward && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg my-4">
              <div className="flex items-start">
                <div className="mr-4 p-2 rounded-full bg-primary/10">
                  {selectedReward.type === "discount" ? (
                    <Tag className="h-5 w-5 text-primary" />
                  ) : selectedReward.type === "free_shipping" ? (
                    <Truck className="h-5 w-5 text-primary" />
                  ) : (
                    <Gift className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {isRTL && selectedReward.nameAr ? selectedReward.nameAr : selectedReward.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isRTL && selectedReward.descriptionAr ? selectedReward.descriptionAr : selectedReward.description}
                  </p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {selectedReward.pointsCost} {isRTL ? "نقطة" : "pts"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isRTL ? "رصيد النقاط الحالي:" : "Current points balance:"}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {loyaltyAccount?.balance || 0} {isRTL ? "نقطة" : "pts"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isRTL ? "النقاط المستخدمة:" : "Points to use:"}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              -{selectedReward?.pointsCost || 0} {isRTL ? "نقطة" : "pts"}
            </span>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isRTL ? "الرصيد المتبقي:" : "Remaining balance:"}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {(loyaltyAccount?.balance || 0) - (selectedReward?.pointsCost || 0)} {isRTL ? "نقطة" : "pts"}
            </span>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsRedeemDialogOpen(false)}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={() => selectedReward && handleRedeemPoints(selectedReward.id)}
              disabled={!selectedReward || !loyaltyAccount || loyaltyAccount.balance < (selectedReward?.pointsCost || 0)}
            >
              {isRTL ? "تأكيد الاستبدال" : "Confirm Redemption"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserDashboardLayout>
  );
}