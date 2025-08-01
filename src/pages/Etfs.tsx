import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const PieChart = () => (
  <svg
    role="img"
    aria-label="Illustration of diversified ETF allocation"
    width="120"
    height="120"
    viewBox="0 0 32 32"
  >
    <circle cx="16" cy="16" r="16" fill="#0b121a" />
    <path d="M16 16 L16 0 A16 16 0 0 1 31.2 9.4 Z" fill="#14b8a6" />
    <path d="M16 16 L31.2 9.4 A16 16 0 0 1 28 28 Z" fill="#0ea5e9" />
    <path d="M16 16 L28 28 A16 16 0 0 1 16 32 Z" fill="#c9a970" />
  </svg>
);

const GrowthChart = ({ years }: { years: number }) => {
  const maxYears = 20;
  const cagr = 0.07;
  const maxY = Math.pow(1 + cagr, maxYears);
  const points = Array.from({ length: years + 1 }).map((_, i) => {
    const x = (i / maxYears) * 300;
    const y = 160 - (Math.pow(1 + cagr, i) / maxY) * 160;
    return `${x},${y}`;
  });
  return (
    <svg
      role="img"
      aria-label="Historical CAGR projection"
      width="300"
      height="160"
      viewBox="0 0 300 160"
    >
      <polyline
        fill="none"
        stroke="#14b8a6"
        strokeWidth="2"
        points={points.join(' ')}
      />
    </svg>
  );
};

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
    <div className="min-h-screen bg-[#18202C] text-warm-white">
      <Navigation />
      <main className="pt-24 pb-16 space-y-16">
        <div className="section-container">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-teal-200 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to investments
          </button>
        </div>
        <section className="section-container h-[20rem] flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold">ETF &amp; Indices</h1>
          <PieChart />
        </section>

        <section className="section-container">
          <div className="flex flex-wrap justify-center gap-6">
            {examples.map((ex, idx) => (
              <div
                key={idx}
                className="w-[28rem] h-[12rem] bg-[#1b2532] border border-teal-800 rounded-lg p-6 flex flex-col justify-between shadow-prisma-card"
              >
                <h3 className="font-serif text-xl text-teal-100 mb-2 font-bold">
                  {ex.title}
                </h3>
                <p className="text-teal-50 leading-relaxed text-sm">{ex.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-container">
          <div className="bg-[#0b0f14] rounded-lg p-6 md:flex items-center gap-6">
            <div className="md:w-1/3 w-full mb-6 md:mb-0">
              <label htmlFor="years" className="block mb-2 text-teal-100 font-medium">
                Projection {years}y → {projected}€
              </label>
              <input
                id="years"
                type="range"
                min="1"
                max="20"
                value={years}
                onChange={e => setYears(parseInt(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
            <div className="md:w-2/3 w-full flex justify-center">
              <GrowthChart years={years} />
            </div>
          </div>
        </section>
      </main>
      <Footer riskCategory="risk.etf" />
    </div>
  );
};

export default Etfs;
