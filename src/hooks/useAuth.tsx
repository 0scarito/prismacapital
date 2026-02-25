import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type KycStatus = 'none' | 'pending' | 'verified' | 'failed';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: 'client' | 'wealth_manager' | null;
  isEidVerified: boolean;
  kycStatus: KycStatus;
  verifiedName: string | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
    role?: 'client' | 'wealth_manager'
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  verifyIdentity: () => Promise<void>;
  refreshEidStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider - Manages user auth state with Supabase
 * Provides sign in, sign up, and sign out functionality
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'wealth_manager' | null>(null);
  const [isEidVerified, setIsEidVerified] = useState(false);
  const [kycStatus, setKycStatus] = useState<KycStatus>('none');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role and eID status when session changes
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
            fetchKycData(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setIsEidVerified(false);
          setKycStatus('none');
          setVerifiedName(null);
        }
        
        setLoading(false);
      }
    );

    // Initialize with existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
        fetchKycData(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: userId });
      
      if (!error && data) {
        setUserRole(data as 'client' | 'wealth_manager');
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  const fetchKycData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('eid_personal_number, kyc_status, verified_name, updated_at')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        let currentStatus = (data.kyc_status as KycStatus) || 'none';
        
        // Check if pending verification has timed out (> 30 minutes)
        if (currentStatus === 'pending' && data.updated_at) {
          const updatedAt = new Date(data.updated_at);
          const now = new Date();
          const minutesSincePending = (now.getTime() - updatedAt.getTime()) / (1000 * 60);
          
          if (minutesSincePending > 30) {
            console.log('Pending verification timed out, resetting status');
            // Reset to 'none' so user can restart verification
            const { error: resetError } = await supabase
              .from('profiles')
              .update({ kyc_status: 'none' })
              .eq('id', userId);
            
            if (!resetError) {
              currentStatus = 'none';
            }
          }
        }
        
        setIsEidVerified(!!data.eid_personal_number && currentStatus === 'verified');
        setKycStatus(currentStatus);
        setVerifiedName(data.verified_name || null);
      }
    } catch (err) {
      console.error('Error fetching KYC data:', err);
    }
  };

  const refreshEidStatus = async () => {
    if (user) {
      await fetchKycData(user.id);
    }
  };

  /**
   * Sign in with email and password
   */
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  /**
   * Sign up new user with email and password
   * Optional display name stored in user metadata
   */
  const signUp = async (
    email: string,
    password: string,
    displayName?: string,
    role: 'client' | 'wealth_manager' = 'client'
  ): Promise<{ error: AuthError | null }> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
        },
      },
    });
    
    // Update role if it's not the default 'client' role
    // The trigger will have already created a 'client' role
    if (!error && data.user && role === 'wealth_manager') {
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: 'wealth_manager' })
        .eq('user_id', data.user.id);
      
      if (roleError) {
        console.error('Error updating role:', roleError);
      }
    }

    return { error };
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  /**
   * Initiate identity verification via Scrive Onfido KYC
   */
  const verifyIdentity = async (): Promise<void> => {
    const redirectUrl = `${window.location.origin}/auth/eid-callback`;
    
    // Set pending immediately in local state
    setKycStatus('pending');
    
    const { data, error } = await supabase.functions.invoke('scrive-eid-auth', {
      body: {
        action: 'create',
        provider: 'onfido',
        redirectUrl,
      },
    });

    if (error || !data?.accessUrl) {
      console.error('Identity verification error:', error || 'No accessUrl returned');
      setKycStatus('none');
      throw new Error('Failed to initiate identity verification');
    }

    // Store transaction ID for callback verification
    sessionStorage.setItem('eid_transaction_id', data.transactionId);
    
    // Redirect to Scrive/Onfido (full redirect, not iframe)
    window.location.href = data.accessUrl;
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    isEidVerified,
    kycStatus,
    verifiedName,
    signIn,
    signUp,
    signOut,
    verifyIdentity,
    refreshEidStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook - Access authentication context
 * Must be used within AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
