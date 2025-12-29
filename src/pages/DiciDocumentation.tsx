import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink, Info, AlertTriangle } from 'lucide-react';

const DiciDocumentation = () => {
  const { t } = useLanguage();

  const documentCategories = [
    {
      category: "Immobilier",
      documents: [
        { name: "Paris Haussmann Premium SCPI", type: "DIC", date: "2024-12-01" },
        { name: "Campus Tech Frankfurt", type: "DIC", date: "2024-11-15" },
      ]
    },
    {
      category: "ETFs Diversifiés",
      documents: [
        { name: "Vanguard European Dividend ETF", type: "DICI", date: "2024-12-15" },
        { name: "iShares ESG Aware MSCI Europe", type: "DICI", date: "2024-12-01" },
      ]
    },
    {
      category: "Crypto-actifs",
      documents: [
        { name: "Bitcoin (BTC)", type: "Document d'Information", date: "2024-12-01" },
        { name: "Ethereum (ETH)", type: "Document d'Information", date: "2024-12-01" },
      ]
    },
    {
      category: "Private Equity",
      documents: [
        { name: "LVMH Luxury Growth Fund", type: "DIC ELTIF", date: "2024-11-01" },
        { name: "Siemens Energy Transition", type: "DIC ELTIF", date: "2024-10-15" },
      ]
    },
    {
      category: "Venture Capital",
      documents: [
        { name: "OpenAI Growth Fund", type: "Note d'Information", date: "2024-12-01" },
        { name: "SpaceX Starlink Fund", type: "Note d'Information", date: "2024-11-15" },
      ]
    },
    {
      category: "Matières Premières",
      documents: [
        { name: "iShares Physical Gold ETC", type: "DIC", date: "2024-12-01" },
        { name: "WisdomTree Agriculture ETC", type: "DIC", date: "2024-11-15" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('footer.dici')}
            </h1>
            <p className="text-muted-foreground mb-8">
              Accédez aux Documents d'Informations Clés (DIC/DICI) pour tous nos produits d'investissement.
            </p>

            {/* Explanation Card */}
            <Card className="mb-8 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Info className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h2 className="font-semibold text-lg mb-2">Qu'est-ce qu'un DICI ?</h2>
                    <p className="text-muted-foreground">
                      Le Document d'Informations Clés pour l'Investisseur (DICI) ou Document 
                      d'Information Clé (DIC) est un document réglementaire standardisé qui 
                      fournit les informations essentielles sur un produit d'investissement. 
                      Il présente de manière claire et concise :
                    </p>
                    <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                      <li>Les objectifs et la politique d'investissement</li>
                      <li>Le profil de risque et de rendement (échelle de 1 à 7)</li>
                      <li>Les frais applicables</li>
                      <li>Les performances passées</li>
                      <li>Les informations pratiques</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Notice */}
            <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Obligation réglementaire</h3>
                    <p className="text-sm text-muted-foreground">
                      Conformément à la réglementation européenne (PRIIPS et OPCVM), nous vous 
                      recommandons de lire attentivement le DIC/DICI de chaque produit avant 
                      d'investir. Ces documents vous aident à comprendre les caractéristiques, 
                      les risques et les frais associés à chaque investissement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Categories */}
            <div className="space-y-8">
              {documentCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {category.category}
                    </CardTitle>
                    <CardDescription>
                      {category.documents.length} document(s) disponible(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.documents.map((doc, docIndex) => (
                        <div 
                          key={docIndex}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium">{doc.name}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                {doc.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Mis à jour : {new Date(doc.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Voir
                            </Button>
                            <Button variant="secondary" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* General Documents */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Documents Généraux</CardTitle>
                <CardDescription>
                  Documents réglementaires et informations générales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <h4 className="font-medium">Conditions Générales d'Utilisation</h4>
                      <span className="text-xs text-muted-foreground">Version 2.1 - Décembre 2024</span>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <h4 className="font-medium">Politique de Traitement des Réclamations</h4>
                      <span className="text-xs text-muted-foreground">Version 1.0 - Janvier 2024</span>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <h4 className="font-medium">Politique de Conflits d'Intérêts</h4>
                      <span className="text-xs text-muted-foreground">Version 1.0 - Janvier 2024</span>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <h4 className="font-medium">Politique de Meilleure Exécution</h4>
                      <span className="text-xs text-muted-foreground">Version 1.0 - Janvier 2024</span>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="mt-8 bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Besoin d'aide pour comprendre ces documents ?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Notre équipe est disponible pour vous accompagner dans la lecture 
                    et la compréhension des documents réglementaires.
                  </p>
                  <Button variant="outline">
                    Contacter le Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiciDocumentation;
