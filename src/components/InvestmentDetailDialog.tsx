import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, TrendingUp, Clock, Shield, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { Investment } from '@/data/investments';

interface InvestmentDetailDialogProps {
  investment: Investment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INVESTMENT_AMOUNTS = [100, 250, 500, 1000];

const InvestmentDetailDialog = ({ investment, open, onOpenChange }: InvestmentDetailDialogProps) => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const { addItem, items } = useCart();
  
  if (!investment) return null;

  const isInCart = items.some(item => item.id === investment.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      addItem({
        id: investment.id,
        name: investment.name,
        description: investment.shortDescription,
        type: investment.category,
        image: investment.image,
      });
    }
    onOpenChange(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'High': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
            <img
              src={investment.image}
              alt={investment.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className={`${getRiskColor(investment.riskLevel)} mb-2`}>
                {investment.riskLevel} Risk
              </Badge>
              <Badge variant="outline" className="ml-2 bg-background/50 backdrop-blur">
                {investment.sector}
              </Badge>
            </div>
          </div>
          <DialogTitle className="text-2xl">{investment.name}</DialogTitle>
          <p className="text-muted-foreground">{investment.category}</p>
        </DialogHeader>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold text-foreground">{investment.expectedReturn}</div>
            <div className="text-xs text-muted-foreground">Expected Return</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold text-foreground">{investment.horizon}</div>
            <div className="text-xs text-muted-foreground">Investment Horizon</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <Shield className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold text-foreground">€{investment.minInvestment}</div>
            <div className="text-xs text-muted-foreground">Min Investment</div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Investment Overview</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {investment.fullDescription}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mt-6">
          <h4 className="font-semibold text-foreground">Key Features</h4>
          <ul className="space-y-2">
            {investment.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Amount Selection */}
        <div className="space-y-3 mt-6">
          <h4 className="font-semibold text-foreground">Select Investment Amount</h4>
          <div className="grid grid-cols-4 gap-2">
            {INVESTMENT_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? 'default' : 'outline'}
                onClick={() => setSelectedAmount(amount)}
                className="font-semibold"
              >
                €{amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart}
          disabled={isInCart}
          className="w-full mt-6"
          size="lg"
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added to Portfolio
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add to Portfolio - €{selectedAmount}
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentDetailDialog;
