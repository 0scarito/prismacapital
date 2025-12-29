// Hero images
import heroPrivateEquity from '@/assets/investments/hero-private-equity.jpg';
import heroVentureCapital from '@/assets/investments/hero-venture-capital.jpg';
import heroRealEstate from '@/assets/investments/hero-real-estate.jpg';
import heroCommodities from '@/assets/investments/hero-commodities.jpg';
import heroEtfs from '@/assets/investments/hero-etfs.jpg';
import heroCrypto from '@/assets/investments/hero-crypto.jpg';

// Investment images
import peSiemensEnergy from '@/assets/investments/pe-siemens-energy.jpg';
import peLvmhLuxury from '@/assets/investments/pe-lvmh-luxury.jpg';
import vcOpenai from '@/assets/investments/vc-openai.jpg';
import vcSpacexStarlink from '@/assets/investments/vc-spacex-starlink.jpg';
import reParisHaussmann from '@/assets/investments/re-paris-haussmann.jpg';
import reFrankfurtCampus from '@/assets/investments/re-frankfurt-campus.jpg';
import commGoldTrust from '@/assets/investments/comm-gold-trust.jpg';
import commAgriculture from '@/assets/investments/comm-agriculture.jpg';
import etfIsharesEsg from '@/assets/investments/etf-ishares-esg.jpg';
import etfVanguardDividend from '@/assets/investments/etf-vanguard-dividend.jpg';
import cryptoEthereum from '@/assets/investments/crypto-ethereum.jpg';
import cryptoBitcoin from '@/assets/investments/crypto-bitcoin.jpg';

export interface Investment {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  category: string;
  expectedReturn: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  horizon: string;
  minInvestment: number;
  features: string[];
  sector: string;
  // Extended fields for detailed view
  isin?: string;
  legalStructure?: string;
  domicile?: string;
  currency?: string;
  inceptionDate?: string;
  totalAum?: string;
  managementFee?: string;
  performanceFee?: string;
  liquidity?: string;
  distributionPolicy?: string;
  riskRating?: string;
  regulatoryStatus?: string;
  keyRisks?: string[];
  historicalPerformance?: {
    ytd?: string;
    oneYear?: string;
    threeYear?: string;
    sinceInception?: string;
  };
  investmentTeam?: {
    name: string;
    role: string;
  }[];
  documents?: {
    name: string;
    type: string;
  }[];
}

export const heroImages = {
  privateEquity: heroPrivateEquity,
  ventureCapital: heroVentureCapital,
  realEstate: heroRealEstate,
  commodities: heroCommodities,
  etfs: heroEtfs,
  crypto: heroCrypto,
};

