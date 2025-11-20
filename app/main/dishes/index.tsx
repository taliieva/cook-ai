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
import { streamingService } from "./services/streamingService";

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
  const [streamComplete, setStreamComplete] = useState(false);

  const { loadingProgress, simulateAIRecipeGeneration } = useDishGeneration();

  // Check if we're in streaming mode
  const isStreaming = params.isStreaming === 'true';
  const [activeSearchId, setActiveSearchId] = useState<string>(params.searchId as string);
  const tempSearchId = params.searchId as string;

  useEffect(() => {
    if (isStreaming) {
      console.log("🎯 Dishes screen initializing with searchId:", tempSearchId);
      initializeStreamingMode();
    } else {
      parseApiData();
    }
  }, []);

  // Listen for streaming events
  useEffect(() => {
    if (!isStreaming || !tempSearchId) return;

    console.log("👂 Setting up event listeners for searchId:", tempSearchId);

    const handleStreamStarted = (event: any) => {
      console.log(`📨 Received stream_started event:`, event.searchId);
      console.log(`🔍 Checking against temp: ${tempSearchId}, active: ${activeSearchId}`);
      
      // Always accept the first stream_started event (it has the real searchId)
      // This is the backend's real searchId that we need to update to
      console.log(`📡 Stream started: ${event.totalDishes} dishes expected`);
      console.log(`🔑 Updating searchId from ${tempSearchId} to ${event.searchId}`);
      
      // Update to real searchId from backend
      setActiveSearchId(event.searchId);
      
      // Update placeholders count if backend returns different number
      if (event.totalDishes && event.totalDishes > dishes.length) {
        const additionalPlaceholders = Array.from(
          { length: event.totalDishes - dishes.length },
          (_, i) => createPlaceholderDish(dishes.length + i)
        );
        setDishes(prev => [...prev, ...additionalPlaceholders]);
      }
    };

    const handleDishData = (event: any) => {
      console.log(`📨 Received dish_data event:`, event.searchId, event.dishIndex);
      console.log(`🔍 Checking against temp: ${tempSearchId}, active: ${activeSearchId}`);
      
      // Accept dish data from activeSearchId (the real one from backend)
      if (event.searchId !== activeSearchId) {
        console.log(`❌ SearchId mismatch! Expected: ${activeSearchId}, Got: ${event.searchId}`);
        return;
      }
      
      console.log(`✅ Accepted dish ${event.dishIndex + 1}:`, event.data.name);

      setDishes(prev => {
        const newDishes = [...prev];
        
        // Ensure array is large enough
        while (newDishes.length <= event.dishIndex) {
          newDishes.push(createPlaceholderDish(newDishes.length));
        }
        
        // Replace placeholder with real data
        newDishes[event.dishIndex] = {
          ...event.data,
          isLoading: false,
        } as DishData;
        
        return newDishes;
      });

      // Add to dishStates for display (simulating the AI generation)
      setDishStates(prev => {
        // Check if this dish is already in the state
        const existingIndex = prev.findIndex(d => d.id === event.data.id);
        if (existingIndex >= 0) {
          return prev; // Already added
        }
        return [...prev, event.data as DishData];
      });
    };

    const handleStreamComplete = (event: any) => {
      console.log(`📨 Received stream_complete event:`, event.searchId);
      
      // Accept from activeSearchId (the real one from backend)
      if (event.searchId !== activeSearchId) {
        console.log(`❌ SearchId mismatch! Expected: ${activeSearchId}, Got: ${event.searchId}`);
        return;
      }
      
      console.log('✅ Stream complete, received full data');
      setStreamComplete(true);
      setIsLoading(false);

      // Remove any remaining loading placeholders
      setDishes(prev => prev.filter(d => !d.isLoading));

      // Update header info if available
      if (event.fullData) {
        setHeaderInfo({
          title: event.fullData.dishData?.CatchyTitle || "Your Dishes Are Ready!",
          description: event.fullData.dishData?.IngredientDescription || "",
          summary: event.fullData.localizedSummary?.Summary || "",
        });
      }
    };

    const handleStreamError = (event: any) => {
      console.log(`📨 Received stream_error event:`, event.searchId);
      
      // Accept from either searchId for errors
      if (event.searchId !== tempSearchId && event.searchId !== activeSearchId) return;
      
      console.error('❌ Stream error:', event.error, 'Type:', event.errorType);
      setIsLoading(false);
      setStreamComplete(true);
      
      // Check if this is a limit-exceeded error (403)
      if (event.errorType === 'LIMIT_EXCEEDED' || event.status === 403) {
        // User has reached their free plan limit - show upgrade prompt
        Alert.alert(
          '🔓 Upgrade to Premium',
          event.error || 'You\'ve reached your free plan limit. Upgrade to Premium for unlimited recipe searches!',
          [
            {
              text: 'Not Now',
              style: 'cancel',
              onPress: () => router.back(),
            },
            {
              text: 'Upgrade Now',
              style: 'default',
              onPress: async () => {
                console.log('🔓 Opening RevenueCat paywall from search limit');
                router.back();
                const { showPaywall } = await import('@/utils/subscriptions');
                await showPaywall();
              },
            },
          ]
        );
      } else {
        // Generic error - show standard error message
        Alert.alert(
          'Error Loading Dishes',
          event.error || 'Failed to load dishes. Please try again.',
          [
            {
              text: 'Go Back',
              onPress: () => router.back(),
            },
          ]
        );
      }
    };

    // Register event listeners and store subscriptions
    const sub1 = streamingService.on('stream_started', handleStreamStarted);
    const sub2 = streamingService.on('dish_data', handleDishData);
    const sub3 = streamingService.on('stream_complete', handleStreamComplete);
    const sub4 = streamingService.on('stream_error', handleStreamError);

    console.log("✅ Event listeners registered for:", tempSearchId);

    // Cleanup: remove subscriptions
    return () => {
      console.log("🧹 Cleaning up event listeners for:", tempSearchId);
      sub1?.remove?.();
      sub2?.remove?.();
      sub3?.remove?.();
      sub4?.remove?.();
    };
  }, [isStreaming, tempSearchId, activeSearchId]);

  // Helper: Create placeholder dish for loading state
  const createPlaceholderDish = (index: number): DishData => {
    return {
      id: `placeholder_${index}`,
      name: 'Loading...',
      culture: '',
      country: '',
      dishType: '',
      prepTime: '...',
      calories: 0,
      outdoorCost: 0,
      homeCost: 0,
      moneySaved: 0,
      image: '',
      isLiked: false,
      isSaved: false,
      shortDescription: '',
      steps: [],
      videoURL: '',
      isLoading: true, // Flag to indicate placeholder
    };
  };

  // Initialize streaming mode with placeholders
  const initializeStreamingMode = () => {
    console.log('🎬 Initializing streaming mode');
    
    const expectedCount = parseInt(params.expectedDishCount as string) || 3;
    const ingredients = params.ingredients ? JSON.parse(params.ingredients as string) : [];
    
    // Create placeholder dishes
    const placeholders = Array.from({ length: expectedCount }, (_, i) => 
      createPlaceholderDish(i)
    );
    
    setDishes(placeholders);
    setHeaderInfo({
      title: 'Finding Perfect Dishes...',
      description: `Analyzing ${ingredients.length} ingredients`,
      summary: 'Our AI is crafting personalized recipes just for you',
    });
    
    setIsLoading(false); // We're ready to show placeholders
  };

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

    // Use activeSearchId (real backend ID) instead of params.searchId (temp ID)
    const searchIdToPass = activeSearchId || params.searchId as string;
    
    console.log("Opening dish detail:", { 
      dish: dish.name, 
      searchId: searchIdToPass, 
      tempId: params.searchId,
      isStreaming 
    });
    
    router.push({
      pathname: `/main/dishes/${dish.id}` as any,
      params: {
        dishData: JSON.stringify(dish),
        searchedIngredients: JSON.stringify(searchedIngredients),
        searchId: searchIdToPass,
      },
    });
  };

  const handleLike = async (dish: DishData) => {
    // Use activeSearchId (real backend ID) instead of params.searchId (temp ID)
    const searchId = activeSearchId || params.searchId as string;
    
    if (!searchId) {
      console.error("No searchId available");
      Alert.alert("Error", "Unable to like recipe. Please try generating recipes again.");
      return;
    }

    console.log('Liking recipe:', { searchId, dishName: dish.name, isStreaming, tempId: params.searchId });
    
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
        // Premium upgrade prompt - Show RevenueCat paywall
        Alert.alert(
          "Upgrade to Premium",
          "You've reached your free plan limit. Upgrade to Premium to like unlimited recipes!",
          [
            { text: "Not Now", style: "cancel" },
            { 
              text: "Upgrade", 
              onPress: async () => {
                console.log("🔓 Opening RevenueCat paywall from like limit");
                const { showPaywall } = await import('@/utils/subscriptions');
                await showPaywall();
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
    // Use activeSearchId (real backend ID) instead of params.searchId (temp ID)
    const searchId = activeSearchId || params.searchId as string;
    
    if (!searchId) {
      console.error("No searchId available");
      Alert.alert("Error", "Unable to save recipe. Please try generating recipes again.");
      return;
    }

    console.log('Saving recipe:', { searchId, dishName: dish.name, isStreaming, tempId: params.searchId });
    
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
        // Premium upgrade prompt - Show RevenueCat paywall
        Alert.alert(
          "Upgrade to Premium",
          "You've reached your free plan limit. Upgrade to Premium to save unlimited recipes!",
          [
            { text: "Not Now", style: "cancel" },
            { 
              text: "Upgrade", 
              onPress: async () => {
                console.log("🔓 Opening RevenueCat paywall from save limit");
                const { showPaywall } = await import('@/utils/subscriptions');
                await showPaywall();
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
        {dishes.map((dish, index) => {
          const isGenerated = dishStates.find((d) => d.id === dish.id);
          const progress = loadingProgress[dish.id as string] || 0;
          
          // Use index + id for unique keys to avoid conflicts during streaming
          const uniqueKey = `dish-${index}-${dish.id}`;

          return isGenerated ? (
            <DishCompletedCard
              key={uniqueKey}
              dish={dish}
              onPress={handleDishPress}
              onLike={handleLike}
              onSave={handleSave}
              getCountryBackgroundColor={getCountryBackgroundColor}
              truncateName={truncateName}
            />
          ) : (
            <DishLoadingCard
              key={uniqueKey}
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
