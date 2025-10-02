import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import prismaLogo from '@/assets/prisma-logo.png';

/**
 * Main navigation component with responsive menu
 * Includes language toggle and authentication-aware navigation
 */
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  // Track scroll position for navbar background effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navItems = [{
    label: t('nav.home'),
    href: '/'
  }, {
    label: t('nav.investments'),
    href: '/investments'
  }, {
    label: t('nav.whatWeDo'),
    href: '/how-it-works'
  }, {
    label: t('nav.courses'),
    href: '/courses'
  }, {
    label: t('nav.partners'),
    href: '/partners'
  }, {
    label: t('nav.security'),
    href: '/security'
  }, user ? {
    label: t('nav.mySpace'),
    href: '/dashboard'
  } : {
    label: t('nav.joinUs'),
    href: '/auth'
  }];
  // Handle navigation clicks - supports both routes and anchor links
  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      // Smooth scroll to section for anchor links
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to route
      navigate(href);
    }
    setIsOpen(false);
  };
  return <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-border/40 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="pr-4 md:pr-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo - Non-interactive, positioned on the left */}
          <div className="flex items-center space-x-3">
            <img 
              src={prismaLogo} 
              alt="Prisma Capital Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <Link key={item.href} to={item.href} onClick={e => {
              e.preventDefault();
              handleNavigation(item.href);
            }} className="font-body text-foreground transition-colors duration-200">
                {item.label}
              </Link>)}

            {/* Language Toggle */}
            <div className="flex items-center bg-muted rounded-full p-1">
              <button onClick={() => setLanguage('fr')} className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${language === 'fr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                FR
              </button>
              <span className="text-muted-foreground px-1">|</span>
              <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                EN
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden bg-background border-t border-border">
            <div className="py-4 space-y-4">
              {navItems.map(item => <Link key={item.href} to={item.href} onClick={e => {
                e.preventDefault();
                handleNavigation(item.href);
              }} className="block w-full text-left font-body text-foreground hover:text-primary transition-colors duration-200 py-2">
                  {item.label}
                </Link>)}

              {/* Mobile Language Toggle */}
              <div className="flex items-center bg-muted rounded-full p-1">
                <button onClick={() => setLanguage('fr')} className={`flex-1 px-3 py-1 text-sm font-medium rounded-full transition-colors ${language === 'fr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  FR
                </button>
                <span className="text-muted-foreground px-1">|</span>
                <button onClick={() => setLanguage('en')} className={`flex-1 px-3 py-1 text-sm font-medium rounded-full transition-colors ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  EN
                </button>
              </div>
            </div>
          </div>}
      </div>
  </nav>;
};
export default Navigation;
