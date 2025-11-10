import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { ENV } from '@/config/env';
import { fetchWithAuth } from '@/utils/auth';

/**
 * PaywallScreen - Shown after onboarding completion
 * 
 * Flow: Onboarding → This Screen → Sign In / Continue as Guest → Home
 * 
 * TODO: Integrate Superwall SDK here
 * For now, this is a placeholder that shows premium features
 * and allows users to proceed to sign-in or skip
 */
export default function PaywallScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  const features = [
    { icon: 'infinite', title: 'Unlimited Recipes', description: 'Access thousands of recipes' },
    { icon: 'bookmark', title: 'Save Unlimited', description: 'Bookmark all your favorites' },
    { icon: 'heart', title: 'Like Unlimited', description: 'No limits on likes' },
    { icon: 'analytics', title: 'Advanced Analytics', description: 'Track your cooking journey' },
    { icon: 'sparkles', title: 'AI-Powered Suggestions', description: 'Personalized recommendations' },
    { icon: 'restaurant', title: 'Exclusive Recipes', description: 'Premium chef recipes' },
  ];

  const handleSubscribe = () => {
    console.log('🔓 Subscribe clicked - Plan:', selectedPlan);
    // TODO: Integrate Superwall here
    // For now, proceed to sign-in for authentication
    router.replace('/auth/sign-in');
  };

  const handleSkip = async () => {
    try {
      setLoading(true);
      console.log('👤 User skipped paywall - creating guest user and going to home');

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
        'Failed to continue. Please try again or sign in for the best experience.',
        [
          { text: 'Try Again', onPress: handleSkip },
          { text: 'Sign In', onPress: () => router.replace('/auth/sign-in') },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Unlock Premium Features
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Get the most out of your cooking experience
          </Text>
        </View>

        {/* Premium Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={[styles.featureCard, { backgroundColor: theme.colors.background.secondary }]}>
              <View style={[styles.featureIcon, { backgroundColor: '#007AFF' + '20' }]}>
                <Ionicons name={feature.icon as any} size={24} color="#007AFF" />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: theme.colors.text.primary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.text.secondary }]}>
                  {feature.description}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            </View>
          ))}
        </View>

        {/* Pricing Plans */}
        <View style={styles.plansContainer}>
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.selectedPlan,
              { backgroundColor: theme.colors.background.secondary, borderColor: selectedPlan === 'yearly' ? '#007AFF' : theme.colors.border },
            ]}
            onPress={() => setSelectedPlan('yearly')}
            activeOpacity={0.8}
          >
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: theme.colors.text.primary }]}>Yearly</Text>
              {selectedPlan === 'yearly' && (
                <View style={[styles.bestValueBadge, { backgroundColor: '#34C759' }]}>
                  <Text style={styles.bestValueText}>BEST VALUE</Text>
                </View>
              )}
            </View>
            <Text style={[styles.planPrice, { color: theme.colors.text.primary }]}>$49.99/year</Text>
            <Text style={[styles.planSavings, { color: '#34C759' }]}>Save 50%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.selectedPlan,
              { backgroundColor: theme.colors.background.secondary, borderColor: selectedPlan === 'monthly' ? '#007AFF' : theme.colors.border },
            ]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.8}
          >
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: theme.colors.text.primary }]}>Monthly</Text>
            </View>
            <Text style={[styles.planPrice, { color: theme.colors.text.primary }]}>$8.99/month</Text>
            <Text style={[styles.planDetail, { color: theme.colors.text.secondary }]}>Billed monthly</Text>
          </TouchableOpacity>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: '#007AFF' }]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.subscribeButtonText}>
            {loading ? 'Please wait...' : 'Continue to Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Skip Button - Creates guest user and goes directly to home */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={[styles.skipButtonText, { color: theme.colors.text.secondary }]}>
            {loading ? 'Creating Guest Account...' : 'Skip - Continue as Guest'}
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={[styles.terms, { color: theme.colors.text.secondary }]}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          Cancel anytime.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
  },
  plansContainer: {
    marginBottom: 20,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  selectedPlan: {
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
  },
  bestValueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestValueText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  planSavings: {
    fontSize: 14,
    fontWeight: '600',
  },
  planDetail: {
    fontSize: 14,
  },
  subscribeButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

