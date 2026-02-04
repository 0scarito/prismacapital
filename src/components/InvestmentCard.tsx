import { Plus, Check, TrendingUp, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface InvestmentCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  image?: string;
  expectedReturn?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  onClick?: () => void;
  onAdd?: () => void;
}

const InvestmentCard = ({ 
  id, 
  title, 
  description, 
  type, 
  image, 
  expectedReturn,
  riskLevel,
  onClick,
  onAdd 
}: InvestmentCardProps) => {
  const { addItem, items } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const isInCart = items.some(item => item.id === id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCart) {
      addItem({ id, name: title, description, type, image });
      toast({
        title: t('common.addedToCart'),
        description: title,
      });
    }
    if (onAdd) {
      onAdd();
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'High': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskText = (risk?: string) => {
    switch (risk) {
      case 'Low': return t('risk.low');
      case 'Medium': return t('risk.medium');
      case 'High': return t('risk.high');
      default: return risk;
    }
  };

  return (
    <div 
      className="bg-card rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border"
      onClick={onClick}
    >
      {/* Image */}
      <div className="w-full h-48 bg-muted overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        {riskLevel && (
          <Badge className={`absolute top-3 right-3 ${getRiskColor(riskLevel)}`}>
            {getRiskText(riskLevel)}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">{title}</h3>
        
        {/* Metrics Row */}
        {expectedReturn && (
          <div className="flex items-center gap-4 mb-3 pb-3 border-b border-border">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{expectedReturn}</span>
            </div>
            {riskLevel && (
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{getRiskText(riskLevel)}</span>
              </div>
            )}
          </div>
        )}
        
        <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{description}</p>
        <p className="text-xs text-primary font-medium mt-2">{t('common.fromPrice')}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-muted-foreground font-medium">{type}</span>
          <button
            onClick={handleAdd}
            disabled={isInCart}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors text-sm font-medium ${
              isInCart 
                ? 'bg-green-500 text-white cursor-default' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isInCart ? t('common.added') : t('common.add')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
