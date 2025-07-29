import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const HelpCenter = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">
              {t('footer.helpCenter')}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Centre d'Aide</h2>
                <p className="text-muted-foreground mb-4">
                  Trouvez des réponses à vos questions et de l'aide pour utiliser nos services.
                </p>
                <p className="text-muted-foreground">
                  Contenu à venir...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;