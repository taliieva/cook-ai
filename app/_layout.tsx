import AuthGuard from '@/components/auth/AuthGuard';
import { AuthProvider } from '@/contexts/AuthContext';
import { initializeSubscriptions } from '@/utils/subscriptions';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

/**
 * Root Layout - Main Navigation Structure
 * 
 * Wraps entire app with:
 * 1. AuthProvider - Global authentication state
 * 2. AuthGuard - Route protection and navigation rules
 * 3. RevenueCat SDK initialization
 * 
 * Disables gestures at auth boundaries to prevent unauthorized navigation
 */
export default function RootLayout() {
  // Initialize RevenueCat subscription system on app launch
  useEffect(() => {
    const setupSubscriptions = async () => {
      try {
        console.log('🚀 Initializing RevenueCat...');
        await initializeSubscriptions();
        console.log('✅ RevenueCat initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize RevenueCat:', error);
      }
    };

    setupSubscriptions();
  }, []);

  return (
    <AuthProvider>
      <AuthGuard>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: false, // Disable swipe-back at root level
            animation: 'fade',
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="splash/index" 
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="onboarding" 
            options={{
              gestureEnabled: false, // No swipe back to protected routes
            }}
          />
        <Stack.Screen 
          name="auth" 
          options={{
            gestureEnabled: false, // No swipe back to protected routes
          }}
        />
        <Stack.Screen 
          name="paywall" 
          options={{
            gestureEnabled: false, // No swipe back to onboarding
          }}
        />
        <Stack.Screen 
          name="main" 
          options={{
            gestureEnabled: false, // Protected route boundary
          }}
        />
        </Stack>
      </AuthGuard>
    </AuthProvider>
  );
}