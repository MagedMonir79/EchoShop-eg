import { db } from "../db";
import { analyticsEvents, products, categories, users, orderItems, orders } from "@shared/schema";
import { eq, and, desc, sql, like, or, ne, gte, lte, inArray } from "drizzle-orm";

/**
 * RecommendationsService - محرك توصيات ذكي يقدم اقتراحات مخصصة بناءً على تفضيلات المستخدم
 * Intelligent recommendation engine providing personalized suggestions based on user preferences
 */
class RecommendationsService {
  /**
   * الحصول على توصيات المنتجات للمستخدم
   * Get product recommendations for a user
   */
  async getRecommendationsForUser(userId: number, limit = 10) {
    // مزيج من الطرق المختلفة للتوصية
    // A blend of different recommendation strategies
    const [viewedProducts, purchasedProducts, inCartProducts] = await Promise.all([
      this.getRecentlyViewedProducts(userId, 20),
      this.getPurchasedProducts(userId, 20),
      this.getCartProducts(userId)
    ]);
    
    // الحصول على الفئات المفضلة للمستخدم
    // Get user's preferred categories
    const preferredCategories = await this.getUserPreferredCategories(userId);
    
    // تجميع المنتجات لتجنب التكرارات
    // Collect all products to avoid duplicates
    const allProductIds = new Set([
      ...viewedProducts.map(p => p.id),
      ...purchasedProducts.map(p => p.id),
      ...inCartProducts.map(p => p.id)
    ]);
    
    // الحصول على توصيات مختلفة
    // Get different types of recommendations
    const [similarToViewed, similarToPurchased, trending, newArrivals, categoryBased] = await Promise.all([
      this.getSimilarProducts(viewedProducts, allProductIds, 5),
      this.getSimilarProducts(purchasedProducts, allProductIds, 5),
      this.getTrendingProducts(allProductIds, 5),
      this.getNewArrivals(allProductIds, 5),
      this.getProductsByCategories(preferredCategories, allProductIds, 5)
    ]);
    
    // دمج جميع التوصيات مع إزالة التكرارات
    // Merge all recommendations and remove duplicates
    const recommendations = [
      ...similarToViewed,
      ...similarToPurchased,
      ...trending,
      ...newArrivals,
      ...categoryBased
    ];
    
    // إزالة التكرارات بناءً على معرف المنتج
    // Remove duplicates based on product id
    const uniqueRecommendations = recommendations.filter((product, index, self) =>
      index === self.findIndex(p => p.id === product.id)
    );
    
    // ترتيب التوصيات حسب الأهمية
    // Sort recommendations by relevance
    const sortedRecommendations = this.sortByRelevance(uniqueRecommendations);
    
    // اقتطاع القائمة للحد المطلوب
    // Limit the list to the requested count
    return sortedRecommendations.slice(0, limit);
  }
  
  /**
   * الحصول على المنتجات التي تمت مشاهدتها مؤخرًا
   * Get recently viewed products
   */
  async getRecentlyViewedProducts(userId: number, limit = 10) {
    const events = await db
      .select({
        resourceId: analyticsEvents.resourceId
      })
      .from(analyticsEvents)
      .where(and(
        eq(analyticsEvents.userId, userId),
        eq(analyticsEvents.eventType, 'page_view'),
        eq(analyticsEvents.resourceType, 'product')
      ))
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(limit);
    
    if (events.length === 0) {
      return [];
    }
    
    const productIds = events.map(e => e.resourceId).filter(Boolean) as number[];
    
    if (productIds.length === 0) {
      return [];
    }
    
    return db
      .select()
      .from(products)
      .where(and(
        inArray(products.id, productIds),
        eq(products.isActive, true)
      ))
      .limit(limit);
  }
  
