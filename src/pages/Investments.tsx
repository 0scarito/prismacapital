import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { TrendingUp, Leaf, Cpu, Utensils, Building, ArrowRight } from 'lucide-react';

const Investments = () => {
  const investmentSectors = [
    {
      title: "Clean-Tech",
      icon: <Leaf className="w-12 h-12 text-metallic-gold" />,
      description: "Investissez dans l'avenir énergétique de la France avec des start-ups innovantes en technologies propres.",
      companies: ["SolarTech Paris", "GreenEnergy Bretagne", "EcoInnovation Lyon"],
      minInvestment: "€200",
      expectedReturn: "8-15%",
      riskLevel: "Modéré"
    },
    {
      title: "Innovation Alimentaire",
      icon: <Utensils className="w-12 h-12 text-metallic-gold" />,
      description: "Soutenez la révolution alimentaire française avec des entreprises qui transforment notre façon de manger.",
      companies: ["AgriTech Normandie", "FoodLab Marseille", "BioFarm Toulouse"],
      minInvestment: "€200",
      expectedReturn: "10-18%",
      riskLevel: "Élevé"
    },
    {
      title: "Intelligence Artificielle",
      icon: <Cpu className="w-12 h-12 text-metallic-gold" />,
      description: "Participez à la révolution IA française en investissant dans les start-ups technologiques les plus prometteuses.",
      companies: ["AI Solutions Paris", "DeepTech Sophia", "RoboticsLab Grenoble"],
      minInvestment: "€200",
      expectedReturn: "15-25%",
      riskLevel: "Élevé"
    },
    {
      title: "FinTech",
      icon: <Building className="w-12 h-12 text-metallic-gold" />,
      description: "Investissez dans l'avenir financier avec des solutions innovantes qui démocratisent l'accès aux services financiers.",
      companies: ["PayTech France", "CryptoSecure Paris", "NeoBank Lyon"],
      minInvestment: "€200",
      expectedReturn: "12-20%",
      riskLevel: "Modéré à Élevé"
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
                Nos Investissements
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                Découvrez nos secteurs d'investissement soigneusement sélectionnés. 
                Chaque start-up est vérifiée par notre partenaire agréé AMF.
              </p>
              <div className="flex justify-center">
                <div className="bg-warm-white/10 backdrop-blur-sm rounded-xl p-6 border border-warm-white/20">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-metallic-gold">150+</div>
                      <div className="text-sm text-light-gray">Start-ups vérifiées</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-metallic-gold">€12M</div>
                      <div className="text-sm text-light-gray">Investis à ce jour</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-metallic-gold">4.8★</div>
                      <div className="text-sm text-light-gray">Note moyenne</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Sectors */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl text-deep-navy mb-6">
                Secteurs d'Investissement
              </h2>
              <p className="font-sans text-lg text-deep-navy/80 max-w-3xl mx-auto">
                Chaque secteur est soigneusement curé pour offrir le meilleur potentiel de croissance 
                tout en soutenant l'innovation française.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {investmentSectors.map((sector, index) => (
                <div key={index} className="bg-gradient-subtle rounded-2xl p-8 border border-border/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    {sector.icon}
                    <h3 className="font-serif font-bold text-2xl text-deep-navy">
                      {sector.title}
                    </h3>
                  </div>
                  
                  <p className="font-sans text-deep-navy/80 mb-6 leading-relaxed">
                    {sector.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-warm-white rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-metallic-gold">{sector.minInvestment}</div>
                      <div className="text-xs text-deep-navy/60">Minimum</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-metallic-gold">{sector.expectedReturn}</div>
                      <div className="text-xs text-deep-navy/60">Retour estimé</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-metallic-gold">{sector.riskLevel}</div>
                      <div className="text-xs text-deep-navy/60">Risque</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-sans font-medium text-deep-navy mb-3">Exemples d'entreprises :</h4>
                    <div className="space-y-2">
                      {sector.companies.map((company, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-deep-navy/70">
                          <TrendingUp className="w-4 h-4 text-metallic-gold" />
                          {company}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full btn-primary">
                    Investir dans {sector.title}
                  </button>
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