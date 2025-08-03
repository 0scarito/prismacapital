import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Gift, Calendar, Euro, QrCode, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
interface Investment {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
  historicalData: {
    date: string;
    price: number;
  }[];
}
interface Profile {
  display_name: string;
  email: string;
}
const Dashboard = () => {
  const {
    user,
    signOut,
    loading
  } = useAuth();
  const { t, language } = useLanguage();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchInvestmentData();
    }
  }, [user]);
  const fetchUserData = async () => {
    try {
      // Fetch profile
      const {
        data: profileData,
        error: profileError
      } = await supabase.from('profiles').select('display_name, email').eq('user_id', user?.id).single();
      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch coupons
      const {
        data: couponsData,
        error: couponsError
      } = await supabase.from('coupons').select('*').eq('user_id', user?.id).order('created_at', {
        ascending: false
      });
        if (couponsError) throw couponsError;
        setCoupons((couponsData || []) as Coupon[]);
      } catch {
        toast({
          title: t('dashboard.errorTitle'),
          description: t('dashboard.errorDescription'),
          variant: 'destructive'
        });
      } finally {
        setLoadingData(false);
      }
    };
  const fetchInvestmentData = async () => {
    // Simulation de données d'investissement (en réalité, on récupérerait ça d'une API)
    const mockInvestments: Investment[] = [{
      id: '1',
      name: 'Or',
      symbol: 'GOLD',
      currentPrice: 1987.50,
      change24h: 12.50,
      changePercent24h: 0.63,
      historicalData: [{
        date: '2024-01-01',
        price: 1950
      }, {
        date: '2024-01-02',
        price: 1965
      }, {
        date: '2024-01-03',
        price: 1955
      }, {
        date: '2024-01-04',
        price: 1970
      }, {
        date: '2024-01-05',
        price: 1975
      }, {
        date: '2024-01-06',
        price: 1980
      }, {
        date: '2024-01-07',
        price: 1987.50
      }]
    }, {
      id: '2',
      name: 'S&P 500 ETF',
      symbol: 'SPY',
      currentPrice: 485.23,
      change24h: -2.15,
      changePercent24h: -0.44,
      historicalData: [{
        date: '2024-01-01',
        price: 480
      }, {
        date: '2024-01-02',
        price: 482
      }, {
        date: '2024-01-03',
        price: 478
      }, {
        date: '2024-01-04',
        price: 487
      }, {
        date: '2024-01-05',
        price: 490
      }, {
        date: '2024-01-06',
        price: 487.38
      }, {
        date: '2024-01-07',
        price: 485.23
      }]
    }, {
      id: '3',
      name: 'Bitcoin ETF',
      symbol: 'BTCETF',
      currentPrice: 42850.00,
      change24h: 1250.00,
      changePercent24h: 3.01,
      historicalData: [{
        date: '2024-01-01',
        price: 41000
      }, {
        date: '2024-01-02',
        price: 41500
      }, {
        date: '2024-01-03',
        price: 40800
      }, {
        date: '2024-01-04',
        price: 41800
      }, {
        date: '2024-01-05',
        price: 41600
      }, {
        date: '2024-01-06',
        price: 42200
      }, {
        date: '2024-01-07',
        price: 42850
      }]
    }];
    setInvestments(mockInvestments);
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const handleGoHome = () => {
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
        return t('dashboard.status.active');
      case 'used':
        return t('dashboard.status.used');
      case 'expired':
        return t('dashboard.status.expired');
      default:
        return status;
    }
  };
  if (loading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('dashboard.loading')}</p>
        </div>
      </div>;
  }
  if (!user) {
    return null;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-slate-50">
              Prisma Capital
            </h1>
            <span className="text-slate-50">{t('dashboard.personalSpace')}</span>
          </div>
          <div className="flex items-center space-x-4">
            
            <Button variant="outline" size="sm" onClick={handleGoHome}>
              {t('nav.home')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('dashboard.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {t('dashboard.welcome')}, {profile?.display_name || t('dashboard.user')} !
          </h2>
          <p className="text-slate-50">
            {t('dashboard.manageCoupons')}
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="coupons">{t('dashboard.tabs.coupons')}</TabsTrigger>
            <TabsTrigger value="investments">{t('dashboard.tabs.investments')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('dashboard.stats.activeCoupons')}</CardTitle>
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
                  <CardTitle className="text-sm font-medium">{t('dashboard.stats.usedCoupons')}</CardTitle>
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
                  <CardTitle className="text-sm font-medium">{t('dashboard.stats.totalValue')}</CardTitle>
                  <Euro className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {coupons.reduce((sum, c) => sum + (c.status === 'active' ? c.value : 0), 0).toFixed(2)}€
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            {/* Coupons Section */}
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  {t('dashboard.coupons.title')}
                </CardTitle>
                <CardDescription>
                  {t('dashboard.coupons.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {coupons.length === 0 ? <div className="text-center py-8">
                    <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('dashboard.coupons.none')}</h3>
                    <p className="text-muted-foreground">
                      {t('dashboard.coupons.empty')}
                    </p>
                  </div> : <div className="space-y-4">
                    {coupons.map(coupon => <div key={coupon.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{coupon.title}</h4>
                            {coupon.description && <p className="text-sm text-muted-foreground">{coupon.description}</p>}
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
                            {coupon.expires_at && <p>{t('dashboard.coupon.expires')} {new Date(coupon.expires_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>}
                            {coupon.used_at && <p>{t('dashboard.coupon.used')} {new Date(coupon.used_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>}
                          </div>
                        </div>
                      </div>)}
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments" className="space-y-6">
            {/* Investments Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {investments.map(investment => <Card key={investment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{investment.name}</CardTitle>
                        <CardDescription>{investment.symbol}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {investment.symbol === 'GOLD' ? `${investment.currentPrice}$` : investment.symbol === 'BTCETF' ? `${investment.currentPrice.toLocaleString()}$` : `${investment.currentPrice}$`}
                        </div>
                        <div className={`flex items-center text-sm ${investment.changePercent24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {investment.changePercent24h >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                          {investment.changePercent24h >= 0 ? '+' : ''}{investment.changePercent24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={investment.historicalData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="date" tick={{
                        fontSize: 12
                      }} tickFormatter={value => new Date(value).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                        month: 'short',
                        day: 'numeric'
                      })} />
                          <YAxis tick={{
                        fontSize: 12
                      }} domain={['dataMin - 10', 'dataMax + 10']} />
                          <Tooltip formatter={(value: number) => [investment.symbol === 'GOLD' ? `${value}$` : investment.symbol === 'BTCETF' ? `${value.toLocaleString()}$` : `${value}$`, t('dashboard.price')]} labelFormatter={label => new Date(label).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')} />
                          <Line type="monotone" dataKey="price" stroke={investment.changePercent24h >= 0 ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} activeDot={{
                        r: 4
                      }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default Dashboard;