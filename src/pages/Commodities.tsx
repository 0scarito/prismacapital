import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import InvestmentCard from '@/components/InvestmentCard';
import { ArrowLeft, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Commodities = () => {
  const [basket, setBasket] = useState<{ id: number; name: string }[]>([]);

  const deals = [
    { id: 1, name: 'Gold Hedge', description: 'Preserve purchasing power with allocated gold bullion.' },
    { id: 2, name: 'Agricultural Fund', description: 'Invest in global food staples and farmland.' },
    { id: 3, name: 'Energy Exposure', description: 'Access oil and renewable energy markets.' },
    { id: 4, name: 'Tokenised Metals', description: 'Trade tokenised commodity contracts for liquidity.' },
  ];

  const metrics = [
    { label: 'Projected CAGR', value: '12.3%' },
    { label: 'Total Invested', value: '€19.7M' },
    { label: '2-Year Gains', value: '+24.8%' },
  ];

  const addToBasket = (deal: { id: number; name: string }) => {
    setBasket((prev) => (prev.find((d) => d.id === deal.id) ? prev : [...prev, deal]));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <section className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 py-8 mb-12">
          <div className="section-container">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="bg-white text-primary hover:bg-white/90 border-primary/20 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to investments
            </Button>

            <div className="flex items-center justify-center gap-8 mb-8">
              <h1 className="text-5xl font-bold text-white">Commodities</h1>
              <Coins className="w-16 h-16 text-[#C87437]" />
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl font-bold text-amber-300">{m.value}</div>
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
                  id={`commodity-${deal.id}`}
                  title={deal.name}
                  description={deal.description}
                  type="Commodities"
                  onAdd={() => addToBasket(deal)}
                />
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer riskCategory="risk.commodities" />
    </div>
  );
};

export default Commodities;

