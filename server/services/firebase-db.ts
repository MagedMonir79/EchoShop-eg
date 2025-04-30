import { IStorage } from "../storage";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert } from "firebase-admin/app";
import type { 
  User, InsertUser,
  SellerProfile, InsertSellerProfile,
  Product, InsertProduct,
  Category, InsertCategory,
  Supplier, InsertSupplier,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Cart, InsertCart,
  CartItem, InsertCartItem,
  Setting
} from "@shared/schema";

// التحقق من وجود المتغيرات البيئية المطلوبة
const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;

// تهيئة Firebase Admin SDK
if (!initializeApp.length) {
  initializeApp({
    projectId: PROJECT_ID,
  });
}

const db = getFirestore();

export class FirebaseStorage implements IStorage {
  // === وظائف المستخدمين ===
  
  async getUser(id: number): Promise<User | undefined> {
    try {
      const userDoc = await db.collection('users').doc(id.toString()).get();
      if (!userDoc.exists) return undefined;
      
      const userData = userDoc.data();
      return {
        id,
        username: userData?.username || '',
        email: userData?.email || '',
        password: userData?.password || '', // ملاحظة: لن يتم تخزين كلمات المرور بهذه الطريقة في Firebase
        role: userData?.role || 'customer',
        createdAt: userData?.createdAt?.toDate() || new Date(),
        updatedAt: userData?.updatedAt?.toDate() || new Date(),
        isActive: userData?.isActive || true,
        fullName: userData?.fullName || '',
        address: userData?.address || '',
        phone: userData?.phone || '',
        profilePicture: userData?.profilePicture || '',
      };
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const usersSnapshot = await db.collection('users')
        .where('username', '==', username)
        .limit(1)
        .get();
      
      if (usersSnapshot.empty) return undefined;
      
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      
      return {
        id: parseInt(userDoc.id),
        username: userData.username || '',
        email: userData.email || '',
        password: userData.password || '',
        role: userData.role || 'customer',
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
        isActive: userData.isActive || true,
        fullName: userData.fullName || '',
        address: userData.address || '',
        phone: userData.phone || '',
        profilePicture: userData.profilePicture || '',
      };
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const usersSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (usersSnapshot.empty) return undefined;
      
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      
      return {
        id: parseInt(userDoc.id),
        username: userData.username || '',
        email: userData.email || '',
        password: userData.password || '',
        role: userData.role || 'customer',
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
        isActive: userData.isActive || true,
        fullName: userData.fullName || '',
        address: userData.address || '',
        phone: userData.phone || '',
        profilePicture: userData.profilePicture || '',
      };
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('users').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث عداد المستخدمين
      await db.collection('counters').doc('users').set({ lastId });
      
      // إنشاء المستخدم
      const now = new Date();
      const userData = {
        ...user,
        createdAt: now,
        updatedAt: now,
        isActive: true
      };
      
      await db.collection('users').doc(lastId.toString()).set(userData);
      
      return {
        id: lastId,
        ...userData,
        createdAt: now,
        updatedAt: now
      } as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const userRef = db.collection('users').doc(id.toString());
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) return undefined;
      
      const updatedData = {
        ...userData,
        updatedAt: new Date()
      };
      
      await userRef.update(updatedData);
      
      const updatedUserDoc = await userRef.get();
      const updatedUserData = updatedUserDoc.data();
      
      return {
        id,
        ...updatedUserData,
        createdAt: updatedUserData?.createdAt?.toDate() || new Date(),
        updatedAt: updatedUserData?.updatedAt?.toDate() || new Date()
      } as User;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const userRef = db.collection('users').doc(id.toString());
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) return false;
      
