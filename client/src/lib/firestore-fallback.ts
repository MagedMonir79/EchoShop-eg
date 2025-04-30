// هذا الملف يوفر بديلاً لطلبات API لاستخدامه عند نشر الواجهة الأمامية فقط على Firebase Hosting
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query,
  where,
  addDoc,
  deleteDoc,
  orderBy,
  limit,
  Timestamp,
  DocumentData
} from "firebase/firestore";

// استخدم نفس تهيئة Firebase من الملف الرئيسي لمنع التعارض
import { db } from './firebase';

// Product Methods
export const getAllProducts = async (limitCount: number = 100, offsetCount: number = 0) => {
  try {
    const productsCollection = collection(db, "products");
    const q = query(productsCollection, orderBy("createdAt", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting products from Firestore:", error);
    return [];
  }
};

export const getProductById = async (id: number) => {
  try {
    const productDoc = await getDoc(doc(db, "products", id.toString()));
    if (productDoc.exists()) {
      return {
        id: parseInt(productDoc.id),
        ...productDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting product from Firestore:", error);
    return null;
  }
};

export const getProductsByCategory = async (categoryId: number, limitCount: number = 100, offsetCount: number = 0) => {
  try {
    const productsCollection = collection(db, "products");
    const q = query(
      productsCollection, 
      where("categoryId", "==", categoryId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting products by category from Firestore:", error);
    return [];
  }
};

// Category Methods
export const getAllCategories = async (parentId?: number) => {
  try {
    const categoriesCollection = collection(db, "categories");
    let q;
    
    if (parentId !== undefined) {
      q = query(categoriesCollection, where("parentId", "==", parentId));
    } else {
      q = query(categoriesCollection);
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting categories from Firestore:", error);
    return [];
  }
};

// User Methods
export const getUserByUsername = async (username: string) => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return {
        id: parseInt(userDoc.id),
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user from Firestore:", error);
    return null;
  }
};

// Order Methods
export const getOrdersByUser = async (userId: number, limitCount: number = 100, offsetCount: number = 0) => {
  try {
    const ordersCollection = collection(db, "orders");
    const q = query(
      ordersCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting orders from Firestore:", error);
    return [];
  }
};

// Cart Methods
export const getCartByUser = async (userId: number) => {
  try {
    const cartsCollection = collection(db, "carts");
    const q = query(cartsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const cartDoc = querySnapshot.docs[0];
      const cartData = {
        id: parseInt(cartDoc.id),
        ...cartDoc.data()
      };
      
      // Get cart items
      const cartItemsCollection = collection(db, "cart_items");
      const itemsQuery = query(cartItemsCollection, where("cartId", "==", cartData.id));
      const itemsSnapshot = await getDocs(itemsQuery);
      
      const items = await Promise.all(itemsSnapshot.docs.map(async (itemDoc) => {
        const itemData = itemDoc.data();
        // Get product details
        const product = await getProductById(itemData.productId);
        
        return {
          id: parseInt(itemDoc.id),
          ...itemData,
          product
        };
      }));
      
      return {
        ...cartData,
        items
      };
    }
    
    // If no cart exists, create one
    const newCart = {
      userId,
      createdAt: Timestamp.now()
    };
    
    const newCartRef = await addDoc(collection(db, "carts"), newCart);
    
    return {
      id: parseInt(newCartRef.id),
      ...newCart,
      items: []
    };
  } catch (error) {
    console.error("Error getting cart from Firestore:", error);
    return null;
  }
};

// Helpers for API fallback
export const handleApiFallback = async (endpoint: string, method: string, data?: any) => {
  // Parse the endpoint to determine what data is being requested
  if (endpoint.startsWith('/api/')) {
    const path = endpoint.substring(5); // Remove '/api/'
    
    // GET requests
    if (method === 'GET') {
      // Products endpoints
      if (path === 'products') {
        return await getAllProducts();
      }
      
      if (path.startsWith('products/') && path.includes('category/')) {
        const categoryId = parseInt(path.split('category/')[1]);
        return await getProductsByCategory(categoryId);
      }
      
      if (path.startsWith('products/') && !path.includes('category/')) {
        const productId = parseInt(path.split('products/')[1]);
        return await getProductById(productId);
      }
      
      // Categories endpoints
      if (path === 'categories') {
        return await getAllCategories();
      }
      
      // Orders endpoints
      if (path.startsWith('orders/user/')) {
        const userId = parseInt(path.split('user/')[1]);
        return await getOrdersByUser(userId);
      }
      
      // Cart endpoints
      if (path.startsWith('cart/user/')) {
        const userId = parseInt(path.split('user/')[1]);
        return await getCartByUser(userId);
      }
    }
    
    // POST/PUT/DELETE requests can be implemented similarly
  }
  
  // Default fallback
  throw new Error(`No Firebase fallback implemented for endpoint: ${endpoint} with method: ${method}`);
};

export default {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories,
  getUserByUsername,
  getOrdersByUser,
  getCartByUser,
  handleApiFallback
};