  /**
   * الحصول على المنتجات التي تم شراؤها
   * Get purchased products
   */
  async getPurchasedProducts(userId: number, limit = 10) {
    const userOrders = await db
      .select({
        id: orders.id
      })
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(20);
    
    if (userOrders.length === 0) {
      return [];
    }
    
    const orderIds = userOrders.map(o => o.id);
    
    const items = await db
      .select({
        productId: orderItems.productId
      })
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds))
      .limit(limit * 2);
    
    if (items.length === 0) {
      return [];
    }
    
    const productIds = items.map(i => i.productId);
    
    return db
      .select()
      .from(products)
      .where(and(
        inArray(products.id, productIds),
        eq(products.isActive, true)
      ))
      .limit(limit);
  }
  
  /**
   * الحصول على المنتجات في سلة التسوق
   * Get products in cart
   */
  async getCartProducts(userId: number) {
    // الحصول على معرف سلة التسوق للمستخدم
    // Get the user's cart ID
    const userCart = await db
      .select()
      .from(sql`carts`)
      .where(eq(sql`carts.user_id`, userId))
      .limit(1);
    
    if (userCart.length === 0) {
      return [];
    }
    
    const cartId = userCart[0].id;
    
    // الحصول على عناصر السلة
    // Get cart items
    const cartItems = await db
      .select({
        productId: sql`cart_items.product_id`
      })
      .from(sql`cart_items`)
      .where(eq(sql`cart_items.cart_id`, cartId));
    
    if (cartItems.length === 0) {
      return [];
    }
    
    const productIds = cartItems.map(item => item.productId);
    
    // الحصول على المنتجات
    // Get the products
    return db
      .select()
      .from(products)
      .where(and(
        inArray(products.id, productIds),
        eq(products.isActive, true)
      ));
  }
  
  /**
   * الحصول على الفئات المفضلة للمستخدم
   * Get user's preferred categories
   */
  async getUserPreferredCategories(userId: number, limit = 5) {
    // تحليل مشاهدات المنتجات
    // Analyze product views
    const viewEvents = await db
      .select({
        productId: analyticsEvents.resourceId
      })
      .from(analyticsEvents)
      .where(and(
        eq(analyticsEvents.userId, userId),
        eq(analyticsEvents.eventType, 'page_view'),
        eq(analyticsEvents.resourceType, 'product')
      ))
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(50);
    
    // تحليل المشتريات السابقة
    // Analyze past purchases
    const userOrders = await db
      .select({
        id: orders.id
      })
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(10);
    
    const orderIds = userOrders.map(o => o.id);
    
    const purchasedItems = orderIds.length > 0 ? await db
      .select({
        productId: orderItems.productId
      })
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds))
      .limit(50) : [];
    
    // جمع كل المنتجات
    // Collect all products
    const viewedProductIds = viewEvents.map(e => e.productId).filter(Boolean) as number[];
    const purchasedProductIds = purchasedItems.map(i => i.productId);
    const allProductIds = [...viewedProductIds, ...purchasedProductIds];
    
    if (allProductIds.length === 0) {
      // إذا لم يكن لدى المستخدم منتجات، قم بإرجاع الفئات الأكثر شيوعًا
      // If the user has no products, return the most popular categories
      return this.getPopularCategories(limit);
    }
    
    // الحصول على الفئات المرتبطة بالمنتجات
    // Get categories associated with the products
    const productCategories = await db
      .select({
        categoryId: products.categoryId
      })
      .from(products)
      .where(inArray(products.id, allProductIds));
    
    // حساب تكرار كل فئة
    // Count frequency of each category
    const categoryCounts = productCategories.reduce((acc, curr) => {
      acc[curr.categoryId] = (acc[curr.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // ترتيب الفئات حسب التكرار
    // Sort categories by frequency
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([categoryId]) => parseInt(categoryId, 10))
      .slice(0, limit);
    
    return sortedCategories;
  }
  
  /**
   * الحصول على الفئات الأكثر شيوعًا
   * Get most popular categories
   */
  async getPopularCategories(limit = 5) {
    try {
      // استعلام تحليلي للحصول على أكثر الفئات شيوعًا بناءً على المبيعات
      // Analytical query to get the most popular categories based on sales
      const result = await db.execute(sql`
        SELECT p.category_id, COUNT(*) as order_count
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY p.category_id
        ORDER BY order_count DESC
        LIMIT ${limit}
      `);
      
      // معالجة البيانات على أنها جدول من الصفوف
      // Process data as an array of rows
      const popularCategories = Array.isArray(result) ? result : [];
      
      // استخراج معرفات الفئات
      // Extract category IDs
      return popularCategories.map((row: any) => row.category_id);
    } catch (error) {
      console.error("Error getting popular categories:", error);
      // في حالة الخطأ، إرجاع مصفوفة فارغة
      // In case of error, return an empty array
      return [];
    }
  }
  
  /**
   * الحصول على منتجات متشابهة
   * Get similar products
   */
  async getSimilarProducts(baseProducts: any[], excludeIds: Set<number>, limit = 5) {
    if (baseProducts.length === 0) {
      return [];
    }
    
    // استخراج الفئات والبائعين من المنتجات الأساسية
    // Extract categories and sellers from base products
    const categoryIds = Array.from(new Set(baseProducts.map(p => p.categoryId)));
    const sellerIds = Array.from(new Set(baseProducts.map(p => p.sellerId)));
    
    // تحويل مجموعة المعرفات المستبعدة إلى مصفوفة
    // Convert excluded ids set to array
    const excludeIdsArray = Array.from(excludeIds);
    
    // البحث عن منتجات متشابهة بناءً على الفئة والبائع
    // Find similar products based on category and seller
    if (excludeIdsArray.length === 0) {
      return db
        .select()
        .from(products)
        .where(and(
          or(
            inArray(products.categoryId, categoryIds),
            inArray(products.sellerId, sellerIds)
          ),
          eq(products.isActive, true)
        ))
        .orderBy(desc(products.rating))
        .limit(limit);
    } else {
      return db
        .select()
        .from(products)
        .where(and(
          or(
            inArray(products.categoryId, categoryIds),
            inArray(products.sellerId, sellerIds)
          ),
          eq(products.isActive, true),
          sql`${products.id} NOT IN (${excludeIdsArray.join(',')})`
        ))
        .orderBy(desc(products.rating))
        .limit(limit);
    }
  }
  
  /**
   * الحصول على المنتجات الرائجة
   * Get trending products
   */
  async getTrendingProducts(excludeIds: Set<number>, limit = 5) {
    // الحصول على المنتجات الأكثر مبيعًا في الأسبوع الماضي
    // Get the most sold products in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    try {
      const result = await db.execute(sql`
        SELECT oi.product_id, COUNT(*) as order_count
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at >= ${oneWeekAgo.toISOString()}
        GROUP BY oi.product_id
        ORDER BY order_count DESC
        LIMIT ${limit * 2}
      `);
      
      // معالجة البيانات على أنها جدول من الصفوف
      // Process data as an array of rows
      const trendingProductIds = Array.isArray(result) ? result : [];
      const excludeIdsArray = Array.from(excludeIds);
      
      // استخراج معرفات المنتجات
      // Extract product IDs
      const productIds = trendingProductIds.map((row: any) => row.product_id)
        .filter((id: number) => !excludeIdsArray.includes(id))
        .slice(0, limit);
      
      if (productIds.length === 0) {
        return [];
      }
      
      return db
        .select()
        .from(products)
        .where(and(
          inArray(products.id, productIds),
          eq(products.isActive, true)
        ))
        .orderBy(desc(products.rating))
        .limit(limit);
    } catch (error) {
      console.error("Error getting trending products:", error);
      // في حالة الخطأ، إرجاع المنتجات الأعلى تقييمًا
      // In case of error, return top-rated products
      return db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .orderBy(desc(products.rating))
        .limit(limit);
    }
  }
  
  /**
   * الحصول على المنتجات الجديدة
   * Get new arrivals
   */
  async getNewArrivals(excludeIds: Set<number>, limit = 5) {
    // الحصول على أحدث المنتجات المضافة
    // Get latest added products
    const excludeIdsArray = Array.from(excludeIds);
    
    if (excludeIdsArray.length === 0) {
      return db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .orderBy(desc(products.createdAt))
        .limit(limit);
    } else {
      return db
        .select()
        .from(products)
        .where(and(
          eq(products.isActive, true),
          sql`${products.id} NOT IN (${excludeIdsArray.join(',')})`
        ))
        .orderBy(desc(products.createdAt))
        .limit(limit);
    }
  }
  
  /**
   * الحصول على منتجات بناءً على الفئات
   * Get products by categories
   */
  async getProductsByCategories(categoryIds: number[], excludeIds: Set<number>, limit = 5) {
    if (categoryIds.length === 0) {
      return [];
    }
    
    const excludeIdsArray = Array.from(excludeIds);
    
    if (excludeIdsArray.length === 0) {
      return db
        .select()
        .from(products)
        .where(and(
          inArray(products.categoryId, categoryIds),
          eq(products.isActive, true)
        ))
        .orderBy(desc(products.rating))
        .limit(limit);
    } else {
      return db
        .select()
        .from(products)
        .where(and(
          inArray(products.categoryId, categoryIds),
          eq(products.isActive, true),
          sql`${products.id} NOT IN (${excludeIdsArray.join(',')})`
        ))
        .orderBy(desc(products.rating))
        .limit(limit);
    }
  }
  
  /**
   * ترتيب التوصيات حسب الأهمية
   * Sort recommendations by relevance
   */
  sortByRelevance(recommendations: any[]) {
    // يمكن تنفيذ خوارزمية ترتيب أكثر تعقيدًا هنا
    // A more sophisticated ranking algorithm can be implemented here
    
    // مثال بسيط: ترتيب حسب التقييم والخصم والشعبية
    // Simple example: sort by rating, discount and popularity
    return recommendations.sort((a, b) => {
      // حساب نتيجة الأهمية لكل منتج
      // Calculate relevance score for each product
      const scoreA = this.calculateRelevanceScore(a);
      const scoreB = this.calculateRelevanceScore(b);
      
      return scoreB - scoreA;
    });
  }
  
  /**
   * حساب نتيجة الأهمية للمنتج
   * Calculate relevance score for a product
   */
  calculateRelevanceScore(product: any) {
    // وزن العوامل المختلفة
    // Weights for different factors
    const ratingWeight = 3;
    const discountWeight = 2;
    const reviewCountWeight = 1;
    
    // حساب نسبة الخصم
    // Calculate discount percentage
    const hasDiscount = product.discountedPrice != null;
    const discountPercentage = hasDiscount 
      ? (Number(product.price) - Number(product.discountedPrice)) / Number(product.price) * 100 
      : 0;
    
    // الجمع الموزون للعوامل
    // Weighted sum of factors
    const score = 
      (Number(product.rating) * ratingWeight) + 
      (discountPercentage * discountWeight) + 
      (Math.min(product.reviewCount, 100) / 100 * reviewCountWeight);
    
    return score;
  }
  
  /**
   * تسجيل حدث تحليلي
   * Log an analytics event
   */
  async logEvent(userId: number | null, eventType: string, resourceId: number | null, resourceType: string | null, metadata: any = {}) {
    await db.insert(analyticsEvents).values({
      userId,
      eventType,
      resourceId,
      resourceType,
      metadata,
      ip: null, // يمكن إضافة عنوان IP الفعلي في بيئة الإنتاج
      userAgent: null, // يمكن إضافة معلومات المتصفح في بيئة الإنتاج
    });
  }
  
  /**
   * تسجيل مشاهدة منتج
   * Log product view
   */
  async logProductView(userId: number | null, productId: number) {
    await this.logEvent(userId, 'page_view', productId, 'product');
  }
  
  /**
   * تسجيل إضافة منتج إلى سلة التسوق
   * Log add to cart
   */
  async logAddToCart(userId: number | null, productId: number) {
    await this.logEvent(userId, 'add_to_cart', productId, 'product');
  }
  
  /**
   * تسجيل عملية شراء
   * Log purchase
   */
  async logPurchase(userId: number | null, orderId: number) {
    await this.logEvent(userId, 'purchase', orderId, 'order');
  }
  
  /**
   * تسجيل إضافة منتج إلى المفضلة
   * Log add to wishlist
   */
  async logAddToWishlist(userId: number | null, productId: number) {
    await this.logEvent(userId, 'add_to_wishlist', productId, 'product');
  }
}

export const recommendationsService = new RecommendationsService();