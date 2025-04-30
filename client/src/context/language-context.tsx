import { createContext, useState, useEffect, ReactNode } from "react";
import { getTranslation, LanguageKey } from "@/lib/utils/lang";

interface LanguageContextProps {
  language: LanguageKey;
  changeLanguage: (lang: LanguageKey) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  changeLanguage: () => {},
  t: (key: string) => key,
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<LanguageKey>(() => {
    // Initialize from localStorage if available
    const savedLang = localStorage.getItem("language") as LanguageKey;
    return savedLang === "ar" ? "ar" : "en";
  });

  useEffect(() => {
    // Update localStorage when language changes
    localStorage.setItem("language", language);
    
    // Update HTML dir and lang attributes
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang: LanguageKey) => {
    setLanguage(lang);
  };

  const t = (key: string) => {
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
