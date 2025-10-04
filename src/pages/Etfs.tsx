import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import InvestmentCard from '@/components/InvestmentCard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Etfs = () => {
  const [basket, setBasket] = useState<{ id: number; name: string }[]>([]);

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

      <main className="pt-16 pb-16">
        <div className="section-container mb-8">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="bg-white text-primary hover:bg-white/90 border-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to investments
          </Button>
        </div>

        <section className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 py-12 mb-12">
          <div className="section-container">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">ETF &amp; Indices</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl font-bold text-teal-400">{m.value}</div>
                  <div className="text-sm text-slate-300 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
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

      </main>

      <Footer riskCategory="risk.etf" />
    </div>
  );
};

export default Etfs;

