import { Users, DollarSign, BarChart3, Shield, FileText } from 'lucide-react';

const PartnersSection = () => {
  const partnerBenefits = [
    {
      title: "Nouvelle Démographie Senior",
      description: "60% des dépôts français. Accédez à un segment sous-exploité avec fort pouvoir d'achat.",
      stat: "60%",
      icon: Users
    },
    {
      title: "CAC Sub-€20 Offline",
      description: "Coût d'acquisition client ultracompétitif via réseau physique Maison de la Presse.",
      stat: "<€20",
      icon: DollarSign
    },
    {
      title: "Coupon Empilable",
      description: "Entrée feeder unique €500k sans encombrement au capital. Structure cap-table optimisée.",
      stat: "€500k",
      icon: BarChart3
    },
    {
      title: "Dashboard Analytics",
      description: "Suivi temps réel des ventes, données démographiques, et engagement des bénéficiaires.",
      stat: "Real-time",
      icon: Shield
    }
  ];

  return (
    <section id="partners" className="py-20 bg-gradient-subtle">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-5xl text-foreground mb-6">
            Partenaires Asset Managers
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Élargissez votre distribution offline et captez une nouvelle démographie d'investisseurs
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Benefits */}
          <div className="space-y-8">
            {partnerBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-prisma flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-heading text-xl text-foreground mr-3">
                      {benefit.title}
                    </h3>
                    <span className="bg-metallic-gold text-deep-navy text-sm font-numbers px-3 py-1 rounded-full">
                      {benefit.stat}
                    </span>
                  </div>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Infographic */}
          <div className="relative">
            <div className="bg-card rounded-2xl p-8 shadow-prisma-card">
              <h3 className="font-heading text-2xl text-foreground mb-8 text-center">
                Distribution Flow
              </h3>
              
              {/* Flow Diagram */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-navy-light flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <span className="font-body text-sm">Asset Manager</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-navy-light to-metallic-gold mx-4"></div>
                  <span className="font-numbers text-sm text-muted-foreground">Fonds</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-metallic-gold flex items-center justify-center">
                      <span className="text-deep-navy text-sm font-bold">2</span>
                    </div>
                    <span className="font-body text-sm">Prisma Capital</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-metallic-gold to-rich-gold mx-4"></div>
                  <span className="font-numbers text-sm text-muted-foreground">Cartes NFC</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-rich-gold flex items-center justify-center">
                      <span className="text-deep-navy text-sm font-bold">3</span>
                    </div>
                    <span className="font-body text-sm">Points de Vente</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-rich-gold mx-4"></div>
                  <span className="font-numbers text-sm text-muted-foreground">Clients Finaux</span>
                </div>
              </div>

              {/* ESG Commitment */}
              <div className="mt-8 p-4 bg-muted rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading text-lg text-foreground mb-1">
                      Engagement ESG
                    </h4>
                    <p className="font-body text-sm text-muted-foreground">
                      1 arbre planté par carte vendue
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xl">🌱</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-4 -right-4 bg-gradient-prisma rounded-xl p-4 shadow-prisma-glow">
              <div className="text-white text-center">
                <div className="font-numbers text-2xl">15M+</div>
                <div className="font-body text-xs">Prospects</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-metallic-gold rounded-xl p-4 shadow-prisma-glow">
              <div className="text-deep-navy text-center">
                <div className="font-numbers text-2xl">3k+</div>
                <div className="font-body text-xs">Points de Vente</div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logos Placeholder */}
        <div className="bg-card rounded-2xl p-8 shadow-prisma-card mb-8">
          <h3 className="font-heading text-xl text-foreground text-center mb-6">
            Nos Partenaires de Confiance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {['Tikehau', 'Ardian', 'Eurazeo', 'Rothschild'].map((partner) => (
              <div key={partner} className="text-center">
                <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="font-heading text-sm text-muted-foreground">{partner[0]}</span>
                </div>
                <span className="font-body text-sm text-muted-foreground">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="btn-prisma text-lg px-8 py-4 inline-flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Demander un Pitch Deck</span>
          </button>
          <p className="font-body text-sm text-muted-foreground mt-4">
            Ou contactez-nous directement : partners@prismacapital.com
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;