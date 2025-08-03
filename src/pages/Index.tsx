import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CredibilityBar from '@/components/CredibilityBar';
import HowItWorksSection from '@/components/HowItWorksSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import ComplianceSection from '@/components/ComplianceSection';
import Footer from '@/components/Footer';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const Index = () => {
  useEffect(() => {
    // Add smooth scroll behavior to html element
    document.documentElement.classList.add('smooth-scroll');

    // Add analytics event tracking
    const handleCTAClick = (section: string) => {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
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