export const investments: Record<string, Investment[]> = {
  privateEquity: [
    {
      id: 'pe-siemens-energy',
      name: 'Siemens Energy Infrastructure Fund',
      shortDescription: 'Leading European energy transition infrastructure investments',
      fullDescription: 'The Siemens Energy Infrastructure Fund provides institutional-grade exposure to Europe\'s clean energy transformation. Focused on wind, solar, and grid modernization projects across Germany, France, and the Nordics, this fund offers stable returns backed by long-term power purchase agreements and government incentives.',
      image: peSiemensEnergy,
      category: 'Private Equity',
      expectedReturn: '18.5% IRR',
      riskLevel: 'Medium',
      horizon: '5-7 years',
      minInvestment: 100,
      features: [
        'ESG-compliant investment strategy',
        'Quarterly dividend distribution (6.2% yield)',
        'Regulated under Luxembourg SICAV structure',
        '15+ years track record in infrastructure'
      ],
      sector: 'Clean Energy & Infrastructure',
      isin: 'LU2345678901',
      legalStructure: 'Luxembourg SICAV-RAIF',
      domicile: 'Luxembourg',
      currency: 'EUR',
      inceptionDate: 'March 2019',
      totalAum: '€847M',
      managementFee: '1.75%',
      performanceFee: '15% over 8% hurdle',
      liquidity: 'Quarterly redemptions (90-day notice)',
      distributionPolicy: 'Quarterly distributions',
      riskRating: '6/7 (SRRI)',
      regulatoryStatus: 'AIFMD Compliant',
      keyRisks: [
        'Illiquidity risk - limited secondary market',
        'Concentration risk in energy sector',
        'Regulatory and policy changes affecting renewables',
        'Interest rate sensitivity on project financing',
        'Currency risk for non-EUR projects'
      ],
      historicalPerformance: {
        ytd: '+12.4%',
        oneYear: '+18.2%',
        threeYear: '+52.7% (cumulative)',
        sinceInception: '+87.3% (cumulative)'
      },
      investmentTeam: [
        { name: 'Dr. Klaus Richter', role: 'Fund Manager' },
        { name: 'Marie Dubois', role: 'Senior Portfolio Analyst' },
        { name: 'Thomas Lindberg', role: 'Risk Director' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Prospectus', type: 'PDF' },
        { name: 'Annual Report 2023', type: 'PDF' },
        { name: 'ESG Impact Report', type: 'PDF' }
      ]
    },
    {
      id: 'pe-lvmh-luxury',
      name: 'LVMH Luxury Holdings Trust',
      shortDescription: 'Premium exposure to global luxury retail expansion',
      fullDescription: 'Exclusive co-investment opportunity alongside LVMH\'s strategic expansion into emerging luxury markets. This fund participates in flagship store acquisitions, brand portfolio optimization, and direct-to-consumer digital transformation initiatives across Asia-Pacific and Middle East regions.',
      image: peLvmhLuxury,
      category: 'Private Equity',
      expectedReturn: '22.4% IRR',
      riskLevel: 'Medium',
      horizon: '4-6 years',
      minInvestment: 100,
      features: [
        'Co-investment with LVMH strategic capital',
        'Exposure to 75+ luxury brands',
        'Defensive positioning in market downturns',
        'Annual distributions from rental income'
      ],
      sector: 'Luxury Retail & Consumer',
      isin: 'FR0014007LK8',
      legalStructure: 'French FPCI',
      domicile: 'France',
      currency: 'EUR',
      inceptionDate: 'September 2020',
      totalAum: '€1.2B',
      managementFee: '2.00%',
      performanceFee: '20% over 10% hurdle',
      liquidity: 'Semi-annual redemptions (180-day notice)',
      distributionPolicy: 'Annual distributions',
      riskRating: '6/7 (SRRI)',
      regulatoryStatus: 'AMF Registered',
      keyRisks: [
        'Consumer discretionary spending sensitivity',
        'Geographic concentration in Asia-Pacific',
        'Brand reputation and management key person risk',
        'Real estate market fluctuations',
        'Currency exposure to CNY and JPY'
      ],
      historicalPerformance: {
        ytd: '+15.8%',
        oneYear: '+24.1%',
        threeYear: '+68.4% (cumulative)',
        sinceInception: '+94.2% (cumulative)'
      },
      investmentTeam: [
        { name: 'Jean-Pierre Moreau', role: 'Managing Partner' },
        { name: 'Sophie Chen', role: 'Asia-Pacific Director' },
        { name: 'Alessandro Rossi', role: 'Retail Strategy Lead' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Offering Memorandum', type: 'PDF' },
        { name: 'Q3 2024 Investor Update', type: 'PDF' },
        { name: 'Valuation Policy', type: 'PDF' }
      ]
    }
  ],
  ventureCapital: [
    {
      id: 'vc-openai',
      name: 'OpenAI Series C Extension',
      shortDescription: 'Secondary market access to leading AI company',
      fullDescription: 'Rare opportunity to acquire secondary shares in OpenAI, the world\'s leading artificial intelligence research company. Creator of GPT-4, ChatGPT, and DALL-E, OpenAI is valued at $80B+ and positioned at the forefront of the AI revolution transforming every industry.',
      image: vcOpenai,
      category: 'Venture Capital',
      expectedReturn: '45%+ CAGR',
      riskLevel: 'High',
      horizon: '3-5 years',
      minInvestment: 100,
      features: [
        'Pre-IPO secondary shares',
        'Microsoft strategic partnership backing',
        '$1B+ annual recurring revenue',
        'Market leader in generative AI'
      ],
      sector: 'Artificial Intelligence',
      isin: 'US68389X1054 (SPV)',
      legalStructure: 'Delaware LP (SPV)',
      domicile: 'United States',
      currency: 'USD',
      inceptionDate: 'January 2024',
      totalAum: '$420M (SPV allocation)',
      managementFee: '2.50%',
      performanceFee: '20% carry',
      liquidity: 'No liquidity until exit event',
      distributionPolicy: 'Proceeds on exit',
      riskRating: '7/7 (SRRI)',
      regulatoryStatus: 'SEC Reg D Exempt',
      keyRisks: [
        'Complete capital loss possible',
        'No liquidity - no secondary market',
        'Valuation uncertainty in private markets',
        'Regulatory risk around AI development',
        'Competition from Google, Meta, Anthropic',
        'Key person dependency on leadership'
      ],
      historicalPerformance: {
        ytd: 'N/A - Private',
        oneYear: 'N/A - Private',
        threeYear: 'N/A - Private',
        sinceInception: '+180% (implied valuation)'
      },
      investmentTeam: [
        { name: 'Michael Torres', role: 'General Partner' },
        { name: 'Dr. Sarah Kim', role: 'AI Sector Lead' },
        { name: 'David Nakamura', role: 'Secondary Markets Head' }
      ],
      documents: [
        { name: 'Private Placement Memorandum', type: 'PDF' },
        { name: 'Risk Disclosure Statement', type: 'PDF' },
        { name: 'Company Overview Deck', type: 'PDF' },
        { name: 'Valuation Methodology', type: 'PDF' }
      ]
    },
    {
      id: 'vc-spacex-starlink',
      name: 'SpaceX Starlink Infrastructure Fund',
      shortDescription: 'Satellite internet constellation investment',
      fullDescription: 'Investment in SpaceX\'s Starlink division, the world\'s largest satellite constellation providing global broadband internet. With 5,000+ satellites deployed and 2M+ subscribers, Starlink is on track for $6B+ revenue and potential IPO spin-off within 24 months.',
      image: vcSpacexStarlink,
      category: 'Venture Capital',
      expectedReturn: '38% CAGR',
      riskLevel: 'High',
      horizon: '2-4 years',
      minInvestment: 100,
      features: [
        'Potential IPO spin-off candidate',
        '2M+ paying subscribers globally',
        'Government and enterprise contracts',
        'First-mover advantage in space internet'
      ],
      sector: 'Space Technology & Telecom',
      isin: 'KY2847561098 (SPV)',
      legalStructure: 'Cayman Islands LP',
      domicile: 'Cayman Islands',
      currency: 'USD',
      inceptionDate: 'June 2023',
      totalAum: '$380M (SPV allocation)',
      managementFee: '2.25%',
      performanceFee: '20% carry',
      liquidity: 'No liquidity until exit event',
      distributionPolicy: 'Proceeds on exit',
      riskRating: '7/7 (SRRI)',
      regulatoryStatus: 'CIMA Registered',
      keyRisks: [
        'Complete capital loss possible',
        'Space technology execution risks',
        'Regulatory approvals across jurisdictions',
        'Competition from Amazon Kuiper, OneWeb',
        'Capital intensive - ongoing funding needs',
        'IPO timing uncertainty'
      ],
      historicalPerformance: {
        ytd: 'N/A - Private',
        oneYear: 'N/A - Private',
        threeYear: 'N/A - Private',
        sinceInception: '+95% (implied valuation)'
      },
      investmentTeam: [
        { name: 'Robert Chang', role: 'Managing Director' },
        { name: 'Elena Volkova', role: 'Space Tech Analyst' },
        { name: 'James McAllister', role: 'Infrastructure Lead' }
      ],
      documents: [
        { name: 'Private Placement Memorandum', type: 'PDF' },
        { name: 'Risk Disclosure Statement', type: 'PDF' },
        { name: 'Market Analysis Report', type: 'PDF' },
        { name: 'Technical Due Diligence', type: 'PDF' }
      ]
    }
  ],
  realEstate: [
    {
      id: 're-paris-haussmann',
      name: 'Paris Haussmann Premium Residences',
      shortDescription: 'Trophy residential properties in Paris 8th & 16th arrondissements',
      fullDescription: 'Curated portfolio of historic Haussmann-era residential buildings in Paris\'s most prestigious neighborhoods. These irreplaceable assets benefit from strict heritage protections, limited supply, and consistent demand from ultra-high-net-worth families and diplomatic missions.',
      image: reParisHaussmann,
      category: 'Real Estate',
      expectedReturn: '8.5% yield + 4% appreciation',
      riskLevel: 'Low',
      horizon: '7-10 years',
      minInvestment: 100,
      features: [
        'UNESCO-protected historic architecture',
        'Average occupancy rate >98%',
        'Inflation-indexed rental agreements',
        'Triple-net lease structure'
      ],
      sector: 'Luxury Residential',
      isin: 'FR0012345678',
      legalStructure: 'French OPCI',
      domicile: 'France',
      currency: 'EUR',
      inceptionDate: 'January 2018',
      totalAum: '€285M',
      managementFee: '1.25%',
      performanceFee: 'None',
      liquidity: 'Bi-annual redemptions (60-day notice)',
      distributionPolicy: 'Quarterly income distributions',
      riskRating: '3/7 (SRRI)',
      regulatoryStatus: 'AMF Approved OPCI',
      keyRisks: [
        'Real estate market cyclicality',
        'Tenant concentration risk',
        'Renovation and maintenance costs',
        'Interest rate impact on valuations',
        'Limited geographic diversification'
      ],
      historicalPerformance: {
        ytd: '+6.8%',
        oneYear: '+11.2%',
        threeYear: '+29.5% (cumulative)',
        sinceInception: '+58.4% (cumulative)'
      },
      investmentTeam: [
        { name: 'Philippe Beaumont', role: 'Fund Director' },
        { name: 'Camille Laurent', role: 'Asset Manager' },
        { name: 'Marc Fontaine', role: 'Acquisitions Lead' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Prospectus', type: 'PDF' },
        { name: 'Property Portfolio Report', type: 'PDF' },
        { name: 'Annual Valuation Report', type: 'PDF' }
      ]
    },
    {
      id: 're-frankfurt-campus',
      name: 'Frankfurt Tech Campus',
      shortDescription: 'Next-generation office complex for fintech & tech companies',
      fullDescription: 'State-of-the-art technology campus in Frankfurt\'s emerging innovation district. Pre-leased to major German banks and international tech companies, this LEED Platinum development offers modern flexible workspaces with 15-year anchor tenant commitments.',
      image: reFrankfurtCampus,
      category: 'Real Estate',
      expectedReturn: '7.2% yield + 5% appreciation',
      riskLevel: 'Low',
      horizon: '5-8 years',
      minInvestment: 100,
      features: [
        'LEED Platinum sustainability certification',
        '85% pre-leased to investment-grade tenants',
        'Strategic location near Frankfurt Airport',
        'Built-in expansion optionality'
      ],
      sector: 'Commercial Office',
      isin: 'DE000A2E4K43',
      legalStructure: 'German Spezial-AIF',
      domicile: 'Germany',
      currency: 'EUR',
      inceptionDate: 'July 2021',
      totalAum: '€195M',
      managementFee: '1.40%',
      performanceFee: '10% over 6% hurdle',
      liquidity: 'Annual redemptions (90-day notice)',
      distributionPolicy: 'Semi-annual distributions',
      riskRating: '4/7 (SRRI)',
      regulatoryStatus: 'BaFin Registered AIF',
      keyRisks: [
        'Office demand post-pandemic uncertainty',
        'Single asset concentration',
        'Construction completion risk (Phase 2)',
        'Tenant default risk',
        'ESG compliance ongoing costs'
      ],
      historicalPerformance: {
        ytd: '+8.1%',
        oneYear: '+12.5%',
        threeYear: '+34.2% (cumulative)',
        sinceInception: '+42.8% (cumulative)'
      },
      investmentTeam: [
        { name: 'Stefan Mueller', role: 'Fund Manager' },
        { name: 'Anna Schneider', role: 'Leasing Director' },
        { name: 'Hans Weber', role: 'Development Manager' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Investment Memorandum', type: 'PDF' },
        { name: 'Sustainability Report', type: 'PDF' },
        { name: 'Construction Update Q4 2024', type: 'PDF' }
      ]
    }
  ],
  commodities: [
    {
      id: 'comm-gold-trust',
      name: 'Swiss Gold Bullion Trust',
      shortDescription: 'Physical gold stored in Swiss vaults with full allocation',
      fullDescription: 'Direct ownership of LBMA-certified gold bullion stored in secure Swiss vaults. Each unit represents 1 gram of allocated physical gold with quarterly audits by independent assayers. The ultimate safe-haven asset for portfolio diversification and inflation protection.',
      image: commGoldTrust,
      category: 'Commodities',
      expectedReturn: '6-8% long-term average',
      riskLevel: 'Low',
      horizon: '3-10 years',
      minInvestment: 100,
      features: [
        'Fully allocated physical gold',
        'Stored in Swiss high-security vaults',
        'Quarterly independent audits',
        'Delivery option available'
      ],
      sector: 'Precious Metals',
      isin: 'CH0012345678',
      legalStructure: 'Swiss Collective Investment',
      domicile: 'Switzerland',
      currency: 'USD (Gold-backed)',
      inceptionDate: 'November 2015',
      totalAum: '$1.4B (equivalent)',
      managementFee: '0.35%',
      performanceFee: 'None',
      liquidity: 'Daily liquidity (T+2 settlement)',
      distributionPolicy: 'No distributions (accumulating)',
      riskRating: '4/7 (SRRI)',
      regulatoryStatus: 'FINMA Approved',
      keyRisks: [
        'Gold price volatility',
        'No income generation',
        'USD currency exposure',
        'Storage and insurance costs',
        'Central bank gold policy changes'
      ],
      historicalPerformance: {
        ytd: '+14.2%',
        oneYear: '+22.8%',
        threeYear: '+38.5% (cumulative)',
        sinceInception: '+87.3% (cumulative)'
      },
      investmentTeam: [
        { name: 'Markus Huber', role: 'Fund Administrator' },
        { name: 'Christine Bauer', role: 'Custody Operations' },
        { name: 'Thomas Zellweger', role: 'Compliance Officer' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Prospectus', type: 'PDF' },
        { name: 'Vault Audit Certificate', type: 'PDF' },
        { name: 'Insurance Certificate', type: 'PDF' }
      ]
    },
    {
      id: 'comm-agriculture',
      name: 'European Sustainable Agriculture Fund',
      shortDescription: 'Diversified farmland and agricultural commodities',
      fullDescription: 'Investment in premium European farmland across France, Germany, and Poland, combined with forward contracts on wheat, corn, and sustainable biofuels. Benefits from EU agricultural subsidies, increasing food demand, and the transition to sustainable farming practices.',
      image: commAgriculture,
      category: 'Commodities',
      expectedReturn: '9.5% total return',
      riskLevel: 'Medium',
      horizon: '5-7 years',
      minInvestment: 100,
      features: [
        'EU CAP subsidy income stream',
        'Inflation hedge characteristics',
        'Carbon credit generation potential',
        'Diversified crop and geography mix'
      ],
      sector: 'Agriculture & Food Security',
      isin: 'LU9876543210',
      legalStructure: 'Luxembourg SCS SICAV-RAIF',
      domicile: 'Luxembourg',
      currency: 'EUR',
      inceptionDate: 'April 2020',
      totalAum: '€340M',
      managementFee: '1.50%',
      performanceFee: '15% over 7% hurdle',
      liquidity: 'Annual redemptions (180-day notice)',
      distributionPolicy: 'Annual harvest distributions',
      riskRating: '5/7 (SRRI)',
      regulatoryStatus: 'CSSF Registered RAIF',
      keyRisks: [
        'Weather and climate risks',
        'Commodity price volatility',
        'EU agricultural policy changes',
        'Land value fluctuations',
        'Operational farming risks'
      ],
      historicalPerformance: {
        ytd: '+7.4%',
        oneYear: '+11.8%',
        threeYear: '+32.1% (cumulative)',
        sinceInception: '+48.6% (cumulative)'
      },
      investmentTeam: [
        { name: 'Pierre Lefebvre', role: 'Portfolio Manager' },
        { name: 'Agnieszka Nowak', role: 'Land Acquisitions' },
        { name: 'Dieter Schmidt', role: 'Agricultural Operations' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Offering Memorandum', type: 'PDF' },
        { name: 'Farm Portfolio Overview', type: 'PDF' },
        { name: 'Carbon Credit Strategy', type: 'PDF' }
      ]
    }
  ],
  etfs: [
    {
      id: 'etf-ishares-esg',
      name: 'iShares MSCI World ESG Screened',
      shortDescription: 'Global developed market equities with ESG filters',
      fullDescription: 'Broad exposure to large and mid-cap developed market stocks that meet ESG criteria. Excludes companies involved in controversial weapons, tobacco, thermal coal, and oil sands. Tracks over 1,400 holdings across 23 countries with ultra-low expense ratio.',
      image: etfIsharesEsg,
      category: 'ETF',
      expectedReturn: '8-10% historical',
      riskLevel: 'Medium',
      horizon: '3-5+ years',
      minInvestment: 100,
      features: [
        '0.20% expense ratio',
        '1,400+ holdings globally',
        'SFDR Article 8 compliant',
        'Daily liquidity'
      ],
      sector: 'Global Equities',
      isin: 'IE00BFNM3J75',
      legalStructure: 'Irish UCITS ETF',
      domicile: 'Ireland',
      currency: 'USD',
      inceptionDate: 'October 2018',
      totalAum: '$8.2B',
      managementFee: '0.20%',
      performanceFee: 'None',
      liquidity: 'Continuous trading (exchange hours)',
      distributionPolicy: 'Accumulating',
      riskRating: '5/7 (SRRI)',
      regulatoryStatus: 'UCITS V Compliant',
      keyRisks: [
        'Equity market volatility',
        'Currency fluctuations (USD base)',
        'ESG screening may limit returns',
        'Index tracking error',
        'Geopolitical risks in developed markets'
      ],
      historicalPerformance: {
        ytd: '+18.4%',
        oneYear: '+24.2%',
        threeYear: '+28.7% (cumulative)',
        sinceInception: '+72.5% (cumulative)'
      },
      investmentTeam: [
        { name: 'BlackRock Index Team', role: 'Index Management' },
        { name: 'Emily Watson', role: 'ESG Research Lead' },
        { name: 'Patrick O\'Brien', role: 'Trading Desk' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Prospectus', type: 'PDF' },
        { name: 'Monthly Factsheet', type: 'PDF' },
        { name: 'ESG Characteristics Report', type: 'PDF' }
      ]
    },
    {
      id: 'etf-vanguard-dividend',
      name: 'Vanguard FTSE All-World High Dividend',
      shortDescription: 'High-yield dividend stocks from developed and emerging markets',
      fullDescription: 'Access to companies worldwide with above-average dividend yields. Diversified across 1,800+ dividend-paying stocks from developed and emerging markets. Provides regular income stream with quarterly distributions while maintaining global equity exposure.',
      image: etfVanguardDividend,
      category: 'ETF',
      expectedReturn: '4.2% yield + 5% growth',
      riskLevel: 'Medium',
      horizon: '3-5+ years',
      minInvestment: 100,
      features: [
        '0.29% expense ratio',
        '4.2% trailing dividend yield',
        'Quarterly distributions',
        '1,800+ global holdings'
      ],
      sector: 'Dividend Income',
      isin: 'IE00B8GKDB10',
      legalStructure: 'Irish UCITS ETF',
      domicile: 'Ireland',
      currency: 'USD',
      inceptionDate: 'May 2013',
      totalAum: '$4.6B',
      managementFee: '0.29%',
      performanceFee: 'None',
      liquidity: 'Continuous trading (exchange hours)',
      distributionPolicy: 'Quarterly distributions',
      riskRating: '5/7 (SRRI)',
      regulatoryStatus: 'UCITS V Compliant',
      keyRisks: [
        'Dividend cut risk in economic downturns',
        'Value style underperformance periods',
        'Emerging market exposure volatility',
        'Currency fluctuations',
        'Interest rate sensitivity'
      ],
      historicalPerformance: {
        ytd: '+12.1%',
        oneYear: '+16.8%',
        threeYear: '+22.4% (cumulative)',
        sinceInception: '+98.7% (cumulative)'
      },
      investmentTeam: [
        { name: 'Vanguard Quantitative Equity Group', role: 'Index Management' },
        { name: 'James Anderson', role: 'Portfolio Manager' },
        { name: 'Rachel Cohen', role: 'Income Strategy' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Prospectus', type: 'PDF' },
        { name: 'Monthly Factsheet', type: 'PDF' },
        { name: 'Dividend History', type: 'PDF' }
      ]
    }
  ],
  crypto: [
    {
      id: 'crypto-ethereum',
      name: 'Ethereum 2.0 Staking Pool',
      shortDescription: 'Earn rewards by participating in Ethereum network validation',
      fullDescription: 'Institutional-grade Ethereum staking through regulated custody. Your ETH is staked to help secure the Ethereum network, earning protocol rewards of 4-5% annually. Managed by licensed custodians with insurance coverage and regulatory compliance.',
      image: cryptoEthereum,
      category: 'Cryptocurrency',
      expectedReturn: '4-5% staking yield + ETH appreciation',
      riskLevel: 'High',
      horizon: '1-3+ years',
      minInvestment: 100,
      features: [
        'Institutional-grade custody',
        'Insurance coverage on staked assets',
        'No minimum lock-up period',
        'Compound staking rewards'
      ],
      sector: 'Proof-of-Stake Networks',
      isin: 'N/A (Digital Asset)',
      legalStructure: 'Jersey Trust',
      domicile: 'Jersey, Channel Islands',
      currency: 'ETH',
      inceptionDate: 'December 2022',
      totalAum: '45,000 ETH (~€145M)',
      managementFee: '0.50% + 10% of staking rewards',
      performanceFee: 'Included in management fee',
      liquidity: 'Weekly redemptions (7-day notice)',
      distributionPolicy: 'Staking rewards auto-compounded',
      riskRating: '7/7 (SRRI)',
      regulatoryStatus: 'JFSC Registered',
      keyRisks: [
        'Extreme price volatility (50%+ drawdowns possible)',
        'Regulatory uncertainty globally',
        'Smart contract and protocol risks',
        'Slashing penalties for validator errors',
        'Custody and cybersecurity risks',
        'Market liquidity in stress scenarios'
      ],
      historicalPerformance: {
        ytd: '+52.4% (ETH price + staking)',
        oneYear: '+68.7%',
        threeYear: '-12.4% (cumulative)',
        sinceInception: '+78.2%'
      },
      investmentTeam: [
        { name: 'Alex Petrov', role: 'Crypto Fund Manager' },
        { name: 'Lisa Chen', role: 'Staking Operations' },
        { name: 'Marcus Johansson', role: 'Security Lead' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Risk Disclosure Statement', type: 'PDF' },
        { name: 'Staking Policy', type: 'PDF' },
        { name: 'Custody & Insurance Cert', type: 'PDF' }
      ]
    },
    {
      id: 'crypto-bitcoin',
      name: 'Bitcoin Institutional Custody Trust',
      shortDescription: 'Secure Bitcoin exposure through regulated trust structure',
      fullDescription: 'Direct Bitcoin ownership through a regulated trust with institutional-grade custody. Cold storage in geographically distributed vaults, multi-signature security, and full regulatory compliance. The safest way to hold Bitcoin for long-term appreciation.',
      image: cryptoBitcoin,
      category: 'Cryptocurrency',
      expectedReturn: '15-25% historical CAGR',
      riskLevel: 'High',
      horizon: '3-5+ years',
      minInvestment: 100,
      features: [
        'Cold storage in Swiss vaults',
        'Multi-signature security',
        'Full proof of reserves',
        'Regulated trust structure'
      ],
      sector: 'Digital Store of Value',
      isin: 'N/A (Digital Asset)',
      legalStructure: 'Swiss Trust',
      domicile: 'Switzerland',
      currency: 'BTC',
      inceptionDate: 'June 2020',
      totalAum: '2,850 BTC (~€175M)',
      managementFee: '0.75%',
      performanceFee: 'None',
      liquidity: 'Daily redemptions (T+1 settlement)',
      distributionPolicy: 'No distributions (accumulating)',
      riskRating: '7/7 (SRRI)',
      regulatoryStatus: 'FINMA Supervised',
      keyRisks: [
        'Extreme price volatility (70%+ drawdowns historical)',
        'Regulatory crackdowns possible',
        'Environmental concerns (energy usage)',
        'Competition from other digital assets',
        'Custodial and operational risks',
        'No intrinsic value or income'
      ],
      historicalPerformance: {
        ytd: '+124.8%',
        oneYear: '+148.2%',
        threeYear: '+42.8% (cumulative)',
        sinceInception: '+385.4%'
      },
      investmentTeam: [
        { name: 'Dr. Martin Keller', role: 'Trust Administrator' },
        { name: 'Nina Hoffmann', role: 'Custody Operations' },
        { name: 'Luca Bernasconi', role: 'Compliance Director' }
      ],
      documents: [
        { name: 'Key Information Document (KID)', type: 'PDF' },
        { name: 'Trust Deed', type: 'PDF' },
        { name: 'Proof of Reserves Report', type: 'PDF' },
        { name: 'Security Audit Report', type: 'PDF' }
      ]
    }
  ]
};
