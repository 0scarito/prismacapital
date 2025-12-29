import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import InvestmentCard from '@/components/InvestmentCard';
import InvestmentDetailDialog from '@/components/InvestmentDetailDialog';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { investments, heroImages, type Investment } from '@/data/investments';

const VentureCapital = () => {
  const { t } = useLanguage();
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  
  const deals = investments.ventureCapital;
  
  const metrics = [
    { label: 'Target CAGR', value: '40%+' },
    { label: 'Portfolio Value', value: '€180M' },
    { label: 'Unicorns Backed', value: '8' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero Section with Background Image */}
        <section 
          className="relative py-16 mb-12 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImages.ventureCapital})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-violet-900/70" />
          <div className="section-container relative z-10">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 border-white/30 mb-6 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('venture.back')}
            </Button>

            <h1 className="text-4xl font-bold mb-8 text-center text-white">
              {t('venture.hero.title')}
            </h1>
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              {metrics.map((m) => (
                <div key={m.label} className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-violet-300">{m.value}</div>
                  <div className="text-sm text-white mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Cards */}
        <section className="py-12">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {deals.map((investment) => (
                <InvestmentCard
                  key={investment.id}
                  id={investment.id}
                  title={investment.name}
                  description={investment.shortDescription}
                  type="Venture Capital"
                  image={investment.image}
                  expectedReturn={investment.expectedReturn}
                  riskLevel={investment.riskLevel}
                  onClick={() => setSelectedInvestment(investment)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer riskCategory="risk.ventureCapital" />

      <InvestmentDetailDialog
        investment={selectedInvestment}
        open={!!selectedInvestment}
        onOpenChange={(open) => !open && setSelectedInvestment(null)}
      />
    </div>
  );
};

export default VentureCapital;
