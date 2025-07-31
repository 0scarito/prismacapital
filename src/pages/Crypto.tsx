import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Crypto = () => {
  const prices = ['BTC $65,000', 'ETH $3,400', 'SOL $180', 'ADA $0.60'];
  const examples = [
    {
      title: '24/7 Purchases',
      description: 'Buy the most promising crypto assets anytime in a few clicks.'
    },
    {
      title: 'Auto Staking',
      description: 'Generate passive income through secure automatic staking.'
    },
    {
      title: 'Stablecoin Basket',
      description: 'Reduce volatility with our smart mix of stablecoins.'
    },
    {
      title: 'On-chain Insights',
      description: 'Make decisions with exclusive on-chain analytics and alerts.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black mb-6 overflow-hidden text-green-400 font-mono rounded shadow-neon">
              <div className="flex animate-marquee space-x-8 px-4 py-2">
                {prices.map(p => (
                  <span key={p} className="whitespace-nowrap">{p}</span>
                ))}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-8">Crypto-assets</h1>
            <div className="grid sm:grid-cols-2 gap-6">
              {examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-lg p-6 border border-border shadow-prisma-card transition hover:shadow-neon"
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
