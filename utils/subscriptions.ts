/**
 * RevenueCat Subscription Manager for Cook AI
 * 
 * Handles all subscription management through RevenueCat:
 * - SDK initialization
 * - User identification and logout
 * - Subscription status checking (active/expired/trial)
 * - Purchase flows (initiate purchase, restore purchases)
 * - Error handling for failed transactions
 * - Paywall presentation
 * 
 * Entitlement: "Cook AI Pro"
 * Products: monthly, yearly, weekly (configured in RevenueCat dashboard)
 */

// Re-export all RevenueCat functions for convenience
export {
  initializeRevenueCat as initializeSubscriptions,
  identifyRevenueCatUser as identifyUser,
  logOutRevenueCatUser as logOutUser,
  hasActiveSubscription,
  getSubscriptionStatus,
  restorePurchases as restoreSubscriptions,
  getCustomerInfo,
  getOfferings,
  getSubscriptionPackages,
  purchasePackage,
  showPaywall,
  showCustomerCenter,
  setRevenueCatAttributes as setUserAttributes,
  isRevenueCatReady as isSubscriptionSystemReady,
  ENTITLEMENT_ID,
} from './revenuecat';

/**
 * Check subscription status details
 * Returns information about active subscription, renewal status, expiration, etc.
 */
export const checkSubscriptionStatus = async () => {
  const { getSubscriptionStatus } = await import('./revenuecat');
  return await getSubscriptionStatus();
};

/**
 * Restore previous purchases
 * Returns true if user has active subscription after restore
 */
export const restore = async (): Promise<boolean> => {
  const { restorePurchases } = await import('./revenuecat');
  return await restorePurchases();
};
