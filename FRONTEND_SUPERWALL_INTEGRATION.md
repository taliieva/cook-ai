# Frontend Superwall Integration Guide

## 📋 Overview

This guide shows how to integrate Superwall SDK into the React Native app once backend is ready.

**Current Status:** Placeholder paywall implemented, ready for Superwall SDK integration.

---

## 📦 Installation

### 1. Install Superwall SDK

```bash
npm install @superwall/react-native
# or
yarn add @superwall/react-native
```

### 2. iOS Setup

Add to `ios/Podfile`:
```ruby
pod 'Superwall', '~> 3.0'
```

Then run:
```bash
cd ios && pod install
```

### 3. Android Setup

Add to `android/app/build.gradle`:
```gradle
dependencies {
    implementation 'com.superwall.sdk:superwall-android:3.0.0'
}
```

---

## 🔧 Configuration

### 1. Initialize Superwall

Create `utils/superwall.ts`:

```typescript
import Superwall from '@superwall/react-native';
import { ENV } from '@/config/env';

let isInitialized = false;

export const initializeSuperwall = async (userId?: string) => {
  if (isInitialized) {
    console.log('Superwall already initialized');
    return;
  }

  try {
    console.log('🚀 Initializing Superwall...');
    
    await Superwall.configure({
      apiKey: ENV.SUPERWALL_API_KEY,
    });

    // Set user identity if available
    if (userId) {
      await Superwall.identify(userId);
    }

    // Set user attributes
    await Superwall.setUserAttributes({
      platform: Platform.OS,
      appVersion: '1.0.0',
    });

    isInitialized = true;
    console.log('✅ Superwall initialized successfully');
  } catch (error) {
    console.error('❌ Superwall initialization error:', error);
  }
};

export const showPaywall = async (
  event: string,
  params?: Record<string, any>
) => {
  try {
    console.log(`🔓 Showing Superwall paywall: ${event}`);
    
    const result = await Superwall.register(event, params);
    
    console.log('Paywall result:', result);
    return result;
  } catch (error) {
    console.error('Error showing paywall:', error);
    return null;
  }
};

export const setSuperwallUserId = async (userId: string) => {
  try {
    await Superwall.identify(userId);
    console.log('✅ Superwall user identified:', userId);
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

export const clearSuperwallUser = async () => {
  try {
    await Superwall.reset();
    console.log('✅ Superwall user cleared');
  } catch (error) {
    console.error('Error clearing user:', error);
  }
};
```

---

### 2. Add Environment Variables

Update `config/env.ts`:

```typescript
export const ENV = {
  // ... existing config
  
  // Superwall Configuration
  SUPERWALL_API_KEY: process.env.EXPO_PUBLIC_SUPERWALL_API_KEY || '',
  
  // ... rest of config
};
```

Add to `.env`:
```env
EXPO_PUBLIC_SUPERWALL_API_KEY=pk_your_public_key_here
```

---

## 🎯 Implementation

### 1. Update App Root Layout

Initialize Superwall when app starts:

**File:** `app/_layout.tsx`

```typescript
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { initializeSuperwall } from '@/utils/superwall';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Initialize Superwall on app start
    initializeSuperwall();
  }, []);

  return (
    <AuthProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          {/* ... screens */}
        </Stack>
      </AuthGuard>
    </AuthProvider>
  );
}
```

---

### 2. Replace Paywall Screen

**File:** `app/paywall/index.tsx`

Replace the entire file with Superwall integration:

```typescript
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { showPaywall } from '@/utils/superwall';

export default function PaywallScreen() {
  const router = useRouter();

  useEffect(() => {
    handleShowPaywall();
  }, []);

  const handleShowPaywall = async () => {
    try {
      const result = await showPaywall('onboarding_completed', {
        source: 'post_onboarding',
      });

      // Handle result
      if (result?.didSubscribe) {
        console.log('✅ User subscribed!');
        // Backend will receive webhook, subscription status will update
        router.replace('/main/home');
      } else {
        console.log('👤 User dismissed paywall');
        // User dismissed without subscribing - continue as guest
        router.replace('/auth/sign-in');
      }
    } catch (error) {
      console.error('Paywall error:', error);
      // On error, allow user to continue
      router.replace('/auth/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
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
});
```

