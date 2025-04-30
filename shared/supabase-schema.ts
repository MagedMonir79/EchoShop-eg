import { pgTable, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// جدول المستخدمين
export const users = pgTable('users', {
  id: integer('id').primaryKey().notNull(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  full_name: text('full_name'),
  role: text('role').notNull().default('customer'),
  profile_image: text('profile_image'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  settings: jsonb('settings').default({})
});

// جدول ملفات تعريف البائعين
export const sellerProfiles = pgTable('seller_profiles', {
  id: integer('id').primaryKey().notNull(),
  user_id: integer('user_id').notNull().references(() => users.id),
  store_name: text('store_name').notNull(),
  store_description: text('store_description'),
  contact_email: text('contact_email').notNull(),
  contact_phone: text('contact_phone'),
  store_logo: text('store_logo'),
  status: text('status').notNull().default('pending'), // pending, approved, rejected
  created_at: timestamp('created_at').notNull().defaultNow(),
  approved_at: timestamp('approved_at'),
  commission_rate: integer('commission_rate').default(10), // نسبة العمولة (%)
  settings: jsonb('settings').default({})
});

// زود المخططات للإدخال
export const insertUserSchema = createInsertSchema(users)
  .extend({
    password: z.string().min(8, 'كلمة المرور يجب أن تكون على الأقل 8 أحرف')
      .regex(/[A-Z]/, 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل')
      .regex(/[a-z]/, 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل')
      .regex(/[0-9]/, 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل'),
    confirmPassword: z.string(),
    email: z.string().email('يرجى إدخال بريد إلكتروني صالح'),
    username: z.string().min(3, 'اسم المستخدم يجب أن يكون على الأقل 3 أحرف')
      .max(20, 'اسم المستخدم يجب ألا يتجاوز 20 حرفاً')
      .regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام وشرطات سفلية فقط')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });

export const insertSellerProfileSchema = createInsertSchema(sellerProfiles)
  .extend({
    store_name: z.string().min(3, 'اسم المتجر يجب أن يكون على الأقل 3 أحرف').max(50, 'اسم المتجر يجب ألا يتجاوز 50 حرفاً'),
    contact_email: z.string().email('يرجى إدخال بريد إلكتروني صالح'),
    contact_phone: z.string().min(10, 'رقم الهاتف يجب أن يكون على الأقل 10 أرقام').max(15, 'رقم الهاتف يجب ألا يتجاوز 15 رقماً')
  });

// أنواع الإدخال
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSellerProfile = z.infer<typeof insertSellerProfileSchema>;

// أنواع الاختيار
export type User = typeof users.$inferSelect;
export type SellerProfile = typeof sellerProfiles.$inferSelect;

// مخططات المصادقة
export const loginSchema = z.object({
  email: z.string().min(3, 'يرجى إدخال بريد إلكتروني أو اسم مستخدم صالح'),
  password: z.string().min(1, 'يرجى إدخال كلمة المرور')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صالح')
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'كلمة المرور يجب أن تكون على الأقل 8 أحرف')
    .regex(/[A-Z]/, 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل')
    .regex(/[a-z]/, 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل')
    .regex(/[0-9]/, 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;