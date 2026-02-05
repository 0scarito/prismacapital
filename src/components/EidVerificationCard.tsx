import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, ShieldAlert, Loader2, CheckCircle } from 'lucide-react';

type EidProvider = 'seBankID' | 'noBankID' | 'dkMitID';

interface EidVerificationCardProps {
  isVerified: boolean;
  onVerificationStart?: () => void;
}

const EidVerificationCard = ({ isVerified, onVerificationStart }: EidVerificationCardProps) => {
  const [eidLoading, setEidLoading] = useState<EidProvider | null>(null);
  const { signInWithEid } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleEidVerification = async (provider: EidProvider) => {
    setEidLoading(provider);
    onVerificationStart?.();
    
    try {
      await signInWithEid(provider);
      // Redirect happens in signInWithEid
    } catch (err) {
      console.error('eID verification error:', err);
      toast({
        title: t('auth.eidError') || 'eID verification failed',
        description: 'Please try again',
        variant: 'destructive',
      });
      setEidLoading(null);
    }
  };

  if (isVerified) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              {t('dashboard.identityVerified') || 'Identity Verified'}
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              {t('dashboard.verified') || 'Verified'}
            </Badge>
          </div>
          <CardDescription>
            {t('dashboard.identityVerifiedDesc') || 'Your identity has been verified. You can now make purchases.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            {t('dashboard.verifyIdentity') || 'Verify Your Identity'}
          </CardTitle>
          <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/30">
            {t('dashboard.required') || 'Required'}
          </Badge>
        </div>
        <CardDescription>
          {t('dashboard.verifyIdentityDesc') || 'You must verify your identity before making any purchases. This is required for regulatory compliance.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground mb-4">
          {t('dashboard.selectEidProvider') || 'Select your eID provider to verify your identity:'}
        </p>
        
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-3"
          disabled={!!eidLoading}
          onClick={() => handleEidVerification('seBankID')}
        >
          {eidLoading === 'seBankID' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-lg">🇸🇪</span>
          )}
          {t('auth.swedishBankId') || 'Swedish BankID'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-3"
          disabled={!!eidLoading}
          onClick={() => handleEidVerification('noBankID')}
        >
          {eidLoading === 'noBankID' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-lg">🇳🇴</span>
          )}
          {t('auth.norwegianBankId') || 'Norwegian BankID'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-3"
          disabled={!!eidLoading}
          onClick={() => handleEidVerification('dkMitID')}
        >
          {eidLoading === 'dkMitID' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-lg">🇩🇰</span>
          )}
          {t('auth.danishMitId') || 'Danish MitID'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EidVerificationCard;
