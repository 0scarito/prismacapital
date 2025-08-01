import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WorldMap from '@/components/WorldMap';
import { useState } from 'react';
import { ArrowLeft, Coins, Wheat, Zap, Link as Chain } from 'lucide-react';

const Commodities = () => {
  const [highlight, setHighlight] = useState<string | undefined>(undefined);
  const examples = [
    {
      title: 'Hedge Inflation',
      description: 'Preserve purchasing power with precious metals.',
      country: 'ZAF',
      icon: Coins
    },
    {
      title: 'Food Staples',
      description: 'Invest in essential agricultural goods.',
      country: 'BRA',
      icon: Wheat
    },
    {
      title: 'Energy Markets',
      description: 'Tap fossil and renewable energy opportunities.',
      country: 'SAU',
      icon: Zap
    },
    {
      title: 'Tokenised Contracts',
      description: 'Trade tokenised commodity contracts for liquidity.',
      country: 'USA',
      icon: Chain
    }
  ];

  const countryData = {
    ZAF: { share: '6%', change: '+23%' },
    BRA: { share: '9%', change: '+12%' },
    SAU: { share: '11%', change: '-5%' },
    USA: { share: '20%', change: '+18%' }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to investments
          </button>
        </div>
        {/* Hero Banner */}
        <section
          className="relative h-72 flex items-center justify-center text-white mb-12"
          style={{ backgroundColor: '#1A1F24' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1626014283048-1cdceb4cb6c1?auto=format&fit=crop&w=1600&q=60), url(https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=60)"
            }}
          />
          <h1 className="relative z-10 text-5xl font-bold">Commodities</h1>
        </section>

        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {examples.map((ex, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHighlight(ex.country)}
                  onMouseLeave={() => setHighlight(undefined)}
                  className="bg-card rounded-lg p-6 border border-border shadow-prisma-card"
                >
                  <div className="mb-4 text-[#C87437]">
                    <ex.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground mb-2 font-bold">
                    {ex.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ex.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <WorldMap highlight={highlight} data={countryData} />
            </div>
          </div>
        </div>
      </main>
      <Footer riskCategory="risk.commodities" />
    </div>
  );
};

export default Commodities;
