import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import UserLayout from "@/components/layout/user-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  User, 
  ImagePlus, 
  Shield, 
  History, 
  Smartphone, 
  AlertTriangle, 
  Check,
  Award,
  Gift,
  Star,
  Clock,
  Activity
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

// Form schema
const profileFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

// Types for loyalty system
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
  minimumOrderValue: number | null;
  active: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export default function UserProfile() {
  const { t, language } = useContext(LanguageContext);
  const { user, userData } = useContext(AuthContext);
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Loyalty states
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccount | null>(null);
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>([]);
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);
  const [isLoadingLoyalty, setIsLoadingLoyalty] = useState(false);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userData?.username || user?.displayName || "",
      email: user?.email || "",
      fullName: userData?.fullName || "",
      phone: userData?.phone || "",
    },
  });
  
  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Submit profile form
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      // In a real app, this would update the user profile in the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: t("success"),
        description: t("profileUpdated"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: t("profileUpdateFailed"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Submit password form
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      // In a real app, this would update the user's password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: t("success"),
        description: t("passwordChanged"),
      });
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: t("passwordChangeFailed"),
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  // Fetch loyalty data
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!userData?.id) return;
      
      setIsLoadingLoyalty(true);
      try {
        // Fetch loyalty account
        const accountResponse = await apiRequest('GET', `/api/loyalty/account/${userData.id}`);
        const accountData = await accountResponse.json();
        setLoyaltyAccount(accountData);
        
        // Fetch transactions
        const transactionsResponse = await apiRequest('GET', `/api/loyalty/transactions/${userData.id}`);
        const transactionsData = await transactionsResponse.json();
        setLoyaltyTransactions(transactionsData);
        
        // Fetch rewards
        const rewardsResponse = await apiRequest('GET', `/api/loyalty/rewards`);
        const rewardsData = await rewardsResponse.json();
        setAvailableRewards(rewardsData);
      } catch (error) {
        console.error("Error fetching loyalty data:", error);
        toast({
          title: t("error") || "Error",
          description: t("errorFetchingLoyaltyData") || "Failed to fetch loyalty data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingLoyalty(false);
      }
    };
    
    fetchLoyaltyData();
  }, [userData?.id, toast, t]);
  
  // Redeem points for reward
  const handleRedeemPoints = async (rewardId: number) => {
    if (!userData?.id) return;
    
    setIsRedeeming(true);
    try {
      const response = await apiRequest('POST', '/api/loyalty/redeem', {
        userId: userData.id,
        rewardId
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update loyalty account
        const accountResponse = await apiRequest('GET', `/api/loyalty/account/${userData.id}`);
        const accountData = await accountResponse.json();
        setLoyaltyAccount(accountData);
        
        // Update transactions
        const transactionsResponse = await apiRequest('GET', `/api/loyalty/transactions/${userData.id}`);
        const transactionsData = await transactionsResponse.json();
        setLoyaltyTransactions(transactionsData);
        
        toast({
          title: t("success") || "Success",
          description: t("pointsRedeemed") || "Points successfully redeemed!",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error redeeming points:", error);
      toast({
        title: t("error") || "Error",
        description: error.message || t("errorRedeemingPoints") || "Failed to redeem points",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
      setSelectedReward(null);
    }
  };
  
  // Format transaction date
  const formatTransactionDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(
      language === 'ar' ? 'ar-EG' : 'en-US', 
      options
    );
  };
  
  // Transaction type color
  const getTransactionTypeColor = (type: string) => {
    switch(type) {
      case 'earn':
        return 'text-green-500';
      case 'redeem':
        return 'text-amber-500';
      case 'expire':
        return 'text-red-500';
      case 'adjust':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get tier color
  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'bronze':
        return 'from-amber-700 to-amber-500';
      case 'silver':
        return 'from-gray-500 to-gray-300';
      case 'gold':
        return 'from-yellow-600 to-yellow-400';
      case 'platinum':
        return 'from-cyan-700 to-cyan-500';
      default:
        return 'from-amber-700 to-amber-500';
    }
  };
  
  return (
    <UserLayout>
      <motion.div 
        className="p-6 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold mb-2">
            {t("myProfile")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("personalInfo")}
          </p>
        </motion.div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <motion.div variants={itemVariants}>
            <TabsList className="bg-mediumBlue">
              <TabsTrigger value="profile" className="data-[state=active]:bg-darkBlue">
                <User className="h-4 w-4 mr-2" />
                {t("profile")}
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="data-[state=active]:bg-darkBlue">
                <Award className="h-4 w-4 mr-2" />
                {t("loyalty") || "Loyalty"}
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-darkBlue">
                <Shield className="h-4 w-4 mr-2" />
                {t("security")}
              </TabsTrigger>
            </TabsList>
          </motion.div>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Image */}
            <motion.div 
              variants={itemVariants}
              className="w-full"
            >
              <Card className="bg-mediumBlue border-gray-700">
                <CardHeader>
                  <CardTitle className="text-light">{t("profileImage")}</CardTitle>
                  <CardDescription className="text-gray-300">{t("uploadYourPhoto")}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-darkBlue">
                      <img 
                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${userData?.username || user?.displayName || "User"}&background=a3e635&color=000&size=200`}
                        alt={userData?.username || user?.displayName || t("user")}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute right-0 bottom-0 h-8 w-8 rounded-full bg-mediumBlue text-primary"
                    >
                      <ImagePlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("profileImageRequirements")}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" className="bg-darkBlue">
                        {t("uploadYourPhoto")}
                      </Button>
                      <Button variant="ghost">
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Profile Information */}
            <motion.div 
              variants={itemVariants}
              className="w-full"
            >
              <Card className="bg-mediumBlue border-gray-700">
                <CardHeader>
                  <CardTitle>{t("profileInformation")}</CardTitle>
                  <CardDescription>{t("updateYourInformation")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("username")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("usernamePlaceholder")} 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("email")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("emailPlaceholder")} 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("fullName")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("fullNamePlaceholder")} 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("phone")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("phonePlaceholder")} 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? t("updating") : t("updateProfile")}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Become a Seller CTA */}
            <motion.div 
              variants={itemVariants}
              className="w-full"
            >
              <Card className="bg-gradient-to-r from-darkBlue to-secondary border-gray-700 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/3 p-6">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary mb-4">
                        {t("opportunity") || "Opportunity"}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{t("expandYourBusiness") || "Expand Your Business"}</h3>
                      <p className="text-gray-300 mb-4">{t("becomeSellerDesc") || "Start selling your products on EchoShop and reach millions of customers."}</p>
                      <ul className="space-y-2 mb-5">
                        <li className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-primary mr-2" />
                          <span>{t("easyRegistration") || "Easy Registration"}</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-primary mr-2" />
                          <span>{t("profitableCommission") || "Profitable Commission Structure"}</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-primary mr-2" />
                          <span>{t("sellerSupport") || "24/7 Seller Support"}</span>
                        </li>
                      </ul>
                      <Button className="bg-primary text-black hover:bg-lime-500" asChild>
                        <Link href="/seller/register">
                          {t("registerAsSeller") || "Register as Seller"}
                        </Link>
                      </Button>
                    </div>
                    <div className="md:w-1/3 bg-secondary p-0 relative overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1573496130407-57329f01f769?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                        alt="Seller"
                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="inline-block rounded-full bg-white/10 p-3 backdrop-blur-sm">
                            <Award className="h-8 w-8 text-primary" />
                          </div>
                          <div className="mt-3 font-bold text-xl">{language === "ar" ? "كن بائعاً" : "Become a Seller"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            {isLoadingLoyalty ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {/* Loyalty Status Card */}
                <motion.div 
                  variants={itemVariants}
                  className="w-full"
                >
                  <Card className="bg-mediumBlue border-gray-700 overflow-hidden">
                    <div className={`h-4 bg-gradient-to-r ${loyaltyAccount ? getTierColor(loyaltyAccount.tier) : 'from-amber-700 to-amber-500'}`}></div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        {t("loyaltyStatus") || "Loyalty Status"}
                      </CardTitle>
                      <CardDescription>
                        {t("yourLoyaltyBenefits") || "Your loyalty points and benefits"}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {loyaltyAccount ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-darkBlue p-4 rounded-lg">
                              <div className="text-sm text-gray-400 mb-1">{t("availablePoints") || "Available Points"}</div>
                              <div className="text-2xl font-bold text-primary flex items-center">
                                <Star className="h-5 w-5 mr-1 text-yellow-500" />
                                {loyaltyAccount.balance.toLocaleString()}
                              </div>
                            </div>
                            
                            <div className="bg-darkBlue p-4 rounded-lg">
                              <div className="text-sm text-gray-400 mb-1">{t("lifetimePoints") || "Lifetime Points"}</div>
                              <div className="text-2xl font-bold text-light">
                                {loyaltyAccount.lifetimePoints.toLocaleString()}
                              </div>
                            </div>
                            
                            <div className="bg-darkBlue p-4 rounded-lg">
                              <div className="text-sm text-gray-400 mb-1">{t("currentTier") || "Current Tier"}</div>
                              <div className="text-2xl font-bold text-light flex items-center">
                                <Award className={`h-5 w-5 mr-1 ${
                                  loyaltyAccount.tier === 'bronze' ? 'text-amber-500' :
                                  loyaltyAccount.tier === 'silver' ? 'text-gray-300' :
                                  loyaltyAccount.tier === 'gold' ? 'text-yellow-500' :
                                  'text-cyan-500'
                                }`} />
                                {t(loyaltyAccount.tier) || loyaltyAccount.tier.charAt(0).toUpperCase() + loyaltyAccount.tier.slice(1)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <h4 className="text-lg font-medium mb-2">{t("tierProgress") || "Tier Progress"}</h4>
                            <div className="space-y-2">
                              <div className="h-2 w-full bg-darkBlue rounded-full overflow-hidden">
                                {loyaltyAccount.tier === 'bronze' && (
                                  <div 
                                    className="h-full bg-gradient-to-r from-amber-700 to-amber-500" 
                                    style={{ 
                                      width: `${Math.min(100, (loyaltyAccount.lifetimePoints / 1000) * 100)}%` 
                                    }}
                                  ></div>
                                )}
                                {loyaltyAccount.tier === 'silver' && (
                                  <div 
                                    className="h-full bg-gradient-to-r from-gray-500 to-gray-300" 
                                    style={{ 
                                      width: `${Math.min(100, ((loyaltyAccount.lifetimePoints - 1000) / 4000) * 100)}%` 
                                    }}
                                  ></div>
                                )}
                                {loyaltyAccount.tier === 'gold' && (
                                  <div 
                                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400" 
                                    style={{ 
                                      width: `${Math.min(100, ((loyaltyAccount.lifetimePoints - 5000) / 10000) * 100)}%` 
                                    }}
                                  ></div>
                                )}
                                {loyaltyAccount.tier === 'platinum' && (
                                  <div 
                                    className="h-full bg-gradient-to-r from-cyan-700 to-cyan-500" 
                                    style={{ width: `100%` }}
                                  ></div>
                                )}
                              </div>
                              
                              <div className="flex justify-between text-xs text-gray-400">
                                <div>{loyaltyAccount.tier === 'bronze' ? '0' : 
                                  loyaltyAccount.tier === 'silver' ? '1,000' :
                                  loyaltyAccount.tier === 'gold' ? '5,000' : '15,000'}</div>
                                <div>{loyaltyAccount.tier === 'bronze' ? '1,000' : 
                                  loyaltyAccount.tier === 'silver' ? '5,000' :
                                  loyaltyAccount.tier === 'gold' ? '15,000' : ''}</div>
                              </div>
                              
                              <div className="text-xs text-gray-400">
                                {loyaltyAccount.tier !== 'platinum' && (
                                  <div>
                                    {t("pointsToNextTier") || "Points to next tier"}: {loyaltyAccount.tier === 'bronze' ? 
                                      Math.max(0, 1000 - loyaltyAccount.lifetimePoints) : 
                                      loyaltyAccount.tier === 'silver' ? 
                                      Math.max(0, 5000 - loyaltyAccount.lifetimePoints) : 
                                      Math.max(0, 15000 - loyaltyAccount.lifetimePoints)}
                                  </div>
                                )}
                                {loyaltyAccount.tier === 'platinum' && (
                                  <div>{t("maxTierReached") || "Maximum tier reached"}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6">
                          <Award className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <h3 className="text-lg font-medium mb-1">{t("noLoyaltyAccount") || "No Loyalty Account"}</h3>
                          <p className="text-gray-400 mb-4">{t("makePurchaseToEarn") || "Make a purchase to start earning loyalty points"}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Loyalty Rewards */}
                <motion.div 
                  variants={itemVariants}
                  className="w-full"
                >
                  <Card className="bg-mediumBlue border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        {t("availableRewards") || "Available Rewards"}
                      </CardTitle>
                      <CardDescription>
                        {t("redeemPointsFor") || "Redeem your points for these rewards"}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      {availableRewards && availableRewards.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {availableRewards.map((reward) => (
                            <div key={reward.id} className="bg-darkBlue rounded-lg overflow-hidden border border-gray-700">
                              {reward.imageUrl && (
                                <div className="h-32 overflow-hidden">
                                  <img 
                                    src={reward.imageUrl} 
                                    alt={reward.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="p-4">
                                <h4 className="font-medium mb-1 text-light">
                                  {language === 'ar' && reward.nameAr ? reward.nameAr : reward.name}
                                </h4>
                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                  {language === 'ar' && reward.descriptionAr ? reward.descriptionAr : reward.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-yellow-500">
                                    <Star className="h-4 w-4 mr-1" />
                                    <span className="font-medium">{reward.pointsCost}</span>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-primary border-primary hover:bg-primary/20"
                                    disabled={!loyaltyAccount || loyaltyAccount.balance < reward.pointsCost || isRedeeming}
                                    onClick={() => handleRedeemPoints(reward.id)}
                                  >
                                    {isRedeeming ? t("redeeming") || "Redeeming..." : t("redeem") || "Redeem"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <Gift className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <h3 className="text-lg font-medium mb-1">{t("noRewardsAvailable") || "No Rewards Available"}</h3>
                          <p className="text-gray-400">{t("checkBackSoon") || "Check back soon for exciting rewards"}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Transaction History */}
                <motion.div 
                  variants={itemVariants}
                  className="w-full"
                >
                  <Card className="bg-mediumBlue border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        {t("pointsHistory") || "Points History"}
                      </CardTitle>
                      <CardDescription>
                        {t("recentTransactions") || "Your recent loyalty transactions"}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      {loyaltyTransactions && loyaltyTransactions.length > 0 ? (
                        <div className="space-y-4">
                          {loyaltyTransactions.map((transaction) => (
                            <div key={transaction.id} className="bg-darkBlue p-4 rounded-lg flex items-center justify-between">
                              <div className="flex items-start gap-3">
                                {transaction.type === 'earn' && <Activity className="h-5 w-5 text-green-500 mt-0.5" />}
                                {transaction.type === 'redeem' && <Gift className="h-5 w-5 text-amber-500 mt-0.5" />}
                                {transaction.type === 'expire' && <Clock className="h-5 w-5 text-red-500 mt-0.5" />}
                                {transaction.type === 'adjust' && <Activity className="h-5 w-5 text-blue-500 mt-0.5" />}
                                <div>
                                  <div className="font-medium">{transaction.description}</div>
                                  <div className="text-xs text-gray-400">
                                    {formatTransactionDate(transaction.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <div className={`text-lg font-medium ${getTransactionTypeColor(transaction.type)}`}>
                                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <History className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <h3 className="text-lg font-medium mb-1">{t("noTransactions") || "No Transactions"}</h3>
                          <p className="text-gray-400">{t("transactionsWillAppear") || "Your loyalty transactions will appear here"}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Change Password */}
            <motion.div 
              variants={itemVariants}
              className="w-full"
            >
              <Card className="bg-mediumBlue border-gray-700">
                <CardHeader>
                  <CardTitle>{t("changePassword")}</CardTitle>
                  <CardDescription>{t("updateYourPassword")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("currentPassword")}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div></div>
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("newPassword")}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("confirmPassword")}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? t("changing") : t("changePassword")}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Account Security */}
            <motion.div 
              variants={itemVariants}
              className="w-full"
            >
              <Card className="bg-mediumBlue border-gray-700">
                <CardHeader>
                  <CardTitle>{t("accountSecurity")}</CardTitle>
                  <CardDescription>{t("manageAccountSecurity")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-darkBlue rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="h-8 w-8 text-primary" />
                        <div>
                          <h4 className="font-medium">{t("twoFactorAuth")}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                            {t("twoFactorAuthDesc")}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="bg-darkBlue">
                        {t("enable")}
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-darkBlue rounded-lg">
                      <div className="flex items-start gap-3">
                        <History className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{t("loginHistory")}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                            {t("loginHistoryDesc")}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="bg-darkBlue">
                        {t("view")}
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-darkBlue rounded-lg">
                      <div className="flex items-start gap-3">
                        <Smartphone className="h-8 w-8 text-purple-500" />
                        <div>
                          <h4 className="font-medium">{t("connectedDevices")}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                            {t("connectedDevicesDesc")}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="bg-darkBlue">
                        {t("manage")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Danger Zone */}
            <motion.div 
              variants={itemVariants}
              className="w-full"
            >
              <Card className="bg-mediumBlue border-gray-700">
                <CardHeader>
                  <CardTitle className="text-red-500 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {t("dangerZone")}
                  </CardTitle>
                  <CardDescription>
                    {t("dangerZoneDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-500">{t("deleteAccount")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
                        {t("deleteAccountDesc")}
                      </p>
                    </div>
                    <Button variant="destructive">
                      {t("delete")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </UserLayout>
  );
}