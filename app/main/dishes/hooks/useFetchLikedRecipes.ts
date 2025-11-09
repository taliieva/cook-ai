import { getToken } from "@/services/api/auth";
import { useEffect, useState } from "react";

interface LikedRecipe {
  id: string;
  dishName: string;
  cuisineType: string;
  dishType?: string;
  calories?: number;
  pictureUrl: string;
  likedAt: string;
  searchId: string;
  shortDescription?: string;
  steps?: string[];
  videoURL?: string;
  homeCost?: number;
  outdoorCost?: number;
  prepTime?: string;
}

interface UseFetchLikedRecipesResponse {
  recipes: LikedRecipe[];
  total: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  refreshRecipes: () => Promise<void>;
}

export const useFetchLikedRecipes = (
  limit: number = 20,
  offset: number = 0
): UseFetchLikedRecipesResponse => {
  const [recipes, setRecipes] = useState<LikedRecipe[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("User not authenticated");

      const response = await fetch(
        `https://cook-ai-backend-production.up.railway.app/v1/recipes/liked?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch liked recipes");
      }

      setRecipes(data.data.recipes || []);
      setTotal(data.data.total || 0);
      setHasMore(data.data.hasMore || false);
    } catch (err: any) {
      console.error("Error fetching liked recipes:", err);
      setError(err.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedRecipes();
  }, [limit, offset]);

  return {
    recipes,
    total,
    hasMore,
    loading,
    error,
    refreshRecipes: fetchLikedRecipes,
  };
};

