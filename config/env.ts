export const ENV = {
  // API Configuration
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://cook-ai-backend-production.up.railway.app/v1',
  
  // App Information
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  
  // Legal URLs
  PRIVACY_POLICY_URL: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || 'https://thecookai.app/privacy',
  TERMS_URL: process.env.EXPO_PUBLIC_TERMS_URL || 'https://thecookai.app/terms',
  
  // OAuth Configuration - Google
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '309896381405-12q8vq0etik491tga7agudbqdl47d7b5.apps.googleusercontent.com', // ✅ Web Client ID
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '309896381405-13inp6o35meaeah9oqipcqq4vruvgbm9.apps.googleusercontent.com', // ✅ iOS Client ID
  GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '309896381405-0ma111ko7c6ppeb1ddcn74b5hn3i3tfl.apps.googleusercontent.com', // ✅ Android Client ID
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '309896381405-12q8vq0etik491tga7agudbqdl47d7b5.apps.googleusercontent.com', // ✅ Web Client ID
  
  // OAuth Configuration - Apple
  APPLE_CLIENT_ID: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID || 'com.thecookai.app.signin', // ✅ Apple Service ID (NOT Google ID)
  APPLE_REDIRECT_URI: process.env.EXPO_PUBLIC_APPLE_REDIRECT_URI || 'https://thecookai.app/auth/callback',
  
  // OAuth Base URLs (if you need to customize)
  GOOGLE_AUTH_BASE_URL: process.env.EXPO_PUBLIC_GOOGLE_AUTH_BASE_URL || 'https://accounts.google.com/o/oauth2/v2/auth',
  GOOGLE_TOKEN_URL: process.env.EXPO_PUBLIC_GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token',
  APPLE_AUTH_BASE_URL: process.env.EXPO_PUBLIC_APPLE_AUTH_BASE_URL || 'https://appleid.apple.com/auth/authorize',
  
  // RevenueCat Configuration
  REVENUECAT_API_KEY: process.env.EXPO_PUBLIC_REVENUECAT_KEY || 'test_dHUQiLAWmMSNTWwWmIyuNlyFgkZ',
} as const;

// Helper to construct full API endpoint URLs
export const getApiEndpoint = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${ENV.API_URL}/${cleanPath}`;
};

// Validate that all required env variables are present
export const validateEnv = (): boolean => {
  const required = [
    'API_URL',
    'PRIVACY_POLICY_URL',
    'TERMS_URL',
  ];
  
  const missing = required.filter(key => !ENV[key as keyof typeof ENV]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  // Warn about subscription API keys
  if (!ENV.REVENUECAT_API_KEY) {
    console.warn('⚠️  REVENUECAT_API_KEY is not set - Using default test key');
  }
  
  console.log('✅ All required environment variables are present');
  return true;
};