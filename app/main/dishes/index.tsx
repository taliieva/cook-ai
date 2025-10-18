import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {Animated, Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {DishData,ApiDish} from "@/types/dish";

const { width, height } = Dimensions.get("window");


// Country color mapping with appropriate colors
const countryColors: { [key: string]: string } = {
  Turkey: "#DC143C",
  Japan: "#BC002D",
  Italy: "#009246",
  France: "#0055A4",
  Mexico: "#006847",
  India: "#FF9933",
  USA: "#B22234",
  "United States": "#B22234",
  Thailand: "#ED1C24",
  Greece: "#0D5EAF",
  China: "#DE2910",
  Azerbaijan: "#3F9C35",
  "All Countries": "#95A5A6",
};

// Culture to country mapping
const cultureToCountry: { [key: string]: string } = {
  Italian: "Italy",
  Japanese: "Japan",
  Mexican: "Mexico",
  Thai: "Thailand",
  Indian: "India",
  American: "USA",
  Greek: "Greece",
  Turkish: "Turkey",
  Chinese: "China",
  Azerbaijani: "Azerbaijan",
  French: "France",
};

const gradientColors = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#f5576c",
  "#4facfe",
  "#00f2fe",
] as const;

const AILoadingOverlay = ({
  progress,
  isVisible,
}: {
  progress: number;
  isVisible: boolean;
}) => {
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      // Trigger haptic feedback for convenience
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Scale in animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 4,
        useNativeDriver: true,
      }).start();

      // Rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        })
      );

      // Pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      pulseAnimation.start();

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
      };
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        modernStyles.loadingOverlay,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={modernStyles.modernBlurOverlay} />

      <View style={modernStyles.modernLoadingContainer}>
        {/* Outer glow ring */}
        <Animated.View
          style={[
            modernStyles.glowRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.15],
                outputRange: [0.4, 0.7],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            style={modernStyles.glowGradient}
          />
        </Animated.View>

        {/* Main progress circle */}
        <Animated.View
          style={[
            modernStyles.modernProgressCircle,
            { transform: [{ rotate: rotation }] },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            style={modernStyles.modernProgressGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={modernStyles.modernProgressInner}>
              <View style={modernStyles.iconContainer}>
                <Ionicons name="restaurant" size={22} color="white" />
              </View>

              <View style={modernStyles.dotsContainer}>
                {[0, 1, 2].map((index) => (
                  <Animated.View
                    key={index}
                    style={[
                      modernStyles.animatedDot,
                      {
                        opacity: rotateAnim.interpolate({
                          inputRange: [0, 0.33, 0.66, 1],
                          outputRange:
                            index === 0
                              ? [1, 0.3, 0.3, 1]
                              : index === 1
                              ? [0.3, 1, 0.3, 0.3]
                              : [0.3, 0.3, 1, 0.3],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={modernStyles.modernTextContainer}>
          <Text style={modernStyles.modernProgressText}>
            {Math.round(progress)}%
          </Text>
          <View style={modernStyles.modernProgressBar}>
            <View style={modernStyles.modernProgressBarBg} />
            <Animated.View
              style={[
                modernStyles.modernProgressBarFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default function DishesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();

  const [dishStates, setDishStates] = useState<DishData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState<{
    [key: number]: number;
  }>({});
  const [dishes, setDishes] = useState<DishData[]>([]);
  const [headerInfo, setHeaderInfo] = useState({
    title: "",
    description: "",
    summary: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Parse the data from navigation params
    parseApiData();
  }, []);

  const parseApiData = () => {
    try {
      console.log("Received params:", params);

      // Parse the API response data
      const dishData = params.dishData
        ? JSON.parse(params.dishData as string)
        : null;
      const localizedSummary = params.localizedSummary
        ? JSON.parse(params.localizedSummary as string)
        : null;
      const ingredients = params.ingredients
        ? JSON.parse(params.ingredients as string)
        : [];

      console.log("Parsed dish data:", dishData);
      console.log("Localized summary:", localizedSummary);

      if (
        dishData &&
        dishData.DishSuggestions &&
        Array.isArray(dishData.DishSuggestions)
      ) {
        // Transform API response to component format
        const transformedDishes: DishData[] = dishData.DishSuggestions.map(
          (dish: ApiDish, index: number) => ({
            id: index + 1,
            name: dish.DishName || "Unknown Dish",
            culture: dish.CuisineType || "Unknown",
            country: dish.CuisineType || "Unknown",
            dishType: dish.DishType || "Unknown",
            prepTime: extractPrepTime(dish.EstimatedPortionSize) || "25 min",
            calories: dish.EstimatedCalories || 0,
            outdoorCost: dish.EstimatedOutsideCost || 0,
            homeCost: dish.EstimatedHomeCost || 0,
            moneySaved: dish.MoneySaved || 0,
            image:
              dish.PictureURL || getDefaultImageForCuisine(dish.CuisineType),
            isLiked: false,
            isSaved: false,
            shortDescription: dish.ShortDescription || "",
            steps: dish.Steps || [],
          })
        );

        console.log("Transformed dishes:", transformedDishes);

        setDishes(transformedDishes);
        setHeaderInfo({
          title: dishData.CatchyTitle || "Found Dishes",
          description: dishData.IngredientDescription || "",
          summary: localizedSummary?.Summary || "",
        });

        // Start the AI generation simulation
        simulateAIRecipeGeneration(transformedDishes);
      } else {
        console.warn("No dish data found in params or invalid format");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error parsing API data:", error);
      setIsLoading(false);
    }
  };

  const extractPrepTime = (portionSize: string): string => {
    // Try to extract time information or return default
    if (portionSize && typeof portionSize === "string") {
      if (portionSize.includes("min")) {
        return portionSize;
      }
      // If it's portion info, return default prep time
      return "25 min";
    }
    return "25 min";
  };

  const getDefaultImageForCuisine = (cuisine: string): string => {
    // Return default images based on cuisine type
    const defaultImages: { [key: string]: string } = {
      Italian:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      Mexican:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      American:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      Japanese:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      Chinese:
        "https://images.unsplash.com/photo-1559314809-0f31657def5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      Indian:
        "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      Thai: "https://images.unsplash.com/photo-1559314809-0f31657def5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      French:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    };

    return (
      defaultImages[cuisine] ||
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    );
  };

  const simulateAIRecipeGeneration = async (dishesToGenerate: DishData[]) => {
    // Initialize loading states
    const initialProgress: { [key: number]: number } = {};
    dishesToGenerate.forEach((dish) => {
      initialProgress[dish.id] = 0;
    });
    setLoadingProgress(initialProgress);

    // Generate recipes one by one with AI-like progression
    for (let i = 0; i < dishesToGenerate.length; i++) {
      const dish = dishesToGenerate[i];

      // Start loading this dish
      await simulateDishGeneration(dish.id, i);

      // Add the completed dish to state
      setTimeout(() => {
        setDishStates((prev) => [...prev, dish]);
      }, 100);
    }

    // All done
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const simulateDishGeneration = (
    dishId: number,
    index: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      let lastPercentage = 0;

      const interval = setInterval(() => {
        progress += Math.random() * 8 + 2; // Random increment 2-10%

        // Haptic feedback for every 1% increase
        const currentPercentage = Math.floor(progress);
        if (currentPercentage > lastPercentage && currentPercentage <= 100) {
          lastPercentage = currentPercentage;

          // Different haptic types based on progress ranges
          if (currentPercentage <= 25) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          } else if (currentPercentage <= 50) {
            if (currentPercentage % 2 === 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
          } else if (currentPercentage <= 75) {
            if (currentPercentage % 3 === 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
          } else if (currentPercentage <= 90) {
            if (currentPercentage % 2 === 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
          } else if (currentPercentage <= 99) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
        }

        // Special haptic for completion
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          resolve();
        }

        setLoadingProgress((prev) => ({
          ...prev,
          [dishId]: progress,
        }));
      }, 150 + Math.random() * 200);
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleDishPress = (dish: DishData) => {
    // Get ingredients from navigation params
    const searchedIngredients = params.ingredients
      ? JSON.parse(params.ingredients as string)
      : [];

    // Pass the dish data and searched ingredients to the detail screen
    router.push({
      pathname: `/main/dishes/${dish.id}`,
      params: {
        dishData: JSON.stringify(dish),
        searchedIngredients: JSON.stringify(searchedIngredients), // Add this line
      },
    });
  };

  const handleLike = (dishId: number) => {
    setDishStates((prev) =>
      prev.map((dish) =>
        dish.id === dishId ? { ...dish, isLiked: !dish.isLiked } : dish
      )
    );
  };

  const handleSave = (dishId: number) => {
    setDishStates((prev) =>
      prev.map((dish) =>
        dish.id === dishId ? { ...dish, isSaved: !dish.isSaved } : dish
      )
    );
  };

  const truncateName = (name: string, maxLength = 16): string => {
    return name?.length > maxLength
      ? name.substring(0, maxLength) + "..."
      : name;
  };

  const renderSummaryText = (text: string) => {
    if (!text) return null;

    const words = text.split(" ");
    const maxWords = 20; // Approximately 2 lines
    const shouldTruncate = words.length > maxWords;

    const displayText = isExpanded ? text : words.slice(0, maxWords).join(" ");

    return (
      <View>
        <Text
          style={[styles.summaryText, { color: theme.colors.text.secondary }]}
        >
          {displayText}
          {!isExpanded && shouldTruncate && "..."}
        </Text>
        {shouldTruncate && (
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={styles.readMoreButton}
          >
            <Text
              style={[
                styles.readMoreText,
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

  const getCountryBackgroundColor = (culture: string): string => {
    const country = cultureToCountry[culture] || culture;
    return countryColors[country] || "#95A5A6";
  };

  const renderLoadingCard = (dish: DishData, index: number) => {
    const progress = loadingProgress[dish.id] || 0;
    const isLoadingCard = progress < 100;

    return (
      <View
        key={`loading-${dish.id}-${index}`}
        style={[
          styles.dishCard,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* Background dish content (blurred when loading) */}
        <View
          style={[styles.dishContent, isLoadingCard && styles.blurredContent]}
        >
          {/* Left Section - Image */}
          <View style={styles.imageSection}>
            <Image
              source={{ uri: dish.image }}
              style={styles.dishImage}
              resizeMode="cover"
            />
          </View>

          {/* Right Section - Content */}
          <View style={styles.contentSection}>
            {/* Dish name - First */}
            <View style={styles.nameRow}>
              <Text
                style={[styles.dishName, { color: theme.colors.text.primary }]}
              >
                {truncateName(dish.name)}
              </Text>
            </View>

            {/* Calories and Cost - Second */}
            <View style={styles.calorieRow}>
              <View style={styles.calorieChip}>
                <Ionicons
                  name="flame"
                  size={12}
                  color={theme.colors.accent.primary}
                />
                <Text
                  style={[
                    styles.calorieText,
                    { color: theme.colors.accent.primary },
                  ]}
                >
                  {dish.calories} cal
                </Text>
              </View>

              <View style={styles.costContainer}>
                <View style={styles.outdoorCost}>
                  <Ionicons
                    name="storefront-outline"
                    size={10}
                    color="#FF6B6B"
                  />
                  <Text style={styles.outdoorCostText}>
                    ${dish.outdoorCost}
                  </Text>
                </View>
                <View style={styles.costSeparator} />
                <View style={styles.homeCost}>
                  <Ionicons name="home-outline" size={10} color="#4ECDC4" />
                  <Text style={styles.homeCostText}>${dish.homeCost}</Text>
                </View>
              </View>
            </View>

            {/* Metadata - Third */}
            <View style={styles.metadataRow}>
              <View style={styles.metadataContainer}>
                <View
                  style={[
                    styles.cultureChip,
                    {
                      backgroundColor: getCountryBackgroundColor(dish.culture),
                    },
                  ]}
                >
                  <Text style={styles.cultureText}>{dish.culture}</Text>
                </View>
                <Text
                  style={[
                    styles.metadataText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  • {dish.dishType} • {dish.prepTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Action buttons - Top corners */}
          <View style={styles.actionsContainer}>
            {/* Like button - Top left */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: dish.isLiked
                    ? "#FF6B6B" + "20"
                    : theme.colors.background.primary + "90",
                },
              ]}
              onPress={() => handleLike(dish.id)}
              disabled={isLoadingCard}
            >
              <Ionicons
                name={dish.isLiked ? "heart" : "heart-outline"}
                size={18}
                color={dish.isLiked ? "#FF6B6B" : theme.colors.text.secondary}
              />
            </TouchableOpacity>

            {/* Save button - Top right */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: dish.isSaved
                    ? theme.colors.accent.primary + "20"
                    : theme.colors.background.primary + "90",
                },
              ]}
              onPress={() => handleSave(dish.id)}
              disabled={isLoadingCard}
            >
              <Ionicons
                name={dish.isSaved ? "bookmark" : "bookmark-outline"}
                size={18}
                color={
                  dish.isSaved
                    ? theme.colors.accent.primary
                    : theme.colors.text.secondary
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Loading Overlay */}
        <AILoadingOverlay progress={progress} isVisible={isLoadingCard} />
      </View>
    );
  };

  const renderDishCard = (dish: DishData) => {

    return (
      <TouchableOpacity
        key={`completed-${dish.id}`}
        style={[
          styles.dishCard,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => handleDishPress(dish)}
        activeOpacity={0.95}
      >
        {/* Left Section - Image */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: dish.image }}
            style={styles.dishImage}
            resizeMode="cover"
          />
        </View>

        {/* Right Section - Content */}
        <View style={styles.contentSection}>
          {/* Dish name - First */}
          <View style={styles.nameRow}>
            <Text
              style={[styles.dishName, { color: theme.colors.text.primary }]}
            >
              {truncateName(dish.name)}
            </Text>
          </View>

          {/* Calories and Cost - Second */}
          <View style={styles.calorieRow}>
            <View style={styles.calorieChip}>
              <Ionicons
                name="flame"
                size={12}
                color={theme.colors.accent.primary}
              />
              <Text
                style={[
                  styles.calorieText,
                  { color: theme.colors.accent.primary },
                ]}
              >
                {dish.calories} cal
              </Text>
            </View>

            <View style={styles.costContainer}>
              <View style={styles.outdoorCost}>
                <Ionicons name="storefront-outline" size={10} color="#FF6B6B" />
                <Text style={styles.outdoorCostText}>${dish.outdoorCost}</Text>
              </View>
              <View style={styles.costSeparator} />
              <View style={styles.homeCost}>
                <Ionicons name="home-outline" size={10} color="#4ECDC4" />
                <Text style={styles.homeCostText}>${dish.homeCost}</Text>
              </View>
            </View>
          </View>

          {/* Metadata - Third */}
          <View style={styles.metadataRow}>
            <View style={styles.metadataContainer}>
              <View
                style={[
                  styles.cultureChip,
                  { backgroundColor: getCountryBackgroundColor(dish.culture) },
                ]}
              >
                <Text style={styles.cultureText}>{dish.culture}</Text>
              </View>
              <Text
                style={[
                  styles.metadataText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                • {dish.dishType} • {dish.prepTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Action buttons - Top corners */}
        <View style={styles.actionsContainer}>
          {/* Like button - Top left */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: dish.isLiked
                  ? "#FF6B6B" + "20"
                  : theme.colors.background.primary + "90",
              },
            ]}
            onPress={() => handleLike(dish.id)}
          >
            <Ionicons
              name={dish.isLiked ? "heart" : "heart-outline"}
              size={18}
              color={dish.isLiked ? "#FF6B6B" : theme.colors.text.secondary}
            />
          </TouchableOpacity>

          {/* Save button - Top right */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: dish.isSaved
                  ? theme.colors.accent.primary + "20"
                  : theme.colors.background.primary + "90",
              },
            ]}
            onPress={() => handleSave(dish.id)}
          >
            <Ionicons
              name={dish.isSaved ? "bookmark" : "bookmark-outline"}
              size={18}
              color={
                dish.isSaved
                  ? theme.colors.accent.primary
                  : theme.colors.text.secondary
              }
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background.primary}
      />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
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

        <View style={styles.headerContent}>
          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            {isLoading
              ? "AI Discovering..."
              : headerInfo.title || "Found Dishes"}
          </Text>
          {isLoading && (
            <View style={styles.aiHeaderIndicator}>
              <Ionicons name="sparkles" size={16} color="#667eea" />
              <Text style={[styles.aiHeaderText, { color: "#667eea" }]}>
                Powered by AI
              </Text>
            </View>
          )}
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Results Count */}
      <View style={styles.resultsSection}>
        <Text
          style={[styles.resultsText, { color: theme.colors.text.secondary }]}
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
        style={styles.dishesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.dishesContent}
      >
        {/* Show all dishes with loading overlays */}
        {dishes.map((dish, index) => {
          const isGenerated = dishStates.find((d) => d.id === dish.id);
          return isGenerated
            ? renderDishCard(dish)
            : renderLoadingCard(dish, index);
        })}

        {/* Empty state */}
        {!isLoading && dishes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="restaurant-outline"
              size={64}
              color={theme.colors.text.secondary}
            />
            <Text
              style={[styles.emptyText, { color: theme.colors.text.secondary }]}
            >
              No dishes found. Try adjusting your ingredients or search
              criteria.
            </Text>
          </View>
        )}

        {/* Bottom padding for footer */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  aiHeaderIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  aiHeaderText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  headerSpacer: {
    width: 44,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  readMoreButton: {
    marginTop: 4,
    alignSelf: "flex-start",
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  dishesContainer: {
    flex: 1,
  },
  dishesContent: {
    paddingHorizontal: 20,
  },
  dishCard: {
    flexDirection: "row",
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dishContent: {
    flex: 1,
    flexDirection: "row",
  },
  blurredContent: {
    opacity: 0.3,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 16,
  },
  circularProgressContainer: {
    alignItems: "center",
    zIndex: 30,
  },
  circularProgress: {
    marginBottom: 10,
  },
  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  progressInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressTextContainer: {
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "700",
    color: "#667eea",
    marginBottom: 3,
  },
  aiCraftingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#764ba2",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  imageSection: {
    width: 120,
    height: "100%",
  },
  dishImage: {
    width: "100%",
    height: "100%",
  },
  contentSection: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  nameRow: {
    marginBottom: 8,
  },
  dishName: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
  },
  calorieRow: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calorieChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(52, 152, 219, 0.15)",
  },
  calorieText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  costContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  outdoorCost: {
    flexDirection: "row",
    alignItems: "center",
  },
  outdoorCostText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FF6B6B",
    marginLeft: 3,
  },
  costSeparator: {
    width: 1,
    height: 12,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  homeCost: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeCostText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4ECDC4",
    marginLeft: 3,
  },
  metadataRow: {
    marginBottom: 8,
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cultureChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  cultureText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  metadataText: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionsContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  bottomPadding: {
    height: 20,
  },
});
const modernStyles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  modernBlurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 16,
    // Add subtle shadow effect
    shadowColor: "#0598CE",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 3,
  },
  modernLoadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
    position: "relative",
    // Ensure it's perfectly centered
    width: "100%",
    height: "100%",
  },
  glowRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    // Center the glow ring relative to the progress circle
    top: "50%",
    left: "50%",
    marginTop: -50, // Half of height
    marginLeft: -50, // Half of width
    zIndex: 1,
  },
  glowGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  modernProgressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    // Perfect center positioning
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -40, // Half of height
    marginLeft: -40, // Half of width
    zIndex: 2,
    shadowColor: "#0598CE",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  modernProgressGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  modernProgressInner: {
    width: "100%",
    height: "100%",
    borderRadius: 38,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconContainer: {
    marginBottom: 6,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 3,
  },
  animatedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  modernTextContainer: {
    alignItems: "center",
    minWidth: 100,
    // Position text below the circle
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -50, // Half of minWidth
    zIndex: 3,
  },
  modernProgressText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0598CE",
    marginBottom: 2,
    textShadowColor: "rgba(5, 152, 206, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modernStatusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#113768",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  modernProgressBar: {
    width: 80,
    height: 3,
    position: "relative",
    borderRadius: 1.5,
    overflow: "hidden",
  },
  modernProgressBarBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#E6F4FF",
    borderRadius: 1.5,
  },
  modernProgressBarFill: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#0598CE",
    borderRadius: 1.5,
    shadowColor: "#0598CE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
});

// import { styles } from "@/styles/screenStyles";
// import React, { useState } from "react";
// import { ScrollView, View } from "react-native";
// import { AILoadingOverlay } from "./AIOverlayLoading";
// import { DishCard } from "./DishCard";
// import { EmptyState } from "./EmptyState";
// import { Header } from "./Header";
// import { SummaryText } from "./SummaryText";

// export const DishesScreen = () => {
//   const [loading, setLoading] = useState(false);

//   return (
//     <View style={styles.container}>
//       <Header title="Your Dishes" onBack={() => {}} isAIActive={loading} />

//       {loading && <AILoadingOverlay progress={40} />}

//       <ScrollView contentContainerStyle={styles.dishesContent}>
//         <SummaryText
//           text="AI summary about your dishes..."
//           onReadMore={() => {}}
//         />

//         <DishCard
//           name="Plov"
//           image="https://picsum.photos/200"
//           calories={450}
//           homeCost="3₼"
//           outdoorCost="8₼"
//           searchId={""}
//         />

//         <EmptyState />
//       </ScrollView>
//     </View>
//   );
// };
