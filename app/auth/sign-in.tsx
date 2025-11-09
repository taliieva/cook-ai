// app/auth/sign-in.tsx
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
    hasCompletedOnboarding?: boolean;
  };
  requestId: string;
}

export default function SignInScreen() {
  const router = useRouter();
  const theme = useTheme();
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
        console.log("Apple credential data:", {
          email: credential.email,
          fullName: credential.fullName,
          user: credential.user,
        });

        // Try to extract email from JWT token if not in credential
        let emailFromToken = "";
        try {
          const tokenParts = credential.identityToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            emailFromToken = payload.email || "";
            console.log("Email from JWT token:", emailFromToken);
          }
        } catch (e) {
          console.log("Could not decode JWT token");
        }

        // Build userData with Apple's unique user ID as fallback
        let userData: UserData = {
          email: credential.email || emailFromToken || "",
          name: credential.fullName
              ? `${credential.fullName.givenName || ""} ${
                  credential.fullName.familyName || ""
              }`.trim()
              : "",
        };

        // Check if we have stored data for THIS Apple user ID
        const storedDataKey = `apple_user_${credential.user}`;

        // If email/name are empty (subsequent sign-ins), try to get from stored data
        if (!userData.email || !userData.name) {
          console.log("Email/name empty, checking stored data for user:", credential.user);

          try {
            const storedData = await SecureStore.getItemAsync(storedDataKey);

            if (storedData) {
              const parsed = JSON.parse(storedData);
              console.log("Retrieved stored Apple user data:", parsed);

              if (!userData.email && parsed.email) userData.email = parsed.email;
              if (!userData.name && parsed.name) userData.name = parsed.name;
            } else {
              console.log("⚠️ No stored data found for this Apple user");
            }
          } catch (error) {
            console.log("Error retrieving stored Apple user data:", error);
          }
        }

        // Store the data for future sign-ins (store if we have ANY email - from credential or token)
        if (userData.email || emailFromToken) {
          const emailToStore = userData.email || emailFromToken;
          const nameToStore = userData.name || "Apple User";

          console.log("Storing Apple user data for user:", credential.user);

          try {
            await SecureStore.setItemAsync(
                storedDataKey,
                JSON.stringify({
                  email: emailToStore,
                  name: nameToStore,
                })
            );
            console.log("✅ Apple user data stored successfully");

            // Update userData with stored values
            userData.email = emailToStore;
            userData.name = nameToStore;
          } catch (error) {
            console.log("Failed to store Apple user data:", error);
          }
        }

        // Final validation - if still no email, use Apple user ID as email
        if (!userData.email) {
          console.log("⚠️ Still no email, using Apple user ID as fallback");
          userData.email = `${credential.user}@appleid.private`;
        }

        // Final validation - if still no name, use "Apple User"
        if (!userData.name) {
          console.log("⚠️ Still no name, using fallback name");
          userData.name = "Apple User";
        }

        console.log("Final userData to send:", userData);

        // Validate before sending
        if (!userData.email || userData.email.length < 3) {
          throw new Error("Invalid email from Apple. Please try signing in with Google instead.");
        }

        await authenticateWithBackend("apple", credential.identityToken, userData);
      }
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        return;
      }
      console.error("Apple sign-in error:", error);
      Alert.alert(
          "Apple Sign-In Error",
          error.message || "Failed to sign in with Apple. Please try again or use Google sign-in."
      );
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
      const endpoint = `https://cook-ai-backend-production.up.railway.app/v1/auth/convert/${provider}`;

      const requestBody = {
        token,
        userData,
      };

      console.log(`Sending ${provider} auth request:`, requestBody);

      const response = await fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      // Check if response is ok before parsing
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend returned ${response.status}:`, errorText);
        throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
      }

      const data: AuthResponse = await response.json();
      console.log(`${provider} auth response:`, data);

      if (data.success) {
        // Clear any old stored data first
        try {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("userId");
          await SecureStore.deleteItemAsync("userEmail");
          await SecureStore.deleteItemAsync("displayName");
        } catch (e) {
          console.log("Error clearing old data:", e);
        }

        // Store NEW tokens securely
        await SecureStore.setItemAsync("accessToken", data.data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.data.refreshToken);

        // Store user info
        await SecureStore.setItemAsync("userId", data.data.user.id);
        await SecureStore.setItemAsync("userEmail", data.data.user.email);
        await SecureStore.setItemAsync(
            "displayName",
            data.data.user.displayName || data.data.user.email || "User"
        );

        console.log("✅ Authentication successful, tokens stored");
        console.log("User data:", {
          id: data.data.user.id,
          email: data.data.user.email,
          isNewUser: data.data.isNewUser,
          hasCompletedOnboarding: data.data.hasCompletedOnboarding
        });

        // Navigate based on user status and onboarding completion
        // ✅ For returning users (isNewUser: false), assume onboarding is complete unless explicitly set to false
        // This prevents showing onboarding again after logout/login
        const shouldShowOnboarding = data.data.isNewUser || data.data.hasCompletedOnboarding === false;
        
        if (shouldShowOnboarding) {
          console.log("📍 Navigating to onboarding questions (new user or explicitly incomplete)");
          router.replace("/questions/CookingExperienceScreen");
        } else {
          console.log("📍 Navigating to main app (returning user with completed onboarding)");
          router.replace("/onboarding/ingredients-search");
        }
      } else {
        // Backend returned success: false
        const errorMessage = (data as any).message || (data as any).error || "Authentication failed";
        console.error("Backend auth failed:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error(`${provider} backend auth error:`, error);

      // Show more detailed error to user
      Alert.alert(
          "Authentication Error",
          error.message || `Failed to sign in with ${provider}. Please try again.`
      );

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