import {
  users, products, categories, suppliers, orders, orderItems, carts, cartItems, settings,
  productImages, productAttributes, reviews, sellerProfiles, supplierProductFeeds,
  supplierShippingMethods, coupons, addresses, notifications, wishlists, wishlistItems, analyticsEvents,
  type User, type Product, type Category, type Supplier, type Order, type OrderItem, type Cart, 
  type CartItem, type Setting, type InsertUser, type InsertProduct, type InsertCategory, 
  type InsertOrder, type InsertOrderItem, type InsertCart, type InsertCartItem, type InsertSupplier, 
  type InsertSetting
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, or, like, ilike, not, isNull } from "drizzle-orm";

// Expand interface with all CRUD methods needed

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(limit?: number, offset?: number): Promise<User[]>;
  getUserCount(): Promise<number>;
  
  // Seller methods
  getSellerProfile(id: number): Promise<SellerProfile | undefined>;
  getSellerProfileByUserId(userId: number): Promise<SellerProfile | undefined>;
  createSellerProfile(profile: InsertSellerProfile): Promise<SellerProfile>;
  updateSellerProfile(id: number, profile: Partial<SellerProfile>): Promise<SellerProfile | undefined>;
  deleteSellerProfile(id: number): Promise<boolean>;
  getSellerProfiles(status?: string, limit?: number, offset?: number): Promise<SellerProfile[]>;
  
  // Notification methods
  createNotification(notification: any): Promise<any>;
  
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getAllProducts(limit?: number, offset?: number): Promise<Product[]>;
  getProductsByCategory(categoryId: number, limit?: number, offset?: number): Promise<Product[]>;
  getProductsBySeller(sellerId: number, limit?: number, offset?: number): Promise<Product[]>;
  getProductsBySupplier(supplierId: number, limit?: number, offset?: number): Promise<Product[]>;
  searchProducts(query: string, limit?: number, offset?: number): Promise<Product[]>;
  getProductCount(): Promise<number>;
  getProductCountByCategory(categoryId: number): Promise<number>;
  
  // Category methods
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getAllCategories(parentId?: number): Promise<Category[]>;
  getCategoryCount(): Promise<number>;
  
  // Supplier methods
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;
  getAllSuppliers(limit?: number, offset?: number): Promise<Supplier[]>;
  getSupplierCount(): Promise<number>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  getAllOrders(limit?: number, offset?: number): Promise<Order[]>;
  getOrdersByUser(userId: number, limit?: number, offset?: number): Promise<Order[]>;
  getOrderCount(): Promise<number>;
  getOrderCountByUser(userId: number): Promise<number>;
  
  // OrderItem methods
  getOrderItem(id: number): Promise<OrderItem | undefined>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItemsByOrder(orderId: number): Promise<OrderItem[]>;
  
  // Cart methods
  getCart(id: number): Promise<Cart | undefined>;
  getCartByUser(userId: number): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  
  // CartItem methods
  getCartItem(id: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, cartItem: Partial<InsertCartItem>): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  getCartItemsByCart(cartId: number): Promise<CartItem[]>;
  
  // Settings methods
  getSetting(key: string): Promise<Setting | undefined>;
  createOrUpdateSetting(key: string, value: string): Promise<Setting>;
  getAppSettings(): Promise<Record<string, string>>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        settings: {},
        createdAt: new Date()
      })
      .returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }
  
  async getAllUsers(limit = 100, offset = 0): Promise<User[]> {
    return db.select().from(users).limit(limit).offset(offset);
  }
  
  async getUserCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result?.count || 0;
  }
  
  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }
  
  async getAllProducts(limit = 100, offset = 0): Promise<Product[]> {
    return db.select().from(products).limit(limit).offset(offset);
  }
  
  async getProductsByCategory(categoryId: number, limit = 100, offset = 0): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId))
      .limit(limit)
      .offset(offset);
  }
  
  async getProductsBySeller(sellerId: number, limit = 100, offset = 0): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.sellerId, sellerId))
      .limit(limit)
      .offset(offset);
  }
  
  async getProductsBySupplier(supplierId: number, limit = 100, offset = 0): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.supplierId, supplierId))
      .limit(limit)
      .offset(offset);
  }
  
  async searchProducts(query: string, limit = 100, offset = 0): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(
        or(
          ilike(products.title, `%${query}%`),
          ilike(products.titleAr, `%${query}%`),
          ilike(products.description, `%${query}%`),
          ilike(products.descriptionAr, `%${query}%`)
        )
      )
      .limit(limit)
      .offset(offset);
  }
  
  async getProductCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(products);
    return result?.count || 0;
  }
  
  async getProductCountByCategory(categoryId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.categoryId, categoryId));
    return result?.count || 0;
  }
  
  // Category methods
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  
  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  }
  
  async getAllCategories(parentId?: number): Promise<Category[]> {
    if (parentId !== undefined) {
      return db
        .select()
        .from(categories)
        .where(eq(categories.parentId, parentId));
    }
    
    return db.select().from(categories);
  }
  
  async getCategoryCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(categories);
    return result?.count || 0;
  }
  
  // Supplier methods
  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }
  
  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db.insert(suppliers).values(supplier).returning();
    return newSupplier;
  }
  
  async updateSupplier(id: number, supplierData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const [updatedSupplier] = await db
      .update(suppliers)
      .set(supplierData)
      .where(eq(suppliers.id, id))
      .returning();
    return updatedSupplier;
  }
  
  async deleteSupplier(id: number): Promise<boolean> {
    await db.delete(suppliers).where(eq(suppliers.id, id));
    return true;
  }
  
  async getAllSuppliers(limit = 100, offset = 0): Promise<Supplier[]> {
    return db.select().from(suppliers).limit(limit).offset(offset);
  }
  
  async getSupplierCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(suppliers);
    return result?.count || 0;
  }
  
  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  
  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({
        ...orderData,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }
  
  async deleteOrder(id: number): Promise<boolean> {
    await db.delete(orders).where(eq(orders.id, id));
    return true;
  }
  
  async getAllOrders(limit = 100, offset = 0): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getOrdersByUser(userId: number, limit = 100, offset = 0): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getOrderCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(orders);
    return result?.count || 0;
  }
  
  async getOrderCountByUser(userId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.userId, userId));
    return result?.count || 0;
  }
  
  // OrderItem methods
  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    const [orderItem] = await db.select().from(orderItems).where(eq(orderItems.id, id));
    return orderItem;
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }
  
  async getOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    return db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }
  
  // Cart methods
  async getCart(id: number): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.id, id));
    return cart;
  }
  
  async getCartByUser(userId: number): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));
    return cart;
  }
  
  async createCart(cart: InsertCart): Promise<Cart> {
    const [newCart] = await db.insert(carts).values(cart).returning();
    return newCart;
  }
  
  // CartItem methods
  async getCartItem(id: number): Promise<CartItem | undefined> {
    const [cartItem] = await db.select().from(cartItems).where(eq(cartItems.id, id));
    return cartItem;
  }
  
  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const [newCartItem] = await db.insert(cartItems).values(cartItem).returning();
    return newCartItem;
  }
  
  async updateCartItem(id: number, cartItemData: Partial<InsertCartItem>): Promise<CartItem | undefined> {
    const [updatedCartItem] = await db
      .update(cartItems)
      .set(cartItemData)
      .where(eq(cartItems.id, id))
      .returning();
    return updatedCartItem;
  }
  
  async deleteCartItem(id: number): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  }
  
  async getCartItemsByCart(cartId: number): Promise<CartItem[]> {
    return db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));
  }
  
  // Settings methods
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }
  
  async createOrUpdateSetting(key: string, value: string): Promise<Setting> {
    const existingSetting = await this.getSetting(key);
    
    if (existingSetting) {
      const [updatedSetting] = await db
        .update(settings)
        .set({
          value,
          updatedAt: new Date()
        })
        .where(eq(settings.key, key))
        .returning();
      return updatedSetting;
    }
    
    const [newSetting] = await db
      .insert(settings)
      .values({
        key,
        value,
        updatedAt: new Date()
      })
      .returning();
    return newSetting;
  }
  
  async getAppSettings(): Promise<Record<string, string>> {
    const allSettings = await db.select().from(settings);
    
    return allSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }
  
  // Seller methods
  async getSellerProfile(id: number): Promise<SellerProfile | undefined> {
    const [profile] = await db.select().from(sellerProfiles).where(eq(sellerProfiles.id, id));
    return profile;
  }
  
  async getSellerProfileByUserId(userId: number): Promise<SellerProfile | undefined> {
    const [profile] = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId));
    return profile;
  }
  
  async createSellerProfile(profile: InsertSellerProfile): Promise<SellerProfile> {
    const [newProfile] = await db
      .insert(sellerProfiles)
      .values({
        ...profile,
        createdAt: new Date()
      })
      .returning();
    return newProfile;
  }
  
  async updateSellerProfile(id: number, profile: Partial<SellerProfile>): Promise<SellerProfile | undefined> {
    const [updatedProfile] = await db
      .update(sellerProfiles)
      .set({
        ...profile,
        updatedAt: new Date()
      })
      .where(eq(sellerProfiles.id, id))
      .returning();
    return updatedProfile;
  }
  
  async deleteSellerProfile(id: number): Promise<boolean> {
    await db.delete(sellerProfiles).where(eq(sellerProfiles.id, id));
    return true;
  }
  
  async getSellerProfiles(status?: string, limit = 100, offset = 0): Promise<SellerProfile[]> {
    let query = db.select().from(sellerProfiles);
    
    if (status) {
      query = query.where(eq(sellerProfiles.status, status));
    }
    
    return query.limit(limit).offset(offset);
  }
  
  // Notification methods
  async createNotification(notification: any): Promise<any> {
    const [newNotification] = await db
      .insert(notifications)
      .values({
        ...notification,
        isRead: false,
        createdAt: new Date()
      })
      .returning();
    return newNotification;
  }
}

export const storage = new DatabaseStorage();
