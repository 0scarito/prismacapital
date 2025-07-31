import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RiskWarningSliderProps {
  categoryKey?: string;
}

const RiskWarningSlider = ({ categoryKey }: RiskWarningSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
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

  const filteredWarnings = categoryKey
    ? riskWarnings.filter(w => w.key === categoryKey)
    : riskWarnings;

  // Reset slide when the category changes
  useEffect(() => {
    setCurrentSlide(0);
    setExpanded(false);
  }, [categoryKey]);

  // Auto-advance every 6 seconds when not paused and there are multiple warnings
  useEffect(() => {
    if (!isPaused && filteredWarnings.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % filteredWarnings.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPaused, filteredWarnings.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredWarnings.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + filteredWarnings.length) % filteredWarnings.length);
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
      className="relative bg-red-900/30 rounded-xl p-6 border border-red-700 my-8 text-red-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      {filteredWarnings.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-orange-500/20 rounded-full transition-colors z-10"
            aria-label="Previous warning"
          >
            <ChevronLeft className="w-5 h-5 text-red-200" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-orange-500/20 rounded-full transition-colors z-10"
            aria-label="Next warning"
          >
            <ChevronRight className="w-5 h-5 text-red-200" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="px-12">
        <h4 className="font-heading text-lg text-red-200 mb-3 flex items-center justify-center gap-2">
          <span className="mr-2">⚠️</span>
          {t('footer.riskWarning.title')}
        </h4>
        <div className="text-center">
          <div className="md:grid md:grid-cols-3 gap-6 text-left mb-4">
            <div className="md:col-span-1 flex flex-col items-start md:items-center mb-4 md:mb-0">
              <h5 className="font-semibold text-red-100 mb-2">
                {filteredWarnings[currentSlide].category}
              </h5>
              <span className="font-bold text-sm px-2 py-1 rounded bg-red-500/30 text-red-200">
                Risk {filteredWarnings[currentSlide].risk}
              </span>
            </div>
            <div className="md:col-span-2 text-red-100/90 leading-relaxed whitespace-pre-line text-sm">
              {expanded
                ? t(filteredWarnings[currentSlide].key)
                : t(filteredWarnings[currentSlide].key).split(/(?<=[.!?])\s+/).slice(0,2).join(' ')}
              {t(filteredWarnings[currentSlide].key).split(/(?<=[.!?])\s+/).length > 2 && (
                <button
                  className="ml-2 text-red-200 underline"
                  onClick={() => setExpanded(prev => !prev)}
                >
                  {expanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {filteredWarnings.length > 1 && (
      <div className="flex justify-center mt-6 space-x-2">
        {filteredWarnings.map((_, index) => (
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
      )}

      {/* Progress Bar */}
      {filteredWarnings.length > 1 && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-border rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-75 ease-linear"
          style={{
            width: isPaused ? '100%' : `${((currentSlide + 1) / filteredWarnings.length) * 100}%`,
            animation: isPaused ? 'none' : `progress 6s linear infinite`
          }}
        />
      </div>
      )}

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