import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Comment ça marche', href: '/how-it-works' },
    { label: 'Investissements', href: '/investments' },
    { label: 'Partenaires', href: '/partners' },
    { label: 'Sécurité', href: '/security' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Mon Espace', href: '/auth' },
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="section-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-prisma flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-heading text-xl text-foreground">
              Cap&CO
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className="font-body text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigation('#cta')}
              className="btn-prisma"
            >
              Acheter une Carte
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className="block w-full text-left font-body text-foreground hover:text-primary transition-colors duration-200 py-2"
                  >
                    {item.label}
                  </button>
              ))}
              <button
                onClick={() => handleNavigation('#cta')}
                className="btn-prisma w-full"
              >
                Acheter une Carte
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;