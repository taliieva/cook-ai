# Backend Integration for Superwall - Complete Specification

## 📋 Overview

This document specifies all backend changes needed to support Superwall subscription management in the Cook AI app.

**Superwall** is the paywall/subscription management SDK that handles:
- Subscription purchases (iOS/Android)
- Trial management
- Plan upgrades/downgrades
- Subscription status tracking

---

## 🎯 What Backend Needs to Do

1. **Track User Subscription Status** - Store and manage subscription state
2. **Process Webhook Events** - Receive real-time updates from Superwall
3. **Provide Subscription API** - Let frontend check subscription status
4. **Enforce Feature Limits** - Restrict free vs premium features
5. **Handle Subscription Lifecycle** - Trials, renewals, cancellations

---

## 📊 Database Schema Changes

### 1. Update `users` Table

Add subscription-related fields to existing user table:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_provider VARCHAR(50); -- 'superwall', 'stripe', etc.
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_external_id VARCHAR(255); -- Superwall customer ID
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_cancelled_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_trial_ends_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_auto_renew BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_platform VARCHAR(20); -- 'ios', 'android', 'web'
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_subscription_event VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_subscription_event_at TIMESTAMP;
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `subscription_status` | VARCHAR | Current status: `free`, `active`, `trial`, `expired`, `cancelled` |
| `subscription_tier` | VARCHAR | Plan tier: `free`, `monthly`, `yearly` |
| `subscription_provider` | VARCHAR | Payment provider: `superwall`, `stripe` |
| `subscription_external_id` | VARCHAR | Superwall's customer/subscription ID |
| `subscription_started_at` | TIMESTAMP | When subscription started |
| `subscription_expires_at` | TIMESTAMP | When subscription expires/renews |
| `subscription_cancelled_at` | TIMESTAMP | When user cancelled (if applicable) |
| `subscription_trial_ends_at` | TIMESTAMP | Trial period end date |
| `subscription_auto_renew` | BOOLEAN | Whether subscription will auto-renew |
| `subscription_platform` | VARCHAR | Purchase platform: `ios`, `android`, `web` |
| `last_subscription_event` | VARCHAR | Last webhook event type received |
| `last_subscription_event_at` | TIMESTAMP | When last event was received |

---

### 2. Create `subscription_events` Table

Track all subscription events for audit/debugging:

```sql
CREATE TABLE IF NOT EXISTS subscription_events (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'superwall',
    external_id VARCHAR(255),
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_event_type (event_type),
    INDEX idx_external_id (external_id),
    INDEX idx_created_at (created_at)
);
```

**Purpose:** 
- Audit trail of all subscription changes
- Debugging webhook issues
- Analytics on subscription behavior

---

### 3. Create `subscription_limits` Table

Track usage limits for free vs premium users:

```sql
CREATE TABLE IF NOT EXISTS subscription_limits (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    recipes_saved_count INT DEFAULT 0,
    recipes_liked_count INT DEFAULT 0,
    recipes_generated_count INT DEFAULT 0,
    ai_searches_count INT DEFAULT 0,
    last_reset_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id)
);
```

**Purpose:** Track free tier usage limits
- Free users: 10 saves, 20 likes, unlimited browsing
- Premium users: Unlimited everything

---

## 🔌 API Endpoints Required

### 1. Get Subscription Status

**Endpoint:** `GET /api/v1/users/subscription`

