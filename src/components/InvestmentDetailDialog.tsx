import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, TrendingUp, Clock, Shield, Plus, FileText, Users, AlertTriangle, Building, Calendar, Coins } from 'lucide-react';
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background text-foreground">
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
              <Badge variant="outline" className="ml-2 bg-background/50 backdrop-blur text-foreground">
                {investment.sector}
              </Badge>
            </div>
          </div>
          <DialogTitle className="text-2xl text-foreground">{investment.name}</DialogTitle>
          <p className="text-muted-foreground">{investment.category}</p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold text-foreground">{investment.expectedReturn}</div>
                <div className="text-xs text-muted-foreground">Expected Return</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold text-foreground">{investment.horizon}</div>
                <div className="text-xs text-muted-foreground">Investment Horizon</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <Shield className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold text-foreground">€{investment.minInvestment}</div>
                <div className="text-xs text-muted-foreground">Min Investment</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Investment Overview</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {investment.fullDescription}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
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

            {/* Historical Performance */}
            {investment.historicalPerformance && (
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Historical Performance</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-sm font-bold text-green-500">{investment.historicalPerformance.ytd}</div>
                    <div className="text-xs text-muted-foreground">YTD</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-sm font-bold text-green-500">{investment.historicalPerformance.oneYear}</div>
                    <div className="text-xs text-muted-foreground">1 Year</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-sm font-bold text-green-500">{investment.historicalPerformance.threeYear}</div>
                    <div className="text-xs text-muted-foreground">3 Year</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-sm font-bold text-green-500">{investment.historicalPerformance.sinceInception}</div>
                    <div className="text-xs text-muted-foreground">Since Inception</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {investment.isin && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Coins className="w-3 h-3" /> ISIN</div>
                  <div className="text-sm font-medium text-foreground">{investment.isin}</div>
                </div>
              )}
              {investment.legalStructure && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Building className="w-3 h-3" /> Legal Structure</div>
                  <div className="text-sm font-medium text-foreground">{investment.legalStructure}</div>
                </div>
              )}
              {investment.domicile && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Domicile</div>
                  <div className="text-sm font-medium text-foreground">{investment.domicile}</div>
                </div>
              )}
              {investment.currency && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Currency</div>
                  <div className="text-sm font-medium text-foreground">{investment.currency}</div>
                </div>
              )}
              {investment.inceptionDate && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Inception</div>
                  <div className="text-sm font-medium text-foreground">{investment.inceptionDate}</div>
                </div>
              )}
              {investment.totalAum && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Total AUM</div>
                  <div className="text-sm font-medium text-foreground">{investment.totalAum}</div>
                </div>
              )}
              {investment.managementFee && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Management Fee</div>
                  <div className="text-sm font-medium text-foreground">{investment.managementFee}</div>
                </div>
              )}
              {investment.performanceFee && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Performance Fee</div>
                  <div className="text-sm font-medium text-foreground">{investment.performanceFee}</div>
                </div>
              )}
              {investment.liquidity && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Liquidity</div>
                  <div className="text-sm font-medium text-foreground">{investment.liquidity}</div>
                </div>
              )}
              {investment.regulatoryStatus && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Regulatory Status</div>
                  <div className="text-sm font-medium text-foreground">{investment.regulatoryStatus}</div>
                </div>
              )}
            </div>

            {/* Investment Team */}
            {investment.investmentTeam && (
              <div className="space-y-3 mt-6">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Investment Team</h4>
                <div className="grid grid-cols-3 gap-3">
                  {investment.investmentTeam.map((member, idx) => (
                    <div key={idx} className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-foreground">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="risks" className="space-y-4 mt-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h4 className="font-semibold text-foreground">Risk Rating: {investment.riskRating || `${investment.riskLevel} Risk`}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Capital at risk. The value of investments can fall as well as rise and you may get back less than you invested.
              </p>
            </div>

            {investment.keyRisks && (
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Key Risks to Consider</h4>
                <ul className="space-y-2">
                  {investment.keyRisks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            {investment.documents && (
              <div className="space-y-2">
                {investment.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground">{doc.name}</span>
                    </div>
                    <Badge variant="outline">{doc.type}</Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Amount Selection */}
        <div className="space-y-3 mt-6 border-t pt-6">
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
          className="w-full mt-4"
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
