import { useTheme } from "@/hooks/useTheme";
import { DishData } from "@/types/dish";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { DishCompletedCard } from "./components/DishCompletedCard";
import { DishLoadingCard } from "./components/DishLoadingCard";
import { useDishGeneration } from "./hooks/useDishGeneration";
import { useLikeRecipe } from "./hooks/useLikeRecipes";
import { useSaveRecipe } from "./hooks/useSaveRecipe";
import { dishesScreenStyles } from "./styles/dishesScreenStyles";
import {
    getCountryBackgroundColor,
    transformApiDishesToDishData,
    truncateName,
} from "./utils/dishHelpers";

export default function DishesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const { likeRecipe } = useLikeRecipe();
  const { saveRecipe } = useSaveRecipe();

  const [dishStates, setDishStates] = useState<DishData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dishes, setDishes] = useState<DishData[]>([]);
  const [headerInfo, setHeaderInfo] = useState({
    title: "",
    description: "",
    summary: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const { loadingProgress, simulateAIRecipeGeneration } = useDishGeneration();

  useEffect(() => {
    parseApiData();
  }, []);

  const parseApiData = () => {
    try {
      console.log("Received params:", params);

      const dishData = params.dishData
        ? JSON.parse(params.dishData as string)
        : null;
      const localizedSummary = params.localizedSummary
        ? JSON.parse(params.localizedSummary as string)
        : null;

      console.log("Parsed dish data:", dishData);
      console.log("Localized summary:", localizedSummary);

      if (
        dishData &&
        dishData.DishSuggestions &&
        Array.isArray(dishData.DishSuggestions)
      ) {
        const transformedDishes = transformApiDishesToDishData(
          dishData.DishSuggestions
        );

        console.log("Transformed dishes:", transformedDishes);

        setDishes(transformedDishes);
        setHeaderInfo({
          title: dishData.CatchyTitle || "Found Dishes",
          description: dishData.IngredientDescription || "",
          summary: localizedSummary?.Summary || "",
        });

        startAIGeneration(transformedDishes);
      } else {
        console.warn("No dish data found in params or invalid format");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error parsing API data:", error);
      setIsLoading(false);
    }
  };

  const startAIGeneration = async (dishesToGenerate: DishData[]) => {
    for (let i = 0; i < dishesToGenerate.length; i++) {
      const dish = dishesToGenerate[i];
      await simulateAIRecipeGeneration([dish]);

      setTimeout(() => {
        setDishStates((prev) => [...prev, dish]);
      }, 100);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleBack = () => {
    router.back();
  };

  const handleDishPress = (dish: DishData) => {
    const searchedIngredients = params.ingredients
      ? JSON.parse(params.ingredients as string)
      : [];

    console.log("searchedIngredients dish", dish);
    router.push({
      pathname: `/main/dishes/${dish.id}` as any,
      params: {
        dishData: JSON.stringify(dish),
        searchedIngredients: JSON.stringify(searchedIngredients),
        searchId: params.searchId,
      },
    });
  };

  const handleLike = async (dish: DishData) => {
    // Get the searchId from params
    const searchId = params.searchId as string;
    
    if (!searchId) {
      console.error("No searchId available");
      Alert.alert("Error", "Unable to like recipe. Please try generating recipes again.");
      return;
    }

    console.log('Liking recipe:', { searchId, dishName: dish.name });
    
    // Optimistic UI update
    setDishStates((prev) =>
      prev.map((d) =>
        d.id === dish.id ? { ...d, isLiked: !d.isLiked } : d
      )
    );

    try {
      const res = await likeRecipe(searchId, dish.name);
      if (!res.success) throw new Error(res.error);
      console.log("✅ Recipe liked successfully");
    } catch (err: any) {
      console.error("Like error:", err);
      
      // Revert optimistic UI update
      setDishStates((prev) =>
        prev.map((d) =>
          d.id === dish.id ? { ...d, isLiked: !d.isLiked } : d
        )
      );

      // Show user-friendly error message
      const errorMessage = err.message || "Failed to like recipe";
      
      if (errorMessage.includes("Free users can only like")) {
        // Premium upgrade prompt - Show Superwall paywall
        Alert.alert(
          "Upgrade to Premium",
          "You've reached your free plan limit. Upgrade to Premium to like unlimited recipes!",
          [
            { text: "Not Now", style: "cancel" },
            { 
              text: "Upgrade", 
              onPress: () => {
                console.log("🔓 Opening Superwall paywall from like limit");
                // TODO: Implement Superwall paywall display
                // Superwall.register('like_limit_reached', {
                //   source: 'recipe_like',
                //   feature: 'likes'
                // });
              },
              style: "default"
            }
          ]
        );
      } else {
        // Generic error
        Alert.alert("Error", errorMessage);
      }
    }
  };

  // const handleLike = (dishId: number) => {
  //   setDishStates((prev) =>
  //     prev.map((dish) =>
  //       dish.id === dishId ? { ...dish, isLiked: !dish.isLiked } : dish
  //     )
  //   );
  // };

  const handleSave = async (dish: DishData) => {
    // Get the searchId from params
    const searchId = params.searchId as string;
    
    if (!searchId) {
      console.error("No searchId available");
      Alert.alert("Error", "Unable to save recipe. Please try generating recipes again.");
      return;
    }

    console.log('Saving recipe:', { searchId, dishName: dish.name });
    
    // Optimistic UI update
    setDishStates((prev) =>
      prev.map((d) =>
        d.id === dish.id ? { ...d, isSaved: !d.isSaved } : d
      )
    );

    try {
      const res = await saveRecipe(searchId, dish.name);
      if (!res.success) throw new Error(res.error);
      console.log("✅ Recipe saved successfully");
    } catch (err: any) {
      console.error("Save error:", err);
      
      // Revert optimistic UI update
      setDishStates((prev) =>
        prev.map((d) =>
          d.id === dish.id ? { ...d, isSaved: !d.isSaved } : d
        )
      );

      // Show user-friendly error message
      const errorMessage = err.message || "Failed to save recipe";
      
      if (errorMessage.includes("Free users can only save") || errorMessage.includes("Upgrade to premium")) {
        // Premium upgrade prompt - Show Superwall paywall
        Alert.alert(
          "Upgrade to Premium",
          "You've reached your free plan limit. Upgrade to Premium to save unlimited recipes!",
          [
            { text: "Not Now", style: "cancel" },
            { 
              text: "Upgrade", 
              onPress: () => {
                console.log("🔓 Opening Superwall paywall from save limit");
                // TODO: Implement Superwall paywall display
                // Superwall.register('save_limit_reached', {
                //   source: 'recipe_save',
                //   feature: 'saves'
                // });
              },
              style: "default"
            }
          ]
        );
      } else {
        // Generic error
        Alert.alert("Error", errorMessage);
      }
    }
  };

  // const handleSave = (dishId: number) => {
  //   setDishStates((prev) =>
  //     prev.map((dish) =>
  //       dish.id === dishId ? { ...dish, isSaved: !dish.isSaved } : dish
  //     )
  //   );
  // };

  const renderSummaryText = (text: string) => {
    if (!text) return null;

    const words = text.split(" ");
    const maxWords = 20;
    const shouldTruncate = words.length > maxWords;

    const displayText = isExpanded ? text : words.slice(0, maxWords).join(" ");

    return (
      <View>
        <Text
          style={[
            dishesScreenStyles.summaryText,
            { color: theme.colors.text.secondary },
          ]}
        >
          {displayText}
          {!isExpanded && shouldTruncate && "..."}
        </Text>
        {shouldTruncate && (
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={dishesScreenStyles.readMoreButton}
          >
            <Text
              style={[
                dishesScreenStyles.readMoreText,
                { color: theme.colors.accent.primary },
              ]}
            >
              {isExpanded ? "Read less" : "Read more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        dishesScreenStyles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background.primary}
      />

      {/* Header */}
      <View style={dishesScreenStyles.header}>
        <TouchableOpacity
          style={[
            dishesScreenStyles.backButton,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={handleBack}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <View style={dishesScreenStyles.headerContent}>
          <Text
            style={[
              dishesScreenStyles.headerTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {isLoading
              ? "AI Discovering..."
              : headerInfo.title || "Found Dishes"}
          </Text>
          {isLoading && (
            <View style={dishesScreenStyles.aiHeaderIndicator}>
              <Ionicons name="sparkles" size={16} color="#667eea" />
              <Text
                style={[dishesScreenStyles.aiHeaderText, { color: "#667eea" }]}
              >
                Powered by AI
              </Text>
            </View>
          )}
        </View>

        <View style={dishesScreenStyles.headerSpacer} />
      </View>

      {/* Results Count */}
      <View style={dishesScreenStyles.resultsSection}>
        <Text
          style={[
            dishesScreenStyles.resultsText,
            { color: theme.colors.text.secondary },
          ]}
        >
          {isLoading
            ? `Generating ${dishes.length} personalized recipes...`
            : `${dishStates.length} delicious dishes found`}
        </Text>
        {headerInfo.summary &&
          !isLoading &&
          renderSummaryText(headerInfo.summary)}
      </View>

      {/* Dishes List */}
      <ScrollView
        style={dishesScreenStyles.dishesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dishesScreenStyles.dishesContent}
      >
        {dishes.map((dish) => {
          const isGenerated = dishStates.find((d) => d.id === dish.id);
          const progress = loadingProgress[dish.id as string] || 0;

          return isGenerated ? (
            <DishCompletedCard
              key={`completed-${dish.id}`}
              dish={dish}
              onPress={handleDishPress}
              onLike={handleLike}
              onSave={handleSave}
              getCountryBackgroundColor={getCountryBackgroundColor}
              truncateName={truncateName}
            />
          ) : (
            <DishLoadingCard
              key={`loading-${dish.id}`}
              dish={dish}
              progress={progress}
              onLike={handleLike}
              onSave={handleSave}
              getCountryBackgroundColor={getCountryBackgroundColor}
              truncateName={truncateName}
            />
          );
        })}

        {/* Empty state */}
        {!isLoading && dishes.length === 0 && (
          <View style={dishesScreenStyles.emptyState}>
            <Ionicons
              name="restaurant-outline"
              size={64}
              color={theme.colors.text.secondary}
            />
            <Text
              style={[
                dishesScreenStyles.emptyText,
                { color: theme.colors.text.secondary },
              ]}
            >
              No dishes found. Try adjusting your ingredients or search
              criteria.
            </Text>
          </View>
        )}

        <View style={dishesScreenStyles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
