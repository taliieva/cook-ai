import { useState, useEffect } from "react";
import { validateAuthState } from "@/utils/auth";

export interface UserInfo {
  displayName: string;
  email: string;
  isGuest: boolean;
}

export const useSearchAuth = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    displayName: "",
    email: "",
    isGuest: true,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      console.log("🔍 Checking authentication status...");

      const authResult = await validateAuthState();
      console.log("Auth validation result:", authResult);

      if (authResult.isValid && authResult.userData) {
        setIsLoggedIn(true);
        setUserInfo({
          displayName:
            authResult.userData.displayName ||
            authResult.userData.email ||
            "User",
          email: authResult.userData.email,
          isGuest: authResult.userData.isGuest,
        });
        setUserPlan(authResult.userData.subscriptionStatus || "free");

        console.log("✅ User is authenticated:", {
          displayName: authResult.userData.displayName,
          email: authResult.userData.email,
          isGuest: authResult.userData.isGuest,
          plan: authResult.userData.subscriptionStatus,
        });
      } else {
        setIsLoggedIn(false);
        setUserInfo({
          displayName: "",
          email: "",
          isGuest: true,
        });
        setUserPlan("free");
        console.log("❌ User is not authenticated");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
      setUserInfo({
        displayName: "",
        email: "",
        isGuest: true,
      });
      setUserPlan("free");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const refreshAuthStatus = async () => {
    await checkAuthStatus();
  };

  return {
    isCheckingAuth,
    isLoggedIn,
    userPlan,
    userInfo,
    setIsLoggedIn,
    setUserInfo,
    setUserPlan,
    refreshAuthStatus,
  };
};

