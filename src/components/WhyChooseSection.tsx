import { useState } from 'react';
import { Heart, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhyChooseSection = () => {
  const [activePersona, setActivePersona] = useState('grandparents');
  const { t } = useLanguage();

  const personas = {
    grandparents: {
      icon: Heart,
      headline: t('whyChoose.personas.grandparents.headline'),
      description: t('whyChoose.personas.grandparents.description'),
      stat: '62%',
      statLabel: t('whyChoose.personas.grandparents.statLabel')
    },
    parents: {
      icon: Users,
      headline: t('whyChoose.personas.parents.headline'),
      description: t('whyChoose.personas.parents.description'),
      stat: '85%',
      statLabel: t('whyChoose.personas.parents.statLabel')
    },
    recipients: {
      icon: TrendingUp,
      headline: t('whyChoose.personas.recipients.headline'),
      description: t('whyChoose.personas.recipients.description'),
      stat: '23%',
      statLabel: t('whyChoose.personas.recipients.statLabel')
    }
  };

  const currentPersona = personas[activePersona as keyof typeof personas];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl lg:text-6xl text-foreground mb-6">
            {t('whyChoose.title')}
          </h2>
        </div>

        {/* Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(personas).map(([key, persona]) => {
            const Icon = persona.icon;
            return (
              <button
                key={key}
                onClick={() => setActivePersona(key)}
                className={`w-40 flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activePersona === key
                    ? 'bg-primary text-primary-foreground shadow-button'
                    : 'bg-card text-card-foreground hover:bg-primary/10 hover:text-white border border-border'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="capitalize">{key}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-card border border-border/20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-serif font-bold text-3xl lg:text-4xl text-card-foreground mb-6">
                {currentPersona.headline}
              </h3>
              <p className="font-sans text-xl text-muted-foreground leading-relaxed">
                {currentPersona.description}
              </p>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="inline-block p-8 bg-gradient-subtle rounded-2xl">
                <div className="text-6xl lg:text-8xl font-bold text-primary mb-2">
                  {currentPersona.stat}
                </div>
                <div className="text-lg text-muted-foreground font-medium">
                  {currentPersona.statLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;