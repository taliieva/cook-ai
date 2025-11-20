import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { showPaywall } from '@/utils/subscriptions';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { ENV } from '@/config/env';
import { fetchWithAuth } from '@/utils/auth';

/**
 * PaywallScreen - Shown after onboarding completion
 * 
 * Flow: Onboarding → This Screen → Sign In / Continue as Guest → Home
 * 
 * Powered by RevenueCat Paywalls
 * Shows native paywall UI configured in RevenueCat dashboard
 * Subscribes to "Cook AI Pro" entitlement
 */
export default function PaywallScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Trigger paywall on mount
  useEffect(() => {
    handleShowPaywall();
  }, []);

  const handleShowPaywall = async () => {
    try {
      setIsLoading(true);
      console.log('🎨 Paywall: Showing RevenueCat paywall...');

      // Show RevenueCat native paywall
      const result = await showPaywall();

      setIsLoading(false);

      if (result.didPurchase) {
        console.log('✅ Paywall: User subscribed!');
        // After subscription, go to sign-in to complete authentication
        router.replace('/auth/sign-in');
      } else {
        console.log('👤 Paywall: User dismissed - offering guest option');
        // User dismissed paywall, offer guest or sign-in options
        Alert.alert(
          'Continue Your Journey',
          'Want to try the app first or sign in to unlock everything?',
          [
            {
              text: 'Try as Guest',
              onPress: handleContinueAsGuest,
            },
            {
              text: 'Sign In',
              onPress: () => router.replace('/auth/sign-in'),
              style: 'default',
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('❌ Paywall: Exception:', error);
      setIsLoading(false);
      handlePaywallError();
    }
  };

  const handlePaywallError = () => {
    Alert.alert(
      'Unable to Load',
      'Would you like to sign in or continue as guest?',
      [
        { text: 'Try as Guest', onPress: handleContinueAsGuest },
        { text: 'Sign In', onPress: () => router.replace('/auth/sign-in') },
      ]
    );
  };

  const handleContinueAsGuest = async () => {
    try {
      setIsLoading(true);
      console.log('👤 User continuing as guest - creating guest user');

      // Generate or retrieve deviceId
      let deviceId = await SecureStore.getItemAsync('deviceId');
      if (!deviceId) {
        deviceId = Crypto.randomUUID();
        await SecureStore.setItemAsync('deviceId', deviceId);
        console.log('New deviceId generated:', deviceId);
      } else {
        console.log('Existing deviceId found:', deviceId);
      }

      const body = {
        deviceId,
        platform: Platform.OS,
        appVersion: '1.0.0',
        locale: 'en-US',
      };

      console.log("Sending guest auth request:", body);

      const response = await fetchWithAuth(
        `${ENV.API_URL}/auth/guest`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      console.log('Guest auth response:', data);

      if (data.success || (data.accessToken && data.refreshToken)) {
        // Store tokens securely
        await SecureStore.setItemAsync('accessToken', data.accessToken);
        await SecureStore.setItemAsync('refreshToken', data.refreshToken);
        
        // Store guest user info
        if (data.user?.id) {
          await SecureStore.setItemAsync('userId', data.user.id);
        }

        console.log('✅ Guest user created - navigating to home');

        // Navigate directly to home as guest
        router.replace('/main/home');
      } else {
        throw new Error('Guest authentication failed');
      }
    } catch (error: any) {
      console.error('Guest creation error:', error);
      Alert.alert(
        'Error',
        'Failed to create guest account. Please try again or sign in.',
        [
          { text: 'Try Again', onPress: handleContinueAsGuest },
          { text: 'Sign In', onPress: () => router.replace('/auth/sign-in') },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while RevenueCat paywall is initializing and showing
  // Once RevenueCat paywall modal appears, this screen is behind it
  return (
    <View style={styles.container}>
      {isLoading && (
        <>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading payment options...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
});

