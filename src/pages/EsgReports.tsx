import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Leaf, Users, Scale, Download, TrendingUp, Globe, Recycle, Heart } from 'lucide-react';

const EsgReports = () => {
  const { t } = useLanguage();

  const esgMetrics = {
    environmental: {
      score: 78,
      metrics: [
        { label: "Réduction CO2 vs 2023", value: "-12%", trend: "positive" },
        { label: "Énergies renouvelables", value: "89%", trend: "positive" },
        { label: "Déchets recyclés", value: "94%", trend: "positive" },
      ]
    },
    social: {
      score: 85,
      metrics: [
        { label: "Parité H/F", value: "48%", trend: "positive" },
        { label: "Formation employés", value: "32h/an", trend: "neutral" },
        { label: "Satisfaction clients", value: "4.6/5", trend: "positive" },
      ]
    },
    governance: {
      score: 92,
      metrics: [
        { label: "Indépendance conseil", value: "67%", trend: "positive" },
        { label: "Conformité RGPD", value: "100%", trend: "positive" },
        { label: "Transparence financière", value: "AAA", trend: "positive" },
      ]
    }
  };

  const commitments = [
    {
      icon: Globe,
      title: "Neutralité Carbone 2030",
      description: "Nous nous engageons à atteindre la neutralité carbone pour l'ensemble de nos opérations d'ici 2030.",
    },
    {
      icon: Recycle,
      title: "Économie Circulaire",
      description: "100% de nos cartes NFC physiques sont fabriquées à partir de matériaux recyclés et recyclables.",
    },
    {
      icon: Heart,
      title: "Investissement Responsable",
      description: "Nous excluons les secteurs controversés (armes, tabac, charbon) de notre offre d'investissement.",
    },
    {
      icon: Users,
      title: "Inclusion Financière",
      description: "Démocratiser l'accès à l'investissement pour tous, avec des tickets d'entrée accessibles.",
    },
  ];

  const reports = [
    { year: 2024, title: "Rapport ESG Annuel 2024", date: "2024-12-15", size: "2.4 MB" },
    { year: 2023, title: "Rapport ESG Annuel 2023", date: "2024-03-15", size: "2.1 MB" },
    { year: 2024, title: "Rapport Climat (TCFD) 2024", date: "2024-11-01", size: "1.8 MB" },
    { year: 2024, title: "Déclaration de Performance Extra-Financière", date: "2024-06-30", size: "3.2 MB" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('footer.esg')}
            </h1>
            <p className="text-foreground/70 mb-8">
              Notre engagement pour un investissement responsable et durable.
            </p>

            {/* ESG Overview */}
            <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Score ESG Global</h2>
                  <div className="text-5xl font-bold text-primary">
                    {Math.round((esgMetrics.environmental.score + esgMetrics.social.score + esgMetrics.governance.score) / 3)}
                    <span className="text-xl text-muted-foreground">/100</span>
                  </div>
                  <p className="text-sm text-card-foreground/60 mt-2">
                    Évaluation au 31 décembre 2024
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ESG Pillars */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Environmental */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Leaf className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Environnement</CardTitle>
                      <CardDescription>E - Environmental</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score</span>
                      <span className="font-semibold">{esgMetrics.environmental.score}/100</span>
                    </div>
                    <Progress value={esgMetrics.environmental.score} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    {esgMetrics.environmental.metrics.map((metric, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-card-foreground/60">{metric.label}</span>
                        <span className={metric.trend === 'positive' ? 'text-green-500' : ''}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Social</CardTitle>
                      <CardDescription>S - Social</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score</span>
                      <span className="font-semibold">{esgMetrics.social.score}/100</span>
                    </div>
                    <Progress value={esgMetrics.social.score} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    {esgMetrics.social.metrics.map((metric, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-card-foreground/60">{metric.label}</span>
                        <span className={metric.trend === 'positive' ? 'text-green-500' : ''}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Governance */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Scale className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Gouvernance</CardTitle>
                      <CardDescription>G - Governance</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score</span>
                      <span className="font-semibold">{esgMetrics.governance.score}/100</span>
                    </div>
                    <Progress value={esgMetrics.governance.score} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    {esgMetrics.governance.metrics.map((metric, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-card-foreground/60">{metric.label}</span>
                        <span className={metric.trend === 'positive' ? 'text-green-500' : ''}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Our Commitments */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Nos Engagements
                </CardTitle>
                <CardDescription>
                  Les piliers de notre stratégie de développement durable
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {commitments.map((commitment, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <commitment.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{commitment.title}</h3>
                        <p className="text-sm text-card-foreground/70">
                          {commitment.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investment Approach */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Notre Approche d'Investissement Responsable</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-card-foreground/80">
                <p>
                  Chez Prisma Capital Cards, nous intégrons les critères ESG à chaque étape de notre 
                  processus de sélection d'investissements. Notre approche repose sur trois piliers :
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <div>
                      <strong className="text-foreground">Exclusion</strong>
                      <p className="text-sm">Nous excluons systématiquement les secteurs controversés : 
                      armement, tabac, charbon thermique, jeux d'argent.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <div>
                      <strong className="text-foreground">Sélection ESG</strong>
                      <p className="text-sm">Nous privilégions les investissements avec des scores 
                      ESG supérieurs à leur secteur (approche "best-in-class").</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <div>
                      <strong className="text-foreground">Engagement Actionnarial</strong>
                      <p className="text-sm">Nous dialoguons avec les gestionnaires d'actifs pour 
                      améliorer les pratiques ESG des entreprises en portefeuille.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Télécharger nos Rapports
                </CardTitle>
                <CardDescription>
                  Accédez à nos publications ESG et extra-financières
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-card-foreground/60">
                            Publié le {new Date(report.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-xs text-card-foreground/60">
                            {report.size}
                          </span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="mt-8 bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-center mb-4">Labels et Certifications</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Leaf className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Label ISR</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Globe className="w-8 h-8 text-green-500" />
                    </div>
                    <span className="text-sm font-medium">Greenfin</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Scale className="w-8 h-8 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium">B Corp</span>
                  </div>
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

export default EsgReports;
