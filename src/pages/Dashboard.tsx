import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Gift, Calendar, Euro, QrCode, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import prismaLogo from '@/assets/prisma-logo.png';
import { getCouponStatusVariant } from '@/lib/badgeStyles';

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
}
const Dashboard = () => {
  const {
    user,
    signOut,
    loading
  } = useAuth();
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
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
      checkUserRole();
    }
  }, [user]);

  const checkUserRole = async () => {
    try {
      const { data: role, error } = await supabase.rpc('get_user_role', {
        _user_id: user?.id
      });

      if (!error && role === 'wealth_manager') {
        navigate('/partner-dashboard');
        return;
      }

      fetchUserData();
      fetchInvestmentData();
    } catch (error) {
      console.error('Error checking user role:', error);
      fetchUserData();
      fetchInvestmentData();
    }
  };

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');

    if (paymentStatus === 'success' && sessionId && user) {
      handlePaymentSuccess();
    }
  }, [searchParams, user]);

  const handlePaymentSuccess = async () => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setSearchParams({});
      return;
    }

    setProcessingPayment(true);
    
    try {
      // Call verify-payment to ensure purchase and coupon are created
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Error",
          description: "Failed to verify payment. Please contact support.",
          variant: "destructive",
        });
      } else if (data?.success) {
        toast({
          title: t('dashboard.paymentSuccess') || "Payment successful!",
          description: t('dashboard.paymentSuccessDesc') || "Your investment has been added to your portfolio.",
        });
      } else {
        console.log('Payment not yet complete:', data);
        toast({
          title: "Payment pending",
          description: "Your payment is being processed. Please wait.",
        });
      }
    } catch (err) {
      console.error('Error calling verify-payment:', err);
      toast({
        title: "Error",
        description: "Failed to verify payment. Please contact support.",
        variant: "destructive",
      });
    }

    // Clear payment params from URL
    setSearchParams({});
    setProcessingPayment(false);
    
    // Refresh data
    await fetchUserData();
  };
  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user?.id)
        .maybeSingle();
        
      if (profileError) throw profileError;
      setProfile(profileData || { display_name: user?.email?.split('@')[0] || 'User' });

      // Fetch coupons
      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
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
    const generateHistoricalData = (basePrice: number, volatility: number, days: number = 7) => {
      const data = [];
      let price = basePrice;
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        price = price * (1 + (Math.random() - 0.5) * volatility);
        data.push({
          date: date.toISOString().split('T')[0],
          price: Number(price.toFixed(2))
        });
      }
      
      return { data, finalPrice: data[data.length - 1].price, change: data[data.length - 1].price - basePrice };
    };

    const goldData = generateHistoricalData(1975, 0.01);
    const spyData = generateHistoricalData(483, 0.008);
    const btcData = generateHistoricalData(41600, 0.025);

    const mockInvestments: Investment[] = [
      {
        id: '1',
        name: 'Or',
        symbol: 'GOLD',
        currentPrice: goldData.finalPrice,
        change24h: goldData.change,
        changePercent24h: (goldData.change / 1975) * 100,
        historicalData: goldData.data
      },
      {
        id: '2',
        name: 'S&P 500 ETF',
        symbol: 'SPY',
        currentPrice: spyData.finalPrice,
        change24h: spyData.change,
        changePercent24h: (spyData.change / 483) * 100,
        historicalData: spyData.data
      },
      {
        id: '3',
        name: 'Bitcoin ETF',
        symbol: 'BTCETF',
        currentPrice: btcData.finalPrice,
        change24h: btcData.change,
        changePercent24h: (btcData.change / 41600) * 100,
        historicalData: btcData.data
      }
    ];

    setInvestments(mockInvestments);
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const handleGoHome = () => {
    navigate('/');
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
  if (loading || loadingData || processingPayment) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {processingPayment ? (t('dashboard.processingPayment') || "Processing your payment...") : t('dashboard.loading')}
          </p>
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
            <img 
              src={prismaLogo} 
              alt="Prisma Capital Logo" 
              className="h-14 w-auto object-contain"
            />
            <div className="flex items-center gap-3">
              <span className="text-slate-50">{t('dashboard.personalSpace')}</span>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                Client Account
              </Badge>
            </div>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
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

          <TabsContent value="trends" className="space-y-6">
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