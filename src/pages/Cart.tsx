import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Cart = () => {
  const { items, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCheckout = () => {
    if (!user) {
      // Save intended destination before redirecting to auth
      localStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif font-bold text-4xl text-foreground mb-8">
              {t('cart.title') || 'Shopping Cart'}
            </h1>

            {items.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">
                    {t('cart.empty') || 'Your cart is empty'}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {t('cart.emptyDescription') || 'Add some investments to get started'}
                  </p>
                  <Button onClick={() => navigate('/investments')}>
                    {t('cart.browseInvestments') || 'Browse Investments'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t('cart.items') || 'Cart Items'} ({items.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <span className="text-xs text-muted-foreground">
                            {item.type}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/investments')}
                  >
                    {t('cart.continueShopping') || 'Continue Shopping'}
                  </Button>
                  <Button onClick={handleCheckout} size="lg">
                    {t('cart.proceedToCheckout') || 'Proceed to Checkout'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
