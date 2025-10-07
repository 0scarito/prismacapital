import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, TrendingUp, Wallet, DollarSign, AlertTriangle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
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

interface Holding {
  id: string;
  investment_name: string;
  amount: number;
  purchase_price: number;
  current_value: number;
  purchase_date: string;
  status: string;
}

interface WalletData {
  id: string;
  balance: number;
}

const PortfolioContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cashOutHolding, setCashOutHolding] = useState<Holding | null>(null);
  const [processingCashOut, setProcessingCashOut] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPortfolioData();
    }
  }, [user]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);

      // Fetch holdings
      const { data: holdingsData, error: holdingsError } = await supabase
        .from('portfolio_holdings')
        .select('*')
        .eq('user_id', user?.id)
        .order('purchase_date', { ascending: false });

      if (holdingsError) throw holdingsError;

      // Simulate price changes for demo (in production, you'd fetch real market data)
      const updatedHoldings = holdingsData?.map(h => ({
        ...h,
        current_value: h.purchase_price * (0.95 + Math.random() * 0.15), // Random 5% variation
      })) || [];

      setHoldings(updatedHoldings);

      // Fetch wallet
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') throw walletError;
      setWallet(walletData);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to load portfolio data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysSincePurchase = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate);
    const now = new Date();
    return Math.floor((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleCashOut = async () => {
    if (!cashOutHolding) return;

    setProcessingCashOut(true);

    try {
      const { data, error } = await supabase.functions.invoke('cash-out', {
        body: { holdingId: cashOutHolding.id },
      });

      if (error) throw error;

      const { cashOutAmount, penalty, penaltyApplied } = data;

      toast({
        title: 'Cash Out Successful',
        description: penaltyApplied
          ? `€${cashOutAmount.toFixed(2)} added to wallet (10% early withdrawal penalty: €${penalty.toFixed(2)})`
          : `€${cashOutAmount.toFixed(2)} added to wallet`,
      });

      setCashOutHolding(null);
      fetchPortfolioData();
    } catch (error) {
      console.error('Error cashing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to process cash out',
        variant: 'destructive',
      });
    } finally {
      setProcessingCashOut(false);
    }
  };

  const handleWithdraw = async () => {
    if (!wallet || wallet.balance <= 0) return;

    toast({
      title: 'Withdrawal Initiated',
      description: `Withdrawing €${wallet.balance.toFixed(2)} to your bank account`,
    });

    // In production, you'd call a withdrawal endpoint here
    // For now, just update the wallet balance to 0
    try {
      const { error } = await supabase
        .from('wallets')
        .update({ balance: 0 })
        .eq('id', wallet.id);

      if (error) throw error;

      await supabase.from('transactions').insert({
        user_id: user?.id,
        type: 'withdrawal',
        amount: -wallet.balance,
        description: 'Withdrawal to bank account',
      });

      setWallet({ ...wallet, balance: 0 });

      toast({
        title: 'Withdrawal Complete',
        description: 'Funds have been transferred to your bank account',
      });
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast({
        title: 'Error',
        description: 'Failed to process withdrawal',
        variant: 'destructive',
      });
    }
  };

  const totalValue = holdings
    .filter(h => h.status === 'active')
    .reduce((sum, h) => sum + h.current_value, 0);

  const totalGain = holdings
    .filter(h => h.status === 'active')
    .reduce((sum, h) => sum + (h.current_value - h.purchase_price), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-20">
          <div className="section-container">
            <div className="text-center">Loading portfolio...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="section-container">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <h1 className="font-serif font-bold text-4xl text-foreground mb-8">
              My Portfolio
            </h1>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{totalValue.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalGain >= 0 ? '+' : ''}€{totalGain.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{(wallet?.balance || 0).toFixed(2)}</div>
                  {wallet && wallet.balance > 0 && (
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={handleWithdraw}
                    >
                      Withdraw to Bank
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Active Holdings */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Active Investments</h2>
              
              {holdings.filter(h => h.status === 'active').length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No active investments yet. Browse our investment opportunities to get started!
                  </CardContent>
                </Card>
              ) : (
                holdings
                  .filter(h => h.status === 'active')
                  .map((holding) => {
                    const daysSincePurchase = calculateDaysSincePurchase(holding.purchase_date);
                    const hasEarlyWithdrawalPenalty = daysSincePurchase < 90;
                    const gain = holding.current_value - holding.purchase_price;
                    const gainPercent = (gain / holding.purchase_price) * 100;

                    return (
                      <Card key={holding.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{holding.investment_name}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                Purchased {daysSincePurchase} days ago
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">
                                €{holding.current_value.toFixed(2)}
                              </div>
                              <div className={`text-sm ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {gain >= 0 ? '+' : ''}€{gain.toFixed(2)} ({gainPercent.toFixed(2)}%)
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              Purchase Price: €{holding.purchase_price.toFixed(2)}
                            </div>
                            <div className="flex gap-2">
                              {hasEarlyWithdrawalPenalty && (
                                <div className="flex items-center text-xs text-amber-600 mr-2">
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  10% penalty ({90 - daysSincePurchase} days left)
                                </div>
                              )}
                              <Button
                                variant="outline"
                                onClick={() => setCashOutHolding(holding)}
                              >
                                Cash Out
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
              )}
            </div>

            {/* Cashed Out Holdings */}
            {holdings.filter(h => h.status === 'cashed_out').length > 0 && (
              <div className="space-y-4 mt-8">
                <h2 className="text-2xl font-bold">Cashed Out Investments</h2>
                {holdings
                  .filter(h => h.status === 'cashed_out')
                  .map((holding) => (
                    <Card key={holding.id} className="opacity-60">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{holding.investment_name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Cashed out
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              €{holding.current_value.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Cash Out Confirmation Dialog */}
      <AlertDialog open={!!cashOutHolding} onOpenChange={() => setCashOutHolding(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Cash Out</AlertDialogTitle>
            <AlertDialogDescription>
              {cashOutHolding && (
                <>
                  <div className="space-y-2 my-4">
                    <p>Investment: <strong>{cashOutHolding.investment_name}</strong></p>
                    <p>Current Value: <strong>€{cashOutHolding.current_value.toFixed(2)}</strong></p>
                    {calculateDaysSincePurchase(cashOutHolding.purchase_date) < 90 && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold text-amber-900">Early Withdrawal Penalty</p>
                            <p className="text-amber-800">
                              You'll receive 90% of the current value (€{(cashOutHolding.current_value * 0.9).toFixed(2)})
                              because it's been less than 90 days since purchase.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p>The funds will be added to your wallet and you can then withdraw them to your bank account with no fees.</p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingCashOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCashOut} disabled={processingCashOut}>
              {processingCashOut ? 'Processing...' : 'Confirm Cash Out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Portfolio = () => (
  <ProtectedRoute>
    <PortfolioContent />
  </ProtectedRoute>
);

export default Portfolio;
