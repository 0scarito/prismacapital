import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import fr from '../i18n/fr.json';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = { fr, en };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const pathLang = window.location.pathname.split('/')[1] as Language;
    const saved = localStorage.getItem('language') as Language;
    if (pathLang === 'fr' || pathLang === 'en') {
      setLanguage(pathLang);
    } else if (saved === 'fr' || saved === 'en') {
      setLanguage(saved);
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || translations.fr[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('meta.title');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t('meta.description'));
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', t('meta.ogTitle'));
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', t('meta.ogDescription'));
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);

    // Update URL path
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(fr|en)/, '') || '/';
    const newPath = `/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    window.history.pushState({}, '', newPath);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
