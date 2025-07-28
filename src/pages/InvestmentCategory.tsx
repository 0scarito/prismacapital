import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';

interface InvestmentOpportunity {
  id: string;
  name: string;
  description: string;
  minInvestment: number;
  expectedReturn: string;
  riskLevel: string;
}

const InvestmentCategory = ({ category }: { category: string }) => {
  const { language } = useLanguage();

  const opportunities: InvestmentOpportunity[] = [
    {
      id: '1',
      name: 'Sample Investment 1',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      minInvestment: 50,
      expectedReturn: '8-12%',
      riskLevel: 'Medium'
    },
    // Add more opportunities as needed
  ];

  const buyAmounts = [50, 100, 200, 500];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="section-container">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'fr' ? 'Retour aux investissements' : 'Back to investments'}
          </button>

          {/* Partners Button */}
          <div className="text-center mb-12">
            <button
              onClick={() => window.location.href = '/partners'}
              className="btn-ghost"
            >
              {language === 'fr' ? 'Partenaires & Sécurité' : 'Partners & Securities'}
            </button>
          </div>

          {/* Investment Opportunities */}
          <div className="grid gap-8">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-card rounded-2xl p-8 border border-border">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-serif text-2xl text-card-foreground mb-4">
                      {opportunity.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {opportunity.description}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span>Return: {opportunity.expectedReturn}</span>
                      <span>Risk: {opportunity.riskLevel}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {buyAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => window.location.href = '/payment'}
                        className="w-full btn-primary"
                      >
                        {language === 'fr' ? 'Acheter' : 'Buy'} €{amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InvestmentCategory;