import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPromptModal } from './LoginPromptModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Requires full authentication (not guest)
  requirePremium?: boolean; // Requires premium subscription
  redirectOnGuest?: boolean; // Show login modal for guests
  feature?: 'like' | 'save' | 'view_saved' | 'view_liked' | 'premium';
}

/**
 * ProtectedRoute - Component for protecting entire screens/routes
 * 
 * Usage:
 * <ProtectedRoute requireAuth={true} feature="view_saved">
 *   <SavedRecipesScreen />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requirePremium = false,
  redirectOnGuest = true,
  feature = 'view_saved',
}) => {
  const { isAuthenticated, isGuest, isPremium, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Check if user meets requirements
  const hasAccess = () => {
    if (requirePremium && !isPremium) return false;
    if (requireAuth && (!isAuthenticated || isGuest)) return false;
    return true;
  };

  // Show login modal for guests if required
  if (!hasAccess() && redirectOnGuest && isGuest) {
    return (
      <View style={styles.container}>
        <LoginPromptModal
          visible={true}
          onClose={() => {
            // User closed modal - they stay as guest
            // You might want to navigate them back
          }}
          feature={feature}
        />
      </View>
    );
  }

  // Show content if user has access
  if (hasAccess()) {
    return <>{children}</>;
  }

  // User doesn't have access and isn't a guest - show loading or nothing
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

