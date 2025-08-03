import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle, Gift, Smartphone, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      title: t('howItWorks.steps.0.title'),
      description: t('howItWorks.steps.0.description'),
      icon: <CheckCircle className="w-8 h-8 text-metallic-gold" />,
      features: [
        t('howItWorks.steps.0.features.0'),
        t('howItWorks.steps.0.features.1'),
        t('howItWorks.steps.0.features.2')
      ]
    },
    {
      number: "02",
      title: t('howItWorks.steps.1.title'),
      description: t('howItWorks.steps.1.description'),
      icon: <Gift className="w-8 h-8 text-metallic-gold" />,
      features: [
        t('howItWorks.steps.1.features.0'),
        t('howItWorks.steps.1.features.1'),
        t('howItWorks.steps.1.features.2')
      ]
    },
    {
      number: "03",
      title: t('howItWorks.steps.2.title'),
      description: t('howItWorks.steps.2.description'),
      icon: <Smartphone className="w-8 h-8 text-metallic-gold" />,
      features: [
        t('howItWorks.steps.2.features.0'),
        t('howItWorks.steps.2.features.1'),
        t('howItWorks.steps.2.features.2')
      ]
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
                {t('howItWorks.page.title')}
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                {t('howItWorks.page.subtitle')}
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
                {t('howItWorks.cta.title')}
              </h2>
              <p className="font-sans text-xl text-light-gray mb-8 max-w-2xl mx-auto">
                {t('howItWorks.cta.subtitle')}
              </p>
              <button
                onClick={() => (window.location.href = '/investments')}
                className="btn-primary inline-flex items-center gap-2"
              >
                {t('howItWorks.cta.button')}
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