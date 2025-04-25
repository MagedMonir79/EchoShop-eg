import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, insertProductSchema, insertCategorySchema, 
  insertSupplierSchema, insertOrderSchema, insertOrderItemSchema,
  insertCartSchema, insertCartItemSchema
} from "@shared/schema";

// Middleware to check authentication and admin role
const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // In a real implementation, this would check user session or token
  // and verify admin role. For now, we'll skip this.
  next();
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
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      // Check if user exists
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      // Check password
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" });
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

  const httpServer = createServer(app);

  return httpServer;
}
