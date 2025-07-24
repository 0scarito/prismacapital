import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "Que se passe-t-il si la poche ne se remplit pas ?",
      answer: "Si la poche de €500k n'est pas atteinte dans les 12 mois, votre argent est automatiquement remboursé avec les intérêts légaux. Aucun risque de perte du capital initial dans ce cas."
    },
    {
      question: "Puis-je acheter plusieurs cartes ?",
      answer: "Oui, vous pouvez acheter autant de cartes que vous le souhaitez. Chaque carte est indépendante et contribue à différentes poches d'investissement. L'avantage fiscal s'applique selon les plafonds légaux FCPI/FCPR."
    },
    {
      question: "Mon capital est-il garanti ?",
      answer: "Non, le private equity est un investissement à risque (niveau 6/7). Votre capital peut diminuer. Cependant, historiquement, le private equity a montré des performances supérieures aux placements traditionnels sur le long terme."
    },
    {
      question: "Comment réclamer ma déduction fiscale ?",
      answer: "Vous recevrez automatiquement un certificat fiscal par email après l'émission des parts. Ce document est à joindre à votre déclaration d'impôts. La déduction s'applique l'année de l'investissement."
    },
    {
      question: "Combien de temps dure l'investissement ?",
      answer: "Les fonds de private equity ont généralement une durée de 5 à 10 ans. Vous pourrez suivre l'évolution de votre investissement via notre plateforme en ligne et recevrez des rapports réguliers."
    },
    {
      question: "La carte NFC peut-elle être piratée ?",
      answer: "Non, chaque carte utilise un token unique à usage unique avec chiffrement bancaire. Une fois utilisée, la carte devient inactive. De plus, nos partenaires KYC vérifient l'identité avant tout investissement."
    },
    {
      question: "Puis-je revendre mes parts avant l'échéance ?",
      answer: "Les investissements en private equity sont illiquides par nature. Cependant, certains fonds proposent des fenêtres de liquidité exceptionnelles. Les conditions exactes dépendent du fonds sélectionné."
    },
    {
      question: "Quel est l'investissement minimum et maximum ?",
      answer: "Les cartes sont disponibles en coupures de €50, €100, €250 et €500. Il n'y a pas de maximum légal, mais les avantages fiscaux sont plafonnés selon la réglementation FCPI/FCPR en vigueur."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-subtle">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-5xl text-foreground mb-6">
            Questions Fréquentes
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Toutes les réponses à vos questions sur les Cartes Prisma Capital
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openItems.includes(index);
              
              return (
                <div key={index} className="bg-card rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg text-foreground pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t border-border">
                        <p className="font-body text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-2xl p-8 shadow-prisma-card max-w-2xl mx-auto">
            <h3 className="font-heading text-2xl text-foreground mb-4">
              Besoin d'aide supplémentaire ?
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              Notre équipe est là pour répondre à toutes vos questions personnalisées.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@prismacapital.com"
                className="btn-prisma-outline"
              >
                Contacter le Support
              </a>
              <a
                href="tel:+33123456789"
                className="btn-prisma"
              >
                Appeler : 01 23 45 67 89
              </a>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Disponible du lundi au vendredi, 9h-18h</p>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-muted rounded-xl p-6 text-center">
            <p className="font-body text-sm text-muted-foreground">
              <strong className="text-foreground">Important :</strong> Ces informations sont fournies à titre indicatif. 
              Consultez toujours les documents légaux officiels (DICI, prospectus) avant tout investissement. 
              Les rendements passés ne préjugent pas des performances futures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;