import { useState } from 'react';
import { Heart, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhyChooseSection = () => {
  const [activePersona, setActivePersona] = useState('grandparents');
  const { t, language } = useLanguage();

  const personas = {
    grandparents: {
      icon: Heart,
      headline:
        language === 'fr'
          ? 'Transmettez un héritage, pas seulement un chèque'
          : 'Leave a legacy, not just a cheque',
      description:
        language === 'fr'
          ? "62% des grands-parents français préfèrent financer l'avenir plutôt que d'offrir un jouet (INSEE 2024)."
          : "62% of French grands-parents say they'd rather fund a future than buy a toy (INSEE 2024).",
      stat: '62%',
      statLabel: language === 'fr' ? 'préfèrent un cadeau utile' : 'prefer meaningful gifts'
    },
    parents: {
      icon: Users,
      headline:
        language === 'fr'
          ? 'Initiez tôt à la culture financière'
          : 'Teach financial literacy early',
      description:
        language === 'fr'
          ? "Offrez à vos enfants une véritable propriété tout en les sensibilisant à l'investissement et à l'innovation française."
          : "Give your children real ownership while they learn about investing and French innovation.",
      stat: '85%',
      statLabel: language === 'fr' ? 'souhaitent une éducation financière' : 'want financial education'
    },
    recipients: {
      icon: TrendingUp,
      headline:
        language === 'fr'
          ? 'Devenez vraiment actionnaire, pas simple épargnant'
          : 'Own real equity, not savings',
      description:
        language === 'fr'
          ? "Suivez la performance de votre investissement et découvrez les entreprises soutenues via notre application."
          : "Track your investment's performance and learn about the companies you're backing through our app.",
      stat: '23%',
      statLabel: language === 'fr' ? 'de rendement annuel moyen' : 'average annual returns'
    }
  };

  const currentPersona = personas[activePersona as keyof typeof personas];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl lg:text-6xl text-foreground mb-6">
            {language === 'fr' ? 'Pourquoi choisir Cap&CO ?' : 'Why Choose Cap&CO?'}
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