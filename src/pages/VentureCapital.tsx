import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const VentureCapital = () => {
  const examples = [
    {
      title: 'Early Entry',
      description: 'Early entry into disruptive ventures.',
      timeline: ['2021 Incorporation', '2022 Seed', '2024 Series A']
    },
    {
      title: 'Co-invest with VCs',
      description: 'Alongside tier-one venture funds.',
      timeline: ['2020 Seed', '2023 Series B']
    },
    {
      title: 'Flexible Tickets',
      description: 'Tickets from €1 000 for accessibility.',
      timeline: ['Opens 2024']
    },
    {
      title: 'Founder Video Updates',
      description: 'Monthly progress direct from founders.',
      timeline: ['Launch 2023']
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <main className="pt-24">
        {/* Hero */}
        <section
          className="py-20"
          style={{ background: 'linear-gradient(135deg,#281a4b,#3b2270)' }}
        >
          <div className="section-container">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold text-white">Start-ups</h1>
              <img
                src="/rocket.png"
                alt="Rocket launch"
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="py-12">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 gap-6">
              {examples.map((ex, idx) => (
                <details
                  key={idx}
                  className="group bg-card rounded-lg p-6 border border-border shadow-prisma-card transition-all duration-300 ease-out open:sm:col-span-2"
                >
                  <summary className="cursor-pointer list-none">
                    <h3 className="font-serif text-xl font-bold mb-2 leading-[1.45]">
                      {ex.title}
                    </h3>
                    <p className="text-base leading-[1.45] text-muted-foreground">
                      {ex.description}
                    </p>
                  </summary>
                  <div className="mt-4">
                    <ul className="flex items-center flex-wrap gap-6">
                      {ex.timeline.map((t, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <svg
                            className="w-3 h-3 fill-primary"
                            viewBox="0 0 8 8"
                          >
                            <circle cx="4" cy="4" r="4" />
                          </svg>
                          <span className="text-sm">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
            <hr className="my-12 border-border/30" />
            <div className="h-48" />
          </div>
        </section>
      </main>
      <Footer riskCategory="risk.ventureCapital" />
    </div>
  );
};

export default VentureCapital;
