import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

const Etfs = () => {
  const [years, setYears] = useState(10);
  const projected = (100 * Math.pow(1.07, years)).toFixed(0);
  const examples = [
    {
      title: 'Diversified Baskets',
      description: 'Access stock and bond baskets in one click.'
    },
    {
      title: 'Ultra-low Fees',
      description: 'Benefit from highly competitive fees and full transparency.'
    },
    {
      title: 'Strong Themes',
      description: 'Choose focused themes: AI, climate, health, cybersecurity…'
    },
    {
      title: 'Auto-Reinvested',
      description: 'Dividends are reinvested automatically for long-term growth.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">ETF & Indices</h1>
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <span className="mr-4 font-medium">Projection {years}y</span>
                <span className="font-bold text-metallic-gold">{projected}€</span>
              </div>
              <Slider min={1} max={20} step={1} value={[years]} onValueChange={v => setYears(v[0])} />
              <Progress value={(years / 20) * 100} className="mt-2" />
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
      <Footer riskCategory="risk.etf" />
    </div>
  );
};

export default Etfs;
