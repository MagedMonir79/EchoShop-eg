import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for products
  app.get("/api/products", async (req, res) => {
    try {
      // In a real implementation, this would fetch from a database
      // For now, we'll return a mock response
      const products = [
        {
          id: 1,
          title: "Wireless Headphones",
          titleAr: "سماعات لاسلكية",
          description: "High-quality wireless headphones with noise cancellation",
          descriptionAr: "سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء",
          price: "99.99",
          discountedPrice: "59.99",
          imageUrl: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: 1,
          sellerId: 1,
          supplierId: 1,
          inventory: 50,
          rating: "4.8",
          reviewCount: 120,
          isActive: true
        },
        {
          id: 2,
          title: "Smart Watch Series 6",
          titleAr: "ساعة ذكية سلسلة 6",
          description: "Latest smart watch with health monitoring features",
          descriptionAr: "أحدث ساعة ذكية مع ميزات مراقبة الصحة",
          price: "299.99",
          discountedPrice: "195.99",
          imageUrl: "https://images.unsplash.com/photo-1591370874773-6702dcc9c22c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: 1,
          sellerId: 2,
          supplierId: 2,
          inventory: 25,
          rating: "4.9",
          reviewCount: 85,
          isActive: true
        },
        {
          id: 3,
          title: "4K Streaming Camera",
          titleAr: "كاميرا بث 4K",
          description: "Ultra HD streaming camera for professional video calls",
          descriptionAr: "كاميرا بث فائقة الدقة لمكالمات الفيديو الاحترافية",
          price: "129.99",
          discountedPrice: "64.99",
          imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: 1,
          sellerId: 1,
          supplierId: 3,
          inventory: 40,
          rating: "4.7",
          reviewCount: 65,
          isActive: true
        },
        {
          id: 4,
          title: "Gaming Controller PRO",
          titleAr: "وحدة تحكم الألعاب برو",
          description: "Professional gaming controller with customizable buttons",
          descriptionAr: "وحدة تحكم احترافية للألعاب مع أزرار قابلة للتخصيص",
          price: "79.99",
          discountedPrice: "59.99",
          imageUrl: "https://images.unsplash.com/photo-1600186279172-fddCC51dADRe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: 1,
          sellerId: 3,
          supplierId: 1,
          inventory: 60,
          rating: "4.5",
          reviewCount: 95,
          isActive: true
        }
      ];
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // API route for getting a single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      // In a real implementation, this would fetch from a database
      // For now, we'll return a mock response
      res.json({
        id: productId,
        title: "Wireless Headphones",
        titleAr: "سماعات لاسلكية",
        description: "High-quality wireless headphones with noise cancellation",
        descriptionAr: "سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء",
        price: "99.99",
        discountedPrice: "59.99",
        imageUrl: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        categoryId: 1,
        sellerId: 1,
        supplierId: 1,
        inventory: 50,
        rating: "4.8",
        reviewCount: 120,
        isActive: true
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // API routes for categories
  app.get("/api/categories", async (req, res) => {
    try {
      // In a real implementation, this would fetch from a database
      // For now, we'll return a mock response
      const categories = [
        { id: 1, name: "electronics", nameAr: "الإلكترونيات", imageUrl: "https://example.com/electronics.jpg" },
        { id: 2, name: "fashion", nameAr: "الأزياء", imageUrl: "https://example.com/fashion.jpg" },
        { id: 3, name: "home", nameAr: "المنزل", imageUrl: "https://example.com/home.jpg" },
        { id: 4, name: "beauty", nameAr: "الجمال", imageUrl: "https://example.com/beauty.jpg" },
        { id: 5, name: "sports", nameAr: "الرياضة", imageUrl: "https://example.com/sports.jpg" },
        { id: 6, name: "toys", nameAr: "الألعاب", imageUrl: "https://example.com/toys.jpg" }
      ];
      
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // API routes for cart operations
  app.post("/api/cart/add", async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      // In a real implementation, this would add to a cart in a database
      res.json({ success: true, message: "Product added to cart" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add product to cart" });
    }
  });

  app.post("/api/cart/remove", async (req, res) => {
    try {
      const { userId, productId } = req.body;
      // In a real implementation, this would remove from a cart in a database
      res.json({ success: true, message: "Product removed from cart" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove product from cart" });
    }
  });

  // API routes for orders
  app.post("/api/orders/create", async (req, res) => {
    try {
      const { userId, items, address, paymentMethod } = req.body;
      // In a real implementation, this would create an order in a database
      res.json({ 
        success: true, 
        orderId: "ORD" + Date.now(),
        message: "Order created successfully" 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      // In a real implementation, this would fetch orders from a database
      const orders = [
        { 
          id: "ORD001", 
          userId: userId, 
          status: "delivered", 
          total: 159.99,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            { productId: 1, quantity: 1, price: 159.99 }
          ]
        },
        { 
          id: "ORD002", 
          userId: userId, 
          status: "processing", 
          total: 89.99,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            { productId: 2, quantity: 1, price: 89.99 }
          ]
        }
      ];
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // API routes for admin settings
  app.get("/api/admin/settings", async (req, res) => {
    try {
      // In a real implementation, this would fetch settings from a database
      const settings = {
        mainBackground: "#0f172a",
        primaryColor: "#a3e635",
        secondaryColor: "#2563eb",
        headerColor: "#1e293b",
        titleFont: "Roboto",
        bodyFont: "Roboto",
        logoUrl: "https://example.com/logo.png",
        mainBannerUrl: "https://example.com/banner.jpg",
        additionalBanners: [
          "https://example.com/banner1.jpg",
          "https://example.com/banner2.jpg"
        ],
        bannerCount: 3,
        showFeaturedOffers: true,
        showCustomerReviews: true,
        showDiscounts: true,
        enableScrollEffects: false,
        showWhatsAppButton: true,
        enableNotifications: false,
        maintenanceMode: false,
        sessionDuration: 60
      };
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      const settings = req.body;
      // In a real implementation, this would update settings in a database
      res.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // API routes for suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      // In a real implementation, this would fetch suppliers from a database
      const suppliers = [
        {
          id: 1,
          name: "Tech Wholesalers",
          nameAr: "تجار التكنولوجيا بالجملة",
          website: "https://techws.example.com",
          apiKey: "api_key_1",
          apiUrl: "https://api.techws.example.com",
          marginRate: 0.15,
          isActive: true
        },
        {
          id: 2,
          name: "Global Gadgets",
          nameAr: "أجهزة عالمية",
          website: "https://globalgadgets.example.com",
          apiKey: "api_key_2",
          apiUrl: "https://api.globalgadgets.example.com",
          marginRate: 0.2,
          isActive: true
        },
        {
          id: 3,
          name: "Express Electronics",
          nameAr: "إلكترونيات إكسبريس",
          website: "https://expresselectronics.example.com",
          apiKey: "api_key_3",
          apiUrl: "https://api.expresselectronics.example.com",
          marginRate: 0.18,
          isActive: true
        }
      ];
      
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
