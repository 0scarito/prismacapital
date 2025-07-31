import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Etfs = () => {
  const examples = [
    {
      title: 'Global Equity ETF',
      description: 'Tracks a worldwide index of large and mid-cap companies.'
    },
    {
      title: 'Green Energy ETF',
      description: 'Invests in clean-tech leaders across solar, wind and storage.'
    },
    {
      title: 'Dividend Aristocrats ETF',
      description: 'Focus on companies with a long history of rising dividends.'
    },
    {
      title: 'Bond Aggregate ETF',
      description: 'Broad exposure to investment-grade government and corporate bonds.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Diversified ETFs</h1>
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
      <Footer riskCategory="risk.etf" />
    </div>
  );
};

export default Etfs;
