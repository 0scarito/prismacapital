import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, FileCheck, Server, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const Security = () => {
  const securityFeatures = [
    {
      icon: <Shield className="w-8 h-8 text-metallic-gold" />,
      title: "Chiffrement de bout en bout",
      description: "Toutes vos données sont chiffrées avec AES-256, le standard militaire utilisé par les banques centrales."
    },
    {
      icon: <Lock className="w-8 h-8 text-metallic-gold" />,
      title: "Authentification multi-facteurs",
      description: "Protection renforcée de votre compte avec vérification par SMS et authentificateur mobile."
    },
    {
      icon: <Server className="w-8 h-8 text-metallic-gold" />,
      title: "Infrastructure sécurisée",
      description: "Hébergement sur AWS avec certification ISO 27001 et surveillance 24h/24."
    },
    {
      icon: <Eye className="w-8 h-8 text-metallic-gold" />,
      title: "Audit de sécurité continu",
      description: "Tests de pénétration trimestriels par des experts en cybersécurité indépendants."
    }
  ];

  const complianceItems = [
    {
      name: "GDPR",
      description: "Conformité totale au Règlement Général sur la Protection des Données",
      status: "Certifié"
    },
    {
      name: "PSD2",
      description: "Directive sur les Services de Paiement pour la sécurité des transactions",
      status: "Conforme"
    },
    {
      name: "AMF",
      description: "Supervision par l'Autorité des Marchés Financiers",
      status: "Agréé"
    },
    {
      name: "KYC/AML",
      description: "Procédures renforcées de connaissance client et anti-blanchiment",
      status: "Validé"
    }
  ];

  const securityProcess = [
    {
      step: "01",
      title: "Vérification d'identité",
      description: "KYC renforcé avec vérification de documents officiels"
    },
    {
      step: "02", 
      title: "Sécurisation des fonds",
      description: "Ségrégation des fonds clients dans des comptes séparés"
    },
    {
      step: "03",
      title: "Monitoring en continu",
      description: "Surveillance 24h/24 des transactions et détection des fraudes"
    },
    {
      step: "04",
      title: "Backup et récupération",
      description: "Sauvegarde automatique et plan de continuité d'activité"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="section-container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-serif font-bold text-5xl lg:text-7xl text-warm-white mb-8 leading-tight">
                Sécurité & Conformité
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                Votre sécurité est notre priorité absolue. Découvrez comment nous protégeons 
                vos données et vos investissements avec les plus hauts standards de l'industrie.
              </p>
              <div className="flex justify-center">
                <div className="bg-warm-white/10 backdrop-blur-sm rounded-xl p-6 border border-warm-white/20">
                  <div className="flex items-center gap-4 text-metallic-gold">
                    <Shield className="w-8 h-8" />
                    <span className="font-sans font-medium">Certifié ISO 27001 • GDPR • AMF Agréé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl text-deep-navy mb-6">
                Protection Multi-Niveaux
              </h2>
              <p className="font-sans text-lg text-deep-navy/80 max-w-3xl mx-auto">
                Chaque aspect de notre plateforme est conçu avec la sécurité comme priorité, 
                de la collecte des données à l'exécution des investissements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-gradient-subtle rounded-2xl p-8 border border-border/20">
                  <div className="flex items-center gap-4 mb-6">
                    {feature.icon}
                    <h3 className="font-serif font-bold text-xl text-deep-navy">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="font-sans text-deep-navy/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 bg-deep-navy">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                Conformité Réglementaire
              </h2>
              <p className="font-sans text-lg text-light-gray max-w-3xl mx-auto">
                Cap&CO respecte toutes les réglementations en vigueur et maintient 
                les plus hauts standards de conformité.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {complianceItems.map((item, index) => (
                <div key={index} className="bg-warm-white/5 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif font-bold text-xl text-warm-white">
                      {item.name}
                    </h3>
                    <span className="bg-metallic-gold/20 text-metallic-gold px-3 py-1 rounded-full text-sm font-medium">
                      {item.status}
                    </span>
                  </div>
                  <p className="font-sans text-light-gray leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Process */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="font-serif font-bold text-4xl text-deep-navy mb-6">
                Notre Processus de Sécurité
              </h2>
              <p className="font-sans text-lg text-deep-navy/80 max-w-3xl mx-auto">
                Découvrez les étapes que nous suivons pour garantir la sécurité 
                de vos investissements à chaque moment.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {securityProcess.map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-metallic-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-metallic-gold">{process.step}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-deep-navy mb-4">
                    {process.title}
                  </h3>
                  <p className="font-sans text-sm text-deep-navy/70 leading-relaxed">
                    {process.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Notice */}
        <section className="py-16 bg-darker-navy">
          <div className="section-container">
            <div className="bg-warm-white/5 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/10">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-metallic-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-warm-white mb-4">
                    Avertissement sur les Risques
                  </h3>
                  <p className="font-sans text-light-gray text-sm leading-relaxed mb-4">
                    Les investissements en capital-risque présentent un risque de perte totale du capital investi. 
                    Les start-ups sont des entreprises en développement avec un taux d'échec élevé. 
                    Les investissements sont illiquides et ne peuvent être revendus facilement.
                  </p>
                  <p className="font-sans text-light-gray text-sm leading-relaxed">
                    Cap&CO recommande de ne jamais investir plus que ce que vous pouvez vous permettre de perdre 
                    et de diversifier vos investissements. Consultez un conseiller financier indépendant si nécessaire.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Security Team */}
        <section className="py-20 bg-gradient-warm">
          <div className="section-container">
            <div className="text-center">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                Une Question de Sécurité ?
              </h2>
              <p className="font-sans text-xl text-light-gray mb-8 max-w-2xl mx-auto">
                Notre équipe de sécurité est disponible 24h/24 pour répondre à vos préoccupations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary inline-flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Contacter la Sécurité
                </button>
                <button className="btn-ghost inline-flex items-center gap-2" onClick={() => window.location.href = '/faq'}>
                  <FileCheck className="w-5 h-5" />
                  FAQ
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Security;