import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { firebaseConfig } from './firebase';

// تهيئة تطبيق Firebase
const app = initializeApp(firebaseConfig);

// الحصول على مثيل Firestore
export const db = getFirestore(app);

// =====================
// وظائف المستخدمين
// =====================

// الحصول على مستخدم حسب المعرف
export const getUserById = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  
  return null;
};

// الحصول على مستخدم حسب البريد الإلكتروني
export const getUserByEmail = async (email: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }
  
  return null;
};

// إنشاء مستخدم جديد
export const createUser = async (userData: any) => {
  const usersRef = collection(db, 'users');
  const newUser = {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(usersRef, newUser);
  return { id: docRef.id, ...newUser };
};

// تحديث بيانات مستخدم
export const updateUser = async (userId: string, userData: any) => {
  const userRef = doc(db, 'users', userId);
  const updatedData = {
    ...userData,
    updatedAt: serverTimestamp()
  };
  
  await updateDoc(userRef, updatedData);
  const updatedUserSnap = await getDoc(userRef);
  
  if (updatedUserSnap.exists()) {
    return { id: updatedUserSnap.id, ...updatedUserSnap.data() };
  }
  
  return null;
};

// حذف مستخدم
export const deleteUser = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  await deleteDoc(userRef);
  return true;
};

// الحصول على قائمة المستخدمين
export const getAllUsers = async (limitCount = 20, startAfterDoc: any = null) => {
  const usersRef = collection(db, 'users');
  let q;
  
  if (startAfterDoc) {
    q = query(usersRef, orderBy('createdAt', 'desc'), startAfter(startAfterDoc), limit(limitCount));
  } else {
    q = query(usersRef, orderBy('createdAt', 'desc'), limit(limitCount));
  }
  
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return {
    users,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
  };
};

// =====================
// وظائف المنتجات
// =====================

// الحصول على منتج حسب المعرف
export const getProductById = async (productId: string) => {
  const productRef = doc(db, 'products', productId);
  const productSnap = await getDoc(productRef);
  
  if (productSnap.exists()) {
    return { id: productSnap.id, ...productSnap.data() };
  }
  
  return null;
};

