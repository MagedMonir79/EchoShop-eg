import { useContext } from "react";
import { Globe } from "lucide-react";
import { LanguageContext } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const { language, changeLanguage, t } = useContext(LanguageContext);

  const handleLanguageToggle = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    changeLanguage(newLanguage);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-success text-black rounded-full hover:bg-lime-500 transition-colors duration-300 flex items-center gap-1" 
      onClick={handleLanguageToggle}
    >
      <Globe className="h-4 w-4" />
      {language === "en" ? t("switchToArabic") : t("switchToEnglish")}
    </Button>
  );
}
