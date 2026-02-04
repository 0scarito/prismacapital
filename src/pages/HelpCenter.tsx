import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Gift, 
  Wallet, 
  User, 
  Shield, 
  HelpCircle,
  BookOpen,
  MessageCircle
} from 'lucide-react';

const HelpCenter = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const categories = [
    {
      icon: BookOpen,
      title: "Premiers Pas",
      description: "Comment démarrer avec Prisma Capital"
    },
    {
      icon: CreditCard,
      title: "Achats & Paiements",
      description: "Tout sur les achats de coupons"
    },
    {
      icon: Gift,
      title: "Cadeaux",
      description: "Offrir un investissement"
    },
    {
      icon: Wallet,
      title: "Encaissement",
      description: "Retirer vos gains"
    },
    {
      icon: User,
      title: "Mon Compte",
      description: "Gestion du profil"
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Protection des données"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('footer.helpCenter')}
            </h1>
            <p className="text-muted-foreground mb-8">
              Trouvez des réponses à vos questions et apprenez à utiliser notre plateforme.
            </p>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {categories.map((category, index) => (
                <Card key={index} className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <category.icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-sm">{category.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Sections */}
            <div className="space-y-8">
              {/* Getting Started */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Premiers Pas
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Qu'est-ce que Prisma Capital Cards ?</AccordionTrigger>
                    <AccordionContent>
                      Prisma Capital Cards est une plateforme innovante qui vous permet d'investir dans 
                      différentes classes d'actifs (immobilier, crypto, ETF, private equity, etc.) sous forme 
                      de coupons. Vous pouvez acheter ces coupons pour vous-même ou les offrir à vos proches.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Comment créer un compte ?</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-4 space-y-2">
                        <li>Cliquez sur "Connexion" en haut à droite</li>
                        <li>Sélectionnez l'onglet "Inscription"</li>
                        <li>Choisissez votre profil (Particulier ou CGP)</li>
                        <li>Renseignez vos informations et créez votre mot de passe</li>
                        <li>Confirmez votre email si nécessaire</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Quels types d'investissements proposez-vous ?</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4 space-y-2">
                        <li><strong>Immobilier :</strong> Crowdfunding immobilier en France et Europe</li>
                        <li><strong>Crypto-actifs :</strong> Bitcoin, Ethereum et autres cryptomonnaies</li>
                        <li><strong>ETFs :</strong> Fonds diversifiés et thématiques</li>
                        <li><strong>Private Equity :</strong> Investissement dans des entreprises non cotées</li>
                        <li><strong>Venture Capital :</strong> Startups innovantes</li>
                        <li><strong>Matières Premières :</strong> Or, agriculture, énergie</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* Purchases */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Achats & Paiements
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Comment acheter un coupon ?</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-4 space-y-2">
                        <li>Parcourez nos investissements et sélectionnez celui qui vous intéresse</li>
                        <li>Cliquez sur "Ajouter au panier"</li>
                        <li>Rendez-vous dans votre panier</li>
                        <li>Définissez le montant à investir pour chaque produit</li>
                        <li>Procédez au paiement sécurisé par carte bancaire</li>
                        <li>Votre coupon est disponible immédiatement dans votre espace</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Quels moyens de paiement acceptez-vous ?</AccordionTrigger>
                    <AccordionContent>
                      Nous acceptons les paiements par carte bancaire (Visa, Mastercard) via notre 
                      partenaire de paiement sécurisé Stripe. Les virements SEPA seront bientôt disponibles.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Qu'est-ce que la carte physique NFC ?</AccordionTrigger>
                    <AccordionContent>
                      Pour 15€ supplémentaires, vous pouvez recevoir une carte physique NFC personnalisée. 
                      Cette carte permet au destinataire de scanner et d'accéder directement à son 
                      investissement. Idéale pour les cadeaux !
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Les paiements sont-ils sécurisés ?</AccordionTrigger>
                    <AccordionContent>
                      Oui, tous les paiements sont traités par Stripe, leader mondial du paiement en ligne. 
                      Nous ne stockons jamais vos données de carte bancaire. Les transactions sont 
                      protégées par chiffrement SSL et conformes aux normes PCI-DSS.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* Gifts */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
                  <Gift className="w-6 h-6 text-primary" />
                  Offrir un Investissement
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Comment offrir un coupon à quelqu'un ?</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-4 space-y-2">
                        <li>Ajoutez les investissements souhaités à votre panier</li>
                        <li>Lors du paiement, renseignez l'email du destinataire</li>
                        <li>Ajoutez un message personnalisé (optionnel)</li>
                        <li>Finalisez votre achat</li>
                        <li>Le destinataire recevra une notification pour activer son cadeau</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Le destinataire doit-il avoir un compte ?</AccordionTrigger>
                    <AccordionContent>
                      <strong>Oui</strong>, le destinataire doit avoir un compte Prisma Capital existant 
                      pour recevoir un cadeau. Cela garantit la sécurité et la traçabilité des transferts. 
                      Si le destinataire n'a pas encore de compte, invitez-le d'abord à s'inscrire sur 
                      notre plateforme avant d'effectuer le transfert.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* Cash Out */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-primary" />
                  Encaissement
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Comment retirer mes gains ?</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-4 space-y-2">
                        <li>Accédez à votre Portefeuille dans "Mon Espace"</li>
                        <li>Sélectionnez l'investissement à encaisser</li>
                        <li>Cliquez sur "Encaisser"</li>
                        <li>Confirmez le montant et vos coordonnées bancaires</li>
                        <li>Le virement sera effectué sous 3 à 5 jours ouvrés</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Y a-t-il des frais de retrait ?</AccordionTrigger>
                    <AccordionContent>
                      Les retraits par virement SEPA en zone euro sont gratuits. Des frais peuvent 
                      s'appliquer pour les virements internationaux ou les retraits express.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Quel est le montant minimum de retrait ?</AccordionTrigger>
                    <AccordionContent>
                      Le montant minimum de retrait est de 1€. Il n'y a pas de maximum, sous réserve 
                      des vérifications réglementaires pour les montants importants.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* Account */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  Mon Compte
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Comment modifier mes informations personnelles ?</AccordionTrigger>
                    <AccordionContent>
                      Rendez-vous dans "Mon Espace" puis "Profil". Vous pouvez y modifier votre nom 
                      d'affichage, votre email et vos préférences de notification.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Comment changer mon mot de passe ?</AccordionTrigger>
                    <AccordionContent>
                      Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un 
                      email avec un lien pour réinitialiser votre mot de passe.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Comment supprimer mon compte ?</AccordionTrigger>
                    <AccordionContent>
                      Pour supprimer votre compte, contactez notre support. Veuillez noter que vous 
                      devez d'abord retirer tous vos fonds. La suppression est définitive et 
                      certaines données peuvent être conservées pour des raisons légales.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              {/* Security */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  Sécurité
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Mes données sont-elles protégées ?</AccordionTrigger>
                    <AccordionContent>
                      Oui, nous utilisons un chiffrement de niveau bancaire (TLS 1.3) pour toutes 
                      les communications. Vos données sont hébergées dans l'Union Européenne 
                      conformément au RGPD.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Comment signaler une activité suspecte ?</AccordionTrigger>
                    <AccordionContent>
                      Si vous constatez une activité suspecte sur votre compte, changez immédiatement 
                      votre mot de passe et contactez notre support à security@prismacapital.fr. 
                      Nous enquêterons dans les plus brefs délais.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
            </div>

            {/* Contact CTA */}
            <Card className="mt-12 bg-primary/5 border-primary/20">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
                <div className="flex items-center gap-4">
                  <HelpCircle className="w-12 h-12 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Vous n'avez pas trouvé votre réponse ?</h3>
                    <p className="text-muted-foreground">Notre équipe support est là pour vous aider.</p>
                  </div>
                </div>
                <Button onClick={() => navigate('/contact-support')} size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter le Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
