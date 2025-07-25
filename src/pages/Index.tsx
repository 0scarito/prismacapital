import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CredibilityBar from '@/components/CredibilityBar';
import HowItWorksSection from '@/components/HowItWorksSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import GiftConfiguratorSection from '@/components/GiftConfiguratorSection';
import ComplianceSection from '@/components/ComplianceSection';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Add smooth scroll behavior to html element
    document.documentElement.classList.add('smooth-scroll');
    
    // SEO Meta tags
    document.title = 'Cap&CO | Gift a stake in tomorrow';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Démocratisez l\'accès au private equity avec les Cartes Prisma Capital. Cartes-cadeaux NFC physiques pour investir dans les marchés privés. AMF agréé.'
      );
    }

    // OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Prisma Capital Cards | Gift Private-Markets Access');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 
        'Démocratisez l\'accès au private equity avec les Cartes Prisma Capital. Cartes-cadeaux NFC physiques pour investir dans les marchés privés.'
      );
    }

    // Add analytics event tracking
    const handleCTAClick = (section: string) => {
      // Google Tag Manager event
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'cta_click',
          section: section,
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
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        <HeroSection />
        <CredibilityBar />
        <HowItWorksSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <GiftConfiguratorSection />
        <ComplianceSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
