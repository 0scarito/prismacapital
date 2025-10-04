import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import InvestmentCard from '@/components/InvestmentCard';
import { ArrowLeft, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Crypto = () => {
  const [basket, setBasket] = useState<{ id: number; name: string }[]>([]);

  const deals = [
    { id: 1, name: 'Bitcoin Yield', description: 'Earn 5% APY by lending BTC to institutional borrowers.' },
    { id: 2, name: 'Ethereum Staking', description: 'Participate in ETH staking pools with liquid rewards.' },
    { id: 3, name: 'Solana Validator', description: 'Run a validator node and earn SOL rewards.' },
    { id: 4, name: 'Stablecoin Farm', description: 'Provide liquidity to stablecoin pools for steady returns.' },
  ];

  const metrics = [
    { label: 'YTD Performance', value: '+68%' },
    { label: 'Staking Rewards', value: '5%' },
  ];

  const addToBasket = (deal: { id: number; name: string }) => {
    setBasket((prev) => (prev.find((d) => d.id === deal.id) ? prev : [...prev, deal]));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-16 pb-16">
        <div className="section-container mb-8">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="bg-white text-primary hover:bg-white/90 border-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to investments
          </Button>
        </div>

        <section className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 py-12 mb-12">
          <div className="section-container">
            <div className="flex items-center justify-center gap-8 mb-8">
              <h1 className="text-4xl font-bold text-cyan-100">Crypto-assets</h1>
              <Coins className="w-16 h-16 text-cyan-300/80" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{m.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map((deal) => (
                <InvestmentCard
                  key={deal.id}
                  id={`crypto-${deal.id}`}
                  title={deal.name}
                  description={deal.description}
                  type="Crypto"
                  onAdd={() => addToBasket(deal)}
                />
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer riskCategory="risk.crypto" />
    </div>
  );
};

export default Crypto;

