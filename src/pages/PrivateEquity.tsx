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

const PrivateEquity = () => {
  const { t } = useLanguage();
  const [basket, setBasket] = useState<Deal[]>([]);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const deals: Deal[] = [
    { id: 1, name: 'TechCorp SAS', description: 'EBITDA €8.2M · IRR 18% · Dividend 6.2%' },
    { id: 2, name: 'MedDevice Ltd', description: 'EBITDA €12.1M · IRR 22% · Dividend 5.8%' },
    { id: 3, name: 'GreenEnergy Co', description: 'EBITDA €15.3M · IRR 25% · Dividend 7.1%' },
    { id: 4, name: 'LogiFlow Systems', description: 'EBITDA €6.8M · IRR 19% · Dividend 5.5%' },
    { id: 5, name: 'DataCrunch Analytics', description: 'EBITDA €22.4M · IRR 28% · Dividend 8.3%' },
    { id: 6, name: 'CloudSecure Pro', description: 'EBITDA €9.7M · IRR 21% · Dividend 6.9%' },
    { id: 7, name: 'FinTech Innovations', description: 'EBITDA €31.2M · IRR 35% · Dividend 9.4%' },
    { id: 8, name: 'AutoTech Solutions', description: 'EBITDA €18.6M · IRR 24% · Dividend 7.7%' },
  ];

  const metrics = [
    { label: t('privateEquity.avgIrr'), value: '23.4%' },
    { label: t('privateEquity.avgDividend'), value: '7.1%' },
  ];

  const addToBasket = (deal: Deal) => {
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
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('privateEquity.back')}
          </button>
        </div>

        <section className="py-20">
          <div className="section-container">
            <h1 className="text-4xl font-bold mb-8 text-center">
              {t('privateEquity.hero.title')}
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

      <Footer riskCategory="risk.privateEquity" />
    </div>
  );
};

export default PrivateEquity;

