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
const PrivateEquity = () => {
  const { t } = useLanguage();
  const [basket, setBasket] = useState<Deal[]>([]);
  const deals: Deal[] = [{
    id: 1,
    name: 'TechCorp SAS',
    description: 'EBITDA €8.2M · IRR 18% · Dividend 6.2%'
  }, {
    id: 2,
    name: 'MedDevice Ltd',
    description: 'EBITDA €12.1M · IRR 22% · Dividend 5.8%'
  }, {
    id: 3,
    name: 'GreenEnergy Co',
    description: 'EBITDA €15.3M · IRR 25% · Dividend 7.1%'
  }, {
    id: 4,
    name: 'LogiFlow Systems',
    description: 'EBITDA €6.8M · IRR 19% · Dividend 5.5%'
  }, {
    id: 5,
    name: 'DataCrunch Analytics',
    description: 'EBITDA €22.4M · IRR 28% · Dividend 8.3%'
  }, {
    id: 6,
    name: 'CloudSecure Pro',
    description: 'EBITDA €9.7M · IRR 21% · Dividend 6.9%'
  }, {
    id: 7,
    name: 'FinTech Innovations',
    description: 'EBITDA €31.2M · IRR 35% · Dividend 9.4%'
  }, {
    id: 8,
    name: 'AutoTech Solutions',
    description: 'EBITDA €18.6M · IRR 24% · Dividend 7.7%'
  }];
  const metrics = [{
    label: t('privateEquity.avgIrr'),
    value: '23.4%'
  }, {
    label: t('privateEquity.avgDividend'),
    value: '7.1%'
  }];
  const addToBasket = (deal: Deal) => {
    setBasket(prev => prev.find(d => d.id === deal.id) ? prev : [...prev, deal]);
  };
  return <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-8 mb-12">
          <div className="section-container">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline"
              className="bg-white text-primary hover:bg-white/90 border-primary/20 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('privateEquity.back')}
            </Button>

            <h1 className="text-4xl font-bold mb-8 text-center text-foreground">
              {t('privateEquity.hero.title')}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl font-bold text-foreground">{m.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map(deal => <InvestmentCard key={deal.id} id={`pe-${deal.id}`} title={deal.name} description={deal.description} type="Private Equity" onAdd={() => addToBasket(deal)} />)}
            </div>
          </div>
        </section>

      </main>

      <Footer riskCategory="risk.privateEquity" />
    </div>;
};
export default PrivateEquity;