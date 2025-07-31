import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, Award, CheckCircle, Building, Users, Globe } from 'lucide-react';

const Partners = () => {
  const partnerCategories = [
    {
      title: "Partenaires Réglementaires",
      icon: <Shield className="w-8 h-8 text-metallic-gold" />,
      partners: [
        {
          name: "Autorité des Marchés Financiers (AMF)",
          role: "Régulateur principal",
          description: "Prisma Capital opère sous la supervision de l'AMF avec l'agrément FR-2024-15.",
          logo: "🏛️",
          status: "Agréé"
        },
        {
          name: "ACPR - Banque de France",
          role: "Contrôle prudentiel",
          description: "Supervision des activités de financement participatif.",
          logo: "🏦",
          status: "Supervisé"
        }
      ]
    },
    {
      title: "Partenaires Technologiques",
      icon: <Building className="w-8 h-8 text-metallic-gold" />,
      partners: [
        {
          name: "Stripe",
          role: "Processeur de paiements",
          description: "Sécurisation des transactions financières avec certification PCI DSS.",
          logo: "💳",
          status: "Certifié"
        },
        {
          name: "AWS",
          role: "Infrastructure cloud",
          description: "Hébergement sécurisé avec conformité GDPR et ISO 27001.",
          logo: "☁️",
          status: "Conforme"
        }
      ]
    },
    {
      title: "Partenaires Investissement",
      icon: <Users className="w-8 h-8 text-metallic-gold" />,
      partners: [
        {
          name: "BPI France",
          role: "Co-investissement",
          description: "Partenariat pour le soutien aux start-ups innovantes françaises.",
          logo: "🇫🇷",
          status: "Partenaire"
        },
        {
          name: "French Tech",
          role: "Écosystème",
          description: "Membre actif de l'écosystème French Tech pour l'innovation.",
          logo: "🚀",
          status: "Membre"
        }
      ]
    }
  ];

  const certifications = [
    { name: "PSD2 Compliant", icon: "🔒" },
    { name: "GDPR Certifié", icon: "🛡️" },
    { name: "ISO 27001", icon: "🏆" },
    { name: "AMF Agréé", icon: "✅" }
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
                Nos Partenaires
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                Prisma Capital s'appuie sur un écosystème de partenaires de confiance pour vous offrir
                la meilleure expérience d'investissement, en toute sécurité.
              </p>
            </div>
          </div>
        </section>

        {/* Certifications Banner */}
        <section className="py-12 bg-warm-white border-b border-border/20">
          <div className="section-container">
            <div className="flex flex-wrap justify-center gap-8">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 bg-gradient-subtle rounded-lg px-6 py-3">
                  <span className="text-2xl">{cert.icon}</span>
                  <span className="font-sans font-medium text-deep-navy">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Sections */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="space-y-20">
              {partnerCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {category.icon}
                      <h2 className="font-serif font-bold text-3xl text-deep-navy">
                        {category.title}
                      </h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {category.partners.map((partner, partnerIndex) => (
                      <div key={partnerIndex} className="bg-gradient-subtle rounded-2xl p-8 border border-border/20 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="text-4xl">{partner.logo}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-serif font-bold text-xl text-deep-navy">
                                {partner.name}
                              </h3>
                              <span className="bg-metallic-gold/20 text-metallic-gold px-2 py-1 rounded-full text-xs font-medium">
                                {partner.status}
                              </span>
                            </div>
                            <p className="font-sans text-sm text-metallic-gold font-medium mb-3">
                              {partner.role}
                            </p>
                          </div>
                        </div>
                        <p className="font-sans text-deep-navy/80 leading-relaxed">
                          {partner.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-deep-navy">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif font-bold text-4xl text-warm-white mb-8">
                  Une confiance méritée
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-metallic-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-warm-white mb-2">
                        Supervision réglementaire complète
                      </h3>
                      <p className="font-sans text-light-gray text-sm">
                        Toutes nos activités sont supervisées par l'AMF et l'ACPR.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-metallic-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-warm-white mb-2">
                        Sécurité des données garantie
                      </h3>
                      <p className="font-sans text-light-gray text-sm">
                        Conformité GDPR et chiffrement de bout en bout.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-metallic-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-sans font-medium text-warm-white mb-2">
                        Partenaires de premier plan
                      </h3>
                      <p className="font-sans text-light-gray text-sm">
                        Collaboration avec les leaders de chaque secteur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-subtle rounded-2xl p-8 text-center">
                <Award className="w-16 h-16 text-metallic-gold mx-auto mb-6" />
                <h3 className="font-serif font-bold text-2xl text-deep-navy mb-4">
                  Certifié par l'AMF
                </h3>
                <p className="font-sans text-deep-navy/80 mb-6">
                  Agrément de Conseiller en Investissements Participatifs
                </p>
                <div className="text-xs text-deep-navy/60 font-mono">
                  N° d'agrément : FR-2024-15
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-gradient-warm">
          <div className="section-container">
            <div className="text-center">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                Devenir partenaire
              </h2>
              <p className="font-sans text-xl text-light-gray mb-8 max-w-2xl mx-auto">
                Rejoignez notre écosystème de partenaires et contribuez à l'innovation française.
              </p>
              <button className="btn-primary inline-flex items-center gap-2">
                <Building className="w-5 h-5" />
                Contactez-nous
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Partners;