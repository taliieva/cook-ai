import { SignInLink } from '@/components/auth/SignInLink';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleGetStarted = () => {
    if (privacyAccepted) {
      router.push('/onboarding/choose-ingredients' as any);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
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
          title="Get Started"
          onPress={handleGetStarted}
          disabled={!privacyAccepted}
          style={styles.getStartedButton}
        />
        
        <SignInLink />
        
        <Checkbox
          label="I agree to the "
          linkText="Privacy Policy"
          checked={privacyAccepted}
          onPress={() => setPrivacyAccepted(!privacyAccepted)}
          onLinkPress={() => {/* Open privacy policy */}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  getStartedButton: {
    marginBottom: 20,
  },
});