---

### 3. Trigger Paywall from Premium Tab

**File:** `app/main/home.tsx`

Update the premium tab handler:

```typescript
import { showPaywall } from '@/utils/superwall';

// Handle upgrade from any component
const handleUpgrade = async () => {
  console.log("🔓 Showing Superwall paywall for upgrade");
  
  const result = await showPaywall('upgrade_clicked', {
    source: 'premium_tab',
    user_plan: userPlan,
  });

  if (result?.didSubscribe) {
    console.log('✅ User subscribed!');
    // Refresh user subscription status
    await checkAuthentication();
  }
};
```

---

### 4. Paywall on Feature Limits

**Example:** When user hits save limit

**File:** `app/main/dishes/index.tsx`

```typescript
import { showPaywall } from '@/utils/superwall';

const handleSave = async (dish: DishData) => {
  // ... existing code ...

  try {
    const res = await saveRecipe(searchId, dish.name);
    if (!res.success) throw new Error(res.error);
  } catch (err: any) {
    const errorMessage = err.message || "Failed to save recipe";
    
    if (errorMessage.includes("Free users can only save") || 
        errorMessage.includes("Upgrade to premium")) {
      // Show Superwall paywall instead of alert
      const result = await showPaywall('save_limit_reached', {
        source: 'recipe_save',
        feature: 'saves',
      });

      if (result?.didSubscribe) {
        // User subscribed - retry save
        const retryRes = await saveRecipe(searchId, dish.name);
        if (retryRes.success) {
          console.log("✅ Recipe saved after subscription");
        }
      }
    } else {
      Alert.alert("Error", errorMessage);
    }
  }
};
```

---

## 📊 Superwall Events

### Event Naming Convention

Use descriptive event names to track where users see paywalls:

```typescript
// Post-onboarding
showPaywall('onboarding_completed', { source: 'post_onboarding' });

// Feature limits
showPaywall('save_limit_reached', { source: 'recipe_save', limit: 10 });
showPaywall('like_limit_reached', { source: 'recipe_like', limit: 20 });

// Premium tab
showPaywall('upgrade_clicked', { source: 'premium_tab' });

// Settings
showPaywall('settings_upgrade', { source: 'profile_menu' });

// Feature discovery
showPaywall('premium_feature_clicked', { 
  source: 'advanced_filters',
  feature: 'cuisine_filter' 
});
```

---

## 🔄 Subscription Status Sync

### 1. Check Subscription on App Launch

**File:** `contexts/AuthContext.tsx`

```typescript
import { initializeSuperwall, setSuperwallUserId } from '@/utils/superwall';

const initializeAuth = async () => {
  try {
    const authResult = await validateAuthState();
    
    if (authResult.isValid && authResult.userData) {
      const userData: User = {
        id: authResult.userData.id,
        // ... other fields
      };
      
      setUser(userData);
      
      // Initialize Superwall with user ID
      await initializeSuperwall(userData.id);
      await setSuperwallUserId(userData.id);
    }
  } catch (error) {
    console.error('Init error:', error);
  }
};
```

---

### 2. Refresh Subscription After Purchase

After a successful subscription, refresh user data:

```typescript
const handleSuccessfulSubscription = async () => {
  try {
    // Wait a moment for webhook to process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Refresh auth state (includes subscription status)
    const authResult = await validateAuthState();
    
    if (authResult.userData?.subscriptionStatus === 'active') {
      console.log('✅ Subscription activated');
      setUser(authResult.userData);
    } else {
      // Webhook might still be processing
      console.log('⏳ Waiting for subscription activation...');
    }
  } catch (error) {
    console.error('Error refreshing subscription:', error);
  }
};
```

---

## 🎨 Customizing Superwall Paywall

### Configure Paywall in Superwall Dashboard

1. **Log in to Superwall Dashboard**
2. **Create Paywall Templates**
   - Design your paywall UI
   - Add product cards
   - Configure CTAs

3. **Set Up Products**
   - Monthly: $8.99/month
   - Yearly: $49.99/year (save 50%)

4. **Configure Events**
   - Map event names to paywalls
   - Set rules (when to show)

