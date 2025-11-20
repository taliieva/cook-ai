/**
 * RevenueCat Integration for Cook AI
 * Handles all subscription purchases and status checks
 * 
 * Entitlement: "Cook AI Pro"
 * Products: monthly, yearly, weekly
 */
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
  LOG_LEVEL,
  PurchasesOffering,
} from 'react-native-purchases';
import { presentPaywall } from 'react-native-purchases-ui';
import { Platform } from 'react-native';
import { ENV } from '@/config/env';

let isInitialized = false;

// Entitlement identifier
export const ENTITLEMENT_ID = 'Cook AI Pro';

/**
 * Initialize RevenueCat SDK
 * Call this once at app startup
 */
export const initializeRevenueCat = async (userId?: string): Promise<void> => {
  if (isInitialized) {
    console.log('✅ RevenueCat: Already initialized');
    return;
  }

  try {
    console.log('🚀 RevenueCat: Initializing...');

    // Set log level
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);

    // Configure SDK with your test API key
    const apiKey = ENV.REVENUECAT_API_KEY || 'test_dHUQiLAWmMSNTWwWmIyuNlyFgkZ';

    await Purchases.configure({ apiKey, appUserID: userId });

    isInitialized = true;
    console.log('✅ RevenueCat: Initialized successfully');

    // Set user attributes
    if (userId) {
      await Purchases.logIn(userId);
      console.log('👤 RevenueCat: User logged in:', userId);
    }
  } catch (error) {
    console.error('❌ RevenueCat: Initialization failed', error);
    throw error;
  }
};

/**
 * Identify user in RevenueCat
 * Call this after user logs in
 */
export const identifyRevenueCatUser = async (userId: string): Promise<void> => {
  try {
    console.log('👤 RevenueCat: Identifying user', userId);
    const { customerInfo } = await Purchases.logIn(userId);
    console.log('✅ RevenueCat: User identified', customerInfo);
  } catch (error) {
    console.error('❌ RevenueCat: Failed to identify user', error);
  }
};

/**
 * Log out current user
 */
export const logOutRevenueCatUser = async (): Promise<void> => {
  try {
    console.log('🔄 RevenueCat: Logging out user');
    await Purchases.logOut();
    console.log('✅ RevenueCat: User logged out');
  } catch (error) {
    console.error('❌ RevenueCat: Failed to log out', error);
  }
};

/**
 * Get available subscription packages
 */
export const getSubscriptionPackages = async (): Promise<PurchasesPackage[]> => {
  try {
    console.log('📦 RevenueCat: Fetching packages...');
    const offerings = await Purchases.getOfferings();

    if (offerings.current) {
      const packages = offerings.current.availablePackages;
      console.log('✅ RevenueCat: Found packages:', packages.length);
      return packages;
    }

    console.warn('⚠️ RevenueCat: No offerings available');
    return [];
  } catch (error) {
    console.error('❌ RevenueCat: Failed to fetch packages', error);
    return [];
  }
};

/**
 * Purchase a subscription package
 */
export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<{ customerInfo: CustomerInfo; success: boolean }> => {
  try {
    console.log('💳 RevenueCat: Starting purchase...', pkg.identifier);
    
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    
    const hasAccess = customerInfo.entitlements.active['premium'] !== undefined;
    console.log('✅ RevenueCat: Purchase complete', { hasAccess });

    return { customerInfo, success: hasAccess };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('👤 RevenueCat: User cancelled purchase');
      return { customerInfo: error.customerInfo, success: false };
    }
    
    console.error('❌ RevenueCat: Purchase failed', error);
    throw error;
  }
};

/**
 * Check if user has active subscription to "Cook AI Pro"
 */
export const hasActiveSubscription = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const hasAccess = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    
    console.log('🔍 RevenueCat: Cook AI Pro status:', hasAccess ? '✅' : '❌');
    return hasAccess;
  } catch (error) {
    console.error('❌ RevenueCat: Failed to check subscription', error);
    return false;
  }
};

/**
 * Present RevenueCat Paywall UI
 * This shows the native paywall configured in RevenueCat dashboard
 */
