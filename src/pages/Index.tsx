import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CredibilityBar from '@/components/CredibilityBar';
import HowItWorksSection from '@/components/HowItWorksSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import ComplianceSection from '@/components/ComplianceSection';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    document.documentElement.classList.add('smooth-scroll');

    // Add analytics event tracking
    const handleCTAClick = (section: string) => {
      // Google Tag Manager event
      if (typeof window !== 'undefined') {
        const w = window as Window & { dataLayer?: Record<string, unknown>[] };
        w.dataLayer?.push({
          event: 'cta_click',
          section,
          timestamp: Date.now()
        });
      }
    };

    // Attach event listeners to CTA buttons
    const ctaButtons = document.querySelectorAll('[data-cta]');
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        const section = button.getAttribute('data-cta');
        if (section) handleCTAClick(section);
      });
    });

    return () => {
      document.documentElement.classList.remove('smooth-scroll');
      ctaButtons.forEach(button => {
        button.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Helmet>
        <title>Prisma Capital | Gift a stake in tomorrow</title>
        <meta
          name="description"
          content="Démocratisez l'accès au private equity avec les Cartes Prisma Capital. Cartes-cadeaux NFC physiques pour investir dans les marchés privés. AMF agréé."
        />
        <meta property="og:title" content="Prisma Capital Cards | Gift Private-Markets Access" />
        <meta
          property="og:description"
          content="Démocratisez l'accès au private equity avec les Cartes Prisma Capital. Cartes-cadeaux NFC physiques pour investir dans les marchés privés."
        />
      </Helmet>
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        <HeroSection />
        <CredibilityBar />
        <HowItWorksSection />
        <WhyChooseSection />
        <ComplianceSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
