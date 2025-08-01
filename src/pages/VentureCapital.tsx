import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Rocket, Play, TrendingUp, Calendar, Target, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Deal {
  id: number;
  name: string;
  stage: string;
  funding: string;
  valuation: string;
  milestones: string[];
  video: string;
}

interface Platform {
  id: number;
  theme: string;
  color: string;
  height: string;
  deals: Deal[];
}
const VentureCapital = () => {
  const {
    language
  } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [activePlatform, setActivePlatform] = useState<number | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [spinFast, setSpinFast] = useState(false);
  const [towerOffset, setTowerOffset] = useState(0);
  const platforms: Platform[] = [{
    id: 1,
    theme: 'DeepTech',
    color: 'from-purple-600 to-purple-800',
    height: '25%',
    deals: [{
      id: 1,
      name: 'QuantumFlow AI',
      stage: 'Series A',
      funding: '€12M',
      valuation: '€80M',
      milestones: ['Q1 2024: Product Launch', 'Q3 2024: First Enterprise Client', 'Q1 2025: Series B'],
      video: 'quantum-pitch.mp4'
    }, {
      id: 2,
      name: 'BioSynth Labs',
      stage: 'Seed',
      funding: '€4.5M',
      valuation: '€25M',
      milestones: ['Q2 2024: FDA Approval', 'Q4 2024: Manufacturing Scale', 'Q2 2025: Market Entry'],
      video: 'biosynth-pitch.mp4'
    }]
  }, {
    id: 2,
    theme: 'FinTech',
    color: 'from-blue-600 to-blue-800',
    height: '50%',
    deals: [{
      id: 3,
      name: 'CryptoTrade Pro',
      stage: 'Series B',
      funding: '€25M',
      valuation: '€180M',
      milestones: ['Q1 2024: EU License', 'Q2 2024: 1M Users', 'Q4 2024: IPO Prep'],
      video: 'cryptotrade-pitch.mp4'
    }]
  }, {
    id: 3,
    theme: 'Climate',
    color: 'from-green-600 to-green-800',
    height: '75%',
    deals: [{
      id: 4,
      name: 'CarbonZero Tech',
      stage: 'Series A',
      funding: '€18M',
      valuation: '€120M',
      milestones: ['Q1 2024: Pilot Projects', 'Q3 2024: Commercial Launch', 'Q1 2025: Scale Up'],
      video: 'carbonzero-pitch.mp4'
    }, {
      id: 5,
      name: 'SolarGrid Systems',
      stage: 'Seed+',
      funding: '€8M',
      valuation: '€45M',
      milestones: ['Q2 2024: Technology Patent', 'Q4 2024: First Installation', 'Q2 2025: Series A'],
      video: 'solargrid-pitch.mp4'
    }]
  }, {
    id: 4,
    theme: 'Consumer',
    color: 'from-orange-600 to-orange-800',
    height: '100%',
    deals: [{
      id: 6,
      name: 'FoodTech Revolution',
      stage: 'Series A',
      funding: '€15M',
      valuation: '€95M',
      milestones: ['Q1 2024: Product Launch', 'Q2 2024: Retail Partnerships', 'Q4 2024: International'],
      video: 'foodtech-pitch.mp4'
    }]
  }];
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    const handleWheel = (e: WheelEvent) => {
      setTowerOffset(prev => Math.max(prev + (e.deltaY > 0 ? 40 : -40), 0));
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
  const allDeals = platforms.flatMap(p => p.deals);
  const avgIRR = '28.5';
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      
      <main className="pt-24">
        <div className="section-container">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 mb-8 text-slate-50">
            <ArrowLeft className="w-4 h-4" />
            {language === 'fr' ? 'Retour aux investissements' : 'Back to investments'}
          </button>
        </div>

        {/* Hero with Rocket Nosecone */}
        <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative" style={{ backgroundPositionY: `-${towerOffset}px` }}>
          <div className="section-container">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-6">
                {language === 'fr' ? 'Capital-risque' : 'Venture Capital'}
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
                {language === 'fr' ? 'Gravissez notre tour de lancement et découvrez les start-ups les plus prometteuses par secteur.' : 'Climb our launchpad tower and discover the most promising startups by sector.'}
              </p>
            </div>

            {/* Rocket Nosecone with Portfolio Performance */}
            <div className="flex justify-center">
              <div
                className="relative bg-gradient-to-t from-slate-700 to-slate-600 w-32 h-48 rounded-t-full border-4 border-orange-400 hover:scale-105 transition-transform cursor-pointer group"
                style={{ animation: `spin ${spinFast ? 2 : 60}s linear infinite` }}
                onMouseEnter={() => {
                  setSpinFast(true);
                  setActivePlatform(0);
                  setTimeout(() => setSpinFast(false), 2000);
                }}
              >
                <Rocket className="w-8 h-8 text-orange-400 absolute top-4 left-1/2 transform -translate-x-1/2" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                  <div className="text-sm text-slate-300 mb-1">Portfolio IRR</div>
                  <div className="text-2xl font-bold text-orange-400">{avgIRR}%</div>
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute -right-48 top-0 bg-slate-800 p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="text-sm text-slate-300">Fund Performance</div>
                  <div className="text-lg font-bold text-orange-400">{avgIRR}% IRR</div>
                  <div className="text-xs text-slate-400">Based on 24 exits</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Launchpad Tower */}
        <section className="py-20 relative">
          <div className="section-container">
            <div className="relative">
              {/* Tower Structure */}
              <div className="flex flex-col-reverse gap-8 max-w-4xl mx-auto">
                {platforms.map((platform, index) => (
                  <div
                    key={platform.id}
                    className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r ${platform.color} transform transition-all duration-500`}
                    style={{
                      transform: `translateY(${-(scrollY * 0.1 * (index + 1)) - towerOffset}px)`,
                      minHeight: '200px'
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0 2px, transparent 2px 10px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.1) 0 2px, transparent 2px 10px)",
                        backgroundSize: '20px 20px',
                        transform: `translateY(${scrollY * 0.05 * (index + 1)}px)`
                      }}
                    />
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-3xl font-bold text-white">{platform.theme}</h3>
                      <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {platform.deals.length} {language === 'fr' ? 'deals' : 'deals'}
                      </div>
                    </div>

                    {/* Launch Pads (Deal Cards) */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {platform.deals.map((deal) => (
                        <div
                          key={deal.id}
                          className="relative w-64 h-64 mx-auto group"
                          onClick={() => setSelectedDeal(deal)}
                        >
                          <div className="absolute inset-0 rounded-full border border-orange-400 opacity-30 animate-spin-slow" />
                          <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group-hover:-translate-y-1" style={{ top: '-3px' }}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-bold text-white truncate">{deal.name}</h4>
                              <Play className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              <div>
                                <div className="text-white/60">{language === 'fr' ? 'Étape' : 'Stage'}</div>
                                <div className="font-medium text-white">{deal.stage}</div>
                              </div>
                              <div>
                                <div className="text-white/60">{language === 'fr' ? 'Financement' : 'Funding'}</div>
                                <div className="font-medium text-white">{deal.funding}</div>
                              </div>
                            </div>
                            <div className="text-sm text-white/80">
                              {language === 'fr' ? 'Valorisation' : 'Valuation'}: <span className="font-medium">{deal.valuation}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tower Support Structure */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 bg-slate-700 h-full -z-10 rounded-full" />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 bg-slate-900/50">
          <div className="section-container">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">47</div>
                <div className="text-slate-300">{language === 'fr' ? 'Start-ups actives' : 'Active Startups'}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">€180M</div>
                <div className="text-slate-300">{language === 'fr' ? 'Fonds sous gestion' : 'Assets Under Management'}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">12</div>
                <div className="text-slate-300">{language === 'fr' ? 'Sorties réussies' : 'Successful Exits'}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">8.5x</div>
                <div className="text-slate-300">{language === 'fr' ? 'Multiple moyen' : 'Average Multiple'}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mission Control Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedDeal(null)}
          />
          <div className="absolute right-0 top-0 h-full w-full md:max-w-xl bg-slate-900 border-l border-slate-700 p-8 overflow-y-auto animate-slide-in-right">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-3xl font-bold text-white">{selectedDeal.name}</h3>
              <button onClick={() => setSelectedDeal(null)} className="text-slate-400 hover:text-white text-2xl">
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Video Placeholder */}
              <div className="bg-slate-800 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <div className="text-white">Pitch Video</div>
                  <div className="text-slate-400 text-sm">{selectedDeal.video}</div>
                </div>
              </div>

              {/* Deal Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-4">
                    {language === 'fr' ? 'Informations clés' : 'Key Information'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === 'fr' ? 'Étape' : 'Stage'}</span>
                      <span className="text-white font-medium">{selectedDeal.stage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === 'fr' ? 'Financement' : 'Funding'}</span>
                      <span className="text-white font-medium">{selectedDeal.funding}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === 'fr' ? 'Valorisation' : 'Valuation'}</span>
                      <span className="text-white font-medium">{selectedDeal.valuation}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-white mb-4">
                    {language === 'fr' ? 'Jalons à venir' : 'Upcoming Milestones'}
                  </h4>
                  <div className="space-y-3">
                    {selectedDeal.milestones.map((milestone: string, index: number) => <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" />
                        <span className="text-slate-300">{milestone}</span>
                      </div>)}
                  </div>
                </div>

                <button className="w-full bg-orange-400 hover:bg-orange-500 text-slate-900 py-3 px-6 rounded-lg font-bold transition-colors">
                  {language === 'fr' ? 'Investir maintenant' : 'Invest Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer riskCategory="risk.ventureCapital" />
    </div>
  );
};
export default VentureCapital;