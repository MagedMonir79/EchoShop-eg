import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loyaltyService } from "./services/loyalty-service";
import { recommendationsService } from "./services/recommendations-service";
import { createFawryPayment, checkFawryPaymentStatus, FawryPaymentMethod } from "./services/payment/fawry";
import { createVodafonePayment, checkVodafonePaymentStatus, generateMerchantReferenceId } from "./services/payment/vodafone-cash";
import { createInstaPayPayment, checkInstaPayPaymentStatus, generateOrderId } from "./services/payment/instapay";
import { shippingService } from "./services/shipping-service";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { add } from "date-fns";
import { db } from "./db";
import { 
  insertUserSchema, insertProductSchema, insertCategorySchema, 
  insertSupplierSchema, insertOrderSchema, insertOrderItemSchema,
  insertCartSchema, insertCartItemSchema, insertSellerProfileSchema,
  insertShippingCompanySchema, insertShippingOptionSchema,
  adminActivationCodes
} from "@shared/schema";
import { 
  generateAdminActivationCode, 
  getValidActivationCodes, 
  invalidateActivationCode,
  createInitialAdminCode 
} from "./admin-api";

// Middleware to check authentication and admin role
const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated and has user data in the request
    // This assumes authentication middleware has already run
    if (!req.isAuthenticated || !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check if user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden. Admin access required." });
    }
    
    // User is authenticated and has admin role
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid user data", details: result.error.format() });
      }
      
      const { email, username } = result.data;
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      
      const user = await storage.createUser(result.data);
      
      // Omit password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      
      if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: "Username/Email and password are required" });
      }
      
      // Check if input contains @ symbol (indicating an email)
      const isEmail = usernameOrEmail.includes('@');
      
      // Check if user exists by username or email
      let user;
      if (isEmail) {
        user = await storage.getUserByEmail(usernameOrEmail);
      } else {
        user = await storage.getUserByUsername(usernameOrEmail);
      }
      
      if (!user) {
        return res.status(401).json({ error: "Invalid username/email or password" });
      }
      
      // Check password
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid username/email or password" });
      }
      
      // Omit password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const search = req.query.search as string | undefined;
      
      let products;
      
      if (categoryId) {
        products = await storage.getProductsByCategory(categoryId, limit, offset);
      } else if (search) {
        products = await storage.searchProducts(search, limit, offset);
      } else {
        products = await storage.getAllProducts(limit, offset);
      }
      
      res.json(products);
    } catch (error) {
      console.error("Fetch products error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Fetch product error:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });
  
  app.post("/api/products", adminMiddleware, async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid product data", details: result.error.format() });
      }
      
      const product = await storage.createProduct(result.data);
      
      res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });
  
  app.put("/api/products/:id", adminMiddleware, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const result = z.object({
        title: z.string().optional(),
        titleAr: z.string().optional(),
        description: z.string().optional(),
        descriptionAr: z.string().optional(),
        price: z.string().or(z.number()).optional(),
        discountedPrice: z.string().or(z.number()).optional(),
        imageUrl: z.string().optional(),
        categoryId: z.number().optional(),
        sellerId: z.number().optional(),
        supplierId: z.number().optional(),
        inventory: z.number().optional(),
        isActive: z.boolean().optional()
      }).safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid product data", details: result.error.format() });
      }
      
      const updatedProduct = await storage.updateProduct(productId, result.data);
      
      res.json(updatedProduct);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  
  app.delete("/api/products/:id", adminMiddleware, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      await storage.deleteProduct(productId);
      
      res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const parentId = req.query.parentId 
        ? parseInt(req.query.parentId as string) 
        : undefined;
      
      const categories = await storage.getAllCategories(parentId);
      
      res.json(categories);
    } catch (error) {
      console.error("Fetch categories error:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      const category = await storage.getCategory(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Fetch category error:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });
  
  app.post("/api/categories", adminMiddleware, async (req, res) => {
    try {
      const result = insertCategorySchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid category data", details: result.error.format() });
      }
      
      const category = await storage.createCategory(result.data);
      
      res.status(201).json(category);
    } catch (error) {
      console.error("Create category error:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });
  
  app.put("/api/categories/:id", adminMiddleware, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      const category = await storage.getCategory(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      const result = z.object({
        name: z.string().optional(),
        nameAr: z.string().optional(),
        imageUrl: z.string().optional(),
        parentId: z.number().optional()
      }).safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid category data", details: result.error.format() });
      }
      
      const updatedCategory = await storage.updateCategory(categoryId, result.data);
      
      res.json(updatedCategory);
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });
  
  app.delete("/api/categories/:id", adminMiddleware, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      const category = await storage.getCategory(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      await storage.deleteCategory(categoryId);
      
      res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Cart endpoints
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      // Get or create cart
      let cart = await storage.getCartByUser(userId);
      
      if (!cart) {
        cart = await storage.createCart({ userId });
      }
      
      // Get cart items
      const cartItems = await storage.getCartItemsByCart(cart.id);
      
      res.json({ cart, items: cartItems });
    } catch (error) {
      console.error("Fetch cart error:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart/add", async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      
      if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: "userId, productId, and quantity are required" });
      }
      
      // Get or create cart
      let cart = await storage.getCartByUser(userId);
      
      if (!cart) {
        cart = await storage.createCart({ userId });
      }
      
      // Check if product exists
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Add to cart
      const cartItem = await storage.createCartItem({
        cartId: cart.id,
        productId,
        quantity
      });
      
      res.status(201).json({ success: true, cartItem });
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({ error: "Failed to add product to cart" });
    }
  });

  app.post("/api/cart/update", async (req, res) => {
    try {
      const { cartItemId, quantity } = req.body;
      
      if (!cartItemId || !quantity) {
        return res.status(400).json({ error: "cartItemId and quantity are required" });
      }
      
      // Check if cart item exists
      const cartItem = await storage.getCartItem(cartItemId);
      
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      // Update cart item
      const updatedCartItem = await storage.updateCartItem(cartItemId, { quantity });
      
      res.json({ success: true, cartItem: updatedCartItem });
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(500).json({ error: "Failed to update cart" });
    }
  });

  app.post("/api/cart/remove", async (req, res) => {
    try {
      const { cartItemId } = req.body;
      
      if (!cartItemId) {
        return res.status(400).json({ error: "cartItemId is required" });
      }
      
      // Check if cart item exists
      const cartItem = await storage.getCartItem(cartItemId);
      
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      // Remove from cart
      await storage.deleteCartItem(cartItemId);
      
      res.json({ success: true, message: "Product removed from cart" });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({ error: "Failed to remove product from cart" });
    }
  });

  // Payment Gateway endpoints
  
  // Fawry payment endpoints
  app.post("/api/payment/fawry/create", async (req, res) => {
    try {
      const { 
        customerName, 
        customerMobile, 
        customerEmail, 
        amount, 
        orderItems,
        paymentMethod = FawryPaymentMethod.REFERENCE_NUMBER
      } = req.body;
      
      if (!customerName || !customerMobile || !amount || !orderItems || orderItems.length === 0) {
        return res.status(400).json({ 
          error: "Missing required payment information",
          details: "Customer name, mobile, amount, and order items are required"
        });
      }
      
      const merchantRefNum = `FAWRY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const customerProfileId = `CUST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const chargeItems = orderItems.map((item: any) => ({
        itemId: item.id.toString(),
        description: item.title || "Product",
        price: parseFloat(item.price),
        quantity: item.quantity
      }));
      
      const paymentResponse = await createFawryPayment({
        merchantRefNum,
        customerProfileId,
        customerName,
        customerMobile,
        customerEmail: customerEmail || "",
        chargeItems,
        paymentMethod,
        amount,
        description: `Order payment #${merchantRefNum}`,
        returnUrl: `${process.env.APP_URL || 'http://localhost:5000'}/payment/callback`
      });
      
      res.json({
        success: true,
        paymentData: paymentResponse
      });
    } catch (error: any) {
      console.error("Fawry payment creation error:", error);
      res.status(500).json({ 
        error: "Failed to create Fawry payment",
        message: error.message
      });
    }
  });
  
  app.get("/api/payment/fawry/status/:referenceNumber", async (req, res) => {
    try {
      const { referenceNumber } = req.params;
      
      if (!referenceNumber) {
        return res.status(400).json({ error: "Reference number is required" });
      }
      
      const statusResponse = await checkFawryPaymentStatus(referenceNumber);
      
      res.json({
        success: true,
        status: statusResponse
      });
    } catch (error: any) {
      console.error("Fawry payment status check error:", error);
      res.status(500).json({ 
        error: "Failed to check Fawry payment status",
        message: error.message
      });
    }
  });
  
  // Vodafone Cash payment endpoints
  app.post("/api/payment/vodafone/create", async (req, res) => {
    try {
      const { 
        customerName, 
        customerMobile, 
        customerEmail, 
        amount, 
        description
      } = req.body;
      
      if (!customerName || !customerMobile || !amount) {
        return res.status(400).json({ 
          error: "Missing required payment information",
          details: "Customer name, mobile, and amount are required"
        });
      }
      
      const merchantReferenceId = generateMerchantReferenceId();
      
      const paymentResponse = await createVodafonePayment({
        merchantReferenceId,
        customerName,
        msisdn: customerMobile,
        customerEmail,
        amount: parseFloat(amount),
        description: description || `Payment for order ${merchantReferenceId}`,
        callbackUrl: `${process.env.APP_URL || 'http://localhost:5000'}/payment/callback`
      });
      
      res.json({
        success: true,
        paymentData: paymentResponse
      });
    } catch (error: any) {
      console.error("Vodafone Cash payment creation error:", error);
      res.status(500).json({ 
        error: "Failed to create Vodafone Cash payment",
        message: error.message
      });
    }
  });
  
  app.get("/api/payment/vodafone/status/:merchantReferenceId", async (req, res) => {
    try {
      const { merchantReferenceId } = req.params;
      
      if (!merchantReferenceId) {
        return res.status(400).json({ error: "Merchant reference ID is required" });
      }
      
      const statusResponse = await checkVodafonePaymentStatus(merchantReferenceId);
      
      res.json({
        success: true,
        status: statusResponse
      });
    } catch (error: any) {
      console.error("Vodafone Cash payment status check error:", error);
      res.status(500).json({ 
        error: "Failed to check Vodafone Cash payment status",
        message: error.message
      });
    }
  });
  
  // InstaPay payment endpoints
  app.post("/api/payment/instapay/create", async (req, res) => {
    try {
      const { 
        firstName,
        lastName,
        email,
        phoneNumber,
        amount, 
        description
      } = req.body;
      
      if (!firstName || !lastName || !phoneNumber || !amount) {
        return res.status(400).json({ 
          error: "Missing required payment information",
          details: "Customer first name, last name, phone number, and amount are required"
        });
      }
      
      const orderId = generateOrderId();
      
      const paymentResponse = await createInstaPayPayment({
        orderId,
        amount: parseFloat(amount),
        customerInfo: {
          firstName,
          lastName,
          email: email || "",
          phoneNumber
        },
        description: description || `Payment for order ${orderId}`,
        redirectUrl: `${process.env.APP_URL || 'http://localhost:5000'}/payment/callback`
      });
      
      res.json({
        success: true,
        paymentData: paymentResponse
      });
    } catch (error: any) {
      console.error("InstaPay payment creation error:", error);
      res.status(500).json({ 
        error: "Failed to create InstaPay payment",
        message: error.message
      });
    }
  });
  
  app.get("/api/payment/instapay/status/:paymentId", async (req, res) => {
    try {
      const { paymentId } = req.params;
      
      if (!paymentId) {
        return res.status(400).json({ error: "Payment ID is required" });
      }
      
      const statusResponse = await checkInstaPayPaymentStatus(paymentId);
      
      res.json({
        success: true,
        status: statusResponse
      });
    } catch (error: any) {
      console.error("InstaPay payment status check error:", error);
      res.status(500).json({ 
        error: "Failed to check InstaPay payment status",
        message: error.message
      });
    }
  });
  
  // Payment callback route
  app.get("/payment/callback", (req, res) => {
    const paymentProvider = req.query.provider;
    const status = req.query.status;
    const referenceNumber = req.query.reference;
    
    // Log payment callback data
    console.log("Payment callback received:", {
      provider: paymentProvider,
      status,
      referenceNumber,
      queryParams: req.query
    });
    
    // Redirect back to frontend based on payment status
    if (status === 'SUCCESS' || status === 'PAID') {
      res.redirect(`/checkout/success?reference=${referenceNumber}`);
    } else {
      res.redirect(`/checkout/failed?reference=${referenceNumber}&reason=${req.query.reason || 'unknown'}`);
    }
  });

  // Orders endpoints
  app.get("/api/orders", adminMiddleware, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const orders = await storage.getAllOrders(limit, offset);
      
      res.json(orders);
    } catch (error) {
      console.error("Fetch orders error:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const orders = await storage.getOrdersByUser(userId, limit, offset);
      
      // Fetch items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItemsByOrder(order.id);
          return { ...order, items };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      console.error("Fetch user orders error:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Fetch order items
      const items = await storage.getOrderItemsByOrder(orderId);
      
      res.json({ ...order, items });
    } catch (error) {
      console.error("Fetch order error:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders/create", async (req, res) => {
    try {
      const { userId, items, address, phoneNumber, paymentMethod } = req.body;
      
      if (!userId || !items || !items.length || !address || !phoneNumber || !paymentMethod) {
        return res.status(400).json({ 
          error: "userId, items, address, phoneNumber, and paymentMethod are required" 
        });
      }
      
      // Calculate total
      let total = 0;
      
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        
        if (!product) {
          return res.status(404).json({ 
            error: `Product with ID ${item.productId} not found` 
          });
        }
        
        // Use discounted price if available
        const price = product.discountedPrice || product.price;
        total += parseFloat(price.toString()) * item.quantity;
      }
      
      // Create order
      const order = await storage.createOrder({
        userId,
        status: "pending",
        total,
        address,
        phoneNumber,
        paymentMethod
      });
      
      // Create order items
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        // Use discounted price if available
        const price = product.discountedPrice || product.price;
        
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(price.toString())
        });
      }
      
      res.status(201).json({ 
        success: true, 
        orderId: order.id,
        message: "Order created successfully" 
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", adminMiddleware, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      const updatedOrder = await storage.updateOrder(orderId, { status });
      
      res.json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Suppliers endpoints
  app.get("/api/suppliers", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const suppliers = await storage.getAllSuppliers(limit, offset);
      
      res.json(suppliers);
    } catch (error) {
      console.error("Fetch suppliers error:", error);
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      
      if (isNaN(supplierId)) {
        return res.status(400).json({ error: "Invalid supplier ID" });
      }
      
      const supplier = await storage.getSupplier(supplierId);
      
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      
      res.json(supplier);
    } catch (error) {
      console.error("Fetch supplier error:", error);
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  });

  app.post("/api/suppliers", adminMiddleware, async (req, res) => {
    try {
      const result = insertSupplierSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid supplier data", details: result.error.format() });
      }
      
      const supplier = await storage.createSupplier(result.data);
      
      res.status(201).json(supplier);
    } catch (error) {
      console.error("Create supplier error:", error);
      res.status(500).json({ error: "Failed to create supplier" });
    }
  });

  app.put("/api/suppliers/:id", adminMiddleware, async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      
      if (isNaN(supplierId)) {
        return res.status(400).json({ error: "Invalid supplier ID" });
      }
      
      const supplier = await storage.getSupplier(supplierId);
      
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      
      const result = z.object({
        name: z.string().optional(),
        nameAr: z.string().optional(),
        website: z.string().optional(),
        apiKey: z.string().optional(),
        apiUrl: z.string().optional(),
        marginRate: z.number().or(z.string()).optional(),
        isActive: z.boolean().optional()
      }).safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid supplier data", details: result.error.format() });
      }
      
      const updatedSupplier = await storage.updateSupplier(supplierId, result.data);
      
      res.json(updatedSupplier);
    } catch (error) {
      console.error("Update supplier error:", error);
      res.status(500).json({ error: "Failed to update supplier" });
    }
  });

  app.delete("/api/suppliers/:id", adminMiddleware, async (req, res) => {
    try {
      const supplierId = parseInt(req.params.id);
      
      if (isNaN(supplierId)) {
        return res.status(400).json({ error: "Invalid supplier ID" });
      }
      
      const supplier = await storage.getSupplier(supplierId);
      
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      
      await storage.deleteSupplier(supplierId);
      
      res.json({ success: true, message: "Supplier deleted successfully" });
    } catch (error) {
      console.error("Delete supplier error:", error);
      res.status(500).json({ error: "Failed to delete supplier" });
    }
  });

  // مسار لإنشاء رمز تفعيل أولي للمدير (متاح فقط في بيئة التطوير)
  app.get("/api/admin/create-initial-code", createInitialAdminCode);
  
  // Admin settings endpoints
  app.get("/api/admin/settings", adminMiddleware, async (req, res) => {
    try {
      const settings = await storage.getAppSettings();
      
      res.json(settings);
    } catch (error) {
      console.error("Fetch settings error:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", adminMiddleware, async (req, res) => {
    try {
      const settings = req.body;
      
      if (!settings || typeof settings !== "object") {
        return res.status(400).json({ error: "Invalid settings data" });
      }
      
      // Update each setting
      const promises = Object.entries(settings).map(([key, value]) => {
        return storage.createOrUpdateSetting(key, value.toString());
      });
      
      await Promise.all(promises);
      
      res.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Dashboard endpoints
  app.get("/api/admin/dashboard/stats", adminMiddleware, async (req, res) => {
    try {
      const userCount = await storage.getUserCount();
      const productCount = await storage.getProductCount();
      const categoryCount = await storage.getCategoryCount();
      const orderCount = await storage.getOrderCount();
      const supplierCount = await storage.getSupplierCount();
      
      res.json({
        userCount,
        productCount,
        categoryCount,
        orderCount,
        supplierCount
      });
    } catch (error) {
      console.error("Fetch dashboard stats error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // User management endpoints (admin)
  app.get("/api/admin/users", adminMiddleware, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const users = await storage.getAllUsers(limit, offset);
      
      // Omit passwords
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Fetch users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.put("/api/admin/users/:id", adminMiddleware, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const result = z.object({
        email: z.string().email().optional(),
        username: z.string().optional(),
        fullName: z.string().optional(),
        role: z.string().optional(),
        profileImage: z.string().optional()
      }).safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid user data", details: result.error.format() });
      }
      
      const updatedUser = await storage.updateUser(userId, result.data);
      
      if (updatedUser) {
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", adminMiddleware, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      await storage.deleteUser(userId);
      
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Loyalty Program Endpoints
  app.get("/api/loyalty/account/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      // Create account if it doesn't exist
      await loyaltyService.createLoyaltyAccount(userId);
      
      // Get user's loyalty account
      const account = await loyaltyService.getLoyaltyAccount(userId);
      
      if (!account) {
        return res.status(404).json({ error: "Loyalty account not found" });
      }
      
      res.json(account);
    } catch (error) {
      console.error("Fetch loyalty account error:", error);
      res.status(500).json({ error: "Failed to fetch loyalty account" });
    }
  });
  
  app.get("/api/loyalty/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const transactions = await loyaltyService.getTransactionHistory(userId, limit, offset);
      
      res.json(transactions);
    } catch (error) {
      console.error("Fetch loyalty transactions error:", error);
      res.status(500).json({ error: "Failed to fetch loyalty transactions" });
    }
  });
  
  app.get("/api/loyalty/rewards", async (req, res) => {
    try {
      const minOrderValue = req.query.minOrderValue 
        ? parseFloat(req.query.minOrderValue as string) 
        : undefined;
      
      const rewards = await loyaltyService.getAvailableRewards(minOrderValue);
      
      res.json(rewards);
    } catch (error) {
      console.error("Fetch loyalty rewards error:", error);
      res.status(500).json({ error: "Failed to fetch loyalty rewards" });
    }
  });
  
  app.post("/api/loyalty/redeem", async (req, res) => {
    try {
      const { userId, rewardId } = req.body;
      
      if (!userId || !rewardId) {
        return res.status(400).json({ error: "User ID and reward ID are required" });
      }
      
      const code = await loyaltyService.redeemPoints(userId, rewardId);
      
      res.json({ success: true, code });
    } catch (error) {
      console.error("Redeem points error:", error);
      res.status(400).json({ error: error.message || "Failed to redeem points" });
    }
  });
  
  app.get("/api/loyalty/redemptions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const redemptions = await loyaltyService.getRedemptionHistory(userId, limit, offset);
      
      res.json(redemptions);
    } catch (error) {
      console.error("Fetch redemptions error:", error);
      res.status(500).json({ error: "Failed to fetch redemptions" });
    }
  });
  
  // Endpoint to manually award points for an order 
  // (Can be called after order completion or from admin panel)
  app.post("/api/loyalty/award-points", async (req, res) => {
    try {
      const { userId, orderId, orderTotal } = req.body;
      
      if (!userId || !orderId || !orderTotal) {
        return res.status(400).json({ 
          error: "User ID, order ID, and order total are required" 
        });
      }
      
      await loyaltyService.awardOrderPoints(
        parseInt(userId), 
        parseInt(orderId), 
        parseFloat(orderTotal)
      );
      
      res.json({ success: true, message: "Points awarded successfully" });
    } catch (error) {
      console.error("Award points error:", error);
      res.status(500).json({ error: "Failed to award points" });
    }
  });
  
  // Recommendations endpoints
  app.get("/api/recommendations/for-user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const recommendations = await recommendationsService.getRecommendationsForUser(userId, limit);
      
      res.json(recommendations);
    } catch (error) {
      console.error("Get recommendations error:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });
  
  app.post("/api/analytics/event", async (req, res) => {
    try {
      const { userId, eventType, resourceId, resourceType, metadata } = req.body;
      
      if (!eventType) {
        return res.status(400).json({ error: "Event type is required" });
      }
      
      await recommendationsService.logEvent(
        userId || null, 
        eventType, 
        resourceId || null, 
        resourceType || null, 
        metadata || {}
      );
      
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Log analytics event error:", error);
      res.status(500).json({ error: "Failed to log analytics event" });
    }
  });
  
  app.post("/api/analytics/product-view", async (req, res) => {
    try {
      const { userId, productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }
      
      await recommendationsService.logProductView(userId || null, productId);
      
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Log product view error:", error);
      res.status(500).json({ error: "Failed to log product view" });
    }
  });
  
  app.post("/api/analytics/add-to-cart", async (req, res) => {
    try {
      const { userId, productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }
      
      await recommendationsService.logAddToCart(userId || null, productId);
      
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Log add to cart error:", error);
      res.status(500).json({ error: "Failed to log add to cart event" });
    }
  });
  
  // Admin endpoints for managing loyalty rewards
  app.post("/api/loyalty/rewards", adminMiddleware, async (req, res) => {
    try {
      const result = await loyaltyService.createReward(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Create reward error:", error);
      res.status(500).json({ error: "Failed to create reward" });
    }
  });
  
  // Seller registration endpoint
  app.post("/api/sellers/register", async (req, res) => {
    try {
      const { userId, ...sellerData } = req.body;
      
      // Check if user exists
      const user = await storage.getUser(parseInt(userId));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Check if user already has a seller profile
      const existingProfile = await storage.getSellerProfileByUserId(parseInt(userId));
      if (existingProfile) {
        return res.status(400).json({ error: "Seller profile already exists for this user" });
      }
      
      // Create seller profile
      const sellerProfile = await storage.createSellerProfile({
        userId: parseInt(userId),
        ...sellerData
      });
      
      // Update user role to seller
      await storage.updateUser(parseInt(userId), { role: "seller" });
      
      // Create notification for admin
      await storage.createNotification({
        userId: 1, // Admin user ID (assuming admin has ID 1)
        type: "system",
        title: "New Seller Registration",
        message: `A new seller "${sellerData.storeName}" has registered and is awaiting approval.`,
        resourceId: sellerProfile.id,
        resourceType: "seller_profile"
      });
      
      res.status(201).json(sellerProfile);
    } catch (error) {
      console.error("Seller registration error:", error);
      res.status(500).json({ error: "Failed to register seller" });
    }
  });
  
  // Admin seller management endpoints
  app.get("/api/admin/sellers", adminMiddleware, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const sellers = await storage.getSellerProfiles(status, limit, offset);
      
      res.json(sellers);
    } catch (error) {
      console.error("Fetch sellers error:", error);
      res.status(500).json({ error: "Failed to fetch sellers" });
    }
  });
  
  app.get("/api/admin/sellers/:id", adminMiddleware, async (req, res) => {
    try {
      const sellerId = parseInt(req.params.id);
      
      if (isNaN(sellerId)) {
        return res.status(400).json({ error: "Invalid seller ID" });
      }
      
      const seller = await storage.getSellerProfile(sellerId);
      
      if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
      }
      
      res.json(seller);
    } catch (error) {
      console.error("Fetch seller error:", error);
      res.status(500).json({ error: "Failed to fetch seller" });
    }
  });
  
  app.put("/api/admin/sellers/:id/status", adminMiddleware, async (req, res) => {
    try {
      const sellerId = parseInt(req.params.id);
      
      if (isNaN(sellerId)) {
        return res.status(400).json({ error: "Invalid seller ID" });
      }
      
      const seller = await storage.getSellerProfile(sellerId);
      
      if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
      }
      
      const { status, statusReason } = req.body;
      
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'pending', 'approved', or 'rejected'" });
      }
      
      // Require reason for rejection
      if (status === "rejected" && !statusReason) {
        return res.status(400).json({ error: "Reason is required when rejecting a seller" });
      }
      
      const updatedSeller = await storage.updateSellerProfile(sellerId, { 
        status, 
        statusReason,
        updatedAt: new Date()
      });
      
      // Create notification for the seller
      const message = status === "approved" 
        ? "Your seller application has been approved. You can now start selling products." 
        : status === "rejected" 
          ? `Your seller application has been rejected. Reason: ${statusReason}` 
          : "Your seller application status has been updated to 'pending'.";
      
      await storage.createNotification({
        userId: seller.userId,
        type: "system",
        title: "Seller Application Update",
        message,
        resourceId: sellerId,
        resourceType: "seller_profile"
      });
      
      res.json(updatedSeller);
    } catch (error) {
      console.error("Update seller status error:", error);
      res.status(500).json({ error: "Failed to update seller status" });
    }
  });
  
  app.put("/api/admin/sellers/:id", adminMiddleware, async (req, res) => {
    try {
      const sellerId = parseInt(req.params.id);
      
      if (isNaN(sellerId)) {
        return res.status(400).json({ error: "Invalid seller ID" });
      }
      
      const seller = await storage.getSellerProfile(sellerId);
      
      if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
      }
      
      const result = z.object({
        storeName: z.string().optional(),
        storeNameAr: z.string().optional(),
        businessType: z.string().optional(),
        taxId: z.string().optional(),
        description: z.string().optional(),
        descriptionAr: z.string().optional(),
        logo: z.string().optional(),
        bannerImage: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        address: z.string().optional(),
        isVerified: z.boolean().optional(),
        commissionRate: z.string().or(z.number()).optional()
      }).safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid seller data", details: result.error.format() });
      }
      
      const updatedSeller = await storage.updateSellerProfile(sellerId, {
        ...result.data,
        updatedAt: new Date()
      });
      
      res.json(updatedSeller);
    } catch (error) {
      console.error("Update seller error:", error);
      res.status(500).json({ error: "Failed to update seller" });
    }
  });
  
  app.delete("/api/admin/sellers/:id", adminMiddleware, async (req, res) => {
    try {
      const sellerId = parseInt(req.params.id);
      
      if (isNaN(sellerId)) {
        return res.status(400).json({ error: "Invalid seller ID" });
      }
      
      const seller = await storage.getSellerProfile(sellerId);
      
      if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
      }
      
      // Get the user ID before deleting the seller profile
      const userId = seller.userId;
      
      await storage.deleteSellerProfile(sellerId);
      
      // Update user role back to customer
      await storage.updateUser(userId, { role: "customer" });
      
      // Create notification for the user
      await storage.createNotification({
        userId,
        type: "system",
        title: "Seller Profile Deleted",
        message: "Your seller profile has been deleted by an administrator.",
        resourceType: "system"
      });
      
      res.json({ success: true, message: "Seller deleted successfully" });
    } catch (error) {
      console.error("Delete seller error:", error);
      res.status(500).json({ error: "Failed to delete seller" });
    }
  });
  
  app.put("/api/loyalty/rewards/:id", adminMiddleware, async (req, res) => {
    try {
      const rewardId = parseInt(req.params.id);
      if (isNaN(rewardId)) {
        return res.status(400).json({ error: "Invalid reward ID" });
      }
      
      const result = await loyaltyService.updateReward(rewardId, req.body);
      if (!result) {
        return res.status(404).json({ error: "Reward not found" });
      }
      
      res.json(result);
    } catch (error) {
      console.error("Update reward error:", error);
      res.status(500).json({ error: "Failed to update reward" });
    }
  });
  
  app.delete("/api/loyalty/rewards/:id", adminMiddleware, async (req, res) => {
    try {
      const rewardId = parseInt(req.params.id);
      if (isNaN(rewardId)) {
        return res.status(400).json({ error: "Invalid reward ID" });
      }
      
      const result = await loyaltyService.deleteReward(rewardId);
      if (!result) {
        return res.status(404).json({ error: "Reward not found" });
      }
      
      res.json({ success: true, message: "Reward deleted successfully" });
    } catch (error) {
      console.error("Delete reward error:", error);
      res.status(500).json({ error: "Failed to delete reward" });
    }
  });
  


  // Shipping API endpoints
  // Get all shipping companies
  app.get("/api/shipping/companies", async (req, res) => {
    try {
      const companies = await shippingService.getAllShippingCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Fetch shipping companies error:", error);
      res.status(500).json({ error: "Failed to fetch shipping companies" });
    }
  });

  // Get shipping company by ID
  app.get("/api/shipping/companies/:id", async (req, res) => {
    try {
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ error: "Invalid shipping company ID" });
      }
      
      const company = await shippingService.getShippingCompanyById(companyId);
      
      if (!company) {
        return res.status(404).json({ error: "Shipping company not found" });
      }
      
      res.json(company);
    } catch (error) {
      console.error("Fetch shipping company error:", error);
      res.status(500).json({ error: "Failed to fetch shipping company" });
    }
  });

  // Get all shipping options
  app.get("/api/shipping/options", async (req, res) => {
    try {
      const companyId = req.query.companyId 
        ? parseInt(req.query.companyId as string) 
        : undefined;
      
      let options;
      
      if (companyId) {
        options = await shippingService.getShippingOptionsByCompanyId(companyId);
      } else {
        options = await shippingService.getAllShippingOptions();
      }
      
      res.json(options);
    } catch (error) {
      console.error("Fetch shipping options error:", error);
      res.status(500).json({ error: "Failed to fetch shipping options" });
    }
  });

  // Get shipping option by ID
  app.get("/api/shipping/options/:id", async (req, res) => {
    try {
      const optionId = parseInt(req.params.id);
      
      if (isNaN(optionId)) {
        return res.status(400).json({ error: "Invalid shipping option ID" });
      }
      
      const option = await shippingService.getShippingOptionById(optionId);
      
      if (!option) {
        return res.status(404).json({ error: "Shipping option not found" });
      }
      
      res.json(option);
    } catch (error) {
      console.error("Fetch shipping option error:", error);
      res.status(500).json({ error: "Failed to fetch shipping option" });
    }
  });

  // Get default shipping option
  app.get("/api/shipping/options/default", async (req, res) => {
    try {
      const option = await shippingService.getDefaultShippingOption();
      
      if (!option) {
        return res.status(404).json({ error: "No default shipping option found" });
      }
      
      res.json(option);
    } catch (error) {
      console.error("Fetch default shipping option error:", error);
      res.status(500).json({ error: "Failed to fetch default shipping option" });
    }
  });

  // Create shipping company (admin only)
  app.post("/api/shipping/companies", adminMiddleware, async (req, res) => {
    try {
      const result = insertShippingCompanySchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid shipping company data", 
          details: result.error.format() 
        });
      }
      
      const company = await shippingService.createShippingCompany(result.data);
      
      res.status(201).json(company);
    } catch (error) {
      console.error("Create shipping company error:", error);
      res.status(500).json({ error: "Failed to create shipping company" });
    }
  });

  // Create shipping option (admin only)
  app.post("/api/shipping/options", adminMiddleware, async (req, res) => {
    try {
      const result = insertShippingOptionSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid shipping option data", 
          details: result.error.format() 
        });
      }
      
      const option = await shippingService.createShippingOption(result.data);
      
      res.status(201).json(option);
    } catch (error) {
      console.error("Create shipping option error:", error);
      res.status(500).json({ error: "Failed to create shipping option" });
    }
  });

  // Update shipping company (admin only)
  app.put("/api/shipping/companies/:id", adminMiddleware, async (req, res) => {
    try {
      const companyId = parseInt(req.params.id);
      
      if (isNaN(companyId)) {
        return res.status(400).json({ error: "Invalid shipping company ID" });
      }
      
      const company = await shippingService.getShippingCompanyById(companyId);
      
      if (!company) {
        return res.status(404).json({ error: "Shipping company not found" });
      }
      
      const validFields = [
        "name", "nameAr", "logo", "website", "contactEmail", 
        "contactPhone", "isActive", "trackingUrl"
      ];
      
      // Filter out only valid fields to update
      const updateData: Record<string, any> = {};
      for (const key of validFields) {
        if (req.body[key] !== undefined) {
          updateData[key] = req.body[key];
        }
      }
      
      const updatedCompany = await shippingService.updateShippingCompany(companyId, updateData);
      
      res.json(updatedCompany);
    } catch (error) {
      console.error("Update shipping company error:", error);
      res.status(500).json({ error: "Failed to update shipping company" });
    }
  });

  // Update shipping option (admin only)
  app.put("/api/shipping/options/:id", adminMiddleware, async (req, res) => {
    try {
      const optionId = parseInt(req.params.id);
      
      if (isNaN(optionId)) {
        return res.status(400).json({ error: "Invalid shipping option ID" });
      }
      
      const option = await shippingService.getShippingOptionById(optionId);
      
      if (!option) {
        return res.status(404).json({ error: "Shipping option not found" });
      }
      
      const validFields = [
        "name", "nameAr", "description", "descriptionAr", "price",
        "deliveryTimeMinDays", "deliveryTimeMaxDays", "isDefault",
        "isActive", "shippingCompanyId"
      ];
      
      // Filter out only valid fields to update
      const updateData: Record<string, any> = {};
      for (const key of validFields) {
        if (req.body[key] !== undefined) {
          updateData[key] = req.body[key];
        }
      }
      
      const updatedOption = await shippingService.updateShippingOption(optionId, updateData);
      
      res.json(updatedOption);
    } catch (error) {
      console.error("Update shipping option error:", error);
      res.status(500).json({ error: "Failed to update shipping option" });
    }
  });

  // Admin Activation Codes API endpoints
  app.post("/api/admin/activation-codes", adminMiddleware, async (req, res) => {
    try {
      const { expiration } = req.body;
      
      // إنشاء رمز تفعيل جديد للمدير
      const expirationDays = expiration || 7; // عدد أيام صلاحية الرمز
      
      // إنشاء رمز عشوائي من 8 أحرف
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // تاريخ انتهاء الصلاحية
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);
      
      // حفظ الرمز في قاعدة البيانات
      const [newActivationCode] = await db.insert(adminActivationCodes).values({
        code,
        isValid: true,
        expiresAt,
        createdBy: req.user?.id || null,
      }).returning();
      
      res.status(201).json({
        success: true,
        data: {
          code: newActivationCode.code,
          expiresAt: newActivationCode.expiresAt,
        },
        message: "تم إنشاء رمز التفعيل بنجاح"
      });
      
    } catch (error) {
      console.error("Error generating admin activation code:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء إنشاء رمز التفعيل",
        error: error.message
      });
    }
  });
  
  app.get("/api/admin/activation-codes", adminMiddleware, async (req, res) => {
    try {
      const codes = await db.select().from(adminActivationCodes)
        .where(eq(adminActivationCodes.isValid, true))
        .orderBy(adminActivationCodes.createdAt);
      
      res.status(200).json({
        success: true,
        data: codes,
        message: `تم العثور على ${codes.length} رمز تفعيل صالح`
      });
      
    } catch (error) {
      console.error("Error fetching admin activation codes:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء استرجاع رموز التفعيل",
        error: error.message
      });
    }
  });
  
  app.delete("/api/admin/activation-codes/:codeId", adminMiddleware, async (req, res) => {
    try {
      const { codeId } = req.params;
      
      const [updatedCode] = await db.update(adminActivationCodes)
        .set({ isValid: false })
        .where(eq(adminActivationCodes.id, parseInt(codeId)))
        .returning();
        
      if (!updatedCode) {
        return res.status(404).json({
          success: false,
          message: "رمز التفعيل غير موجود"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "تم إلغاء صلاحية رمز التفعيل بنجاح"
      });
      
    } catch (error) {
      console.error("Error invalidating admin activation code:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء إلغاء صلاحية رمز التفعيل",
        error: error.message
      });
    }
  });

  // API endpoint للحصول على رمز تفعيل أولي (متاح فقط في بيئة التطوير)
  app.get("/api/admin/create-initial-code", async (req, res) => {
    try {
      // التحقق من أن الطلب يأتي من البيئة المحلية فقط
      if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({
          success: false,
          message: "هذه الواجهة متاحة فقط في بيئة التطوير"
        });
      }

      // إنشاء رمز تفعيل أولي بسيط
      const code = "ADMIN" + Math.floor(1000 + Math.random() * 9000).toString();
      
      // تاريخ انتهاء الصلاحية بعد 7 أيام
      const expiresAt = add(new Date(), { days: 7 });
      
      // التحقق مما إذا كان هناك مستخدم بالفعل
      const [firstUser] = await db.select().from(users).limit(1);
      
      // حفظ الرمز في قاعدة البيانات
      const [newActivationCode] = await db.insert(adminActivationCodes).values({
        code,
        isValid: true,
        expiresAt,
        createdBy: firstUser?.id || null,
      }).returning();
      
      res.status(201).json({
        success: true,
        data: {
          activationCode: newActivationCode.code,
          expiresAt: newActivationCode.expiresAt,
          message: "استخدم هذا الرمز للدخول كمدير. هذا الرمز صالح لمرة واحدة فقط."
        }
      });
      
    } catch (error: any) {
      console.error("Error creating initial admin activation code:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء إنشاء رمز التفعيل الأولي",
        error: error.message
      });
    }
  });

  // API endpoint للتحقق من صلاحية رمز التفعيل
  app.post("/api/admin/verify-activation-code", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: "رمز التفعيل مطلوب"
        });
      }
      
      const [activationCode] = await db.select()
        .from(adminActivationCodes)
        .where(eq(adminActivationCodes.code, code))
        .limit(1);
      
      if (!activationCode) {
        return res.status(404).json({
          success: false,
          message: "رمز التفعيل غير موجود"
        });
      }
      
      // التحقق من صلاحية الرمز والتاريخ
      const isValid = activationCode.isValid && new Date(activationCode.expiresAt) > new Date();
      
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "رمز التفعيل غير صالح أو منتهي الصلاحية"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "رمز التفعيل صالح"
      });
      
    } catch (error) {
      console.error("Error verifying admin activation code:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء التحقق من رمز التفعيل",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
