import { pgTable, text, serial, integer, boolean, timestamp, numeric, json, pgEnum, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enum for packaging quality status
export const packagingStatusEnum = pgEnum("packaging_status", [
  "pending", 
  "packed", 
  "verified_by_seller", 
  "picked_up", 
  "in_transit", 
  "delivered", 
  "confirmed", 
  "rejected"
]);

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
  businessType: text("business_type").notNull(),
  taxId: text("tax_id").notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  logo: text("logo"),
  bannerImage: text("banner_image"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  address: text("address").notNull(),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  statusReason: text("status_reason"), // Reason for rejection or approval notes
  isVerified: boolean("is_verified").default(false).notNull(),
  commissionRate: numeric("commission_rate").default("0.10").notNull(), // Default 10%
  balance: numeric("balance").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
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
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Email Templates table
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  subject: text("subject").notNull(),
  subjectAr: text("subject_ar"),
  bodyHtml: text("body_html").notNull(),
  bodyHtmlAr: text("body_html_ar"),
  description: text("description"),
  variables: text("variables").array(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Admin activation codes table
export const adminActivationCodes = pgTable("admin_activation_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  isValid: boolean("is_valid").default(true).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedBy: text("used_by"),
  usedAt: timestamp("used_at"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Define relations between tables

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
export const insertSettingSchema = createInsertSchema(settings).omit({ id: true, updatedAt: true, createdAt: true });
export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSellerProfileSchema = createInsertSchema(sellerProfiles).omit({ id: true, createdAt: true, updatedAt: true, status: true, statusReason: true, isVerified: true, commissionRate: true, balance: true });
export const insertAdminActivationCodeSchema = createInsertSchema(adminActivationCodes).omit({ id: true, createdAt: true });

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
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type InsertSellerProfile = z.infer<typeof insertSellerProfileSchema>;
export type InsertAdminActivationCode = z.infer<typeof insertAdminActivationCodeSchema>;

// Loyalty points table
export const loyaltyPoints = pgTable("loyalty_points", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  points: integer("points").notNull(),
  balance: integer("balance").notNull(), // Current available balance
  lifetimePoints: integer("lifetime_points").notNull(), // Total earned points
  tier: text("tier").default("bronze").notNull(), // bronze, silver, gold, platinum
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

// Loyalty points transactions table
export const loyaltyTransactions = pgTable("loyalty_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // earn, redeem, expire, adjust
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  orderId: integer("order_id"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Loyalty rewards table
export const loyaltyRewards = pgTable("loyalty_rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  pointsCost: integer("points_cost").notNull(),
  type: text("type").notNull(), // discount, free_product, free_shipping
  discount: numeric("discount"), // Discount amount or percentage
  productId: integer("product_id"), // For free product rewards
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

// Packaging QR Codes table
export const packagingQrCodes = pgTable("packaging_qr_codes", {
  id: serial("id").primaryKey(),
  qrId: uuid("qr_id").notNull().unique(), // Unique identifier for the QR code
  orderId: integer("order_id").notNull(),
  orderItemId: integer("order_item_id").notNull(),
  status: packagingStatusEnum("status").default("pending").notNull(),
  qrContent: json("qr_content").notNull(), // Contains all product details
  qrImageUrl: text("qr_image_url"), // URL to the generated QR code image
  isVerified: boolean("is_verified").default(false).notNull(),
  isScanned: boolean("is_scanned").default(false),
  scannedAt: timestamp("scanned_at"),
  scannedBy: text("scanned_by"), // Who scanned: seller, shipping, customer
  scannedLocation: text("scanned_location"), // GPS location where scanned
  isCompromised: boolean("is_compromised").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

// Packaging Verification table
export const packagingVerifications = pgTable("packaging_verifications", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").notNull(),
  verifierType: text("verifier_type").notNull(), // seller, shipping_company, customer
  verifierId: integer("verifier_id").notNull(), // userId or shipping company id
  status: text("status").notNull(), // approved, rejected
  notes: text("notes"),
  evidenceType: text("evidence_type").notNull(), // image, video
  evidenceUrl: text("evidence_url").notNull(), // URL to the evidence
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Packaging Templates table
export const packagingTemplates = pgTable("packaging_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  categoryId: integer("category_id").notNull(), // Which product categories this applies to
  instructionsUrl: text("instructions_url").notNull(), // URL to PDF or video instructions
  materialRequirements: json("material_requirements").notNull(), // Required packaging materials
  qrPlacementInstructions: text("qr_placement_instructions").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

// Shipping Companies table
export const shippingCompanies = pgTable("shipping_companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  apiKey: text("api_key"),
  apiUrl: text("api_url"),
  isActive: boolean("is_active").default(true).notNull(),
  packagingVerificationRequired: boolean("packaging_verification_required").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Shipping Options table
export const shippingOptions = pgTable("shipping_options", {
  id: serial("id").primaryKey(),
  shippingCompanyId: integer("shipping_company_id").notNull(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  price: numeric("price").notNull(),
  deliveryTimeMinDays: integer("delivery_time_min_days").notNull(),
  deliveryTimeMaxDays: integer("delivery_time_max_days").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

// Packaging Quality Metrics table
export const packagingQualityMetrics = pgTable("packaging_quality_metrics", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  totalPackages: integer("total_packages").default(0).notNull(),
  packagesFlagged: integer("packages_flagged").default(0).notNull(),
  averageRating: numeric("average_rating").default("0").notNull(),
  complianceScore: numeric("compliance_score").default("100").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
});

// Packaging Incidents table
export const packagingIncidents = pgTable("packaging_incidents", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").notNull(),
  reportedBy: text("reported_by").notNull(), // shipping_company, customer
  reporterId: integer("reporter_id").notNull(),
  incidentType: text("incident_type").notNull(), // damaged, tampered, wrong_product
  description: text("description").notNull(),
  evidenceUrls: text("evidence_urls").array(), // URLs to images/videos of the incident
  status: text("status").default("pending").notNull(), // pending, investigating, resolved
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at")
});

// Redemptions table
export const redemptions = pgTable("redemptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rewardId: integer("reward_id").notNull(),
  pointsUsed: integer("points_used").notNull(),
  code: text("code").notNull(),
  status: text("status").default("active").notNull(), // active, used, expired
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"),
  orderId: integer("order_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Define relations for loyalty tables
export const loyaltyPointsRelations = relations(loyaltyPoints, ({ one, many }) => ({
  user: one(users, { fields: [loyaltyPoints.userId], references: [users.id] }),
  transactions: many(loyaltyTransactions)
}));

export const loyaltyTransactionsRelations = relations(loyaltyTransactions, ({ one }) => ({
  user: one(users, { fields: [loyaltyTransactions.userId], references: [users.id] }),
  loyaltyAccount: one(loyaltyPoints, { fields: [loyaltyTransactions.userId], references: [loyaltyPoints.userId] }),
  order: one(orders, { fields: [loyaltyTransactions.orderId], references: [orders.id] })
}));

export const loyaltyRewardsRelations = relations(loyaltyRewards, ({ one, many }) => ({
  product: one(products, { fields: [loyaltyRewards.productId], references: [products.id] }),
  redemptions: many(redemptions)
}));

export const redemptionsRelations = relations(redemptions, ({ one }) => ({
  user: one(users, { fields: [redemptions.userId], references: [users.id] }),
  reward: one(loyaltyRewards, { fields: [redemptions.rewardId], references: [loyaltyRewards.id] }),
  order: one(orders, { fields: [redemptions.orderId], references: [orders.id] })
}));

// Define relations for packaging tables
export const packagingQrCodesRelations = relations(packagingQrCodes, ({ one, many }) => ({
  order: one(orders, { fields: [packagingQrCodes.orderId], references: [orders.id] }),
  orderItem: one(orderItems, { fields: [packagingQrCodes.orderItemId], references: [orderItems.id] }),
  verifications: many(packagingVerifications)
}));

export const packagingVerificationsRelations = relations(packagingVerifications, ({ one }) => ({
  qrCode: one(packagingQrCodes, { fields: [packagingVerifications.qrCodeId], references: [packagingQrCodes.id] })
}));

export const packagingTemplatesRelations = relations(packagingTemplates, ({ one }) => ({
  category: one(categories, { fields: [packagingTemplates.categoryId], references: [categories.id] })
}));

export const packagingQualityMetricsRelations = relations(packagingQualityMetrics, ({ one }) => ({
  seller: one(users, { fields: [packagingQualityMetrics.sellerId], references: [users.id] })
}));

export const packagingIncidentsRelations = relations(packagingIncidents, ({ one }) => ({
  qrCode: one(packagingQrCodes, { fields: [packagingIncidents.qrCodeId], references: [packagingQrCodes.id] })
}));

// Define relations for shipping options with shipping companies
export const shippingOptionsRelations = relations(shippingOptions, ({ one }) => ({
  shippingCompany: one(shippingCompanies, { fields: [shippingOptions.shippingCompanyId], references: [shippingCompanies.id] })
}));

// Update user relations to include loyalty
export const usersRelations = relations(users, ({ many, one }) => ({
  orders: many(orders),
  cart: one(carts, { fields: [users.id], references: [carts.userId] }),
  reviews: many(reviews),
  addresses: many(addresses),
  notifications: many(notifications),
  sellerProfile: one(sellerProfiles, { fields: [users.id], references: [sellerProfiles.userId] }),
  loyaltyAccount: one(loyaltyPoints, { fields: [users.id], references: [loyaltyPoints.userId] }),
  loyaltyTransactions: many(loyaltyTransactions),
  redemptions: many(redemptions)
}));

// Add insert schemas for loyalty
export const insertLoyaltyPointsSchema = createInsertSchema(loyaltyPoints).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLoyaltyTransactionSchema = createInsertSchema(loyaltyTransactions).omit({ id: true, createdAt: true });
export const insertLoyaltyRewardSchema = createInsertSchema(loyaltyRewards).omit({ id: true, createdAt: true });
export const insertRedemptionSchema = createInsertSchema(redemptions).omit({ id: true, createdAt: true });

// Add insert schemas for packaging
export const insertPackagingQrCodeSchema = createInsertSchema(packagingQrCodes).omit({ id: true, createdAt: true, updatedAt: true, isVerified: true, isScanned: true, scannedAt: true, scannedBy: true, scannedLocation: true, isCompromised: true });
export const insertPackagingVerificationSchema = createInsertSchema(packagingVerifications).omit({ id: true, createdAt: true });
export const insertPackagingTemplateSchema = createInsertSchema(packagingTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export const insertShippingCompanySchema = createInsertSchema(shippingCompanies).omit({ id: true, createdAt: true });
export const insertShippingOptionSchema = createInsertSchema(shippingOptions).omit({ id: true, createdAt: true });
export const insertPackagingIncidentSchema = createInsertSchema(packagingIncidents).omit({ id: true, createdAt: true, resolvedAt: true });

// Add types for loyalty
export type InsertLoyaltyPoints = z.infer<typeof insertLoyaltyPointsSchema>;
export type InsertLoyaltyTransaction = z.infer<typeof insertLoyaltyTransactionSchema>;
export type InsertLoyaltyReward = z.infer<typeof insertLoyaltyRewardSchema>;
export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;

// Add types for packaging
export type InsertPackagingQrCode = z.infer<typeof insertPackagingQrCodeSchema>;
export type InsertPackagingVerification = z.infer<typeof insertPackagingVerificationSchema>;
export type InsertPackagingTemplate = z.infer<typeof insertPackagingTemplateSchema>;
export type InsertShippingCompany = z.infer<typeof insertShippingCompanySchema>;
export type InsertShippingOption = z.infer<typeof insertShippingOptionSchema>;
export type InsertPackagingIncident = z.infer<typeof insertPackagingIncidentSchema>;

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
export type SellerProfile = typeof sellerProfiles.$inferSelect;
export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;
export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type Redemption = typeof redemptions.$inferSelect;
export type PackagingQrCode = typeof packagingQrCodes.$inferSelect;
export type PackagingVerification = typeof packagingVerifications.$inferSelect;
export type PackagingTemplate = typeof packagingTemplates.$inferSelect;
export type ShippingCompany = typeof shippingCompanies.$inferSelect;
export type ShippingOption = typeof shippingOptions.$inferSelect;
export type PackagingQualityMetric = typeof packagingQualityMetrics.$inferSelect;
export type PackagingIncident = typeof packagingIncidents.$inferSelect;
