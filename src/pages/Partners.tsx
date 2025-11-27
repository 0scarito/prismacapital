import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, Award, CheckCircle, Building, Users, TrendingUp, Package, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Partners = () => {
  const { t } = useLanguage();
  
  const partnerBenefits = [
    {
      title: t('partners.benefits.distribution.title') || 'Expand Distribution',
      description: t('partners.benefits.distribution.desc') || 'Offer curated investment products through your existing network without operational burden.',
      icon: Users,
      stat: '€15M+ AUM potential'
    },
    {
      title: t('partners.benefits.revenue.title') || 'Revenue Share',
      description: t('partners.benefits.revenue.desc') || 'Earn commissions on every coupon distributed and redeemed by your clients.',
      icon: TrendingUp,
      stat: 'Up to 25% commission'
    },
    {
      title: t('partners.benefits.whitelabel.title') || 'White-Label Ready',
      description: t('partners.benefits.whitelabel.desc') || 'Customize coupons with your branding, integrate via API, or use our partner portal.',
      icon: Package,
      stat: 'Full customization'
    },
    {
      title: t('partners.benefits.analytics.title') || 'Real-Time Analytics',
      description: t('partners.benefits.analytics.desc') || 'Track distribution, redemption rates, and portfolio performance in your dashboard.',
      icon: BarChart3,
      stat: 'Live tracking'
    }
  ];

  const partnerTypes = [
    {
      type: t('partners.types.banks.title') || 'Banks & Wealth Managers',
      description: t('partners.types.banks.desc') || 'Expand your product shelf with alternative investments for HNW clients.',
      icon: Building,
      benefits: ['White-label platform', 'API integration', 'Compliance support']
    },
    {
      type: t('partners.types.insurance.title') || 'Insurance Companies',
      description: t('partners.types.insurance.desc') || 'Diversify unit-linked products with curated investment coupons.',
      icon: Shield,
      benefits: ['Unit-linked integration', 'ESG compliant products', 'Regulatory oversight']
    },
    {
      type: t('partners.types.wealth.title') || 'Family Offices',
      description: t('partners.types.wealth.desc') || 'Access institutional-grade products for your portfolio.',
      icon: Users,
      benefits: ['Bespoke mandates', 'Bulk pricing', 'Dedicated support']
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: t('partners.process.step1.title') || 'Create Your Mandate',
      description: t('partners.process.step1.desc') || 'Define your needs - volume, product mix, pricing. We craft a personalized distribution agreement.'
    },
    {
      step: '2',
      title: t('partners.process.step2.title') || 'Receive Inventory',
      description: t('partners.process.step2.desc') || 'Get your coupon inventory delivered to your Partner Portal. Each coupon is ready for distribution.'
    },
    {
      step: '3',
      title: t('partners.process.step3.title') || 'Distribute to Clients',
      description: t('partners.process.step3.desc') || 'Give coupons to your end clients through your existing channels - branches, advisors, digital platforms.'
    },
    {
      step: '4',
      title: t('partners.process.step4.title') || 'Track Performance',
      description: t('partners.process.step4.desc') || 'Monitor redemption rates, portfolio values, and client engagement in real-time.'
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
                {t('partners.hero.title') || 'Become a Distribution Partner'}
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed max-w-3xl mx-auto">
                {t('partners.hero.subtitle') || 'Enable your clients to access institutional-grade investments through bulk coupon distribution. Expand your product offering without operational complexity.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => window.location.href = '/request-mandate'} className="bg-metallic-gold hover:bg-metallic-gold/90 text-deep-navy font-semibold">
                  {t('partners.cta.requestMandate') || 'Request a Mandate'}
                </Button>
                <Button size="lg" variant="outline" onClick={() => window.location.href = '#how-it-works'} className="border-warm-white text-warm-white hover:bg-warm-white/10">
                  {t('partners.cta.learnMore') || 'How It Works'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Benefits */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <h2 className="font-serif font-bold text-4xl text-deep-navy text-center mb-12">
              {t('partners.benefits.title') || 'Why Partner With Us'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnerBenefits.map((benefit, index) => (
                <div key={index} className="bg-gradient-subtle rounded-xl p-6 border border-border/20 hover:shadow-lg transition-all">
                  <benefit.icon className="w-10 h-10 text-metallic-gold mb-4" />
                  <h3 className="font-serif font-bold text-xl text-deep-navy mb-3">{benefit.title}</h3>
                  <p className="font-sans text-deep-navy/80 text-sm mb-3">{benefit.description}</p>
                  <div className="text-metallic-gold font-semibold text-sm">{benefit.stat}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-gradient-subtle">
          <div className="section-container text-center">
            <h2 className="font-serif font-bold text-3xl text-deep-navy mb-8">
              {t('partners.trust.title') || 'Trusted by Leading Institutions'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-metallic-gold mb-2">€50M+</div>
                <div className="text-deep-navy/70">{t('partners.stats.aum') || 'Assets Under Distribution'}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-metallic-gold mb-2">25+</div>
                <div className="text-deep-navy/70">{t('partners.stats.partners') || 'Active Partners'}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-metallic-gold mb-2">15K+</div>
                <div className="text-deep-navy/70">{t('partners.stats.coupons') || 'Coupons Distributed'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-hero">
          <div className="section-container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-serif font-bold text-4xl lg:text-5xl text-warm-white mb-6">
                {t('partners.cta.title') || 'Ready to Get Started?'}
              </h2>
              <p className="font-sans text-xl text-light-gray mb-8">
                {t('partners.cta.subtitle') || 'Request a personalized mandate and start distributing investment coupons to your clients.'}
              </p>
              <Button size="lg" onClick={() => window.location.href = '/request-mandate'} className="bg-metallic-gold hover:bg-metallic-gold/90 text-deep-navy font-semibold">
                {t('partners.cta.requestMandate') || 'Request a Mandate'}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Partners;