import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Vove, { VoveEnvironment } from '@vove-id/web-sdk';

interface VoveidVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

type VerificationStatus = 'idle' | 'loading' | 'ready' | 'verifying' | 'checking' | 'polling' | 'success' | 'failed' | 'canceled';

interface VoveidConfig {
  publicKey: string;
  flowId: string;
  environment: string;
}

const POLL_INTERVAL = 5000; // 5 seconds
const POLL_MAX_DURATION = 120000; // 2 minutes

const VoveidVerification = ({ isOpen, onClose, onVerificationComplete }: VoveidVerificationProps) => {
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [config, setConfig] = useState<VoveidConfig | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollStartRef = useRef<number>(0);
  const { toast } = useToast();
  const { t } = useLanguage();

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Fetch configuration and create session
  const createSession = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      let voveidConfig = config;
      if (!voveidConfig) {
        const { data: configData, error: configError } = await supabase.functions.invoke('voveid-auth', {
          body: { action: 'get-config' },
        });
        if (configError) throw new Error('Failed to load VoveID configuration');
        if (!configData?.publicKey || !configData?.flowId) throw new Error('VoveID configuration incomplete');
        voveidConfig = configData as VoveidConfig;
        setConfig(voveidConfig);
      }

      const { data, error } = await supabase.functions.invoke('voveid-auth', {
        body: { action: 'create-session' },
      });
      if (error) throw new Error(error.message);
      if (!data?.sessionToken) throw new Error('No session token received');

      setSessionToken(data.sessionToken);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to create VoveID session:', err);
      setStatus('failed');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to start verification');
      toast({
        title: t('auth.voveidError') || 'Verification Error',
        description: err instanceof Error ? err.message : 'Failed to start verification. Please try again.',
        variant: 'destructive',
      });
    }
  }, [config, toast, t]);

  // Poll for verification status (handles async webhook processing)
  const pollForStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('voveid-auth', {
        body: { action: 'get-status' },
      });

      if (error) {
        console.error('Poll status error:', error);
        return; // Keep polling, don't fail yet
      }

      if (data?.status === 'verified' && data?.success) {
        stopPolling();
        setStatus('success');
        toast({
          title: t('auth.voveidSuccess') || 'Identity Verified',
          description: data?.identity?.name
            ? `Welcome, ${data.identity.name}! Your identity has been verified.`
            : 'Your identity has been successfully verified.',
        });
        onVerificationComplete();
        return;
      }

      if (data?.status === 'failed') {
        stopPolling();
        setStatus('failed');
        setErrorMessage(data?.error || 'Verification failed. Please try again with valid documents.');
        toast({
          title: t('auth.voveidError') || 'Verification Failed',
          description: 'Your verification could not be completed. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Still pending – check timeout
      if (Date.now() - pollStartRef.current > POLL_MAX_DURATION) {
        stopPolling();
        setStatus('failed');
        setErrorMessage('Verification is taking longer than expected. Please check back later from your dashboard.');
        toast({
          title: 'Verification Processing',
          description: 'Your verification is still being processed. Check your dashboard for updates.',
        });
      }
    } catch (err) {
      console.error('Poll error:', err);
    }
  }, [stopPolling, toast, t, onVerificationComplete]);

  // Check verification status - starts polling if pending
  const checkVerificationStatus = useCallback(async () => {
    setStatus('checking');

    try {
      const { data, error } = await supabase.functions.invoke('voveid-auth', {
        body: { action: 'get-status' },
      });

      if (error) throw new Error(error.message);

      if (data?.success && data?.status === 'verified') {
        setStatus('success');
        toast({
          title: t('auth.voveidSuccess') || 'Identity Verified',
          description: data?.identity?.name
            ? `Welcome, ${data.identity.name}! Your identity has been verified.`
            : 'Your identity has been successfully verified.',
        });
        onVerificationComplete();
      } else if (data?.status === 'failed') {
        setStatus('failed');
        setErrorMessage('Verification failed. Please try again with valid documents.');
      } else {
        // Status is pending/in_progress – start polling
        setStatus('polling');
        pollStartRef.current = Date.now();
        pollingRef.current = setInterval(pollForStatus, POLL_INTERVAL);
      }
    } catch (err) {
      console.error('Status check error:', err);
      // Can't confirm – start polling as fallback
      setStatus('polling');
      pollStartRef.current = Date.now();
      pollingRef.current = setInterval(pollForStatus, POLL_INTERVAL);
    }
  }, [toast, t, onVerificationComplete, pollForStatus]);

  // Start VoveID SDK verification
  const startVerification = useCallback(async () => {
    if (!sessionToken || !config) return;

    setStatus('verifying');
    setErrorMessage(null);

    try {
      const vove = new Vove();
      const voveEnv = config.environment === 'production'
        ? VoveEnvironment.PRODUCTION
        : VoveEnvironment.SANDBOX;

      vove.start({
        environment: voveEnv,
        publicKey: config.publicKey,
        sessionToken: sessionToken,
        onVerificationComplete: async (result: string) => {
          console.log('VoveID SDK result:', result);

          if (result === 'success') {
            await checkVerificationStatus();
          } else if (result === 'canceled') {
            setStatus('canceled');
            toast({
              title: t('auth.voveidCanceled') || 'Verification Canceled',
              description: 'You can try again when ready.',
            });
          } else {
            setStatus('failed');
            setErrorMessage('Verification was not successful. Please try again.');
          }
        },
      });
    } catch (err) {
      console.error('VoveID SDK error:', err);
      setStatus('failed');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to start verification');
    }
  }, [sessionToken, config, toast, t, checkVerificationStatus]);

  // Create session when dialog opens
  useEffect(() => {
    if (isOpen && status === 'idle') {
      createSession();
    }
  }, [isOpen, status, createSession]);

  // Cleanup polling on unmount / close
  useEffect(() => {
    if (!isOpen) {
      stopPolling();
      setStatus('idle');
      setSessionToken(null);
      setConfig(null);
      setErrorMessage(null);
    }
    return () => stopPolling();
  }, [isOpen, stopPolling]);

  const handleClose = () => {
    if (status !== 'verifying' && status !== 'checking' && status !== 'polling') {
      onClose();
    }
  };

  const handleRetry = () => {
    stopPolling();
    setStatus('idle');
    setSessionToken(null);
    setErrorMessage(null);
    createSession();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === 'success' && <CheckCircle className="h-5 w-5 text-primary" />}
            {status === 'failed' && <XCircle className="h-5 w-5 text-destructive" />}
            {t('auth.voveidTitle') || 'Identity Verification'}
          </DialogTitle>
          <DialogDescription>
            {t('auth.voveidDescription') || 'Complete identity verification using your ID document'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 gap-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {t('auth.voveidPreparing') || 'Preparing verification...'}
              </p>
            </>
          )}

          {status === 'ready' && (
            <>
              <p className="text-sm text-center text-muted-foreground mb-2">
                {t('auth.voveidReady') || 'Ready to verify your identity. Click the button below to start.'}
              </p>
              <Button onClick={startVerification} className="w-full">
                {t('auth.voveidStart') || 'Start Verification'}
              </Button>
            </>
          )}

          {status === 'verifying' && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {t('auth.voveidVerifying') || 'Verifying your identity...'}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('auth.voveidPopup') || 'A verification window should have opened'}
              </p>
            </>
          )}

          {(status === 'checking' || status === 'polling') && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {status === 'polling' ? 'Processing your verification...' : 'Confirming verification status...'}
              </p>
              {status === 'polling' && (
                <p className="text-xs text-muted-foreground text-center">
                  This may take up to 2 minutes. Please don't close this window.
                </p>
              )}
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-primary" />
              <p className="text-sm text-primary font-medium">
                {t('auth.voveidSuccess') || 'Identity verified successfully!'}
              </p>
              <Button onClick={onClose} variant="outline" className="w-full">
                {t('common.close') || 'Close'}
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-sm text-destructive font-medium">
                {t('auth.voveidError') || 'Verification failed'}
              </p>
              {errorMessage && (
                <p className="text-xs text-muted-foreground text-center">
                  {errorMessage}
                </p>
              )}
              <div className="flex gap-2 w-full">
                <Button onClick={handleRetry} variant="outline" className="flex-1">
                  {t('common.retry') || 'Retry'}
                </Button>
                <Button onClick={onClose} variant="ghost" className="flex-1">
                  {t('common.cancel') || 'Cancel'}
                </Button>
              </div>
            </>
          )}

          {status === 'canceled' && (
            <>
              <AlertTriangle className="h-12 w-12 text-amber-500" />
              <p className="text-sm text-muted-foreground">
                {t('auth.voveidCanceled') || 'Verification was canceled'}
              </p>
              <div className="flex gap-2 w-full">
                <Button onClick={handleRetry} variant="outline" className="flex-1">
                  {t('common.retry') || 'Try Again'}
                </Button>
                <Button onClick={onClose} variant="ghost" className="flex-1">
                  {t('common.close') || 'Close'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoveidVerification;
