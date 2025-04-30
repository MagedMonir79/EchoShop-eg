import { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { adminActivationCodes, users } from "@shared/schema";
import { v4 as uuid } from "uuid";
import { add } from "date-fns";
import { eq } from "drizzle-orm";

// Middleware للتأكد من أن المستخدم مدير
export const isAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "الرجاء تسجيل الدخول أولاً" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "غير مصرح بهذه العملية" });
  }

  next();
};

// إنشاء رمز تفعيل جديد للمدير
export const generateAdminActivationCode = async (req: Request, res: Response) => {
  try {
    const expirationDays = req.body.expiration || 7; // عدد أيام صلاحية الرمز
    
    // إنشاء رمز عشوائي من 8 أحرف
    const code = uuid().substring(0, 8).toUpperCase();
    
    // تاريخ انتهاء الصلاحية
    const expiresAt = add(new Date(), { days: expirationDays });
    
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
    
  } catch (error: any) {
    console.error("Error generating admin activation code:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء إنشاء رمز التفعيل",
      error: error.message
    });
  }
};

// الحصول على جميع رموز التفعيل الصالحة
export const getValidActivationCodes = async (req: Request, res: Response) => {
  try {
    const codes = await db.select().from(adminActivationCodes)
      .where(eq(adminActivationCodes.isValid, true))
      .orderBy(adminActivationCodes.createdAt);
    
    res.status(200).json({
      success: true,
      data: codes,
      message: `تم العثور على ${codes.length} رمز تفعيل صالح`
    });
    
  } catch (error: any) {
    console.error("Error fetching admin activation codes:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء استرجاع رموز التفعيل",
      error: error.message
    });
  }
};

// إلغاء صلاحية رمز تفعيل
export const invalidateActivationCode = async (req: Request, res: Response) => {
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
    
  } catch (error: any) {
    console.error("Error invalidating admin activation code:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء إلغاء صلاحية رمز التفعيل",
      error: error.message
    });
  }
};

// التحقق من صلاحية رمز التفعيل
export const verifyActivationCode = async (code: string): Promise<boolean> => {
  try {
    const [activationCode] = await db.select()
      .from(adminActivationCodes)
      .where(eq(adminActivationCodes.code, code))
      .limit(1);
    
    if (!activationCode) {
      return false;
    }
    
    // التحقق من صلاحية الرمز والتاريخ
    const isValid = activationCode.isValid && new Date(activationCode.expiresAt) > new Date();
    
    return isValid;
    
  } catch (error) {
    console.error("Error verifying admin activation code:", error);
    return false;
  }
};

// إنشاء رمز تفعيل أولي للمدير (يستخدم بواسطة المطور فقط)
export const createInitialAdminCode = async (req: Request, res: Response) => {
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
};