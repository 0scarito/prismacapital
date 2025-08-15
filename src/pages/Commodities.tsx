import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PortfolioDrawer from '@/components/PortfolioDrawer';
import InvestmentCard from '@/components/InvestmentCard';
import { ArrowLeft, Briefcase, Coins } from 'lucide-react';

const Commodities = () => {
  const [basket, setBasket] = useState<{ id: number; name: string }[]>([]);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const deals = [
    { id: 1, name: 'Gold Hedge', description: 'Preserve purchasing power with allocated gold bullion.' },
    { id: 2, name: 'Agricultural Fund', description: 'Invest in global food staples and farmland.' },
    { id: 3, name: 'Energy Exposure', description: 'Access oil and renewable energy markets.' },
    { id: 4, name: 'Tokenised Metals', description: 'Trade tokenised commodity contracts for liquidity.' },
  ];

  const metrics = [
    { label: 'YTD Performance', value: '+12%' },
    { label: 'Volatility', value: 'High' },
  ];

  const addToBasket = (deal: { id: number; name: string }) => {
    setBasket((prev) => (prev.find((d) => d.id === deal.id) ? prev : [...prev, deal]));
  };

  return (
    <div className="min-h-screen bg-background">
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
          <button onClick={() => window.history.back()} className="flex items-center gap-2 mb-8 text-slate-50">
            <ArrowLeft className="w-4 h-4" />
            Back to investments
          </button>
        </div>

        <section className="relative h-72 flex items-center justify-center text-white mb-12" style={{ backgroundColor: '#1A1F24' }}>
          <h1 className="text-5xl font-bold">Commodities</h1>
          <Coins className="absolute right-8 bottom-6 w-32 h-32 text-[#C87437]" />
        </section>

        <section className="py-20">
          <div className="section-container">
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

        <section className="py-16 bg-slate-100 mt-12">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-2xl font-bold">{m.value}</div>
                  <div className="text-sm text-slate-600">{m.label}</div>
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

      <Footer riskCategory="risk.commodities" />
    </div>
  );
};

export default Commodities;

