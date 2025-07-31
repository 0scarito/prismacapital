import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Sparkline from '@/components/Sparkline';

const PrivateEquity = () => {
  const [hovered, setHovered] = useState(-1);
  const examples = [
    {
      title: 'European SME Growth',
      description: 'Invest in established European SMEs with high growth potential.'
    },
    {
      title: 'Market Leader Buyouts',
      description: 'Take part in acquiring leading companies with solid cash flow.'
    },
    {
      title: 'Dividend Strategies',
      description: 'Diversify with mature businesses paying regular dividends.'
    },
    {
      title: 'Positive Impact Deals',
      description: 'Support firms creating measurable social and environmental value.'
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
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(-1)}
                  className="bg-card rounded-lg p-6 border border-border shadow-prisma-card"
                >
                  <h3 className="font-serif text-lg text-foreground mb-2 font-bold">
                    {ex.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ex.description}
                  </p>
                  <Sparkline animate={hovered === idx} />
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
