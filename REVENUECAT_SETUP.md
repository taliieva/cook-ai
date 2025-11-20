# RevenueCat Integration - Complete Setup Guide

## ✅ Frontend Implementation Status

The Cook AI app now has a **complete RevenueCat integration** with all unused subscription code removed.

### What's Implemented

#### 1. SDK Initialization ✅
- RevenueCat SDK initializes on app startup in `app/_layout.tsx`
- Uses test API key: `test_dHUQiLAWmMSNTWwWmIyuNlyFgkZ`
- Automatic user identification on login
- Proper cleanup on logout

#### 2. Subscription Status Checking ✅
- Real-time subscription validation via `hasActiveSubscription()`
- Entitlement ID: **"Cook AI Pro"**
- Automatic status sync on app launch and login
- Fallback to backend status if RevenueCat fails

#### 3. User Identification ✅
- Users are automatically identified in RevenueCat on login
- User ID from backend is used as RevenueCat App User ID
- Proper logout flow clears RevenueCat user data

#### 4. Purchase Flows ✅
- **Show Paywall**: `showPaywall()` - presents native RevenueCat paywall UI
- **Purchase Package**: `purchasePackage()` - initiates subscription purchase
- **Restore Purchases**: `restoreSubscriptions()` - restores previous purchases
- **Get Offerings**: `getOfferings()` - fetches available subscription packages

#### 5. Error Handling ✅
- Comprehensive try-catch blocks on all subscription operations
- User-cancelled purchases handled gracefully
- Network errors logged and reported
- Fallback mechanisms for failed operations

#### 6. Paywall Logic ✅
- Paywall shown after onboarding completion
- Feature-gated paywall triggers (like/save limits)
- Premium tab in navigation opens paywall
- Guest users see paywall prompts

#### 7. Integration Points ✅
- **AuthContext**: Syncs subscription status with RevenueCat
- **Paywall Screen**: Shows native RevenueCat paywall UI
- **Feature Gates**: Premium upgrade prompts throughout app
- **Subscription Button**: Example component for subscription UI

---

## 🔧 RevenueCat Dashboard Configuration

### Products to Configure

You'll need to create these products in the RevenueCat dashboard:

1. **Monthly Subscription** (`monthly`)
   - Display name: "Monthly Pro"
   - Description: "Unlimited access, billed monthly"
   
2. **Yearly Subscription** (`yearly`)
   - Display name: "Yearly Pro"
   - Description: "Best value - save 40%!"
   
3. **Weekly Subscription** (`weekly`)
   - Display name: "Weekly Pro"
   - Description: "Try for a week"

### Entitlement Configuration

**Entitlement ID**: `Cook AI Pro`

This entitlement should be attached to all subscription products above.

### Paywall Configuration

1. Go to RevenueCat Dashboard → Paywalls
2. Create a new paywall or customize the default one
3. Add your subscription packages
4. Configure the UI to match your brand
5. Test the paywall in development mode

---

## 🔌 Backend Integration Requirements

### Current Status

The frontend currently:
- ✅ Checks subscription status via RevenueCat SDK
- ✅ Identifies users in RevenueCat
- ❌ **Does NOT call backend for subscription validation**
- ❌ **Does NOT send subscription events to backend**

### Recommended Backend Endpoints

To fully integrate RevenueCat with your backend, you should implement these endpoints:

#### 1. Webhook Endpoint for RevenueCat Events

**Endpoint**: `POST /api/v1/subscriptions/webhook`

**Purpose**: Receive real-time subscription events from RevenueCat

**Events to Handle**:
- `INITIAL_PURCHASE` - User purchased for the first time
- `RENEWAL` - Subscription renewed
- `CANCELLATION` - Subscription cancelled
- `EXPIRATION` - Subscription expired
- `BILLING_ISSUE` - Payment failed

**Example Payload** (from RevenueCat):
```json
{
  "event": {
    "type": "INITIAL_PURCHASE",
    "app_user_id": "user123",
    "product_id": "monthly_subscription",
    "price": 9.99,
    "currency": "USD",
    "purchased_at_ms": 1700000000000,
    "entitlements": ["Cook AI Pro"]
  }
}
```

**What to Do**:
1. Verify webhook signature (RevenueCat provides signature in header)
2. Update user's subscription status in your database
3. Grant/revoke access to premium features
4. Log the event for analytics
5. Send confirmation emails if needed

**Implementation Note**:
```typescript
// In your backend
router.post('/subscriptions/webhook', async (req, res) => {
  // 1. Verify signature
  const signature = req.headers['x-revenuecat-signature'];
  if (!verifyRevenueCatSignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. Parse event
  const { event } = req.body;
  const userId = event.app_user_id;

  // 3. Update user subscription status
  await updateUserSubscription(userId, {
    status: event.type === 'INITIAL_PURCHASE' || event.type === 'RENEWAL' ? 'pro' : 'free',
    productId: event.product_id,
    expiresAt: event.expiration_at_ms,
  });

  // 4. Send response
  res.status(200).json({ success: true });
});
```

#### 2. Subscription Status Verification Endpoint

**Endpoint**: `GET /api/v1/subscriptions/status`

**Purpose**: Backend-side verification of subscription status

**Headers**: 
- `Authorization: Bearer <accessToken>`

**Response**:
```json
{
  "success": true,
  "data": {
    "isPro": true,
    "subscriptionStatus": "active",
    "productId": "monthly_subscription",
    "expiresAt": "2024-12-31T23:59:59Z",
    "willRenew": true
  }
}
```

**When to Use**:
- When backend needs to verify premium features
- For server-side feature gating
- For audit logs

