import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Package, TrendingUp, Users, Euro, Loader2, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import prismaLogo from '@/assets/prisma-logo.png';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PartnerOrganization {
  id: string;
  name: string;
  type: string;
  status: string;
  contact_email: string;
  contact_person: string | null;
}

interface Mandate {
  id: string;
  coupon_count: number;
  total_value: number;
  status: string;
  pricing_tier: string;
  created_at: string;
  expires_at: string | null;
  product_mix: any;
}

interface CouponStats {
  total: number;
  in_stock: number;
  distributed: number;
  redeemed: number;
  total_value: number;
  redeemed_value: number;
}

const PartnerDashboard = () => {
  const { user, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const [organization, setOrganization] = useState<PartnerOrganization | null>(null);
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [couponStats, setCouponStats] = useState<CouponStats>({
    total: 0,
    in_stock: 0,
    distributed: 0,
    redeemed: 0,
    total_value: 0,
    redeemed_value: 0
  });
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
      fetchPartnerData();
    }
  }, [user]);

  const fetchPartnerData = async () => {
    try {
      console.log('[PartnerDashboard] Fetching partner data for user:', user?.id);
      
      // Get user's partner_id from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('partner_id, is_partner_user, display_name')
        .eq('id', user?.id)
        .maybeSingle();

      console.log('[PartnerDashboard] Profile fetched:', profile, 'Error:', profileError);

      if (profileError) throw profileError;

      // If no partner setup exists yet, create one
      if (!profile?.is_partner_user || !profile?.partner_id) {
        console.log('[PartnerDashboard] No partner setup, creating organization');
        
        // Create partner organization for this user
        const { data: newOrg, error: orgCreateError } = await supabase
          .from('partner_organizations')
          .insert({
            name: profile?.display_name || user?.email?.split('@')[0] || 'Partner Organization',
            type: 'wealth_manager',
            contact_email: user?.email || '',
            status: 'active'
          })
          .select()
          .single();

        console.log('[PartnerDashboard] Organization created:', newOrg, 'Error:', orgCreateError);

        if (orgCreateError) {
          toast({
            title: "Setup Error",
            description: "Failed to create partner organization. Please contact support.",
            variant: 'destructive'
          });
          navigate('/dashboard');
          return;
        }

        // Update profile with partner_id
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            partner_id: newOrg.id,
            is_partner_user: true
          })
          .eq('id', user?.id);

        console.log('[PartnerDashboard] Profile updated, error:', profileUpdateError);

        if (profileUpdateError) throw profileUpdateError;

        setOrganization(newOrg);
        setMandates([]);
        setCouponStats({
          total: 0,
          in_stock: 0,
          distributed: 0,
          redeemed: 0,
          total_value: 0,
          redeemed_value: 0
        });
        setLoadingData(false);
        return;
      }

      console.log('[PartnerDashboard] Partner setup exists, fetching organization');
      
      // Fetch organization details
      const { data: orgData, error: orgError } = await supabase
        .from('partner_organizations')
        .select('*')
        .eq('id', profile.partner_id)
        .maybeSingle();

      console.log('[PartnerDashboard] Organization data:', orgData, 'Error:', orgError);

      if (orgError) throw orgError;
      
      if (!orgData) {
        toast({
          title: "Organization Not Found",
          description: "Your partner organization was not found. Please contact support.",
          variant: 'destructive'
        });
        navigate('/dashboard');
        return;
      }
      
      setOrganization(orgData);

      // Fetch mandates
      const { data: mandatesData, error: mandatesError } = await supabase
        .from('partner_mandates')
        .select('*')
        .eq('partner_id', profile.partner_id)
        .order('created_at', { ascending: false });

      if (mandatesError) throw mandatesError;
      setMandates(mandatesData || []);

      // Fetch and aggregate coupon statistics
      const { data: couponsData, error: couponsError } = await supabase
        .from('partner_coupons')
        .select('status, face_value')
        .eq('partner_id', profile.partner_id);

      if (couponsError) throw couponsError;

      const stats = (couponsData || []).reduce((acc, coupon) => {
        acc.total++;
        acc.total_value += Number(coupon.face_value);
        
        if (coupon.status === 'in_stock') acc.in_stock++;
        if (coupon.status === 'distributed') acc.distributed++;
        if (coupon.status === 'redeemed') {
          acc.redeemed++;
          acc.redeemed_value += Number(coupon.face_value);
        }
        
        return acc;
      }, {
        total: 0,
        in_stock: 0,
        distributed: 0,
        redeemed: 0,
        total_value: 0,
        redeemed_value: 0
      });

      setCouponStats(stats);
    } catch (error) {
      console.error('Error fetching partner data:', error);
      toast({
        title: "Error",
        description: "Failed to load partner data",
        variant: 'destructive'
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      prospect: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };
    return variants[status] || 'bg-primary/10 text-primary border-primary/20';
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading partner dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !organization) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src={prismaLogo} 
              alt="Prisma Capital Logo" 
              className="h-14 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-3">
                <span className="text-slate-50 font-semibold">Partner Dashboard</span>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  Professional Account
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{organization.name}</p>
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
        {/* Organization Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Building2 className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle className="text-2xl">{organization.name}</CardTitle>
                  <CardDescription>
                    {organization.type} • {organization.contact_email}
                  </CardDescription>
                </div>
              </div>
              <Badge className={getStatusBadge(organization.status)}>
                {organization.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{couponStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                €{couponStats.total_value.toFixed(2)} total value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{couponStats.in_stock}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Available to distribute
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distributed</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{couponStats.distributed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Sent to clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redeemed</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{couponStats.redeemed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                €{couponStats.redeemed_value.toFixed(2)} activated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mandates Section */}
        <Tabs defaultValue="mandates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mandates">Mandates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="mandates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Mandates</CardTitle>
                <CardDescription>
                  Overview of all coupon mandates purchased
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mandates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No mandates found. Contact Prisma Capital to set up your first mandate.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Coupon Count</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Pricing Tier</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Expires</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mandates.map((mandate) => (
                        <TableRow key={mandate.id}>
                          <TableCell>
                            <Badge className={getStatusBadge(mandate.status)}>
                              {mandate.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {mandate.coupon_count}
                          </TableCell>
                          <TableCell>€{mandate.total_value.toFixed(2)}</TableCell>
                          <TableCell className="capitalize">{mandate.pricing_tier}</TableCell>
                          <TableCell>
                            {new Date(mandate.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {mandate.expires_at 
                              ? new Date(mandate.expires_at).toLocaleDateString()
                              : 'No expiry'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Redemption Rate</CardTitle>
                  <CardDescription>
                    Percentage of coupons redeemed by clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {couponStats.total > 0 
                      ? ((couponStats.redeemed / couponStats.total) * 100).toFixed(1)
                      : 0
                    }%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {couponStats.redeemed} out of {couponStats.total} coupons redeemed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribution Rate</CardTitle>
                  <CardDescription>
                    Percentage of coupons distributed to clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {couponStats.total > 0 
                      ? (((couponStats.distributed + couponStats.redeemed) / couponStats.total) * 100).toFixed(1)
                      : 0
                    }%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {couponStats.distributed + couponStats.redeemed} out of {couponStats.total} coupons distributed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Mandates</CardTitle>
                  <CardDescription>
                    Currently active mandate agreements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {mandates.filter(m => m.status === 'active').length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Out of {mandates.length} total mandates
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Investment Value</CardTitle>
                  <CardDescription>
                    Total value across all mandates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    €{mandates.reduce((sum, m) => sum + Number(m.total_value), 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    €{couponStats.redeemed_value.toFixed(2)} activated by clients
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PartnerDashboard;
