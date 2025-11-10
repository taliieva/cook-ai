import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { validateAuthState, clearAuthTokens } from "@/utils/auth";
import { hasCompletedOnboarding } from "@/utils/onboarding";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Protects routes based on authentication state
 * 
 * Updated Rules (with Guest User Support):
 * - Guest users → Can access /main/* (limited features)
 * - Authenticated users → Full access to /main/*
 * - Logged out (no tokens) → Redirect to /onboarding/welcome
 * - Prevents back navigation to protected screens after logout
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    checkAuthAndRedirect();
  }, [segments]);

  const checkAuthAndRedirect = async () => {
    try {
      const authResult = await validateAuthState();
      const onboardingCompleted = await hasCompletedOnboarding();
      
      // Check different auth states
      const hasTokens = authResult.isValid;
      const isGuestUser = authResult.isValid && authResult.userData?.isGuest;
      const isAuthenticatedUser = authResult.isValid && authResult.userData && !authResult.userData.isGuest;
      
      setIsAuthenticated(isAuthenticatedUser);
      setIsGuest(isGuestUser || false);
      
      // Get current route context
      const inAuthGroup = segments[0] === "auth";
      const inOnboardingGroup = segments[0] === "onboarding";
      const inMainGroup = segments[0] === "main";
      const inPaywallGroup = segments[0] === "paywall";
      const inPublicRoute = inAuthGroup || inOnboardingGroup || inPaywallGroup || segments.length === 0;

      console.log("🔒 AuthGuard Check:", {
        hasTokens,
        isGuestUser,
        isAuthenticatedUser,
        onboardingCompleted,
        segments,
        inMainGroup,
      });

      // Navigation Rules:
      
      // 1. No tokens at all → Must go to welcome
      if (!hasTokens && inMainGroup) {
        console.log("⛔ No auth tokens - redirecting to welcome");
        router.replace("/onboarding/welcome");
        return;
      }

      // 2. Has tokens but no onboarding → Something wrong, clear and restart
      if ((isGuestUser || isAuthenticatedUser) && !onboardingCompleted && inMainGroup) {
        console.log("⚠️ User has tokens but no onboarding - clearing and redirecting to welcome");
        await clearAuthTokens();
        router.replace("/onboarding/welcome");
        return;
      }

      // 3. Guest or authenticated users with completed onboarding can access main
      if ((isGuestUser || isAuthenticatedUser) && onboardingCompleted && inMainGroup) {
        console.log("✅ User has access to main (guest or authenticated with onboarding)");
        // Allow access - feature gating handled by components
        return;
      }

      // 4. Authenticated users on welcome screen → redirect to home
      if (isAuthenticatedUser && onboardingCompleted && inOnboardingGroup && segments[1] === "welcome") {
        console.log("✅ Authenticated user on welcome - redirecting to home");
        router.replace("/main/home");
        return;
      }

      // 5. Guest users with completed onboarding on welcome screen → redirect to home
      if (isGuestUser && onboardingCompleted && inOnboardingGroup && segments[1] === "welcome") {
        console.log("👤 Guest user with completed onboarding on welcome - redirecting to home");
        router.replace("/main/home");
        return;
      }

    } catch (error) {
      console.error("AuthGuard error:", error);
      // On error, redirect to welcome if trying to access main
      if (segments[0] === "main") {
        router.replace("/onboarding/welcome");
      }
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

