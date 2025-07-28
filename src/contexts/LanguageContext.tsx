import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  // Navigation
  'nav.howItWorks': {
    fr: 'Comment ça marche',
    en: 'How it works'
  },
  'nav.investments': {
    fr: 'Investissements',
    en: 'Investments'
  },
  'nav.partners': {
    fr: 'Partenaires', 
    en: 'Partners'
  },
  'nav.security': {
    fr: 'Sécurité',
    en: 'Security'
  },
  'nav.faq': {
    fr: 'FAQ',
    en: 'FAQ'
  },
  'nav.mySpace': {
    fr: 'Mon Espace',
    en: 'My Space'
  },
  'nav.payment': {
    fr: 'Paiement',
    en: 'Payment'
  },
  'nav.joinUs': {
    fr: 'Se connecter',
    en: 'Join us'
  },
  
  // Hero Section
  'hero.title': {
    fr: 'Offrez une part de demain.',
    en: 'Gift a stake in tomorrow.'
  },
  'hero.subtitle': {
    fr: 'Transformez 200€ en vraies parts dans des start-ups françaises—magnifiquement emballées, prêtes à inspirer.',
    en: 'Turn €200 into real equity in French start‑ups—beautifully boxed, ready to inspire.'
  },
  'hero.chooseGift': {
    fr: 'Choisir un cadeau',
    en: 'Choose a Gift'
  },
  'hero.whatWeDo': {
    fr: 'Notre mission',
    en: 'What we do'
  },
  
  // How It Works
  'howItWorks.title': {
    fr: 'Comment ça marche',
    en: 'How It Works'
  },
  'howItWorks.subtitle': {
    fr: 'Trois étapes simples pour transformer l\'épargne en propriété d\'actions',
    en: 'Three simple steps to transform savings into equity ownership'
  },
  'howItWorks.seeHow': {
    fr: 'Voir comment ça marche',
    en: 'See how it works'
  },
  
  // Risk Warnings
  'risk.privateEquity': {
    fr: 'Le capital-investissement présente des risques élevés de perte en capital et une liquidité limitée. Investissement recommandé pour investisseurs expérimentés uniquement.',
    en: 'Private equity presents high risks of capital loss and limited liquidity. Investment recommended for experienced investors only.'
  },
  'risk.crypto': {
    fr: 'Les crypto-actifs sont des investissements extrêmement volatils et non réglementés. Risque de perte totale du capital investi.',
    en: 'Crypto-assets are extremely volatile and unregulated investments. Risk of total loss of invested capital.'
  },
  'risk.realEstate': {
    fr: 'Le crowdfunding immobilier présente des risques de liquidité et de marché. Les rendements passés ne préjugent pas des rendements futurs.',
    en: 'Real estate crowdfunding presents liquidity and market risks. Past returns do not predict future returns.'
  },
  'risk.ventureCapital': {
    fr: 'Le capital-risque est un investissement à haut risque avec une probabilité élevée de perte totale. Horizon d\'investissement de 5-10 ans minimum.',
    en: 'Venture capital is a high-risk investment with high probability of total loss. Minimum investment horizon of 5-10 years.'
  },
  'risk.commodities': {
    fr: 'Les matières premières sont soumises à une forte volatilité liée aux facteurs géopolitiques et climatiques. Diversification recommandée.',
    en: 'Commodities are subject to high volatility related to geopolitical and climate factors. Diversification recommended.'
  },
  'risk.etf': {
    fr: 'Les ETF diversifiés présentent un risque modéré lié aux fluctuations des marchés financiers. Investissement à moyen-long terme recommandé.',
    en: 'Diversified ETFs present moderate risk related to financial market fluctuations. Medium-long term investment recommended.'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Check localStorage for saved language preference
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update URL path
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(fr|en)/, '') || '/';
    const newPath = `/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    window.history.pushState({}, '', newPath);
  };

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (!translation) return key;
    return translation[language] || translation.fr || key;
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