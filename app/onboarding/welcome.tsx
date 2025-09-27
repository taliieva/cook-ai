// app/onboarding/welcome.tsx
import { SignInLink } from '@/components/auth/SignInLink';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useTheme } from '@/hooks/useTheme';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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

  const handleGetStarted = async () => {
    if (!privacyAccepted) {
      Alert.alert("Info", "Please accept the Privacy Policy first.");
      return;
    }

    try {
      setLoading(true);
      console.log('Get Started clicked ✅');

      // Generate or retrieve deviceId
      let deviceId = await SecureStore.getItemAsync('deviceId');
      if (!deviceId) {
        deviceId = Crypto.randomUUID();
        await SecureStore.setItemAsync('deviceId', deviceId);
        console.log('New deviceId generated:', deviceId);
      } else {
        console.log('Existing deviceId found:', deviceId);
      }

      const body = {
        deviceId,
        platform: Platform.OS,
        appVersion: '1.0.0',
        locale: selectedLanguage === 'az' ? 'az-AZ' : 'en-US',
      };

      console.log("Sending guest auth request:", body);

      const response = await fetchWithAuth(
        'https://cook-ai-backend-production.up.railway.app/v1/auth/guest',
        {
          method: 'POST',
          body: JSON.stringify(body),
        }
      );

      const data: GuestAuthResponse = await response.json();
      console.log('Guest auth response:', data);

      if (data.success || (data.accessToken && data.refreshToken)) {
        // Store tokens securely
        await SecureStore.setItemAsync('accessToken', data.accessToken);
        await SecureStore.setItemAsync('refreshToken', data.refreshToken);
        
        // Store guest user info
        if (data.user?.id) {
          await SecureStore.setItemAsync('userId', data.user.id);
        }

        console.log('Guest tokens stored ✅');

        // Navigate to onboarding
        router.replace('/questions/CookingExperienceScreen');
      } else {
        throw new Error('Guest authentication failed');
      }
    } catch (error: any) {
      console.error('Guest login error:', error);
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
          onLinkPress={() => {
            /* Open privacy policy */
          }}
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