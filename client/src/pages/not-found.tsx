import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from '@/hooks/use-translation';

// 404 Not Found page
export default function NotFoundPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-4xl font-bold text-gray-100 mb-6">{t('pageNotFound')}</h2>
        <p className="text-xl text-gray-400 mb-8">{t('pageNotFoundMessage')}</p>
        <Link href="/">
          <a className="inline-block bg-primary text-black font-medium px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
            {t('returnToHome')}
          </a>
        </Link>
      </div>
    </div>
  );
}