import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CredibilityBar from '@/components/CredibilityBar';
import HowItWorksSection from '@/components/HowItWorksSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import ComplianceSection from '@/components/ComplianceSection';
import Footer from '@/components/Footer';

// Global type declaration for analytics
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Home page component with smooth scrolling and analytics tracking
 */
const Index = () => {
  useEffect(() => {
    // Enable smooth scrolling for the page
    document.documentElement.classList.add('smooth-scroll');

    // Track CTA button clicks for analytics
    const handleCTAClick = (event: Event) => {
      const button = event.currentTarget as HTMLElement;
      const section = button.getAttribute('data-cta');
      
      if (section && window.dataLayer) {
        window.dataLayer.push({
          event: 'cta_click',
          section,
          timestamp: Date.now()
        });
      }
    };

    // Attach click handlers to all CTA buttons
    const ctaButtons = document.querySelectorAll<HTMLElement>('[data-cta]');
    ctaButtons.forEach(button => {
      button.addEventListener('click', handleCTAClick);
    });

    // Cleanup function
    return () => {
      document.documentElement.classList.remove('smooth-scroll');
      ctaButtons.forEach(button => {
        button.removeEventListener('click', handleCTAClick);
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
        <ComplianceSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
