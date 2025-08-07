import { useState } from 'react';
import { Target, Gift, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorksSection = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const { t } = useLanguage();
  
  const steps = [
    {
      number: "1",
      title: "Éduquez",
      description:
        "Ce n'est pas qu'un simple investissement, ce n'est pas non plus juste un cadeau. " +
        "C'est aussi une opportunité d'aller chercher la curiosité, de s'ouvrir à de nouveaux horizons. " +
        "C'est l'occasion de découvrir de nouvelles façons de gérer son argent, le tout de manière intelligente mais aussi entraînante.",
      icon: Target
    },
    {
      number: "2",
      title: "Investissez",
      description:
        "C'est sécurisé, simple, rapide et facile. Vous avez la possibilité de choisir parmi 6 différents secteurs " +
        "des investissements soigneusement choisis par nous afin de transformer votre argent initial en petite fortune. " +
        "En 25 ans, le marché a plus que triplé. 88% des millionnaires se sont enrichis en investissant dans un ou plusieurs types d'actifs. " +
        "Chaque année depuis 40 ans, le marché a pris en moyenne un peu moins de 10%.",
      icon: Gift
    },
    {
      number: "3",
      title: "Transmettez",
      description:
        "Ce n'est pas juste un investissement, c'est un cadeau, c'est une opportunité qui ne perd pas sa valeur au bout de quelques jours. " +
        "66% des Français qui ne trouvent pas d'utilité à leurs cadeaux ou ne les aiment pas finissent par les ranger au fond d'un placard dans les 3 premiers mois. " +
        "En moyenne, les cadeaux perdent jusqu'à 55% de leur valeur au bout du premier mois après avoir été offerts.",
      icon: Users
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-card">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl lg:text-6xl text-card-foreground mb-6">
            {t('howItWorks.title')}
          </h2>
          <p className="font-sans text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('howItWorks.subtitle')}
          </p>
          
          {/* CTA Button to How It Works page */}
          <button
            onClick={() => window.location.href = '/how-it-works'}
            className="btn-primary"
          >
            {t('howItWorks.seeHow')}
          </button>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="relative group"
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Step Card */}
              <div className="relative bg-gradient-subtle rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 z-10 border border-border/20 h-full">
                {/* Step Number */}
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="font-sans font-bold text-2xl text-primary">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                    <step.icon className="w-6 h-6 text-secondary" strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="font-serif font-bold text-2xl text-card-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/20 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                
                {/* Hover effect overlay */}
                {hoveredStep === index && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl pointer-events-none"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;