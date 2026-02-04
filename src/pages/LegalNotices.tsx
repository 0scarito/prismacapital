import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const LegalNotices = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">
              {t('footer.legalNotices')}
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              {/* Company Information */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Identification de l'Éditeur</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <div>
                    <strong className="text-card-foreground">Raison sociale :</strong>
                    <p>Prisma Capital Cards SAS</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">Forme juridique :</strong>
                    <p>Société par Actions Simplifiée (SAS)</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">Capital social :</strong>
                    <p>100 000 €</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">Siège social :</strong>
                    <p>25 Avenue des Champs-Élysées, 75008 Paris, France</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">RCS :</strong>
                    <p>Paris B 123 456 789</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">Numéro de TVA intracommunautaire :</strong>
                    <p>FR 12 123456789</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">Téléphone :</strong>
                    <p>+33 1 23 45 67 89</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">Email :</strong>
                    <p>contact@prismacapital.fr</p>
                  </div>
                </div>
              </section>

              {/* Regulatory Status */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Statut Réglementaire</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    Prisma Capital Cards SAS est enregistrée en tant que Prestataire de Services sur Actifs Numériques (PSAN) 
                    auprès de l'Autorité des Marchés Financiers (AMF) sous le numéro E2024-XXX.
                  </p>
                  <p>
                    La société est également enregistrée comme Agent de Prestataire de Services de Paiement 
                    auprès de l'Autorité de Contrôle Prudentiel et de Résolution (ACPR).
                  </p>
                  <div className="mt-4">
                    <strong className="text-card-foreground">Numéro ORIAS :</strong>
                    <p>24 123 456</p>
                  </div>
                </div>
              </section>

              {/* Publication Director */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Directeur de la Publication</h2>
                <div className="text-card-foreground/80">
                  <p>Le directeur de la publication est Monsieur Jean-Pierre Martin, Président de Prisma Capital Cards SAS.</p>
                </div>
              </section>

              {/* Hosting Provider */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Hébergement</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <div>
                    <strong className="text-card-foreground">Hébergeur :</strong>
                    <p>Supabase Inc.</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">Adresse :</strong>
                    <p>970 Toa Payoh North, #07-04, Singapore 318992</p>
                  </div>
                  <p>
                    Les données sont hébergées au sein de l'Union Européenne conformément aux exigences 
                    du Règlement Général sur la Protection des Données (RGPD).
                  </p>
                </div>
              </section>

              {/* Intellectual Property */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Propriété Intellectuelle</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, etc.) 
                    est protégé par le droit d'auteur et le droit des marques.
                  </p>
                  <p>
                    La marque "Prisma Capital Cards" et le logo associé sont des marques déposées 
                    de Prisma Capital Cards SAS. Toute reproduction non autorisée est interdite.
                  </p>
                  <p>
                    L'utilisation de ce site ne confère aucun droit de propriété intellectuelle 
                    sur son contenu. Toute reproduction, représentation, modification ou distribution 
                    du contenu du site est strictement interdite sans autorisation préalable écrite.
                  </p>
                </div>
              </section>

              {/* Terms of Use */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Conditions d'Utilisation</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    L'accès et l'utilisation du site sont soumis aux présentes mentions légales ainsi 
                    qu'aux lois et réglementations applicables. En accédant au site, vous acceptez 
                    sans réserve ces conditions.
                  </p>
                  <p>
                    Prisma Capital Cards SAS se réserve le droit de modifier ces mentions légales 
                    à tout moment. Les utilisateurs sont invités à les consulter régulièrement.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Limitation de Responsabilité</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    Prisma Capital Cards SAS s'efforce de fournir des informations exactes et à jour 
                    sur son site. Toutefois, elle ne peut garantir l'exactitude, la complétude ou 
                    l'actualité des informations diffusées.
                  </p>
                  <p>
                    En conséquence, Prisma Capital Cards SAS décline toute responsabilité pour 
                    toute imprécision, inexactitude ou omission portant sur des informations 
                    disponibles sur le site.
                  </p>
                </div>
              </section>

              {/* Applicable Law */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Droit Applicable</h2>
                <div className="text-card-foreground/80">
                  <p>
                    Les présentes mentions légales sont régies par le droit français. 
                    Tout litige relatif à l'utilisation du site sera soumis à la compétence 
                    exclusive des tribunaux de Paris.
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

export default LegalNotices;
