// hooks/useSaveRecipe.ts
import * as SecureStore from "expo-secure-store";
import { ENV } from "@/config/env";
import { useState } from "react";

interface SaveRecipeResponse {
  success: boolean;
  data?: {
    success: boolean;
    message: string;
    recipeId: string;
  };
  error?: string;
}

export const useSaveRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveRecipe = async (
    searchId: string,
    dishName: string
  ): Promise<SaveRecipeResponse> => {
    setLoading(true);
    setError(null);

    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) throw new Error("Authentication required. Please log in again.");

      const response = await fetch(
        `${ENV.API_URL}/recipes/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ searchId, dishName }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save recipe");
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("Error saving recipe:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { saveRecipe, loading, error };
};
