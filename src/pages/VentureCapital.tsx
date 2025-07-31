import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const VentureCapital = () => {
  const examples = [
    {
      title: 'Early Stage Tech Fund',
      description: 'Backing high‑growth French start‑ups in AI and software.'
    },
    {
      title: 'Seed Impact Fund',
      description: 'Invests in young companies targeting social and environmental issues.'
    },
    {
      title: 'Series A Opportunities',
      description: 'Focused on scale‑ups with proven traction in Europe.'
    },
    {
      title: 'Growth FinTech Fund',
      description: 'Participation in innovative payment and banking technology ventures.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Venture Capital</h1>
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
      <Footer riskCategory="risk.ventureCapital" />
    </div>
  );
};

export default VentureCapital;
