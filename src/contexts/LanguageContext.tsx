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

/**
 * Language Provider - Manages i18n state and translations
 * Supports French and English with localStorage persistence
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function - returns translated string or fallback
  const t = (key: string): string => {
    return translations[language][key] || translations.fr[key] || key;
  };

  // Update document metadata when language changes
  const updateMetaTags = () => {
    document.documentElement.lang = language;
    document.title = t('meta.title');
    
    const metaTags = [
      { selector: 'meta[name="description"]', content: t('meta.description') },
      { selector: 'meta[property="og:title"]', content: t('meta.ogTitle') },
      { selector: 'meta[property="og:description"]', content: t('meta.ogDescription') }
    ];

    metaTags.forEach(({ selector, content }) => {
      const element = document.querySelector(selector);
      if (element) element.setAttribute('content', content);
    });
  };

  // Initialize language from URL path or localStorage
  useEffect(() => {
    const pathLang = window.location.pathname.split('/')[1] as Language;
    const savedLang = localStorage.getItem('language') as Language;
    
    if (pathLang === 'fr' || pathLang === 'en') {
      setLanguage(pathLang);
    } else if (savedLang === 'fr' || savedLang === 'en') {
      setLanguage(savedLang);
    }
  }, []);

  // Update meta tags when language changes
  useEffect(() => {
    updateMetaTags();
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
