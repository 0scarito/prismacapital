import { Linkedin, Shield, FileText, Cookie, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import RiskWarningSlider from './RiskWarningSlider';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerLinks = {
    legal: [
      { label: t('footer.legalNotices'), href: '/legal-notices' },
      { label: t('footer.riskDisclosure'), href: '/risk-disclosure' },
      { label: t('footer.privacy'), href: '/privacy-policy' },
      { label: t('footer.cookies'), href: '/cookie-settings' }
    ],
    support: [
      { label: t('footer.helpCenter'), href: '/help-center' },
      { label: t('footer.contactSupport'), href: '/contact-support' },
      { label: t('footer.dici'), href: '/dici-documentation' },
      { label: t('footer.esg'), href: '/esg-reports' }
    ]
  };

  return (
    <footer className="bg-midnight-navy text-white py-16">
      <div className="section-container">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-prisma flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-heading text-2xl text-white">
                Prisma Capital Cards
              </span>
            </div>

            {/* Mission Statement */}
            <p className="font-body text-white/80 mb-6 leading-relaxed max-w-md">
              Démocratiser l'accès aux marchés privés grâce à des cartes-cadeaux NFC physiques 
              vendues offline. L'investissement de demain, accessible aujourd'hui.
            </p>

            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { icon: Shield, label: 'AMF Agréé' },
                { icon: FileText, label: 'PSD2 Conforme' },
                { icon: Eye, label: 'RGPD Sécurisé' }
              ].map((badge) => (
                <div key={badge.label} className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                  <badge.icon className="w-4 h-4 text-spectrum-teal" />
                  <span className="font-body text-xs text-white/90">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://linkedin.com/company/prisma-capital"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-spectrum-teal transition-colors duration-300 flex items-center justify-center group"
              >
                <Linkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
              <span className="font-body text-sm text-white/60">
                Suivez-nous sur LinkedIn
              </span>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-heading text-lg text-white mb-6">
              {t('footer.legal')}
            </h3>
            <div className="space-y-3">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block font-body text-sm text-white/70 hover:text-spectrum-teal transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-heading text-lg text-white mb-6">
              {t('footer.support')}
            </h3>
            <div className="space-y-3">
              {footerLinks.support.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block font-body text-sm text-white/70 hover:text-spectrum-teal transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="font-body text-sm text-white/70">
                Support : 01 23 45 67 89
              </div>
              <div className="font-body text-sm text-white/70">
                Lun-Ven : 9h-18h
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="bg-orange-900/30 rounded-xl p-6 border border-orange-500/30">
            <h4 className="font-heading text-lg text-orange-200 mb-3 flex items-center">
              <span className="mr-2">⚠️</span>
              Avertissement Important sur les Risques
            </h4>
            <div className="grid md:grid-cols-2 gap-4 font-body text-sm text-orange-100/90">
              <div>
                <p className="mb-2">
                  <strong>Niveau de risque : 6/7 (Private Equity)</strong>
                </p>
                <p>
                  Les investissements en private equity présentent un risque élevé de perte en capital. 
                  Votre capital n'est pas garanti et peut diminuer significativement.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong>Horizon d'investissement long terme requis</strong>
                </p>
                <p>
                  Investissements illiquides avec horizon recommandé de 5-10 ans minimum. 
                  Les rendements passés ne préjugent pas des performances futures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="font-body text-sm text-white/60">
              © {currentYear} Prisma Capital Cards. Tous droits réservés.
            </div>
            
            <div className="flex items-center space-x-6 font-body text-sm text-white/60">
              <span>AMF GP-{currentYear}-001234</span>
              <span>ACPR 12345678</span>
              <button className="flex items-center space-x-2 hover:text-spectrum-teal transition-colors">
                <Cookie className="w-4 h-4" />
                <span>Gérer les Cookies</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Risk Warning Slider */}
        <RiskWarningSlider />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "Prisma Capital Cards",
              "description": "Démocratiser l'accès aux marchés privés grâce à des cartes-cadeaux NFC physiques",
              "url": "https://prismacapital.com",
              "logo": "https://prismacapital.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+33-1-23-45-67-89",
                "contactType": "customer support",
                "availableLanguage": "French"
              },
              "sameAs": [
                "https://linkedin.com/company/prisma-capital"
              ]
            })
          }}
        />
      </div>
    </footer>
  );
};

export default Footer;