import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('footer.privacy')}
            </h1>
            <p className="text-foreground/70 mb-8">Dernière mise à jour : 29 décembre 2024</p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              {/* Introduction */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Introduction</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    Prisma Capital Cards SAS ("nous", "notre", "Prisma") s'engage à protéger la vie privée 
                    de ses utilisateurs. Cette politique de confidentialité explique comment nous collectons, 
                    utilisons, partageons et protégeons vos données personnelles conformément au Règlement 
                    Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
                  </p>
                </div>
              </section>

              {/* Data Controller */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Responsable du Traitement</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>Le responsable du traitement des données personnelles est :</p>
                  <div className="pl-4 border-l-2 border-primary">
                    <p><strong>Prisma Capital Cards SAS</strong></p>
                    <p>25 Avenue des Champs-Élysées, 75008 Paris, France</p>
                    <p>Email : dpo@prismacapital.fr</p>
                  </div>
                </div>
              </section>

              {/* Data Collected */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Données Collectées</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>Nous collectons les catégories de données suivantes :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                    <li><strong>Données financières :</strong> informations de paiement (traitées via Stripe), historique des transactions</li>
                    <li><strong>Données de profil :</strong> préférences d'investissement, tolérance au risque</li>
                    <li><strong>Données de connexion :</strong> adresse IP, type de navigateur, pages consultées, horodatage</li>
                    <li><strong>Données KYC :</strong> pièce d'identité, justificatif de domicile (si applicable)</li>
                  </ul>
                </div>
              </section>

              {/* Legal Basis */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Base Légale du Traitement</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>Nous traitons vos données sur les bases légales suivantes :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Exécution du contrat :</strong> traitement nécessaire à la fourniture de nos services</li>
                    <li><strong>Obligation légale :</strong> conformité aux réglementations anti-blanchiment et fiscales</li>
                    <li><strong>Intérêt légitime :</strong> amélioration de nos services, prévention de la fraude</li>
                    <li><strong>Consentement :</strong> communications marketing (avec votre accord préalable)</li>
                  </ul>
                </div>
              </section>

              {/* Purpose of Processing */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Finalités du Traitement</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Gestion de votre compte et authentification</li>
                    <li>Traitement des achats et transactions</li>
                    <li>Envoi des coupons et confirmations</li>
                    <li>Conformité réglementaire (KYC/AML)</li>
                    <li>Support client</li>
                    <li>Amélioration de nos services</li>
                    <li>Communications marketing (avec consentement)</li>
                  </ul>
                </div>
              </section>

              {/* Data Retention */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Durée de Conservation</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Données de compte :</strong> durée de la relation commerciale + 3 ans</li>
                    <li><strong>Données de transaction :</strong> 10 ans (obligations comptables)</li>
                    <li><strong>Données KYC :</strong> 5 ans après la fin de la relation (obligations AML)</li>
                    <li><strong>Données de connexion :</strong> 1 an</li>
                    <li><strong>Données marketing :</strong> 3 ans après le dernier contact</li>
                  </ul>
                </div>
              </section>

              {/* Your Rights */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Vos Droits</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                    <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                    <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                    <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                    <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                    <li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données</li>
                  </ul>
                  <p className="mt-4">
                    Pour exercer ces droits, contactez notre DPO à : <strong>dpo@prismacapital.fr</strong>
                  </p>
                </div>
              </section>

              {/* Data Sharing */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Partage des Données</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>Vos données peuvent être partagées avec :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Prestataires de paiement :</strong> Stripe pour le traitement des paiements</li>
                    <li><strong>Hébergeur :</strong> Supabase pour le stockage des données</li>
                    <li><strong>Autorités :</strong> sur requête légale ou réglementaire</li>
                  </ul>
                  <p className="mt-4">
                    Nous ne vendons jamais vos données personnelles à des tiers.
                  </p>
                </div>
              </section>

              {/* International Transfers */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Transferts Internationaux</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    Vos données sont principalement hébergées au sein de l'Union Européenne. 
                    En cas de transfert hors UE, nous nous assurons que des garanties appropriées 
                    sont en place (clauses contractuelles types, décision d'adéquation).
                  </p>
                </div>
              </section>

              {/* Security */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Sécurité</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                    pour protéger vos données : chiffrement TLS, contrôle d'accès, audits réguliers, 
                    formation du personnel.
                  </p>
                </div>
              </section>

              {/* Contact & Complaints */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Contact et Réclamations</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    Pour toute question relative à cette politique ou pour exercer vos droits, 
                    contactez notre Délégué à la Protection des Données (DPO) :
                  </p>
                  <div className="pl-4 border-l-2 border-primary">
                    <p>Email : dpo@prismacapital.fr</p>
                    <p>Courrier : Prisma Capital Cards SAS - DPO, 25 Avenue des Champs-Élysées, 75008 Paris</p>
                  </div>
                  <p className="mt-4">
                    Vous avez également le droit d'introduire une réclamation auprès de la CNIL 
                    (Commission Nationale de l'Informatique et des Libertés) : www.cnil.fr
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
