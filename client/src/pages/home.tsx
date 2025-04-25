import { useContext } from "react";
import { Link } from "wouter";
import { LanguageContext } from "@/context/language-context";
import MainLayout from "@/components/layout/main-layout";
import HeroBanner from "@/components/ui/hero-banner";
import FeaturesSection from "@/components/ui/features-section";
import FlashDeals from "@/components/ui/flash-deals";
import CategoriesShowcase from "@/components/ui/categories-showcase";
import BestSellers from "@/components/ui/best-sellers";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Home() {
  const { t } = useContext(LanguageContext);

  return (
    <MainLayout>
      <HeroBanner />
      <FeaturesSection />
      <FlashDeals />
      <CategoriesShowcase />
      <BestSellers />
      
      {/* Become a Seller Section */}
      <section className="py-10 bg-mediumBlue">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">{t("becomeSeller")}</h2>
            <p className="text-gray-300 mb-6">{t("becomeSellerDesc")}</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t("easyRegistration")}</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t("comprehensiveDashboard")}</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t("multipleDropshipping")}</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t("automatedOrder")}</span>
              </li>
            </ul>
            <Button 
              className="bg-primary text-black px-6 py-3 rounded-full font-bold hover:bg-lime-500 transition-colors duration-300"
              asChild
            >
              <Link href="/seller/register">
                <a className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  {t("registerAsSeller")}
                </a>
              </Link>
            </Button>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Seller Dashboard" 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
