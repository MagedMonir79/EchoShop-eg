import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/hooks/firebase-auth';
import { useTranslation } from '@/hooks/use-translation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect } from 'wouter';

// Auth page with login and registration for Firebase
export default function FirebaseAuthPage() {
  const { t, language } = useTranslation();
  const { currentUser, loading } = useFirebaseAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const isRtl = language === 'ar';
  
  // Parse URL params to determine mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'register') {
      setAuthMode('register');
    } else if (tabParam === 'forgot-password') {
      setAuthMode('forgot-password');
    } else {
      setAuthMode('login');
    }
  }, []);
  
  // If user is logged in, redirect to home
  if (currentUser) {
    return <Redirect to="/" />;
  }
  
  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-stretch bg-gray-950">
      {/* Auth form section */}
      <div className={`w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center ${isRtl ? 'order-2' : 'order-1'}`}>
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6 text-white">
            {authMode === 'login' 
              ? t('login') 
              : authMode === 'register' 
                ? t('register') 
                : t('forgotPassword')}
          </h1>
          
          {/* Auth form */}
          {authMode === 'login' ? (
            <FirebaseLoginForm 
              onToggleMode={() => setAuthMode('register')} 
              onForgotPassword={() => setAuthMode('forgot-password')} 
            />
          ) : authMode === 'register' ? (
            <FirebaseRegisterForm onToggleMode={() => setAuthMode('login')} />
          ) : (
            <FirebaseForgotPasswordForm onBack={() => setAuthMode('login')} />
          )}
        </div>
      </div>
      
      {/* Hero section */}
      <div className={`hidden md:block md:w-1/2 bg-gray-900 p-16 ${isRtl ? 'order-1' : 'order-2'}`}>
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6 text-primary">EchoShop</h2>
          <p className="text-xl text-gray-300 mb-6">
            {t('authPageHeroDescription')}
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-primary h-4 w-4 rounded-full"></div>
              <p className="text-gray-300">{t('authPageBenefit1')}</p>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-primary h-4 w-4 rounded-full"></div>
              <p className="text-gray-300">{t('authPageBenefit2')}</p>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-primary h-4 w-4 rounded-full"></div>
              <p className="text-gray-300">{t('authPageBenefit3')}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Firebase Login form schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  password: z.string().min(6, { 
    message: "Password must be at least 6 characters." 
  }),
});

// Firebase Login form component
function FirebaseLoginForm({ onToggleMode, onForgotPassword }: { onToggleMode: () => void, onForgotPassword: () => void }) {
  const { t } = useTranslation();
  const { loginWithEmail, loginWithGoogle } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    await loginWithEmail(data.email, data.password);
    setIsLoading(false);
  });
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle();
    setIsLoading(false);
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block text-sm font-medium text-gray-200">
            {t('password')}
          </label>
          <button 
            type="button"
            onClick={onForgotPassword}
            className="text-primary hover:underline text-xs"
          >
            {t('forgotPassword')}
          </button>
        </div>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.password && (
          <span className="text-sm text-red-500">{errors.password.message}</span>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary px-4 py-3 text-black font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? t('loggingIn') : t('login')}
      </button>
      
      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-700 absolute w-full"></div>
        <div className="bg-gray-950 px-4 relative text-gray-400 text-sm">
          {t('orContinueWith')}
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center rounded-md bg-white px-4 py-3 text-black font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        Google
      </button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-primary hover:underline text-sm"
        >
          {t('dontHaveAccount')}
        </button>
      </div>
    </form>
  );
}

// Firebase Register form schema
const registerSchema = z.object({
  email: z.string().email({ 
    message: "Please enter a valid email address." 
  }),
  password: z.string().min(6, { 
    message: "Password must be at least 6 characters." 
  }),
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters."
  }),
});

// Firebase Register form component
function FirebaseRegisterForm({ onToggleMode }: { onToggleMode: () => void }) {
  const { t } = useTranslation();
  const { register: firebaseRegister, loginWithGoogle } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
    },
  });
  
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    await firebaseRegister(data.email, data.password, data.displayName);
    setIsLoading(false);
  });
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle();
    setIsLoading(false);
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-200">
          {t('fullName')} *
        </label>
        <input
          id="displayName"
          {...register('displayName')}
          className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.displayName && (
          <span className="text-sm text-red-500">{errors.displayName.message}</span>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
          {t('email')} *
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-200">
          {t('password')} *
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.password && (
          <span className="text-sm text-red-500">{errors.password.message}</span>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary px-4 py-3 text-black font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? t('registering') : t('register')}
      </button>
      
      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-700 absolute w-full"></div>
        <div className="bg-gray-950 px-4 relative text-gray-400 text-sm">
          {t('orContinueWith')}
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center rounded-md bg-white px-4 py-3 text-black font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        Google
      </button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-primary hover:underline text-sm"
        >
          {t('alreadyHaveAccount')}
        </button>
      </div>
    </form>
  );
}

// Firebase Forgot password form schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ 
    message: "Please enter a valid email address." 
  }),
});

// Firebase Forgot password form component
function FirebaseForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { resetPassword } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    const success = await resetPassword(data.email);
    if (success) {
      setIsSubmitted(true);
    }
    setIsLoading(false);
  });
  
  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-900/20 border border-green-900/30 rounded-md">
          <h3 className="text-green-400 font-medium mb-2">{t('resetLinkSent')}</h3>
          <p className="text-gray-300 text-sm">{t('resetLinkInstructions')}</p>
        </div>
        
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-md bg-primary px-4 py-3 text-black font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {t('backToLogin')}
        </button>
      </div>
    );
  }
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <p className="text-gray-300 text-sm mb-4">
        {t('forgotPasswordInstructions')}
      </p>
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>
      
      <div className="flex flex-col space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-primary px-4 py-3 text-black font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('sending') : t('sendResetLink')}
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-md bg-gray-700 px-4 py-3 text-white font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
        >
          {t('backToLogin')}
        </button>
      </div>
    </form>
  );
}