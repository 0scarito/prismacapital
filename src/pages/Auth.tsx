import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import prismaLogo from '@/assets/prisma-logo-blue.png';
import { z } from 'zod';
import { Briefcase, User, Loader2 } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
  displayName: z.string().min(1, 'Display name required').max(100, 'Display name too long').optional(),
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'client' | 'wealth_manager'>('client');
  const [loading, setLoading] = useState(false);
  const [eidLoading, setEidLoading] = useState<string | null>(null);
  const { signIn, signUp, signInWithEid, user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Check for saved redirect URL from before login
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const validation = signUpSchema.safeParse({ email, password, displayName });
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    const { error } = await signUp(email, password, displayName, role);
    
    if (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
    }
    
    setLoading(false);
  };

  const handleEidLogin = async (provider: 'seBankID' | 'noBankID' | 'dkMitID') => {
    setEidLoading(provider);
    try {
      await signInWithEid(provider);
      // Redirect happens in signInWithEid
    } catch (err) {
      console.error('eID login error:', err);
      toast({
        title: t('auth.eidError') || 'eID verification failed',
        description: 'Please try again',
        variant: 'destructive',
      });
      setEidLoading(null);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-background to-background/80 p-4">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4"
      >
        {t('common.back')}
      </Button>
      <Card className="w-full max-w-md bg-card text-card-foreground">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={prismaLogo} 
              alt="Prisma Capital Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <CardDescription className="text-muted-foreground">
            Accédez à votre espace personnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full" onValueChange={() => {
            setEmail('');
            setPassword('');
            setDisplayName('');
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-foreground">{t('auth.email')}</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-foreground">{t('auth.password')}</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('auth.signingIn') : t('auth.signInButton')}
                </Button>
              </form>
              
              {/* eID Login Section */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {t('auth.eidLogin') || 'Or login with eID'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start gap-3"
                    disabled={!!eidLoading}
                    onClick={() => handleEidLogin('seBankID')}
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
                    onClick={() => handleEidLogin('noBankID')}
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
                    onClick={() => handleEidLogin('dkMitID')}
                  >
                    {eidLoading === 'dkMitID' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-lg">🇩🇰</span>
                    )}
                    {t('auth.danishMitId') || 'Danish MitID'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-3 text-foreground">
                  <Label>{t('auth.roleSelection') || 'Je suis'}</Label>
                  <RadioGroup value={role} onValueChange={(value) => setRole(value as 'client' | 'wealth_manager')}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="client" id="client" />
                      <Label htmlFor="client" className="flex items-center gap-2 cursor-pointer flex-1">
                        <User className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{t('auth.client') || 'Un particulier'}</div>
                          <div className="text-xs text-muted-foreground">{t('auth.clientDesc') || 'Investir pour mon compte'}</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="wealth_manager" id="wealth_manager" />
                      <Label htmlFor="wealth_manager" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Briefcase className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{t('auth.wealthManager') || 'Un CGP / Établissement financier'}</div>
                          <div className="text-xs text-muted-foreground">{t('auth.wealthManagerDesc') || 'Distribuer des coupons à mes clients'}</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-foreground">{t('auth.displayName')}</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t('auth.displayNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground">{t('auth.email')}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground">{t('auth.password')}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('auth.signingUp') : t('auth.signUpButton')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;