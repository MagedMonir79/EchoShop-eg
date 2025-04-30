import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, 
  BankIcon, 
  CreditCard, 
  DollarSign, 
  Loader2, 
  PiggyBank,
  HelpCircle
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import SellerLayout from "@/components/layout/seller-layout";
import { convertUSDtoEGP } from "@/lib/currency-formatter";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

// Mock data for demonstration
const sellerBalance = {
  availableBalance: 2150.75,
  pendingBalance: 980.25,
  minimumPayoutAmount: 100,
  lastPayoutDate: "2025-03-15",
  lastPayoutAmount: 1250.50
};

const payoutMethods = [
  { id: "bank_transfer", name: "تحويل بنكي", nameEn: "Bank Transfer", icon: <BankIcon className="w-5 h-5" /> },
  { id: "paypal", name: "باي بال", nameEn: "PayPal", icon: <CreditCard className="w-5 h-5" />, disabled: true },
  { id: "wallet", name: "محفظة إلكترونية", nameEn: "E-Wallet", icon: <PiggyBank className="w-5 h-5" />, disabled: true }
];

export default function RequestPayout() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    amount: sellerBalance.availableBalance.toString(),
    method: "bank_transfer",
    bankName: "",
    accountNumber: "",
    accountName: "",
    notes: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // In a real application, this would be an API query
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['/api/seller/finance/balance'],
    queryFn: () => Promise.resolve(sellerBalance),
  });
  
  // Example payout mutation
  const payoutMutation = useMutation({
    mutationFn: async (payoutData: any) => {
      // In a real application, this would be an API call
      // return apiRequest('POST', '/api/seller/finance/request-payout', payoutData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, id: Date.now() };
    },
    onSuccess: () => {
      toast({
        title: t('payoutRequestSubmitted'),
        description: t('yourPayoutRequestHasBeenSubmitted'),
      });
      
      // Reset form and invalidate queries
      setFormData({
        amount: "",
        method: "bank_transfer",
        bankName: "",
        accountNumber: "",
        accountName: "",
        notes: "",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/seller/finance/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/seller/finance/payouts'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('payoutRequestFailed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Amount validation
    const amountValue = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = t('amountIsRequired');
    } else if (isNaN(amountValue)) {
      newErrors.amount = t('amountMustBeANumber');
    } else if (amountValue <= 0) {
      newErrors.amount = t('amountMustBeGreaterThanZero');
    } else if (amountValue > balance.availableBalance) {
      newErrors.amount = t('insufficientBalance');
    } else if (amountValue < balance.minimumPayoutAmount) {
      newErrors.amount = t('amountBelowMinimum', { min: balance.minimumPayoutAmount });
    }
    
    // Bank details validation for bank transfer
    if (formData.method === 'bank_transfer') {
      if (!formData.bankName) {
        newErrors.bankName = t('bankNameIsRequired');
      }
      if (!formData.accountNumber) {
        newErrors.accountNumber = t('accountNumberIsRequired');
      }
      if (!formData.accountName) {
        newErrors.accountName = t('accountNameIsRequired');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert amount to number before sending
      const payoutData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      payoutMutation.mutate(payoutData);
    }
  };
  
  if (isLoadingBalance) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </SellerLayout>
    );
  }
  
  return (
    <SellerLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{t('requestPayout')}</h1>
        <p className="text-muted-foreground mb-6">{t('requestPayoutDescription')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('availableBalance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CurrencyDisplay amount={convertUSDtoEGP(balance.availableBalance)} className="text-2xl font-bold" />
                  <p className="text-xs text-muted-foreground">
                    ${balance.availableBalance.toFixed(2)} USD
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('pendingBalance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <CurrencyDisplay amount={convertUSDtoEGP(balance.pendingBalance)} className="text-2xl font-bold" />
                  <p className="text-xs text-muted-foreground">
                    ${balance.pendingBalance.toFixed(2)} USD
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Payout Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('payoutRequestForm')}</CardTitle>
            <CardDescription>{t('fillTheFormToRequestAPayout')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payout Amount */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="amount">{t('payoutAmount')}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {t('minimumPayoutAmount')}: ${balance.minimumPayoutAmount.toFixed(2)} USD (
                          <CurrencyDisplay amount={convertUSDtoEGP(balance.minimumPayoutAmount)} showCurrency={false} />
                          {" "}{t('egp')})
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input 
                    id="amount"
                    name="amount"
                    type="text"
                    className="pl-8"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && <p className="text-destructive text-sm">{errors.amount}</p>}
                <p className="text-sm text-muted-foreground mt-1">
                  ≈ <CurrencyDisplay amount={convertUSDtoEGP(parseFloat(formData.amount) || 0)} />
                </p>
              </div>
              
              {/* Payout Method */}
              <div className="space-y-2">
                <Label htmlFor="method">{t('payoutMethod')}</Label>
                <div className="space-y-3">
                  {payoutMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-3 space-x-reverse border rounded-lg p-4 cursor-pointer transition-colors ${
                        method.disabled ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        formData.method === method.id && !method.disabled
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => !method.disabled && handleSelectChange('method', method.id)}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          {method.icon}
                        </div>
                        <div>
                          <p className={`font-medium ${method.disabled ? 'cursor-not-allowed' : ''}`}>
                            {language === 'ar' ? method.name : method.nameEn}
                          </p>
                        </div>
                      </div>
                      
                      {method.disabled && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {t('comingSoon')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {errors.method && <p className="text-destructive text-sm">{errors.method}</p>}
              </div>
              
              {/* Bank Details (for bank transfer) */}
              {formData.method === 'bank_transfer' && (
                <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-medium">{t('bankDetails')}</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankName">{t('bankName')}</Label>
                    <Input 
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder={t('enterBankName')}
                    />
                    {errors.bankName && <p className="text-destructive text-sm">{errors.bankName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">{t('accountNumber')}</Label>
                    <Input 
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder={t('enterAccountNumber')}
                    />
                    {errors.accountNumber && <p className="text-destructive text-sm">{errors.accountNumber}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountName">{t('accountHolderName')}</Label>
                    <Input 
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder={t('enterAccountHolderName')}
                    />
                    {errors.accountName && <p className="text-destructive text-sm">{errors.accountName}</p>}
                  </div>
                </div>
              )}
              
              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">{t('additionalNotes')} ({t('optional')})</Label>
                <Textarea 
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={t('anyAdditionalInformation')}
                  rows={3}
                />
              </div>
              
              {/* Information Alert */}
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle>{t('payoutProcessingTime')}</AlertTitle>
                <AlertDescription>
                  {t('payoutProcessingDescription')}
                </AlertDescription>
              </Alert>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={payoutMutation.isPending}
              >
                {payoutMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('processing')}...
                  </>
                ) : (
                  t('submitPayoutRequest')
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 items-start">
            <p className="text-sm text-muted-foreground">
              {t('lastPayout')}: {balance.lastPayoutDate} (
              <CurrencyDisplay amount={convertUSDtoEGP(balance.lastPayoutAmount)} />)
            </p>
          </CardFooter>
        </Card>
      </div>
    </SellerLayout>
  );
}