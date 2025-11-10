// hooks/useLikeRecipe.ts
import { getToken } from "@/services/api/auth";
import { ENV } from "@/config/env";
import { useState } from "react";

interface LikeRecipeResponse {
  success: boolean;
  data?: {
    success: boolean;
    message: string;
    recipeId: string;
  };
  error?: string;
}

export const useLikeRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const likeRecipe = async (
    searchId: string,
    dishName: string
  ): Promise<LikeRecipeResponse> => {
    setLoading(true);
    setError(null);

    try {
      console.log("➡️ Sending body:", { searchId, dishName });

      const token = await getToken();
      console.log('token on hook', token)
      if (!token) throw new Error("User not authenticated");
    

      const response = await fetch(
        `${ENV.API_URL}/recipes/like`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // pass token here
          },
          body: JSON.stringify({ searchId, dishName }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to like recipe");
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("Error liking recipe:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { likeRecipe, loading, error };
};
