import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  Share2,
  Star,
  Check,
  ChevronRight
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for products - in a real app this would come from an API
const PRODUCTS = [
  { 
    id: "1", 
    name: "Wireless Headphones", 
    price: 89.99, 
    rating: 4.5, 
    reviews: 128, 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    category: "Electronics",
    description: "Experience crystal-clear sound with these premium wireless headphones. Features include active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    features: [
      "Bluetooth 5.0 connectivity",
      "Active noise cancellation",
      "30-hour battery life",
      "Quick charge (10 min charge = 3 hours playback)",
      "Built-in microphone for calls",
      "Voice assistant compatible"
    ],
    stock: 15,
    seller: "AudioTech Inc.",
    colors: ["Black", "White", "Blue"],
    relatedProducts: [2, 5, 6]
  },
  { 
    id: "2", 
    name: "Smart Watch", 
    price: 199.99, 
    rating: 4.2, 
    reviews: 85, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80",
    category: "Electronics",
    description: "Track your fitness goals and stay connected with this advanced smartwatch. Features heart rate monitoring, GPS, and water resistance up to 50 meters.",
    features: [
      "Heart rate monitoring",
      "GPS tracking",
      "Water resistant (50m)",
      "Sleep tracking",
      "Notification alerts",
      "5-day battery life"
    ],
    stock: 8,
    seller: "TechGear",
    colors: ["Black", "Silver", "Rose Gold"],
    relatedProducts: [1, 4, 6]
  },
  { 
    id: "3", 
    name: "Running Shoes", 
    price: 79.99, 
    rating: 4.7, 
    reviews: 215, 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    category: "Fashion",
    description: "Lightweight and comfortable running shoes designed for maximum performance. Features responsive cushioning and breathable mesh upper.",
    features: [
      "Breathable mesh upper",
      "Responsive cushioning",
      "Durable rubber outsole",
      "Reflective elements for visibility",
      "Available in multiple colors",
      "True to size fit"
    ],
    stock: 23,
    seller: "SportStyle",
    colors: ["Red", "Black", "Gray", "Blue"],
    relatedProducts: [8]
  },
  { 
    id: "4", 
    name: "Smartphone", 
    price: 699.99, 
    rating: 4.4, 
    reviews: 312, 
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
    category: "Electronics",
    description: "The latest smartphone with cutting-edge camera technology, fast processor, and all-day battery life. Features a stunning 6.5-inch OLED display.",
    features: [
      "6.5-inch OLED display",
      "Triple camera system (12MP + 12MP + 12MP)",
      "A15 Bionic chip",
      "128GB/256GB/512GB storage options",
      "All-day battery life",
      "Face ID"
    ],
    stock: 12,
    seller: "MobileTech",
    colors: ["Graphite", "Gold", "Silver", "Blue"],
    relatedProducts: [1, 2, 6]
  },
  { 
    id: "5", 
    name: "Bluetooth Speaker", 
    price: 59.99, 
    rating: 4.1, 
    reviews: 178, 
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80",
    category: "Electronics",
    description: "Portable Bluetooth speaker with rich, clear sound and waterproof design. Perfect for outdoor activities and home use.",
    features: [
      "Bluetooth 5.0 connectivity",
      "Waterproof (IPX7 rated)",
      "12-hour battery life",
      "Built-in microphone",
      "USB-C charging",
      "Compact and portable design"
    ],
    stock: 30,
    seller: "AudioTech Inc.",
    colors: ["Black", "Blue", "Red", "Green"],
    relatedProducts: [1, 6]
  },
  { 
    id: "6", 
    name: "Laptop", 
    price: 999.99, 
    rating: 4.6, 
    reviews: 95, 
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
    category: "Electronics",
    description: "Powerful laptop with fast processor, ample storage, and long battery life. Perfect for work, study, and entertainment.",
    features: [
      "Intel Core i7 processor",
      "16GB RAM",
      "512GB SSD storage",
      "15.6-inch Full HD display",
      "Backlit keyboard",
      "Up to 10 hours battery life"
    ],
    stock: 7,
    seller: "TechGear",
    colors: ["Silver", "Space Gray"],
    relatedProducts: [1, 2, 4]
  }
];

