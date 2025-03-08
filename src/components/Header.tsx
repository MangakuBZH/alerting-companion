
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  return (
    <header className="w-full py-4 px-6 glass-card animate-slide-down">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-guardian rounded-full flex items-center justify-center">
              <div className="h-6 w-6 bg-white/90 rounded-full" />
            </div>
            <span className="text-xl font-semibold text-guardian">{t('app.name')}</span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              {[
                { path: '/', label: t('nav.home') },
                { path: '/monitor', label: t('nav.monitoring') },
                { path: '/configure', label: t('nav.configuration') },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all duration-300",
                    location.pathname === path
                      ? "bg-guardian text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
