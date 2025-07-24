import { Gift, Calculator, TrendingUp, Star } from 'lucide-react';
import testimonialImage from '@/assets/grandparents-testimonial.jpg';

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Tangible & VIP",
      description: "Carte physique premium avec carte postale du fondateur incluse. Un cadeau que l'on peut tenir en main.",
      icon: Gift,
      highlight: "Premium"
    },
    {
      title: "Avantage Fiscal",
      description: "Jusqu'à 25% de déduction d'impôt sur le revenu (FCPI/FCPR). Un cadeau qui rapporte aussi au donneur.",
      icon: Calculator,
      highlight: "25% Déduction"
    },
    {
      title: "Meilleures Chances que le Loto",
      description: "Historiquement, le private equity surperforme largement les jeux de hasard avec des IRR attractifs.",
      icon: TrendingUp,
      highlight: "Performance"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-5xl text-foreground mb-6">
            Avantages pour les Donneurs
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Offrez plus qu'un simple cadeau : une porte d'entrée vers l'investissement de demain
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <div className="bg-card rounded-2xl p-8 shadow-prisma-card hover:shadow-prisma-glow transition-all duration-300 h-full hover:-translate-y-2">
                {/* Icon & Highlight */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-prisma flex items-center justify-center mb-4">
                    <benefit.icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <span className="inline-block bg-metallic-gold text-deep-navy text-xs font-numbers px-3 py-1 rounded-full">
                    {benefit.highlight}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-heading text-2xl text-foreground mb-4 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>

                {/* Hover Effect */}
                <div className="mt-6 w-0 h-1 bg-gradient-prisma rounded group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Comparison Chart */}
        <div className="bg-card rounded-2xl p-8 shadow-prisma-card mb-16">
          <h3 className="font-heading text-2xl text-foreground mb-8 text-center">
            Comparaison des Rendements Historiques
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted rounded-xl">
              <div className="font-numbers text-3xl text-foreground mb-2">0.00001%</div>
              <div className="font-body text-sm text-muted-foreground mb-2">Probabilité Loto</div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="w-0 h-full bg-red-500"></div>
              </div>
            </div>
            
            <div className="text-center p-6 bg-muted rounded-xl">
              <div className="font-numbers text-3xl text-foreground mb-2">3-5%</div>
              <div className="font-body text-sm text-muted-foreground mb-2">Livret A</div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="w-1/4 h-full bg-yellow-500"></div>
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-navy-light/10 to-metallic-gold/10 rounded-xl border border-primary/20">
              <div className="font-numbers text-3xl text-primary mb-2">12-15%</div>
              <div className="font-body text-sm text-primary mb-2">Private Equity (IRR historique)</div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-prisma"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-gradient-to-r from-card to-muted rounded-2xl p-8 lg:p-12 shadow-prisma-card">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-metallic-gold fill-current" />
                ))}
              </div>
              
              <blockquote className="font-body text-lg text-foreground mb-6 italic">
                "J'ai offert une carte Prisma de €100 à ma petite-fille pour ses 18 ans. 
                Elle était ravie de découvrir l'investissement et moi, j'ai pu bénéficier 
                d'une déduction fiscale. Un cadeau gagnant-gagnant !"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-prisma flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <div className="font-numbers text-foreground">Mamie Suzanne</div>
                  <div className="font-body text-sm text-muted-foreground">72 ans, Retraitée</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-64 lg:h-80 rounded-xl overflow-hidden shadow-prisma-card">
                <img
                  src={testimonialImage}
                  alt="Témoignage clients satisfaits"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-prisma rounded-full flex items-center justify-center shadow-prisma-glow">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;