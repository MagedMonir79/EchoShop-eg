import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Gift,
  Trash2,
  Edit,
  Plus,
  Search,
  Award,
  Star,
  Check,
  X,
  AlertTriangle,
  Info
} from "lucide-react";

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

// Types for loyalty system
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

// Reward form schema
const rewardFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters",
  }),
  nameAr: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  descriptionAr: z.string().optional(),
  pointsCost: z.coerce.number().min(1, {
    message: "Points cost must be at least 1",
  }),
  type: z.enum(["discount", "free_product", "free_shipping"]),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.coerce.number().min(0).optional(),
  productId: z.coerce.number().optional(),
  minimumOrderValue: z.coerce.number().min(0).optional(),
  active: z.boolean().default(true),
  imageUrl: z.string().optional(),
});

type RewardFormValues = z.infer<typeof rewardFormSchema>;

export default function LoyaltyRewardsAdmin() {
  const { t, language } = useContext(LanguageContext);
  const { userData } = useContext(AuthContext);
  const { toast } = useToast();
  
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRewardId, setEditingRewardId] = useState<number | null>(null);
  const [filterText, setFilterText] = useState("");
  
  // Reward form
  const form = useForm<RewardFormValues>({
    resolver: zodResolver(rewardFormSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      pointsCost: 100,
      type: "discount",
      discountType: "percentage",
      discountValue: 10,
      minimumOrderValue: 0,
      active: true,
      imageUrl: "",
    },
  });
  
  // Fetch rewards on mount
  useEffect(() => {
    const fetchRewards = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest('GET', '/api/loyalty/rewards');
        const data = await response.json();
        setRewards(data);
      } catch (error) {
        console.error("Error fetching rewards:", error);
        toast({
          title: t("error") || "Error",
          description: t("errorFetchingRewards") || "Failed to fetch loyalty rewards",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRewards();
  }, [toast, t]);
  
  // Load reward data into form for editing
  useEffect(() => {
    if (editingRewardId === null) return;
    
    const reward = rewards.find(r => r.id === editingRewardId);
    if (!reward) return;
    
    form.reset({
      name: reward.name,
      nameAr: reward.nameAr || "",
      description: reward.description,
      descriptionAr: reward.descriptionAr || "",
      pointsCost: reward.pointsCost,
      type: reward.type as any,
      discountType: reward.discountType as any || undefined,
      discountValue: reward.discountValue || undefined,
      productId: reward.productId || undefined,
      minimumOrderValue: reward.minimumOrderValue || 0,
      active: reward.active,
      imageUrl: reward.imageUrl || "",
    });
  }, [editingRewardId, rewards, form]);
  
  // Submit form - create or update reward
  const onSubmit = async (data: RewardFormValues) => {
    try {
      if (editingRewardId === null) {
        // Create new reward
        const response = await apiRequest('POST', '/api/loyalty/rewards', data);
        const newReward = await response.json();
        
        setRewards(prev => [...prev, newReward]);
        
        toast({
          title: t("success") || "Success",
          description: t("rewardCreated") || "Reward created successfully",
        });
      } else {
        // Update existing reward
        const response = await apiRequest('PUT', `/api/loyalty/rewards/${editingRewardId}`, data);
        const updatedReward = await response.json();
        
        setRewards(prev => prev.map(r => r.id === editingRewardId ? updatedReward : r));
        
        toast({
          title: t("success") || "Success",
          description: t("rewardUpdated") || "Reward updated successfully",
        });
      }
      
      // Reset form
      form.reset();
      setEditingRewardId(null);
    } catch (error) {
      console.error("Error saving reward:", error);
      toast({
        title: t("error") || "Error",
        description: t("errorSavingReward") || "Failed to save reward",
        variant: "destructive",
      });
    }
  };
  
  // Delete reward
  const handleDeleteReward = async (id: number) => {
    if (!confirm(t("confirmDeleteReward") || "Are you sure you want to delete this reward?")) {
      return;
    }
    
    try {
      await apiRequest('DELETE', `/api/loyalty/rewards/${id}`);
      
      setRewards(prev => prev.filter(r => r.id !== id));
      
      toast({
        title: t("success") || "Success",
        description: t("rewardDeleted") || "Reward deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting reward:", error);
      toast({
        title: t("error") || "Error",
        description: t("errorDeletingReward") || "Failed to delete reward",
        variant: "destructive",
      });
    }
  };
  
  // Filter rewards
  const filteredRewards = rewards.filter(reward => 
    reward.name.toLowerCase().includes(filterText.toLowerCase()) ||
    reward.description.toLowerCase().includes(filterText.toLowerCase()) ||
    (reward.nameAr && reward.nameAr.includes(filterText)) ||
    (reward.descriptionAr && reward.descriptionAr.includes(filterText))
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', options);
  };
  
  return (
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
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Gift className="mr-2 h-8 w-8 text-primary" />
          {t("loyaltyRewards") || "Loyalty Rewards"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t("manageRewards") || "Create and manage loyalty program rewards"}
        </p>
      </motion.div>
      
      <Tabs defaultValue="manage" className="space-y-6">
        <motion.div variants={itemVariants}>
          <TabsList className="bg-mediumBlue">
            <TabsTrigger value="manage" className="data-[state=active]:bg-darkBlue">
              <Gift className="h-4 w-4 mr-2" />
              {t("manageRewards") || "Manage Rewards"}
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-darkBlue">
              <Plus className="h-4 w-4 mr-2" />
              {editingRewardId === null ? 
                (t("createReward") || "Create Reward") : 
                (t("editReward") || "Edit Reward")}
            </TabsTrigger>
          </TabsList>
        </motion.div>
        
        {/* Manage Rewards Tab */}
        <TabsContent value="manage" className="space-y-6">
          <motion.div 
            variants={itemVariants}
            className="w-full"
          >
            <Card className="bg-mediumBlue border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-primary" />
                    {t("availableRewards") || "Available Rewards"}
                  </span>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      className="pl-9 bg-darkBlue border-gray-700 w-64"
                      placeholder={t("searchRewards") || "Search rewards..."}
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                    />
                  </div>
                </CardTitle>
                <CardDescription>
                  {t("manageExistingRewards") || "View and manage existing loyalty rewards"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center p-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : filteredRewards.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRewards.map((reward) => (
                      <div key={reward.id} className="bg-darkBlue p-4 rounded-lg border border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">{reward.name}</h3>
                              {reward.active ? (
                                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 border border-green-500/30">
                                  <Check className="h-3 w-3 mr-1" />
                                  {t("active") || "Active"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/30">
                                  <X className="h-3 w-3 mr-1" />
                                  {t("inactive") || "Inactive"}
                                </span>
                              )}
                            </div>
                            {reward.nameAr && (
                              <div className="text-sm text-gray-400">{reward.nameAr}</div>
                            )}
                            <div className="text-sm">{reward.description}</div>
                            {reward.descriptionAr && (
                              <div className="text-sm text-gray-400">{reward.descriptionAr}</div>
                            )}
                            
                            <div className="flex flex-wrap gap-3 text-sm pt-2">
                              <div className="bg-mediumBlue px-2 py-1 rounded flex items-center">
                                <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                                <span>{reward.pointsCost} {t("points") || "Points"}</span>
                              </div>
                              
                              <div className="bg-mediumBlue px-2 py-1 rounded flex items-center">
                                <Gift className="h-3.5 w-3.5 mr-1 text-primary" />
                                <span>
                                  {reward.type === 'discount' && (
                                    <>
                                      {reward.discountType === 'percentage' ? 
                                        `${reward.discountValue}% ${t("discount") || "Discount"}` : 
                                        `${reward.discountValue} ${t("egpDiscount") || "EGP Discount"}`}
                                    </>
                                  )}
                                  {reward.type === 'free_product' && (t("freeProduct") || "Free Product")}
                                  {reward.type === 'free_shipping' && (t("freeShipping") || "Free Shipping")}
                                </span>
                              </div>
                              
                              {reward.minimumOrderValue > 0 && (
                                <div className="bg-mediumBlue px-2 py-1 rounded flex items-center">
                                  <Info className="h-3.5 w-3.5 mr-1 text-blue-500" />
                                  <span>
                                    {t("minOrder") || "Min. Order"}: {reward.minimumOrderValue} {t("egp") || "EGP"}
                                  </span>
                                </div>
                              )}
                              
                              <div className="bg-mediumBlue px-2 py-1 rounded flex items-center">
                                <span className="text-gray-400">
                                  {t("created") || "Created"}: {formatDate(reward.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex md:flex-col gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-primary border-primary hover:bg-primary/20"
                              onClick={() => {
                                setEditingRewardId(reward.id);
                                document.querySelector('[data-state="inactive"][value="create"]')?.dispatchEvent(
                                  new MouseEvent('click', { bubbles: true })
                                );
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              {t("edit") || "Edit"}
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 border-red-500 hover:bg-red-500/20"
                              onClick={() => handleDeleteReward(reward.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {t("delete") || "Delete"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12">
                    <Gift className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">
                      {filterText ? 
                        (t("noMatchingRewards") || "No matching rewards found") : 
                        (t("noRewardsCreated") || "No rewards created yet")}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {filterText ? 
                        (t("tryDifferentSearch") || "Try a different search term") : 
                        (t("createFirstReward") || "Create your first loyalty reward to get started")}
                    </p>
                    {filterText ? (
                      <Button
                        variant="outline"
                        onClick={() => setFilterText("")}
                      >
                        {t("clearSearch") || "Clear Search"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          document.querySelector('[data-state="inactive"][value="create"]')?.dispatchEvent(
                            new MouseEvent('click', { bubbles: true })
                          );
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t("createReward") || "Create Reward"}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Create/Edit Reward Tab */}
        <TabsContent value="create" className="space-y-6">
          <motion.div 
            variants={itemVariants}
            className="w-full"
          >
            <Card className="bg-mediumBlue border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {editingRewardId === null ? (
                    <>
                      <Plus className="h-5 w-5 mr-2 text-primary" />
                      {t("createNewReward") || "Create New Reward"}
                    </>
                  ) : (
                    <>
                      <Edit className="h-5 w-5 mr-2 text-primary" />
                      {t("editReward") || "Edit Reward"}
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {t("rewardFormDescription") || "Define a reward for your loyalty program"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium">{t("basicInformation") || "Basic Information"}</h3>
                          <p className="text-sm text-gray-400">{t("rewardDetails") || "Reward name and description"}</p>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("rewardName") || "Reward Name (English)"}</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                  placeholder={t("rewardNamePlaceholder") || "e.g. 10% Discount"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="nameAr"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("rewardNameAr") || "Reward Name (Arabic)"}</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                  placeholder={t("rewardNameArPlaceholder") || "e.g. خصم 10%"}
                                  dir="rtl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("rewardDescription") || "Description (English)"}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  className="bg-darkBlue border-gray-700 min-h-24"
                                  {...field} 
                                  placeholder={t("rewardDescriptionPlaceholder") || "Describe the reward and how to use it"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="descriptionAr"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("rewardDescriptionAr") || "Description (Arabic)"}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  className="bg-darkBlue border-gray-700 min-h-24"
                                  {...field} 
                                  placeholder={t("rewardDescriptionArPlaceholder") || "وصف المكافأة وكيفية استخدامها"}
                                  dir="rtl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("imageUrl") || "Image URL"}</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-darkBlue border-gray-700"
                                  {...field} 
                                  placeholder={t("imageUrlPlaceholder") || "https://example.com/image.jpg"}
                                />
                              </FormControl>
                              <FormDescription>
                                {t("imageUrlDescription") || "Optional. URL to an image representing this reward"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Reward Configuration */}
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium">{t("rewardConfiguration") || "Reward Configuration"}</h3>
                          <p className="text-sm text-gray-400">{t("pointsCostType") || "Points cost and reward type"}</p>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="pointsCost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("pointsCost") || "Points Cost"}</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-darkBlue border-gray-700"
                                  type="number"
                                  min="1"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                {t("pointsCostDescription") || "Number of points required to redeem this reward"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("rewardType") || "Reward Type"}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-darkBlue border-gray-700">
                                    <SelectValue placeholder="Select reward type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-darkBlue border-gray-700">
                                  <SelectItem value="discount">{t("discount") || "Discount"}</SelectItem>
                                  <SelectItem value="free_product">{t("freeProduct") || "Free Product"}</SelectItem>
                                  <SelectItem value="free_shipping">{t("freeShipping") || "Free Shipping"}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                {t("rewardTypeDescription") || "Type of benefit this reward provides"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("type") === "discount" && (
                          <>
                            <FormField
                              control={form.control}
                              name="discountType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-light">{t("discountType") || "Discount Type"}</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-darkBlue border-gray-700">
                                        <SelectValue placeholder={t("selectDiscountType") || "Select discount type"} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-darkBlue border-gray-700">
                                      <SelectItem value="percentage">{t("percentage") || "Percentage"}</SelectItem>
                                      <SelectItem value="fixed">{t("fixedAmount") || "Fixed Amount"}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="discountValue"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-light">
                                    {form.watch("discountType") === "percentage"
                                      ? (t("discountPercentage") || "Discount Percentage")
                                      : (t("discountAmount") || "Discount Amount")}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input 
                                        className="bg-darkBlue border-gray-700 pl-8"
                                        type="number"
                                        min="0"
                                        step={form.watch("discountType") === "percentage" ? "1" : "0.01"}
                                        {...field} 
                                      />
                                      <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                        {form.watch("discountType") === "percentage" ? "%" : "£"}
                                      </div>
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    {form.watch("discountType") === "percentage"
                                      ? (t("discountPercentageDescription") || "Percentage off the order total")
                                      : (t("discountAmountDescription") || "Fixed amount off the order total in EGP")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        
                        {form.watch("type") === "free_product" && (
                          <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-light">{t("productId") || "Product ID"}</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="bg-darkBlue border-gray-700"
                                    type="number"
                                    min="1"
                                    {...field} 
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {t("productIdDescription") || "The product to give for free with this reward"}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <FormField
                          control={form.control}
                          name="minimumOrderValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-light">{t("minimumOrderValue") || "Minimum Order Value (EGP)"}</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-darkBlue border-gray-700"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  {...field} 
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                {t("minimumOrderDescription") || "Optional. Minimum order value required to use this reward"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="active"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border border-gray-700">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">{t("active") || "Active"}</FormLabel>
                                <FormDescription>
                                  {t("activeDescription") || "Is this reward currently available to users?"}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          form.reset();
                          setEditingRewardId(null);
                          document.querySelector('[data-state="inactive"][value="manage"]')?.dispatchEvent(
                            new MouseEvent('click', { bubbles: true })
                          );
                        }}
                      >
                        {t("cancel") || "Cancel"}
                      </Button>
                      
                      <Button type="submit">
                        {editingRewardId === null
                          ? (t("createReward") || "Create Reward")
                          : (t("updateReward") || "Update Reward")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}