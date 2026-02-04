import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, TrendingDown, Clock, Lock, Scale, Landmark } from 'lucide-react';

const RiskDisclosure = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('footer.riskDisclosure')}
            </h1>
            <p className="text-foreground/70 mb-8">
              Veuillez lire attentivement ces informations avant d'investir.
            </p>

            {/* General Warning */}
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-destructive mb-2">Avertissement Important</h2>
                  <p className="text-foreground">
                    <strong>L'investissement comporte des risques, notamment de perte partielle ou totale du capital investi.</strong> 
                    Les performances passées ne préjugent pas des performances futures. Avant d'investir, 
                    assurez-vous de comprendre les risques associés et de n'investir que des sommes que 
                    vous pouvez vous permettre de perdre.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-8">
              {/* General Investment Risks */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingDown className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-card-foreground m-0">Risques Généraux d'Investissement</h2>
                </div>
                <div className="space-y-4 text-card-foreground/80">
                  <ul className="list-disc pl-6 space-y-3">
                    <li><strong>Risque de perte en capital :</strong> Vous pouvez perdre tout ou partie de votre investissement initial.</li>
                    <li><strong>Risque de marché :</strong> La valeur des investissements peut fluctuer en fonction des conditions économiques et de marché.</li>
                    <li><strong>Risque de liquidité :</strong> Certains investissements peuvent être difficiles à vendre rapidement sans perte de valeur.</li>
                    <li><strong>Risque de change :</strong> Pour les investissements libellés en devises étrangères, les fluctuations de taux peuvent impacter les rendements.</li>
                    <li><strong>Risque d'inflation :</strong> Le rendement réel peut être réduit par l'inflation.</li>
                  </ul>
                </div>
              </section>

              {/* Real Estate Risks */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <Landmark className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-card-foreground m-0">Immobilier (Crowdfunding Immobilier)</h2>
                </div>
                <div className="space-y-4 text-card-foreground/80">
                  <p><strong>Niveau de risque : 5/7</strong> - Horizon recommandé : 3 à 7 ans</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li><strong>Risque de vacance locative :</strong> Les biens peuvent rester inoccupés, réduisant les revenus.</li>
                    <li><strong>Risque de dépréciation :</strong> La valeur des biens immobiliers peut baisser.</li>
                    <li><strong>Risque de défaut du promoteur :</strong> En crowdfunding, le promoteur peut faire défaut.</li>
                    <li><strong>Risque de retard :</strong> Les projets de construction peuvent subir des retards.</li>
                    <li><strong>Illiquidité :</strong> Les investissements immobiliers sont peu liquides.</li>
                  </ul>
                </div>
              </section>

              {/* Crypto Risks */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  <h2 className="text-2xl font-semibold text-card-foreground m-0">Crypto-actifs</h2>
                </div>
                <div className="bg-destructive/5 border border-destructive/20 rounded p-4 mb-4">
                  <p className="text-destructive font-semibold">
                    ⚠️ Niveau de risque : 7/7 - Volatilité extrême - Perte totale du capital possible
                  </p>
                </div>
                <div className="space-y-4 text-card-foreground/80">
                  <ul className="list-disc pl-6 space-y-3">
                    <li><strong>Volatilité extrême :</strong> Les prix peuvent varier de manière très importante en quelques heures.</li>
                    <li><strong>Risque réglementaire :</strong> Les réglementations peuvent évoluer et impacter négativement les crypto-actifs.</li>
                    <li><strong>Risque technologique :</strong> Vulnérabilités, piratages ou obsolescence technologique.</li>
                    <li><strong>Risque de contrepartie :</strong> Défaillance des plateformes d'échange ou des dépositaires.</li>
                    <li><strong>Absence de garantie :</strong> Les crypto-actifs ne sont pas garantis par un État ou une banque centrale.</li>
                  </ul>
                </div>
              </section>

              {/* ETF Risks */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <Scale className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-card-foreground m-0">ETFs Diversifiés</h2>
                </div>
                <div className="space-y-4 text-card-foreground/80">
                  <p><strong>Niveau de risque : 3/7</strong> - Horizon recommandé : moyen à long terme (≥ 5 ans)</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li><strong>Risque de marché :</strong> Les ETFs répliquent les variations de leur indice de référence.</li>
                    <li><strong>Risque de réplication :</strong> Écart possible entre la performance de l'ETF et celle de l'indice.</li>
                    <li><strong>Risque de liquidité :</strong> Variable selon le volume de transactions.</li>
                    <li><strong>Risque de change :</strong> Pour les ETFs investis en devises étrangères.</li>
                  </ul>
                </div>
              </section>

              {/* Private Equity Risks */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-card-foreground m-0">Private Equity</h2>
                </div>
                <div className="space-y-4 text-card-foreground/80">
                  <p><strong>Niveau de risque : 6/7</strong> - Risque élevé de perte en capital</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li><strong>Illiquidité élevée :</strong> Période de blocage généralement de 7 à 10 ans.</li>
                    <li><strong>Risque entrepreneurial :</strong> Les entreprises non cotées peuvent échouer.</li>
                    <li><strong>Valorisation difficile :</strong> Absence de prix de marché quotidien.</li>
                    <li><strong>Risque de dilution :</strong> Lors de levées de fonds successives.</li>
                    <li><strong>Concentration :</strong> Exposition à un nombre limité de sociétés.</li>
                  </ul>
                </div>
              </section>

              {/* Venture Capital Risks */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-semibold text-card-foreground m-0">Venture Capital</h2>
                </div>
                <div className="space-y-4 text-card-foreground/80">
                  <p><strong>Niveau de risque : 7/7</strong> - Horizon recommandé : 7 à 12 ans minimum</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li><strong>Risque de perte totale :</strong> La majorité des startups échouent.</li>
                    <li><strong>Illiquidité extrême :</strong> Aucune garantie de sortie ou de revente.</li>
                    <li><strong>Risque de dilution :</strong> Fréquent lors des tours de financement successifs.</li>
                    <li><strong>Valorisation spéculative :</strong> Basée sur des projections futures incertaines.</li>
                    <li><strong>Dépendance aux fondateurs :</strong> Risque lié aux équipes dirigeantes.</li>
                  </ul>
                </div>
              </section>

              {/* Commodities Risks */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-card-foreground m-0">Matières Premières</h2>
                </div>
                <div className="space-y-4 text-card-foreground/80">
                  <p><strong>Niveau de risque : 5/7</strong> - Horizon recommandé : moyen à long terme (≥ 5 ans)</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li><strong>Volatilité :</strong> Prix influencés par l'offre, la demande, et les événements géopolitiques.</li>
                    <li><strong>Risque de contango :</strong> Pour les produits à terme, érosion possible de la valeur.</li>
                    <li><strong>Risque de change :</strong> La plupart des matières premières sont cotées en dollars.</li>
                    <li><strong>Absence de revenus :</strong> Les matières premières ne génèrent pas de dividendes ou intérêts.</li>
                  </ul>
                </div>
              </section>

              {/* Regulatory Information */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Informations Réglementaires</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    Prisma Capital Cards SAS est enregistrée en tant que Prestataire de Services sur Actifs 
                    Numériques (PSAN) auprès de l'Autorité des Marchés Financiers (AMF).
                  </p>
                  <p>
                    Les investissements proposés via cette plateforme ne bénéficient d'aucune garantie 
                    de l'État ni du Fonds de Garantie des Dépôts et de Résolution (FGDR).
                  </p>
                  <p>
                    Avant d'investir, nous vous recommandons de consulter les Documents d'Information 
                    Clé (DIC/DICI) disponibles sur notre plateforme et de prendre conseil auprès 
                    d'un professionnel.
                  </p>
                </div>
              </section>

              {/* Suitability */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Adéquation et Profil Investisseur</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>
                    Les produits proposés peuvent ne pas convenir à tous les investisseurs. 
                    Avant d'investir, assurez-vous que :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Vous comprenez les caractéristiques et les risques du produit</li>
                    <li>L'investissement correspond à vos objectifs financiers</li>
                    <li>Vous disposez d'un horizon d'investissement suffisant</li>
                    <li>Votre situation financière vous permet d'absorber une perte potentielle</li>
                    <li>Vous avez diversifié votre portefeuille</li>
                  </ul>
                </div>
              </section>

              {/* Past Performance */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Performances Passées</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p className="font-semibold">
                    Les performances passées ne sont pas un indicateur fiable des performances futures.
                  </p>
                  <p>
                    Toutes les données de performance présentées sur ce site sont fournies à titre 
                    indicatif uniquement. Les rendements futurs peuvent varier considérablement 
                    par rapport aux rendements historiques.
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

export default RiskDisclosure;
