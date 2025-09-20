import { SignInLink } from "@/components/auth/SignInLink";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useTheme } from "@/hooks/useTheme";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { fetchWithAuth } from "../utils/auth"; // ✅ use the util

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!privacyAccepted) {
      Alert.alert("Info", "Please accept the Privacy Policy first.");
      return;
    }
  
    try {
      setLoading(true);
  
      // Generate or retrieve stored deviceId
      let deviceId = await SecureStore.getItemAsync("deviceId");
      if (!deviceId) {
        deviceId = Crypto.randomUUID();
        await SecureStore.setItemAsync("deviceId", deviceId);
        console.log("New deviceId generated and saved:", deviceId);
      } else {
        console.log("Existing deviceId found:", deviceId);
      }
  
      const body = {
        deviceId,
        platform: Platform.OS,
        appVersion: "1.0.0",
        locale: selectedLanguage === "az" ? "az-AZ" : "en-US",
      };
  
      console.log("Sending request body:", body);
  
      const response = await fetchWithAuth(
        "https://api.thecookai.app/v1/auth/guest",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
  
      const data = await response.json(); // 👈 parse here
      console.log("API response data:", data);
  
      // Store new tokens securely
      await SecureStore.setItemAsync("accessToken", data.accessToken);
      await SecureStore.setItemAsync("refreshToken", data.refreshToken);
  
      const testAccessToken = await SecureStore.getItemAsync("accessToken");
      console.log("Stored accessToken:", testAccessToken);
  
      // Navigate after successful login
      console.log("Navigating to onboarding screen...");
      router.push("/onboarding/choose-ingredients");
    } catch (error: any) {
      console.error("Error during guest login:", error);
      Alert.alert("Error", error.message || "Something went wrong");
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
        barStyle={theme.isDark ? "light-content" : "dark-content"}
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
          title={loading ? "Loading..." : "Get Started"}
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
  container: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "flex-end",
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 70,
    alignItems: "center",
  },
  getStartedButton: {
    marginBottom: 20,
    width: "100%",
  },
});
