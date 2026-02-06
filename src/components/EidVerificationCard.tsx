import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, ShieldAlert, Loader2, CheckCircle, UserCheck, Fingerprint, ScanFace } from 'lucide-react';
import VoveidVerification from '@/components/VoveidVerification';

interface EidVerificationCardProps {
  isVerified: boolean;
  onVerificationStart?: () => void;
}

type VerificationProvider = 'onfido' | 'voveid';

const EidVerificationCard = ({ isVerified, onVerificationStart }: EidVerificationCardProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<VerificationProvider>('voveid');
  const [showVoveidDialog, setShowVoveidDialog] = useState(false);
  const { verifyIdentity, refreshEidStatus } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleOnfidoVerification = async () => {
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

  const handleVoveidVerification = () => {
    onVerificationStart?.();
    setShowVoveidDialog(true);
  };

  const handleVerification = () => {
    if (selectedProvider === 'onfido') {
      handleOnfidoVerification();
    } else {
      handleVoveidVerification();
    }
  };

  const handleVoveidComplete = async () => {
    setShowVoveidDialog(false);
    await refreshEidStatus();
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
    <>
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
        <CardContent className="space-y-4">
          <p className="text-sm text-card-foreground/70">
            {t('dashboard.kycDescription') || 'Complete a quick identity verification to comply with financial regulations.'}
          </p>
          
          {/* Provider Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-card-foreground">
              {t('auth.selectProvider') || 'Select verification method'}
            </Label>
            <RadioGroup 
              value={selectedProvider} 
              onValueChange={(value) => setSelectedProvider(value as VerificationProvider)}
              className="grid gap-3"
            >
              {/* VoveID Option */}
              <div className="relative">
                <RadioGroupItem 
                  value="voveid" 
                  id="provider-voveid" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="provider-voveid" 
                  className="flex items-center gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                >
                  <ScanFace className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {t('auth.providerVoveid') || 'VoveID'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('auth.providerVoveidDesc') || '3D liveness check & document verification'}
                    </p>
                  </div>
                  {selectedProvider === 'voveid' && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </Label>
              </div>
              
              {/* Onfido Option */}
              <div className="relative">
                <RadioGroupItem 
                  value="onfido" 
                  id="provider-onfido" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="provider-onfido" 
                  className="flex items-center gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                >
                  <Fingerprint className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {t('auth.providerOnfido') || 'Onfido (via Scrive)'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('auth.providerOnfidoDesc') || 'Document & biometric verification'}
                    </p>
                  </div>
                  {selectedProvider === 'onfido' && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
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

      {/* VoveID Dialog */}
      <VoveidVerification 
        isOpen={showVoveidDialog}
        onClose={() => setShowVoveidDialog(false)}
        onVerificationComplete={handleVoveidComplete}
      />
    </>
  );
};

export default EidVerificationCard;
