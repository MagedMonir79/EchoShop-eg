import { useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { LanguageContext } from "@/context/language-context";
import MainLayout from "@/components/layout/main-layout";
import ProductGrid from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter, Search, ChevronDown, ChevronUp } from "lucide-react";
import { getCategories } from "@/lib/firebase";
import { Category } from "@shared/schema";

export default function Products() {
  const { t, language } = useContext(LanguageContext);
  const [location, setLocation] = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("popularity");
  const [inStock, setInStock] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories as unknown as Category[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Mock categories for development
  const mockCategories = [
    { id: 1, name: "electronics", nameAr: "الإلكترونيات" },
    { id: 2, name: "fashion", nameAr: "الأزياء" },
    { id: 3, name: "home", nameAr: "المنزل" },
    { id: 4, name: "beauty", nameAr: "الجمال" },
    { id: 5, name: "sports", nameAr: "الرياضة" },
    { id: 6, name: "toys", nameAr: "الألعاب" },
  ];

  const displayCategories = categories.length > 0 ? categories : mockCategories;

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Searching for:", searchQuery);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t("allProducts")}</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 md:hidden"
              onClick={toggleFilters}
            >
              <Filter className="h-4 w-4" />
              {t("filter")}
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Mobile View */}
          {showFilters && (
            <div className="w-full md:hidden bg-mediumBlue p-4 rounded-lg mb-4">
              <h2 className="font-bold text-lg mb-4">{t("filter")}</h2>
              
              <Accordion type="single" collapsible className="mb-4">
                <AccordionItem value="categories">
                  <AccordionTrigger>{t("categories")}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {displayCategories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox 
                            id={`category-${category.id}`} 
                            checked={selectedCategory === category.name}
                            onCheckedChange={() => setSelectedCategory(category.name)}
                          />
                          <Label htmlFor={`category-${category.id}`} className="ml-2">
                            {language === "ar" && category.nameAr ? category.nameAr : t(category.name)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger>{t("price")}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider 
                        defaultValue={[0, 1000]} 
                        max={1000} 
                        step={10}
                        value={priceRange}
                        onValueChange={handlePriceChange}
                      />
                      <div className="flex justify-between">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="availability">
                  <AccordionTrigger>{t("availability")}</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center">
                      <Checkbox 
                        id="in-stock-mobile" 
                        checked={inStock}
                        onCheckedChange={(checked) => setInStock(checked as boolean)}
                      />
                      <Label htmlFor="in-stock-mobile" className="ml-2">
                        {t("inStock")}
                      </Label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setPriceRange([0, 1000]);
                  setSelectedCategory("");
                  setInStock(true);
                }}>
                  {t("clear")}
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  {t("apply")}
                </Button>
              </div>
            </div>
          )}
          
          {/* Filters - Desktop View */}
          <div className="hidden md:block w-1/4 sticky top-24 self-start bg-mediumBlue p-4 rounded-lg">
            <h2 className="font-bold text-lg mb-4">{t("filter")}</h2>
            
            {/* Search */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">{t("search")}</h3>
              <form onSubmit={handleSearch} className="flex">
                <Input 
                  placeholder={t("searchPlaceholder")} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mr-2 bg-darkBlue border-gray-700"
                />
                <Button size="icon" type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">{t("categories")}</h3>
              <div className="space-y-2">
                {displayCategories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={selectedCategory === category.name}
                      onCheckedChange={() => setSelectedCategory(category.name)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="ml-2">
                      {language === "ar" && category.nameAr ? category.nameAr : t(category.name)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">{t("price")}</h3>
              <div className="space-y-4">
                <Slider 
                  defaultValue={[0, 1000]} 
                  max={1000} 
                  step={10}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                />
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            {/* Availability */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">{t("availability")}</h3>
              <div className="flex items-center">
                <Checkbox 
                  id="in-stock" 
                  checked={inStock}
                  onCheckedChange={(checked) => setInStock(checked as boolean)}
                />
                <Label htmlFor="in-stock" className="ml-2">
                  {t("inStock")}
                </Label>
              </div>
            </div>
            
            {/* Apply / Clear Filters */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setPriceRange([0, 1000]);
                setSelectedCategory("");
                setInStock(true);
                setSearchQuery("");
              }}>
                {t("clear")}
              </Button>
              <Button>
                {t("apply")}
              </Button>
            </div>
          </div>
          
          {/* Products Section */}
          <div className="w-full md:w-3/4">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <div className="hidden md:block">
                <p>{t("showing")} 24 {t("of")} 100 {t("results")}</p>
              </div>
              <div className="w-full md:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[180px] bg-mediumBlue border-gray-700">
                    <SelectValue placeholder={t("sortBy")} />
                  </SelectTrigger>
                  <SelectContent className="bg-mediumBlue border-gray-700">
                    <SelectGroup>
                      <SelectItem value="popularity">{t("popularity")}</SelectItem>
                      <SelectItem value="newest">{t("newest")}</SelectItem>
                      <SelectItem value="priceAsc">{t("priceLowToHigh")}</SelectItem>
                      <SelectItem value="priceDesc">{t("priceHighToLow")}</SelectItem>
                      <SelectItem value="rating">{t("rating")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Products Grid */}
            <ProductGrid categoryId={selectedCategory} />
            
            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
              <Button variant="outline" disabled>
                {t("previous")}
              </Button>
              <Button variant="outline" className="bg-secondary">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">{t("next")}</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
