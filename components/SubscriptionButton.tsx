/**
 * Example: Subscription Button Component
 * Shows how to check subscription and show paywall
 */
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { hasActiveSubscription, showPaywall } from '@/utils/subscriptions';

export default function SubscriptionButton() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const status = await hasActiveSubscription();
      setIsPro(status);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async () => {
    if (isPro) {
      // Already subscribed, maybe show customer center
      return;
    }

    // Show paywall
    setLoading(true);
    const result = await showPaywall();
    setLoading(false);

    if (result.didPurchase) {
      // Subscription successful!
      setIsPro(true);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <TouchableOpacity
      style={[styles.button, isPro && styles.proButton]}
      onPress={handlePress}
      disabled={isPro}
    >
      <Text style={styles.buttonText}>
        {isPro ? '✅ Cook AI Pro' : 'Upgrade to Pro'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  proButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

