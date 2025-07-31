import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const RealEstate = () => {
  const examples = [
    {
      title: 'Lyon Residential Fund',
      description: 'Short-term development of eco‑friendly apartments in Lyon.'
    },
    {
      title: 'Paris Office Renovation',
      description: 'Refurbishment of historical buildings into modern workspaces.'
    },
    {
      title: 'Student Housing Pool',
      description: 'Crowdfunded residences for universities across France.'
    },
    {
      title: 'Healthcare Facilities',
      description: 'Invest in clinics and senior housing with stable rental yields.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Real-estate Crowdfunding</h1>
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
      <Footer riskCategory="risk.realEstate" />
    </div>
  );
};

export default RealEstate;
