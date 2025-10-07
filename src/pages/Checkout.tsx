import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const CheckoutContent = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
  const [physicalCards, setPhysicalCards] = useState<{ [key: string]: boolean }>({});
  const [giftRecipient, setGiftRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  const PHYSICAL_CARD_COST = 15.00;

  const handleAmountChange = (itemId: string, value: string) => {
    setAmounts((prev) => ({ ...prev, [itemId]: value }));
  };

  const handlePhysicalCardToggle = (itemId: string) => {
    setPhysicalCards((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const amount = parseFloat(amounts[item.id] || '0');
      const cardCost = physicalCards[item.id] ? PHYSICAL_CARD_COST : 0;
      return total + amount + cardCost;
    }, 0);
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to make a purchase',
        variant: 'destructive',
      });
      return;
    }

    const invalidItems = items.filter((item) => !amounts[item.id] || parseFloat(amounts[item.id]) <= 0);
    if (invalidItems.length > 0) {
      toast({
        title: 'Error',
        description: 'Please enter valid amounts for all items',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const paymentItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        amount: parseFloat(amounts[item.id]),
        hasPhysicalCard: physicalCards[item.id] || false,
      }));

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items: paymentItems,
          giftRecipient: giftRecipient || null,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        
        toast({
          title: 'Payment initiated',
          description: 'Complete your payment in the new window',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif font-bold text-4xl text-foreground mb-8">
              {t('checkout.title') || 'Checkout'}
            </h1>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Gift Option */}
                <Card>
                  <CardHeader>
                    <CardTitle>Gift This Investment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="gift-recipient">Recipient Email (Optional)</Label>
                      <Input
                        id="gift-recipient"
                        type="email"
                        placeholder="friend@example.com"
                        value={giftRecipient}
                        onChange={(e) => setGiftRecipient(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave empty to keep the investment for yourself
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`amount-${item.id}`}>
                          {t('checkout.investmentAmount') || 'Investment Amount (€)'}
                        </Label>
                        <Input
                          id={`amount-${item.id}`}
                          type="number"
                          min="100"
                          step="100"
                          placeholder="1000"
                          value={amounts[item.id] || ''}
                          onChange={(e) => handleAmountChange(item.id, e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('checkout.minimumAmount') || 'Minimum: €100'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {t('checkout.physicalCard') || 'Physical NFC Card'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              +€{PHYSICAL_CARD_COST.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={physicalCards[item.id] || false}
                          onCheckedChange={() => handlePhysicalCardToggle(item.id)}
                        />
                      </div>

                      <div className="bg-accent/50 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">
                          {t('checkout.includes') || 'What\'s included:'}
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• {t('checkout.feature1') || 'Digital investment certificate'}</li>
                          <li>• {t('checkout.feature2') || 'Real-time portfolio tracking'}</li>
                          <li>• {t('checkout.feature3') || 'Gift transfer capability'}</li>
                          {physicalCards[item.id] && (
                            <li>• {t('checkout.feature4') || 'Physical NFC card with your investment'}</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>{t('checkout.orderSummary') || 'Order Summary'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {items.map((item) => {
                        const amount = parseFloat(amounts[item.id] || '0');
                        const cardCost = physicalCards[item.id] ? PHYSICAL_CARD_COST : 0;
                        return (
                          <div key={item.id} className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{item.name}</span>
                              <span>€{amount.toFixed(2)}</span>
                            </div>
                            {physicalCards[item.id] && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Physical Card</span>
                                <span>€{cardCost.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>{t('checkout.total') || 'Total'}</span>
                        <span>€{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePurchase}
                      disabled={loading || calculateTotal() === 0}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {loading ? (t('checkout.processing') || 'Processing...') : (t('checkout.completePurchase') || 'Complete Purchase')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Checkout = () => (
  <ProtectedRoute>
    <CheckoutContent />
  </ProtectedRoute>
);

export default Checkout;