      await userRef.delete();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  async getAllUsers(limit = 100, offset = 0): Promise<User[]> {
    try {
      const usersSnapshot = await db.collection('users')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      return usersSnapshot.docs.map(doc => {
        const userData = doc.data();
        return {
          id: parseInt(doc.id),
          username: userData.username || '',
          email: userData.email || '',
          password: userData.password || '',
          role: userData.role || 'customer',
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
          isActive: userData.isActive || true,
          fullName: userData.fullName || '',
          address: userData.address || '',
          phone: userData.phone || '',
          profilePicture: userData.profilePicture || ''
        } as User;
      });
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  async getUserCount(): Promise<number> {
    try {
      const countSnapshot = await db.collection('users').count().get();
      return countSnapshot.data().count;
    } catch (error) {
      console.error("Error getting user count:", error);
      return 0;
    }
  }

  // === وظائف البائعين ===
  
  async getSellerProfile(id: number): Promise<SellerProfile | undefined> {
    try {
      const sellerDoc = await db.collection('sellerProfiles').doc(id.toString()).get();
      if (!sellerDoc.exists) return undefined;
      
      const sellerData = sellerDoc.data();
      return {
        id,
        userId: sellerData?.userId || 0,
        companyName: sellerData?.companyName || '',
        companyLogo: sellerData?.companyLogo || '',
        companyDescription: sellerData?.companyDescription || '',
        contactEmail: sellerData?.contactEmail || '',
        contactPhone: sellerData?.contactPhone || '',
        address: sellerData?.address || '',
        status: sellerData?.status || 'pending',
        commissionRate: sellerData?.commissionRate || 0,
        taxId: sellerData?.taxId || '',
        bankAccount: sellerData?.bankAccount || '',
        createdAt: sellerData?.createdAt?.toDate() || new Date(),
        approvedAt: sellerData?.approvedAt?.toDate() || null,
        documents: sellerData?.documents || []
      };
    } catch (error) {
      console.error("Error getting seller profile:", error);
      return undefined;
    }
  }

  async getSellerProfileByUserId(userId: number): Promise<SellerProfile | undefined> {
    try {
      const sellersSnapshot = await db.collection('sellerProfiles')
        .where('userId', '==', userId)
        .limit(1)
        .get();
      
      if (sellersSnapshot.empty) return undefined;
      
      const sellerDoc = sellersSnapshot.docs[0];
      const sellerData = sellerDoc.data();
      
      return {
        id: parseInt(sellerDoc.id),
        userId: sellerData.userId || 0,
        companyName: sellerData.companyName || '',
        companyLogo: sellerData.companyLogo || '',
        companyDescription: sellerData.companyDescription || '',
        contactEmail: sellerData.contactEmail || '',
        contactPhone: sellerData.contactPhone || '',
        address: sellerData.address || '',
        status: sellerData.status || 'pending',
        commissionRate: sellerData.commissionRate || 0,
        taxId: sellerData.taxId || '',
        bankAccount: sellerData.bankAccount || '',
        createdAt: sellerData.createdAt?.toDate() || new Date(),
        approvedAt: sellerData.approvedAt?.toDate() || null,
        documents: sellerData.documents || []
      };
    } catch (error) {
      console.error("Error getting seller profile by user ID:", error);
      return undefined;
    }
  }

  async createSellerProfile(profile: InsertSellerProfile): Promise<SellerProfile> {
    try {
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('sellerProfiles').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث العداد
      await db.collection('counters').doc('sellerProfiles').set({ lastId });
      
      // إنشاء ملف تعريف البائع
      const now = new Date();
      const sellerData = {
        ...profile,
        createdAt: now,
        status: 'pending',
      };
      
      await db.collection('sellerProfiles').doc(lastId.toString()).set(sellerData);
      
      // إرسال إشعار للمشرف
      await this.createNotification({
        type: 'NEW_SELLER',
        title: 'طلب بائع جديد',
        message: `تم تقديم طلب بائع جديد من قبل المستخدم ${profile.userId}`,
        recipientRole: 'admin',
        createdAt: now
      });
      
      return {
        id: lastId,
        ...sellerData,
        createdAt: now,
        approvedAt: null,
        documents: profile.documents || []
      } as SellerProfile;
    } catch (error) {
      console.error("Error creating seller profile:", error);
      throw error;
    }
  }

  async updateSellerProfile(id: number, profile: Partial<SellerProfile>): Promise<SellerProfile | undefined> {
    try {
      const sellerRef = db.collection('sellerProfiles').doc(id.toString());
      const sellerDoc = await sellerRef.get();
      
      if (!sellerDoc.exists) return undefined;
      
      await sellerRef.update({
        ...profile,
        updatedAt: new Date()
      });
      
      const updatedSellerDoc = await sellerRef.get();
      const updatedSellerData = updatedSellerDoc.data();
      
      return {
        id,
        ...updatedSellerData,
        createdAt: updatedSellerData?.createdAt?.toDate() || new Date(),
        approvedAt: updatedSellerData?.approvedAt?.toDate() || null
      } as SellerProfile;
    } catch (error) {
      console.error("Error updating seller profile:", error);
      return undefined;
    }
  }

  async deleteSellerProfile(id: number): Promise<boolean> {
    try {
      const sellerRef = db.collection('sellerProfiles').doc(id.toString());
      const sellerDoc = await sellerRef.get();
      
      if (!sellerDoc.exists) return false;
      
      await sellerRef.delete();
      return true;
    } catch (error) {
      console.error("Error deleting seller profile:", error);
      return false;
    }
  }

  async getSellerProfiles(status?: string, limit = 100, offset = 0): Promise<SellerProfile[]> {
    try {
      let query = db.collection('sellerProfiles');
      
      if (status) {
        query = query.where('status', '==', status);
      }
      
      const sellersSnapshot = await query
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      return sellersSnapshot.docs.map(doc => {
        const sellerData = doc.data();
        return {
          id: parseInt(doc.id),
          userId: sellerData.userId || 0,
          companyName: sellerData.companyName || '',
          companyLogo: sellerData.companyLogo || '',
          companyDescription: sellerData.companyDescription || '',
          contactEmail: sellerData.contactEmail || '',
          contactPhone: sellerData.contactPhone || '',
          address: sellerData.address || '',
          status: sellerData.status || 'pending',
          commissionRate: sellerData.commissionRate || 0,
          taxId: sellerData.taxId || '',
          bankAccount: sellerData.bankAccount || '',
          createdAt: sellerData.createdAt?.toDate() || new Date(),
          approvedAt: sellerData.approvedAt?.toDate() || null,
          documents: sellerData.documents || []
        } as SellerProfile;
      });
    } catch (error) {
      console.error("Error getting seller profiles:", error);
      return [];
    }
  }

  // === وظائف الإشعارات ===
  
  async createNotification(notification: any): Promise<any> {
    try {
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('notifications').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث العداد
      await db.collection('counters').doc('notifications').set({ lastId });
      
      // إنشاء الإشعار
      const now = new Date();
      const notificationData = {
        ...notification,
        createdAt: now,
        read: false
      };
      
      await db.collection('notifications').doc(lastId.toString()).set(notificationData);
      
      return {
        id: lastId,
        ...notificationData
      };
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // === وظائف المنتجات ===

  async getProduct(id: number): Promise<Product | undefined> {
    try {
      const productDoc = await db.collection('products').doc(id.toString()).get();
      if (!productDoc.exists) return undefined;
      
      const productData = productDoc.data();
      return {
        id,
        name: productData?.name || '',
        description: productData?.description || '',
        price: productData?.price || 0,
        compareAtPrice: productData?.compareAtPrice || null,
        images: productData?.images || [],
        categoryId: productData?.categoryId || 0,
        sellerId: productData?.sellerId || 0,
        supplierId: productData?.supplierId || 0,
        status: productData?.status || 'draft',
        inventory: productData?.inventory || 0,
        sku: productData?.sku || '',
        barcode: productData?.barcode || '',
        weight: productData?.weight || 0,
        weightUnit: productData?.weightUnit || 'kg',
        dimensions: productData?.dimensions || { length: 0, width: 0, height: 0 },
        dimensionUnit: productData?.dimensionUnit || 'cm',
        variants: productData?.variants || [],
        options: productData?.options || [],
        tags: productData?.tags || [],
        createdAt: productData?.createdAt?.toDate() || new Date(),
        updatedAt: productData?.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error("Error getting product:", error);
      return undefined;
    }
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    try {
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('products').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث العداد
      await db.collection('counters').doc('products').set({ lastId });
      
      // إنشاء المنتج
      const now = new Date();
      const productData = {
        ...product,
        createdAt: now,
        updatedAt: now
      };
      
      await db.collection('products').doc(lastId.toString()).set(productData);
      
      return {
        id: lastId,
        ...productData,
        createdAt: now,
        updatedAt: now
      } as Product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const productRef = db.collection('products').doc(id.toString());
      const productDoc = await productRef.get();
      
      if (!productDoc.exists) return undefined;
      
      const updatedData = {
        ...productData,
        updatedAt: new Date()
      };
      
      await productRef.update(updatedData);
      
      const updatedProductDoc = await productRef.get();
      const updatedProductData = updatedProductDoc.data();
      
      return {
        id,
        ...updatedProductData,
        createdAt: updatedProductData?.createdAt?.toDate() || new Date(),
        updatedAt: updatedProductData?.updatedAt?.toDate() || new Date()
      } as Product;
    } catch (error) {
      console.error("Error updating product:", error);
      return undefined;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const productRef = db.collection('products').doc(id.toString());
      const productDoc = await productRef.get();
      
      if (!productDoc.exists) return false;
      
      await productRef.delete();
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }

  async getAllProducts(limit = 100, offset = 0): Promise<Product[]> {
    try {
      const productsSnapshot = await db.collection('products')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      return productsSnapshot.docs.map(doc => {
        const productData = doc.data();
        return {
          id: parseInt(doc.id),
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || 0,
          compareAtPrice: productData.compareAtPrice || null,
          images: productData.images || [],
          categoryId: productData.categoryId || 0,
          sellerId: productData.sellerId || 0,
          supplierId: productData.supplierId || 0,
          status: productData.status || 'draft',
          inventory: productData.inventory || 0,
          sku: productData.sku || '',
          barcode: productData.barcode || '',
          weight: productData.weight || 0,
          weightUnit: productData.weightUnit || 'kg',
          dimensions: productData.dimensions || { length: 0, width: 0, height: 0 },
          dimensionUnit: productData.dimensionUnit || 'cm',
          variants: productData.variants || [],
          options: productData.options || [],
          tags: productData.tags || [],
          createdAt: productData.createdAt?.toDate() || new Date(),
          updatedAt: productData.updatedAt?.toDate() || new Date()
        } as Product;
      });
    } catch (error) {
      console.error("Error getting all products:", error);
      return [];
    }
  }

  // تنفيذ باقي الوظائف المطلوبة بنفس النمط
  
  async getProductsByCategory(categoryId: number, limit = 100, offset = 0): Promise<Product[]> {
    try {
      const productsSnapshot = await db.collection('products')
        .where('categoryId', '==', categoryId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      return productsSnapshot.docs.map(doc => {
        const productData = doc.data();
        return {
          id: parseInt(doc.id),
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || 0,
          compareAtPrice: productData.compareAtPrice || null,
          images: productData.images || [],
          categoryId: productData.categoryId || 0,
          sellerId: productData.sellerId || 0,
          supplierId: productData.supplierId || 0,
          status: productData.status || 'draft',
          inventory: productData.inventory || 0,
          sku: productData.sku || '',
          barcode: productData.barcode || '',
          weight: productData.weight || 0,
          weightUnit: productData.weightUnit || 'kg',
          dimensions: productData.dimensions || { length: 0, width: 0, height: 0 },
          dimensionUnit: productData.dimensionUnit || 'cm',
          variants: productData.variants || [],
          options: productData.options || [],
          tags: productData.tags || [],
          createdAt: productData.createdAt?.toDate() || new Date(),
          updatedAt: productData.updatedAt?.toDate() || new Date()
        } as Product;
      });
    } catch (error) {
      console.error("Error getting products by category:", error);
      return [];
    }
  }

  async getProductsBySeller(sellerId: number, limit = 100, offset = 0): Promise<Product[]> {
    try {
      const productsSnapshot = await db.collection('products')
        .where('sellerId', '==', sellerId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      return productsSnapshot.docs.map(doc => {
        const productData = doc.data();
        return {
          id: parseInt(doc.id),
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || 0,
          compareAtPrice: productData.compareAtPrice || null,
          images: productData.images || [],
          categoryId: productData.categoryId || 0,
          sellerId: productData.sellerId || 0,
          supplierId: productData.supplierId || 0,
          status: productData.status || 'draft',
          inventory: productData.inventory || 0,
          sku: productData.sku || '',
          barcode: productData.barcode || '',
          weight: productData.weight || 0,
          weightUnit: productData.weightUnit || 'kg',
          dimensions: productData.dimensions || { length: 0, width: 0, height: 0 },
          dimensionUnit: productData.dimensionUnit || 'cm',
          variants: productData.variants || [],
          options: productData.options || [],
          tags: productData.tags || [],
          createdAt: productData.createdAt?.toDate() || new Date(),
          updatedAt: productData.updatedAt?.toDate() || new Date()
        } as Product;
      });
    } catch (error) {
      console.error("Error getting products by seller:", error);
      return [];
    }
  }

  async getProductsBySupplier(supplierId: number, limit = 100, offset = 0): Promise<Product[]> {
    try {
      const productsSnapshot = await db.collection('products')
        .where('supplierId', '==', supplierId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      return productsSnapshot.docs.map(doc => {
        const productData = doc.data();
        return {
          id: parseInt(doc.id),
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || 0,
          compareAtPrice: productData.compareAtPrice || null,
          images: productData.images || [],
          categoryId: productData.categoryId || 0,
          sellerId: productData.sellerId || 0,
          supplierId: productData.supplierId || 0,
          status: productData.status || 'draft',
          inventory: productData.inventory || 0,
          sku: productData.sku || '',
          barcode: productData.barcode || '',
          weight: productData.weight || 0,
          weightUnit: productData.weightUnit || 'kg',
          dimensions: productData.dimensions || { length: 0, width: 0, height: 0 },
          dimensionUnit: productData.dimensionUnit || 'cm',
          variants: productData.variants || [],
          options: productData.options || [],
          tags: productData.tags || [],
          createdAt: productData.createdAt?.toDate() || new Date(),
          updatedAt: productData.updatedAt?.toDate() || new Date()
        } as Product;
      });
    } catch (error) {
      console.error("Error getting products by supplier:", error);
      return [];
    }
  }

  async searchProducts(query: string, limit = 100, offset = 0): Promise<Product[]> {
    try {
      // Firebase ليس لديه بحث نصي كامل، لذا نستخدم خاصية هجائية بسيطة
      // هذا تنفيذ أساسي، للبحث المتقدم قد تحتاج Algolia أو خدمة بحث متخصصة
      
      const queryLower = query.toLowerCase();
      const productsSnapshot = await db.collection('products').get();
      
      const matchingProducts = productsSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return (
            data.name?.toLowerCase().includes(queryLower) ||
            data.description?.toLowerCase().includes(queryLower) ||
            data.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))
          );
        })
        .slice(offset, offset + limit)
        .map(doc => {
          const productData = doc.data();
          return {
            id: parseInt(doc.id),
            name: productData.name || '',
            description: productData.description || '',
            price: productData.price || 0,
            compareAtPrice: productData.compareAtPrice || null,
            images: productData.images || [],
            categoryId: productData.categoryId || 0,
            sellerId: productData.sellerId || 0,
            supplierId: productData.supplierId || 0,
            status: productData.status || 'draft',
            inventory: productData.inventory || 0,
            sku: productData.sku || '',
            barcode: productData.barcode || '',
            weight: productData.weight || 0,
            weightUnit: productData.weightUnit || 'kg',
            dimensions: productData.dimensions || { length: 0, width: 0, height: 0 },
            dimensionUnit: productData.dimensionUnit || 'cm',
            variants: productData.variants || [],
            options: productData.options || [],
            tags: productData.tags || [],
            createdAt: productData.createdAt?.toDate() || new Date(),
            updatedAt: productData.updatedAt?.toDate() || new Date()
          } as Product;
        });
      
      return matchingProducts;
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

  async getProductCount(): Promise<number> {
    try {
      const countSnapshot = await db.collection('products').count().get();
      return countSnapshot.data().count;
    } catch (error) {
      console.error("Error getting product count:", error);
      return 0;
    }
  }

  async getProductCountByCategory(categoryId: number): Promise<number> {
    try {
      const countSnapshot = await db.collection('products')
        .where('categoryId', '==', categoryId)
        .count()
        .get();
      return countSnapshot.data().count;
    } catch (error) {
      console.error("Error getting product count by category:", error);
      return 0;
    }
  }

  // === وظائف الفئات ===
  
  async getCategory(id: number): Promise<Category | undefined> {
    try {
      const categoryDoc = await db.collection('categories').doc(id.toString()).get();
      if (!categoryDoc.exists) return undefined;
      
      const categoryData = categoryDoc.data();
      return {
        id,
        name: categoryData?.name || '',
        description: categoryData?.description || '',
        parentId: categoryData?.parentId || null,
        image: categoryData?.image || '',
        order: categoryData?.order || 0,
        isActive: categoryData?.isActive || true,
        slug: categoryData?.slug || '',
        createdAt: categoryData?.createdAt?.toDate() || new Date(),
        updatedAt: categoryData?.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error("Error getting category:", error);
      return undefined;
    }
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    try {
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('categories').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث العداد
      await db.collection('counters').doc('categories').set({ lastId });
      
      // إنشاء الفئة
      const now = new Date();
      const categoryData = {
        ...category,
        createdAt: now,
        updatedAt: now,
        isActive: true
      };
      
      await db.collection('categories').doc(lastId.toString()).set(categoryData);
      
      return {
        id: lastId,
        ...categoryData,
        createdAt: now,
        updatedAt: now
      } as Category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    try {
      const categoryRef = db.collection('categories').doc(id.toString());
      const categoryDoc = await categoryRef.get();
      
      if (!categoryDoc.exists) return undefined;
      
      const updatedData = {
        ...categoryData,
        updatedAt: new Date()
      };
      
      await categoryRef.update(updatedData);
      
      const updatedCategoryDoc = await categoryRef.get();
      const updatedCategoryData = updatedCategoryDoc.data();
      
      return {
        id,
        ...updatedCategoryData,
        createdAt: updatedCategoryData?.createdAt?.toDate() || new Date(),
        updatedAt: updatedCategoryData?.updatedAt?.toDate() || new Date()
      } as Category;
    } catch (error) {
      console.error("Error updating category:", error);
      return undefined;
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      const categoryRef = db.collection('categories').doc(id.toString());
      const categoryDoc = await categoryRef.get();
      
      if (!categoryDoc.exists) return false;
      
      // التحقق من وجود فئات فرعية
      const subCategoriesSnapshot = await db.collection('categories')
        .where('parentId', '==', id)
        .get();
      
      if (!subCategoriesSnapshot.empty) {
        throw new Error('لا يمكن حذف الفئة لأنها تحتوي على فئات فرعية');
      }
      
      // التحقق من وجود منتجات مرتبطة
      const productsSnapshot = await db.collection('products')
        .where('categoryId', '==', id)
        .limit(1)
        .get();
      
      if (!productsSnapshot.empty) {
        throw new Error('لا يمكن حذف الفئة لأنها تحتوي على منتجات');
      }
      
      await categoryRef.delete();
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }

  async getAllCategories(parentId?: number): Promise<Category[]> {
    try {
      let query = db.collection('categories');
      
      if (parentId !== undefined) {
        query = query.where('parentId', '==', parentId);
      }
      
      const categoriesSnapshot = await query
        .orderBy('order', 'asc')
        .get();
      
      return categoriesSnapshot.docs.map(doc => {
        const categoryData = doc.data();
        return {
          id: parseInt(doc.id),
          name: categoryData.name || '',
          description: categoryData.description || '',
          parentId: categoryData.parentId || null,
          image: categoryData.image || '',
          order: categoryData.order || 0,
          isActive: categoryData.isActive || true,
          slug: categoryData.slug || '',
          createdAt: categoryData.createdAt?.toDate() || new Date(),
          updatedAt: categoryData.updatedAt?.toDate() || new Date()
        } as Category;
      });
    } catch (error) {
      console.error("Error getting all categories:", error);
      return [];
    }
  }

  async getCategoryCount(): Promise<number> {
    try {
      const countSnapshot = await db.collection('categories').count().get();
      return countSnapshot.data().count;
    } catch (error) {
      console.error("Error getting category count:", error);
      return 0;
    }
  }

  // === وظائف الموردين ===
  
  async getSupplier(id: number): Promise<Supplier | undefined> {
    try {
      const supplierDoc = await db.collection('suppliers').doc(id.toString()).get();
      if (!supplierDoc.exists) return undefined;
      
      const supplierData = supplierDoc.data();
      return {
        id,
        name: supplierData?.name || '',
        contactName: supplierData?.contactName || '',
        email: supplierData?.email || '',
        phone: supplierData?.phone || '',
        address: supplierData?.address || '',
        websiteUrl: supplierData?.websiteUrl || '',
        apiEndpoint: supplierData?.apiEndpoint || '',
        apiKey: supplierData?.apiKey || '',
        status: supplierData?.status || 'active',
        notes: supplierData?.notes || '',
        createdAt: supplierData?.createdAt?.toDate() || new Date(),
        updatedAt: supplierData?.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error("Error getting supplier:", error);
      return undefined;
    }
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    try {
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('suppliers').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث العداد
      await db.collection('counters').doc('suppliers').set({ lastId });
      
      // إنشاء المورد
      const now = new Date();
      const supplierData = {
        ...supplier,
        createdAt: now,
        updatedAt: now,
        status: 'active'
      };
      
      await db.collection('suppliers').doc(lastId.toString()).set(supplierData);
      
      return {
        id: lastId,
        ...supplierData,
        createdAt: now,
        updatedAt: now
      } as Supplier;
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw error;
    }
  }

  async updateSupplier(id: number, supplierData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    try {
      const supplierRef = db.collection('suppliers').doc(id.toString());
      const supplierDoc = await supplierRef.get();
      
      if (!supplierDoc.exists) return undefined;
      
      const updatedData = {
        ...supplierData,
        updatedAt: new Date()
      };
      
      await supplierRef.update(updatedData);
      
      const updatedSupplierDoc = await supplierRef.get();
      const updatedSupplierData = updatedSupplierDoc.data();
      
      return {
        id,
        ...updatedSupplierData,
        createdAt: updatedSupplierData?.createdAt?.toDate() || new Date(),
        updatedAt: updatedSupplierData?.updatedAt?.toDate() || new Date()
      } as Supplier;
    } catch (error) {
      console.error("Error updating supplier:", error);
      return undefined;
    }
  }

  async deleteSupplier(id: number): Promise<boolean> {
    try {
      const supplierRef = db.collection('suppliers').doc(id.toString());
      const supplierDoc = await supplierRef.get();
      
      if (!supplierDoc.exists) return false;
      
      // التحقق من وجود منتجات مرتبطة
      const productsSnapshot = await db.collection('products')
        .where('supplierId', '==', id)
        .limit(1)
        .get();
      
      if (!productsSnapshot.empty) {
        throw new Error('لا يمكن حذف المورد لأنه مرتبط بمنتجات');
      }
      
      await supplierRef.delete();
      return true;
    } catch (error) {
      console.error("Error deleting supplier:", error);
      return false;
    }
  }

  async getAllSuppliers(limit = 100, offset = 0): Promise<Supplier[]> {
    try {
      const suppliersSnapshot = await db.collection('suppliers')
        .orderBy('name', 'asc')
        .limit(limit)
        .offset(offset)
        .get();
      
      return suppliersSnapshot.docs.map(doc => {
        const supplierData = doc.data();
        return {
          id: parseInt(doc.id),
          name: supplierData.name || '',
          contactName: supplierData.contactName || '',
          email: supplierData.email || '',
          phone: supplierData.phone || '',
          address: supplierData.address || '',
          websiteUrl: supplierData.websiteUrl || '',
          apiEndpoint: supplierData.apiEndpoint || '',
          apiKey: supplierData.apiKey || '',
          status: supplierData.status || 'active',
          notes: supplierData.notes || '',
          createdAt: supplierData.createdAt?.toDate() || new Date(),
          updatedAt: supplierData.updatedAt?.toDate() || new Date()
        } as Supplier;
      });
    } catch (error) {
      console.error("Error getting all suppliers:", error);
      return [];
    }
  }

  async getSupplierCount(): Promise<number> {
    try {
      const countSnapshot = await db.collection('suppliers').count().get();
      return countSnapshot.data().count;
    } catch (error) {
      console.error("Error getting supplier count:", error);
      return 0;
    }
  }

  // === وظائف الطلبات ===
  
  async getOrder(id: number): Promise<Order | undefined> {
    try {
      const orderDoc = await db.collection('orders').doc(id.toString()).get();
      if (!orderDoc.exists) return undefined;
      
      const orderData = orderDoc.data();
      
      // الحصول على عناصر الطلب
      const orderItems = await this.getOrderItemsByOrder(id);
      
      return {
        id,
        userId: orderData?.userId || 0,
        status: orderData?.status || 'pending',
        totalAmount: orderData?.totalAmount || 0,
        shippingAmount: orderData?.shippingAmount || 0,
        taxAmount: orderData?.taxAmount || 0,
        discountAmount: orderData?.discountAmount || 0,
        finalAmount: orderData?.finalAmount || 0,
        currency: orderData?.currency || 'EGP',
        paymentMethod: orderData?.paymentMethod || '',
        paymentStatus: orderData?.paymentStatus || 'pending',
        shippingMethod: orderData?.shippingMethod || '',
        shippingStatus: orderData?.shippingStatus || 'pending',
        shippingTrackingNumber: orderData?.shippingTrackingNumber || '',
        shippingAddress: orderData?.shippingAddress || {},
        billingAddress: orderData?.billingAddress || {},
        notes: orderData?.notes || '',
        items: orderItems,
        createdAt: orderData?.createdAt?.toDate() || new Date(),
        updatedAt: orderData?.updatedAt?.toDate() || new Date(),
        completedAt: orderData?.completedAt?.toDate() || null
      };
    } catch (error) {
      console.error("Error getting order:", error);
      return undefined;
    }
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    try {
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('orders').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث العداد
      await db.collection('counters').doc('orders').set({ lastId });
      
      // إنشاء الطلب
      const now = new Date();
      const orderData = {
        ...order,
        status: 'pending',
        paymentStatus: 'pending',
        shippingStatus: 'pending',
        createdAt: now,
        updatedAt: now
      };
      
      // إضافة معرف الطلب إلى عناصر الطلب
      const orderItems = order.items || [];
      const orderItemsWithId = orderItems.map(item => ({ ...item, orderId: lastId }));
      
      // حفظ الطلب
      const orderWithoutItems = { ...orderData };
      delete orderWithoutItems.items;
      await db.collection('orders').doc(lastId.toString()).set(orderWithoutItems);
      
      // حفظ عناصر الطلب
      for (const item of orderItemsWithId) {
        await this.createOrderItem(item);
      }
      
      // إرسال إشعار للبائع والمشرف
      await this.createNotification({
        type: 'NEW_ORDER',
        title: 'طلب جديد',
        message: `تم إنشاء طلب جديد برقم ${lastId}`,
        recipientRole: 'admin',
        createdAt: now
      });
      
      return {
        id: lastId,
        ...orderData,
        items: orderItemsWithId,
        createdAt: now,
        updatedAt: now,
        completedAt: null
      } as Order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    try {
      const orderRef = db.collection('orders').doc(id.toString());
      const orderDoc = await orderRef.get();
      
      if (!orderDoc.exists) return undefined;
      
      const updatedData = {
        ...orderData,
        updatedAt: new Date()
      };
      
      // استثناء عناصر الطلب من التحديث
      const orderDataWithoutItems = { ...updatedData };
      delete orderDataWithoutItems.items;
      
      await orderRef.update(orderDataWithoutItems);
      
      // تحديث عناصر الطلب إذا تم تقديمها
      if (orderData.items && orderData.items.length > 0) {
        // حذف العناصر الحالية
        const currentItems = await this.getOrderItemsByOrder(id);
        for (const item of currentItems) {
          if (item.id) {
            await db.collection('orderItems').doc(item.id.toString()).delete();
          }
        }
        
        // إضافة العناصر الجديدة
        for (const item of orderData.items) {
          await this.createOrderItem({ ...item, orderId: id });
        }
      }
      
      // الحصول على الطلب المحدث
      return await this.getOrder(id);
    } catch (error) {
      console.error("Error updating order:", error);
      return undefined;
    }
  }

  async deleteOrder(id: number): Promise<boolean> {
    try {
      const orderRef = db.collection('orders').doc(id.toString());
      const orderDoc = await orderRef.get();
      
      if (!orderDoc.exists) return false;
      
      // حذف عناصر الطلب
      const orderItems = await this.getOrderItemsByOrder(id);
      for (const item of orderItems) {
        if (item.id) {
          await db.collection('orderItems').doc(item.id.toString()).delete();
        }
      }
      
      // حذف الطلب
      await orderRef.delete();
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      return false;
    }
  }

  async getAllOrders(limit = 100, offset = 0): Promise<Order[]> {
    try {
      const ordersSnapshot = await db.collection('orders')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      const orders = [];
      for (const doc of ordersSnapshot.docs) {
        const orderData = doc.data();
        const orderId = parseInt(doc.id);
        
        // الحصول على عناصر الطلب
        const orderItems = await this.getOrderItemsByOrder(orderId);
        
        orders.push({
          id: orderId,
          userId: orderData.userId || 0,
          status: orderData.status || 'pending',
          totalAmount: orderData.totalAmount || 0,
          shippingAmount: orderData.shippingAmount || 0,
          taxAmount: orderData.taxAmount || 0,
          discountAmount: orderData.discountAmount || 0,
          finalAmount: orderData.finalAmount || 0,
          currency: orderData.currency || 'EGP',
          paymentMethod: orderData.paymentMethod || '',
          paymentStatus: orderData.paymentStatus || 'pending',
          shippingMethod: orderData.shippingMethod || '',
          shippingStatus: orderData.shippingStatus || 'pending',
          shippingTrackingNumber: orderData.shippingTrackingNumber || '',
          shippingAddress: orderData.shippingAddress || {},
          billingAddress: orderData.billingAddress || {},
          notes: orderData.notes || '',
          items: orderItems,
          createdAt: orderData.createdAt?.toDate() || new Date(),
          updatedAt: orderData.updatedAt?.toDate() || new Date(),
          completedAt: orderData.completedAt?.toDate() || null
        } as Order);
      }
      
      return orders;
    } catch (error) {
      console.error("Error getting all orders:", error);
      return [];
    }
  }

  async getOrdersByUser(userId: number, limit = 100, offset = 0): Promise<Order[]> {
    try {
      const ordersSnapshot = await db.collection('orders')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();
      
      const orders = [];
      for (const doc of ordersSnapshot.docs) {
        const orderData = doc.data();
        const orderId = parseInt(doc.id);
        
        // الحصول على عناصر الطلب
        const orderItems = await this.getOrderItemsByOrder(orderId);
        
        orders.push({
          id: orderId,
          userId: orderData.userId || 0,
          status: orderData.status || 'pending',
          totalAmount: orderData.totalAmount || 0,
          shippingAmount: orderData.shippingAmount || 0,
          taxAmount: orderData.taxAmount || 0,
          discountAmount: orderData.discountAmount || 0,
          finalAmount: orderData.finalAmount || 0,
          currency: orderData.currency || 'EGP',
          paymentMethod: orderData.paymentMethod || '',
          paymentStatus: orderData.paymentStatus || 'pending',
          shippingMethod: orderData.shippingMethod || '',
          shippingStatus: orderData.shippingStatus || 'pending',
          shippingTrackingNumber: orderData.shippingTrackingNumber || '',
          shippingAddress: orderData.shippingAddress || {},
          billingAddress: orderData.billingAddress || {},
          notes: orderData.notes || '',
          items: orderItems,
          createdAt: orderData.createdAt?.toDate() || new Date(),
          updatedAt: orderData.updatedAt?.toDate() || new Date(),
          completedAt: orderData.completedAt?.toDate() || null
        } as Order);
      }
      
      return orders;
    } catch (error) {
      console.error("Error getting user orders:", error);
      return [];
    }
  }

  async getOrderCount(): Promise<number> {
    try {
      const countSnapshot = await db.collection('orders').count().get();
      return countSnapshot.data().count;
    } catch (error) {
      console.error("Error getting order count:", error);
      return 0;
    }
  }

  async getOrderCountByUser(userId: number): Promise<number> {
    try {
      const countSnapshot = await db.collection('orders')
        .where('userId', '==', userId)
        .count()
        .get();
      return countSnapshot.data().count;
    } catch (error) {
      console.error("Error getting user order count:", error);
      return 0;
    }
  }

  // === وظائف عناصر الطلب ===
  
  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    try {
      const orderItemDoc = await db.collection('orderItems').doc(id.toString()).get();
      if (!orderItemDoc.exists) return undefined;
      
      const orderItemData = orderItemDoc.data();
      return {
        id,
        orderId: orderItemData?.orderId || 0,
        productId: orderItemData?.productId || 0,
        productName: orderItemData?.productName || '',
        productSku: orderItemData?.productSku || '',
        quantity: orderItemData?.quantity || 0,
        unitPrice: orderItemData?.unitPrice || 0,
        totalPrice: orderItemData?.totalPrice || 0,
        productImage: orderItemData?.productImage || '',
        variantId: orderItemData?.variantId || null,
        variantName: orderItemData?.variantName || '',
        sellerId: orderItemData?.sellerId || 0,
        commissionRate: orderItemData?.commissionRate || 0,
        commissionAmount: orderItemData?.commissionAmount || 0,
        status: orderItemData?.status || 'pending'
      };
    } catch (error) {
      console.error("Error getting order item:", error);
      return undefined;
    }
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    try {
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('orderItems').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث العداد
      await db.collection('counters').doc('orderItems').set({ lastId });
      
      // إنشاء عنصر الطلب
      const orderItemData = {
        ...orderItem,
        status: 'pending'
      };
      
      await db.collection('orderItems').doc(lastId.toString()).set(orderItemData);
      
      return {
        id: lastId,
        ...orderItemData
      } as OrderItem;
    } catch (error) {
      console.error("Error creating order item:", error);
      throw error;
    }
  }

  async getOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    try {
      const orderItemsSnapshot = await db.collection('orderItems')
        .where('orderId', '==', orderId)
        .get();
      
      return orderItemsSnapshot.docs.map(doc => {
        const itemData = doc.data();
        return {
          id: parseInt(doc.id),
          orderId: itemData.orderId || 0,
          productId: itemData.productId || 0,
          productName: itemData.productName || '',
          productSku: itemData.productSku || '',
          quantity: itemData.quantity || 0,
          unitPrice: itemData.unitPrice || 0,
          totalPrice: itemData.totalPrice || 0,
          productImage: itemData.productImage || '',
          variantId: itemData.variantId || null,
          variantName: itemData.variantName || '',
          sellerId: itemData.sellerId || 0,
          commissionRate: itemData.commissionRate || 0,
          commissionAmount: itemData.commissionAmount || 0,
          status: itemData.status || 'pending'
        } as OrderItem;
      });
    } catch (error) {
      console.error("Error getting order items:", error);
      return [];
    }
  }

  // === وظائف سلة التسوق ===
  
  async getCart(id: number): Promise<Cart | undefined> {
    try {
      const cartDoc = await db.collection('carts').doc(id.toString()).get();
      if (!cartDoc.exists) return undefined;
      
      const cartData = cartDoc.data();
      
      // الحصول على عناصر السلة
      const cartItems = await this.getCartItemsByCart(id);
      
      return {
        id,
        userId: cartData?.userId || 0,
        items: cartItems,
        createdAt: cartData?.createdAt?.toDate() || new Date(),
        updatedAt: cartData?.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error("Error getting cart:", error);
      return undefined;
    }
  }

  async getCartByUser(userId: number): Promise<Cart | undefined> {
    try {
      const cartsSnapshot = await db.collection('carts')
        .where('userId', '==', userId)
        .limit(1)
        .get();
      
      if (cartsSnapshot.empty) return undefined;
      
      const cartDoc = cartsSnapshot.docs[0];
      const cartData = cartDoc.data();
      const cartId = parseInt(cartDoc.id);
      
      // الحصول على عناصر السلة
      const cartItems = await this.getCartItemsByCart(cartId);
      
      return {
        id: cartId,
        userId: cartData.userId || 0,
        items: cartItems,
        createdAt: cartData.createdAt?.toDate() || new Date(),
        updatedAt: cartData.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error("Error getting user cart:", error);
      return undefined;
    }
  }

  async createCart(cart: InsertCart): Promise<Cart> {
    try {
      // التحقق من وجود سلة للمستخدم
      const existingCart = await this.getCartByUser(cart.userId);
      if (existingCart) {
        return existingCart;
      }
      
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('carts').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث العداد
      await db.collection('counters').doc('carts').set({ lastId });
      
      // إنشاء السلة
      const now = new Date();
      const cartData = {
        userId: cart.userId,
        createdAt: now,
        updatedAt: now
      };
      
      await db.collection('carts').doc(lastId.toString()).set(cartData);
      
      return {
        id: lastId,
        ...cartData,
        items: [],
        createdAt: now,
        updatedAt: now
      } as Cart;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  // === وظائف عناصر السلة ===
  
  async getCartItem(id: number): Promise<CartItem | undefined> {
    try {
      const cartItemDoc = await db.collection('cartItems').doc(id.toString()).get();
      if (!cartItemDoc.exists) return undefined;
      
      const cartItemData = cartItemDoc.data();
      return {
        id,
        cartId: cartItemData?.cartId || 0,
        productId: cartItemData?.productId || 0,
        quantity: cartItemData?.quantity || 0,
        variantId: cartItemData?.variantId || null,
        addedAt: cartItemData?.addedAt?.toDate() || new Date(),
        updatedAt: cartItemData?.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error("Error getting cart item:", error);
      return undefined;
    }
  }

  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    try {
      // التحقق من وجود عنصر مماثل في السلة
      const cartItemsSnapshot = await db.collection('cartItems')
        .where('cartId', '==', cartItem.cartId)
        .where('productId', '==', cartItem.productId)
        .where('variantId', '==', cartItem.variantId || null)
        .limit(1)
        .get();
      
      if (!cartItemsSnapshot.empty) {
        // تحديث الكمية إذا كان العنصر موجودًا
        const existingItemDoc = cartItemsSnapshot.docs[0];
        const existingItemData = existingItemDoc.data();
        const existingItemId = parseInt(existingItemDoc.id);
        
        const now = new Date();
        const updatedQuantity = existingItemData.quantity + cartItem.quantity;
        
        await db.collection('cartItems').doc(existingItemId.toString()).update({
          quantity: updatedQuantity,
          updatedAt: now
        });
        
        return {
          id: existingItemId,
          cartId: existingItemData.cartId,
          productId: existingItemData.productId,
          quantity: updatedQuantity,
          variantId: existingItemData.variantId || null,
          addedAt: existingItemData.addedAt?.toDate() || new Date(),
          updatedAt: now
        };
      }
      
      // إنشاء عنصر جديد
      // الحصول على آخر معرف
      const lastIdDoc = await db.collection('counters').doc('cartItems').get();
      let lastId = 1;
      
      if (lastIdDoc.exists) {
        lastId = lastIdDoc.data()?.lastId + 1 || 1;
      }
      
      // تحديث العداد
      await db.collection('counters').doc('cartItems').set({ lastId });
      
      // إنشاء عنصر السلة
      const now = new Date();
      const cartItemData = {
        ...cartItem,
        addedAt: now,
        updatedAt: now
      };
      
      await db.collection('cartItems').doc(lastId.toString()).set(cartItemData);
      
      // تحديث وقت تحديث السلة
      await db.collection('carts').doc(cartItem.cartId.toString()).update({
        updatedAt: now
      });
      
      return {
        id: lastId,
        ...cartItemData,
        addedAt: now,
        updatedAt: now
      } as CartItem;
    } catch (error) {
      console.error("Error creating cart item:", error);
      throw error;
    }
  }

  async updateCartItem(id: number, cartItemData: Partial<InsertCartItem>): Promise<CartItem | undefined> {
    try {
      const cartItemRef = db.collection('cartItems').doc(id.toString());
      const cartItemDoc = await cartItemRef.get();
      
      if (!cartItemDoc.exists) return undefined;
      
      const now = new Date();
      const updatedData = {
        ...cartItemData,
        updatedAt: now
      };
      
      await cartItemRef.update(updatedData);
      
      // تحديث وقت تحديث السلة
      const existingItemData = cartItemDoc.data();
      await db.collection('carts').doc(existingItemData.cartId.toString()).update({
        updatedAt: now
      });
      
      const updatedCartItemDoc = await cartItemRef.get();
      const updatedCartItemData = updatedCartItemDoc.data();
      
      return {
        id,
        cartId: updatedCartItemData.cartId,
        productId: updatedCartItemData.productId,
        quantity: updatedCartItemData.quantity,
        variantId: updatedCartItemData.variantId || null,
        addedAt: updatedCartItemData.addedAt?.toDate() || new Date(),
        updatedAt: now
      };
    } catch (error) {
      console.error("Error updating cart item:", error);
      return undefined;
    }
  }

  async deleteCartItem(id: number): Promise<boolean> {
    try {
      const cartItemRef = db.collection('cartItems').doc(id.toString());
      const cartItemDoc = await cartItemRef.get();
      
      if (!cartItemDoc.exists) return false;
      
      // تحديث وقت تحديث السلة
      const existingItemData = cartItemDoc.data();
      await db.collection('carts').doc(existingItemData.cartId.toString()).update({
        updatedAt: new Date()
      });
      
      await cartItemRef.delete();
      return true;
    } catch (error) {
      console.error("Error deleting cart item:", error);
      return false;
    }
  }

  async getCartItemsByCart(cartId: number): Promise<CartItem[]> {
    try {
      const cartItemsSnapshot = await db.collection('cartItems')
        .where('cartId', '==', cartId)
        .get();
      
      return cartItemsSnapshot.docs.map(doc => {
        const itemData = doc.data();
        return {
          id: parseInt(doc.id),
          cartId: itemData.cartId,
          productId: itemData.productId,
          quantity: itemData.quantity,
          variantId: itemData.variantId || null,
          addedAt: itemData.addedAt?.toDate() || new Date(),
          updatedAt: itemData.updatedAt?.toDate() || new Date()
        } as CartItem;
      });
    } catch (error) {
      console.error("Error getting cart items:", error);
      return [];
    }
  }

  // === وظائف الإعدادات ===
  
  async getSetting(key: string): Promise<Setting | undefined> {
    try {
      const settingsSnapshot = await db.collection('settings')
        .where('key', '==', key)
        .limit(1)
        .get();
      
      if (settingsSnapshot.empty) return undefined;
      
      const settingDoc = settingsSnapshot.docs[0];
      const settingData = settingDoc.data();
      
      return {
        id: parseInt(settingDoc.id),
        key: settingData.key,
        value: settingData.value,
        createdAt: settingData.createdAt?.toDate() || new Date(),
        updatedAt: settingData.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error("Error getting setting:", error);
      return undefined;
    }
  }

  async createOrUpdateSetting(key: string, value: string): Promise<Setting> {
    try {
      // البحث عن الإعداد
      const settingsSnapshot = await db.collection('settings')
        .where('key', '==', key)
        .limit(1)
        .get();
      
      const now = new Date();
      
      if (!settingsSnapshot.empty) {
        // تحديث إعداد موجود
        const settingDoc = settingsSnapshot.docs[0];
        const settingId = parseInt(settingDoc.id);
        
        await db.collection('settings').doc(settingId.toString()).update({
          value,
          updatedAt: now
        });
        
        return {
          id: settingId,
          key,
          value,
          createdAt: settingDoc.data().createdAt?.toDate() || now,
          updatedAt: now
        };
      } else {
        // إنشاء إعداد جديد
        // الحصول على آخر معرف
        const lastIdDoc = await db.collection('counters').doc('settings').get();
        let lastId = 1;
        
        if (lastIdDoc.exists) {
          lastId = lastIdDoc.data()?.lastId + 1 || 1;
        }
        
        // تحديث العداد
        await db.collection('counters').doc('settings').set({ lastId });
        
        // إنشاء الإعداد
        const settingData = {
          key,
          value,
          createdAt: now,
          updatedAt: now
        };
        
        await db.collection('settings').doc(lastId.toString()).set(settingData);
        
        return {
          id: lastId,
          ...settingData,
          createdAt: now,
          updatedAt: now
        } as Setting;
      }
    } catch (error) {
      console.error("Error creating/updating setting:", error);
      throw error;
    }
  }

  async getAppSettings(): Promise<Record<string, string>> {
    try {
      const settingsSnapshot = await db.collection('settings').get();
      
      const settings: Record<string, string> = {};
      
      settingsSnapshot.docs.forEach(doc => {
        const settingData = doc.data();
        settings[settingData.key] = settingData.value;
      });
      
      return settings;
    } catch (error) {
      console.error("Error getting app settings:", error);
      return {};
    }
  }
}