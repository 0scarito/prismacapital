import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, ShieldAlert, Loader2, CheckCircle, UserCheck } from 'lucide-react';

interface EidVerificationCardProps {
  isVerified: boolean;
  onVerificationStart?: () => void;
}

const EidVerificationCard = ({ isVerified, onVerificationStart }: EidVerificationCardProps) => {
  const [loading, setLoading] = useState(false);
  const { verifyIdentity } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleVerification = async () => {
    setLoading(true);
    onVerificationStart?.();
    
    try {
      await verifyIdentity();
      // Redirect happens in verifyIdentity
    } catch (err) {
      console.error('Identity verification error:', err);
      toast({
        title: t('auth.eidError') || 'Verification failed',
        description: 'Please try again',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="border-green-500/30 bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              {t('dashboard.identityVerified') || 'Identity Verified'}
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              {t('dashboard.verified') || 'Verified'}
            </Badge>
          </div>
          <CardDescription className="text-card-foreground/70">
            {t('dashboard.identityVerifiedDesc') || 'Your identity has been verified. You can now make purchases.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-amber-500/30 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            {t('dashboard.verifyIdentity') || 'Verify Your Identity'}
          </CardTitle>
          <Badge variant="outline" className="bg-amber-500/20 text-amber-600 border-amber-500/30">
            {t('dashboard.required') || 'Required'}
          </Badge>
        </div>
        <CardDescription className="text-card-foreground/70">
          {t('dashboard.verifyIdentityDesc') || 'You must verify your identity before making any purchases. This is required for regulatory compliance.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-card-foreground/70 mb-4">
          {t('dashboard.kycDescription') || 'Complete a quick identity verification to comply with financial regulations.'}
        </p>
        
        <Button
          type="button"
          className="w-full gap-2"
          disabled={loading}
          onClick={handleVerification}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
          {loading 
            ? (t('dashboard.verifying') || 'Verifying...') 
            : (t('dashboard.startVerification') || 'Start Identity Verification')
          }
        </Button>
      </CardContent>
    </Card>
  );
};

export default EidVerificationCard;
