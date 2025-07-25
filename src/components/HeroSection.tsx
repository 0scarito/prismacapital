import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentCard, setCurrentCard] = useState(0);
  
  const giftScenarios = [
    "Send €200 of French clean-tech equity to Clara",
    "Support Brittany's agritech start-ups for Jules' 18th birthday", 
    "Back the French economy, one gift at a time"
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % giftScenarios.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden bg-gradient-hero">
      {/* Blur mask for depth */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-dark-navy/20 to-transparent blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="font-serif font-bold text-6xl lg:text-8xl text-warm-white mb-6 leading-[0.9] tracking-tight" style={{ textWrap: 'balance' }}>
                Gift a stake in tomorrow.
              </h1>
              
              <p className="font-sans text-xl text-light-gray mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Turn €200 into real equity in French start‑ups—beautifully boxed, ready to inspire.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16">
                <button
                  onClick={() => scrollToSection('#how-it-works')}
                  className="btn-primary text-lg"
                >
                  Choose a Gift
                </button>
                <button
                  onClick={() => scrollToSection('#how-it-works')}
                  className="btn-ghost text-lg"
                >
                  How it Works
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-light-gray/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-metallic-gold rounded-full"></div>
                  <span className="font-sans text-sm">AMF Regulated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                  <span className="font-sans text-sm">PSD2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-metallic-gold rounded-full"></div>
                  <span className="font-sans text-sm">GDPR Secure</span>
                </div>
              </div>
            </div>

            {/* Right Column - Task Cards Animation */}
            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-prisma-card border border-border/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                  <span className="font-sans text-sm text-muted-foreground">Cap&CO Gift Builder</span>
                </div>
                
                <div className="min-h-[3rem] flex items-center">
                  <p className="font-sans text-lg text-card-foreground typewriter">
                    {giftScenarios[currentCard]}
                  </p>
                </div>
                
                {/* Progress indicator */}
                <div className="flex gap-2 mt-6">
                  {giftScenarios.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === currentCard ? 'bg-primary w-8' : 'bg-border w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-metallic-gold/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-electric-blue/20 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-light-gray/60 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-light-gray/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-light-gray/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;