import React, { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define user type
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  profileImage?: string;
  role: string;
}

// Define credentials type
export interface LoginCredentials {
  username: string;
  password: string;
}

// Define registration data type
export interface RegisterData extends LoginCredentials {
  email: string;
  fullName?: string;
}

// Define auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const { toast } = useToast();
  
  // Fetch current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/user");
        if (res.status === 401) {
          return null;
        }
        return await res.json();
      } catch (error: any) {
        return null;
      }
    }
  });

  // Login mutation
  const loginMutation = useMutation<User, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/user'], userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.fullName || userData.username}!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation<User, Error, RegisterData>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/register", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/user'], userData);
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.fullName || userData.username}!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Logout failed");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/user'], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const authValue: AuthContextType = {
    user: user || null,
    isLoading,
    error,
    loginMutation,
    logoutMutation,
    registerMutation,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}