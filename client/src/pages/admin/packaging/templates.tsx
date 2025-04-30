import { useState, useEffect, useContext } from "react";
import AdminDashboardLayout from "@/components/layout/admin-dashboard-layout";
import { LanguageContext } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Search, Plus, Edit, Trash, BookOpen, 
  Eye, Archive, Download, Check, X
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter,
  DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

// بيانات تجريبية
const packagingTemplates = [
  { 
    id: 1, 
    name: "التغليف العادي للمنتجات الصغيرة", 
    nameAr: "التغليف العادي للمنتجات الصغيرة",
    description: "يناسب المنتجات الصغيرة الحجم مثل الإكسسوارات والهواتف وملحقاتها", 
    descriptionAr: "يناسب المنتجات الصغيرة الحجم مثل الإكسسوارات والهواتف وملحقاتها",
    categoryId: 1, 
    categoryName: "إلكترونيات",
    instructionsUrl: "https://example.com/packaging-instructions-1.pdf", 
    materialRequirements: {
      bubble_wrap: true,
      cardboard_box: true,
      tape: true,
      packing_peanuts: false,
      plastic_wrap: false
    }, 
    qrPlacementInstructions: "ضع رمز QR على الجانب العلوي من العبوة بعد إغلاقها تمامًا", 
    isDefault: true, 
    isActive: true, 
    createdAt: "2023-06-10T09:00:00", 
    updatedAt: "2023-06-10T09:00:00" 
  },
  { 
    id: 2, 
    name: "التغليف المضاعف للمنتجات القابلة للكسر", 
    nameAr: "التغليف المضاعف للمنتجات القابلة للكسر",
    description: "للمنتجات الزجاجية والخزفية والقابلة للكسر، يوفر حماية مضاعفة", 
    descriptionAr: "للمنتجات الزجاجية والخزفية والقابلة للكسر، يوفر حماية مضاعفة",
    categoryId: 2, 
    categoryName: "أدوات منزلية",
    instructionsUrl: "https://example.com/packaging-instructions-2.pdf", 
    materialRequirements: {
      bubble_wrap: true,
      cardboard_box: true,
      tape: true,
      packing_peanuts: true,
      plastic_wrap: true
    }, 
    qrPlacementInstructions: "ضع رمز QR داخل كيس بلاستيكي وألصقه على الجانب الخارجي للعبوة", 
    isDefault: false, 
    isActive: true, 
    createdAt: "2023-06-11T10:15:00", 
    updatedAt: "2023-06-12T08:30:00" 
  },
  { 
    id: 3, 
    name: "تغليف الملابس والمنسوجات", 
    nameAr: "تغليف الملابس والمنسوجات",
    description: "مناسب للملابس والمنسوجات، يحافظ على نظافتها وعدم تجعدها", 
    descriptionAr: "مناسب للملابس والمنسوجات، يحافظ على نظافتها وعدم تجعدها",
    categoryId: 3, 
    categoryName: "ملابس وأزياء",
    instructionsUrl: "https://example.com/packaging-instructions-3.pdf", 
    materialRequirements: {
      bubble_wrap: false,
      cardboard_box: false,
      tape: true,
      packing_peanuts: false,
      plastic_wrap: true
    }, 
    qrPlacementInstructions: "ضع رمز QR على الكيس البلاستيكي الخارجي قبل إغلاقه", 
    isDefault: true, 
    isActive: true, 
    createdAt: "2023-06-12T14:20:00", 
    updatedAt: "2023-06-12T14:20:00" 
  },
  { 
    id: 4, 
    name: "تغليف المنتجات الكبيرة", 
    nameAr: "تغليف المنتجات الكبيرة",
    description: "للأجهزة الكبيرة والأثاث، يوفر حماية من الخدوش والصدمات", 
    descriptionAr: "للأجهزة الكبيرة والأثاث، يوفر حماية من الخدوش والصدمات",
    categoryId: 4, 
    categoryName: "أثاث ومفروشات",
    instructionsUrl: "https://example.com/packaging-instructions-4.pdf", 
    materialRequirements: {
      bubble_wrap: true,
      cardboard_box: true,
      tape: true,
      packing_peanuts: true,
      plastic_wrap: true
    }, 
    qrPlacementInstructions: "ثبت رمز QR داخل كيس مستندات وألصقه على أعلى المنتج", 
    isDefault: false, 
    isActive: false, 
    createdAt: "2023-06-13T11:10:00", 
    updatedAt: "2023-06-15T09:45:00" 
  },
  { 
    id: 5, 
    name: "تغليف المنتجات الإلكترونية الحساسة", 
    nameAr: "تغليف المنتجات الإلكترونية الحساسة",
    description: "للأجهزة الإلكترونية الحساسة، يوفر حماية من الصدمات والكهرباء الساكنة", 
    descriptionAr: "للأجهزة الإلكترونية الحساسة، يوفر حماية من الصدمات والكهرباء الساكنة",
    categoryId: 1, 
    categoryName: "إلكترونيات",
    instructionsUrl: "https://example.com/packaging-instructions-5.pdf", 
    materialRequirements: {
      bubble_wrap: true,
      cardboard_box: true,
      tape: true,
      packing_peanuts: true,
      plastic_wrap: false
    }, 
    qrPlacementInstructions: "ضع رمز QR خارج العبوة الكرتونية وداخل الغلاف الشفاف", 
    isDefault: false, 
    isActive: true, 
    createdAt: "2023-06-14T13:30:00", 
    updatedAt: "2023-06-14T16:15:00" 
  }
];

