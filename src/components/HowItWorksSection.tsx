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
      description: "Offrez une éducation financière de qualité à vos proches",
      icon: Target
    },
    {
      number: "2", 
      title: "Investissez",
      description: "Transformez votre investissement en cadeau éducatif",
      icon: Gift
    },
    {
      number: "3",
      title: "Transmettez",
      description: "Partagez vos connaissances et construisez l'avenir",
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
            >
              {/* Step Card */}
              <div className="bg-muted/20 rounded-2xl p-8 border border-border/20 h-full">
                {/* Step Number */}
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6 mx-auto">
                  <span className="font-sans font-bold text-2xl text-foreground">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-foreground" strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="font-serif font-bold text-2xl text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;