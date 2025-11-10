import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import type { Country, Mode } from "../config/searchConfig";

export const useDishSearch = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleFindDishes = async (
    ingredients: string[],
    selectedCountry: Country,
    selectedMode: Mode
  ) => {
    if (ingredients.length < 4) {
      Alert.alert(
        "More Ingredients Needed",
        "Please select minimum 4 ingredients to find the best dishes."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Generate temporary searchId for immediate navigation
      const tempSearchId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log("🚀 Immediate navigation with searchId:", tempSearchId);

      // Navigate immediately (don't wait for API response)
      router.push({
        pathname: "/main/dishes",
        params: {
          country: selectedCountry.code,
          mode: selectedMode.code,
          ingredients: JSON.stringify(ingredients),
          searchId: tempSearchId,
          isStreaming: "true",
          expectedDishCount: "3",
        },
      });

      // Reset loading state immediately since we've navigated
      setIsLoading(false);

      // Wait 100ms for dishes screen to mount and set up listeners
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Import streaming service dynamically
      const { streamingService } = await import(
        "../../dishes/services/streamingService"
      );

      console.log("📡 Starting streaming service...");

      // Start streaming in background
      streamingService
        .startStreaming(
          tempSearchId,
          ingredients,
          selectedCountry.code,
          selectedMode.code
        )
        .catch((error) => {
          console.error("Streaming error:", error);
        });
    } catch (error) {
      console.error("Error initiating dish search:", error);
      setIsLoading(false);
      Alert.alert(
        "Error",
        "Failed to start dish search. Please check your internet connection and try again."
      );
    }
  };

  return {
    isLoading,
    handleFindDishes,
  };
};

