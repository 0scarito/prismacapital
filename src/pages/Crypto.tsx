import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Crypto = () => {
  const examples = [
    {
      title: 'Bitcoin & Ethereum Strategy',
      description: 'Balanced allocation to the two leading cryptocurrencies.'
    },
    {
      title: 'DeFi Yield Fund',
      description: 'Earn interest by providing liquidity to decentralised finance platforms.'
    },
    {
      title: 'Crypto VC Portfolio',
      description: 'Early-stage tokens selected by seasoned blockchain investors.'
    },
    {
      title: 'Stablecoin Savings',
      description: 'Generate passive returns using fully collateralised stablecoins.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Crypto-assets</h1>
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
      <Footer riskCategory="risk.crypto" />
    </div>
  );
};

export default Crypto;
