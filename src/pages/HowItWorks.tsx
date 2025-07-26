import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle, Gift, Smartphone, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choisissez votre secteur",
      description: "Sélectionnez parmi nos secteurs soigneusement sélectionnés : Clean-Tech, Innovation Alimentaire, IA, et plus encore. Chaque portefeuille est vérifié avec notre partenaire agréé AMF.",
      icon: <CheckCircle className="w-8 h-8 text-metallic-gold" />,
      features: ["Secteurs vérifiés", "Due diligence complète", "Diversification optimale"]
    },
    {
      number: "02", 
      title: "Personnalisez le cadeau",
      description: "Ajoutez le nom du destinataire et un message personnel. Nous l'imprimons sur un papier de qualité archivage avec une bordure dorée.",
      icon: <Gift className="w-8 h-8 text-metallic-gold" />,
      features: ["Impression premium", "Message personnalisé", "Packaging luxe"]
    },
    {
      number: "03",
      title: "Livraison et activation",
      description: "Le destinataire scanne le QR code, complète son KYC (avec un tuteur si mineur), et suit ses investissements dans notre app tout en apprenant la finance.",
      icon: <Smartphone className="w-8 h-8 text-metallic-gold" />,
      features: ["KYC simplifié", "App mobile", "Leçons financières"]
    }
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
                Comment ça marche
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                Offrir un investissement en start-ups françaises n'a jamais été aussi simple. 
                Découvrez notre processus en 3 étapes simples.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="space-y-20">
              {steps.map((step, index) => (
                <div key={step.number} className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-6xl font-serif font-bold text-metallic-gold/20">
                        {step.number}
                      </span>
                      {step.icon}
                    </div>
                    <h3 className="font-serif font-bold text-3xl text-deep-navy mb-4">
                      {step.title}
                    </h3>
                    <p className="font-sans text-lg text-deep-navy/80 mb-8 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 font-sans text-deep-navy">
                          <CheckCircle className="w-5 h-5 text-metallic-gold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`bg-gradient-subtle rounded-2xl p-8 ${
                    index % 2 === 1 ? 'lg:col-start-1' : ''
                  }`}>
                    <div className="aspect-video bg-deep-navy/5 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-16 h-16 text-metallic-gold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-warm">
          <div className="section-container">
            <div className="text-center">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                Prêt à offrir l'avenir ?
              </h2>
              <p className="font-sans text-xl text-light-gray mb-8 max-w-2xl mx-auto">
                Commencez dès maintenant et offrez un cadeau qui a du sens.
              </p>
              <button className="btn-primary inline-flex items-center gap-2">
                Choisir un cadeau
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

export default HowItWorks;