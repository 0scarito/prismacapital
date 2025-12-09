import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import InvestmentCard from '@/components/InvestmentCard';
import InvestmentDetailDialog from '@/components/InvestmentDetailDialog';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { investments, heroImages, Investment } from '@/data/investments';

const Etfs = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  
  const etfInvestments = investments.etfs;

  const metrics = [
    { label: 'Projected CAGR', value: '7.2%' },
    { label: 'Total Invested', value: '€32.8M' },
    { label: '2-Year Gains', value: '+18.5%' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <section 
          className="relative py-16 mb-12 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImages.etfs})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/70" />
          <div className="section-container relative z-10">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 border-white/30 mb-6 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to investments
            </Button>

            <h1 className="text-4xl font-bold mb-8 text-center text-white">
              ETF &amp; Indices
            </h1>
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl font-bold text-purple-300">{m.value}</div>
                  <div className="text-sm text-white/80 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {etfInvestments.map((investment) => (
                <InvestmentCard
                  key={investment.id}
                  id={investment.id}
                  title={investment.name}
                  description={investment.shortDescription}
                  type="ETFs"
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

      <Footer riskCategory="risk.etf" />

      <InvestmentDetailDialog
        investment={selectedInvestment}
        open={!!selectedInvestment}
        onOpenChange={(open) => !open && setSelectedInvestment(null)}
      />
    </div>
  );
};

export default Etfs;
