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
  'nav.home': {
    fr: 'Accueil',
    en: 'Home'
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
  },

  // FAQ Page
  'faq.title': {
    fr: 'Questions Fréquentes',
    en: 'Frequently Asked Questions'
  },
  'faq.subtitle': {
    fr: 'Trouvez rapidement les réponses à vos questions sur Prisma Capital,\n                nos investissements et notre processus.',
    en: 'Quickly find answers about Prisma Capital, our investments and our process.'
  },
  'faq.searchPlaceholder': {
    fr: 'Rechercher dans la FAQ...',
    en: 'Search the FAQ...'
  },
  'faq.noResultsTitle': {
    fr: 'Aucun résultat',
    en: 'No results'
  },
  'faq.noResultsDescription': {
    fr: "Nous n'avons trouvé aucune question similaire. N'hésitez pas à contacter notre équipe.",
    en: 'We found no similar question. Feel free to contact our team.'
  },
  'faq.contactTitle': {
    fr: "Besoin d'aide supplémentaire ?",
    en: 'Need more help?'
  },
  'faq.contactSubtitle': {
    fr: "Notre équipe est là pour vous accompagner dans votre parcours d'investissement.",
    en: 'Our team is here to guide you on your investment journey.'
  },
  'faq.contact.chat.title': {
    fr: 'Chat en Direct',
    en: 'Live Chat'
  },
  'faq.contact.chat.desc': {
    fr: 'Disponible du lundi au vendredi, 9h-18h',
    en: 'Available Monday to Friday, 9am‑6pm'
  },
  'faq.contact.chat.btn': {
    fr: 'Démarrer le Chat',
    en: 'Start Chat'
  },
  'faq.contact.email.title': {
    fr: 'Email',
    en: 'Email'
  },
  'faq.contact.email.desc': {
    fr: 'Réponse sous 24h ouvrées',
    en: 'Response within 24h on business days'
  },
  'faq.contact.email.btn': {
    fr: 'Envoyer un Email',
    en: 'Send an Email'
  },
  'faq.contact.phone.title': {
    fr: 'Téléphone',
    en: 'Phone'
  },
  'faq.contact.phone.desc': {
    fr: 'Pour les questions urgentes',
    en: 'For urgent questions'
  },
  'faq.contact.phone.btn': {
    fr: 'Nous Appeler',
    en: 'Call Us'
  },

  'faq.general.title': {
    fr: 'Généralités',
    en: 'General'
  },
  'faq.general.q1.q': {
    fr: "Qu'est-ce que Prisma Capital exactement ?",
    en: 'What exactly is Prisma Capital?'
  },
  'faq.general.q1.a': {
    fr: "Prisma Capital est une plateforme qui démocratise l'accès au capital-risque en proposant des cadeaux d'investissement. Nous permettons d'offrir des parts dans des start-ups françaises vérifiées sous forme de cartes-cadeaux physiques de €200.",
    en: 'Prisma Capital is a platform democratizing venture capital through investment gifts. We let you give shares in vetted French start-ups via €200 physical gift cards.'
  },
  'faq.general.q2.q': {
    fr: 'Comment fonctionne le système de cartes-cadeaux ?',
    en: 'How does the gift-card system work?'
  },
  'faq.general.q2.a': {
    fr: "Vous achetez une carte-cadeau physique de €200 que vous offrez. Le bénéficiaire scanne le QR code, complète son profil d'investisseur, et choisit le secteur dans lequel investir parmi nos portefeuilles diversifiés.",
    en: 'You purchase a €200 physical gift card to give. The recipient scans the QR code, completes their investor profile and chooses the sector to invest in from our diversified portfolios.'
  },
  'faq.general.q3.q': {
    fr: 'Est-ce légal et régulé ?',
    en: 'Is it legal and regulated?'
  },
  'faq.general.q3.a': {
    fr: "Oui, toutes nos activités sont supervisées par l'AMF (Autorité des Marchés Financiers) sous l'agrément FR-2024-15. Nos partenaires d'exécution sont des Conseillers en Investissements Participatifs agréés.",
    en: 'Yes, all our activities are supervised by the AMF (Autorité des Marchés Financiers) under license FR-2024-15. Our execution partners are licensed crowdfunding advisers.'
  },

  'faq.investments.title': {
    fr: 'Investissements',
    en: 'Investments'
  },
  'faq.investments.q1.q': {
    fr: "Dans quoi j'investis exactement ?",
    en: 'What exactly am I investing in?'
  },
  'faq.investments.q1.a': {
    fr: "Vous investissez dans des portefeuilles diversifiés de 5-8 start-ups françaises par secteur (Clean-Tech, IA, Food-Tech, etc.). Chaque entreprise est vérifiée par notre équipe de due diligence et nos partenaires AMF.",
    en: 'You invest in diversified portfolios of 5–8 French start-ups per sector (clean-tech, AI, food-tech, etc.). Each company is vetted by our due‑diligence team and AMF partners.'
  },
  'faq.investments.q2.q': {
    fr: 'Quels sont les risques ?',
    en: 'What are the risks?'
  },
  'faq.investments.q2.a': {
    fr: "Les investissements en start-ups présentent un risque de perte totale du capital. Les entreprises peuvent échouer, et les investissements sont illiquides (impossible de revendre facilement). Ne jamais investir plus que ce qu'on peut se permettre de perdre.",
    en: 'Investing in start-ups carries a risk of total capital loss. Companies may fail and investments are illiquid (hard to resell). Never invest more than you can afford to lose.'
  },
  'faq.investments.q3.q': {
    fr: 'Quand puis-je récupérer mon argent ?',
    en: 'When can I get my money back?'
  },
  'faq.investments.q3.a': {
    fr: "Les investissements en capital-risque sont généralement illiquides pendant 3-7 ans. Une sortie devient possible lors d'une acquisition ou d'une introduction en bourse de l'entreprise. Aucun rendement n'est garanti.",
    en: 'Venture investments are typically illiquid for 3–7 years. An exit may occur if the company is acquired or goes public. No return is guaranteed.'
  },
  'faq.investments.q4.q': {
    fr: 'Puis-je suivre mes investissements ?',
    en: 'Can I track my investments?'
  },
  'faq.investments.q4.a': {
    fr: "Oui, notre application mobile vous permet de suivre l'évolution de votre portefeuille, recevoir des mises à jour des entreprises, et accéder à du contenu éducatif sur l'investissement.",
    en: 'Yes, our mobile app lets you track your portfolio, receive company updates and access educational investment content.'
  },

  'faq.practical.title': {
    fr: 'Aspects Pratiques',
    en: 'Practical Aspects'
  },
  'faq.practical.q1.q': {
    fr: 'Un mineur peut-il recevoir une carte-cadeau ?',
    en: 'Can a minor receive a gift card?'
  },
  'faq.practical.q1.a': {
    fr: "Oui, mais l'activation nécessite l'accord d'un parent ou tuteur légal qui devra compléter le processus KYC (Know Your Customer) et co-signer l'investissement.",
    en: 'Yes, but activation requires consent from a parent or legal guardian who must complete KYC and co-sign the investment.'
  },
  'faq.practical.q2.q': {
    fr: "Y a-t-il des frais cachés ?",
    en: 'Are there any hidden fees?'
  },
  'faq.practical.q2.a': {
    fr: "Non. Le prix de €200 inclut tout : l'investissement, les frais de gestion, la carte physique et l'expédition. Aucun frais supplémentaire n'est appliqué pendant la durée de l'investissement.",
    en: 'No. The €200 price includes everything: the investment, management fees, the physical card and shipping. No extra fees are charged during the investment term.'
  },
  'faq.practical.q3.q': {
    fr: 'Puis-je annuler ou me faire rembourser ?',
    en: 'Can I cancel or get a refund?'
  },
  'faq.practical.q3.a': {
    fr: "Vous disposez de 14 jours pour annuler votre achat avant activation de la carte. Une fois l'investissement activé et exécuté, aucun remboursement n'est possible car les fonds sont investis dans les entreprises.",
    en: 'You have 14 days to cancel your purchase before the card is activated. Once the investment is activated and executed, no refund is possible as the funds are invested in the companies.'
  },
  'faq.practical.q4.q': {
    fr: 'Comment sont sélectionnées les start-ups ?',
    en: 'How are the start-ups selected?'
  },
  'faq.practical.q4.a': {
    fr: "Notre équipe d'analystes évalue chaque entreprise selon des critères stricts : équipe fondatrice, traction commerciale, potentiel de marché, et impact sur l'économie française. Seules 5% des candidatures sont retenues.",
    en: 'Our analysts evaluate each company on strict criteria: founding team, commercial traction, market potential and impact on the French economy. Only 5% of applications are accepted.'
  },

  'faq.legal.title': {
    fr: 'Fiscal & Juridique',
    en: 'Tax & Legal'
  },
  'faq.legal.q1.q': {
    fr: 'Quelles sont les implications fiscales ?',
    en: 'What are the tax implications?'
  },
  'faq.legal.q1.a': {
    fr: "Les plus-values réalisées lors de la cession des parts sont soumises à l'impôt sur les plus-values mobilières. Cependant, des dispositifs comme le PEA-PME peuvent s'appliquer. Consultez un conseiller fiscal.",
    en: 'Capital gains from the sale of shares are subject to capital‑gains tax. However, schemes like the PEA-PME may apply. Consult a tax advisor.'
  },
  'faq.legal.q2.q': {
    fr: 'Qui est propriétaire des parts ?',
    en: 'Who owns the shares?'
  },
  'faq.legal.q2.a': {
    fr: "Le bénéficiaire de la carte-cadeau devient propriétaire des parts dès leur acquisition. Pour les mineurs, un compte de garde est ouvert avec le parent/tuteur comme mandataire jusqu'à la majorité.",
    en: 'The gift-card recipient becomes the owner of the shares upon acquisition. For minors, a custodial account is opened with the parent/guardian as agent until majority.'
  },
  'faq.legal.q3.q': {
    fr: 'Que se passe-t-il si Prisma Capital ferme ?',
    en: 'What happens if Prisma Capital closes?'
  },
  'faq.legal.q3.a': {
    fr: "Vos investissements sont détenus par notre partenaire dépositaire agréé, indépendamment de Prisma Capital. En cas de fermeture, un autre gestionnaire agréé prendrait le relais pour assurer la continuité.",
    en: 'Your investments are held by our licensed custodian partner independent of Prisma Capital. If we close, another licensed manager would take over to ensure continuity.'
  },

  // Partners Page
  'partners.hero.title': {
    fr: 'Nos Partenaires',
    en: 'Our Partners'
  },
  'partners.hero.subtitle': {
    fr: "Prisma Capital s'appuie sur un écosystème de partenaires de confiance pour vous offrir la meilleure expérience d'investissement, en toute sécurité.",
    en: 'Prisma Capital relies on a trusted partner ecosystem to offer you the best and safest investment experience.'
  },
  'partners.category.regulatory': {
    fr: 'Partenaires Réglementaires',
    en: 'Regulatory Partners'
  },
  'partners.category.technology': {
    fr: 'Partenaires Technologiques',
    en: 'Technology Partners'
  },
  'partners.category.investment': {
    fr: 'Partenaires Investissement',
    en: 'Investment Partners'
  },
  'partners.role.regulator': {
    fr: 'Régulateur principal',
    en: 'Primary Regulator'
  },
  'partners.role.prudential': {
    fr: 'Contrôle prudentiel',
    en: 'Prudential Oversight'
  },
  'partners.role.processor': {
    fr: 'Processeur de paiements',
    en: 'Payment Processor'
  },
  'partners.role.infrastructure': {
    fr: 'Infrastructure cloud',
    en: 'Cloud Infrastructure'
  },
  'partners.role.coinvest': {
    fr: 'Co-investissement',
    en: 'Co-investment'
  },
  'partners.role.ecosystem': {
    fr: 'Écosystème',
    en: 'Ecosystem'
  },
  'partners.status.licensed': {
    fr: 'Agréé',
    en: 'Licensed'
  },
  'partners.status.supervised': {
    fr: 'Supervisé',
    en: 'Supervised'
  },
  'partners.status.certified': {
    fr: 'Certifié',
    en: 'Certified'
  },
  'partners.status.compliant': {
    fr: 'Conforme',
    en: 'Compliant'
  },
  'partners.status.partner': {
    fr: 'Partenaire',
    en: 'Partner'
  },
  'partners.status.member': {
    fr: 'Membre',
    en: 'Member'
  },
  'partners.description.amf': {
    fr: "Prisma Capital opère sous la supervision de l'AMF avec l'agrément FR-2024-15.",
    en: 'Prisma Capital operates under AMF supervision with license FR-2024-15.'
  },
  'partners.description.acpr': {
    fr: 'Supervision des activités de financement participatif.',
    en: 'Oversight of crowdfunding activities.'
  },
  'partners.description.stripe': {
    fr: 'Sécurisation des transactions financières avec certification PCI DSS.',
    en: 'Securing financial transactions with PCI DSS certification.'
  },
  'partners.description.aws': {
    fr: 'Hébergement sécurisé avec conformité GDPR et ISO 27001.',
    en: 'Secure hosting with GDPR and ISO 27001 compliance.'
  },
  'partners.description.bpi': {
    fr: 'Partenariat pour le soutien aux start-ups innovantes françaises.',
    en: 'Partnership to support innovative French start-ups.'
  },
  'partners.description.frenchtech': {
    fr: "Membre actif de l'écosystème French Tech pour l'innovation.",
    en: 'Active member of the French Tech ecosystem for innovation.'
  },
  'partners.cert.psd2': {
    fr: 'PSD2 Compliant',
    en: 'PSD2 Compliant'
  },
  'partners.cert.gdpr': {
    fr: 'GDPR Certifié',
    en: 'GDPR Certified'
  },
  'partners.cert.iso': {
    fr: 'ISO 27001',
    en: 'ISO 27001'
  },
  'partners.cert.amf': {
    fr: 'AMF Agréé',
    en: 'AMF Licensed'
  },
  'partners.trust.title': {
    fr: 'Une confiance méritée',
    en: 'A Trust Earned'
  },
  'partners.trust.supervision.title': {
    fr: 'Supervision réglementaire complète',
    en: 'Full regulatory oversight'
  },
  'partners.trust.supervision.desc': {
    fr: "Toutes nos activités sont supervisées par l'AMF et l'ACPR.",
    en: 'All our activities are supervised by the AMF and ACPR.'
  },
  'partners.trust.security.title': {
    fr: 'Sécurité des données garantie',
    en: 'Guaranteed data security'
  },
  'partners.trust.security.desc': {
    fr: 'Conformité GDPR et chiffrement de bout en bout.',
    en: 'GDPR compliance and end-to-end encryption.'
  },
  'partners.trust.leaders.title': {
    fr: 'Partenaires de premier plan',
    en: 'Top-tier partners'
  },
  'partners.trust.leaders.desc': {
    fr: 'Collaboration avec les leaders de chaque secteur.',
    en: 'Collaboration with industry leaders.'
  },
  'partners.award.title': {
    fr: "Certifié par l'AMF",
    en: 'AMF Certified'
  },
  'partners.award.desc': {
    fr: 'Agrément de Conseiller en Investissements Participatifs',
    en: 'Licensed Crowdfunding Advisor'
  },
  'partners.award.number': {
    fr: "N° d'agrément : FR-2024-15",
    en: 'License number: FR-2024-15'
  },
  'partners.cta.title': {
    fr: 'Devenir partenaire',
    en: 'Become a partner'
  },
  'partners.cta.subtitle': {
    fr: "Rejoignez notre écosystème de partenaires et contribuez à l'innovation française.",
    en: 'Join our partner ecosystem and contribute to French innovation.'
  },
  'partners.cta.button': {
    fr: 'Contactez-nous',
    en: 'Contact us'
  },

  // Security Page
  'security.hero.title': {
    fr: 'Sécurité & Conformité',
    en: 'Security & Compliance'
  },
  'security.hero.subtitle': {
    fr: "Votre sécurité est notre priorité absolue. Découvrez comment nous protégeons vos données et vos investissements avec les plus hauts standards de l'industrie.",
    en: 'Your security is our top priority. Discover how we protect your data and investments with the highest industry standards.'
  },
  'security.hero.badge': {
    fr: 'Certifié ISO 27001 • GDPR • AMF Agréé',
    en: 'ISO 27001 Certified • GDPR • AMF Licensed'
  },
  'security.features.title': {
    fr: 'Protection Multi-Niveaux',
    en: 'Multi-Layer Protection'
  },
  'security.features.subtitle': {
    fr: "Chaque aspect de notre plateforme est conçu avec la sécurité comme priorité, de la collecte des données à l'exécution des investissements.",
    en: 'Every aspect of our platform is built with security first, from data collection to investment execution.'
  },
  'security.feature.encryption.title': {
    fr: 'Chiffrement de bout en bout',
    en: 'End-to-end Encryption'
  },
  'security.feature.encryption.desc': {
    fr: 'Toutes vos données sont chiffrées avec AES-256, le standard militaire utilisé par les banques centrales.',
    en: 'All your data is encrypted with AES‑256, the military standard used by central banks.'
  },
  'security.feature.mfa.title': {
    fr: 'Authentification multi-facteurs',
    en: 'Multi-factor Authentication'
  },
  'security.feature.mfa.desc': {
    fr: 'Protection renforcée de votre compte avec vérification par SMS et authentificateur mobile.',
    en: 'Enhanced account protection with SMS and authenticator verification.'
  },
  'security.feature.infrastructure.title': {
    fr: 'Infrastructure sécurisée',
    en: 'Secure Infrastructure'
  },
  'security.feature.infrastructure.desc': {
    fr: 'Hébergement sur AWS avec certification ISO 27001 et surveillance 24h/24.',
    en: 'Hosted on AWS with ISO 27001 certification and 24/7 monitoring.'
  },
  'security.feature.audits.title': {
    fr: 'Audit de sécurité continu',
    en: 'Continuous Security Audits'
  },
  'security.feature.audits.desc': {
    fr: 'Tests de pénétration trimestriels par des experts en cybersécurité indépendants.',
    en: 'Quarterly penetration tests by independent cybersecurity experts.'
  },
  'security.compliance.title': {
    fr: 'Conformité Réglementaire',
    en: 'Regulatory Compliance'
  },
  'security.compliance.subtitle': {
    fr: 'Prisma Capital respecte toutes les réglementations en vigueur et maintient les plus hauts standards de conformité.',
    en: 'Prisma Capital complies with all regulations and maintains the highest compliance standards.'
  },
  'security.compliance.status.certified': {
    fr: 'Certifié',
    en: 'Certified'
  },
  'security.compliance.status.compliant': {
    fr: 'Conforme',
    en: 'Compliant'
  },
  'security.compliance.status.licensed': {
    fr: 'Agréé',
    en: 'Licensed'
  },
  'security.compliance.status.validated': {
    fr: 'Validé',
    en: 'Validated'
  },
  'security.compliance.desc.gdpr': {
    fr: 'Conformité totale au Règlement Général sur la Protection des Données',
    en: 'Full compliance with the General Data Protection Regulation'
  },
  'security.compliance.desc.psd2': {
    fr: 'Directive sur les Services de Paiement pour la sécurité des transactions',
    en: 'Payment Services Directive for transaction security'
  },
  'security.compliance.desc.amf': {
    fr: "Supervision par l'Autorité des Marchés Financiers",
    en: 'Supervision by the Autorité des Marchés Financiers'
  },
  'security.compliance.desc.kyc': {
    fr: 'Procédures renforcées de connaissance client et anti-blanchiment',
    en: 'Enhanced KYC and anti-money laundering procedures'
  },
  'security.process.title': {
    fr: 'Notre Processus de Sécurité',
    en: 'Our Security Process'
  },
  'security.process.subtitle': {
    fr: 'Découvrez les étapes que nous suivons pour garantir la sécurité de vos investissements à chaque moment.',
    en: 'Discover the steps we follow to ensure your investments are secure at all times.'
  },
  'security.process.step1.title': {
    fr: "Vérification d'identité",
    en: 'Identity Verification'
  },
  'security.process.step1.desc': {
    fr: 'KYC renforcé avec vérification de documents officiels',
    en: 'Enhanced KYC with official document verification'
  },
  'security.process.step2.title': {
    fr: 'Sécurisation des fonds',
    en: 'Securing Funds'
  },
  'security.process.step2.desc': {
    fr: 'Ségrégation des fonds clients dans des comptes séparés',
    en: 'Segregation of client funds in separate accounts'
  },
  'security.process.step3.title': {
    fr: 'Monitoring en continu',
    en: 'Continuous Monitoring'
  },
  'security.process.step3.desc': {
    fr: 'Surveillance 24h/24 des transactions et détection des fraudes',
    en: '24/7 monitoring of transactions and fraud detection'
  },
  'security.process.step4.title': {
    fr: 'Backup et récupération',
    en: 'Backup and Recovery'
  },
  'security.process.step4.desc': {
    fr: "Sauvegarde automatique et plan de continuité d'activité",
    en: 'Automatic backup and business continuity plan'
  },
  'security.contact.title': {
    fr: 'Une Question de Sécurité ?',
    en: 'A Security Question?'
  },
  'security.contact.subtitle': {
    fr: 'Notre équipe de sécurité est disponible 24h/24 pour répondre à vos préoccupations.',
    en: 'Our security team is available 24/7 to address your concerns.'
  },
  'security.contact.button': {
    fr: 'Contacter la Sécurité',
    en: 'Contact Security'
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