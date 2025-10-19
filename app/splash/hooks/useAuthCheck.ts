import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { clearAuthTokens, validateAuthState } from "@/utils/auth";

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

            let route = "/onboarding/welcome"; // Default for guests/new users

            if (authResult.isValid && authResult.userData) {
                if (authResult.userData.isGuest) {
                    // Guest users need to authenticate
                    console.log("👤 Guest user - redirect to welcome");
                    route = "/onboarding/welcome";
                } else {
                    // Authenticated user - go to main app
                    console.log("✅ Authenticated user - redirect to main");
                    route = "/onboarding/ingredients-search";
                }
            } else {
                // Invalid/expired token - go to welcome
                console.log("❌ Invalid token - redirect to welcome");
                route = "/onboarding/welcome";
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