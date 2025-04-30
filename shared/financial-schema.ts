import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { orders, users } from "./schema";

// ======== Financial System Tables ========

// Commission Transactions table
export const commissionTransactions = pgTable("commission_transactions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  amount: numeric("amount").notNull(),
  rate: numeric("rate").notNull(), // The commission rate at the time of transaction
  status: text("status").default("pending").notNull(), // pending, completed, cancelled
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at")
});

// Seller Payouts table
export const sellerPayouts = pgTable("seller_payouts", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  amount: numeric("amount").notNull(),
  method: text("method").notNull(), // bank_transfer, paypal, etc.
  bankAccount: text("bank_account"),
  bankName: text("bank_name"),
  referenceNumber: text("reference_number"),
  status: text("status").default("pending").notNull(), // pending, processing, completed, failed
  notes: text("notes"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at")
});

// Delivery Company Settlements table
export const deliverySettlements = pgTable("delivery_settlements", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalOrders: integer("total_orders").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  collectedAmount: numeric("collected_amount").notNull(),
  status: text("status").default("pending").notNull(), // pending, reconciling, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  settledAt: timestamp("settled_at")
});

// Delivery Companies table
export const deliveryCompanies = pgTable("delivery_companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  commissionRate: numeric("commission_rate").default("0.05").notNull(), // Default 5%
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Order financial details table
export const orderFinancials = pgTable("order_financials", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().unique(),
  subtotal: numeric("subtotal").notNull(),
  shippingCost: numeric("shipping_cost").notNull(),
  tax: numeric("tax").default("0").notNull(),
  discount: numeric("discount").default("0").notNull(),
  sellerAmount: numeric("seller_amount").notNull(), // Amount due to seller
  platformCommission: numeric("platform_commission").notNull(), // Platform commission
  deliveryFee: numeric("delivery_fee").notNull(), // Delivery company fee
  paymentProcessingFee: numeric("payment_processing_fee").default("0").notNull(),
  netProfit: numeric("net_profit").notNull(), // Platform net profit
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Financial summary reports
export const financialReports = pgTable("financial_reports", {
  id: serial("id").primaryKey(),
  reportType: text("report_type").notNull(), // daily, weekly, monthly, quarterly, yearly
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalSales: numeric("total_sales").notNull(),
  totalCommissions: numeric("total_commissions").notNull(),
  totalDeliveryFees: numeric("total_delivery_fees").notNull(),
  totalRefunds: numeric("total_refunds").default("0").notNull(),
  totalProfit: numeric("total_profit").notNull(),
  detailsJson: json("details_json").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Define relationships for financial tables
export const commissionTransactionsRelations = relations(commissionTransactions, ({ one }) => ({
  order: one(orders, { fields: [commissionTransactions.orderId], references: [orders.id] }),
  seller: one(users, { fields: [commissionTransactions.sellerId], references: [users.id] })
}));

export const sellerPayoutsRelations = relations(sellerPayouts, ({ one }) => ({
  seller: one(users, { fields: [sellerPayouts.sellerId], references: [users.id] })
}));

export const deliverySettlementsRelations = relations(deliverySettlements, ({ one }) => ({
  company: one(deliveryCompanies, { fields: [deliverySettlements.companyId], references: [deliveryCompanies.id] })
}));

export const orderFinancialsRelations = relations(orderFinancials, ({ one }) => ({
  order: one(orders, { fields: [orderFinancials.orderId], references: [orders.id] })
}));

// Create insert schemas
export const insertCommissionTransactionSchema = createInsertSchema(commissionTransactions).omit({ id: true, createdAt: true, processedAt: true });
export const insertSellerPayoutSchema = createInsertSchema(sellerPayouts).omit({ id: true, requestedAt: true, processedAt: true });
export const insertDeliverySettlementSchema = createInsertSchema(deliverySettlements).omit({ id: true, createdAt: true, settledAt: true });
export const insertDeliveryCompanySchema = createInsertSchema(deliveryCompanies).omit({ id: true, createdAt: true });
export const insertOrderFinancialSchema = createInsertSchema(orderFinancials).omit({ id: true, createdAt: true });
export const insertFinancialReportSchema = createInsertSchema(financialReports).omit({ id: true, createdAt: true });

// Define types using z.infer
export type InsertCommissionTransaction = z.infer<typeof insertCommissionTransactionSchema>;
export type InsertSellerPayout = z.infer<typeof insertSellerPayoutSchema>;
export type InsertDeliverySettlement = z.infer<typeof insertDeliverySettlementSchema>;
export type InsertDeliveryCompany = z.infer<typeof insertDeliveryCompanySchema>;
export type InsertOrderFinancial = z.infer<typeof insertOrderFinancialSchema>;
export type InsertFinancialReport = z.infer<typeof insertFinancialReportSchema>;

// Define select types
export type CommissionTransaction = typeof commissionTransactions.$inferSelect;
export type SellerPayout = typeof sellerPayouts.$inferSelect;
export type DeliverySettlement = typeof deliverySettlements.$inferSelect;
export type DeliveryCompany = typeof deliveryCompanies.$inferSelect;
export type OrderFinancial = typeof orderFinancials.$inferSelect;
export type FinancialReport = typeof financialReports.$inferSelect;