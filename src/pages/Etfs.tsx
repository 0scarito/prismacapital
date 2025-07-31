import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Etfs = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main className="pt-24 pb-16">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Diversified ETFs</h1>
          <div className="bg-card rounded-lg p-8 border border-border text-muted-foreground">
            Example opportunities coming soon...
          </div>
        </div>
      </div>
    </main>
    <Footer riskCategory="risk.etf" />
  </div>
);

export default Etfs;
