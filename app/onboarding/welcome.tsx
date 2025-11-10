// app/onboarding/welcome.tsx
import { SignInLink } from '@/components/auth/SignInLink';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useTheme } from '@/hooks/useTheme';
import { ENV } from '@/config/env';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { fetchWithAuth } from '../../utils/auth';

interface GuestAuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  user: {
    id: string;
    isGuest: boolean;
  };
}

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('WelcomeScreen mounted ✅');
  }, []);

  const handlePrivacyPress = async () => {
    try {
      const url = ENV.PRIVACY_POLICY_URL;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open privacy policy');
      }
    } catch (error) {
      console.error('Error opening privacy policy:', error);
      Alert.alert('Error', 'Unable to open privacy policy');
    }
  };

  const handleGetStarted = async () => {
    if (!privacyAccepted) {
      Alert.alert("Info", "Please accept the Privacy Policy first.");
      return;
    }

    try {
      setLoading(true);
      console.log('Get Started clicked ✅');

      // Store selected language preference
      await SecureStore.setItemAsync('selectedLanguage', selectedLanguage);
      
      // Navigate directly to onboarding questions
      // Guest user creation happens AFTER onboarding → paywall → sign-in screen
      console.log('🚀 Navigating to onboarding questions');
      router.replace('/onboarding/questions/CookingExperienceScreen');
    } catch (error: any) {
      console.error('Navigation error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.primary}
      />

      <View style={styles.topSection}>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </View>

      <View style={styles.centerSection}>
        <Logo />
      </View>

      <View style={styles.bottomSection}>
        <Button
          title={loading ? 'Loading...' : 'Get Started'}
          onPress={handleGetStarted}
          disabled={!privacyAccepted || loading}
          style={styles.getStartedButton}
        />

        <SignInLink />

        <Checkbox
          label="I agree to the "
          linkText="Privacy Policy"
          checked={privacyAccepted}
          onPress={() => setPrivacyAccepted(!privacyAccepted)}
          onLinkPress={handlePrivacyPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-end' },
  centerSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomSection: { paddingHorizontal: 30, paddingBottom: 70, alignItems: 'center' },
  getStartedButton: { marginBottom: 20, width: '100%' },
});