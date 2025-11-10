import { clearAuthTokens, validateAuthState } from "@/utils/auth";
import { hasCompletedOnboarding } from "@/utils/onboarding";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useAuthCheck = () => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [targetRoute, setTargetRoute] = useState<string>("/onboarding/welcome");

    useEffect(() => {
        checkAuthAndDetermineRoute();
    }, []);

    const checkAuthAndDetermineRoute = async () => {
        try {
            console.log("🔐 Checking authentication...");

            const authResult = await validateAuthState();
            const onboardingCompleted = await hasCompletedOnboarding();

            console.log("🔍 Auth check results:", {
                hasTokens: authResult.isValid,
                isGuest: authResult.userData?.isGuest,
                onboardingCompleted,
            });

            let route = "/onboarding/welcome"; // Default for new users

            if (authResult.isValid && authResult.userData) {
                // User has valid tokens (guest or authenticated)
                
                if (!onboardingCompleted) {
                    // User has tokens but didn't complete onboarding
                    // This shouldn't happen normally, but redirect to welcome
                    console.log("⚠️ User has tokens but no onboarding - redirect to welcome");
                    await clearAuthTokens(); // Clear invalid state
                    route = "/onboarding/welcome";
                } else if (authResult.userData.isGuest) {
                    // Guest user with token AND completed onboarding - go to main app
                    console.log("👤 Guest user (onboarding done) - redirect to main app");
                    route = "/main/home";
                } else {
                    // Authenticated user - go to main app
                    console.log("✅ Authenticated user - redirect to main");
                    route = "/main/home";
                }
            } else {
                // No valid auth tokens
                if (onboardingCompleted) {
                    // User completed onboarding before but has no auth
                    // Redirect to paywall/sign-in instead of onboarding
                    console.log("🔄 Onboarding completed, no auth - redirect to paywall");
                    route = "/paywall";
                } else {
                    // New user - go to welcome
                    console.log("🆕 New user - redirect to welcome");
                    route = "/onboarding/welcome";
                }
            }

            setTargetRoute(route);
            setIsChecking(false);
        } catch (error) {
            console.error("❌ Auth check error:", error);
            await clearAuthTokens();
            setTargetRoute("/onboarding/welcome");
            setIsChecking(false);
        }
    };

    const navigateToTarget = () => {
        console.log(`🚀 Navigating to: ${targetRoute}`);
        router.replace(targetRoute as any);
    };

    return { isChecking, targetRoute, navigateToTarget };
};