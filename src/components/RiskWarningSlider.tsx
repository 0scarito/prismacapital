import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const RiskWarningSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useLanguage();

  const riskWarnings = [
    {
      category: 'Private Equity',
      risk: '6/7',
      key: 'risk.privateEquity'
    },
    {
      category: 'Crypto-assets',
      risk: '7/7',
      key: 'risk.crypto'
    },
    {
      category: 'Real-estate Crowdfunding',
      risk: '5/7',
      key: 'risk.realEstate'
    },
    {
      category: 'Venture Capital',
      risk: '7/7',
      key: 'risk.ventureCapital'
    },
    {
      category: 'Commodities',
      risk: '5/7',
      key: 'risk.commodities'
    },
    {
      category: 'Diversified ETFs',
      risk: '3/7',
      key: 'risk.etf'
    }
  ];

  // Auto-advance every 6 seconds when not paused
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % riskWarnings.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPaused, riskWarnings.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % riskWarnings.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + riskWarnings.length) % riskWarnings.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getRiskColor = (risk: string) => {
    const level = parseInt(risk.split('/')[0]);
    if (level <= 3) return 'text-green-600';
    if (level <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div 
      className="relative bg-card border border-border rounded-lg p-6 my-8 max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors z-10"
        aria-label="Previous warning"
      >
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors z-10"
        aria-label="Next warning"
      >
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Content */}
      <div className="px-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h4 className="font-semibold text-lg text-card-foreground">
              {riskWarnings[currentSlide].category}
            </h4>
            <span className={`font-bold text-sm px-2 py-1 rounded ${getRiskColor(riskWarnings[currentSlide].risk)} bg-muted`}>
              Risk {riskWarnings[currentSlide].risk}
            </span>
          </div>
          
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
            {t(riskWarnings[currentSlide].key)}
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {riskWarnings.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary w-6' 
                : 'bg-border hover:bg-muted-foreground'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-border rounded-b-lg overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-75 ease-linear"
          style={{
            width: isPaused ? '100%' : `${((currentSlide + 1) / riskWarnings.length) * 100}%`,
            animation: isPaused ? 'none' : `progress 6s linear infinite`
          }}
        />
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default RiskWarningSlider;