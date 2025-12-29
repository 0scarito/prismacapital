import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Cookie, Shield, BarChart3, Target, Save } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CookieSettings = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...parsed, essential: true });
      } catch {
        // Use defaults
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences de cookies ont été mises à jour.",
    });
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    toast({
      title: "Tous les cookies acceptés",
      description: "Vous pouvez modifier vos préférences à tout moment.",
    });
  };

  const handleRejectOptional = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(onlyEssential);
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyEssential));
    toast({
      title: "Cookies optionnels refusés",
      description: "Seuls les cookies essentiels sont activés.",
    });
  };

  const cookieCategories = [
    {
      id: 'essential',
      icon: Shield,
      title: 'Cookies Essentiels',
      description: 'Ces cookies sont nécessaires au fonctionnement du site. Ils permettent d\'utiliser les fonctionnalités principales comme l\'authentification et la sécurité.',
      required: true,
      cookies: [
        { name: 'session_id', purpose: 'Maintien de la session utilisateur', duration: 'Session' },
        { name: 'csrf_token', purpose: 'Protection contre les attaques CSRF', duration: 'Session' },
        { name: 'cookie_consent', purpose: 'Mémorisation des préférences cookies', duration: '1 an' },
      ],
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Cookies Analytiques',
      description: 'Ces cookies nous aident à comprendre comment les visiteurs utilisent le site. Toutes les données sont anonymisées.',
      required: false,
      cookies: [
        { name: '_ga', purpose: 'Identification visiteur Google Analytics', duration: '2 ans' },
        { name: '_gid', purpose: 'Distinction des utilisateurs', duration: '24 heures' },
        { name: '_gat', purpose: 'Limitation du taux de requêtes', duration: '1 minute' },
      ],
    },
    {
      id: 'marketing',
      icon: Target,
      title: 'Cookies Marketing',
      description: 'Ces cookies sont utilisés pour vous proposer des publicités personnalisées et mesurer l\'efficacité de nos campagnes.',
      required: false,
      cookies: [
        { name: '_fbp', purpose: 'Suivi Facebook Pixel', duration: '3 mois' },
        { name: 'ads_prefs', purpose: 'Préférences publicitaires', duration: '6 mois' },
      ],
    },
    {
      id: 'preferences',
      icon: Cookie,
      title: 'Cookies de Préférences',
      description: 'Ces cookies permettent de mémoriser vos préférences comme la langue ou la région.',
      required: false,
      cookies: [
        { name: 'language', purpose: 'Langue préférée', duration: '1 an' },
        { name: 'theme', purpose: 'Thème d\'affichage (clair/sombre)', duration: '1 an' },
        { name: 'currency', purpose: 'Devise préférée', duration: '1 an' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('footer.cookies')}
            </h1>
            <p className="text-muted-foreground mb-8">
              Gérez vos préférences de cookies pour personnaliser votre expérience sur notre site.
            </p>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardContent className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button onClick={handleAcceptAll} className="flex-1">
                  Tout accepter
                </Button>
                <Button onClick={handleRejectOptional} variant="outline" className="flex-1">
                  Refuser les optionnels
                </Button>
              </CardContent>
            </Card>

            {/* Cookie Categories */}
            <div className="space-y-6">
              {cookieCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <category.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          {category.required && (
                            <span className="text-xs text-muted-foreground">Toujours actifs</span>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={preferences[category.id as keyof CookiePreferences]}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({
                            ...prev,
                            [category.id]: checked,
                          }))
                        }
                        disabled={category.required}
                      />
                    </div>
                    <CardDescription className="mt-2">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium text-sm mb-3">Cookies utilisés :</h4>
                      <div className="space-y-2">
                        {category.cookies.map((cookie, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <div>
                              <span className="font-mono text-xs bg-background px-2 py-1 rounded">
                                {cookie.name}
                              </span>
                              <span className="text-muted-foreground ml-2">
                                {cookie.purpose}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {cookie.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <Button onClick={handleSave} size="lg">
                <Save className="w-4 h-4 mr-2" />
                Enregistrer mes préférences
              </Button>
            </div>

            {/* Additional Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Plus d'informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous 
                  visitez un site web. Les cookies sont largement utilisés pour faire fonctionner 
                  les sites web, les rendre plus efficaces, et fournir des informations aux 
                  propriétaires du site.
                </p>
                <p>
                  Vous pouvez à tout moment modifier vos préférences en revenant sur cette page. 
                  Vous pouvez également supprimer les cookies stockés sur votre appareil via les 
                  paramètres de votre navigateur.
                </p>
                <p>
                  Pour plus d'informations sur la façon dont nous utilisons vos données, 
                  consultez notre <a href="/privacy-policy" className="text-primary hover:underline">
                  Politique de Confidentialité</a>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookieSettings;
