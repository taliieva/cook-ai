import * as SecureStore from 'expo-secure-store';

const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

/**
 * Mark onboarding as completed
 * This prevents users from seeing onboarding screens again
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await SecureStore.setItemAsync(ONBOARDING_COMPLETED_KEY, 'true');
    console.log('✅ Onboarding marked as completed');
  } catch (error) {
    console.error('Error setting onboarding completed:', error);
  }
}

/**
 * Check if user has completed onboarding
 * Returns true if onboarding is completed, false otherwise
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const completed = await SecureStore.getItemAsync(ONBOARDING_COMPLETED_KEY);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

/**
 * Reset onboarding status (useful for testing or account deletion)
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ONBOARDING_COMPLETED_KEY);
    console.log('✅ Onboarding status reset');
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
}

