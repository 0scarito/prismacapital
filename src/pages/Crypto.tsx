import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { ArrowLeft, Coins, Zap, ParkingCircle, Bell, Briefcase } from 'lucide-react';
import BlockchainCarousel from '@/components/BlockchainCarousel';
import PortfolioDrawer from '@/components/PortfolioDrawer';
const Crypto = () => {
  const prices = ['BTC $65,000', 'ETH $3,400', 'SOL $180', 'ADA $0.60'];
  const [showPortfolio, setShowPortfolio] = useState(false);
  const metrics = [
    { label: 'YTD Performance', value: '+68%' },
    { label: 'Staking Rewards', value: '5%' }
  ];
  const examples = [{
    title: 'Buy Top Tokens 24/7',
    description: 'Purchase leading cryptocurrencies any time, day or night.',
    icon: Coins
  }, {
    title: 'Auto-Stake Rewards',
    description: 'Grow holdings automatically with built-in staking.',
    icon: Zap
  }, {
    title: 'Stablecoin Basket',
    description: 'Buffer volatility with our curated mix of stable assets.',
    icon: ParkingCircle
  }, {
    title: 'On-chain Alerts',
    description: 'Stay informed with analytics and instant notifications.',
    icon: Bell
  }];
  return <div className="min-h-screen bg-background">
      <Navigation />

      <div className="fixed top-32 right-8 z-50">
        <button
          onClick={() => setShowPortfolio(true)}
          className="bg-metallic-gold text-deep-navy w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        >
          <Briefcase className="w-6 h-6" />
        </button>
      </div>
      <main className="pt-24 pb-16">
        <div className="section-container">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 mb-8 text-slate-50">
            <ArrowLeft className="w-4 h-4" />
            Back to investments
          </button>
        </div>
        <section className="relative h-[20rem] bg-[#0F1427] flex items-center overflow-hidden">
          <h1 className="text-4xl font-bold text-cyan-100 pl-6 z-10">Crypto-assets</h1>
          <Coins className="absolute right-8 bottom-6 w-40 h-40 text-cyan-300/80" />
          <svg className="absolute inset-0 w-full h-full text-cyan-500/20" aria-hidden="true">
            <defs>
              <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M10 0v10M0 10h10M30 40v-10M40 30h-10" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </section>

        <BlockchainCarousel />

        <div className="bg-black overflow-hidden text-green-400 font-mono shadow-neon">
          <div className="flex animate-marquee space-x-8 px-4 py-2">
            {prices.map(p => <span key={p} className="whitespace-nowrap">{p}</span>)}
          </div>
        </div>

        <div className="section-container">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
              {examples.map((ex, idx) => <div key={idx} style={{
              width: '28rem',
              height: '12rem'
            }} className="bg-[#151a29] rounded-lg p-6 border border-border shadow-prisma-card transition hover:shadow-cyan cyan-glow">
                  <ex.icon className="w-8 h-8 text-cyan-400 mb-3" />
                  <h3 className="font-serif text-lg text-foreground mb-2 font-bold">
                    {ex.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ex.description}
                  </p>
                </div>)}
            </div>

            <div className="w-full h-80" />
          </div>
        </div>
      </main>
      <PortfolioDrawer
        open={showPortfolio}
        onClose={() => setShowPortfolio(false)}
        title="Portfolio"
        metrics={metrics}
      />
      <Footer riskCategory="risk.crypto" />
    </div>;
};
export default Crypto;
