import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import InvestmentCard from '@/components/InvestmentCard';
import InvestmentDetailDialog from '@/components/InvestmentDetailDialog';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { investments, heroImages, type Investment } from '@/data/investments';

const PrivateEquity = () => {
  const { t } = useLanguage();
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const deals = investments.privateEquity;

  const metrics = [
    { label: 'Average IRR', value: '20.5%' },
    { label: 'Total AUM', value: '€2.4B' },
    { label: 'Track Record', value: '15+ Years' }
  ];

  const handleCardClick = (investment: Investment) => {
    setSelectedInvestment(investment);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero Section with Background Image */}
        <section 
          className="relative py-16 mb-12 overflow-hidden"
          style={{
            backgroundImage: `url(${heroImages.privateEquity})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
          <div className="section-container relative z-10">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline"
              className="bg-background/80 backdrop-blur border-border mb-6 hover:bg-background"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('privateEquity.back')}
            </Button>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t('privateEquity.hero.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Institutional-quality private equity investments in established European companies
            </p>
            
            <div className="grid grid-cols-3 gap-8 max-w-3xl">
              {metrics.map((m) => (
                <div key={m.label} className="bg-background/80 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{m.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Cards */}
        <section className="py-12">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {deals.map(investment => (
                <InvestmentCard 
                  key={investment.id} 
                  id={investment.id} 
                  title={investment.name} 
                  description={investment.shortDescription} 
                  type={investment.category}
                  image={investment.image}
                  expectedReturn={investment.expectedReturn}
                  riskLevel={investment.riskLevel}
                  onClick={() => handleCardClick(investment)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <InvestmentDetailDialog 
        investment={selectedInvestment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <Footer riskCategory="risk.privateEquity" />
    </div>
  );
};

export default PrivateEquity;
