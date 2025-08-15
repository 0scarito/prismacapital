import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PortfolioDrawer from '@/components/PortfolioDrawer';
import InvestmentCard from '@/components/InvestmentCard';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Deal {
  id: number;
  name: string;
  description: string;
  image?: string;
}

const VentureCapital = () => {
  const { t } = useLanguage();
  const [basket, setBasket] = useState<Deal[]>([]);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const deals: Deal[] = [
    {
      id: 1,
      name: 'QuantumFlow AI',
      description: 'Series A · €12M funding · €80M valuation',
    },
    {
      id: 2,
      name: 'BioSynth Labs',
      description: 'Seed · €4.5M funding · €25M valuation',
    },
    {
      id: 3,
      name: 'CryptoTrade Pro',
      description: 'Series B · €25M funding · €180M valuation',
    },
    {
      id: 4,
      name: 'CarbonZero Tech',
      description: 'Series A · €18M funding · €120M valuation',
    },
    {
      id: 5,
      name: 'SolarGrid Systems',
      description: 'Seed+ · €8M funding · €45M valuation',
    },
    {
      id: 6,
      name: 'FoodTech Revolution',
      description: 'Series A · €15M funding · €95M valuation',
    },
  ];

  const metrics = [
    { label: t('venture.portfolioIrr'), value: '28.5%' },
    { label: t('venture.exits'), value: '12' },
  ];

  const addToBasket = (deal: Deal) => {
    setBasket((prev) => (prev.find((d) => d.id === deal.id) ? prev : [...prev, deal]));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />

      <div className="fixed top-32 right-8 z-50">
        <button
          onClick={() => setShowPortfolio(true)}
          className="bg-metallic-gold text-deep-navy w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        >
          <Briefcase className="w-6 h-6" />
          {basket.length > 0 && (
            <span className="ml-1 font-bold text-sm">{basket.length}</span>
          )}
        </button>
      </div>

      <main className="pt-24 pb-16">
        <div className="section-container">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mb-8 text-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('venture.back')}
          </button>
        </div>

        <section className="py-20">
          <div className="section-container">
            <h1 className="text-4xl font-bold mb-8 text-center">
              {t('venture.hero.title')}
            </h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map((deal) => (
                <InvestmentCard
                  key={deal.id}
                  title={deal.name}
                  description={deal.description}
                  onAdd={() => addToBasket(deal)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-900 mt-12">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-2xl font-bold">{m.value}</div>
                  <div className="text-sm text-slate-400">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PortfolioDrawer
        open={showPortfolio}
        onClose={() => setShowPortfolio(false)}
        title="Portfolio"
        metrics={metrics}
        items={basket.map((d) => d.name)}
      />

      <Footer riskCategory="risk.ventureCapital" />
    </div>
  );
};

export default VentureCapital;

