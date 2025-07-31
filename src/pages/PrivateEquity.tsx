import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PrivateEquity = () => {
  const examples = [
    {
      title: 'Growth Fund Alpha',
      description: 'Invest in established European SMEs with strong expansion plans.'
    },
    {
      title: 'Buyout Fund Beta',
      description: 'Participate in the acquisition of market leaders with proven cash flow.'
    },
    {
      title: 'Income Fund Gamma',
      description: 'Focus on mature businesses delivering regular dividends to investors.'
    },
    {
      title: 'Impact Fund Delta',
      description: 'Support companies creating positive social and environmental change.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Private Equity</h1>
            <div className="grid sm:grid-cols-2 gap-6">
              {examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-lg p-6 border border-border shadow-prisma-card"
                >
                  <h3 className="font-serif text-lg text-foreground mb-2 font-bold">
                    {ex.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ex.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer riskCategory="risk.privateEquity" />
    </div>
  );
};

export default PrivateEquity;
