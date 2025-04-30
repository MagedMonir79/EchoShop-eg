import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  Menu, 
  MapPin, 
  ChevronDown, 
  User, 
  Package, 
  Clock 
} from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header - Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#131921] shadow-md">
        {/* Top bar with location selector */}
        <div className="bg-[#232f3e] text-white py-1 text-xs hidden md:block">
          <div className="container mx-auto px-4 flex justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.location.href = "/location"} 
                className="flex items-center text-white hover:text-yellow-400 bg-transparent border-0 p-0 cursor-pointer"
              >
                <MapPin className="h-3 w-3 mr-1" />
                <span>Deliver to Egypt</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sell" className="text-white hover:text-yellow-400">Sell on EchoShop</Link>
              <Link href="/track-order" className="text-white hover:text-yellow-400">Track Order</Link>
              <Link href="/help" className="text-white hover:text-yellow-400">Help</Link>
            </div>
          </div>
        </div>
        
        {/* Main Navigation Bar */}
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white no-underline mr-1 md:mr-4">
            EchoShop
          </Link>
          
          {/* Location (mobile) */}
          <div className="flex items-center md:hidden mr-2">
            <Link href="/location" className="flex items-center text-white text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              <span>Egypt</span>
            </Link>
          </div>
          
          {/* Search box */}
          <div className="flex-1 max-w-4xl">
            <div className="relative flex">
              {/* Category dropdown */}
              <div className="hidden md:block">
                <select 
                  className="h-full rounded-l-md border-0 bg-gray-100 py-2 pl-3 pr-7 text-gray-800 text-sm focus:outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>All</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Beauty</option>
                  <option>Sports</option>
                  <option>Toys</option>
                </select>
              </div>
              
              {/* Search input */}
              <input 
                type="text" 
                placeholder="Search products..." 
                className="flex-1 bg-white text-gray-800 pl-4 py-2 text-sm border-0 focus:outline-none focus:ring-0 rounded-l-md md:rounded-none"
              />
              
              {/* Search button */}
              <button className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 px-3 py-2 rounded-r-md flex items-center justify-center">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* User navigation */}
          <div className="flex items-center gap-3 ml-4">
            <div className="hidden md:block">
              <button 
                onClick={() => window.location.href = "/supabase-auth"} 
                className="bg-transparent border-0 p-0 cursor-pointer text-white hover:text-yellow-400 text-xs"
              >
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-300">مرحبا، سجل الدخول</span>
                  <span className="font-bold flex items-center">
                    حسابي وقوائمي
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => window.location.href = "/orders"} 
              className="hidden md:block bg-transparent border-0 p-0 cursor-pointer text-white hover:text-yellow-400 text-xs"
            >
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-300">Returns</span>
                <span className="font-bold">& Orders</span>
              </div>
            </button>
            
            <button 
              onClick={() => window.location.href = "/cart"} 
              className="bg-transparent border-0 p-0 cursor-pointer text-white hover:text-yellow-400 flex items-center"
            >
              <div className="relative">
                <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />
                <span className="absolute -top-2 -right-2 bg-[#febd69] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
              </div>
              <span className="hidden md:inline ml-1 font-bold">Cart</span>
            </button>
            
            <button className="md:hidden text-white">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Category Navigation */}
        <div className="bg-[#232f3e] border-t border-gray-700">
          <div className="container mx-auto px-4">
            <div className="hidden md:flex items-center space-x-6 text-white py-1 overflow-x-auto">
              <button className="text-sm whitespace-nowrap hover:text-yellow-400 flex items-center">
                <Menu className="h-4 w-4 mr-1" />
                <span>All</span>
              </button>
              <Link href="/todays-deals" className="text-sm whitespace-nowrap hover:text-yellow-400">Today's Deals</Link>
              <Link href="/customer-service" className="text-sm whitespace-nowrap hover:text-yellow-400">Customer Service</Link>
              <Link href="/registry" className="text-sm whitespace-nowrap hover:text-yellow-400">Registry</Link>
              <Link href="/gift-cards" className="text-sm whitespace-nowrap hover:text-yellow-400">Gift Cards</Link>
              <Link href="/sell" className="text-sm whitespace-nowrap hover:text-yellow-400">Sell</Link>
              <Link href="/category/electronics" className="text-sm whitespace-nowrap hover:text-yellow-400">Electronics</Link>
              <Link href="/category/fashion" className="text-sm whitespace-nowrap hover:text-yellow-400">Fashion</Link>
              <Link href="/category/home-garden" className="text-sm whitespace-nowrap hover:text-yellow-400">Home & Garden</Link>
              <Link href="/category/beauty" className="text-sm whitespace-nowrap hover:text-yellow-400">Beauty</Link>
              <Link href="/diagnostic" className="text-sm whitespace-nowrap hover:text-yellow-400 bg-blue-600/90 px-2 py-0.5 rounded-sm text-white font-medium">Diagnostics</Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section - Banner Carousel */}
      <section className="bg-gradient-to-b from-[#232f3e] to-gray-100 pt-2 pb-4 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" 
              alt="Shop the latest collections"
              className="w-full h-72 md:h-96 object-cover rounded shadow-md"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#232f3e]/80 to-transparent flex flex-col justify-center px-8 md:px-16">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Shop the latest collections</h1>
              <p className="text-white text-lg md:text-xl mb-6 max-w-md">Discover great deals and top quality products for all your needs.</p>
              <div>
                <Button 
                  className="bg-[#febd69] hover:bg-[#f3a847] text-black font-medium px-6 py-3 rounded-md shadow-sm"
                  onClick={() => window.location.href = "/products"}
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
          
          {/* Carousel controls (simplified) */}
          <div className="flex justify-center mt-4">
            <button className="w-2 h-2 rounded-full bg-white mx-1"></button>
            <button className="w-2 h-2 rounded-full bg-gray-400 mx-1"></button>
            <button className="w-2 h-2 rounded-full bg-gray-400 mx-1"></button>
          </div>
        </div>
      </section>

      {/* Card layout section - similar to Amazon's card grid layout */}
      <section className="py-4 md:py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Shop by Category Card */}
            <div className="bg-white p-4 rounded shadow-sm">
              <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/category/electronics" className="block">
                  <img 
                    src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Electronics" 
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-xs mt-1 text-center">Electronics</p>
                </Link>
                <Link href="/category/fashion" className="block">
                  <img 
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                    alt="Fashion" 
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-xs mt-1 text-center">Fashion</p>
                </Link>
                <Link href="/category/home" className="block">
                  <img 
                    src="https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80" 
                    alt="Home" 
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-xs mt-1 text-center">Home</p>
                </Link>
                <Link href="/category/beauty" className="block">
                  <img 
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80" 
                    alt="Beauty" 
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-xs mt-1 text-center">Beauty</p>
                </Link>
              </div>
              <Link href="/categories" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm block mt-4">
                See all categories
              </Link>
            </div>
            
            {/* Sign in Card */}
            <div className="bg-white p-4 rounded shadow-sm">
              <h2 className="text-xl font-bold mb-2 text-right">مرحباً بك في EchoShop</h2>
              <Button 
                className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-medium py-2 rounded-md shadow-sm"
                onClick={() => window.location.href = "/supabase-auth"}
              >
                تسجيل الدخول
              </Button>
              <Link href="/supabase-auth?tab=register" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm block mt-4 text-right">
                عميل جديد؟ أنشئ حسابك الآن
              </Link>
              <Link href="/seller/register" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm block mt-2 text-right">
                تريد بيع منتجاتك؟ سجل كتاجر الآن
              </Link>
              <div className="mt-3 p-2 border-t border-gray-200 flex justify-between">
                <Button 
                  variant="ghost"
                  className="text-xs text-gray-500 hover:text-gray-700 p-0"
                  onClick={() => window.history.back()}
                >
                  رجوع
                </Button>
              </div>
            </div>
            
            {/* Deal of the Day */}
            <div className="bg-white p-4 rounded shadow-sm">
              <h2 className="text-xl font-bold mb-4">Deal of the day</h2>
              <Link href="/deal-of-the-day">
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Deal of the Day" 
                  className="w-full h-40 object-contain rounded"
                />
              </Link>
              <div className="mt-4">
                <div className="text-red-600 font-bold">Up to 40% off</div>
                <Link href="/deal-of-the-day" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm">
                  Premium wireless headphones
                </Link>
              </div>
              <Link href="/deals" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm block mt-4">
                See all deals
              </Link>
            </div>
            
            {/* Quick Links */}
            <div className="bg-white p-4 rounded shadow-sm">
              <h2 className="text-xl font-bold mb-4">Explore EchoShop</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/essentials" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-600" />
                    Essential products
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-600" />
                    New arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/best-sellers" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-600" />
                    Top rated products
                  </Link>
                </li>
                <li>
                  <Link href="/daily-deals" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-gray-600" />
                    Special offers
                  </Link>
                </li>
              </ul>
              <hr className="my-3 border-gray-200" />
              <Link href="/account-home" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm block">
                Your Account
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seller Section - Added for Merchants */}
      <section className="py-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">ابدأ عملك مع EchoShop</h2>
              <p className="text-gray-600 mb-6 max-w-lg text-lg">
                انضم إلى آلاف التجار الناجحين واستفد من منصتنا المتكاملة. نوفر لك الدعم الكامل من البداية إلى النمو والتوسع.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium"
                  onClick={() => window.location.href = "/seller/register"}
                >
                  سجل كتاجر
                </Button>
                <Button 
                  className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-medium"
                  onClick={() => window.location.href = "/seller-learn-more"}
                >
                  تعرف على المزيد
                </Button>
                <Button 
                  className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-3 rounded-md font-medium"
                  onClick={() => window.location.href = "/admin/demo-login"}
                >
                  لوحة تحكم المدير (تجريبي)
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Sell on EchoShop" 
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-primary text-4xl font-bold mb-2">+10K</div>
              <h3 className="text-lg font-medium mb-3">تاجر نشط</h3>
              <p className="text-gray-600 text-sm">انضم إلى مجتمع التجار المزدهر في EchoShop</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-primary text-4xl font-bold mb-2">15%</div>
              <h3 className="text-lg font-medium mb-3">عمولة تنافسية</h3>
              <p className="text-gray-600 text-sm">عمولات منخفضة تساعدك على زيادة هامش ربحك</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-primary text-4xl font-bold mb-2">24/7</div>
              <h3 className="text-lg font-medium mb-3">دعم متواصل</h3>
              <p className="text-gray-600 text-sm">فريق دعم متخصص لمساعدتك على النمو والنجاح</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">شحن مجاني</h3>
                  <p className="text-gray-600 text-sm">على الطلبات بأكثر من 3000 ج.م</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Payments</h3>
                  <p className="text-gray-600 text-sm">100% secure payment</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">24/7 Support</h3>
                  <p className="text-gray-600 text-sm">Dedicated support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Top Sellers */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Top Sellers</h2>
            <Link href="/top-sellers" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm">
              See more
            </Link>
          </div>
          
          <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
            {[
              { name: "Wireless Headphones", price: 89.99, stars: 4.5, reviews: 2453, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
              { name: "Smart Watch", price: 199.99, stars: 4.2, reviews: 1876, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80" },
              { name: "Running Shoes", price: 79.99, stars: 4.7, reviews: 3210, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
              { name: "Smartphone", price: 699.99, stars: 4.4, reviews: 952, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80" },
              { name: "Bluetooth Speaker", price: 59.99, stars: 4.1, reviews: 783, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80" },
              { name: "Laptop", price: 999.99, stars: 4.6, reviews: 1455, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" }
            ].map((product, index) => (
              <div key={index} className="min-w-[200px] max-w-[200px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex-shrink-0">
                <div className="relative">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100">
                    <Heart className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${star <= Math.floor(product.stars) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-blue-600 ml-1">{product.reviews}</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold text-lg">${product.price}</span>
                  </div>
                  <div className="mt-2">
                    <Button size="sm" className="w-full bg-[#febd69] hover:bg-[#f3a847] text-slate-900 text-xs font-medium py-1 rounded">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Recommendations */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recommended for you</h2>
            <Link href="/recommendations" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm">
              See more
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Wireless Headphones", price: 89.99, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
              { name: "Smart Watch", price: 199.99, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80" },
              { name: "Running Shoes", price: 79.99, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
              { name: "Smartphone", price: 699.99, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80" },
              { name: "Bluetooth Speaker", price: 59.99, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80" },
              { name: "Laptop", price: 999.99, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" }
            ].map((product, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-36 object-cover"
                />
                <div className="p-2">
                  <h3 className="text-xs line-clamp-2 h-8">{product.name}</h3>
                  <div className="mt-1">
                    <span className="text-sm font-bold">${product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sign In Banner */}
      <section className="py-6 bg-gray-200 border-t border-b border-gray-300">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto border-t border-b border-gray-300 py-4">
            <h3 className="font-bold mb-2">Sign in for the best experience</h3>
            <Button 
              className="bg-[#febd69] hover:bg-[#f3a847] text-black px-16 py-1 text-sm font-medium rounded-sm w-auto mb-2"
            >
              Sign in securely
            </Button>
            <div>
              <Link href="/auth?tab=register" className="text-[#007185] hover:text-[#c7511f] hover:underline text-xs">
                New to EchoShop? Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#232f3e] text-white">
        {/* Back to top button */}
        <div className="bg-[#37475a] hover:bg-[#485769] text-white py-3 text-center cursor-pointer">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-sm">
            Back to top
          </button>
        </div>
        
        {/* Footer Links */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-base font-bold mb-3">Get to Know Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/about" className="hover:text-white hover:underline">About EchoShop</Link></li>
                <li><Link href="/careers" className="hover:text-white hover:underline">Careers</Link></li>
                <li><Link href="/investor-relations" className="hover:text-white hover:underline">Investor Relations</Link></li>
                <li><Link href="/sustainability" className="hover:text-white hover:underline">Sustainability</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-3">Make Money with Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/sell" className="hover:text-white hover:underline">Sell products on EchoShop</Link></li>
                <li><Link href="/associates" className="hover:text-white hover:underline">Become an Affiliate</Link></li>
                <li><Link href="/logistics" className="hover:text-white hover:underline">Fulfillment by EchoShop</Link></li>
                <li><Link href="/advertise" className="hover:text-white hover:underline">Advertise Your Products</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-3">Payment Products</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/payment/card" className="hover:text-white hover:underline">EchoShop Card</Link></li>
                <li><Link href="/payment/shop" className="hover:text-white hover:underline">Shop with Points</Link></li>
                <li><Link href="/payment/reload" className="hover:text-white hover:underline">Reload Your Balance</Link></li>
                <li><Link href="/payment/currency" className="hover:text-white hover:underline">Currency Converter</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-3">Let Us Help You</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/help/covid" className="hover:text-white hover:underline">EchoShop and COVID-19</Link></li>
                <li><Link href="/account" className="hover:text-white hover:underline">Your Account</Link></li>
                <li><Link href="/orders" className="hover:text-white hover:underline">Your Orders</Link></li>
                <li><Link href="/help/shipping" className="hover:text-white hover:underline">Shipping Rates & Policies</Link></li>
                <li><Link href="/help/returns" className="hover:text-white hover:underline">Returns & Replacements</Link></li>
                <li><Link href="/help" className="hover:text-white hover:underline">Help</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Subfooter */}
        <div className="border-t border-gray-700 py-6 bg-[#131a22]">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center">
              <Link href="/" className="text-2xl font-bold text-white no-underline mb-4">
                EchoShop
              </Link>
            </div>
            <div className="text-xs text-gray-400 space-x-4">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Use</Link>
              <Link href="/cookie-preferences" className="hover:text-white">Cookie Preferences</Link>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              &copy; {new Date().getFullYear()} EchoShop. All rights reserved.
            </div>
            <div className="mt-3 text-[10px] text-gray-600 hover:text-gray-400">
              <Link href="/admin/login">مدير النظام</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}