import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PortfolioDrawer from '@/components/PortfolioDrawer';
import InvestmentCard from '@/components/InvestmentCard';
import { ArrowLeft, Briefcase } from 'lucide-react';

const Etfs = () => {
  const [basket, setBasket] = useState<{ id: number; name: string }[]>([]);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const deals = [
    { id: 1, name: 'Global Equity ETF', description: 'Broad exposure to developed market equities.' },
    { id: 2, name: 'Climate Action ETF', description: 'Focused on companies driving the energy transition.' },
    { id: 3, name: 'Health Tech ETF', description: 'Innovators in biotech and medical technology.' },
    { id: 4, name: 'Cybersecurity ETF', description: 'Firms securing the digital economy.' },
  ];

  const metrics = [
    { label: 'Projected CAGR', value: '7%' },
    { label: 'Avg Fee', value: '0.15%' },
  ];

  const addToBasket = (deal: { id: number; name: string }) => {
    setBasket((prev) => (prev.find((d) => d.id === deal.id) ? prev : [...prev, deal]));
  };

  return (
    <div className="min-h-screen bg-[#18202C] text-warm-white">
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
            className="flex items-center gap-2 text-teal-200 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to investments
          </button>
        </div>

        <section className="section-container h-[20rem] flex items-center">
          <h1 className="text-4xl md:text-5xl font-bold">ETF &amp; Indices</h1>
        </section>

        <section className="py-20">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map((deal) => (
                <InvestmentCard
                  key={deal.id}
                  id={`etf-${deal.id}`}
                  title={deal.name}
                  description={deal.description}
                  type="ETFs"
                  onAdd={() => addToBasket(deal)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#0b0f14] mt-12">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-2xl font-bold">{m.value}</div>
                  <div className="text-sm text-slate-300">{m.label}</div>
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

      <Footer riskCategory="risk.etf" />
    </div>
  );
};

export default Etfs;

