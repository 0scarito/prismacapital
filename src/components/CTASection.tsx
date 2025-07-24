import { ShoppingBag, Handshake, ArrowRight, MapPin, Phone } from 'lucide-react';

const CTASection = () => {
  const handleBuyCard = () => {
    // This would normally redirect to e-commerce or store locator
    window.open('https://store-locator.example.com', '_blank');
  };

  const handlePartnership = () => {
    // This would normally open Typeform or contact form
    window.open('https://typeform.com/partnership-form', '_blank');
  };

  return (
    <section id="cta" className="py-20 bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-5xl text-foreground mb-6">
            Prêt à Commencer ?
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Choisissez votre parcours : achetez une carte cadeau ou devenez partenaire distributeur
          </p>
        </div>

        {/* Dual CTA Layout */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Buy a Card CTA */}
          <div className="group">
            <div className="bg-card rounded-2xl p-8 shadow-prisma-card hover:shadow-prisma-glow transition-all duration-300 hover:-translate-y-2 h-full">
              <div className="text-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-prisma flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="w-10 h-10 text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="font-heading text-2xl text-foreground mb-4">
                  Acheter une Carte Prisma
                </h3>

                {/* Description */}
                <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                  Offrez l'accès au private equity à vos proches. 
                  Disponible dans plus de 3 000 Maisons de la Presse en France.
                </p>

                {/* Card Options */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {['€50', '€100', '€250', '€500'].map((amount) => (
                    <div key={amount} className="bg-muted rounded-lg p-3 text-center">
                      <span className="font-numbers text-lg text-foreground">{amount}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-body text-sm text-muted-foreground">Carte physique premium incluse</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-spectrum-teal rounded-full"></div>
                    <span className="font-body text-sm text-muted-foreground">Jusqu'à 25% de déduction fiscale</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent-amber rounded-full"></div>
                    <span className="font-body text-sm text-muted-foreground">Suivi en ligne en temps réel</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleBuyCard}
                  className="btn-prisma w-full text-lg py-4 group/btn"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    <span>Trouver un Point de Vente</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </button>

                <p className="font-body text-xs text-muted-foreground mt-4">
                  Ou commandez en ligne (disponible Q2 2024)
                </p>
              </div>
            </div>
          </div>

          {/* Partnership CTA */}
          <div className="group">
            <div className="bg-gradient-to-br from-card to-muted rounded-2xl p-8 shadow-prisma-card hover:shadow-prisma-glow transition-all duration-300 hover:-translate-y-2 h-full border border-primary/10">
              <div className="text-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-spectrum-teal to-accent-amber flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Handshake className="w-10 h-10 text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="font-heading text-2xl text-foreground mb-4">
                  Devenir Partenaire
                </h3>

                {/* Description */}
                <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                  Intégrez Prisma à votre stratégie de distribution. 
                  Captez de nouveaux segments d'investisseurs via nos canaux offline.
                </p>

                {/* Partner Types */}
                <div className="space-y-3 mb-8">
                  <div className="bg-primary/5 rounded-lg p-3">
                    <span className="font-numbers text-sm text-primary">Asset Managers</span>
                  </div>
                  <div className="bg-spectrum-teal/10 rounded-lg p-3">
                    <span className="font-numbers text-sm text-spectrum-teal">Family Offices</span>
                  </div>
                  <div className="bg-accent-amber/10 rounded-lg p-3">
                    <span className="font-numbers text-sm text-accent-amber">Distributeurs</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-spectrum-teal rounded-full"></div>
                    <span className="font-body text-sm text-muted-foreground">CAC ultra-compétitif &lt;€20</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-body text-sm text-muted-foreground">Accès démographie 55-80 ans</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent-amber rounded-full"></div>
                    <span className="font-body text-sm text-muted-foreground">Dashboard analytics temps réel</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handlePartnership}
                  className="btn-prisma w-full text-lg py-4 group/btn bg-gradient-to-r from-spectrum-teal to-accent-amber hover:from-primary hover:to-spectrum-teal"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Demander un Pitch Deck</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </button>

                <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>01 23 45 67 89</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <span>partners@prismacapital.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-16 bg-muted rounded-2xl p-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-numbers text-2xl text-primary mb-2">3k+</div>
              <div className="font-body text-sm text-muted-foreground">Points de Vente</div>
            </div>
            <div>
              <div className="font-numbers text-2xl text-spectrum-teal mb-2">15M+</div>
              <div className="font-body text-sm text-muted-foreground">Prospects Potentiels</div>
            </div>
            <div>
              <div className="font-numbers text-2xl text-accent-amber mb-2">€500k</div>
              <div className="font-body text-sm text-muted-foreground">Poche Minimum</div>
            </div>
            <div>
              <div className="font-numbers text-2xl text-primary mb-2">12-15%</div>
              <div className="font-body text-sm text-muted-foreground">IRR Historique</div>
            </div>
          </div>
        </div>

        {/* Legal Reminder */}
        <div className="mt-8 text-center">
          <p className="font-body text-xs text-muted-foreground">
            Investissement risqué (6/7). Capital non garanti. Consultez le DICI avant investissement.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;