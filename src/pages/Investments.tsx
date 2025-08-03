import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { TrendingUp, Leaf, Building, Home, DollarSign, Bitcoin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
const Investments = () => {
  const { t } = useLanguage();
  const investmentCategories = [
    {
      title: t('investments.categories.list.privateEquity.title'),
      icon: <Building aria-hidden="true" className="w-12 h-12 text-metallic-gold" />,
      description: t('investments.categories.list.privateEquity.description'),
      href: '/investments/private-equity'
    },
    {
      title: t('investments.categories.list.ventureCapital.title'),
      icon: <TrendingUp aria-hidden="true" className="w-12 h-12 text-metallic-gold" />,
      description: t('investments.categories.list.ventureCapital.description'),
      href: '/investments/venture-capital'
    },
    {
      title: t('investments.categories.list.realEstate.title'),
      icon: <Home aria-hidden="true" className="w-12 h-12 text-metallic-gold" />,
      description: t('investments.categories.list.realEstate.description'),
      href: '/investments/real-estate'
    },
    {
      title: t('investments.categories.list.commodities.title'),
      icon: <Leaf aria-hidden="true" className="w-12 h-12 text-metallic-gold" />,
      description: t('investments.categories.list.commodities.description'),
      href: '/investments/commodities'
    },
    {
      title: t('investments.categories.list.etfs.title'),
      icon: <DollarSign aria-hidden="true" className="w-12 h-12 text-metallic-gold" />,
      description: t('investments.categories.list.etfs.description'),
      href: '/investments/etfs'
    },
    {
      title: t('investments.categories.list.crypto.title'),
      icon: <Bitcoin aria-hidden="true" className="w-12 h-12 text-metallic-gold" />,
      description: t('investments.categories.list.crypto.description'),
      href: '/investments/crypto'
    }
  ];
  const investmentBenefits = [
    t('investments.benefits.0'),
    t('investments.benefits.1'),
    t('investments.benefits.2'),
    t('investments.benefits.3'),
    t('investments.benefits.4')
  ];
  return <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="section-container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-serif font-bold text-5xl lg:text-7xl text-warm-white mb-8 leading-tight">
                {t('investments.hero.title')}
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                {t('investments.hero.description')}
              </p>

              {/* Partners & Securities Button */}
              <Link to="/partners" className="btn-ghost mb-8 inline-block">
                {t('investments.hero.partners')}
              </Link>
              
              <div className="flex justify-center">
                <div className="bg-warm-white/10 backdrop-blur-sm rounded-xl p-6 border border-warm-white/20">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-metallic-gold">150+</div>
                      <div className="text-sm text-light-gray">
                        {t('investments.hero.stats.opportunities')}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-metallic-gold">€12M</div>
                      <div className="text-sm text-light-gray">
                        {t('investments.hero.stats.invested')}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-metallic-gold">4.8★</div>
                      <div className="text-sm text-light-gray">
                        {t('investments.hero.stats.rating')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Warning */}
        

        {/* Investment Categories */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl text-deep-navy mb-6">
                {t('investments.categories.heading')}
              </h2>
              <p className="font-sans text-lg text-deep-navy/80 max-w-3xl mx-auto">
                {t('investments.categories.subheading')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {investmentCategories.map((category) => (
                <CategoryCard
                  key={category.href}
                  title={category.title}
                  description={category.description}
                  href={category.href}
                  icon={category.icon}
                  exploreLabel={`${t('investments.explore')} ${category.title}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-deep-navy">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif font-bold text-4xl text-warm-white mb-8">
                  {t('investments.benefits.title')}
                </h2>
                <div className="space-y-4">
                  {investmentBenefits.map((benefit, index) => <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-metallic-gold rounded-full mt-2 flex-shrink-0"></div>
                      <p className="font-sans text-light-gray">{benefit}</p>
                    </div>)}
                </div>
              </div>
              <div className="bg-gradient-subtle rounded-2xl p-8">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-metallic-gold mx-auto mb-6" />
                  <h3 className="font-serif font-bold text-2xl text-deep-navy mb-4">
                    {t('investments.benefits.averageReturn')}
                  </h3>
                  <div className="text-4xl font-bold text-metallic-gold mb-2">14.2%</div>
                  <p className="text-sm text-deep-navy/70">
                    {t('investments.benefits.period')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        
      </main>

      <Footer />
    </div>;
};
export default Investments;