5. **A/B Testing**
   - Create variants
   - Track conversion rates

---

## 🧪 Testing Superwall

### 1. Sandbox Mode

Test subscriptions without real payments:

```typescript
// In development
if (__DEV__) {
  await Superwall.configure({
    apiKey: ENV.SUPERWALL_API_KEY,
    options: {
      isTestMode: true, // Enable sandbox mode
    },
  });
}
```

---

### 2. Test Subscription Flow

```typescript
// Test paywall display
const testPaywall = async () => {
  console.log('🧪 Testing paywall...');
  
  const result = await showPaywall('test_event', {
    test: true,
  });
  
  console.log('Test result:', result);
};
```

---

### 3. Verify Webhook Reception

After test purchase:
1. Check backend logs for webhook
2. Verify subscription_status updated in database
3. Confirm frontend receives updated status

---

## 📱 Platform-Specific Notes

### iOS

- **StoreKit** integration handled by Superwall
- Test with **Sandbox accounts** in App Store Connect
- **Receipt validation** handled automatically

### Android

- **Google Play Billing** integration handled by Superwall
- Test with **License Testing** accounts
- **Purchase verification** automatic

---

## 🚨 Error Handling

### Handle Paywall Errors

```typescript
const handleShowPaywall = async () => {
  try {
    const result = await showPaywall('event_name');
    
    if (result?.error) {
      console.error('Paywall error:', result.error);
      
      // Show fallback UI or skip
      Alert.alert(
        'Unable to Load Payment Options',
        'Please try again later or continue with free features.',
        [
          { text: 'Try Again', onPress: handleShowPaywall },
          { text: 'Continue Free', onPress: () => router.replace('/main/home') },
        ]
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // Allow user to continue
    router.replace('/main/home');
  }
};
```

---

## 📊 Analytics Integration

### Track Paywall Events

```typescript
import analytics from '@react-native-firebase/analytics';

// When paywall shown
Superwall.addEventListener('paywall_presented', (event) => {
  analytics().logEvent('paywall_shown', {
    event_name: event.name,
    source: event.params?.source,
  });
});

// When user subscribes
Superwall.addEventListener('subscription_started', (event) => {
  analytics().logEvent('subscription_purchase', {
    product_id: event.productId,
    price: event.price,
    currency: event.currency,
  });
});

// When paywall dismissed
Superwall.addEventListener('paywall_dismissed', (event) => {
  analytics().logEvent('paywall_dismissed', {
    event_name: event.name,
    did_subscribe: false,
  });
});
```

---

## ✅ Implementation Checklist

### Setup
- [ ] Install Superwall SDK
- [ ] Add API key to environment
- [ ] Initialize in app root
- [ ] Configure iOS/Android

### Integration Points
- [ ] Replace paywall screen with Superwall
- [ ] Add Superwall to premium tab
- [ ] Add Superwall on save limit
- [ ] Add Superwall on like limit
- [ ] Add Superwall in profile menu

### User Flow
- [ ] Identify user on login
- [ ] Clear user on logout
- [ ] Sync subscription status
- [ ] Handle purchase completion
- [ ] Handle errors gracefully

### Testing
- [ ] Test paywall display
- [ ] Test subscription purchase (sandbox)
- [ ] Test webhook reception
- [ ] Test subscription status sync
- [ ] Test on iOS and Android

### Polish
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add analytics tracking
- [ ] Test offline behavior
- [ ] Add restore purchases option

---

## 🔗 Resources

- [Superwall React Native Docs](https://docs.superwall.com/docs/react-native)
- [Superwall Dashboard](https://superwall.com/dashboard)
- [Paywall Design Best Practices](https://docs.superwall.com/docs/best-practices)

---

## 🎯 Next Steps

1. **Wait for Backend** - Let backend team implement webhook handlers first
2. **Get API Keys** - Obtain Superwall API keys (dev + prod)
3. **Install SDK** - Run installation commands
4. **Replace Placeholder** - Swap paywall screen with Superwall
5. **Test End-to-End** - Test full subscription flow
6. **Deploy** - Push to production!

---

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Status:** Ready for Implementation (after backend)

Once backend is ready with webhook handlers, frontend integration will take ~2-3 hours! 🚀

