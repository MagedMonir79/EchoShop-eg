import React, { useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// تكوين Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "823576125541",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// طباعة بيانات التكوين للتصحيح (مع إخفاء المفاتيح الحساسة)
console.log("Firebase Config:", {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId
});

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function FirebaseSimpleAuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState('');

  // مراقبة حالة المستخدم
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is signed in:", currentUser);
        setUser(currentUser);
        setStatusMessage(`تم تسجيل الدخول كـ ${currentUser.displayName || currentUser.email}`);
      } else {
        console.log("User is signed out");
        setUser(null);
        setStatusMessage('');
      }
    });

    return () => unsubscribe();
  }, []);

  // وظائف المصادقة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        console.log("Attempting to login with:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful:", userCredential.user);
        setStatusMessage(`تم تسجيل الدخول بنجاح كـ ${userCredential.user.displayName || email}`);
      } else {
        console.log("Attempting to register with:", email, displayName);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registration successful, updating profile:", userCredential.user);
        
        // تحديث اسم العرض
        await updateProfile(userCredential.user, { displayName });
        
        // إنشاء وثيقة المستخدم في Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          displayName,
          role: 'customer',
          createdAt: new Date().toISOString(),
        });
        
        setStatusMessage(`تم التسجيل بنجاح كـ ${displayName}`);
      }
    } catch (error: any) {
      console.error("Firebase auth error:", error.code, error.message);
      
      let message = "حدث خطأ";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "البريد الإلكتروني مستخدم بالفعل";
      } else if (error.code === 'auth/weak-password') {
        message = "كلمة المرور ضعيفة جدًا";
      } else if (error.code === 'auth/invalid-email') {
        message = "البريد الإلكتروني غير صالح";
      } else if (error.code === 'auth/network-request-failed') {
        message = "فشل الاتصال بالشبكة";
      } else {
        message = `خطأ: ${error.message || 'غير معروف'}`;
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول باستخدام Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log("Attempting to sign in with Google");
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in successful:", result.user);
      
      // إنشاء أو تحديث وثيقة المستخدم في Firestore
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'customer',
          createdAt: new Date().toISOString(),
        });
      }
      
      setStatusMessage(`تم تسجيل الدخول بنجاح كـ ${result.user.displayName}`);
    } catch (error: any) {
      console.error("Google auth error:", error.code, error.message);
      
      let message = "حدث خطأ أثناء تسجيل الدخول بحساب Google";
      if (error.code === 'auth/popup-closed-by-user') {
        message = "تم إغلاق نافذة تسجيل الدخول";
      } else if (error.code === 'auth/popup-blocked') {
        message = "تم حظر النافذة المنبثقة";
      } else {
        message = `خطأ: ${error.message || 'غير معروف'}`;
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setStatusMessage("تم تسجيل الخروج بنجاح");
    } catch (error) {
      console.error("Logout error:", error);
      setError("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          اختبار المصادقة مع Firebase
        </h1>
        
        {statusMessage && (
          <div className="mb-6 p-3 bg-green-800/30 border border-green-800/50 rounded-md text-center text-green-400">
            {statusMessage}
          </div>
        )}
        
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-700 rounded-md">
              <p className="text-gray-200 mb-2"><span className="font-semibold">البريد:</span> {user.email}</p>
              <p className="text-gray-200 mb-2"><span className="font-semibold">الاسم:</span> {user.displayName || 'غير محدد'}</p>
              <p className="text-gray-200"><span className="font-semibold">المعرف:</span> {user.uid}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => { setIsLogin(true); resetForm(); }}
                className={`px-4 py-2 rounded-md ${isLogin ? 'bg-primary text-black' : 'bg-gray-700 text-gray-300'}`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => { setIsLogin(false); resetForm(); }}
                className={`px-4 py-2 rounded-md ${!isLogin ? 'bg-primary text-black' : 'bg-gray-700 text-gray-300'}`}
              >
                إنشاء حساب
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-900/50 rounded-md text-center text-red-400">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-gray-300 mb-1">الاسم</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded-md"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-gray-300 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded-md"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary text-black rounded-md hover:bg-primary/90 transition-colors"
                disabled={loading}
              >
                {loading
                  ? 'جارٍ التحميل...'
                  : isLogin
                    ? 'تسجيل الدخول'
                    : 'إنشاء حساب'}
              </button>
            </form>
            
            <div className="my-4 relative flex items-center justify-center">
              <div className="border-t border-gray-600 absolute w-full"></div>
              <div className="bg-gray-800 px-4 relative text-gray-400 text-sm">أو</div>
            </div>
            
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2 px-4 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              تسجيل الدخول بحساب Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}