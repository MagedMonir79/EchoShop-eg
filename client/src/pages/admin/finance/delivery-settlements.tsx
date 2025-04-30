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
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  Calendar, 
  Check, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  Package2, 
  TrendingUp 
} from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import AdminLayout from "@/components/layout/admin-layout";
import { convertUSDtoEGP } from "@/lib/currency-formatter";
import { formatDate } from "@/lib/date-formatter";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

// Mock data for demonstration
const deliveryCompanies = [
  { 
    id: 1,
    name: "شركة التوصيل السريع", 
    nameEn: "Fast Delivery Co.",
    settledAmount: 55250.40,
    pendingAmount: 8950.60,
    totalOrders: 560,
    successRate: 98.5,
    commissionRate: 5.0
  },
  { 
    id: 2,
    name: "شركة النقل الأمين", 
    nameEn: "Secure Transport Co.",
    settledAmount: 42180.75,
    pendingAmount: 6840.25,
    totalOrders: 420,
    successRate: 97.2,
    commissionRate: 5.5
  },
  { 
    id: 3,
    name: "شركة الشحن المتحدة", 
    nameEn: "United Shipping Co.",
    settledAmount: 28560.25,
    pendingAmount: 4630.50,
    totalOrders: 310,
    successRate: 96.8,
    commissionRate: 6.0
  },
  { 
    id: 4,
    name: "خدمة التوصيل الممتازة", 
    nameEn: "Premium Delivery Service",
    settledAmount: 15240.90,
    pendingAmount: 2470.35,
    totalOrders: 180,
    successRate: 95.5,
    commissionRate: 6.5
  },
];

const settlementHistory = [
  { 
    id: 1,
    companyId: 1,
    companyName: "شركة التوصيل السريع",
    period: "أبريل 2025 (النصف الأول)",
    periodStart: "2025-04-01",
    periodEnd: "2025-04-15",
    orderCount: 245,
    successfulOrders: 240,
    failedOrders: 5,
    totalAmount: 22500.75,
    collectedAmount: 19125.64,
    outstandingAmount: 3375.11,
    percentage: 85,
    commissionRate: 5.0,
    commissionAmount: 956.28,
    notes: "تأخر في تسوية بعض الطلبات بسبب المناطق النائية",
    status: "reconciling",
    createdAt: "2025-04-16",
    settledAt: null
  },
  { 
    id: 2,
    companyId: 2,
    companyName: "شركة النقل الأمين",
    period: "أبريل 2025 (النصف الأول)",
    periodStart: "2025-04-01",
    periodEnd: "2025-04-15",
    orderCount: 180,
    successfulOrders: 174,
    failedOrders: 6,
    totalAmount: 16800.50,
    collectedAmount: 15120.45,
    outstandingAmount: 1680.05,
    percentage: 90,
    commissionRate: 5.5,
    commissionAmount: 831.62,
    notes: "",
    status: "pending",
    createdAt: "2025-04-16",
    settledAt: null
  },
  { 
    id: 3,
    companyId: 3,
    companyName: "شركة الشحن المتحدة",
    period: "أبريل 2025 (النصف الأول)",
    periodStart: "2025-04-01",
    periodEnd: "2025-04-15",
    orderCount: 120,
    successfulOrders: 112,
    failedOrders: 8,
    totalAmount: 11200.30,
    collectedAmount: 9856.26,
    outstandingAmount: 1344.04,
    percentage: 88,
    commissionRate: 6.0,
    commissionAmount: 591.38,
    notes: "مشاكل في التحصيل في المناطق الجديدة",
    status: "reconciling",
    createdAt: "2025-04-16",
    settledAt: null
  },
  { 
    id: 4,
    companyId: 1,
    companyName: "شركة التوصيل السريع",
    period: "مارس 2025 (النصف الثاني)",
    periodStart: "2025-03-16",
    periodEnd: "2025-03-31",
    orderCount: 235,
    successfulOrders: 232,
    failedOrders: 3,
    totalAmount: 21250.80,
    collectedAmount: 21250.80,
    outstandingAmount: 0,
    percentage: 100,
    commissionRate: 5.0,
    commissionAmount: 1062.54,
    notes: "تمت التسوية بالكامل في الموعد المحدد",
    status: "completed",
    createdAt: "2025-04-01",
    settledAt: "2025-04-05"
  },
  { 
    id: 5,
    companyId: 2,
    companyName: "شركة النقل الأمين",
    period: "مارس 2025 (النصف الثاني)",
    periodStart: "2025-03-16",
    periodEnd: "2025-03-31",
    orderCount: 165,
    successfulOrders: 160,
    failedOrders: 5,
    totalAmount: 15375.45,
    collectedAmount: 15375.45,
    outstandingAmount: 0,
    percentage: 100,
    commissionRate: 5.5,
    commissionAmount: 845.65,
    notes: "تمت التسوية بالكامل في الموعد المحدد",
    status: "completed",
    createdAt: "2025-04-01",
    settledAt: "2025-04-06"
  },
];

