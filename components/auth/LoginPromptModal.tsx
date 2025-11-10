import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface LoginPromptModalProps {
  visible: boolean;
  onClose: () => void;
  feature: 'like' | 'save' | 'view_saved' | 'view_liked' | 'premium';
  title?: string;
  message?: string;
}

const FEATURE_MESSAGES = {
  like: {
    title: 'Sign in to Like Recipes',
    message: 'Create an account or sign in to save your favorite recipes and access them anytime.',
    icon: 'heart' as const,
    color: '#FF3B30',
  },
  save: {
    title: 'Sign in to Save Recipes',
    message: 'Create an account or sign in to bookmark recipes and build your personal collection.',
    icon: 'bookmark' as const,
    color: '#007AFF',
  },
  view_saved: {
    title: 'Sign in to View Saved Recipes',
    message: 'Your saved recipes are waiting! Sign in to access your personal recipe collection.',
    icon: 'bookmark' as const,
    color: '#007AFF',
  },
  view_liked: {
    title: 'Sign in to View Liked Recipes',
    message: 'Your favorite recipes are waiting! Sign in to see all the recipes you\'ve liked.',
    icon: 'heart' as const,
    color: '#FF3B30',
  },
  premium: {
    title: 'Premium Feature',
    message: 'This is a premium feature. Sign in and upgrade to unlock unlimited access.',
    icon: 'diamond' as const,
    color: '#FFD700',
  },
};

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  visible,
  onClose,
  feature,
  title: customTitle,
  message: customMessage,
}) => {
  const router = useRouter();
  const theme = useTheme();
  
  const featureInfo = FEATURE_MESSAGES[feature];
  const displayTitle = customTitle || featureInfo.title;
  const displayMessage = customMessage || featureInfo.message;

  const handleSignIn = () => {
    onClose();
    router.push('/auth/sign-in');
  };

  const handleContinueAsGuest = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background.secondary },
          ]}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: featureInfo.color + '20' },
            ]}
          >
            <Ionicons
              name={featureInfo.icon}
              size={48}
              color={featureInfo.color}
            />
          </View>

          {/* Title */}
          <Text
            style={[styles.title, { color: theme.colors.text.primary }]}
          >
            {displayTitle}
          </Text>

          {/* Message */}
          <Text
            style={[styles.message, { color: theme.colors.text.secondary }]}
          >
            {displayMessage}
          </Text>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <BenefitItem
              icon="checkmark-circle"
              text="Save unlimited recipes"
              theme={theme}
            />
            <BenefitItem
              icon="checkmark-circle"
              text="Sync across devices"
              theme={theme}
            />
            <BenefitItem
              icon="checkmark-circle"
              text="Personalized recommendations"
              theme={theme}
            />
          </View>

          {/* Action buttons */}
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: '#007AFF' }]}
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueAsGuest}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.continueButtonText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface BenefitItemProps {
  icon: string;
  text: string;
  theme: any;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon, text, theme }) => (
  <View style={styles.benefitItem}>
    <Ionicons name={icon as any} size={20} color="#34C759" />
    <Text style={[styles.benefitText, { color: theme.colors.text.primary }]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
  },
  signInButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  continueButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

