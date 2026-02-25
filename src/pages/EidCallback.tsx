import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import prismaLogo from '@/assets/prisma-logo-blue.png';

type CallbackStatus = 'verifying' | 'pending' | 'success' | 'error';

const MAX_POLL_ATTEMPTS = 24; // 24 * 5s = 2 minutes
const POLL_INTERVAL = 5000;

const EidCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [pollCount, setPollCount] = useState(0);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { refreshEidStatus } = useAuth();

  const verifyTransaction = async (transactionId: string): Promise<'success' | 'pending' | 'error'> => {
    try {
      const { data, error } = await supabase.functions.invoke('scrive-eid-auth', {
        body: { action: 'verify', transactionId },
      });

      if (error) {
        console.error('eID verification call failed:', error);
        setErrorMessage(t('auth.eidError') || 'Verification failed');
        return 'error';
      }

      if (!data?.success) {
        console.error('eID verification unsuccessful:', data?.error);
        setErrorMessage(data?.error || t('auth.eidError') || 'Verification failed');
        return data?.status === 'pending' ? 'pending' : 'error';
      }

      if (data.status === 'pending') {
        return 'pending';
      }

      // Verified
      return 'success';
    } catch (err) {
      console.error('eID callback error:', err);
      setErrorMessage(t('auth.eidError') || 'An unexpected error occurred');
      return 'error';
    }
  };

  useEffect(() => {
    const startVerification = async () => {
      const transactionId = searchParams.get('transaction_id') ||
        sessionStorage.getItem('eid_transaction_id');

      if (!transactionId) {
        setStatus('error');
        setErrorMessage(t('auth.eidError') || 'No transaction ID found');
        return;
      }

      console.log('Verifying eID transaction:', transactionId);
      const result = await verifyTransaction(transactionId);

      if (result === 'success') {
        sessionStorage.removeItem('eid_transaction_id');
        await refreshEidStatus();
        setStatus('success');
        toast({
          title: t('auth.eidSuccess') || 'Identity verified',
          description: t('dashboard.identityVerifiedDesc') || 'Your identity has been verified.',
        });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else if (result === 'pending') {
        setStatus('pending');
        // Start polling
        startPolling(transactionId);
      } else {
        setStatus('error');
      }
    };

    startVerification();

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const startPolling = (transactionId: string) => {
    let attempts = 0;
    pollTimerRef.current = setInterval(async () => {
      attempts++;
      setPollCount(attempts);
      console.log(`Polling attempt ${attempts}/${MAX_POLL_ATTEMPTS}`);

      const result = await verifyTransaction(transactionId);

      if (result === 'success') {
        clearInterval(pollTimerRef.current!);
        sessionStorage.removeItem('eid_transaction_id');
        await refreshEidStatus();
        setStatus('success');
        toast({
          title: t('auth.eidSuccess') || 'Identity verified',
          description: t('dashboard.identityVerifiedDesc') || 'Your identity has been verified.',
        });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else if (result === 'error') {
        clearInterval(pollTimerRef.current!);
        setStatus('error');
      } else if (attempts >= MAX_POLL_ATTEMPTS) {
        clearInterval(pollTimerRef.current!);
        setStatus('error');
        setErrorMessage('Verification is taking too long. Please check back on your dashboard.');
      }
    }, POLL_INTERVAL);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80 p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src={prismaLogo}
              alt="Prisma Capital Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <CardTitle>
            {status === 'verifying' && (t('auth.eidVerifying') || 'Verifying your identity...')}
            {status === 'pending' && 'Processing your verification...'}
            {status === 'success' && (t('auth.eidSuccess') || 'Identity verified!')}
            {status === 'error' && (t('auth.eidError') || 'Verification failed')}
          </CardTitle>
          <CardDescription>
            {status === 'verifying' && 'Please wait while we confirm your identity'}
            {status === 'pending' && `Still waiting for Onfido results... (check ${pollCount}/${MAX_POLL_ATTEMPTS})`}
            {status === 'success' && 'Redirecting to your dashboard...'}
            {status === 'error' && errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {status === 'verifying' && (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}
          {status === 'pending' && (
            <RefreshCw className="h-12 w-12 animate-spin text-primary" />
          )}
          {status === 'success' && (
            <CheckCircle className="h-12 w-12 text-green-500" />
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              <div className="flex gap-3">
                <Button onClick={() => navigate('/dashboard')} variant="outline">
                  {t('common.back') || 'Back to Dashboard'}
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EidCallback;
