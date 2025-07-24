import { ShoppingCart, Smartphone, TrendingUp } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Achetez",
      description: "Choisissez une carte Prisma de €50, €100, €250 ou €500 dans n'importe quelle Maison de la Presse.",
      icon: ShoppingCart,
      color: "prism-blue"
    },
    {
      number: "02", 
      title: "Tapez & KYC",
      description: "Le bénéficiaire tape la puce NFC et complète un contrôle de risque de 3 minutes.",
      icon: Smartphone,
      color: "spectrum-teal"
    },
    {
      number: "03",
      title: "Possédez",
      description: "Une fois la poche de €500k fermée, les parts d'un ELTIF/FCPR éligible sont émises. Suivez la valeur en ligne.",
      icon: TrendingUp,
      color: "accent-amber"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-5xl text-foreground mb-6">
            Comment ça fonctionne
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Un processus simple en trois étapes pour démocratiser l'accès aux marchés privés
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0"></div>
              )}
              
              {/* Step Card */}
              <div className="relative bg-card rounded-2xl p-8 shadow-prisma-card hover:shadow-prisma-glow transition-all duration-300 z-10">
                {/* Step Number */}
                <div className={`w-16 h-16 rounded-full bg-${step.color} bg-opacity-10 border-2 border-${step.color} flex items-center justify-center mb-6 mx-auto`}>
                  <span className={`font-numbers text-2xl font-bold text-${step.color}`}>
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`w-12 h-12 rounded-lg bg-${step.color} bg-opacity-10 flex items-center justify-center`}>
                    <step.icon className={`w-6 h-6 text-${step.color}`} strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="font-heading text-2xl text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-${step.color} bg-opacity-20 rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <div className="mt-16 bg-card rounded-2xl p-8 shadow-prisma-card">
          <div className="text-center mb-8">
            <h3 className="font-heading text-2xl text-foreground mb-4">
              Flux de capital transparent
            </h3>
            <p className="font-body text-muted-foreground">
              Votre investissement suit un parcours sécurisé et régulé
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-prism-blue rounded-full animate-pulse"></div>
              <span className="font-body text-sm text-muted-foreground">Achat Carte</span>
            </div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-prism-blue to-spectrum-teal hidden md:block"></div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-spectrum-teal rounded-full animate-pulse animation-delay-300"></div>
              <span className="font-body text-sm text-muted-foreground">Poche €500k</span>
            </div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-spectrum-teal to-accent-amber hidden md:block"></div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-accent-amber rounded-full animate-pulse animation-delay-500"></div>
              <span className="font-body text-sm text-muted-foreground">Parts ELTIF/FCPR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;