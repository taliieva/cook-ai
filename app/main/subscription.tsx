import {
    getOfferings,
    getSubscriptionStatus,
    hasActiveSubscription,
    purchasePackage,
    restoreSubscriptions,
    showCustomerCenter,
    showPaywall,
} from '@/utils/subscriptions';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Subscription & Billing Screen
 * Shows current subscription status, available plans, and purchase options
 * Powered by RevenueCat
 */
export default function SubscriptionScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [offerings, setOfferings] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // Check subscription status
      const isActive = await hasActiveSubscription();
      setIsPro(isActive);

      // Get detailed status
      const details = await getSubscriptionStatus();
      setSubscriptionDetails(details);

      // Get available offerings
      const availableOfferings = await getOfferings();
      setOfferings(availableOfferings);

      console.log('Subscription loaded:', { isActive, details });
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPaywall = async () => {
    try {
      setProcessing(true);
      console.log('🎨 Opening RevenueCat Paywall...');
      
      const result = await showPaywall();
      
      if (result.didPurchase) {
        Alert.alert(
          'Success!',
          'Welcome to Cook AI Pro! 🎉',
          [{ text: 'OK', onPress: loadSubscriptionData }]
        );
      }
    } catch (error) {
      console.error('Paywall error:', error);
      Alert.alert('Error', 'Failed to show paywall. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePurchasePackage = async (pkg: any) => {
    try {
      setProcessing(true);
      console.log('💳 Purchasing package:', pkg.identifier);
      
      const result = await purchasePackage(pkg);
      
      if (result.success) {
        Alert.alert(
          'Success!',
          'Welcome to Cook AI Pro! 🎉',
          [{ text: 'OK', onPress: loadSubscriptionData }]
        );
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      if (!error.userCancelled) {
        Alert.alert('Error', 'Purchase failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setProcessing(true);
      console.log('🔄 Restoring purchases...');
      
      const restored = await restoreSubscriptions();
      
      if (restored) {
        Alert.alert(
          'Success!',
          'Your purchases have been restored! 🎉',
          [{ text: 'OK', onPress: loadSubscriptionData }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any previous purchases to restore.'
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await showCustomerCenter();
    } catch (error) {
      // Fallback to platform-specific management
      const url = Platform.OS === 'ios'
        ? 'https://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';
      
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading subscription info...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription & Billing</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Current Status Card */}
      <View style={[styles.statusCard, isPro ? styles.proCard : styles.freeCard]}>
        <View style={styles.statusHeader}>
          <Ionicons 
            name={isPro ? "diamond" : "person-circle-outline"} 
            size={40} 
            color={isPro ? "#FFD700" : "#666"} 
          />
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>
              {isPro ? '✨ Cook AI Pro' : 'Free Plan'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {isPro ? 'Active Subscription' : 'Limited Features'}
            </Text>
          </View>
        </View>

        {isPro && subscriptionDetails && (
          <View style={styles.subscriptionDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Product:</Text>
              <Text style={styles.detailValue}>
                {subscriptionDetails.productIdentifier || 'Premium'}
              </Text>
            </View>
            
            {subscriptionDetails.expirationDate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Renews:</Text>
                <Text style={styles.detailValue}>
                  {new Date(subscriptionDetails.expirationDate).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Auto-Renew:</Text>
              <Text style={styles.detailValue}>
                {subscriptionDetails.willRenew ? 'Yes ✓' : 'No ✗'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Pro Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isPro ? 'Your Pro Features' : 'Unlock Pro Features'}
        </Text>
        
        {[
          { icon: 'heart', title: 'Unlimited Likes', desc: 'Like as many recipes as you want' },
          { icon: 'bookmark', title: 'Unlimited Saves', desc: 'Save unlimited recipes' },
          { icon: 'search', title: 'Unlimited Searches', desc: 'Search without limits' },
          { icon: 'sparkles', title: 'AI-Powered', desc: 'Advanced AI recipe generation' },
          { icon: 'stats-chart', title: 'Analytics', desc: 'Track your cooking insights' },
          { icon: 'restaurant', title: 'Premium Recipes', desc: 'Access exclusive recipes' },
        ].map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name={feature.icon as any} size={24} color="#007AFF" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
            {isPro && <Ionicons name="checkmark-circle" size={24} color="#34C759" />}
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      {!isPro ? (
        <>
          {/* Show RevenueCat Paywall Button */}
          <TouchableOpacity
            style={[styles.primaryButton, processing && styles.disabledButton]}
            onPress={handleShowPaywall}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="diamond" size={24} color="#FFF" />
                <Text style={styles.primaryButtonText}>View Subscription Plans</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Show Individual Packages (if available) */}
          {offerings && offerings.availablePackages && offerings.availablePackages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Plans</Text>
              
              {offerings.availablePackages.map((pkg: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.packageCard, processing && styles.disabledButton]}
                  onPress={() => handlePurchasePackage(pkg)}
                  disabled={processing}
                >
                  <View style={styles.packageInfo}>
                    <Text style={styles.packageTitle}>
                      {pkg.product.title}
                    </Text>
                    <Text style={styles.packageDesc}>
                      {pkg.product.description}
                    </Text>
                  </View>
                  <Text style={styles.packagePrice}>
                    {pkg.product.priceString}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Restore Purchases */}
          <TouchableOpacity
            style={[styles.secondaryButton, processing && styles.disabledButton]}
            onPress={handleRestorePurchases}
            disabled={processing}
          >
            <Ionicons name="refresh" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Restore Purchases</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Manage Subscription */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleManageSubscription}
          >
            <Ionicons name="settings" size={24} color="#FFF" />
            <Text style={styles.primaryButtonText}>Manage Subscription</Text>
          </TouchableOpacity>

          {/* Restore Purchases (for Pro users too) */}
          <TouchableOpacity
            style={[styles.secondaryButton, processing && styles.disabledButton]}
            onPress={handleRestorePurchases}
            disabled={processing}
          >
            <Ionicons name="refresh" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Restore Purchases</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Subscriptions are managed through RevenueCat and billed through the App Store or Google Play.
        </Text>
        <Text style={styles.footerText}>
          Cancel anytime from your account settings.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  statusCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  freeCard: {
    backgroundColor: '#FFF',
  },
  proCard: {
    backgroundColor: '#1A1A1A',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 4,
  },
  subscriptionDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  section: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  featureText: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  featureDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  packageDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  footer: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 4,
  },
});

