import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// تكوين Firebase
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "823576125541", // يمكن تركه كما هو لأنه ثابت
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// نهج المصادقة مع Firebase
export const authConfig = {
  signInRedirectPath: "/auth", // مسار إعادة التوجيه عند عدم المصادقة
  signInSuccessPath: "/", // مسار إعادة التوجيه بعد المصادقة
  userRole: {
    adminEmails: ["admin@echoshop-eg.com"], // قائمة بريد المشرفين
    defaultRole: "customer" // الدور الافتراضي للمستخدمين الجدد
  }
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// الحصول على المستخدم الحالي
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// الحصول على بيانات المستخدم من Firestore
export const getUserData = async (uid: string) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('No user data found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// تسجيل مستخدم جديد
export const registerUser = async (email: string, password: string, username: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // إنشاء وثيقة المستخدم في Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      username,
      role: authConfig.userRole.adminEmails.includes(email) 
        ? 'admin' 
        : authConfig.userRole.defaultRole,
      createdAt: new Date().toISOString(),
    });
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// تسجيل الدخول
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// تسجيل الخروج
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// تسجيل الدخول باستخدام Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// معالجة نتيجة تسجيل الدخول بـ Google بعد إعادة التوجيه
export const handleGoogleRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      
      // التحقق مما إذا كان المستخدم موجودًا بالفعل في Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // إنشاء وثيقة المستخدم في Firestore إذا لم تكن موجودة
        await setDoc(userDocRef, {
          email: user.email,
          username: user.displayName || user.email?.split('@')[0],
          role: authConfig.userRole.adminEmails.includes(user.email || '') 
            ? 'admin' 
            : authConfig.userRole.defaultRole,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }
      
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error handling Google redirect:', error);
    throw error;
  }
};