export const showPaywall = async (): Promise<{ didPurchase: boolean; error?: string }> => {
  try {
    console.log('🎨 RevenueCat: Presenting paywall...');
    
    const paywallResult = await presentPaywall();
    
    if (paywallResult === 'PURCHASED' || paywallResult === 'RESTORED') {
      console.log('✅ RevenueCat: User subscribed!');
      return { didPurchase: true };
    } else if (paywallResult === 'CANCELLED') {
      console.log('👤 RevenueCat: User dismissed paywall');
      return { didPurchase: false };
    } else {
      console.log('⚠️ RevenueCat: Paywall result:', paywallResult);
      return { didPurchase: false };
    }
  } catch (error) {
    console.error('❌ RevenueCat: Paywall error:', error);
    return { 
      didPurchase: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Present RevenueCat Customer Center
 * For managing subscriptions, viewing purchase history, etc.
 */
export const showCustomerCenter = async (): Promise<void> => {
  try {
    console.log('👤 RevenueCat: Opening Customer Center...');
    
    // Customer Center is shown via presentPaywall with specific mode
    // For now, we can direct users to subscription management
    const customerInfo = await Purchases.getCustomerInfo();
    
    if (customerInfo.managementURL) {
      console.log('🔗 Management URL:', customerInfo.managementURL);
      // In a real app, you'd open this URL in a browser or WebView
      // Linking.openURL(customerInfo.managementURL);
    }
  } catch (error) {
    console.error('❌ RevenueCat: Customer Center error:', error);
  }
};

/**
 * Get full customer info including entitlements, products, and subscription details
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    
    // Log detailed info for debugging
    console.log('📊 Customer Info:');
    console.log('  - Active Entitlements:', Object.keys(customerInfo.entitlements.active));
    console.log('  - Active Subscriptions:', Object.keys(customerInfo.activeSubscriptions));
    console.log('  - Latest Expiration:', customerInfo.latestExpirationDate);
    console.log('  - Original App User ID:', customerInfo.originalAppUserId);
    
    return customerInfo;
  } catch (error) {
    console.error('❌ RevenueCat: Failed to get customer info', error);
    return null;
  }
};

/**
 * Get available offerings (products)
 * Returns monthly, yearly, and weekly subscription options
 */
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    console.log('📦 RevenueCat: Fetching offerings...');
    const offerings = await Purchases.getOfferings();
    
    if (offerings.current) {
      console.log('✅ Current Offering:', offerings.current.identifier);
      console.log('   Available Packages:');
      offerings.current.availablePackages.forEach(pkg => {
        console.log(`   - ${pkg.identifier}: ${pkg.product.priceString}`);
      });
      
      return offerings.current;
    }
    
    console.warn('⚠️ No current offering available');
    return null;
  } catch (error) {
    console.error('❌ RevenueCat: Failed to get offerings', error);
    return null;
  }
};

/**
 * Get subscription status details
 */
export const getSubscriptionStatus = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    
    if (!entitlement) {
      return {
        isActive: false,
        isPro: false,
        status: 'free',
      };
    }
    
    return {
      isActive: true,
      isPro: true,
      status: 'active',
      productIdentifier: entitlement.productIdentifier,
      willRenew: entitlement.willRenew,
      periodType: entitlement.periodType,
      expirationDate: entitlement.expirationDate,
      originalPurchaseDate: entitlement.originalPurchaseDate,
      store: entitlement.store,
    };
  } catch (error) {
    console.error('❌ RevenueCat: Failed to get subscription status', error);
    return {
      isActive: false,
      isPro: false,
      status: 'error',
    };
  }
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (): Promise<boolean> => {
  try {
    console.log('🔄 RevenueCat: Restoring purchases...');
    const customerInfo = await Purchases.restorePurchases();
    
    const hasAccess = customerInfo.entitlements.active['premium'] !== undefined;
    console.log(`✅ RevenueCat: Restore ${hasAccess ? 'successful' : 'failed'}`);
    
    return hasAccess;
  } catch (error) {
    console.error('❌ RevenueCat: Failed to restore purchases', error);
    return false;
  }
};

/**
 * Set user attributes for analytics
 */
export const setRevenueCatAttributes = async (
  attributes: Record<string, string | null>
): Promise<void> => {
  try {
    console.log('📝 RevenueCat: Setting attributes', attributes);
    await Purchases.setAttributes(attributes);
    console.log('✅ RevenueCat: Attributes set');
  } catch (error) {
    console.error('❌ RevenueCat: Failed to set attributes', error);
  }
};

/**
 * Check if RevenueCat is initialized
 */
export const isRevenueCatReady = (): boolean => {
  return isInitialized;
};

