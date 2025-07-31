import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WorldMap from '@/components/WorldMap';
import { useState } from 'react';

const Commodities = () => {
  const [highlight, setHighlight] = useState<string | undefined>(undefined);
  const examples = [
    {
      title: 'Inflation Hedge',
      description: 'Protect yourself with gold, silver and rare metals.',
      country: 'ZAF'
    },
    {
      title: 'Agricultural Demand',
      description: 'Invest in the essential crops feeding the planet.',
      country: 'BRA'
    },
    {
      title: 'Energy Access',
      description: 'Easily access fossil or renewable energy markets.',
      country: 'SAU'
    },
    {
      title: 'Tokenised Liquidity',
      description: 'Liquidate anytime via tokenised contracts.',
      country: 'USA'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Commodities</h1>
            <div className="mb-8">
              <WorldMap highlight={highlight} />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {examples.map((ex, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHighlight(ex.country)}
                  onMouseLeave={() => setHighlight(undefined)}
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
      <Footer riskCategory="risk.commodities" />
    </div>
  );
};

export default Commodities;
