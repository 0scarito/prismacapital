import heroImage from '@/assets/hero-nfc-cards.jpg';

const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Content */}
      <div className="relative z-10 section-container flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6 leading-tight">
              Transformez €50 en 
              <span className="text-gradient block mt-2">
                part de champions de demain
              </span>
            </h1>
            
            <p className="font-body text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Les Cartes Prisma Capital permettent d'offrir un accès au private equity 
              d'un simple geste NFC.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection('#benefits')}
                className="btn-prisma text-lg px-8 py-4"
              >
                Découvrir nos Cartes
              </button>
              <button
                onClick={() => scrollToSection('#partners')}
                className="btn-prisma-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-midnight-navy"
              >
                Je suis Asset Manager
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-spectrum-teal rounded-full"></div>
                <span className="font-body text-sm">AMF Agréé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-amber rounded-full"></div>
                <span className="font-body text-sm">PSD2 Conforme</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-spectrum-teal rounded-full"></div>
                <span className="font-body text-sm">RGPD Sécurisé</span>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Visual */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden nfc-glow">
              <img
                src={heroImage}
                alt="Cartes NFC Prisma Capital avec effets lumineux"
                className="w-full h-full object-cover"
              />
              
              {/* Floating Animation Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-prism-blue/20 to-transparent"></div>
              
              {/* NFC Ripple Effect */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 border-2 border-white/30 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white/50 rounded-full animate-ping animation-delay-150"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Floating Cards Visual Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-16 bg-gradient-card rounded-lg shadow-prisma-glow opacity-80 animate-bounce animation-delay-300"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-14 bg-gradient-to-r from-spectrum-teal to-accent-amber rounded-lg shadow-prisma-glow opacity-60 animate-bounce animation-delay-500"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-sm">Découvrez comment</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;