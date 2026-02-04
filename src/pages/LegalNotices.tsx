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
              {t('legal.notices.title')}
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              {/* Company Information */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">{t('legal.notices.publisher')}</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.companyName')} :</strong>
                    <p>Prisma Capital Cards SAS</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.legalForm')} :</strong>
                    <p>{t('legal.notices.legalFormValue')}</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.shareCapital')} :</strong>
                    <p>100 000 €</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.headquarters')} :</strong>
                    <p>25 Avenue des Champs-Élysées, 75008 Paris, France</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.rcs')} :</strong>
                    <p>Paris B 123 456 789</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.vatNumber')} :</strong>
                    <p>FR 12 123456789</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.phone')} :</strong>
                    <p>+33 1 23 45 67 89</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.email')} :</strong>
                    <p>contact@prismacapital.fr</p>
                  </div>
                </div>
              </section>

              {/* Regulatory Status */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">{t('legal.notices.regulatoryStatus')}</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>{t('legal.notices.regulatoryText1')}</p>
                  <p>{t('legal.notices.regulatoryText2')}</p>
                  <div className="mt-4">
                    <strong className="text-card-foreground">{t('legal.notices.oriasNumber')} :</strong>
                    <p>24 123 456</p>
                  </div>
                </div>
              </section>

              {/* Publication Director */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">{t('legal.notices.publicationDirector')}</h2>
                <div className="text-card-foreground/80">
                  <p>{t('legal.notices.publicationDirectorText')}</p>
                </div>
              </section>

              {/* Hosting Provider */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">{t('legal.notices.hosting')}</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.hostingProvider')} :</strong>
                    <p>Supabase Inc.</p>
                  </div>
                  <div>
                    <strong className="text-card-foreground">{t('legal.notices.hostingAddress')} :</strong>
                    <p>970 Toa Payoh North, #07-04, Singapore 318992</p>
                  </div>
                  <p>{t('legal.notices.hostingText')}</p>
                </div>
              </section>

              {/* Intellectual Property */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">{t('legal.notices.intellectualProperty')}</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>{t('legal.notices.intellectualPropertyText1')}</p>
                  <p>{t('legal.notices.intellectualPropertyText2')}</p>
                  <p>{t('legal.notices.intellectualPropertyText3')}</p>
                </div>
              </section>

              {/* Terms of Use */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">{t('legal.notices.termsOfUse')}</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>{t('legal.notices.termsOfUseText1')}</p>
                  <p>{t('legal.notices.termsOfUseText2')}</p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">{t('legal.notices.liability')}</h2>
                <div className="space-y-4 text-card-foreground/80">
                  <p>{t('legal.notices.liabilityText1')}</p>
                  <p>{t('legal.notices.liabilityText2')}</p>
                </div>
              </section>

              {/* Applicable Law */}
              <section className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-card-foreground">{t('legal.notices.applicableLaw')}</h2>
                <div className="text-card-foreground/80">
                  <p>{t('legal.notices.applicableLawText')}</p>
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
