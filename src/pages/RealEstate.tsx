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

const RealEstate = () => {
  const { t } = useLanguage();
  const [basket, setBasket] = useState<Deal[]>([]);
  
  const deals: Deal[] = [
    {
      id: 1,
      name: 'Solar Park Berlin',
      description: 'Green Energy · Yield 8.2% · Occupancy 100%'
    },
    {
      id: 2,
      name: 'Luxury Apartments Munich',
      description: 'Residential · Yield 6.8% · Occupancy 95%'
    },
    {
      id: 3,
      name: 'Student Housing Frankfurt',
      description: 'Residential · Yield 7.4% · Occupancy 100%'
    },
    {
      id: 4,
      name: 'Retail Center Hamburg',
      description: 'Commercial · Yield 9.1% · Occupancy 88%'
    },
    {
      id: 5,
      name: 'Office Complex Düsseldorf',
      description: 'Office · Yield 7.9% · Occupancy 92%'
    },
    {
      id: 6,
      name: 'Warehouse Logistics Berlin',
      description: 'Industrial · Yield 8.5% · Occupancy 97%'
    }
  ];

  const metrics = [
    { label: 'Projected CAGR', value: '7.8%' },
    { label: 'Total Invested', value: '€44.2M' },
    { label: '2-Year Gains', value: '+31.4%' }
  ];

  const addToBasket = (deal: Deal) => {
    setBasket(prev => prev.find(d => d.id === deal.id) ? prev : [...prev, deal]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <section className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 py-8 mb-12">
          <div className="section-container">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="bg-white text-primary hover:bg-white/90 border-primary/20 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('realEstate.back')}
            </Button>

            <h1 className="text-4xl font-bold mb-8 text-center text-white">
              {t('realEstate.hero.title')}
            </h1>
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl font-bold text-emerald-300">{m.value}</div>
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
                  id={`re-${deal.id}`}
                  title={deal.name}
                  description={deal.description}
                  type="Real Estate"
                  onAdd={() => addToBasket(deal)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer riskCategory="risk.realEstate" />
    </div>
  );
};

export default RealEstate;
