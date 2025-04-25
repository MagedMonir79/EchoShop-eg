import { useContext, useState, useEffect } from "react";
import { Link } from "wouter";
import { LanguageContext } from "@/context/language-context";
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Sparkles, 
  PlayCircle, 
  MoreHorizontal 
} from "lucide-react";
import { getCategories } from "@/lib/firebase";
import { Category } from "@shared/schema";

export default function CategoriesShowcase() {
  const { t } = useContext(LanguageContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Predefined category icons
  const categoryIcons = [
    { name: "electronics", icon: <Smartphone className="h-8 w-8 text-primary" /> },
    { name: "fashion", icon: <Shirt className="h-8 w-8 text-primary" /> },
    { name: "home", icon: <Home className="h-8 w-8 text-primary" /> },
    { name: "beauty", icon: <Sparkles className="h-8 w-8 text-primary" /> },
    { name: "toys", icon: <PlayCircle className="h-8 w-8 text-primary" /> },
    { name: "more", icon: <MoreHorizontal className="h-8 w-8 text-primary" /> },
  ];

  // Mock categories for development
  const mockCategories = [
    { id: 1, name: "electronics", nameAr: "الإلكترونيات" },
    { id: 2, name: "fashion", nameAr: "الأزياء" },
    { id: 3, name: "home", nameAr: "المنزل" },
    { id: 4, name: "beauty", nameAr: "الجمال" },
    { id: 5, name: "toys", nameAr: "الألعاب" },
    { id: 6, name: "more", nameAr: "المزيد" },
  ];

  const displayCategories = categories.length > 0 ? categories : mockCategories;

  return (
    <section className="py-10 bg-mediumBlue">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{t("shopByCategory")}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col items-center bg-darkBlue rounded-lg p-4 animate-pulse">
                <div className="w-16 h-16 bg-blue-900 rounded-full mb-2"></div>
                <div className="h-4 bg-blue-900 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            // Actual categories
            displayCategories.map((category, index) => (
              <Link 
                key={category.id} 
                href={`/category/${category.name}`}
              >
                <a className="flex flex-col items-center bg-darkBlue rounded-lg p-4 hover:bg-blue-900 transition-colors duration-300">
                  <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mb-2">
                    {categoryIcons[index]?.icon || categoryIcons[0].icon}
                  </div>
                  <span>{t(category.name)}</span>
                </a>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