// إنشاء منتج جديد
export const createProduct = async (productData: any) => {
  const productsRef = collection(db, 'products');
  const newProduct = {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(productsRef, newProduct);
  return { id: docRef.id, ...newProduct };
};

// تحديث بيانات منتج
export const updateProduct = async (productId: string, productData: any) => {
  const productRef = doc(db, 'products', productId);
  const updatedData = {
    ...productData,
    updatedAt: serverTimestamp()
  };
  
  await updateDoc(productRef, updatedData);
  const updatedProductSnap = await getDoc(productRef);
  
  if (updatedProductSnap.exists()) {
    return { id: updatedProductSnap.id, ...updatedProductSnap.data() };
  }
  
  return null;
};

// حذف منتج
export const deleteProduct = async (productId: string) => {
  const productRef = doc(db, 'products', productId);
  await deleteDoc(productRef);
  return true;
};

// الحصول على قائمة المنتجات
export const getAllProducts = async (limitCount = 20, startAfterDoc: any = null) => {
  const productsRef = collection(db, 'products');
  let q;
  
  if (startAfterDoc) {
    q = query(productsRef, orderBy('createdAt', 'desc'), startAfter(startAfterDoc), limit(limitCount));
  } else {
    q = query(productsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  }
  
  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return {
    products,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
  };
};

// الحصول على المنتجات حسب الفئة
export const getProductsByCategory = async (categoryId: string, limitCount = 20, startAfterDoc: any = null) => {
  const productsRef = collection(db, 'products');
  let q;
  
  if (startAfterDoc) {
    q = query(
      productsRef, 
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc'), 
      startAfter(startAfterDoc), 
      limit(limitCount)
    );
  } else {
    q = query(
      productsRef, 
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc'), 
      limit(limitCount)
    );
  }
  
  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return {
    products,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
  };
};

// =====================
// وظائف الفئات
// =====================

// الحصول على فئة حسب المعرف
export const getCategoryById = async (categoryId: string) => {
  const categoryRef = doc(db, 'categories', categoryId);
  const categorySnap = await getDoc(categoryRef);
  
  if (categorySnap.exists()) {
    return { id: categorySnap.id, ...categorySnap.data() };
  }
  
  return null;
};

// إنشاء فئة جديدة
export const createCategory = async (categoryData: any) => {
  const categoriesRef = collection(db, 'categories');
  const newCategory = {
    ...categoryData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(categoriesRef, newCategory);
  return { id: docRef.id, ...newCategory };
};

// تحديث بيانات فئة
export const updateCategory = async (categoryId: string, categoryData: any) => {
  const categoryRef = doc(db, 'categories', categoryId);
  const updatedData = {
    ...categoryData,
    updatedAt: serverTimestamp()
  };
  
  await updateDoc(categoryRef, updatedData);
  const updatedCategorySnap = await getDoc(categoryRef);
  
  if (updatedCategorySnap.exists()) {
    return { id: updatedCategorySnap.id, ...updatedCategorySnap.data() };
  }
  
  return null;
};

// حذف فئة
export const deleteCategory = async (categoryId: string) => {
  const categoryRef = doc(db, 'categories', categoryId);
  await deleteDoc(categoryRef);
  return true;
};

// الحصول على قائمة الفئات
export const getAllCategories = async () => {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// =====================
// وظائف الطلبات
// =====================

// الحصول على طلب حسب المعرف
export const getOrderById = async (orderId: string) => {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);
  
  if (orderSnap.exists()) {
    return { id: orderSnap.id, ...orderSnap.data() };
  }
  
  return null;
};

// إنشاء طلب جديد
export const createOrder = async (orderData: any) => {
  const ordersRef = collection(db, 'orders');
  const newOrder = {
    ...orderData,
    status: orderData.status || 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(ordersRef, newOrder);
  return { id: docRef.id, ...newOrder };
};

// تحديث بيانات طلب
export const updateOrder = async (orderId: string, orderData: any) => {
  const orderRef = doc(db, 'orders', orderId);
  const updatedData = {
    ...orderData,
    updatedAt: serverTimestamp()
  };
  
  await updateDoc(orderRef, updatedData);
  const updatedOrderSnap = await getDoc(orderRef);
  
  if (updatedOrderSnap.exists()) {
    return { id: updatedOrderSnap.id, ...updatedOrderSnap.data() };
  }
  
  return null;
};

// الحصول على طلبات المستخدم
export const getUserOrders = async (userId: string, limitCount = 10, startAfterDoc: any = null) => {
  const ordersRef = collection(db, 'orders');
  let q;
  
  if (startAfterDoc) {
    q = query(
      ordersRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'), 
      startAfter(startAfterDoc), 
      limit(limitCount)
    );
  } else {
    q = query(
      ordersRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'), 
      limit(limitCount)
    );
  }
  
  const querySnapshot = await getDocs(q);
  const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return {
    orders,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
  };
};

// الحصول على جميع الطلبات (للإدارة)
export const getAllOrders = async (limitCount = 20, startAfterDoc: any = null) => {
  const ordersRef = collection(db, 'orders');
  let q;
  
  if (startAfterDoc) {
    q = query(ordersRef, orderBy('createdAt', 'desc'), startAfter(startAfterDoc), limit(limitCount));
  } else {
    q = query(ordersRef, orderBy('createdAt', 'desc'), limit(limitCount));
  }
  
  const querySnapshot = await getDocs(q);
  const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return {
    orders,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
  };
};

// =====================
// وظائف عناصر الطلب
// =====================

// إضافة عنصر طلب
export const addOrderItem = async (orderItemData: any) => {
  const orderItemsRef = collection(db, 'orderItems');
  const newOrderItem = {
    ...orderItemData,
    createdAt: serverTimestamp()
  };
  
  const docRef = await addDoc(orderItemsRef, newOrderItem);
  return { id: docRef.id, ...newOrderItem };
};

// الحصول على عناصر طلب معين
export const getOrderItems = async (orderId: string) => {
  const orderItemsRef = collection(db, 'orderItems');
  const q = query(orderItemsRef, where('orderId', '==', orderId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// =====================
// وظائف سلة التسوق
// =====================

// الحصول على سلة المستخدم
export const getUserCart = async (userId: string) => {
  const cartsRef = collection(db, 'carts');
  const q = query(cartsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const cartDoc = querySnapshot.docs[0];
    return { id: cartDoc.id, ...cartDoc.data() };
  }
  
  // إنشاء سلة جديدة إذا لم تكن موجودة
  const newCart = {
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(cartsRef, newCart);
  return { id: docRef.id, ...newCart };
};

// إضافة عنصر إلى السلة
export const addCartItem = async (cartItemData: any) => {
  const cartItemsRef = collection(db, 'cartItems');
  
  // التحقق مما إذا كان العنصر موجودًا بالفعل
  const q = query(
    cartItemsRef, 
    where('cartId', '==', cartItemData.cartId),
    where('productId', '==', cartItemData.productId)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    // تحديث الكمية إذا كان العنصر موجودًا بالفعل
    const existingItem = querySnapshot.docs[0];
    const existingItemData = existingItem.data();
    
    await updateDoc(existingItem.ref, {
      quantity: existingItemData.quantity + cartItemData.quantity,
      updatedAt: serverTimestamp()
    });
    
    const updatedItemSnap = await getDoc(existingItem.ref);
    
    if (updatedItemSnap.exists()) {
      return { id: updatedItemSnap.id, ...updatedItemSnap.data() };
    }
  } else {
    // إضافة عنصر جديد إذا لم يكن موجودًا
    const newCartItem = {
      ...cartItemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(cartItemsRef, newCartItem);
    return { id: docRef.id, ...newCartItem };
  }
};

// تحديث كمية عنصر في السلة
export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  const cartItemRef = doc(db, 'cartItems', cartItemId);
  
  await updateDoc(cartItemRef, {
    quantity,
    updatedAt: serverTimestamp()
  });
  
  const updatedItemSnap = await getDoc(cartItemRef);
  
  if (updatedItemSnap.exists()) {
    return { id: updatedItemSnap.id, ...updatedItemSnap.data() };
  }
  
  return null;
};

// حذف عنصر من السلة
export const removeCartItem = async (cartItemId: string) => {
  const cartItemRef = doc(db, 'cartItems', cartItemId);
  await deleteDoc(cartItemRef);
  return true;
};

// الحصول على عناصر سلة معينة
export const getCartItems = async (cartId: string) => {
  const cartItemsRef = collection(db, 'cartItems');
  const q = query(cartItemsRef, where('cartId', '==', cartId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// =====================
// وظائف الإعدادات
// =====================

// الحصول على إعداد حسب المفتاح
export const getSetting = async (key: string) => {
  const settingsRef = collection(db, 'settings');
  const q = query(settingsRef, where('key', '==', key));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const settingDoc = querySnapshot.docs[0];
    return { id: settingDoc.id, ...settingDoc.data() };
  }
  
  return null;
};

// تعيين إعداد جديد أو تحديث إعداد موجود
export const setSetting = async (key: string, value: any) => {
  const settingsRef = collection(db, 'settings');
  const q = query(settingsRef, where('key', '==', key));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    // تحديث الإعداد إذا كان موجودًا
    const settingDoc = querySnapshot.docs[0];
    
    await updateDoc(settingDoc.ref, {
      value,
      updatedAt: serverTimestamp()
    });
    
    const updatedSettingSnap = await getDoc(settingDoc.ref);
    
    if (updatedSettingSnap.exists()) {
      return { id: updatedSettingSnap.id, ...updatedSettingSnap.data() };
    }
  } else {
    // إنشاء إعداد جديد إذا لم يكن موجودًا
    const newSetting = {
      key,
      value,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(settingsRef, newSetting);
    return { id: docRef.id, ...newSetting };
  }
};

// الحصول على جميع الإعدادات
export const getAllSettings = async () => {
  const settingsRef = collection(db, 'settings');
  const querySnapshot = await getDocs(settingsRef);
  
  const settings: Record<string, any> = {};
  
  querySnapshot.docs.forEach(doc => {
    const data = doc.data();
    settings[data.key] = data.value;
  });
  
  return settings;
};