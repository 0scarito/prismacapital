import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import prismaLogo from '@/assets/prisma-logo-blue.png';

type CallbackStatus = 'verifying' | 'success' | 'error';

const EidCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const verifyEidTransaction = async () => {
      const transactionId = searchParams.get('transaction_id') || 
                           sessionStorage.getItem('eid_transaction_id');

      if (!transactionId) {
        setStatus('error');
        setErrorMessage(t('auth.eidError') || 'No transaction ID found');
        return;
      }

      try {
        console.log('Verifying eID transaction:', transactionId);

        const { data, error } = await supabase.functions.invoke('scrive-eid-auth', {
          body: {
            action: 'verify',
            transactionId,
          },
        });

        if (error || !data?.success) {
          console.error('eID verification failed:', error || data?.error);
          setStatus('error');
          setErrorMessage(data?.error || t('auth.eidError') || 'Verification failed');
          return;
        }

        console.log('eID verification successful:', { isNewUser: data.isNewUser });

        // Use the token to sign in
        if (data.auth?.token) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: data.auth.token,
            type: data.auth.type || 'magiclink',
          });

          if (verifyError) {
            console.error('Session verification error:', verifyError);
            setStatus('error');
            setErrorMessage(t('auth.eidError') || 'Failed to create session');
            return;
          }
        }

        // Clear stored transaction ID
        sessionStorage.removeItem('eid_transaction_id');

        setStatus('success');
        
        toast({
          title: t('auth.eidSuccess') || 'Identity verified',
          description: data.isNewUser 
            ? 'Your account has been created successfully' 
            : 'Welcome back!',
        });

        // Redirect after short delay
        setTimeout(() => {
          const redirectUrl = localStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectUrl);
          } else {
            navigate('/dashboard');
          }
        }, 1500);

      } catch (err) {
        console.error('eID callback error:', err);
        setStatus('error');
        setErrorMessage(t('auth.eidError') || 'An unexpected error occurred');
      }
    };

    verifyEidTransaction();
  }, [searchParams, navigate, toast, t]);

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
            {status === 'success' && (t('auth.eidSuccess') || 'Identity verified!')}
            {status === 'error' && (t('auth.eidError') || 'Verification failed')}
          </CardTitle>
          <CardDescription>
            {status === 'verifying' && 'Please wait while we confirm your identity'}
            {status === 'success' && 'Redirecting to your dashboard...'}
            {status === 'error' && errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {status === 'verifying' && (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}
          {status === 'success' && (
            <CheckCircle className="h-12 w-12 text-green-500" />
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              <Button onClick={() => navigate('/auth')} variant="outline">
                {t('common.back') || 'Back to Login'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EidCallback;
