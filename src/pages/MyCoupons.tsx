import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Holding {
  id: string;
  investment_name: string;
  investment_id: string;
  amount: number;
  purchase_price: number;
  current_value: number;
  purchase_date: string;
  status: 'active' | 'cashed_out';
  units: number;
}

interface MarketPrice {
  investment_id: string;
  current_price: number;
  currency: string;
}

interface WalletData {
  balance: number;
}

const MyCouponsContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [marketPrices, setMarketPrices] = useState<Map<string, MarketPrice>>(new Map());
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cashingOut, setCashingOut] = useState<string | null>(null);
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch holdings
      const { data: holdingsData, error: holdingsError } = await supabase
        .from('portfolio_holdings')
        .select('*')
        .eq('user_id', user?.id)
        .order('purchase_date', { ascending: false });

      if (holdingsError) throw holdingsError;

      // Fetch market prices
      const { data: pricesData, error: pricesError } = await supabase
        .from('market_prices')
        .select('*');

      if (pricesError) throw pricesError;

      // Create price map
      const priceMap = new Map<string, MarketPrice>();
      pricesData?.forEach((price) => {
        priceMap.set(price.investment_id, {
          investment_id: price.investment_id,
          current_price: parseFloat(price.current_price.toString()),
          currency: price.currency,
        });
      });

      // Calculate units and current values
      const enrichedHoldings = (holdingsData || []).map((holding) => {
        const marketPrice = priceMap.get(holding.investment_id);
        const units = parseFloat(holding.amount.toString()); // €1 = 1 unit
        const currentValue = marketPrice
          ? units * marketPrice.current_price
          : parseFloat(holding.amount.toString());

        return {
          ...holding,
          amount: parseFloat(holding.amount.toString()),
          purchase_price: parseFloat(holding.purchase_price.toString()),
          units,
          current_value: currentValue,
          status: holding.status as 'active' | 'cashed_out',
        };
      });

      setHoldings(enrichedHoldings);
      setMarketPrices(priceMap);

      // Fetch wallet
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user?.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') throw walletError;
      setWallet(walletData ? { balance: parseFloat(walletData.balance.toString()) } : { balance: 0 });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your coupons',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateGainLoss = (holding: Holding) => {
    const gain = holding.current_value - holding.amount;
    const percentage = (gain / holding.amount) * 100;
    return { gain, percentage };
  };

  const handleCashOut = async () => {
    if (!selectedHolding) return;

    setCashingOut(selectedHolding.id);
    try {
      const { data, error } = await supabase.functions.invoke('cash-out', {
        body: { holdingId: selectedHolding.id },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Cashed out €${data.cashedOutAmount.toFixed(2)}${data.penalty > 0 ? ` (€${data.penalty.toFixed(2)} early withdrawal penalty applied)` : ''}`,
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cash out investment',
        variant: 'destructive',
      });
    } finally {
      setCashingOut(null);
      setSelectedHolding(null);
    }
  };

  const calculateDaysSincePurchase = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - purchase.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeHoldings = holdings.filter((h) => h.status === 'active');
  const cashedOutHoldings = holdings.filter((h) => h.status === 'cashed_out');
  const totalValue = activeHoldings.reduce((sum, h) => sum + h.current_value, 0);
  const totalGain = activeHoldings.reduce((sum, h) => sum + calculateGainLoss(h).gain, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="section-container">
          <h1 className="font-serif font-bold text-4xl text-foreground mb-8">
            {t('portfolio.myCoupons') || 'My Coupons'}
          </h1>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{totalValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {activeHoldings.length} active coupon{activeHoldings.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
                {totalGain >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalGain >= 0 ? '+' : ''}€{totalGain.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((totalGain / (totalValue - totalGain)) * 100).toFixed(2)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{wallet?.balance.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Available to withdraw</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Coupons */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Active Coupons</h2>
            {activeHoldings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No active coupons. Start investing today!
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {activeHoldings.map((holding) => {
                  const { gain, percentage } = calculateGainLoss(holding);
                  const daysSincePurchase = calculateDaysSincePurchase(holding.purchase_date);
                  const earlyWithdrawal = daysSincePurchase < 90;
                  const marketPrice = marketPrices.get(holding.investment_id);

                  return (
                    <Card key={holding.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{holding.investment_name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              <Calendar className="inline w-3 h-3 mr-1" />
                              Purchased: {new Date(holding.purchase_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={gain >= 0 ? 'default' : 'destructive'}>
                            {gain >= 0 ? '+' : ''}{percentage.toFixed(2)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Units</p>
                            <p className="text-lg font-semibold">{holding.units.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Purchase Price</p>
                            <p className="text-lg font-semibold">€{holding.purchase_price.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Current Price</p>
                            <p className="text-lg font-semibold">
                              €{marketPrice?.current_price.toFixed(2) || holding.purchase_price.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Current Value</p>
                            <p className="text-lg font-semibold">€{holding.current_value.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className={`text-sm font-medium ${gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            Profit/Loss: {gain >= 0 ? '+' : ''}€{gain.toFixed(2)}
                          </div>
                          <Button
                            onClick={() => setSelectedHolding(holding)}
                            disabled={cashingOut === holding.id}
                            variant={earlyWithdrawal ? 'outline' : 'default'}
                          >
                            {cashingOut === holding.id ? 'Processing...' : 'Cash Out'}
                          </Button>
                        </div>

                        {earlyWithdrawal && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                            ⚠️ Early withdrawal penalty (10%) applies for cashing out before {90 - daysSincePurchase} days
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cashed Out Coupons */}
          {cashedOutHoldings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Used Coupons</h2>
              <div className="grid gap-4">
                {cashedOutHoldings.map((holding) => (
                  <Card key={holding.id} className="opacity-60">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{holding.investment_name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Purchased: {new Date(holding.purchase_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">Cashed Out</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Investment</p>
                          <p className="text-lg font-semibold">€{holding.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Cash Out Value</p>
                          <p className="text-lg font-semibold">€{holding.current_value.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Profit</p>
                          <p className="text-lg font-semibold">
                            €{(holding.current_value - holding.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <AlertDialog open={!!selectedHolding} onOpenChange={() => setSelectedHolding(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Cash Out</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedHolding && (
                <>
                  <p className="mb-2">
                    You are about to cash out your investment in <strong>{selectedHolding.investment_name}</strong>.
                  </p>
                  <p className="mb-2">
                    Current value: <strong>€{selectedHolding.current_value.toFixed(2)}</strong>
                  </p>
                  {calculateDaysSincePurchase(selectedHolding.purchase_date) < 90 && (
                    <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                      ⚠️ A 10% early withdrawal penalty will be applied.
                    </p>
                  )}
                  <p className="mt-2 text-sm">
                    The funds will be added to your wallet balance.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCashOut}>
              Confirm Cash Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const MyCoupons = () => (
  <ProtectedRoute>
    <MyCouponsContent />
  </ProtectedRoute>
);

export default MyCoupons;