// Reviews mock data
const REVIEWS = [
  {
    id: 1,
    productId: "1",
    user: "John D.",
    rating: 5,
    title: "Amazing sound quality!",
    comment: "These headphones exceed my expectations. The noise cancellation is perfect for my daily commute and the sound quality is crisp and clear. Battery life is also impressive.",
    date: "March 15, 2023",
    helpful: 24
  },
  {
    id: 2,
    productId: "1",
    user: "Sarah M.",
    rating: 4,
    title: "Great headphones, slightly tight fit",
    comment: "The sound quality is excellent and I love the battery life. My only complaint is that they're a bit tight on my head after a few hours of use. Otherwise, great product!",
    date: "February 3, 2023",
    helpful: 18
  },
  {
    id: 3,
    productId: "1",
    user: "Michael T.",
    rating: 5,
    title: "Best purchase this year",
    comment: "I've tried many wireless headphones and these are by far the best. The noise cancellation is outstanding and they're comfortable for all-day wear.",
    date: "January 22, 2023",
    helpful: 36
  }
];

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const productId = params.id;
  
  // Find the product with the matching ID
  const product = PRODUCTS.find(p => p.id === productId);
  
  // Find related products
  const relatedProducts = product?.relatedProducts
    ? PRODUCTS.filter(p => product.relatedProducts.includes(Number(p.id)))
    : [];
  
  // Find reviews for this product
  const productReviews = REVIEWS.filter(r => r.productId === productId);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }
  
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
          <Link href="/products" className="text-[#007185] hover:text-[#c7511f] hover:underline">Products</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/category/${product.category.toLowerCase()}`} className="text-[#007185] hover:text-[#c7511f] hover:underline">{product.category}</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-500">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full lg:w-2/5">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full object-contain h-96"
                />
              </div>
              
              {/* Thumbnails (placeholder) */}
              <div className="flex mt-4 gap-2 justify-center">
                {[1, 2, 3, 4].map(idx => (
                  <button key={idx} className="w-16 h-16 border border-gray-300 rounded-md flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={`Thumbnail ${idx}`} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="w-full lg:w-2/5">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            
            <Link href={`/seller/${product.seller.toLowerCase().replace(' ', '-')}`} className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm">
              by {product.seller}
            </Link>
            
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg 
                    key={star} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${star <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <Link href="#reviews" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline ml-2">
                {product.reviews} ratings
              </Link>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              <p className="text-sm text-gray-500 mt-1">
                FREE delivery available
              </p>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">About this item</h2>
              <p className="text-gray-700 mb-4">{product.description}</p>
              
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Purchase Box */}
          <div className="w-full lg:w-1/5">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-24">
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
              <p className="text-sm text-gray-500 mt-1">
                FREE delivery available
              </p>
              
              <div className="mt-4">
                <span className={product.stock > 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {/* Quantity */}
              <div className="mt-4">
                <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
                <select 
                  id="quantity" 
                  className="w-full border border-gray-300 rounded p-2"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
              </div>
              
              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button 
                        key={color} 
                        className={`px-3 py-1 text-xs rounded ${selectedColor === color ? 'bg-[#febd69] border border-orange-500' : 'bg-gray-100 border border-gray-300'}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add to Cart & Buy Now Buttons */}
              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-medium py-2 rounded-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                
                <Button 
                  className="w-full bg-[#ffa41c] hover:bg-[#f39c12] text-black font-medium py-2 rounded-full"
                >
                  Buy Now
                </Button>
              </div>
              
              {/* Wishlist & Share Buttons */}
              <div className="mt-4 flex justify-between">
                <button className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  Add to Wishlist
                </button>
                <button className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Product Description</h2>
                <p className="mb-4">{product.description}</p>
                
                <h3 className="text-lg font-bold mt-8 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Additional Details</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="font-medium w-32">Brand</span>
                        <span>{product.seller}</span>
                      </div>
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="font-medium w-32">Model</span>
                        <span>XYZ-{product.id}00</span>
                      </div>
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="font-medium w-32">Category</span>
                        <span>{product.category}</span>
                      </div>
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="font-medium w-32">Availability</span>
                        <span className={product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}>
                          {product.stock > 0 ? `In Stock (${product.stock} items)` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6" id="reviews">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Customer Reviews</h2>
                  <Button className="bg-[#febd69] hover:bg-[#f3a847] text-black">Write a Review</Button>
                </div>
                
                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/4">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">{product.rating.toFixed(1)}</div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg 
                            key={star} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-6 w-6 ${star <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">Based on {product.reviews} reviews</div>
                    </div>
                  </div>
                  
                  <div className="md:w-3/4">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map(rating => {
                        // Calculate percentage for this rating (mock data)
                        const percentage = rating === 5 ? 65 : 
                                        rating === 4 ? 20 : 
                                        rating === 3 ? 10 : 
                                        rating === 2 ? 3 : 2;
                        return (
                          <div key={rating} className="flex items-center">
                            <div className="flex items-center w-24">
                              <span>{rating}</span>
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                              <div 
                                className="bg-yellow-400 h-2.5 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-500 w-16">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Customer Reviews */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="space-y-8">
                    {productReviews.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <svg 
                                key={star} 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <h3 className="ml-2 font-medium">{review.title}</h3>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-2">
                          By {review.user} on {review.date}
                        </p>
                        
                        <p className="mb-3">{review.comment}</p>
                        
                        <div className="flex items-center text-sm">
                          <button className="text-[#007185] hover:text-[#c7511f] hover:underline">
                            {review.helpful} people found this helpful
                          </button>
                          <span className="mx-2 text-gray-300">|</span>
                          <button className="text-[#007185] hover:text-[#c7511f] hover:underline">
                            Helpful?
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Delivery</h3>
                  <p className="mb-4">We offer various shipping methods to meet your needs:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Standard Shipping (3-5 business days)</li>
                    <li>Express Shipping (1-2 business days)</li>
                    <li>Same Day Delivery (available in select areas)</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    Free shipping on orders over $75. Shipping times may vary depending on location and product availability.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Returns & Exchanges</h3>
                  <p className="mb-4">We want you to be completely satisfied with your purchase:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Easy returns within 30 days of delivery</li>
                    <li>Free return shipping for eligible items</li>
                    <li>Exchanges available for different sizes or colors</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    Some items may not be eligible for return due to hygiene reasons or special promotions. Please check the product details for specific return policies.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-2">International Shipping</h3>
                  <p className="mb-2">
                    We ship to many countries worldwide. International shipping rates and delivery times vary by location.
                  </p>
                  <p className="text-sm text-gray-600">
                    Please note that international orders may be subject to import duties and taxes, which are the responsibility of the customer.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Related Products</h2>
              <Link href="/products" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm">
                View more
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/product/${relatedProduct.id}`}>
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name} 
                      className="w-full h-56 object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${relatedProduct.id}`} className="hover:text-[#c7511f]">
                      <h3 className="font-medium text-lg mb-2">{relatedProduct.name}</h3>
                    </Link>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg 
                            key={star} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${star <= Math.floor(relatedProduct.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({relatedProduct.reviews})</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-bold text-lg">${relatedProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black text-sm py-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
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