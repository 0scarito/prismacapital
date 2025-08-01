import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, Award, CheckCircle, Building, Users, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Partners = () => {
  const { t } = useLanguage();
  const partnerCategories = [
    {
      title: t('partners.category.regulatory'),
      icon: <Shield className="w-8 h-8 text-metallic-gold" />,
      partners: [
        {
          name: "Autorité des Marchés Financiers (AMF)",
          role: t('partners.role.regulator'),
          description: t('partners.description.amf'),
          logo: "🏛️",
          status: t('partners.status.licensed')
        },
        {
          name: "ACPR - Banque de France",
          role: t('partners.role.prudential'),
          description: t('partners.description.acpr'),
          logo: "🏦",
          status: t('partners.status.supervised')
        }
      ]
    },
    {
      title: t('partners.category.technology'),
      icon: <Building className="w-8 h-8 text-metallic-gold" />,
      partners: [
        {
          name: "Stripe",
          role: t('partners.role.processor'),
          description: t('partners.description.stripe'),
          logo: "💳",
          status: t('partners.status.certified')
        },
        {
          name: "AWS",
          role: t('partners.role.infrastructure'),
          description: t('partners.description.aws'),
          logo: "☁️",
          status: t('partners.status.compliant')
        }
      ]
    },
    {
      title: t('partners.category.investment'),
      icon: <Users className="w-8 h-8 text-metallic-gold" />,
      partners: [
        {
          name: "BPI France",
          role: t('partners.role.coinvest'),
          description: t('partners.description.bpi'),
          logo: "🇫🇷",
          status: t('partners.status.partner')
        },
        {
          name: "French Tech",
          role: t('partners.role.ecosystem'),
          description: t('partners.description.frenchtech'),
          logo: "🚀",
          status: t('partners.status.member')
        }
      ]
    }
  ];

  const certifications = [
    { name: t('partners.cert.psd2'), icon: '🔒' },
    { name: t('partners.cert.gdpr'), icon: '🛡️' },
    { name: t('partners.cert.iso'), icon: '🏆' },
    { name: t('partners.cert.amf'), icon: '✅' }
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
                {t('partners.hero.title')}
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                {t('partners.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Certifications Banner */}
        <section className="py-12 bg-warm-white border-b border-border/20">
          <div className="section-container">
            <div className="flex flex-wrap justify-center gap-8">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 bg-gradient-subtle rounded-lg px-6 py-3">
                  <span className="text-2xl">{cert.icon}</span>
                  <span className="font-sans font-medium text-deep-navy">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Sections */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="space-y-20">
              {partnerCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {category.icon}
                      <h2 className="font-serif font-bold text-3xl text-deep-navy">
                        {category.title}
                      </h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {category.partners.map((partner, partnerIndex) => (
                      <div key={partnerIndex} className="bg-gradient-subtle rounded-2xl p-8 border border-border/20 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="text-4xl">{partner.logo}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-serif font-bold text-xl text-deep-navy">
                                {partner.name}
                              </h3>
                              <span className="bg-metallic-gold/20 text-metallic-gold px-2 py-1 rounded-full text-xs font-medium">
                                {partner.status}
                              </span>
                            </div>
                            <p className="font-sans text-sm text-metallic-gold font-medium mb-3">
                              {partner.role}
                            </p>
                          </div>
                        </div>
                        <p className="font-sans text-deep-navy/80 leading-relaxed">
                          {partner.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-deep-navy">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif font-bold text-4xl text-warm-white mb-8">
                  {t('partners.trust.title')}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-metallic-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-warm-white mb-2">
                        {t('partners.trust.supervision.title')}
                      </h3>
                      <p className="font-sans text-light-gray text-sm">
                        {t('partners.trust.supervision.desc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-metallic-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-warm-white mb-2">
                        {t('partners.trust.security.title')}
                      </h3>
                      <p className="font-sans text-light-gray text-sm">
                        {t('partners.trust.security.desc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-metallic-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-warm-white mb-2">
                        {t('partners.trust.leaders.title')}
                      </h3>
                      <p className="font-sans text-light-gray text-sm">
                        {t('partners.trust.leaders.desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-subtle rounded-2xl p-8 text-center">
                <Award className="w-16 h-16 text-metallic-gold mx-auto mb-6" />
                <h3 className="font-serif font-bold text-2xl text-deep-navy mb-4">
                  {t('partners.award.title')}
                </h3>
                <p className="font-sans text-deep-navy/80 mb-6">
                  {t('partners.award.desc')}
                </p>
                <div className="text-xs text-deep-navy/60 font-mono">
                  {t('partners.award.number')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-gradient-warm">
          <div className="section-container">
            <div className="text-center">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                {t('partners.cta.title')}
              </h2>
              <p className="font-sans text-xl text-light-gray mb-8 max-w-2xl mx-auto">
                {t('partners.cta.subtitle')}
              </p>
              <button className="btn-primary inline-flex items-center gap-2">
                <Building className="w-5 h-5" />
                {t('partners.cta.button')}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Partners;