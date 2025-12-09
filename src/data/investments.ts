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
      sector: 'Clean Energy & Infrastructure'
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
      sector: 'Luxury Retail & Consumer'
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
      sector: 'Artificial Intelligence'
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
      sector: 'Space Technology & Telecom'
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
      sector: 'Luxury Residential'
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
      sector: 'Commercial Office'
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
      sector: 'Precious Metals'
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
      sector: 'Agriculture & Food Security'
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
      sector: 'Global Equities'
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
      sector: 'Dividend Income'
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
      sector: 'Proof-of-Stake Networks'
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
      sector: 'Digital Store of Value'
    }
  ]
};
