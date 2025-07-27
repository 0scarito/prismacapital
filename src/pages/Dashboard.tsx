import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Gift, Calendar, Euro, QrCode } from 'lucide-react';

interface Coupon {
  id: string;
  title: string;
  description: string;
  value: number;
  code: string;
  status: 'active' | 'used' | 'expired';
  expires_at: string | null;
  created_at: string;
  used_at: string | null;
}

interface Profile {
  display_name: string;
  email: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, email')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch coupons
      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (couponsError) throw couponsError;
      setCoupons((couponsData || []) as Coupon[]);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'used':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'expired':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'used':
        return 'Utilisé';
      case 'expired':
        return 'Expiré';
      default:
        return status;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Cap&Co
            </h1>
            <span className="text-muted-foreground">Espace Personnel</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Bonjour, {profile?.display_name || 'Utilisateur'}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bienvenue, {profile?.display_name || 'Utilisateur'} !
          </h2>
          <p className="text-muted-foreground">
            Gérez vos coupons et découvrez vos avantages exclusifs.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coupons Actifs</CardTitle>
              <Gift className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {coupons.filter(c => c.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coupons Utilisés</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {coupons.filter(c => c.status === 'used').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
              <Euro className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {coupons.reduce((sum, c) => sum + (c.status === 'active' ? c.value : 0), 0).toFixed(2)}€
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coupons Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Mes Coupons
            </CardTitle>
            <CardDescription>
              Voici tous vos coupons disponibles et utilisés.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {coupons.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun coupon</h3>
                <p className="text-muted-foreground">
                  Vous n'avez pas encore de coupons. Revenez bientôt !
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{coupon.title}</h4>
                        {coupon.description && (
                          <p className="text-sm text-muted-foreground">{coupon.description}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(coupon.status)}>
                        {getStatusText(coupon.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-primary">
                          {coupon.value.toFixed(2)}€
                        </span>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {coupon.code}
                        </code>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {coupon.expires_at && (
                          <p>Expire le {new Date(coupon.expires_at).toLocaleDateString()}</p>
                        )}
                        {coupon.used_at && (
                          <p>Utilisé le {new Date(coupon.used_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;