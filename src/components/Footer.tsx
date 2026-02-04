import { Linkedin, Shield, FileText, Cookie, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import RiskWarningSlider from './RiskWarningSlider';
import prismaLogo from '@/assets/prisma-logo.png';

interface FooterProps {
  riskCategory?: string;
}

/**
 * Footer component with compliance badges, legal links, and structured data
 * Includes dynamic risk warnings based on category
 */
const Footer = ({ riskCategory }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  // Footer navigation links organized by section
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

  const badges = [
    { icon: Shield, label: t('footer.badge.amf') },
    { icon: FileText, label: t('footer.badge.psd2') },
    { icon: Eye, label: t('footer.badge.rgpd') }
  ];

  return (
    <footer className="bg-midnight-navy text-white py-16">
      <div className="section-container">
        <div className="mb-8 border-b border-white/20 pb-8">
          <RiskWarningSlider categoryKey={riskCategory} />
        </div>
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={prismaLogo} 
                alt="Prisma Capital Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Mission Statement */}
            <p className="font-body text-white/80 mb-6 leading-relaxed max-w-md">
              {t('footer.tagline')}
            </p>

            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {badges.map((badge) => (
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
                {t('footer.followLinkedIn')}
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
                <Link
                  key={link.label}
                  to={link.href}
                  className="block font-body text-sm text-white/70 hover:text-spectrum-teal transition-colors duration-200"
                >
                  {link.label}
                </Link>
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
                <Link
                  key={link.label}
                  to={link.href}
                  className="block font-body text-sm text-white/70 hover:text-spectrum-teal transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="font-body text-sm text-white/70">
                {t('footer.supportPhone')}
              </div>
              <div className="font-body text-sm text-white/70">
                {t('footer.supportHours')}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="font-body text-sm text-white/60">
              © {currentYear} Prisma Capital Cards. {t('footer.copyright')}
            </div>
            
            <div className="flex items-center space-x-6 font-body text-sm text-white/60">
              <span>AMF GP-{currentYear}-001234</span>
              <span>ACPR 12345678</span>
              <button className="flex items-center space-x-2 hover:text-spectrum-teal transition-colors">
                <Cookie className="w-4 h-4" />
                <span>{t('footer.cookie.manage')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "Prisma Capital Cards",
              "description": "" + t('footer.schema.description') + "",
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