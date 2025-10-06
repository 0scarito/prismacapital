import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import InvestmentCard from '@/components/InvestmentCard';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface Deal {
  id: number;
  name: string;
  description: string;
  image?: string;
}

const VentureCapital = () => {
  const { t } = useLanguage();
  const [basket, setBasket] = useState<Deal[]>([]);

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

      <main className="pt-24 pb-16">
        <section className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 py-8 mb-12">
          <div className="section-container">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="bg-white text-primary hover:bg-white/90 border-primary/20 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('venture.back')}
            </Button>

            <h1 className="text-4xl font-bold mb-8 text-center text-white">
              {t('venture.hero.title')}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">{m.value}</div>
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
                  id={`vc-${deal.id}`}
                  title={deal.name}
                  description={deal.description}
                  type="Venture Capital"
                  onAdd={() => addToBasket(deal)}
                />
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer riskCategory="risk.ventureCapital" />
    </div>
  );
};

export default VentureCapital;

