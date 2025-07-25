import { ArrowRight, Leaf, Zap, Brain } from 'lucide-react';

const GiftConfiguratorSection = () => {
  const sectors = [
    { name: "Clean-Tech", icon: Leaf, color: "text-emerald-600" },
    { name: "Food Innovation", icon: Zap, color: "text-amber-600" },
    { name: "AI & Future Tech", icon: Brain, color: "text-purple-600" }
  ];

  return (
    <section className="py-20 bg-gradient-warm">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl lg:text-6xl text-warm-white mb-6">
            Build Your Gift Now
          </h2>
          <p className="font-sans text-xl text-light-gray max-w-3xl mx-auto">
            Three simple steps to create a meaningful gift that grows
          </p>
        </div>

        {/* Configurator Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Step 1: Select Sector */}
          <div className="bg-warm-white/10 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-metallic-gold/20 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl text-metallic-gold">1</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-warm-white mb-4">
                Select Sector
              </h3>
            </div>
            
            <div className="space-y-3">
              {sectors.map((sector) => (
                <button
                  key={sector.name}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-warm-white/5 hover:bg-warm-white/10 transition-colors border border-warm-white/10"
                >
                  <sector.icon className={`w-5 h-5 ${sector.color}`} />
                  <span className="text-warm-white font-medium">{sector.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Add Name */}
          <div className="bg-warm-white/10 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-electric-blue/20 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl text-electric-blue">2</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-warm-white mb-4">
                Personalize
              </h3>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Recipient's name"
                className="w-full p-3 rounded-lg bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder-warm-white/60"
              />
              <textarea
                placeholder="Personal message"
                rows={3}
                className="w-full p-3 rounded-lg bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder-warm-white/60 resize-none"
              />
            </div>
          </div>

          {/* Step 3: Pay */}
          <div className="bg-warm-white/10 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-metallic-gold/20 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl text-metallic-gold">3</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-warm-white mb-4">
                Complete
              </h3>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-warm-white mb-2">€200</div>
              <div className="text-warm-white/70 mb-6">Premium gift package</div>
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                Create Gift
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick CTA */}
        <div className="text-center">
          <button className="btn-primary text-lg">
            Start Building Your Gift
          </button>
        </div>
      </div>
    </section>
  );
};

export default GiftConfiguratorSection;