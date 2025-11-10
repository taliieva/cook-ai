import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPromptModal } from './LoginPromptModal';

interface ProtectedFeatureProps {
  feature: 'like' | 'save' | 'view_saved' | 'view_liked' | 'premium';
  children: (props: {
    onPress: () => void;
    canAccess: boolean;
    isGuest: boolean;
  }) => React.ReactNode;
  onAllowed?: () => void;
  fallback?: React.ReactNode;
}

/**
 * ProtectedFeature - HOC for feature gating
 * 
 * Wraps any feature that requires authentication or premium access.
 * Shows login modal for guest users, allows access for authenticated users.
 * 
 * Usage:
 * <ProtectedFeature 
 *   feature="like" 
 *   onAllowed={() => handleLike()}
 * >
 *   {({ onPress, canAccess, isGuest }) => (
 *     <TouchableOpacity onPress={onPress}>
 *       <Text>Like</Text>
 *     </TouchableOpacity>
 *   )}
 * </ProtectedFeature>
 */
export const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  feature,
  children,
  onAllowed,
  fallback,
}) => {
  const { canAccessFeature, isGuest, showLoginPrompt } = useAuth();
  const [showModal, setShowModal] = useState(false);
  
  const canAccess = canAccessFeature(feature);

  const handlePress = () => {
    if (canAccess) {
      // User has access - execute the action
      onAllowed?.();
    } else if (isGuest) {
      // Guest user - show login prompt
      setShowModal(true);
    } else {
      // Authenticated user without premium - show upgrade prompt
      showLoginPrompt(feature);
    }
  };

  // If fallback is provided and user doesn't have access, show fallback
  if (!canAccess && fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      {children({ onPress: handlePress, canAccess, isGuest })}
      
      <LoginPromptModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        feature={feature}
      />
    </>
  );
};

