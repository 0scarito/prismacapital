import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { ChevronDown, MessageCircle, Phone, Mail } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: "Généralités",
      questions: [
        {
          q: "Qu'est-ce que Cap&CO exactement ?",
          a: "Cap&CO est une plateforme qui démocratise l'accès au capital-risque en proposant des cadeaux d'investissement. Nous permettons d'offrir des parts dans des start-ups françaises vérifiées sous forme de cartes-cadeaux physiques de €200."
        },
        {
          q: "Comment fonctionne le système de cartes-cadeaux ?",
          a: "Vous achetez une carte-cadeau physique de €200 que vous offrez. Le bénéficiaire scanne le QR code, complète son profil d'investisseur, et choisit le secteur dans lequel investir parmi nos portefeuilles diversifiés."
        },
        {
          q: "Est-ce légal et régulé ?",
          a: "Oui, toutes nos activités sont supervisées par l'AMF (Autorité des Marchés Financiers) sous l'agrément FR-2024-15. Nos partenaires d'exécution sont des Conseillers en Investissements Participatifs agréés."
        }
      ]
    },
    {
      title: "Investissements",
      questions: [
        {
          q: "Dans quoi j'investis exactement ?",
          a: "Vous investissez dans des portefeuilles diversifiés de 5-8 start-ups françaises par secteur (Clean-Tech, IA, Food-Tech, etc.). Chaque entreprise est vérifiée par notre équipe de due diligence et nos partenaires AMF."
        },
        {
          q: "Quels sont les risques ?",
          a: "Les investissements en start-ups présentent un risque de perte totale du capital. Les entreprises peuvent échouer, et les investissements sont illiquides (impossible de revendre facilement). Ne jamais investir plus que ce qu'on peut se permettre de perdre."
        },
        {
          q: "Quand puis-je récupérer mon argent ?",
          a: "Les investissements en capital-risque sont généralement illiquides pendant 3-7 ans. Une sortie devient possible lors d'une acquisition ou d'une introduction en bourse de l'entreprise. Aucun rendement n'est garanti."
        },
        {
          q: "Puis-je suivre mes investissements ?",
          a: "Oui, notre application mobile vous permet de suivre l'évolution de votre portefeuille, recevoir des mises à jour des entreprises, et accéder à du contenu éducatif sur l'investissement."
        }
      ]
    },
    {
      title: "Aspects Pratiques",
      questions: [
        {
          q: "Un mineur peut-il recevoir une carte-cadeau ?",
          a: "Oui, mais l'activation nécessite l'accord d'un parent ou tuteur légal qui devra compléter le processus KYC (Know Your Customer) et co-signer l'investissement."
        },
        {
          q: "Y a-t-il des frais cachés ?",
          a: "Non. Le prix de €200 inclut tout : l'investissement, les frais de gestion, la carte physique et l'expédition. Aucun frais supplémentaire n'est appliqué pendant la durée de l'investissement."
        },
        {
          q: "Puis-je annuler ou me faire rembourser ?",
          a: "Vous disposez de 14 jours pour annuler votre achat avant activation de la carte. Une fois l'investissement activé et exécuté, aucun remboursement n'est possible car les fonds sont investis dans les entreprises."
        },
        {
          q: "Comment sont sélectionnées les start-ups ?",
          a: "Notre équipe d'analystes évalue chaque entreprise selon des critères stricts : équipe fondatrice, traction commerciale, potentiel de marché, et impact sur l'économie française. Seules 5% des candidatures sont retenues."
        }
      ]
    },
    {
      title: "Fiscal & Juridique",
      questions: [
        {
          q: "Quelles sont les implications fiscales ?",
          a: "Les plus-values réalisées lors de la cession des parts sont soumises à l'impôt sur les plus-values mobilières. Cependant, des dispositifs comme le PEA-PME peuvent s'appliquer. Consultez un conseiller fiscal."
        },
        {
          q: "Qui est propriétaire des parts ?",
          a: "Le bénéficiaire de la carte-cadeau devient propriétaire des parts dès leur acquisition. Pour les mineurs, un compte de garde est ouvert avec le parent/tuteur comme mandataire jusqu'à la majorité."
        },
        {
          q: "Que se passe-t-il si Cap&CO ferme ?",
          a: "Vos investissements sont détenus par notre partenaire dépositaire agréé, indépendamment de Cap&CO. En cas de fermeture, un autre gestionnaire agréé prendrait le relais pour assurer la continuité."
        }
      ]
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
                Questions Fréquentes
              </h1>
              <p className="font-sans text-xl text-light-gray mb-12 leading-relaxed">
                Trouvez rapidement les réponses à vos questions sur Cap&CO, 
                nos investissements et notre processus.
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-12 bg-warm-white border-b border-border/20">
          <div className="section-container">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher dans la FAQ..."
                  className="w-full px-6 py-4 rounded-xl border border-border/20 bg-gradient-subtle focus:outline-none focus:ring-2 focus:ring-metallic-gold/50"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-deep-navy/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20 bg-warm-white">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                  <h2 className="font-serif font-bold text-3xl text-deep-navy mb-8 text-center">
                    {category.title}
                  </h2>
                  
                  <div className="space-y-4">
                    {category.questions.map((item, itemIndex) => {
                      const globalIndex = categoryIndex * 100 + itemIndex;
                      const isOpen = openItems.includes(globalIndex);
                      
                      return (
                        <div 
                          key={itemIndex}
                          className="bg-gradient-subtle rounded-xl border border-border/20 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-deep-navy/5 transition-colors"
                          >
                            <h3 className="font-sans font-medium text-lg text-deep-navy pr-4">
                              {item.q}
                            </h3>
                            <ChevronDown 
                              className={`w-5 h-5 text-metallic-gold transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          
                          {isOpen && (
                            <div className="px-8 pb-6">
                              <div className="border-t border-border/20 pt-6">
                                <p className="font-sans text-deep-navy/80 leading-relaxed">
                                  {item.a}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-deep-navy">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="font-serif font-bold text-4xl text-warm-white mb-6">
                Besoin d'aide supplémentaire ?
              </h2>
              <p className="font-sans text-lg text-light-gray max-w-2xl mx-auto">
                Notre équipe est là pour vous accompagner dans votre parcours d'investissement.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-warm-white/5 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/10 text-center">
                <MessageCircle className="w-12 h-12 text-metallic-gold mx-auto mb-6" />
                <h3 className="font-serif font-bold text-xl text-warm-white mb-4">
                  Chat en Direct
                </h3>
                <p className="font-sans text-light-gray text-sm mb-6">
                  Disponible du lundi au vendredi, 9h-18h
                </p>
                <button className="btn-primary w-full">
                  Démarrer le Chat
                </button>
              </div>

              <div className="bg-warm-white/5 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/10 text-center">
                <Mail className="w-12 h-12 text-metallic-gold mx-auto mb-6" />
                <h3 className="font-serif font-bold text-xl text-warm-white mb-4">
                  Email
                </h3>
                <p className="font-sans text-light-gray text-sm mb-6">
                  Réponse sous 24h ouvrées
                </p>
                <button className="btn-primary w-full">
                  Envoyer un Email
                </button>
              </div>

              <div className="bg-warm-white/5 backdrop-blur-sm rounded-2xl p-8 border border-warm-white/10 text-center">
                <Phone className="w-12 h-12 text-metallic-gold mx-auto mb-6" />
                <h3 className="font-serif font-bold text-xl text-warm-white mb-4">
                  Téléphone
                </h3>
                <p className="font-sans text-light-gray text-sm mb-6">
                  Pour les questions urgentes
                </p>
                <button className="btn-primary w-full">
                  Nous Appeler
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

export default FAQ;