const categories = [
  { id: 1, name: "إلكترونيات" },
  { id: 2, name: "أدوات منزلية" },
  { id: 3, name: "ملابس وأزياء" },
  { id: 4, name: "أثاث ومفروشات" },
  { id: 5, name: "مستلزمات أطفال" },
  { id: 6, name: "مستحضرات تجميل" },
  { id: 7, name: "أدوات رياضية" },
  { id: 8, name: "كتب ووسائط" }
];

// مكون تفاصيل القالب والتعديل
function TemplateDialog({ template, isNew = false, onSubmit }: { template?: any, isNew?: boolean, onSubmit: (data: any) => void }) {
  const { t, language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: template?.name || '',
    nameAr: template?.nameAr || '',
    description: template?.description || '',
    descriptionAr: template?.descriptionAr || '',
    categoryId: template?.categoryId?.toString() || '',
    instructionsUrl: template?.instructionsUrl || '',
    qrPlacementInstructions: template?.qrPlacementInstructions || '',
    isDefault: template?.isDefault || false,
    isActive: template?.isActive || true,
    materialRequirements: {
      bubble_wrap: template?.materialRequirements?.bubble_wrap || false,
      cardboard_box: template?.materialRequirements?.cardboard_box || false,
      tape: template?.materialRequirements?.tape || false,
      packing_peanuts: template?.materialRequirements?.packing_peanuts || false,
      plastic_wrap: template?.materialRequirements?.plastic_wrap || false
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, id: template?.id });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name.startsWith('material_')) {
      const material = name.replace('material_', '');
      setFormData(prev => ({
        ...prev,
        materialRequirements: {
          ...prev.materialRequirements,
          [material]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isNew ? (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("addNewTemplate")}
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isNew ? t("addNewPackagingTemplate") : t("editPackagingTemplate")}</DialogTitle>
          <DialogDescription>
            {t("provideMaterialsAndInstructionsForPackagingProducts")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("templateNameEnglish")}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("enterTemplateNameEnglish")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">{t("templateNameArabic")}</Label>
              <Input
                id="nameAr"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleInputChange}
                placeholder={t("enterTemplateNameArabic")}
                dir="rtl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("descriptionEnglish")}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t("enterDescriptionEnglish")}
                className="h-24"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionAr">{t("descriptionArabic")}</Label>
              <Textarea
                id="descriptionAr"
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleInputChange}
                placeholder={t("enterDescriptionArabic")}
                dir="rtl"
                className="h-24"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">{t("productCategory")}</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleSelectChange('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructionsUrl">{t("instructionsUrl")}</Label>
              <Input
                id="instructionsUrl"
                name="instructionsUrl"
                value={formData.instructionsUrl}
                onChange={handleInputChange}
                placeholder={t("enterInstructionsUrl")}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qrPlacementInstructions">{t("qrPlacementInstructions")}</Label>
            <Textarea
              id="qrPlacementInstructions"
              name="qrPlacementInstructions"
              value={formData.qrPlacementInstructions}
              onChange={handleInputChange}
              placeholder={t("enterQrPlacementInstructions")}
              className="h-16"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t("requiredPackagingMaterials")}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.materialRequirements.bubble_wrap}
                  onCheckedChange={(checked) => handleSwitchChange('material_bubble_wrap', checked)}
                  id="material_bubble_wrap"
                />
                <Label htmlFor="material_bubble_wrap">{t("bubbleWrap")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.materialRequirements.cardboard_box}
                  onCheckedChange={(checked) => handleSwitchChange('material_cardboard_box', checked)}
                  id="material_cardboard_box"
                />
                <Label htmlFor="material_cardboard_box">{t("cardboardBox")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.materialRequirements.tape}
                  onCheckedChange={(checked) => handleSwitchChange('material_tape', checked)}
                  id="material_tape"
                />
                <Label htmlFor="material_tape">{t("packagingTape")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.materialRequirements.packing_peanuts}
                  onCheckedChange={(checked) => handleSwitchChange('material_packing_peanuts', checked)}
                  id="material_packing_peanuts"
                />
                <Label htmlFor="material_packing_peanuts">{t("packingPeanuts")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.materialRequirements.plastic_wrap}
                  onCheckedChange={(checked) => handleSwitchChange('material_plastic_wrap', checked)}
                  id="material_plastic_wrap"
                />
                <Label htmlFor="material_plastic_wrap">{t("plasticWrap")}</Label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isDefault}
                onCheckedChange={(checked) => handleSwitchChange('isDefault', checked)}
                id="isDefault"
              />
              <Label htmlFor="isDefault">{t("setAsDefault")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                id="isActive"
              />
              <Label htmlFor="isActive">{t("isActive")}</Label>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button type="submit">{isNew ? t("createTemplate") : t("updateTemplate")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// حالة القالب كمكون
const TemplateStatus = ({ isActive }: { isActive: boolean }) => {
  const { t } = useContext(LanguageContext);
  
  return isActive ? (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
      <Check className="w-3 h-3 mr-1" />
      {t("active")}
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
      <X className="w-3 h-3 mr-1" />
      {t("inactive")}
    </Badge>
  );
};

export default function PackagingTemplatesManagement() {
  const { t, language } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState(packagingTemplates);
  const { toast } = useToast();

  // محاكاة الحصول على البيانات
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // تصفية وفرز البيانات
  const filteredTemplates = templates.filter(template => {
    if (searchQuery) {
      return (
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.nameAr.includes(searchQuery) ||
        template.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  // إضافة قالب جديد
  const handleAddTemplate = (data: any) => {
    const newTemplate = {
      ...data,
      id: templates.length + 1,
      categoryName: categories.find(c => c.id.toString() === data.categoryId)?.name || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTemplates([...templates, newTemplate]);
    
    toast({
      title: t("templateCreated"),
      description: t("newPackagingTemplateCreatedSuccessfully"),
    });
  };

  // تحديث قالب
  const handleUpdateTemplate = (data: any) => {
    const updatedTemplates = templates.map(template => {
      if (template.id === data.id) {
        return {
          ...template,
          ...data,
          categoryName: categories.find(c => c.id.toString() === data.categoryId)?.name || template.categoryName,
          updatedAt: new Date().toISOString()
        };
      }
      return template;
    });
    
    setTemplates(updatedTemplates);
    
    toast({
      title: t("templateUpdated"),
      description: t("packagingTemplateUpdatedSuccessfully"),
    });
  };

  // حذف قالب
  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter(template => template.id !== id));
    
    toast({
      title: t("templateDeleted"),
      description: t("packagingTemplateDeletedSuccessfully"),
    });
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t("packagingTemplatesManagement")}</h1>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <TemplateDialog
              isNew={true}
              onSubmit={handleAddTemplate}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("packagingTemplatesList")}</CardTitle>
            <CardDescription>{t("manageAndCreatePackagingTemplatesForDifferentProductCategories")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="relative w-full sm:w-auto flex">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder={t("searchTemplates")}
                    className="pl-9 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("templateName")}</TableHead>
                        <TableHead>{t("category")}</TableHead>
                        <TableHead>{t("materialsCount")}</TableHead>
                        <TableHead>{t("status")}</TableHead>
                        <TableHead>{t("isDefault")}</TableHead>
                        <TableHead className="text-right">{t("actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{language === 'ar' ? template.nameAr : template.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                                {language === 'ar' ? template.descriptionAr : template.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{template.categoryName}</TableCell>
                          <TableCell>
                            {Object.values(template.materialRequirements).filter(Boolean).length}
                          </TableCell>
                          <TableCell>
                            <TemplateStatus isActive={template.isActive} />
                          </TableCell>
                          <TableCell>
                            {template.isDefault && (
                              <Badge variant="secondary">
                                {t("default")}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" asChild>
                                <a href={template.instructionsUrl} target="_blank" rel="noopener noreferrer">
                                  <BookOpen className="h-4 w-4" />
                                </a>
                              </Button>
                              <TemplateDialog 
                                template={template} 
                                onSubmit={handleUpdateTemplate} 
                              />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}