const settlementColumns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "companyName", header: "شركة التوصيل" },
  { accessorKey: "period", header: "الفترة" },
  { accessorKey: "orderCount", header: "عدد الطلبات" },
  { 
    accessorKey: "totalAmount", 
    header: "المبلغ الإجمالي",
    cell: ({ row }: any) => (
      <CurrencyDisplay amount={convertUSDtoEGP(row.getValue("totalAmount"))} />
    ),
  },
  { 
    accessorKey: "collectedAmount", 
    header: "المبلغ المحصل",
    cell: ({ row }: any) => (
      <CurrencyDisplay amount={convertUSDtoEGP(row.getValue("collectedAmount"))} />
    ),
  },
  { 
    accessorKey: "percentage", 
    header: "نسبة التحصيل",
    cell: ({ row }: any) => {
      const percentage = row.getValue("percentage");
      
      return (
        <div className="flex items-center gap-2">
          <Progress value={percentage} className="h-2 w-20" />
          <span>{percentage}%</span>
        </div>
      );
    }
  },
  { 
    accessorKey: "status", 
    header: "الحالة",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      
      return (
        <Badge variant={
          status === "pending" ? "outline" : 
          status === "reconciling" ? "secondary" : 
          "success"
        }>
          {status === "pending" ? "قيد الانتظار" :
           status === "reconciling" ? "قيد التسوية" :
           "مكتمل"}
        </Badge>
      );
    }
  },
  { 
    accessorKey: "actions", 
    header: "",
    cell: ({ row }: any) => {
      const id = row.original.id;
      const status = row.getValue("status");
      
      if (status === "completed") {
        return (
          <Button variant="ghost" size="sm" asChild>
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              التفاصيل
            </span>
          </Button>
        );
      }
      
      return (
        <Button variant="default" size="sm">إدارة</Button>
      );
    }
  },
];

