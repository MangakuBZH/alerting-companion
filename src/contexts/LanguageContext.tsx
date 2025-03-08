
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return (savedLanguage as Language) || 
           (navigator.language.startsWith('fr') ? 'fr' : 'en');
  });
  
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});
  
  useEffect(() => {
    const loadTranslations = async () => {
      const [frTranslations, enTranslations] = await Promise.all([
        import('../locales/fr.json'),
        import('../locales/en.json')
      ]);
      
      setTranslations({
        fr: frTranslations.default,
        en: enTranslations.default
      });
    };
    
    loadTranslations();
  }, []);
  
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    document.documentElement.lang = language;
  }, [language]);
  
  const t = (key: string): string => {
    if (!translations[language]) return key;
    
    return translations[language][key] || translations['en'][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