**Authentication:** Required (Bearer token)

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "active",
    "tier": "yearly",
    "provider": "superwall",
    "isActive": true,
    "isPremium": true,
    "isTrialing": false,
    "startedAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2025-01-15T10:30:00Z",
    "trialEndsAt": null,
    "autoRenew": true,
    "platform": "ios",
    "limits": {
      "saveRecipes": "unlimited",
      "likeRecipes": "unlimited",
      "aiSearches": "unlimited"
    },
    "usage": {
      "recipesSaved": 45,
      "recipesLiked": 120,
      "recipesGenerated": 230
    }
  }
}
```

**Status Values:**
- `free` - No active subscription
- `trial` - In trial period
- `active` - Active paid subscription
- `cancelled` - Cancelled but still active until expiry
- `expired` - Subscription expired

---

### 2. Update Subscription (Internal Use)

**Endpoint:** `POST /api/v1/admin/users/:userId/subscription`

**Authentication:** Admin/Internal only

**Request Body:**
```json
{
  "status": "active",
  "tier": "yearly",
  "provider": "superwall",
  "externalId": "sub_1234567890",
  "startedAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2025-01-15T10:30:00Z",
  "platform": "ios"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "userId": "user123",
    "subscription": { /* subscription object */ }
  }
}
```

---

### 3. Superwall Webhook Endpoint

**Endpoint:** `POST /api/v1/webhooks/superwall`

**Authentication:** Superwall webhook signature verification

**Headers:**
```
X-Superwall-Signature: sha256_signature_here
Content-Type: application/json
```

**Webhook Events to Handle:**

#### Event 1: `subscription_started`
```json
{
  "event": "subscription_started",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "subscriptionId": "sub_1234567890",
    "userId": "user123",
    "customerId": "cus_abc123",
    "productId": "yearly_premium",
    "platform": "ios",
    "price": 49.99,
    "currency": "USD",
    "startDate": "2024-01-15T10:30:00Z",
    "expiryDate": "2025-01-15T10:30:00Z",
    "isTrialing": false
  }
}
```

**Backend Action:**
- Update user subscription_status to `active`
- Set subscription_tier to `yearly` or `monthly`
- Store subscription_external_id
- Set subscription_started_at and subscription_expires_at
- Remove usage limits

---

#### Event 2: `trial_started`
```json
{
  "event": "trial_started",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "subscriptionId": "sub_1234567890",
    "userId": "user123",
    "productId": "yearly_premium",
    "trialEndDate": "2024-01-22T10:30:00Z"
  }
}
```

**Backend Action:**
- Update subscription_status to `trial`
- Set subscription_trial_ends_at
- Grant premium features during trial

---

#### Event 3: `trial_converted`
```json
{
  "event": "trial_converted",
  "timestamp": "2024-01-22T10:30:00Z",
  "data": {
    "subscriptionId": "sub_1234567890",
    "userId": "user123",
    "productId": "yearly_premium",
    "convertedAt": "2024-01-22T10:30:00Z"
  }
}
```

**Backend Action:**
- Update subscription_status to `active`
- Clear trial_ends_at
- Confirm premium access

---

#### Event 4: `subscription_renewed`
```json
{
  "event": "subscription_renewed",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "subscriptionId": "sub_1234567890",
    "userId": "user123",
    "newExpiryDate": "2026-01-15T10:30:00Z"
  }
}
```

**Backend Action:**
- Update subscription_expires_at
- Ensure subscription_status is `active`
- Log renewal event

---

#### Event 5: `subscription_cancelled`
```json
{
  "event": "subscription_cancelled",
  "timestamp": "2024-06-15T10:30:00Z",
  "data": {
    "subscriptionId": "sub_1234567890",
    "userId": "user123",
    "cancelledAt": "2024-06-15T10:30:00Z",
    "expiryDate": "2025-01-15T10:30:00Z"
  }
}
```

**Backend Action:**
- Update subscription_status to `cancelled`
- Set subscription_cancelled_at
- Keep premium access until expiry date
- Set auto_renew to false

---

#### Event 6: `subscription_expired`
```json
{
  "event": "subscription_expired",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "subscriptionId": "sub_1234567890",
    "userId": "user123",
    "expiredAt": "2025-01-15T10:30:00Z"
  }
}
```

**Backend Action:**
- Update subscription_status to `expired` or `free`
- Clear premium access
- Restore free tier limits
- Reset usage counters

---

### 4. Check Feature Access

**Endpoint:** `GET /api/v1/users/features/check`

**Authentication:** Required

**Query Parameters:**
- `feature` - Feature to check: `save_recipe`, `like_recipe`, `premium_mode`

**Response:**
```json
{
  "success": true,
  "data": {
    "feature": "save_recipe",
    "hasAccess": true,
    "reason": "active_subscription",
    "limit": "unlimited",
    "usage": 45,
    "isPremium": true
  }
}
```

**If no access:**
```json
{
  "success": false,
  "error": "Free users can only save 10 recipes. Upgrade to Premium for unlimited saves!",
  "data": {
    "feature": "save_recipe",
    "hasAccess": false,
    "reason": "limit_reached",
    "limit": 10,
    "usage": 10,
    "isPremium": false,
    "upgradeRequired": true
  }
}
```

---

## 🔒 Feature Limits Configuration

### Free Tier Limits
```json
{
  "tier": "free",
  "limits": {
    "saveRecipes": 10,
    "likeRecipes": 20,
    "aiSearchesPerDay": 50,
    "recipesGeneratedPerDay": 10,
    "advancedFilters": false,
    "offlineMode": false,
    "adFree": false
  }
}
```

### Premium Tier
```json
{
  "tier": "premium",
  "limits": {
    "saveRecipes": "unlimited",
    "likeRecipes": "unlimited",
    "aiSearchesPerDay": "unlimited",
    "recipesGeneratedPerDay": "unlimited",
    "advancedFilters": true,
    "offlineMode": true,
    "adFree": true
  }
}
```

---

## 🔐 Webhook Security

### Verify Superwall Webhook Signature

**Node.js Example:**
```javascript
const crypto = require('crypto');

function verifySuperwallWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  const expectedSignature = `sha256=${digest}`;
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Usage in webhook handler
app.post('/api/v1/webhooks/superwall', (req, res) => {
  const signature = req.headers['x-superwall-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.SUPERWALL_WEBHOOK_SECRET;
  
  if (!verifySuperwallWebhook(payload, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook...
});
```

---

## 📝 Backend Logic Examples

### 1. Check if User Can Save Recipe

```javascript
async function canUserSaveRecipe(userId) {
  const user = await db.users.findById(userId);
  
  // Premium users - unlimited
  if (user.subscription_status === 'active' || 
      user.subscription_status === 'trial') {
    return { allowed: true, reason: 'premium' };
  }
  
  // Free users - check limit
  const limits = await db.subscription_limits.findByUserId(userId);
  
  if (limits.recipes_saved_count >= 10) {
    return {
      allowed: false,
      reason: 'limit_reached',
      message: 'Free users can only save 10 recipes. Upgrade to Premium!',
      currentUsage: limits.recipes_saved_count,
      limit: 10
    };
  }
  
  return {
    allowed: true,
    reason: 'free_tier',
    remaining: 10 - limits.recipes_saved_count
  };
}
```

### 2. Process Subscription Started Webhook

```javascript
async function handleSubscriptionStarted(webhookData) {
  const { subscriptionId, userId, productId, startDate, expiryDate } = webhookData.data;
  
  // Determine tier from product ID
  const tier = productId.includes('yearly') ? 'yearly' : 'monthly';
  
  // Update user subscription
  await db.users.update(userId, {
    subscription_status: 'active',
    subscription_tier: tier,
    subscription_provider: 'superwall',
    subscription_external_id: subscriptionId,
    subscription_started_at: new Date(startDate),
    subscription_expires_at: new Date(expiryDate),
    subscription_platform: webhookData.data.platform,
    subscription_auto_renew: true,
    last_subscription_event: 'subscription_started',
    last_subscription_event_at: new Date()
  });
  
  // Log event
  await db.subscription_events.create({
    id: `evt_${Date.now()}`,
    user_id: userId,
    event_type: 'subscription_started',
    event_data: webhookData,
    provider: 'superwall',
    external_id: subscriptionId,
    processed: true,
    processed_at: new Date()
  });
  
  // Remove usage limits
  await db.subscription_limits.update(userId, {
    recipes_saved_count: 0,
    recipes_liked_count: 0,
    last_reset_at: new Date()
  });
  
  console.log(`✅ Subscription activated for user ${userId}`);
}
```

### 3. Process Subscription Expired Webhook

```javascript
async function handleSubscriptionExpired(webhookData) {
  const { userId, subscriptionId } = webhookData.data;
  
  // Downgrade to free tier
  await db.users.update(userId, {
    subscription_status: 'free',
    subscription_tier: 'free',
    subscription_auto_renew: false,
    last_subscription_event: 'subscription_expired',
    last_subscription_event_at: new Date()
  });
  
  // Log event
  await db.subscription_events.create({
    id: `evt_${Date.now()}`,
    user_id: userId,
    event_type: 'subscription_expired',
    event_data: webhookData,
    provider: 'superwall',
    external_id: subscriptionId,
    processed: true,
    processed_at: new Date()
  });
  
  // Reset usage limits to free tier
  await db.subscription_limits.update(userId, {
    recipes_saved_count: 0,
    recipes_liked_count: 0,
    last_reset_at: new Date()
  });
  
  console.log(`⚠️ Subscription expired for user ${userId}`);
}
```

---

## 🧪 Testing Endpoints

### Test Subscription Creation
```bash
curl -X POST http://localhost:3000/api/v1/admin/users/user123/subscription \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "status": "active",
    "tier": "yearly",
    "provider": "superwall",
    "externalId": "test_sub_123",
    "startedAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2025-01-15T10:30:00Z",
    "platform": "ios"
  }'
```

### Test Get Subscription Status
```bash
curl -X GET http://localhost:3000/api/v1/users/subscription \
  -H "Authorization: Bearer USER_TOKEN"
```

### Test Feature Access Check
```bash
curl -X GET "http://localhost:3000/api/v1/users/features/check?feature=save_recipe" \
  -H "Authorization: Bearer USER_TOKEN"
```

### Test Webhook (Manual)
```bash
curl -X POST http://localhost:3000/api/v1/webhooks/superwall \
  -H "Content-Type: application/json" \
  -H "X-Superwall-Signature: sha256_test_signature" \
  -d '{
    "event": "subscription_started",
    "timestamp": "2024-01-15T10:30:00Z",
    "data": {
      "subscriptionId": "test_sub_123",
      "userId": "user123",
      "productId": "yearly_premium",
      "platform": "ios",
      "startDate": "2024-01-15T10:30:00Z",
      "expiryDate": "2025-01-15T10:30:00Z"
    }
  }'
```

---

## 📊 Analytics & Monitoring

### Metrics to Track

1. **Subscription Metrics:**
   - New subscriptions per day
   - Trial conversion rate
   - Churn rate
   - Revenue by tier (monthly vs yearly)

2. **Usage Metrics:**
   - Free tier limit hits (when users hit save/like limits)
   - Feature usage by tier
   - Most popular premium features

3. **Webhook Health:**
   - Webhook success/failure rate
   - Processing time
   - Failed events that need retry

---

## 🚨 Error Handling

### Webhook Failures

If webhook processing fails:

1. **Log the error:**
```javascript
await db.subscription_events.create({
  user_id: userId,
  event_type: webhookData.event,
  event_data: webhookData,
  processed: false,
  error_message: error.message,
  created_at: new Date()
});
```

2. **Implement retry logic:**
```javascript
async function retryFailedWebhooks() {
  const failedEvents = await db.subscription_events.findAll({
    processed: false,
    created_at: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24h
  });
  
  for (const event of failedEvents) {
    try {
      await processWebhookEvent(event.event_data);
      await db.subscription_events.update(event.id, {
        processed: true,
        processed_at: new Date()
      });
    } catch (error) {
      console.error(`Retry failed for event ${event.id}:`, error);
    }
  }
}
```

3. **Alert on repeated failures:**
- Send alert if same event fails 3+ times
- Manual intervention may be needed

---

## 🔄 Subscription State Machine

```
┌─────────┐
│  free   │ ◄─────────────────────┐
└────┬────┘                       │
     │                            │
     │ (purchase)                 │
     ↓                            │
┌─────────┐                       │
│  trial  │                       │
└────┬────┘                       │
     │                            │
     │ (convert/purchase)         │ (expire/cancel)
     ↓                            │
┌──────────┐                      │
│  active  │ ─────────────────────┤
└────┬─────┘                      │
     │                            │
     │ (cancel)                   │
     ↓                            │
┌────────────┐                    │
│ cancelled  │ ───────────────────┘
└────────────┘  (expires)
```

---

## ✅ Implementation Checklist

### Database Changes
- [ ] Add subscription fields to users table
- [ ] Create subscription_events table
- [ ] Create subscription_limits table
- [ ] Add indexes for performance
- [ ] Create migration scripts

### API Endpoints
- [ ] GET /api/v1/users/subscription
- [ ] POST /api/v1/admin/users/:userId/subscription
- [ ] POST /api/v1/webhooks/superwall
- [ ] GET /api/v1/users/features/check

### Webhook Handlers
- [ ] Implement signature verification
- [ ] Handle subscription_started
- [ ] Handle trial_started
- [ ] Handle trial_converted
- [ ] Handle subscription_renewed
- [ ] Handle subscription_cancelled
- [ ] Handle subscription_expired

### Business Logic
- [ ] Implement feature limit checks
- [ ] Implement usage tracking
- [ ] Implement premium feature gates
- [ ] Add subscription status to user auth response

### Testing
- [ ] Unit tests for webhook handlers
- [ ] Integration tests for subscription flow
- [ ] Test free tier limits
- [ ] Test premium tier access
- [ ] Test webhook signature verification

### Monitoring
- [ ] Add logging for all subscription events
- [ ] Set up alerts for webhook failures
- [ ] Track subscription metrics
- [ ] Monitor usage patterns

---

## 📚 Additional Resources

### Superwall Documentation
- [Superwall Webhooks](https://docs.superwall.com/docs/webhooks)
- [Subscription Events](https://docs.superwall.com/docs/events)
- [Security Best Practices](https://docs.superwall.com/docs/security)

### Environment Variables Needed
```env
SUPERWALL_API_KEY=your_api_key_here
SUPERWALL_WEBHOOK_SECRET=your_webhook_secret_here
SUPERWALL_PUBLIC_KEY=your_public_key_here
```

---

## 🤝 Frontend-Backend Contract

### What Frontend Sends:
- User authentication token (in all requests)
- Feature check requests (to verify access)
- Superwall event tracking data

### What Backend Returns:
- Current subscription status
- Feature access permissions
- Usage limits and current usage
- Premium feature availability

### Real-time Sync:
- Backend updates subscription status via webhooks
- Frontend checks status before premium actions
- Frontend shows upgrade prompts when limits reached

---

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Status:** Ready for Implementation

---

## 📞 Questions for Backend Developer

If anything is unclear, please ask:
1. Which database are you using? (PostgreSQL, MySQL, MongoDB?)
2. What framework? (Node.js/Express, Python/Django, etc.)
3. Do you need help with specific webhook implementation?
4. Any existing subscription system to migrate from?

I can provide code examples in your specific tech stack! 🚀

