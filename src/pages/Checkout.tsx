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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Package, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { z } from 'zod';

const checkoutSchema = z.object({
  giftRecipient: z.string().email('Invalid email format').max(255, 'Email too long').optional().or(z.literal('')),
  amounts: z.record(z.number().min(100, 'Minimum investment is €100').max(1000000, 'Amount too large')),
});

const CheckoutContent = () => {
  const { items, clearCart } = useCart();
  const { user, isEidVerified } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const [physicalCards, setPhysicalCards] = useState<{ [key: string]: boolean }>({});
  const [giftRecipient, setGiftRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingRecipient, setValidatingRecipient] = useState(false);

  const PHYSICAL_CARD_COST = 15.00;

  const handleAmountChange = (itemId: string, value: number) => {
    setAmounts((prev) => ({ ...prev, [itemId]: value }));
  };

  const handlePhysicalCardToggle = (itemId: string) => {
    setPhysicalCards((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const amount = amounts[item.id] || 0;
      const cardCost = physicalCards[item.id] ? PHYSICAL_CARD_COST : 0;
      return total + amount + cardCost;
    }, 0);
  };

  const validateRecipient = async (email: string): Promise<boolean> => {
    if (!email) return true; // Empty is valid (goes to buyer)
    
    setValidatingRecipient(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-gift-recipient', {
        body: { email }
      });

      if (error) {
        console.error('Error validating recipient:', error);
        toast({
          title: 'Validation Error',
          description: 'Could not validate recipient email',
          variant: 'destructive',
        });
        return false;
      }

      if (!data?.exists) {
        toast({
          title: 'Invalid Recipient',
          description: 'The recipient must have a registered Prisma Capital account',
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch {
      toast({
        title: 'Validation Error',
        description: 'Could not validate recipient email',
        variant: 'destructive',
      });
      return false;
    } finally {
      setValidatingRecipient(false);
    }
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

    const invalidItems = items.filter((item) => !amounts[item.id] || amounts[item.id] < 100);
    if (invalidItems.length > 0) {
      toast({
        title: 'Error',
        description: 'Please select an investment amount (minimum €100) for all items',
        variant: 'destructive',
      });
      return;
    }

    // Validate inputs with zod
    const validation = checkoutSchema.safeParse({ giftRecipient, amounts });
    if (!validation.success) {
      toast({
        title: 'Validation Error',
        description: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    // Validate recipient if provided
    if (giftRecipient && !(await validateRecipient(giftRecipient))) {
      return;
    }

    setLoading(true);

    try {
      const paymentItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        amount: amounts[item.id],
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

            {/* eID Verification Warning */}
            {!isEidVerified && (
              <Alert variant="destructive" className="mb-6">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>{t('checkout.verificationRequired') || 'Identity Verification Required'}</AlertTitle>
                <AlertDescription>
                  {t('checkout.verificationRequiredDesc') || 'You must verify your identity before making purchases. Please go to your dashboard to complete verification.'}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto ml-1 text-destructive-foreground underline"
                    onClick={() => navigate('/dashboard')}
                  >
                    {t('checkout.goToDashboard') || 'Go to Dashboard'}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

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
                        className="bg-white text-black border-2 border-primary focus:border-primary focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recipient must have a registered Prisma Capital account. Leave empty to keep for yourself.
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
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {[100, 250, 500, 1000].map((value) => (
                            <Button
                              key={value}
                              type="button"
                              variant={amounts[item.id] === value ? "default" : "outline"}
                              className={amounts[item.id] === value ? "" : "bg-white text-black border-2 border-primary hover:bg-primary/10"}
                              onClick={() => handleAmountChange(item.id, value)}
                            >
                              €{value}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Select your investment amount (Minimum: €100)
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
                        const amount = amounts[item.id] || 0;
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
                      disabled={loading || validatingRecipient || calculateTotal() === 0 || !isEidVerified}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {loading || validatingRecipient ? (t('checkout.processing') || 'Processing...') : (t('checkout.completePurchase') || 'Complete Purchase')}
                    </Button>
                    {!isEidVerified && (
                      <p className="text-xs text-destructive text-center mt-2">
                        {t('checkout.verifyFirst') || 'Please verify your identity first'}
                      </p>
                    )}
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
