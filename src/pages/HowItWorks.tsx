import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle, Gift, Smartphone, TrendingUp, Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import stepSelectImg from '@/assets/how-it-works/step-select.png';
import stepPersonalizeImg from '@/assets/how-it-works/step-personalize.png';
import stepActivateImg from '@/assets/how-it-works/step-activate.png';
import stepEarnImg from '@/assets/how-it-works/step-earn.jpg';
import stepCashoutImg from '@/assets/how-it-works/step-cashout.jpg';

const HowItWorks = () => {
  const { t } = useLanguage();
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: "01",
      title: t('howItWorks.steps.0.title'),
      description: t('howItWorks.steps.0.description'),
      icon: <CheckCircle className="w-8 h-8 text-metallic-gold" />,
      image: stepSelectImg,
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
      image: stepPersonalizeImg,
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
      image: stepActivateImg,
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
      image: stepEarnImg,
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
      image: stepCashoutImg,
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
              <div className="bg-gradient-subtle rounded-2xl p-8 border border-border/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
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

              <div className="bg-gradient-subtle rounded-2xl p-8 border border-border/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
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

              <div className="bg-gradient-subtle rounded-2xl p-8 border border-border/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
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
        <section className="py-20 bg-warm-white overflow-hidden">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl lg:text-5xl text-deep-navy mb-6">
                {t('howItWorks.client.title') || "For Your Clients: The Investment Journey"}
              </h2>
              <p className="font-sans text-xl text-deep-navy/80 max-w-3xl mx-auto">
                {t('howItWorks.client.subtitle') || "How your end clients will experience and benefit from their investment coupons"}
              </p>
            </div>

            <div className="space-y-24">
              {steps.map((step, index) => (
                <div 
                  key={step.number} 
                  ref={(el) => (stepRefs.current[index] = el)}
                  data-index={index}
                  className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  } ${
                    visibleSteps.has(index) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-16'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''} transition-all duration-700 delay-200 ${
                    visibleSteps.has(index) 
                      ? 'opacity-100 translate-x-0' 
                      : index % 2 === 1 ? 'opacity-0 translate-x-12' : 'opacity-0 -translate-x-12'
                  }`}>
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
                        <li 
                          key={i} 
                          className={`flex items-center gap-3 font-sans text-deep-navy transition-all duration-500 ${
                            visibleSteps.has(index) 
                              ? 'opacity-100 translate-x-0' 
                              : 'opacity-0 -translate-x-4'
                          }`}
                          style={{ transitionDelay: `${400 + i * 100}ms` }}
                        >
                          <CheckCircle className="w-5 h-5 text-metallic-gold flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`bg-gradient-subtle rounded-2xl p-4 shadow-lg transition-all duration-700 delay-300 ${
                    index % 2 === 1 ? 'lg:col-start-1' : ''
                  } ${
                    visibleSteps.has(index) 
                      ? 'opacity-100 translate-x-0 scale-100' 
                      : index % 2 === 1 ? 'opacity-0 -translate-x-12 scale-95' : 'opacity-0 translate-x-12 scale-95'
                  }`}>
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-auto rounded-xl shadow-lg"
                    />
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