**Implementation Note**:
```typescript
// Frontend can optionally call this to sync status
const syncSubscriptionWithBackend = async () => {
  const response = await fetchWithAuth(`${ENV.API_URL}/subscriptions/status`);
  const data = await response.json();
  return data;
};
```

#### 3. Update User Subscription Endpoint

**Endpoint**: `POST /api/v1/subscriptions/sync`

**Purpose**: Manually sync RevenueCat status with backend (if needed)

**Headers**: 
- `Authorization: Bearer <accessToken>`

**Body**:
```json
{
  "revenueCatUserId": "user123",
  "isPro": true,
  "productId": "yearly_subscription"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Subscription status updated"
}
```

---

## 🔐 Security & Configuration

### Environment Variables

Update your backend `.env` file:

```env
# RevenueCat Configuration
REVENUECAT_PUBLIC_KEY=test_dHUQiLAWmMSNTWwWmIyuNlyFgkZ
REVENUECAT_SECRET_KEY=your_secret_key_here  # Get from RevenueCat Dashboard
REVENUECAT_WEBHOOK_SECRET=your_webhook_secret  # For signature verification
```

### Webhook Setup in RevenueCat Dashboard

1. Go to RevenueCat Dashboard → Integrations → Webhooks
2. Click "Add Webhook"
3. Enter your webhook URL: `https://your-backend.com/api/v1/subscriptions/webhook`
4. Copy the webhook secret key
5. Select events to receive (recommend all events)
6. Save

### Testing Webhooks

Use RevenueCat's test mode to send test events:

```bash
# From RevenueCat dashboard, use "Send Test Event" button
# Or use their webhook testing tool
```

---

## 📱 Frontend Usage Examples

### Check Subscription Status

```typescript
import { hasActiveSubscription } from '@/utils/subscriptions';

const isPro = await hasActiveSubscription();
if (isPro) {
  // Grant access to premium feature
}
```

### Show Paywall

```typescript
import { showPaywall } from '@/utils/subscriptions';

const result = await showPaywall();
if (result.didPurchase) {
  console.log('User subscribed!');
  // Refresh UI to show premium features
}
```

### Get Subscription Details

```typescript
import { getSubscriptionStatus } from '@/utils/subscriptions';

const status = await getSubscriptionStatus();
console.log('Status:', status.status);
console.log('Product:', status.productIdentifier);
console.log('Expires:', status.expirationDate);
```

### Restore Purchases

```typescript
import { restoreSubscriptions } from '@/utils/subscriptions';

const restored = await restoreSubscriptions();
if (restored) {
  console.log('Purchases restored successfully!');
}
```

---

## 🧪 Testing

### Test Mode Configuration

The app is currently using the **test API key**, which means:
- No real charges will be made
- Sandbox purchases work
- RevenueCat dashboard shows test data

### Testing Checklist

- [ ] Test subscription purchase flow (monthly, yearly, weekly)
- [ ] Test subscription restore
- [ ] Test cancellation
- [ ] Test renewal
- [ ] Test expired subscription handling
- [ ] Test webhook reception on backend
- [ ] Test feature gating (like/save limits)
- [ ] Test user logout clears subscription data
- [ ] Test guest user upgrade flow

---

## 🚀 Next Steps

### For You (Frontend):
1. Configure products in RevenueCat dashboard
2. Customize paywall UI to match your brand
3. Test purchase flows thoroughly
4. Update to production API key when ready

### For Your Backend Developer:
1. Implement webhook endpoint (`POST /subscriptions/webhook`)
2. Add webhook signature verification
3. Update user subscription status in database
4. Set up webhook URL in RevenueCat dashboard
5. Test webhook reception with test events
6. Implement optional status verification endpoint

### Optional Enhancements:
- Add subscription management screen (view/cancel subscription)
- Add promotional offers support
- Add intro pricing support
- Add family sharing support (iOS)
- Add subscription analytics tracking

---

## 📚 Additional Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [React Native SDK Guide](https://docs.revenuecat.com/docs/reactnative)
- [Webhook Integration](https://docs.revenuecat.com/docs/webhooks)
- [Testing Subscriptions](https://docs.revenuecat.com/docs/sandbox)

---

## 💡 Important Notes

1. **User ID Mapping**: The frontend uses your backend's user ID as RevenueCat's App User ID. This ensures proper user tracking across both systems.

2. **Offline Handling**: RevenueCat caches subscription status locally, so the app works offline. The SDK automatically syncs when online.

3. **Platform Differences**: 
   - iOS uses App Store
   - Android uses Google Play
   - RevenueCat handles both seamlessly

4. **Entitlement First**: The app checks for the `"Cook AI Pro"` entitlement, not specific product IDs. This allows you to change pricing without code changes.

5. **Backend is Optional**: The current implementation works without backend integration. RevenueCat handles everything. Backend integration is only needed for:
   - Server-side feature gating
   - Custom subscription logic
   - Analytics and reporting
   - Email notifications

---

## 🐛 Troubleshooting

### "No offerings available"
- Check that products are configured in RevenueCat dashboard
- Ensure products are linked to the correct app
- Verify API key is correct

### "Purchase failed"
- Check sandbox account is signed in (iOS)
- Verify test card is set up (Android)
- Check logs for specific error message

### "User not identified"
- Ensure user logs in before making purchase
- Check that `identifyUser()` is called on login
- Verify user ID is valid

### Webhook not receiving events
- Check webhook URL is correct and accessible
- Verify webhook secret is correct
- Check firewall/security settings on backend
- Test with RevenueCat's "Send Test Event" feature

---

**Status**: ✅ Frontend implementation complete. Ready for backend integration.

