import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  getUserData,
  signInWithGoogle,
  handleGoogleRedirect
} from "@/lib/firebase";

interface AuthContextProps {
  user: User | null;
  userData: any;
  loading: boolean;
  register: (email: string, password: string, username: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userData: null,
  loading: true,
  register: async () => ({ uid: "" } as User),
  login: async () => ({ uid: "" } as User),
  loginWithGoogle: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking auth state:", error);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const register = async (email: string, password: string, username: string) => {
    try {
      const newUser = await registerUser(email, password, username);
      setUser(newUser);
      
      const data = await getUserData(newUser.uid);
      setUserData(data);
      
      return newUser;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      
      const data = await getUserData(loggedInUser.uid);
      setUserData(data);
      
      return loggedInUser;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  // Check for Google redirect result on component mount
  useEffect(() => {
    const checkGoogleRedirect = async () => {
      try {
        const result = await handleGoogleRedirect();
        if (result) {
          setUser(result);
          const data = await getUserData(result.uid);
          setUserData(data);
        }
      } catch (error) {
        console.error("Error handling Google redirect:", error);
      }
    };

    checkGoogleRedirect();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      register, 
      login,
      loginWithGoogle, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
