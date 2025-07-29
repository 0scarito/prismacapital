import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import { TrendingUp, Leaf, Cpu, Utensils, Building, ArrowRight, Home, DollarSign, Bitcoin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Investments = () => {
  const { t, language } = useLanguage();
  
  const investmentCategories = [
    {
      title: language === 'fr' ? 'Capital-investissement' : 'Private Equity',
      icon: <Building className="w-12 h-12 text-metallic-gold" />,
      description: language === 'fr' 
        ? 'Investissez dans des entreprises établies avec un potentiel de croissance élevé'
        : 'Invest in established companies with high growth potential',
      href: '/investments/private-equity'
    },
    {
      title: 'Venture Capital',
      icon: <TrendingUp className="w-12 h-12 text-metallic-gold" />,
      description: language === 'fr'
        ? 'Soutenez les start-ups innovantes dès leurs premiers stades de développement'
        : 'Support innovative startups from their earliest stages of development',
      href: '/investments/venture-capital'
    },
    {
      title: language === 'fr' ? 'Crowdfunding Immobilier' : 'Real-estate Crowdfunding',
      icon: <Home className="w-12 h-12 text-metallic-gold" />,
      description: language === 'fr'
        ? 'Participez à des projets immobiliers sélectionnés avec des rendements attractifs'
        : 'Participate in selected real estate projects with attractive returns',
      href: '/investments/real-estate'
    },
    {
      title: language === 'fr' ? 'Matières Premières' : 'Commodities',
      icon: <Leaf className="w-12 h-12 text-metallic-gold" />,
      description: language === 'fr'
        ? 'Diversifiez avec l\'or, l\'argent et autres matières premières stratégiques'
        : 'Diversify with gold, silver and other strategic commodities',
      href: '/investments/commodities'
    },
    {
      title: language === 'fr' ? 'ETF Diversifiés' : 'Diversified ETFs',
      icon: <DollarSign className="w-12 h-12 text-metallic-gold" />,
      description: language === 'fr'
        ? 'Accédez aux marchés mondiaux avec des fonds indiciels diversifiés'
        : 'Access global markets with diversified index funds',
      href: '/investments/etfs'
    },
    {
      title: 'Crypto-assets',
      icon: <Bitcoin className="w-12 h-12 text-metallic-gold" />,
      description: language === 'fr'
        ? 'Explorez l\'univers des crypto-monnaies avec une approche sécurisée'
        : 'Explore the cryptocurrency universe with a secure approach',
      href: '/investments/crypto'
    }
  ];

  const investmentBenefits = [
    "Diversification automatique dans 5-8 start-ups par secteur",
    "Due diligence complète par nos experts",
    "Suivi en temps réel via notre application",
    "Formation financière incluse",
    "Possibilité de sortie après 3 ans minimum"
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="section-container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-serif font-bold text-5xl lg:text-7xl text-warm-white mb-8 leading-tight">
                {language === 'fr' ? 'Nos Investissements' : 'Our Investments'}
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                {language === 'fr' 
                  ? 'Découvrez six catégories d\'investissement soigneusement sélectionnées. Chaque opportunité est vérifiée par nos partenaires agréés.'
                  : 'Discover six carefully selected investment categories. Each opportunity is verified by our licensed partners.'
                }
              </p>
              
              {/* Partners & Securities Button */}
              <button
                onClick={() => window.location.href = '/partners'}
                className="btn-ghost mb-8"
              >
                {language === 'fr' ? 'Partenaires & Sécurité' : 'Partners & Securities'}
              </button>
              
              <div className="flex justify-center">
                <div className="bg-warm-white/10 backdrop-blur-sm rounded-xl p-6 border border-warm-white/20">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-metallic-gold">150+</div>
                      <div className="text-sm text-light-gray">
                        {language === 'fr' ? 'Opportunités vérifiées' : 'Verified opportunities'}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-metallic-gold">€12M</div>
                      <div className="text-sm text-light-gray">
                        {language === 'fr' ? 'Investis à ce jour' : 'Invested to date'}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-metallic-gold">4.8★</div>
                      <div className="text-sm text-light-gray">
                        {language === 'fr' ? 'Note moyenne' : 'Average rating'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Warning */}
        <section className="py-12 bg-warm-white">
          <div className="section-container">
            <div className="text-center">
              <p className="text-lg text-red-600 font-medium">
                {language === 'fr' 
                  ? 'Les investissements dans les start-ups sont illiquides et peuvent entraîner une perte totale du capital.'
                  : 'Investments in start-ups are illiquid and may result in total loss of capital.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Investment Categories */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl text-deep-navy mb-6">
                {language === 'fr' ? 'Catégories d\'Investissement' : 'Investment Categories'}
              </h2>
              <p className="font-sans text-lg text-deep-navy/80 max-w-3xl mx-auto">
                {language === 'fr'
                  ? 'Six catégories d\'investissement diversifiées pour répondre à tous les profils d\'investisseurs.'
                  : 'Six diversified investment categories to meet all investor profiles.'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {investmentCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-subtle rounded-2xl p-8 border border-border/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => window.location.href = category.href}
                >
                  <div className="text-center">
                    <div className="mb-6 flex justify-center">
                      {category.icon}
                    </div>
                    
                    <h3 className="font-serif font-bold text-xl text-deep-navy mb-4 group-hover:text-metallic-gold transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="font-sans text-deep-navy/80 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <button className="w-full btn-primary">
                      {language === 'fr' ? 'Explorer' : 'Explore'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-deep-navy">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif font-bold text-4xl text-warm-white mb-8">
                  Pourquoi investir avec Cap&CO ?
                </h2>
                <div className="space-y-4">
                  {investmentBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-metallic-gold rounded-full mt-2 flex-shrink-0"></div>
                      <p className="font-sans text-light-gray">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-subtle rounded-2xl p-8">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-metallic-gold mx-auto mb-6" />
                  <h3 className="font-serif font-bold text-2xl text-deep-navy mb-4">
                    Rendement Moyen
                  </h3>
                  <div className="text-4xl font-bold text-metallic-gold mb-2">14.2%</div>
                  <p className="text-sm text-deep-navy/70">
                    Sur les 24 derniers mois (données historiques)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-warm">
          <div className="section-container">
            <div className="text-center">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                Commencez votre investissement
              </h2>
              <p className="font-sans text-xl text-light-gray mb-8 max-w-2xl mx-auto">
                Rejoignez plus de 10 000 investisseurs qui font confiance à Cap&CO.
              </p>
              <button className="btn-primary inline-flex items-center gap-2">
                Choisir mon secteur
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Investments;