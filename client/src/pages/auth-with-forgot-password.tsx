import React, { useState, useEffect } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Auth page with login, registration, and forgot password forms
export default function AuthPage() {
  const { t, rtl } = useTranslation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [location] = useLocation();
  
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
  }, [location]);
  
  // If user is logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="min-h-screen flex items-stretch bg-gray-950">
      {/* Auth form section */}
      <div className={`w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center ${rtl ? 'order-2' : 'order-1'}`}>
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
            <LoginForm 
              onToggleMode={() => setAuthMode('register')} 
              onForgotPassword={() => setAuthMode('forgot-password')} 
            />
          ) : authMode === 'register' ? (
            <RegisterForm onToggleMode={() => setAuthMode('login')} />
          ) : (
            <ForgotPasswordForm onBack={() => setAuthMode('login')} />
          )}
        </div>
      </div>
      
      {/* Hero section */}
      <div className={`hidden md:block md:w-1/2 bg-gray-900 p-16 ${rtl ? 'order-1' : 'order-2'}`}>
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

// Login form schema
const loginSchema = z.object({
  username: z.string().min(2, { 
    message: "Username must be at least 2 characters." 
  }),
  password: z.string().min(6, { 
    message: "Password must be at least 6 characters." 
  }),
});

// Login form component
function LoginForm({ onToggleMode, onForgotPassword }: { onToggleMode: () => void, onForgotPassword: () => void }) {
  const { t } = useTranslation();
  const { loginMutation } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data);
  });
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-200">
          {t('username')}
        </label>
        <input
          id="username"
          {...register('username')}
          className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.username && (
          <span className="text-sm text-red-500">{errors.username.message}</span>
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
        disabled={loginMutation.isPending}
        className="w-full rounded-md bg-primary px-4 py-3 text-black font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loginMutation.isPending ? t('loggingIn') : t('login')}
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

// Register form schema
const registerSchema = z.object({
  username: z.string().min(2, { 
    message: "Username must be at least 2 characters." 
  }),
  email: z.string().email({ 
    message: "Please enter a valid email address." 
  }),
  password: z.string().min(6, { 
    message: "Password must be at least 6 characters." 
  }),
  fullName: z.string().optional(),
});

// Register form component
function RegisterForm({ onToggleMode }: { onToggleMode: () => void }) {
  const { t } = useTranslation();
  const { registerMutation } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      fullName: '',
    },
  });
  
  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data);
  });
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-200">
          {t('username')} *
        </label>
        <input
          id="username"
          {...register('username')}
          className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.username && (
          <span className="text-sm text-red-500">{errors.username.message}</span>
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
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">
          {t('fullName')}
        </label>
        <input
          id="fullName"
          {...register('fullName')}
          className="block w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.fullName && (
          <span className="text-sm text-red-500">{errors.fullName.message}</span>
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
        disabled={registerMutation.isPending}
        className="w-full rounded-md bg-primary px-4 py-3 text-black font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {registerMutation.isPending ? t('registering') : t('register')}
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

// Forgot password form schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ 
    message: "Please enter a valid email address." 
  }),
});

// Forgot password form component
function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    // TODO: Implement forgot password functionality with Firebase
    // For now, just simulate a successful response
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
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