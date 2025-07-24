import { Shield, Lock, FileCheck, Zap } from 'lucide-react';
import securityImage from '@/assets/nfc-security-diagram.jpg';

const SecuritySection = () => {
  const securityFeatures = [
    {
      title: "Tokenisé",
      description: "Chaque carte utilise un token unique à usage unique, impossible à dupliquer ou réutiliser.",
      icon: Lock
    },
    {
      title: "Rails PSD2",
      description: "Paiements conformes PSD2 avec authentification forte et traçabilité complète.",
      icon: Shield
    },
    {
      title: "Marketing AMF",
      description: "Documentation conforme AMF avec niveau de risque 6/7 clairement affiché.",
      icon: FileCheck
    },
    {
      title: "KYC Partenaire",
      description: "Vérification d'identité via partenaire agréé ACPR pour sécurité maximale.",
      icon: Zap
    }
  ];

  return (
    <section id="security" className="py-20 bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-5xl text-foreground mb-6">
            Sécurité NFC & Conformité
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Une technologie de pointe pour une sécurité bancaire et une conformité réglementaire totale
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Security Features */}
          <div>
            <div className="grid sm:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-card rounded-xl p-6 shadow-prisma-card hover:shadow-prisma-glow transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 rounded-lg bg-gradient-prisma flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    
                    <h3 className="font-heading text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance Badges */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'AMF', desc: 'Agréé' },
                { label: 'PSD2', desc: 'Conforme' },
                { label: 'RGPD', desc: 'Sécurisé' },
                { label: 'ACPR', desc: 'Partenaire' }
              ].map((badge) => (
                <div key={badge.label} className="text-center p-4 bg-muted rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-prisma mx-auto mb-2 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="font-numbers text-sm text-foreground">{badge.label}</div>
                  <div className="font-body text-xs text-muted-foreground">{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - NFC Diagram */}
          <div className="relative">
            <div className="bg-card rounded-2xl p-8 shadow-prisma-card">
              <h3 className="font-heading text-xl text-foreground mb-6 text-center">
                Anatomie d'une Puce NFC Sécurisée
              </h3>
              
              <div className="relative w-full h-80 rounded-xl overflow-hidden mb-6">
                <img
                  src={securityImage}
                  alt="Diagramme de sécurité NFC"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with tech specs */}
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/80 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="font-numbers text-sm mb-2">Spécifications Techniques</div>
                    <div className="space-y-1 text-xs">
                      <div>• Fréquence: 13.56 MHz</div>
                      <div>• Portée: 4cm max</div>
                      <div>• Chiffrement: AES-256</div>
                      <div>• Durée de vie: 10 ans</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Process Flow */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-prism-blue rounded-full animate-pulse"></div>
                    <span className="font-body text-muted-foreground">Tap Détecté</span>
                  </div>
                  <span className="font-numbers text-prism-blue">~100ms</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-spectrum-teal rounded-full animate-pulse animation-delay-300"></div>
                    <span className="font-body text-muted-foreground">Token Validé</span>
                  </div>
                  <span className="font-numbers text-spectrum-teal">~500ms</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-accent-amber rounded-full animate-pulse animation-delay-500"></div>
                    <span className="font-body text-muted-foreground">KYC Initié</span>
                  </div>
                  <span className="font-numbers text-accent-amber">~3min</span>
                </div>
              </div>
            </div>

            {/* Floating Security Badge */}
            <div className="absolute -top-4 -right-4 bg-green-500 rounded-full p-3 shadow-lg animate-pulse">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Risk Disclosure */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-8 border border-orange-200 dark:border-orange-800">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-heading text-xl text-orange-800 dark:text-orange-200 mb-4">
                Avertissement sur les Risques
              </h3>
              <p className="font-body text-orange-700 dark:text-orange-300 mb-4">
                <strong>Niveau de risque : 6/7 (Private Equity)</strong>
              </p>
              <div className="space-y-2 font-body text-sm text-orange-600 dark:text-orange-400">
                <p>• Votre capital n'est pas garanti et peut diminuer</p>
                <p>• Les investissements en private equity sont illiquides</p>
                <p>• Horizon d'investissement recommandé : 5-10 ans minimum</p>
                <p>• Rendements passés ne préjugent pas des performances futures</p>
              </div>
              <div className="mt-4 text-xs text-orange-500 dark:text-orange-500">
                Lisez attentivement le DICI avant tout investissement. Document disponible sur demande.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;