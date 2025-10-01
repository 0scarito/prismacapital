import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Why Choose Section - Highlights benefits for different user personas
 * Features statistics and testimonials for grandparents, parents, and recipients
 */
const WhyChooseSection = () => {
  const { t } = useLanguage();

  const personas = [
    {
      key: 'grandparents',
      headline: t('whyChoose.personas.grandparents.headline'),
      description: t('whyChoose.personas.grandparents.description'),
      stat: '62%',
      statLabel: t('whyChoose.personas.grandparents.statLabel')
    },
    {
      key: 'parents',
      headline: t('whyChoose.personas.parents.headline'),
      description: t('whyChoose.personas.parents.description'),
      stat: '85%',
      statLabel: t('whyChoose.personas.parents.statLabel')
    },
    {
      key: 'recipients',
      headline: t('whyChoose.personas.recipients.headline'),
      description: t('whyChoose.personas.recipients.description'),
      stat: '23%',
      statLabel: t('whyChoose.personas.recipients.statLabel')
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl lg:text-6xl text-foreground mb-6">
            {t('whyChoose.title')}
          </h2>
        </div>

        <div className="space-y-12">
          {personas.map(persona => (
            <div
              key={persona.key}
              className="bg-card rounded-2xl p-8 lg:p-12 shadow-card border border-border/20"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-serif font-bold text-3xl lg:text-4xl text-card-foreground mb-6">
                    {persona.headline}
                  </h3>
                  <p className="font-sans text-xl text-muted-foreground leading-relaxed">
                    {persona.description}
                  </p>
                </div>

                <div className="text-center lg:text-right">
                  <div className="inline-block p-8 bg-gradient-subtle rounded-2xl">
                    <div className="text-6xl lg:text-8xl font-bold text-primary mb-2">
                      {persona.stat}
                    </div>
                    <div className="text-lg text-muted-foreground font-medium">
                      {persona.statLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;