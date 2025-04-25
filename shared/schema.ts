import { pgTable, text, serial, integer, boolean, timestamp, numeric, json, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").default("customer").notNull(), // customer, seller, admin
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  settings: json("settings").default({}).notNull()
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  price: numeric("price").notNull(),
  discountedPrice: numeric("discounted_price"),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  supplierId: integer("supplier_id"),
  inventory: integer("inventory").default(0).notNull(),
  rating: numeric("rating").default("0"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  imageUrl: text("image_url"),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").default("pending").notNull(), // pending, processing, shipped, delivered, cancelled
  total: numeric("total").notNull(),
  address: text("address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Cart table
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  website: text("website"),
  apiKey: text("api_key"),
  apiUrl: text("api_url"),
  marginRate: numeric("margin_rate").default("0.15").notNull(), // Default 15%
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Product images table
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Product attributes table
export const productAttributes = pgTable("product_attributes", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  value: text("value").notNull(),
  valueAr: text("value_ar"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Seller profiles table
export const sellerProfiles = pgTable("seller_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  storeName: text("store_name").notNull(),
  storeNameAr: text("store_name_ar"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  logo: text("logo"),
  bannerImage: text("banner_image"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  address: text("address"),
  isVerified: boolean("is_verified").default(false).notNull(),
  commissionRate: numeric("commission_rate").default("0.10").notNull(), // Default 10%
  balance: numeric("balance").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Supplier product feeds table
export const supplierProductFeeds = pgTable("supplier_product_feeds", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull(),
  externalProductId: text("external_product_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category"),
  inventory: integer("inventory").default(0).notNull(),
  importedToProduct: boolean("imported_to_product").default(false).notNull(),
  productId: integer("product_id"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Supplier shipping methods table
export const supplierShippingMethods = pgTable("supplier_shipping_methods", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  price: numeric("price").notNull(),
  deliveryTimeMinDays: integer("delivery_time_min_days").notNull(),
  deliveryTimeMaxDays: integer("delivery_time_max_days").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Coupons table
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // percentage, fixed
  value: numeric("value").notNull(),
  minimumPurchase: numeric("minimum_purchase").default("0").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  usageLimit: integer("usage_limit").notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Addresses table
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  phoneNumber: text("phone_number").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // order, product, system
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  resourceId: integer("resource_id"), // e.g., orderId or productId
  resourceType: text("resource_type"), // e.g., "order" or "product"
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Wishlists table
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Wishlist items table
export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  wishlistId: integer("wishlist_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Analytics events table
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  eventType: text("event_type").notNull(), // page_view, add_to_cart, purchase, etc.
  resourceId: integer("resource_id"), // e.g., productId
  resourceType: text("resource_type"), // e.g., "product"
  metadata: json("metadata").default({}),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Define relations between tables
export const usersRelations = relations(users, ({ many, one }) => ({
  orders: many(orders),
  cart: one(carts, { fields: [users.id], references: [carts.userId] }),
  reviews: many(reviews),
  addresses: many(addresses),
  notifications: many(notifications),
  sellerProfile: one(sellerProfiles, { fields: [users.id], references: [sellerProfiles.userId] })
}));

export const productsRelations = relations(products, ({ many, one }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  seller: one(users, { fields: [products.sellerId], references: [users.id] }),
  supplier: one(suppliers, { fields: [products.supplierId], references: [suppliers.id] }),
  reviews: many(reviews),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
  images: many(productImages),
  attributes: many(productAttributes)
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parentCategory: one(categories, { fields: [categories.parentId], references: [categories.id] }),
  subCategories: many(categories, { relationName: 'subCategories' })
}));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] })
}));

export const cartsRelations = relations(carts, ({ many, one }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  items: many(cartItems)
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] })
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] })
}));

export const sellerProfilesRelations = relations(sellerProfiles, ({ one }) => ({
  user: one(users, { fields: [sellerProfiles.userId], references: [users.id] })
}));

export const supplierProductFeedsRelations = relations(supplierProductFeeds, ({ one }) => ({
  supplier: one(suppliers, { fields: [supplierProductFeeds.supplierId], references: [suppliers.id] }),
  product: one(products, { fields: [supplierProductFeeds.productId], references: [products.id] })
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
  items: many(wishlistItems)
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlists, { fields: [wishlistItems.wishlistId], references: [wishlists.id] }),
  product: one(products, { fields: [wishlistItems.productId], references: [products.id] })
}));

// Define insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, settings: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true, createdAt: true });
export const insertCartSchema = createInsertSchema(carts).omit({ id: true, createdAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true });
export const insertSettingSchema = createInsertSchema(settings).omit({ id: true, updatedAt: true });

// Define types using z.infer
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

// Define select types
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type Setting = typeof settings.$inferSelect;
