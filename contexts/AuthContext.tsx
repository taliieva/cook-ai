import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { validateAuthState, clearAuthTokens } from '@/utils/auth';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';
import { hasActiveSubscription, identifyUser as identifyRevenueCatUser, logOutUser as logOutRevenueCatUser } from '@/utils/subscriptions';

interface User {
  id: string;
  email: string;
  displayName: string;
  isGuest: boolean;
  subscriptionStatus: 'free' | 'pro';
}

interface AuthContextType {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isPremium: boolean;
  isLoading: boolean;
  
  // Auth actions
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  upgradeFromGuest: () => void;
  
  // Feature gating
  canAccessFeature: (feature: 'like' | 'save' | 'view_saved' | 'view_liked' | 'premium') => boolean;
  showLoginPrompt: (feature: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const segments = useSegments();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPromptReason, setLoginPromptReason] = useState('');

  // Computed values
  const isAuthenticated = !!user && !user.isGuest;
  const isGuest = user?.isGuest ?? false;
  const isPremium = user?.subscriptionStatus === 'pro';

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('🔐 AuthContext: Initializing auth state...');
      
      const authResult = await validateAuthState();
      
      if (authResult.isValid && authResult.userData) {
        // Check RevenueCat subscription status
        let subscriptionStatus: 'free' | 'pro' = 'free';
        try {
          const hasActiveSub = await hasActiveSubscription();
          subscriptionStatus = hasActiveSub ? 'pro' : 'free';
          console.log('💳 RevenueCat subscription status:', subscriptionStatus);
        } catch (error) {
          console.warn('⚠️ Could not check RevenueCat subscription:', error);
          // Fallback to backend status if RevenueCat fails
          subscriptionStatus = (authResult.userData.subscriptionStatus === 'pro' ? 'pro' : 'free') as 'free' | 'pro';
        }
        
        const userData: User = {
          id: authResult.userData.id,
          email: authResult.userData.email,
          displayName: authResult.userData.displayName || authResult.userData.email || 'User',
          isGuest: authResult.userData.isGuest,
          subscriptionStatus,
        };
        
        // Identify user in RevenueCat
        if (!userData.isGuest && userData.id) {
          try {
            await identifyRevenueCatUser(userData.id);
            console.log('✅ User identified in RevenueCat:', userData.id);
          } catch (error) {
            console.warn('⚠️ Failed to identify user in RevenueCat:', error);
          }
        }
        
        setUser(userData);
        
        console.log('✅ AuthContext: User loaded:', {
          isGuest: userData.isGuest,
          isAuthenticated: !userData.isGuest,
          subscription: userData.subscriptionStatus,
        });
      } else {
        console.log('❌ AuthContext: No valid auth state');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ AuthContext: Init error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    console.log('✅ AuthContext: Logging in user:', userData.email);
    
    // Identify user in RevenueCat
    if (!userData.isGuest && userData.id) {
      try {
        await identifyRevenueCatUser(userData.id);
        console.log('✅ User identified in RevenueCat:', userData.id);
      } catch (error) {
        console.warn('⚠️ Failed to identify user in RevenueCat:', error);
      }
    }
    
    setUser(userData);
  };

  const logout = async () => {
    try {
      console.log('🔓 AuthContext: Logging out...');
      
      // Log out from RevenueCat
      try {
        await logOutRevenueCatUser();
        console.log('✅ RevenueCat: User logged out');
      } catch (error) {
        console.warn('⚠️ Failed to log out from RevenueCat:', error);
      }
      
      // Clear tokens
      await clearAuthTokens();
      
      // Clear user state
      setUser(null);
      
      // Clear navigation stack and redirect to welcome
      router.replace('/onboarding/welcome');
      
      console.log('✅ AuthContext: Logout complete');
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
      // Still clear state and redirect even on error
      setUser(null);
      router.replace('/onboarding/welcome');
    }
  };

  const refreshAuth = async () => {
    console.log('🔄 AuthContext: Refreshing auth state...');
    await initializeAuth();
  };

  const upgradeFromGuest = () => {
    console.log('⬆️ AuthContext: Upgrading from guest - redirecting to login');
    router.push('/auth/sign-in');
  };

  // Feature gating logic
  const canAccessFeature = (feature: 'like' | 'save' | 'view_saved' | 'view_liked' | 'premium'): boolean => {
    // Guest users have limited access
    if (isGuest) {
      switch (feature) {
        case 'like':
        case 'save':
        case 'view_saved':
        case 'view_liked':
        case 'premium':
          return false; // Guests cannot access these features
        default:
          return true;
      }
    }
    
    // Authenticated users can access most features
    if (isAuthenticated) {
      switch (feature) {
        case 'premium':
          return isPremium; // Only premium users
        default:
          return true; // All authenticated users
      }
    }
    
    // No user at all - no access
    return false;
  };

  const showLoginPrompt = (feature: string) => {
    console.log(`🔒 AuthContext: Login required for feature: ${feature}`);
    setLoginPromptReason(feature);
    setShowLoginModal(true);
    
    // For now, just navigate to login
    // In a full implementation, you'd show a modal first
    setTimeout(() => {
      router.push('/auth/sign-in');
    }, 100);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isGuest,
    isPremium,
    isLoading,
    login,
    logout,
    refreshAuth,
    upgradeFromGuest,
    canAccessFeature,
    showLoginPrompt,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

