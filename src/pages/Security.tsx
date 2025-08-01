import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileCheck, Server, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
const Security = () => {
  const { t } = useLanguage();
  const securityFeatures = [
    {
      icon: <Shield className="w-8 h-8 text-metallic-gold" />,
      title: t('security.feature.encryption.title'),
      description: t('security.feature.encryption.desc')
    },
    {
      icon: <Lock className="w-8 h-8 text-metallic-gold" />,
      title: t('security.feature.mfa.title'),
      description: t('security.feature.mfa.desc')
    },
    {
      icon: <Server className="w-8 h-8 text-metallic-gold" />,
      title: t('security.feature.infrastructure.title'),
      description: t('security.feature.infrastructure.desc')
    },
    {
      icon: <Eye className="w-8 h-8 text-metallic-gold" />,
      title: t('security.feature.audits.title'),
      description: t('security.feature.audits.desc')
    }
  ];
  const complianceItems = [
    { name: 'GDPR', description: t('security.compliance.desc.gdpr'), status: t('security.compliance.status.certified') },
    { name: 'PSD2', description: t('security.compliance.desc.psd2'), status: t('security.compliance.status.compliant') },
    { name: 'AMF', description: t('security.compliance.desc.amf'), status: t('security.compliance.status.licensed') },
    { name: 'KYC/AML', description: t('security.compliance.desc.kyc'), status: t('security.compliance.status.validated') }
  ];
  const securityProcess = [
    {
      step: '01',
      title: t('security.process.step1.title'),
      description: t('security.process.step1.desc')
    },
    {
      step: '02',
      title: t('security.process.step2.title'),
      description: t('security.process.step2.desc')
    },
    {
      step: '03',
      title: t('security.process.step3.title'),
      description: t('security.process.step3.desc')
    },
    {
      step: '04',
      title: t('security.process.step4.title'),
      description: t('security.process.step4.desc')
    }
  ];
  return <div className="min-h-screen bg-background font-sans">
      <Navigation />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="section-container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-serif font-bold text-5xl lg:text-7xl text-warm-white mb-8 leading-tight">
                {t('security.hero.title')}
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                {t('security.hero.subtitle')}
              </p>
              <div className="flex justify-center">
                <div className="bg-warm-white/10 backdrop-blur-sm rounded-xl p-6 border border-warm-white/20">
                  <div className="flex items-center gap-4 text-metallic-gold">
                    <Shield className="w-8 h-8" />
                    <span className="font-sans font-medium">{t('security.hero.badge')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl text-deep-navy mb-6">
                {t('security.features.title')}
              </h2>
              <p className="font-sans text-lg text-deep-navy/80 max-w-3xl mx-auto">
                {t('security.features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => <div key={index} className="bg-gradient-subtle rounded-2xl p-8 border border-border/20">
                  <div className="flex items-center gap-4 mb-6">
                    {feature.icon}
                    <h3 className="font-serif font-bold text-xl text-deep-navy">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="font-sans text-deep-navy/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>)}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 bg-deep-navy">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                {t('security.compliance.title')}
              </h2>
              <p className="font-sans text-lg text-light-gray max-w-3xl mx-auto">
                {t('security.compliance.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {complianceItems.map((item, index) => <div key={index} className="bg-warm-white/5 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif font-bold text-xl text-warm-white">
                      {item.name}
                    </h3>
                    <span className="bg-metallic-gold/20 text-metallic-gold px-3 py-1 rounded-full text-sm font-medium">
                      {item.status}
                    </span>
                  </div>
                  <p className="font-sans text-light-gray leading-relaxed">
                    {item.description}
                  </p>
                </div>)}
            </div>
          </div>
        </section>

        {/* Security Process */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl text-deep-navy mb-6">
                {t('security.process.title')}
              </h2>
              <p className="font-sans text-lg text-deep-navy/80 max-w-3xl mx-auto">
                {t('security.process.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {securityProcess.map((process, index) => <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-metallic-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-metallic-gold">{process.step}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-deep-navy mb-4">
                    {process.title}
                  </h3>
                  <p className="font-sans text-sm text-deep-navy/70 leading-relaxed">
                    {process.description}
                  </p>
                </div>)}
            </div>
          </div>
        </section>

        {/* Risk Notice */}


        {/* Contact Security Team */}
        <section className="py-20 bg-gradient-warm">
          <div className="section-container">
            <div className="text-center">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                {t('security.contact.title')}
              </h2>
              <p className="font-sans text-xl text-light-gray mb-8 max-w-2xl mx-auto">
                {t('security.contact.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary inline-flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('security.contact.button')}
                </button>
                <Link to="/faq" className="btn-ghost inline-flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Security;