import * as SecureStore from "expo-secure-store";
import { ENV } from "@/config/env";

const REFRESH_ENDPOINT = `${ENV.API_URL}/auth/refresh`;

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

    // If we have tokens, validate them properly
    if (accessToken) {
      const isValid = await testAccessToken(accessToken);

      if (isValid) {
        console.log("✅ Access token is valid");
        return {
          isValid: true,
          userData: {
            id: userId || "unknown",
            email: userEmail || "",
            displayName: userEmail || "User",
            isGuest: !userEmail || userEmail === "",
            subscriptionStatus: "free"
          },
          isNewUser: false
        };
      } else {
        console.log("❌ Access token is invalid or expired");
      }
    }

    // If access token is invalid, try to refresh
    if (refreshToken) {
      console.log("Attempting to refresh tokens...");
      const refreshResult = await refreshTokenIfNeeded();

      if (refreshResult?.accessToken) {
        console.log("Token refresh successful, testing new token...");

        const isValid = await testAccessToken(refreshResult.accessToken);

        if (isValid) {
          console.log("✅ Refreshed token is valid");
          return {
            isValid: true,
            userData: {
              id: userId || "unknown",
              email: userEmail || "",
              displayName: userEmail || "User",
              isGuest: !userEmail || userEmail === "",
              subscriptionStatus: "free"
            },
            isNewUser: false
          };
        } else {
          console.log("❌ Refreshed token is also invalid");
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

// ✅ Test if access token is valid by decoding and checking expiration
async function testAccessToken(token: string): Promise<boolean> {
  try {
    // Decode JWT token (without verification - just check expiration)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log("Invalid token format");
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;

    if (!exp) {
      console.log("Token has no expiration");
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = currentTime >= exp;

    if (isExpired) {
      console.log("Token is expired");
      return false;
    }

    const timeUntilExpiry = exp - currentTime;
    console.log(`Token is valid, expires in ${Math.floor(timeUntilExpiry / 60)} minutes`);
    return true;

  } catch (error) {
    console.error("Token validation error:", error);
    return false;
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
      console.error("Error deleting SecureStore items:", error);
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
    return !userEmail || userEmail === "" || (userId ? userId.startsWith("guest_") : false);
  } catch (error) {
    return false;
  }
}

export async function refreshTokenIfNeeded(): Promise<RefreshResponse | null> {
  try {
    const currentRefreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!currentRefreshToken) {
      console.log("No refresh token available");
      return null;
    }

    console.log("Calling refresh endpoint...");
    const response = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: currentRefreshToken }),
    });

    if (!response.ok) {
      console.warn("Failed to refresh token, status:", response.status);

      // If refresh token is also invalid, clear everything
      if (response.status === 401) {
        console.log("Refresh token invalid, clearing all tokens");
        await clearAuthTokens();
      }

      return null;
    }

    const data: RefreshResponse = await response.json();

    // Save new tokens
    await SecureStore.setItemAsync("accessToken", data.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);

    console.log("Tokens refreshed successfully ✅");
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

  if (!accessToken) {
    console.warn("No access token available for fetchWithAuth");
  }

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
    console.log("Got 401, attempting token refresh...");
    const newTokens = await refreshTokenIfNeeded();

    if (newTokens?.accessToken) {
      accessToken = newTokens.accessToken;
      console.log("Retrying request with refreshed token...");

      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    } else {
      console.warn("Token refresh failed, request will fail");
    }
  }

  return response;
}

export async function getRecipes() {
  return fetchWithAuth(`${ENV.API_URL}/recipes`);
}

// ✅ Sign Out - Logout user and invalidate session
export async function signOut(): Promise<{ success: boolean; message: string }> {
  try {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    
    if (!accessToken) {
      // No token, just clear local data
      await clearAuthTokens();
      return {
        success: true,
        message: "Signed out successfully"
      };
    }

    // Call backend signout endpoint
    const response = await fetch(
      `${ENV.API_URL}/auth/signout`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    // Always clear local data, even if API call fails
    await clearAuthTokens();

    if (data.success) {
      return {
        success: true,
        message: data.data?.message || "Successfully signed out"
      };
    } else {
      return {
        success: true, // Still successful locally
        message: "Signed out from device"
      };
    }
  } catch (error) {
    console.error("Sign out error:", error);
    
    // Even if API fails, clear local data
    await clearAuthTokens();
    
    return {
      success: true,
      message: "Signed out from device"
    };
  }
}

// ✅ Delete Account - Request account deletion with 30-day grace period
export async function deleteAccount(): Promise<{
  success: boolean;
  message: string;
  gracePeriodEnds?: string;
  daysRemaining?: number;
  canReactivate?: boolean;
}> {
  try {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    
    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required to delete account"
      };
    }

    // Call backend delete account endpoint
    const response = await fetch(
      `${ENV.API_URL}/auth/account`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (data.success) {
      // Clear local data after successful deletion request
      await clearAuthTokens();

      return {
        success: true,
        message: data.data?.message || "Account deletion requested",
        gracePeriodEnds: data.data?.gracePeriodEnds,
        daysRemaining: data.data?.gracePeriodDays || data.data?.daysRemaining || 30,
        canReactivate: data.data?.canReactivate !== false
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to delete account"
      };
    }
  } catch (error) {
    console.error("Delete account error:", error);
    return {
      success: false,
      message: "Network error. Please try again."
    };
  }
}