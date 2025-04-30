import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Filter, Search, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for products
const PRODUCTS = [
  { 
    id: 1, 
    name: "Wireless Headphones", 
    price: 89.99, 
    rating: 4.5, 
    reviews: 128, 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    category: "Electronics"
  },
  { 
    id: 2, 
    name: "Smart Watch", 
    price: 199.99, 
    rating: 4.2, 
    reviews: 85, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80",
    category: "Electronics"
  },
  { 
    id: 3, 
    name: "Running Shoes", 
    price: 79.99, 
    rating: 4.7, 
    reviews: 215, 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    category: "Fashion"
  },
  { 
    id: 4, 
    name: "Smartphone", 
    price: 699.99, 
    rating: 4.4, 
    reviews: 312, 
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
    category: "Electronics"
  },
  { 
    id: 5, 
    name: "Bluetooth Speaker", 
    price: 59.99, 
    rating: 4.1, 
    reviews: 178, 
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80",
    category: "Electronics"
  },
  { 
    id: 6, 
    name: "Laptop", 
    price: 999.99, 
    rating: 4.6, 
    reviews: 95, 
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
    category: "Electronics"
  },
  { 
    id: 7, 
    name: "Coffee Maker", 
    price: 49.99, 
    rating: 4.3, 
    reviews: 68, 
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    category: "Home"
  },
  { 
    id: 8, 
    name: "Backpack", 
    price: 39.99, 
    rating: 4.0, 
    reviews: 42, 
    image: "https://images.unsplash.com/photo-1576512775334-32a25570d15e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    category: "Fashion"
  }
];

// Categories
const CATEGORIES = [
  { id: 1, name: "All Categories" },
  { id: 2, name: "Electronics" },
  { id: 3, name: "Fashion" },
  { id: 4, name: "Home & Garden" },
  { id: 5, name: "Beauty & Health" },
  { id: 6, name: "Sports" },
  { id: 7, name: "Toys" }
];

export default function ProductsPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("featured");

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "All Categories"
    ? PRODUCTS
    : PRODUCTS.filter(product => product.category === selectedCategory);

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low-high") return a.price - b.price;
    if (sortBy === "price-high-low") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // Default: featured
  });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header - We'll use a simplified version for this page */}
      <header className="bg-[#131921] shadow-md py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white no-underline">
            EchoShop
          </Link>
          
          <div className="relative w-full max-w-lg mx-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-white text-gray-800 pl-4 pr-10 py-2 rounded-md focus:outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/cart" className="text-white hover:text-yellow-400 flex items-center">
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm mb-6">
          <Link href="/" className="text-[#007185] hover:text-[#c7511f] hover:underline">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-500">Products</span>
        </div>
        
        {/* Products Grid with Sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white border border-gray-200 rounded p-4 mb-4">
              <h3 className="font-bold text-lg mb-3">Department</h3>
              <ul className="space-y-2">
                {CATEGORIES.map(category => (
                  <li key={category.id}>
                    <button 
                      className={`text-sm hover:text-[#c7511f] ${selectedCategory === category.name ? 'text-[#c7511f] font-medium' : 'text-[#007185]'}`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded p-4 mb-4">
              <h3 className="font-bold text-lg mb-3">Price</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="text-[#007185] hover:text-[#c7511f] hover:underline">Under $25</button></li>
                <li><button className="text-[#007185] hover:text-[#c7511f] hover:underline">$25 to $50</button></li>
                <li><button className="text-[#007185] hover:text-[#c7511f] hover:underline">$50 to $100</button></li>
                <li><button className="text-[#007185] hover:text-[#c7511f] hover:underline">$100 to $200</button></li>
                <li><button className="text-[#007185] hover:text-[#c7511f] hover:underline">Over $200</button></li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded p-4">
              <h3 className="font-bold text-lg mb-3">Avg. Customer Review</h3>
              <ul className="space-y-3">
                {[4, 3, 2, 1].map(rating => (
                  <li key={rating} className="flex items-center">
                    <button className="flex items-center text-[#007185] hover:text-[#c7511f]">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg 
                            key={star} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm">& Up</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting and results count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>{sortedProducts.length}</strong> results for <strong>"{selectedCategory}"</strong>
              </p>
              
              <div className="flex items-center mt-2 sm:mt-0">
                <span className="text-sm mr-2">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-9 text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Avg. Customer Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedProducts.map(product => (
                <div key={product.id} className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative pt-[100%]">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/product/${product.id}`} className="hover:text-[#c7511f]">
                      <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
                    </Link>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg 
                            key={star} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-3 w-3 ${star <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-blue-600 ml-1">{product.reviews}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Button size="sm" className="flex-1 bg-[#febd69] hover:bg-[#f3a847] text-black text-xs font-medium py-1 rounded">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline" className="px-2 flex-shrink-0">
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#232f3e] text-white mt-12">
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
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-3">Make Money with Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/sell" className="hover:text-white hover:underline">Sell products on EchoShop</Link></li>
                <li><Link href="/associates" className="hover:text-white hover:underline">Become an Affiliate</Link></li>
                <li><Link href="/advertise" className="hover:text-white hover:underline">Advertise Your Products</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-3">Payment Products</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/payment/card" className="hover:text-white hover:underline">EchoShop Card</Link></li>
                <li><Link href="/payment/shop" className="hover:text-white hover:underline">Shop with Points</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-3">Let Us Help You</h3>
              <ul className="space-y-2 text-sm text-gray-300">
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
            </div>
            <div className="mt-4 text-xs text-gray-400">
              &copy; {new Date().getFullYear()} EchoShop. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}