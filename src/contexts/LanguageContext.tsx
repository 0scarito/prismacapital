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
  'nav.whatWeDo': {
    fr: 'Notre mission',
    en: 'What we do'
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
    fr: 'Notre mission',
    en: 'What we do'
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
    fr: "Avertissement Important sur les Risques\nNiveau de risque : 6/7 (Private Equity)\nLes investissements en private equity présentent un risque élevé de perte en capital.\nVotre capital n'est pas garanti et peut diminuer significativement.\nHorizon d'investissement : 5 à 10 ans minimum recommandé.\nFaible liquidité : revente avant terme souvent impossible ou fortement décotée.\nLes performances passées ne préjugent pas des performances futures.",
    en: "Important Risk Warning\nRisk level : 6 / 7 (Private Equity)\nPrivate-equity investments carry a high risk of capital loss.\nYour capital is not guaranteed and may fall significantly in value.\nRecommended holding period : at least five to ten years.\nLow liquidity : early resale is often impossible or may incur a heavy discount.\nPast performance is not a guide to future returns."
  },
  'risk.crypto': {
    fr: "Avertissement Important sur les Risques\nNiveau de risque : 7/7 (Crypto-actifs)\nLes crypto-actifs sont extrêmement volatils et exposés aux risques technologiques, réglementaires et de marché.\nVotre capital entier peut être perdu.\nHorizon recommandé : très long terme ou purement spéculatif.\nLa liquidité varie et des risques opérationnels existent (piratage, défaillance de plateforme).\nLes performances passées ne préjugent pas des performances futures.",
    en: "Important Risk Warning\nRisk level : 7 / 7 (Crypto Assets)\nCrypto assets are extremely volatile and exposed to technological, regulatory and market risks.\nYour entire capital may be lost.\nRecommended horizon : very long-term or purely speculative.\nLiquidity varies and operational risks exist (hacking, platform failure).\nPast performance is not a guide to future returns."
  },
  'risk.realEstate': {
    fr: "Avertissement Important sur les Risques\nNiveau de risque : 5/7 (Immobilier en crowdfunding)\nL'immobilier en crowdfunding implique un risque de perte partielle ou totale du capital et d'illiquidité.\nHorizon recommandé : trois à sept ans.\nLa liquidité est limitée ; les remboursements dépendent du succès du projet.\nLes performances passées ne préjugent pas des performances futures.",
    en: "Important Risk Warning\nRisk level : 5 / 7 (Real-Estate Crowdfunding)\nReal-estate crowdfunding involves a risk of partial or total capital loss and illiquidity.\nRecommended horizon : three to seven years.\nLiquidity is limited; repayments depend on project success.\nPast performance is not a guide to future returns."
  },
  'risk.ventureCapital': {
    fr: "Avertissement Important sur les Risques\nNiveau de risque : 7/7 (Venture Capital)\nLes investissements en capital-risque comportent un risque très élevé de perte en capital ; la plupart des entreprises peuvent ne jamais générer de liquidité.\nHorizon recommandé : au moins sept à douze ans.\nIlliquidité complète jusqu'à la sortie (vente ou IPO).\nLes performances passées ne préjugent pas des performances futures.",
    en: "Important Risk Warning\nRisk level : 7 / 7 (Venture Capital)\nVenture-capital investments entail a very high risk of capital loss; most companies may never generate liquidity.\nRecommended horizon : at least seven to twelve years.\nComplete illiquidity until exit (sale or IPO).\nPast performance is not a guide to future returns."
  },
  'risk.commodities': {
    fr: "Avertissement Important sur les Risques\nNiveau de risque : 5/7 (Matières premières)\nLes investissements en matières premières sont volatils et influencés par des facteurs géopolitiques et climatiques ; les valeurs du capital peuvent fluctuer fortement.\nHorizon recommandé : moyen à long terme (≥ 5 ans).\nLa liquidité varie selon l'instrument (futures, ETC, fonds, etc.).\nLes performances passées ne préjugent pas des performances futures.",
    en: "Important Risk Warning\nRisk level : 5 / 7 (Commodities)\nCommodity investments are volatile and influenced by geopolitical and climatic factors; capital values can fluctuate sharply.\nRecommended horizon : medium to long term (≥ 5 years).\nLiquidity varies by instrument (futures, ETCs, funds, etc.).\nPast performance is not a guide to future returns."
  },
  'risk.etf': {
    fr: "Avertissement Important sur les Risques\nNiveau de risque : 3/7 (ETF diversifiés)\nMême les ETF qui suivent des indices larges restent soumis aux fluctuations des marchés d'actions et d'obligations ; la valeur de votre capital peut chuter.\nHorizon recommandé : moyen à long terme (≥ 5 ans).\nLa liquidité est généralement élevée, mais les prix peuvent être volatils à court terme.\nLes performances passées ne préjugent pas des performances futures.",
    en: "Important Risk Warning\nRisk level : 3 / 7 (Diversified ETFs)\nEven ETFs that track broad indices remain subject to equity and bond-market swings; the value of your capital may fall.\nRecommended horizon : medium to long term (≥ 5 years).\nLiquidity is generally high, but prices can be volatile in the short term.\nPast performance is not a guide to future returns."
  },

  'footer.riskWarning.title': {
    fr: 'Avertissement sur les Risques',
    en: 'Risk Warning'
  },
  
  // Footer Links
  'footer.legal': {
    fr: 'Légal & Conformité',
    en: 'Legal & Compliance'
  },
  'footer.legalNotices': {
    fr: 'Mentions Légales',
    en: 'Legal Notices'
  },
  'footer.riskDisclosure': {
    fr: 'Divulgation des Risques',
    en: 'Risk Disclosure'
  },
  'footer.privacy': {
    fr: 'Politique de Confidentialité',
    en: 'Privacy Policy'
  },
  'footer.cookies': {
    fr: 'Paramètres Cookies',
    en: 'Cookie Settings'
  },
  'footer.support': {
    fr: 'Support & Documentation',
    en: 'Support & Documentation'
  },
  'footer.helpCenter': {
    fr: 'Centre d\'Aide',
    en: 'Help Centre'
  },
  'footer.contactSupport': {
    fr: 'Contact Support',
    en: 'Contact Support'
  },
  'footer.dici': {
    fr: 'Documentation DICI',
    en: 'DICI Documentation'
  },
  'footer.esg': {
    fr: 'Rapports ESG',
    en: 'ESG Reports'
  },

  // Social Proof Section
  'socialProof.trustedBy': {
    fr: 'Partenaires r\u00e9glement\u00e9s de confiance',
    en: 'Trusted by regulated partners'
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