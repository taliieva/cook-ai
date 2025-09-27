import * as SecureStore from "expo-secure-store";

const REFRESH_ENDPOINT = "https://cook-ai-backend-production.up.railway.app/v1/auth/refresh";
const VALIDATE_ENDPOINT = "https://cook-ai-backend-production.up.railway.app/v1/auth/validate"; // Add this endpoint

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
};

type AuthValidationResult = {
  isValid: boolean;
  isNewUser?: boolean;
  userData?: {
    id: string;
    email: string;
    displayName: string;
    isGuest: boolean;
    subscriptionStatus: string;
  };
};

// ✅ Check if user has valid authentication
export async function validateAuthState(): Promise<AuthValidationResult> {
  try {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const userId = await SecureStore.getItemAsync("userId");
    const userEmail = await SecureStore.getItemAsync("userEmail");

    console.log("Checking auth state:", { 
      hasAccessToken: !!accessToken, 
      hasRefreshToken: !!refreshToken,
      hasUserId: !!userId,
      hasUserEmail: !!userEmail
    });

    // If no tokens exist, user needs to authenticate
    if (!accessToken && !refreshToken) {
      console.log("No tokens found - user needs to sign in");
      return { isValid: false };
    }

    // If we have tokens, try to use them with any authenticated API call
    if (accessToken) {
      try {
        // Try making a simple authenticated request to test the token
        // Using a likely endpoint - adjust this to match your actual API
        const testResponse = await fetch("https://cook-ai-backend-production.up.railway.app/v1/recipes", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        // If we get any response other than 401, consider the token valid
        if (testResponse.status !== 401) {
          console.log("Access token is valid ✅ (status:", testResponse.status, ")");
          return { 
            isValid: true, 
            userData: {
              id: userId || "unknown",
              email: userEmail || "",
              displayName: userEmail || "User",
              isGuest: !userEmail,
              subscriptionStatus: "free"
            },
            isNewUser: false 
          };
        } else {
          console.log("Access token invalid (401 unauthorized)");
        }
      } catch (error) {
        console.log("Access token test failed:", error.message);
      }
    }

    // If access token is invalid, try to refresh
    if (refreshToken) {
      console.log("Attempting to refresh tokens...");
      const refreshResult = await refreshTokenIfNeeded();
      
      if (refreshResult?.accessToken) {
        console.log("Token refresh successful, testing new token...");
        // Test the new access token
        try {
          const testResponse = await fetch("https://cook-ai-backend-production.up.railway.app/v1/recipes", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${refreshResult.accessToken}`,
              "Content-Type": "application/json",
            },
          });

          // If we get any response other than 401, consider the token valid
          if (testResponse.status !== 401) {
            console.log("Refreshed token is valid ✅ (status:", testResponse.status, ")");
            return { 
              isValid: true, 
              userData: {
                id: userId || "unknown",
                email: userEmail || "",
                displayName: userEmail || "User",
                isGuest: !userEmail,
                subscriptionStatus: "free"
              },
              isNewUser: false 
            };
          } else {
            console.log("Refreshed token also invalid (401 unauthorized)");
          }
        } catch (error) {
          console.log("Refreshed token test failed:", error.message);
        }
      } else {
        console.log("Token refresh failed");
      }
    }

    // All token attempts failed - clear stored tokens and require re-authentication
    console.log("All auth attempts failed - clearing tokens");
    await clearAuthTokens();
    return { isValid: false };

  } catch (error) {
    console.error("Auth validation error:", error);
    await clearAuthTokens();
    return { isValid: false };
  }
}

// ✅ Clear all stored authentication data
export async function clearAuthTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userId");
    await SecureStore.deleteItemAsync("userEmail");
    await SecureStore.deleteItemAsync("displayName");
    
    // Also clear Apple user data if exists
    try {
      await SecureStore.deleteItemAsync("appleUserEmail");
      await SecureStore.deleteItemAsync("appleUserName");
    } catch (error) {
      // These might not exist, ignore error
    }
    
    console.log("All auth tokens cleared");
  } catch (error) {
    console.error("Error clearing auth tokens:", error);
  }
}

// ✅ Check if user is a guest
export async function isGuestUser(): Promise<boolean> {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    const userEmail = await SecureStore.getItemAsync("userEmail");
    
    // Guest users typically don't have email or have a guest-specific user ID pattern
    return !userEmail || (userId ? userId.startsWith("guest_") : false);
  } catch (error) {
    return false;
  }
}

export async function refreshTokenIfNeeded(): Promise<RefreshResponse | null> {
  try {
    const currentRefreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!currentRefreshToken) return null;

    const response = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: currentRefreshToken }),
    });

    if (!response.ok) {
      console.warn("Failed to refresh token", response.status);
      return null;
    }

    const data: RefreshResponse = await response.json();

    // Save new tokens
    await SecureStore.setItemAsync("accessToken", data.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);

    console.log("Tokens refreshed ✅");
    return data;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let accessToken = await SecureStore.getItemAsync("accessToken");

  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Content-Type": "application/json",
    },
  });

  // 🔄 If unauthorized, try refreshing token once
  if (response.status === 401) {
    const newTokens = await refreshTokenIfNeeded();
    if (newTokens?.accessToken) {
      accessToken = newTokens.accessToken;

      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }
  }

  return response;
}

export async function getRecipes() {
  return fetchWithAuth("/v1/recipes");
}