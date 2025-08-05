import { useState } from 'react';
import { Target, Gift, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorksSection = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const { t } = useLanguage();
  
  const steps = [
    {
      number: "1",
      title: t('howItWorks.steps.0.title'),
      description: t('howItWorks.steps.0.description'),
      icon: Target,
      interaction: t('howItWorks.steps.0.interaction')
    },
    {
      number: "2",
      title: t('howItWorks.steps.1.title'),
      description: t('howItWorks.steps.1.description'),
      icon: Gift,
      interaction: t('howItWorks.steps.1.interaction')
    },
    {
      number: "3",
      title: t('howItWorks.steps.2.title'),
      description: t('howItWorks.steps.2.description'),
      icon: Users,
      interaction: t('howItWorks.steps.2.interaction')
    },
    {
      number: "4",
      title: t('howItWorks.steps.3.title'),
      description: t('howItWorks.steps.3.description'),
      icon: TrendingUp,
      interaction: t('howItWorks.steps.3.interaction')
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
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="relative group"
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-full w-full h-[2px] bg-gradient-to-r from-border to-transparent z-0"></div>
              )}
              
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
                  <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>
                  
                  {/* Interaction hint */}
                  <p className="font-sans text-sm text-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {step.interaction}
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