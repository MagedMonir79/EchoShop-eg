import { useContext } from "react";
import { Link } from "wouter";
import { ShoppingCart, Info } from "lucide-react";
import { LanguageContext } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  const { t } = useContext(LanguageContext);

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("heroTitle")}</h1>
          <p className="text-gray-300 text-lg mb-6">{t("heroDescription")}</p>
          <div className="flex gap-4 flex-wrap">
            <Button 
              className="bg-primary text-black px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-lime-500"
              asChild
            >
              <Link href="/products">
                <a className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  {t("shopNow")}
                </a>
              </Link>
            </Button>
            <Button 
              variant="outline"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-darkBlue transition-colors duration-300"
              asChild
            >
              <Link href="/about">
                <a className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {t("learnMore")}
                </a>
              </Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Shopping Items" 
            className="rounded-lg shadow-2xl w-full h-auto max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
