import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchWithAuth } from "../../utils/auth";

// Complete the auth session for Google
WebBrowser.maybeCompleteAuthSession();

interface UserData {
  email: string;
  name: string;
  picture?: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      displayName: string;
      isGuest: boolean;
      subscriptionStatus: string;
    };
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
    isNewUser: boolean;
  };
  requestId: string;
}

export default function SignInScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  // Google Auth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      handleGoogleSignIn(response.authentication?.accessToken);
    }
  }, [response]);

  const handleGoogleSignIn = async (token?: string) => {
    if (!token) {
      Alert.alert("Error", "Failed to get Google authentication token");
      return;
    }

    try {
      setGoogleLoading(true);

      // Get user info from Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
      );
      const userInfo = await userInfoResponse.json();

      const userData: UserData = {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };

      await authenticateWithBackend("google", token, userData);
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      Alert.alert("Error", error.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setAppleLoading(true);
  
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
  
      if (credential.identityToken) {
        let userData: UserData = {
          email: credential.email || "",
          name: credential.fullName
            ? `${credential.fullName.givenName || ""} ${
                credential.fullName.familyName || ""
              }`.trim()
            : "",
        };
  
        console.log("Apple credential data:", {
          email: credential.email,
          fullName: credential.fullName,
          user: credential.user
        });
  
        // If email/name are empty (subsequent sign-ins), try to get from stored data
        if (!userData.email || !userData.name) {
          console.log("Email/name empty, checking stored data...");
          try {
            const storedEmail = await SecureStore.getItemAsync("appleUserEmail");
            const storedName = await SecureStore.getItemAsync("appleUserName");
            
            console.log("Stored data:", { storedEmail, storedName });
            
            if (storedEmail) userData.email = storedEmail;
            if (storedName) userData.name = storedName;
          } catch (error) {
            console.log("No stored Apple user data found", error);
          }
        } else {
          // Store the data for future sign-ins (only when we have fresh data)
          console.log("Storing fresh Apple user data...");
          try {
            await SecureStore.setItemAsync("appleUserEmail", userData.email);
            await SecureStore.setItemAsync("appleUserName", userData.name);
            console.log("Apple user data stored successfully");
          } catch (error) {
            console.log("Failed to store Apple user data", error);
          }
        }
  
        console.log("Final userData:", userData);
        await authenticateWithBackend("apple", credential.identityToken, userData);
      }
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        return;
      }
      console.error("Apple sign-in error:", error);
      Alert.alert("Error", error.message || "Apple sign-in failed");
    } finally {
      setAppleLoading(false);
    }
  };

  const authenticateWithBackend = async (
    provider: "google" | "apple",
    token: string,
    userData: UserData
  ) => {
    try {
      const endpoint = `https://api.thecookai.app/v1/auth/convert/${provider}`;

      const requestBody = {
        token,
        userData,
      };

      console.log(`Sending ${provider} auth request:`, requestBody);

      const response = await fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const data: AuthResponse = await response.json();
      console.log(`${provider} auth response:`, data);

      if (data.success) {
        // Store tokens securely
        await SecureStore.setItemAsync("accessToken", data.data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.data.refreshToken);

        // Store user info if needed
        await SecureStore.setItemAsync("userId", data.data.user.id);
        await SecureStore.setItemAsync("userEmail", data.data.user.email);
        await SecureStore.setItemAsync(
          "displayName",
          data.data.user.displayName
        );

        console.log("Authentication successful, navigating...");

        // Navigate based on whether user is new or returning
        if (data.data.isNewUser) {
          router.push("/onboarding/choose-ingredients");
        } else {
          router.push("/onboarding/ingredients-search"); // Adjust route as needed
        }
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error: any) {
      console.error(`${provider} backend auth error:`, error);
      throw error;
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleGuestContinue = () => {
    // Navigate back to welcome screen for guest login
    router.back();
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

      {/* Header with back button */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={handleBack}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View> */}

      {/* Center Section with Logo */}
      <View style={styles.centerSection}>
        <Logo />
        
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Sign in to access your personalized recipes and saved dishes
          </Text>
        </View>
      </View>

      {/* Bottom Section with Sign-In Options */}
      <View style={styles.bottomSection}>
        {/* Google Sign-In Button */}
        <TouchableOpacity
          style={[
            styles.providerButton,
            styles.googleButton,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => promptAsync()}
          disabled={googleLoading || appleLoading}
        >
          <View style={styles.providerButtonContent}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={[styles.providerButtonText, { color: theme.colors.text.primary }]}>
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Apple Sign-In Button - Only show on iOS */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[
              styles.providerButton,
              styles.appleButton,
              {
                backgroundColor: theme.isDark ? "#FFFFFF" : "#000000",
              },
            ]}
            onPress={handleAppleSignIn}
            disabled={googleLoading || appleLoading}
          >
            <View style={styles.providerButtonContent}>
              <Ionicons
                name="logo-apple"
                size={20}
                color={theme.isDark ? "#000000" : "#FFFFFF"}
              />
              <Text style={[
                styles.providerButtonText,
                {
                  color: theme.isDark ? "#000000" : "#FFFFFF",
                  marginLeft: 12,
                }
              ]}>
                {appleLoading ? "Signing in..." : "Continue with Apple"}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.text.secondary }]}>
            or
          </Text>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        </View>

        {/* Guest Continue Button */}
        <Button
          title="Continue as Guest"
          onPress={handleGuestContinue}
          style={styles.guestButton}
          variant="outline"
        />

        {/* Info Text */}
        <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  titleSection: {
    marginTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
  providerButton: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleButton: {
    borderWidth: 1,
  },
  appleButton: {
    // Apple button specific styles
  },
  providerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  googleIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  providerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  guestButton: {
    width: "100%",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});