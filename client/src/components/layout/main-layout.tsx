import { useContext } from "react";
import { Link } from "wouter";
import { ShoppingCart, ChevronDown, Search, User, LogOut, Moon, Sun } from "lucide-react";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { CartContext } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppButton } from "@/components/global/whatsapp-button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { language, t } = useContext(LanguageContext);
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t("success"),
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { name: "electronics", href: "/category/electronics" },
    { name: "fashion", href: "/category/fashion" },
    { name: "homeAndGarden", href: "/category/home-garden" },
    { name: "beauty", href: "/category/beauty" },
    { name: "sports", href: "/category/sports" },
    { name: "toys", href: "/category/toys" },
    { name: "bestSellers", href: "/best-sellers" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-br from-darkBlue to-mediumBlue ${language === "ar" ? "rtl" : "ltr"}`}>
      {/* Header */}
      <header className="bg-darkBlue sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center flex-wrap">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              EchoShop
            </Link>
            
            {/* Search Bar */}
            <div className="order-3 md:order-2 w-full md:w-1/3 mt-4 md:mt-0">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  className="w-full bg-mediumBlue border border-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Nav Links */}
            <nav className="order-2 md:order-3 flex items-center space-x-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 mr-2">
                    <span className="text-yellow-300 text-sm hidden sm:inline-block">
                      {t("hello")}, {user.displayName}!
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href="/user/dashboard"
                      className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      {t("dashboard")}
                    </Link>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full flex items-center gap-1 bg-transparent border-gray-600 hover:bg-gray-800 text-light"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <Button
                      asChild
                      className="bg-primary text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-400 transition-colors duration-300 flex items-center gap-1"
                    >
                      <Link href="/auth">
                        <User className="h-4 w-4" />
                        {t("login")}
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <Button
                      asChild
                      className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
                    >
                      <Link href="/auth?tab=register">
                        {t("signup")}
                      </Link>
                    </Button>
                  </div>
                </>
              )}
              <div className="relative ml-2">
                <Button
                  asChild
                  className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center gap-1"
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-4 w-4" />
                    {t("cart")}
                  </Link>
                </Button>
                {cartItems.length > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                    {cartItems.length}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Secondary Nav */}
      <div className="bg-mediumBlue shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex overflow-x-auto whitespace-nowrap gap-4">
          <Button variant="link" asChild className="text-white hover:text-primary transition-colors duration-200 p-0 h-auto">
            <Link href="/">
              {t("home")}
            </Link>
          </Button>
          <Button variant="link" asChild className="text-white hover:text-primary transition-colors duration-200 p-0 h-auto">
            <Link href="/products">
              {t("allProductsNav")}
            </Link>
          </Button>
          {categories.map((category) => (
            <Button 
              key={category.name}
              variant="link" 
              asChild 
              className="text-white hover:text-primary transition-colors duration-200 p-0 h-auto"
            >
              <Link href={category.href}>
                {t(category.name)}
              </Link>
            </Button>
          ))}
          
          {user && (
            <Button
              variant="link"
              asChild
              className="text-white hover:text-primary transition-colors duration-200 p-0 h-auto ml-4"
            >
              <Link href="/seller/register">
                {language === "ar" ? "سجل كبائع" : "Become a Seller"}
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-darkBlue mt-10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">EchoShop</h3>
              <p className="text-gray-400 mb-4">{t("footerDesc")}</p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">{t("shop")}</h3>
              <ul className="space-y-2">
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/products">{t("allProducts")}</Link></Button></li>
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/featured">{t("featuredItems")}</Link></Button></li>
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/new-arrivals">{t("newArrivals")}</Link></Button></li>
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/discounts">{t("salesAndDiscounts")}</Link></Button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">{t("customerService")}</h3>
              <ul className="space-y-2">
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/contact">{t("contactUs")}</Link></Button></li>
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/faqs">{t("faqs")}</Link></Button></li>
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/shipping-policy">{t("shippingPolicy")}</Link></Button></li>
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/returns">{t("returnsRefunds")}</Link></Button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">{t("about")}</h3>
              <ul className="space-y-2">
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/about">{t("ourStory")}</Link></Button></li>
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/careers">{t("careers")}</Link></Button></li>
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/privacy">{t("privacyPolicy")}</Link></Button></li>
                <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/terms">{t("terms")}</Link></Button></li>
                {user && (
                  <li><Button variant="link" asChild className="text-gray-400 hover:text-white p-0 h-auto"><Link href="/seller/register">{language === "ar" ? "سجل كبائع" : "Become a Seller"}</Link></Button></li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">&copy; {currentYear} EchoShop. {t("copyright")}</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-8" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-8" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="American Express" className="h-8" />
            </div>
          </div>
        </div>
      </footer>
      
      {/* Floating WhatsApp button */}
      <WhatsAppButton 
        phoneNumber="201012345678" 
        message={language === "ar" ? "أهلا بك في إيكو شوب! كيف يمكنني مساعدتك؟" : "Hello from EchoShop! How can I help you?"}
        fixed
      />
    </div>
  );
}
