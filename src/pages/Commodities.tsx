import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Commodities = () => {
  const examples = [
    {
      title: 'Gold & Metals Fund',
      description: 'Exposure to gold, silver and strategic metals through a diversified vehicle.'
    },
    {
      title: 'Energy Basket',
      description: 'Invest in a mix of oil, natural gas and renewable energy futures.'
    },
    {
      title: 'Agriculture Notes',
      description: 'Participate in the global demand for wheat, corn and soybeans.'
    },
    {
      title: 'Water Resources Trust',
      description: 'Long-term approach to companies managing and treating water assets.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Commodities</h1>
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
      <Footer riskCategory="risk.commodities" />
    </div>
  );
};

export default Commodities;
