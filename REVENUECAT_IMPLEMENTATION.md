# RevenueCat Implementation Guide

## ✅ What's Implemented

Complete RevenueCat integration for Cook AI with:
- **Entitlement:** "Cook AI Pro"
- **Products:** monthly, yearly, weekly
- **API Key:** test_dHUQiLAWmMSNTWwWmIyuNlyFgkZ (test key included)

## 🚀 Usage

### Basic Functions

```typescript
import {
  hasActiveSubscription,
  showPaywall,
  showCustomerCenter,
  getSubscriptionStatus,
  restore,
} from '@/utils/subscriptions';

// Check if user has Cook AI Pro
const isPro = await hasActiveSubscription();

// Show paywall
const result = await showPaywall();
if (result.didPurchase) {
  // User subscribed!
}

// Show customer center
await showCustomerCenter();

// Get detailed status
const status = await getSubscriptionStatus();
console.log(status.isPro, status.productIdentifier);

// Restore purchases
const restored = await restore();
```

### In Your Components

```typescript
// Example: Check subscription before premium feature
const handlePremiumFeature = async () => {
  const isPro = await hasActiveSubscription();
  
  if (!isPro) {
    const result = await showPaywall();
    if (!result.didPurchase) {
      return; // User didn't subscribe
    }
  }
  
  // Access premium feature
  doSomethingPremium();
};
```

## 📋 Next Steps

1. **Configure in RevenueCat Dashboard:**
   - Go to https://app.revenuecat.com/
   - Create entitlement: "Cook AI Pro"
   - Add products: monthly, yearly, weekly
   - Configure paywall template
   - Set webhook URL

2. **Build and Test:**
   ```bash
   npx expo prebuild --clean
   npx expo run:ios
   # or
   npx expo run:android
   ```

3. **Test Purchases:**
   - iOS: Use sandbox account
   - Android: Use license tester

## 🔑 API Key

Current key: `test_dHUQiLAWmMSNTWwWmIyuNlyFgkZ`

To update, set in `.env`:
```
EXPO_PUBLIC_REVENUECAT_KEY=your_key_here
```

## 📁 Files

- `utils/revenuecat.ts` - Core RevenueCat functions
- `utils/subscriptions.ts` - Simplified API
- `app/paywall/index.tsx` - Paywall screen
- `config/env.ts` - API key configuration

That's it! Simple implementation ready to use.

