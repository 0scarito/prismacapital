import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Building from '@/components/Building';

const RealEstate = () => {
  const examples = [
    {
      title: 'Co-finance Premium Buildings',
      description: 'Join premium real estate deals from just €500.'
    },
    {
      title: 'Monthly Rent to Wallet',
      description: 'Receive rental income automatically every month.'
    },
    {
      title: 'Geographic Diversification',
      description: 'Spread investments across Europe and the US.'
    },
    {
      title: 'Inflation-protected Rents',
      description: 'Benefit from rent indexation against inflation.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Real-estate Crowdfunding</h1>
            <div className="mb-8">
              <Building />
            </div>
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
      <Footer riskCategory="risk.realEstate" />
    </div>
  );
};

export default RealEstate;
