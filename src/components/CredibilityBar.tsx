import { Shield, CheckCircle } from 'lucide-react';

/**
 * Credibility Bar - Displays trust indicators and partner logos
 * Sticky bar with AMF badge, partner marquee, and GDPR compliance
 */
const CredibilityBar = () => {
  const partners = [
    "BNP Paribas",
    "Crédit Agricole", 
    "Société Générale",
    "BPCE",
    "AMF France",
    "French Tech"
  ];

  return (
    <section className="py-6 bg-warm-white border-b border-light-gray/20 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* AMF Badge */}
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-electric-blue" />
            <div className="text-sm">
              <span className="font-medium text-deep-navy">AMF Regulated</span>
              <span className="text-muted-foreground ml-2">FR-2024-XX</span>
            </div>
          </div>

          {/* Partner Marquee */}
          <div className="flex-1 mx-8 overflow-hidden">
            <div className="flex animate-marquee space-x-8">
              {[...partners, ...partners].map((partner, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 text-sm font-medium text-deep-navy/60 hover:text-deep-navy transition-colors"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicator */}
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-metallic-gold" />
            <span className="text-sm font-medium text-deep-navy">GDPR Secure</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredibilityBar;