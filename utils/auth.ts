import * as SecureStore from "expo-secure-store";

const REFRESH_ENDPOINT = "https://thecookai.app/v1/auth/refresh";

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
};

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

// In auth.ts or a new api.ts file

export async function getRecipes() {
    return fetchWithAuth("/v1/recipes");
  }
  
