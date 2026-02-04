import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Cookie, Shield, BarChart3, Target, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
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
      title: t('cookies.preferencesSaved'),
      description: t('cookies.preferencesSavedDesc'),
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
      title: t('cookies.allAccepted'),
      description: t('cookies.allAcceptedDesc'),
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
      title: t('cookies.optionalRejected'),
      description: t('cookies.optionalRejectedDesc'),
    });
  };

  const cookieCategories = [
    {
      id: 'essential',
      icon: Shield,
      titleKey: 'cookies.essential.title',
      descriptionKey: 'cookies.essential.description',
      required: true,
      cookies: [
        { name: 'session_id', purposeKey: 'Session management', durationKey: 'cookies.session' },
        { name: 'csrf_token', purposeKey: 'CSRF protection', durationKey: 'cookies.session' },
        { name: 'cookie_consent', purposeKey: 'Cookie preferences', durationKey: 'cookies.duration.1year' },
      ],
    },
    {
      id: 'analytics',
      icon: BarChart3,
      titleKey: 'cookies.analytics.title',
      descriptionKey: 'cookies.analytics.description',
      required: false,
      cookies: [
        { name: '_ga', purposeKey: 'Google Analytics ID', durationKey: 'cookies.duration.2years' },
        { name: '_gid', purposeKey: 'User distinction', durationKey: 'cookies.duration.24hours' },
        { name: '_gat', purposeKey: 'Request throttling', durationKey: 'cookies.duration.1minute' },
      ],
    },
    {
      id: 'marketing',
      icon: Target,
      titleKey: 'cookies.marketing.title',
      descriptionKey: 'cookies.marketing.description',
      required: false,
      cookies: [
        { name: '_fbp', purposeKey: 'Facebook Pixel', durationKey: 'cookies.duration.3months' },
        { name: 'ads_prefs', purposeKey: 'Ad preferences', durationKey: 'cookies.duration.6months' },
      ],
    },
    {
      id: 'preferences',
      icon: Cookie,
      titleKey: 'cookies.preferences.title',
      descriptionKey: 'cookies.preferences.description',
      required: false,
      cookies: [
        { name: 'language', purposeKey: 'Language preference', durationKey: 'cookies.duration.1year' },
        { name: 'theme', purposeKey: 'Display theme', durationKey: 'cookies.duration.1year' },
        { name: 'currency', purposeKey: 'Currency preference', durationKey: 'cookies.duration.1year' },
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
              {t('cookies.title')}
            </h1>
            <p className="text-foreground/70 mb-8">
              {t('cookies.subtitle')}
            </p>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardContent className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button onClick={handleAcceptAll} className="flex-1">
                  {t('cookies.acceptAll')}
                </Button>
                <Button onClick={handleRejectOptional} variant="outline" className="flex-1">
                  {t('cookies.rejectOptional')}
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
                          <CardTitle className="text-lg">{t(category.titleKey)}</CardTitle>
                          {category.required && (
                            <span className="text-xs text-card-foreground/60">{t('cookies.essential.alwaysActive')}</span>
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
                      {t(category.descriptionKey)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-medium text-sm mb-3 text-card-foreground">{t('cookies.cookiesUsed')} :</h4>
                      <div className="space-y-2">
                        {category.cookies.map((cookie, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <div>
                              <span className="font-mono text-xs bg-white text-card-foreground px-2 py-1 rounded">
                                {cookie.name}
                              </span>
                              <span className="text-card-foreground/70 ml-2">
                                {cookie.purposeKey}
                              </span>
                            </div>
                            <span className="text-card-foreground/60 text-xs">
                              {t(cookie.durationKey)}
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
                {t('cookies.save')}
              </Button>
            </div>

            {/* Additional Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t('cookies.moreInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-card-foreground/80">
                <p>{t('cookies.moreInfoText1')}</p>
                <p>{t('cookies.moreInfoText2')}</p>
                <p>
                  {t('cookies.moreInfoText3')} <Link to="/privacy-policy" className="text-primary hover:underline">
                  {t('cookies.privacyPolicy')}</Link>.
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