export default function DeliverySettlements() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from: Date;
    to: Date;
  } | undefined>({
    from: new Date(new Date().setDate(1)), // First day of current month
    to: new Date(),
  });
  
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSettlementData, setNewSettlementData] = useState({
    companyId: "",
    periodStart: "",
    periodEnd: "",
    notes: ""
  });
  
  // In a real application, these would be API queries
  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['/api/admin/finance/delivery-companies'],
    queryFn: () => Promise.resolve(deliveryCompanies),
  });
  
  const { data: settlements, isLoading: isLoadingSettlements } = useQuery({
    queryKey: ['/api/admin/finance/delivery-settlements'],
    queryFn: () => Promise.resolve(settlementHistory),
  });
  
  // Filter settlements based on selected criteria
  const filteredSettlements = settlements?.filter(settlement => {
    if (selectedCompany !== "all" && settlement.companyId !== parseInt(selectedCompany)) {
      return false;
    }
    if (selectedStatus !== "all" && settlement.status !== selectedStatus) {
      return false;
    }
    if (selectedDateRange) {
      const settlementDate = new Date(settlement.createdAt);
      if (settlementDate < selectedDateRange.from || settlementDate > selectedDateRange.to) {
        return false;
      }
    }
    return true;
  }) || [];
  
  // New settlement creation mutation
  const createSettlementMutation = useMutation({
    mutationFn: async (settlementData: any) => {
      // In a real application, this would be an API call
      // return apiRequest('POST', '/api/admin/finance/create-settlement', settlementData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, id: Date.now() };
    },
    onSuccess: () => {
      toast({
        title: t('settlementPeriodCreated'),
        description: t('newSettlementPeriodHasBeenCreatedSuccessfully'),
      });
      
      setCreateDialogOpen(false);
      setNewSettlementData({
        companyId: "",
        periodStart: "",
        periodEnd: "",
        notes: ""
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/finance/delivery-settlements'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('errorCreatingSettlement'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSettlementData({ ...newSettlementData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewSettlementData({ ...newSettlementData, [name]: value });
  };
  
  const handleCreateSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSettlementData.companyId || !newSettlementData.periodStart || !newSettlementData.periodEnd) {
      toast({
        title: t('validationError'),
        description: t('pleaseCompleteAllRequiredFields'),
        variant: 'destructive',
      });
      return;
    }
    
    createSettlementMutation.mutate(newSettlementData);
  };
  
  const isLoading = isLoadingCompanies || isLoadingSettlements;
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('deliveryCompanySettlements')}</h1>
            <p className="text-muted-foreground">{t('manageFinancialSettlementsWithDeliveryCompanies')}</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                {t('createNewSettlementPeriod')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('createNewSettlementPeriod')}</DialogTitle>
                <DialogDescription>
                  {t('settleDeliveryCompanyOrdersForASpecificPeriod')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSettlement} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyId">{t('deliveryCompany')}</Label>
                  <Select
                    value={newSettlementData.companyId}
                    onValueChange={(value) => handleSelectChange('companyId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectDeliveryCompany')} />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {language === 'ar' ? company.name : company.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodStart">{t('periodStart')}</Label>
                    <Input
                      id="periodStart"
                      name="periodStart"
                      type="date"
                      value={newSettlementData.periodStart}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="periodEnd">{t('periodEnd')}</Label>
                    <Input
                      id="periodEnd"
                      name="periodEnd"
                      type="date"
                      value={newSettlementData.periodEnd}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">{t('notes')} ({t('optional')})</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newSettlementData.notes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)} type="button">
                    {t('cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createSettlementMutation.isPending}
                  >
                    {createSettlementMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('processing')}...
                      </>
                    ) : (
                      t('createSettlement')
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Company Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">
                      {language === 'ar' ? company.name : company.nameEn}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('commissionRate')}: {company.commissionRate}%
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-muted/50 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">{t('settled')}</p>
                    <p className="font-medium truncate">
                      <CurrencyDisplay amount={convertUSDtoEGP(company.settledAmount)} />
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-2 rounded-md">
                    <p className="text-xs text-yellow-700">{t('pending')}</p>
                    <p className="font-medium text-yellow-800 truncate">
                      <CurrencyDisplay amount={convertUSDtoEGP(company.pendingAmount)} />
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{t('deliverySuccess')}</span>
                    <span>{company.successRate}%</span>
                  </div>
                  <Progress value={company.successRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Settlements Listing */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settlementHistory')}</CardTitle>
            <CardDescription>
              {t('viewAndManageDeliveryCompanySettlements')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger 
                  value="all" 
                  onClick={() => setSelectedStatus("all")}
                >
                  {t('all')}
                </TabsTrigger>
                <TabsTrigger 
                  value="pending" 
                  onClick={() => setSelectedStatus("pending")}
                >
                  {t('pending')}
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  onClick={() => setSelectedStatus("completed")}
                >
                  {t('completed')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-64">
                <Label htmlFor="companyFilter" className="mb-2 block">{t('filterByCompany')}</Label>
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger id="companyFilter">
                    <SelectValue placeholder={t('selectCompany')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allCompanies')}</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {language === 'ar' ? company.name : company.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto flex-1">
                <Label className="mb-2 block">{t('filterByDate')}</Label>
                <DateRangePicker
                  value={selectedDateRange}
                  onChange={setSelectedDateRange}
                />
              </div>
            </div>
            
            <DataTable 
              columns={settlementColumns} 
              data={filteredSettlements}
              searchKey="companyName" 
            />
            
            {filteredSettlements.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">{t('noSettlementsFound')}</h3>
                <p className="text-muted-foreground max-w-md mt-1">
                  {t('noSettlementsMatchingFiltersCriteria')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Settlement Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settlementStatistics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{t('completedSettlements')}</p>
                    <h3 className="text-xl font-medium">
                      {settlements?.filter(s => s.status === "completed").length || 0}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Package2 className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{t('pendingSettlements')}</p>
                    <h3 className="text-xl font-medium">
                      {settlements?.filter(s => s.status !== "completed").length || 0}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{t('averageCollectionRate')}</p>
                    <h3 className="text-xl font-medium">
                      {settlements && settlements.length > 0
                        ? (
                            settlements.reduce((sum, item) => sum + item.percentage, 0) / 
                            settlements.length
                          ).toFixed(1)
                        : 0}%
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('deliveryCompany')}</TableHead>
                      <TableHead>{t('totalOrders')}</TableHead>
                      <TableHead>{t('totalCollected')}</TableHead>
                      <TableHead>{t('commissionEarned')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => {
                      // Calculate company-specific totals from settlements
                      const companySettlements = settlements?.filter(s => s.companyId === company.id) || [];
                      const totalOrders = companySettlements.reduce((sum, s) => sum + s.orderCount, 0);
                      const totalCollected = companySettlements.reduce((sum, s) => sum + s.collectedAmount, 0);
                      const totalCommission = companySettlements.reduce((sum, s) => sum + s.commissionAmount, 0);
                      
                      return (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">
                            {language === 'ar' ? company.name : company.nameEn}
                          </TableCell>
                          <TableCell>{totalOrders}</TableCell>
                          <TableCell>
                            <CurrencyDisplay amount={convertUSDtoEGP(totalCollected)} />
                          </TableCell>
                          <TableCell>
                            <CurrencyDisplay amount={convertUSDtoEGP(totalCommission)} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}