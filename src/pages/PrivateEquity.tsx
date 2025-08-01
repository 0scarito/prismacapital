import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { TrendingUp, ArrowRight, DollarSign, BarChart3, Target, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PrivateEquity = () => {
  const { language } = useLanguage();
  const [activeStage, setActiveStage] = useState(0);
  const [bookmarkedDeals, setBookmarkedDeals] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const stages = [
    {
      title: language === 'fr' ? 'Sourcing' : 'Sourcing',
      color: 'bg-slate-800',
      deals: [
        { id: 1, name: 'TechCorp SAS', ebitda: '€8.2M', irr: '18%', dividend: '6.2%' },
        { id: 2, name: 'MedDevice Ltd', ebitda: '€12.1M', irr: '22%', dividend: '5.8%' },
      ]
    },
    {
      title: language === 'fr' ? 'Due Diligence' : 'Due Diligence',
      color: 'bg-slate-600',
      deals: [
        { id: 3, name: 'GreenEnergy Co', ebitda: '€15.3M', irr: '25%', dividend: '7.1%' },
        { id: 4, name: 'LogiFlow Systems', ebitda: '€6.8M', irr: '19%', dividend: '5.5%' },
      ]
    },
    {
      title: language === 'fr' ? 'Value Creation' : 'Value Creation',
      color: 'bg-blue-700',
      deals: [
        { id: 5, name: 'DataCrunch Analytics', ebitda: '€22.4M', irr: '28%', dividend: '8.3%' },
        { id: 6, name: 'CloudSecure Pro', ebitda: '€9.7M', irr: '21%', dividend: '6.9%' },
      ]
    },
    {
      title: language === 'fr' ? 'Exit' : 'Exit',
      color: 'bg-emerald-600',
      deals: [
        { id: 7, name: 'FinTech Innovations', ebitda: '€31.2M', irr: '35%', dividend: '9.4%' },
        { id: 8, name: 'AutoTech Solutions', ebitda: '€18.6M', irr: '24%', dividend: '7.7%' },
      ]
    }
  ];

  const bookmarkDeal = (dealId: number) => {
    setBookmarkedDeals(prev => 
      prev.includes(dealId) 
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      {/* Portfolio Summary Chip */}
      <div className="fixed top-32 right-8 z-50">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-metallic-gold text-deep-navy px-4 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform"
        >
          <Briefcase className="w-4 h-4 inline mr-2" />
          {bookmarkedDeals.length} {language === 'fr' ? 'deals' : 'deals'}
        </button>
      </div>

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="section-container">
            <h1 className="text-6xl font-bold text-white mb-6">
              {language === 'fr' ? 'Capital-investissement' : 'Private Equity'}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl">
              {language === 'fr' 
                ? 'Découvrez notre pipeline de transactions structurées en quatre étapes, de l\'identification à la sortie.'
                : 'Discover our deal-flow pipeline structured in four stages, from sourcing to exit.'
              }
            </p>
          </div>
        </section>

        {/* Deal-Flow Pipeline */}
        <section className="py-20">
          <div className="section-container">
            {/* Pipeline Navigation */}
            <div className="flex flex-col lg:flex-row gap-4 mb-12 overflow-x-auto">
              {stages.map((stage, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStage(index)}
                  className={`flex-1 min-w-64 ${stage.color} text-white p-6 rounded-3xl transition-all duration-300 hover:scale-105 ${
                    activeStage === index ? 'ring-4 ring-metallic-gold shadow-2xl' : ''
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                  <div className="text-sm opacity-80">
                    {stage.deals.length} {language === 'fr' ? 'opportunités' : 'opportunities'}
                  </div>
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-12">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${stages[activeStage].color.replace('bg-', 'bg-')}`}
                  style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Deal Dossiers */}
            <div className="grid md:grid-cols-2 gap-8">
              {stages[activeStage].deals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-2xl font-bold text-slate-800">{deal.name}</h4>
                    <button
                      onClick={() => bookmarkDeal(deal.id)}
                      className={`p-2 rounded-full transition-colors ${
                        bookmarkedDeals.includes(deal.id)
                          ? 'bg-metallic-gold text-deep-navy'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Target className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-sm text-slate-600 mb-1">EBITDA</div>
                      <div className="text-lg font-bold text-slate-800">{deal.ebitda}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-600 mb-1">IRR Target</div>
                      <div className="text-lg font-bold text-emerald-600">{deal.irr}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-600 mb-1">{language === 'fr' ? 'Dividende' : 'Dividend'}</div>
                      <div className="text-lg font-bold text-blue-600">{deal.dividend}</div>
                    </div>
                  </div>

                  <button className="w-full bg-slate-100 hover:bg-metallic-gold hover:text-deep-navy text-slate-700 py-3 rounded-lg font-medium transition-all duration-300 group-hover:shadow-lg">
                    {language === 'fr' ? 'Voir les détails' : 'View Details'}
                    <ArrowRight className="w-4 h-4 inline ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Portfolio Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white w-96 h-full p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-800">
                {language === 'fr' ? 'Portfolio' : 'Portfolio'}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-bold text-slate-800 mb-4">
                  {language === 'fr' ? 'Performance Agrégée' : 'Aggregated Performance'}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">23.4%</div>
                    <div className="text-sm text-slate-600">Avg IRR</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">7.1%</div>
                    <div className="text-sm text-slate-600">Avg Dividend</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-800 mb-4">
                  {language === 'fr' ? 'Deals Sauvegardés' : 'Bookmarked Deals'}
                </h4>
                {bookmarkedDeals.length === 0 ? (
                  <p className="text-slate-500">
                    {language === 'fr' ? 'Aucun deal sauvegardé' : 'No bookmarked deals'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stages.flatMap(stage => stage.deals)
                      .filter(deal => bookmarkedDeals.includes(deal.id))
                      .map(deal => (
                        <div key={deal.id} className="bg-slate-50 p-4 rounded-lg">
                          <div className="font-medium text-slate-800">{deal.name}</div>
                          <div className="text-sm text-slate-600">IRR: {deal.irr}</div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PrivateEquity;