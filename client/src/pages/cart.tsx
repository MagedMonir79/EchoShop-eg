import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight,
  CreditCard,
  Truck
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock cart data
const INITIAL_CART = [
  { 
    id: 1, 
    productId: "1",
    name: "Wireless Headphones", 
    price: 89.99, 
    quantity: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    inStock: true
  },
  { 
    id: 2, 
    productId: "4",
    name: "Smartphone", 
    price: 699.99, 
    quantity: 1,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
    inStock: true
  }
];

export default function CartPage() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shippingCost + tax;
  
  // Handle quantity updates
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // Handle item removal
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
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
            <Link href="/cart" className="text-white hover:text-yellow-400 flex items-center relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-[#febd69] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="mb-4">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button 
              className="bg-[#febd69] hover:bg-[#f3a847] text-black font-medium"
              asChild
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="border-b border-gray-200 p-4 hidden md:flex bg-gray-50">
                  <div className="w-2/5 font-medium">Product</div>
                  <div className="w-1/5 text-center font-medium">Price</div>
                  <div className="w-1/5 text-center font-medium">Quantity</div>
                  <div className="w-1/5 text-right font-medium">Total</div>
                </div>
                
                {/* Cart Items */}
                {cartItems.map(item => (
                  <div key={item.id} className="border-b border-gray-200 p-4 flex flex-wrap md:flex-nowrap items-center">
                    {/* Product */}
                    <div className="w-full md:w-2/5 flex items-center mb-4 md:mb-0">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="ml-4">
                        <Link href={`/product/${item.productId}`} className="font-medium hover:text-[#c7511f] hover:underline block">
                          {item.name}
                        </Link>
                        <span className={`text-sm ${item.inStock ? 'text-emerald-600' : 'text-red-600'}`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline flex items-center mt-1"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="w-1/3 md:w-1/5 text-center">
                      <div className="md:hidden text-sm text-gray-500 mb-1">Price:</div>
                      <div>${item.price.toFixed(2)}</div>
                    </div>
                    
                    {/* Quantity */}
                    <div className="w-1/3 md:w-1/5 flex justify-center">
                      <div className="md:hidden text-sm text-gray-500 mb-1">Quantity:</div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 border border-gray-300 rounded-md"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 border border-gray-300 rounded-md"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="w-1/3 md:w-1/5 text-right font-medium">
                      <div className="md:hidden text-sm text-gray-500 mb-1">Total:</div>
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                
                {/* Cart Actions */}
                <div className="p-4 flex items-center justify-between bg-gray-50">
                  <button 
                    onClick={clearCart}
                    className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
                  >
                    Clear Cart
                  </button>
                  <Button 
                    className="bg-[#febd69] hover:bg-[#f3a847] text-black"
                    asChild
                  >
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping & Handling:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                    <span>Order Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-medium mb-3"
                >
                  Proceed to Checkout
                </Button>
                
                {/* Benefits */}
                <div className="text-sm text-gray-600 space-y-3 mt-6">
                  <div className="flex items-start">
                    <CreditCard className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Secure payment processing with end-to-end encryption</span>
                  </div>
                  <div className="flex items-start">
                    <Truck className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Fast shipping with delivery tracking</span>
                  </div>
                </div>
              </div>
              
              {/* Recommended Add-ons */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                <h3 className="font-bold mb-3">You might also like</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80" 
                        alt="Bluetooth Speaker" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium">Bluetooth Speaker</div>
                      <div className="text-sm font-bold">$59.99</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="h-8 px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80" 
                        alt="Smart Watch" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium">Smart Watch</div>
                      <div className="text-sm font-bold">$199.99</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="h-8 px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#232f3e] text-white mt-16">
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