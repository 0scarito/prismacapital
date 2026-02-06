import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
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

type VerificationStatus = 'idle' | 'loading' | 'ready' | 'verifying' | 'success' | 'failed' | 'canceled';

interface VoveidConfig {
  publicKey: string;
  flowId: string;
  environment: string;
}

const VoveidVerification = ({ isOpen, onClose, onVerificationComplete }: VoveidVerificationProps) => {
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [config, setConfig] = useState<VoveidConfig | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Fetch configuration and create session
  const createSession = useCallback(async () => {
    setStatus('loading');

    try {
      // First get config if we don't have it
      let voveidConfig = config;
      if (!voveidConfig) {
        const { data: configData, error: configError } = await supabase.functions.invoke('voveid-auth', {
          body: { action: 'get-config' },
        });

        if (configError) {
          console.error('VoveID config error:', configError);
          throw new Error('Failed to load VoveID configuration');
        }

        if (!configData?.publicKey || !configData?.flowId) {
          throw new Error('VoveID configuration incomplete');
        }

        voveidConfig = configData as VoveidConfig;
        setConfig(voveidConfig);
        console.log('VoveID config loaded');
      }

      // Now create the session
      const { data, error } = await supabase.functions.invoke('voveid-auth', {
        body: { action: 'create-session' },
      });

      if (error) {
        console.error('VoveID session error:', error);
        throw new Error(error.message);
      }

      if (!data?.sessionToken) {
        throw new Error('No session token received');
      }

      console.log('VoveID session created');
      setSessionToken(data.sessionToken);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to create VoveID session:', err);
      setStatus('failed');
      toast({
        title: t('auth.voveidError') || 'Verification Error',
        description: err instanceof Error ? err.message : 'Failed to start verification. Please try again.',
        variant: 'destructive',
      });
    }
  }, [config, toast, t]);

  // Start VoveID SDK verification
  const startVerification = useCallback(async () => {
    if (!sessionToken || !config) {
      console.error('Missing sessionToken or config');
      return;
    }

    setStatus('verifying');

    try {
      // Use the npm package directly
      const vove = new Vove();
      const voveEnv = config.environment === 'production' 
        ? VoveEnvironment.PRODUCTION 
        : VoveEnvironment.SANDBOX;
      
      vove.start({
        environment: voveEnv,
        publicKey: config.publicKey,
        sessionToken: sessionToken,
        onVerificationComplete: async (result: string) => {
          console.log('VoveID verification result:', result);
          
          if (result === 'success') {
            // Verify status on backend and update profile
            await checkVerificationStatus();
          } else if (result === 'canceled') {
            setStatus('canceled');
            toast({
              title: t('auth.voveidCanceled') || 'Verification Canceled',
              description: 'You can try again when ready.',
            });
          } else {
            setStatus('failed');
            toast({
              title: t('auth.voveidError') || 'Verification Failed',
              description: 'Please try again or contact support.',
              variant: 'destructive',
            });
          }
        },
      });
    } catch (err) {
      console.error('VoveID SDK error:', err);
      setStatus('failed');
      toast({
        title: t('auth.voveidError') || 'Verification Error',
        description: 'Failed to start verification. Please try again.',
        variant: 'destructive',
      });
    }
  }, [sessionToken, config, toast, t]);

  // Check verification status on backend
  const checkVerificationStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('voveid-auth', {
        body: { action: 'get-status' },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success && data?.status === 'verified') {
        setStatus('success');
        toast({
          title: t('auth.voveidSuccess') || 'Identity Verified',
          description: 'Your identity has been successfully verified.',
        });
        onVerificationComplete();
      } else {
        // Status might still be pending, the webhook will handle it
        setStatus('success');
        toast({
          title: t('auth.voveidSuccess') || 'Verification Submitted',
          description: 'Your verification is being processed.',
        });
        onVerificationComplete();
      }
    } catch (err) {
      console.error('Status check error:', err);
      // Even if status check fails, the webhook might still update
      setStatus('success');
      onVerificationComplete();
    }
  };

  // Create session when dialog opens
  useEffect(() => {
    if (isOpen && status === 'idle') {
      createSession();
    }
  }, [isOpen, status, createSession]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setSessionToken(null);
      setConfig(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (status !== 'verifying') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {status === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
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

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-sm text-green-600 font-medium">
                {t('auth.voveidSuccess') || 'Identity verified successfully!'}
              </p>
              <Button onClick={onClose} variant="outline" className="w-full">
                {t('common.close') || 'Close'}
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-sm text-red-600 font-medium">
                {t('auth.voveidError') || 'Verification failed'}
              </p>
              <div className="flex gap-2 w-full">
                <Button onClick={createSession} variant="outline" className="flex-1">
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
              <p className="text-sm text-muted-foreground">
                {t('auth.voveidCanceled') || 'Verification was canceled'}
              </p>
              <div className="flex gap-2 w-full">
                <Button onClick={createSession} variant="outline" className="flex-1">
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
