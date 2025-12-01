import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle, Gift, Smartphone, TrendingUp, Wallet } from 'lucide-react';
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
    },
    {
      number: "04",
      title: t('howItWorks.steps.3.title'),
      description: t('howItWorks.steps.3.description'),
      icon: <TrendingUp className="w-8 h-8 text-metallic-gold" />,
      features: [
        t('howItWorks.steps.3.features.0'),
        t('howItWorks.steps.3.features.1'),
        t('howItWorks.steps.3.features.2')
      ]
    },
    {
      number: "05",
      title: t('howItWorks.steps.4.title'),
      description: t('howItWorks.steps.4.description'),
      icon: <Wallet className="w-8 h-8 text-metallic-gold" />,
      features: [
        t('howItWorks.steps.4.features.0'),
        t('howItWorks.steps.4.features.1'),
        t('howItWorks.steps.4.features.2')
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

        {/* B2B Partner Process Section */}
        <section className="py-20 bg-card">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl lg:text-5xl text-card-foreground mb-6">
                {t('howItWorks.partner.title') || "For Partners: Your Distribution Journey"}
              </h2>
              <p className="font-sans text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('howItWorks.partner.subtitle') || "A streamlined process to bring institutional-grade investments to your clients"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-subtle rounded-2xl p-8 border border-border/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6 mx-auto">
                  <span className="font-sans font-bold text-2xl text-primary">1</span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-card-foreground mb-4 text-center">
                  {t('howItWorks.partner.steps.0.title') || "Create Your Mandate"}
                </h3>
                <p className="font-sans text-muted-foreground text-center">
                  {t('howItWorks.partner.steps.0.description') || "Define volume, product mix, and pricing. We craft a personalized distribution agreement."}
                </p>
              </div>

              <div className="bg-gradient-subtle rounded-2xl p-8 border border-border/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6 mx-auto">
                  <span className="font-sans font-bold text-2xl text-primary">2</span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-card-foreground mb-4 text-center">
                  {t('howItWorks.partner.steps.1.title') || "Receive Inventory"}
                </h3>
                <p className="font-sans text-muted-foreground text-center">
                  {t('howItWorks.partner.steps.1.description') || "Get your coupon inventory in your Partner Portal, ready for distribution."}
                </p>
              </div>

              <div className="bg-gradient-subtle rounded-2xl p-8 border border-border/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6 mx-auto">
                  <span className="font-sans font-bold text-2xl text-primary">3</span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-card-foreground mb-4 text-center">
                  {t('howItWorks.partner.steps.2.title') || "Distribute & Track"}
                </h3>
                <p className="font-sans text-muted-foreground text-center">
                  {t('howItWorks.partner.steps.2.description') || "Give coupons to your clients and monitor redemption rates in real-time."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Steps Section */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl lg:text-5xl text-deep-navy mb-6">
                {t('howItWorks.client.title') || "For Your Clients: The Investment Journey"}
              </h2>
              <p className="font-sans text-xl text-deep-navy/80 max-w-3xl mx-auto">
                {t('howItWorks.client.subtitle') || "How your end clients will experience and benefit from their investment coupons"}
              </p>
            </div>

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