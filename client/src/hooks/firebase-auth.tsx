import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { firebaseConfig, authConfig } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// أنواع البيانات
type FirebaseAuthContextType = {
  currentUser: FirebaseUser | null;
  userRole: string | null;
  userData: any | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
};

// إنشاء السياق
const FirebaseAuthContext = createContext<FirebaseAuthContextType | null>(null);

// مزود المصادقة
export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // التحقق من دور المستخدم
  const checkUserRole = async (user: FirebaseUser) => {
    try {
      // التحقق مما إذا كان المستخدم من المشرفين
      if (authConfig.userRole.adminEmails.includes(user.email || '')) {
        setUserRole('admin');
        return 'admin';
      }

      // البحث عن معلومات المستخدم في Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // تحديث بيانات المستخدم ودوره
        const userData = userDoc.data();
        setUserData(userData);
        setUserRole(userData.role || authConfig.userRole.defaultRole);
        return userData.role || authConfig.userRole.defaultRole;
      } else {
        // إنشاء مستخدم جديد إذا لم يكن موجودًا بالفعل
        const newUserData = {
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          role: authConfig.userRole.defaultRole,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
        setUserRole(authConfig.userRole.defaultRole);
        return authConfig.userRole.defaultRole;
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      setUserRole(authConfig.userRole.defaultRole);
      return authConfig.userRole.defaultRole;
    }
  };

  // مراقبة حالة المصادقة
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await checkUserRole(user);
      } else {
        setUserRole(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting to sign in with:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in successful:", result.user);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا بك مجددًا ${result.user.displayName || email}`,
      });
      return true;
    } catch (error: any) {
      console.error("Firebase auth error:", error.code, error.message);
      let message = "حدث خطأ أثناء تسجيل الدخول";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.code === 'auth/too-many-requests') {
        message = "تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا";
      } else if (error.code === 'auth/network-request-failed') {
        message = "فشل الاتصال بالشبكة، تأكد من اتصالك بالإنترنت";
      } else if (error.code === 'auth/invalid-email') {
        message = "البريد الإلكتروني غير صحيح";
      } else {
        message = `خطأ: ${error.message}`;
      }
      
      toast({
        title: "فشل تسجيل الدخول",
        description: message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  // تسجيل الدخول باستخدام حساب Google
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      console.log("Attempting to sign in with Google");
      const provider = new GoogleAuthProvider();
      // Add scopes for better user data
      provider.addScope('profile');
      provider.addScope('email');
      
      // Use popup instead of redirect for easier debugging
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in successful:", result.user);
      
      // Create or update user document in Firestore
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: authConfig.userRole.adminEmails.includes(result.user.email || '') ? 'admin' : authConfig.userRole.defaultRole,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
      } else {
        // Update last login
        await setDoc(userDocRef, { lastLogin: new Date().toISOString() }, { merge: true });
      }
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا بك ${result.user.displayName}`,
      });
      return true;
    } catch (error: any) {
      console.error("Google auth error:", error.code, error.message);
      let message = "حدث خطأ أثناء تسجيل الدخول بحساب Google";
      
      if (error.code === 'auth/popup-closed-by-user') {
        message = "تم إغلاق نافذة تسجيل الدخول";
      } else if (error.code === 'auth/popup-blocked') {
        message = "تم حظر النافذة المنبثقة، يرجى السماح بالنوافذ المنبثقة لهذا الموقع";
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = "تم إلغاء طلب النافذة المنبثقة";
      } else if (error.code === 'auth/network-request-failed') {
        message = "فشل الاتصال بالشبكة، تأكد من اتصالك بالإنترنت";
      } else {
        message = `خطأ: ${error.message}`;
      }
      
      toast({
        title: "فشل تسجيل الدخول",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  // التسجيل باستخدام البريد الإلكتروني وكلمة المرور
  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    try {
      console.log("Attempting to register with:", email, displayName);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registration successful, updating profile:", result.user);
      
      // تحديث اسم العرض
      await updateProfile(result.user, { displayName });
      
      // إنشاء وثيقة المستخدم في Firestore
      const userDocRef = doc(db, 'users', result.user.uid);
      await setDoc(userDocRef, {
        email,
        displayName,
        role: authConfig.userRole.adminEmails.includes(email) ? 'admin' : authConfig.userRole.defaultRole,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "تم التسجيل بنجاح",
        description: `مرحبًا بك ${displayName}`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Firebase registration error:", error.code, error.message);
      let message = "حدث خطأ أثناء التسجيل";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "البريد الإلكتروني مستخدم بالفعل";
      } else if (error.code === 'auth/weak-password') {
        message = "كلمة المرور ضعيفة جدًا، يرجى استخدام كلمة مرور أطول";
      } else if (error.code === 'auth/invalid-email') {
        message = "البريد الإلكتروني غير صالح";
      } else if (error.code === 'auth/network-request-failed') {
        message = "فشل الاتصال بالشبكة، تأكد من اتصالك بالإنترنت";
      } else {
        message = `خطأ: ${error.message}`;
      }
      
      toast({
        title: "فشل التسجيل",
        description: message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  // تسجيل الخروج
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  // إعادة تعيين كلمة المرور
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      console.log("Attempting to send password reset email to:", email);
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully");
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "يرجى التحقق من بريدك الإلكتروني",
      });
      return true;
    } catch (error: any) {
      console.error("Password reset error:", error.code, error.message);
      let message = "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور";
      
      if (error.code === 'auth/user-not-found') {
        message = "لم يتم العثور على مستخدم بهذا البريد الإلكتروني";
      } else if (error.code === 'auth/invalid-email') {
        message = "البريد الإلكتروني غير صالح";
      } else if (error.code === 'auth/missing-email') {
        message = "يرجى إدخال البريد الإلكتروني";
      } else if (error.code === 'auth/network-request-failed') {
        message = "فشل الاتصال بالشبكة، تأكد من اتصالك بالإنترنت";
      } else {
        message = `خطأ: ${error.message}`;
      }
      
      toast({
        title: "فشل إعادة تعيين كلمة المرور",
        description: message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    loginWithEmail,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

// Hook لاستخدام المصادقة
export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  
  return context;
}