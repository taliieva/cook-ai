import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Enhanced mock dishes data with more details
const dishes = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    culture: "Italian",
    country: "Italy",
    dishType: "Pasta",
    prepTime: "25 min",
    calories: 520,
    outdoorCost: 18,
    homeCost: 6,
    image:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isLiked: false,
    isSaved: true,
  },
  {
    id: 2,
    name: "Chicken Teriyaki",
    culture: "Japanese",
    country: "Japan",
    dishType: "Main Course",
    prepTime: "30 min",
    calories: 380,
    outdoorCost: 22,
    homeCost: 8,
    image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isLiked: true,
    isSaved: false,
  },
  {
    id: 3,
    name: "Beef Tacos",
    culture: "Mexican",
    country: "Mexico",
    dishType: "Street Food",
    prepTime: "20 min",
    calories: 290,
    outdoorCost: 12,
    homeCost: 4,
    image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isLiked: false,
    isSaved: false,
  },
  {
    id: 4,
    name: "Pad Thai",
    culture: "Thai",
    country: "Thailand",
    dishType: "Stir-fry",
    prepTime: "35 min",
    calories: 450,
    outdoorCost: 16,
    homeCost: 7,
    image:
        "https://images.unsplash.com/photo-1559314809-0f31657def5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isLiked: true,
    isSaved: true,
  },
  {
    id: 5,
    name: "Chicken Curry",
    culture: "Indian",
    country: "India",
    dishType: "Curry",
    prepTime: "45 min",
    calories: 410,
    outdoorCost: 14,
    homeCost: 5,
    image:
        "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isLiked: false,
    isSaved: true,
  },
  {
    id: 6,
    name: "Caesar Salad",
    culture: "American",
    country: "USA",
    dishType: "Salad",
    prepTime: "15 min",
    calories: 250,
    outdoorCost: 15,
    homeCost: 4,
    image:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isLiked: true,
    isSaved: false,
  },
];

// Country color mapping with appropriate colors
const countryColors = {
  Turkey: "#DC143C",
  Japan: "#BC002D",
  Italy: "#009246",
  France: "#0055A4",
  Mexico: "#006847",
  India: "#FF9933",
  USA: "#B22234",
  Thailand: "#ED1C24",
  Greece: "#0D5EAF",
};

// AI Loading Overlay Component
const AILoadingOverlay = ({ progress, isVisible }) => {
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isVisible) {
      // Rotation animation
      const rotateAnimation = Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
      );

      // Pulse animation
      const pulseAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
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
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
      <View style={styles.loadingOverlay}>
        {/* Blurred background overlay */}
        <View style={styles.blurOverlay} />

        {/* Circular Progress */}
        <View style={styles.circularProgressContainer}>
          <Animated.View
              style={[
                styles.circularProgress,
                {
                  transform: [
                    { rotate: rotation },
                    { scale: pulseAnim },
                  ],
                },
              ]}
          >
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']}
                style={styles.progressCircle}
            >
              <View style={styles.progressInner}>
                <Ionicons name="sparkles" size={20} color="white" />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Progress Text */}
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
            <Text style={styles.aiCraftingText}>AI Crafting</Text>
          </View>
        </View>
      </View>
  );
};

export default function DishesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [dishStates, setDishStates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({});

  useEffect(() => {
    // Simulate AI recipe generation
    simulateAIRecipeGeneration();
  }, []);

  const simulateAIRecipeGeneration = async () => {
    // Initialize loading states
    const initialProgress = {};
    dishes.forEach(dish => {
      initialProgress[dish.id] = 0;
    });
    setLoadingProgress(initialProgress);

    // Generate recipes one by one with AI-like progression
    for (let i = 0; i < dishes.length; i++) {
      const dish = dishes[i];

      // Start loading this dish
      await simulateDishGeneration(dish.id, i);

      // Add the completed dish to state
      setTimeout(() => {
        setDishStates(prev => [...prev, dish]);
      }, 100);
    }

    // All done
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const simulateDishGeneration = (dishId, index) => {
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
            // Early stage - very light feedback
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          } else if (currentPercentage <= 50) {
            // Mid stage - light feedback every 2%
            if (currentPercentage % 2 === 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
          } else if (currentPercentage <= 75) {
            // Advanced stage - medium feedback every 3%
            if (currentPercentage % 3 === 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
          } else if (currentPercentage <= 90) {
            // Almost done - medium feedback every 2%
            if (currentPercentage % 2 === 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
          } else if (currentPercentage <= 99) {
            // Final stretch - light feedback every 1%
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
        }

        // Special haptic for completion
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Success haptic feedback
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          resolve();
        }

        setLoadingProgress(prev => ({
          ...prev,
          [dishId]: progress
        }));
      }, 150 + Math.random() * 200); // Faster updates for smoother percentage increments
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleDishPress = (dish) => {
    router.push(`/main/dishes/${dish.id}`);
  };

  const handleLike = (dishId) => {
    setDishStates((prev) =>
        prev.map((dish) =>
            dish.id === dishId ? { ...dish, isLiked: !dish.isLiked } : dish
        )
    );
  };

  const handleSave = (dishId) => {
    setDishStates((prev) =>
        prev.map((dish) =>
            dish.id === dishId ? { ...dish, isSaved: !dish.isSaved } : dish
        )
    );
  };

  const truncateName = (name, maxLength = 12) => {
    return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
  };

  const getCountryBackgroundColor = (culture) => {
    const cultureToCountry = {
      'Italian': 'Italy',
      'Japanese': 'Japan',
      'Mexican': 'Mexico',
      'Thai': 'Thailand',
      'Indian': 'India',
      'American': 'USA',
      'Greek': 'Greece',
      'Turkish': 'Turkey'
    };

    const country = cultureToCountry[culture];
    return countryColors[country] || "#95A5A6";
  };

  const renderLoadingCard = (dish, index) => {
    const progress = loadingProgress[dish.id] || 0;
    const isLoading = progress < 100;

    return (
        <View
            key={`dish-${dish.id}`}
            style={[
              styles.dishCard,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.border,
              },
            ]}
        >
          {/* Background dish content (blurred when loading) */}
          <View style={[styles.dishContent, isLoading && styles.blurredContent]}>
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
                    <Ionicons
                        name="home-outline"
                        size={10}
                        color="#4ECDC4"
                    />
                    <Text style={styles.homeCostText}>
                      ${dish.homeCost}
                    </Text>
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
                    <Text style={styles.cultureText}>
                      {dish.culture}
                    </Text>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
          <AILoadingOverlay progress={progress} isVisible={isLoading} />
        </View>
    );
  };

  const renderDishCard = (dish) => {
    return (
        <TouchableOpacity
            key={dish.id}
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
                  <Ionicons
                      name="home-outline"
                      size={10}
                      color="#4ECDC4"
                  />
                  <Text style={styles.homeCostText}>
                    ${dish.homeCost}
                  </Text>
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
                  <Text style={styles.cultureText}>
                    {dish.culture}
                  </Text>
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
              {isLoading ? "AI Discovering..." : "Found Dishes"}
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
                : `${dishStates.length} delicious dishes found`
            }
          </Text>
        </View>

        {/* Dishes List */}
        <ScrollView
            style={styles.dishesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.dishesContent}
        >
          {/* Show all dishes with loading overlays */}
          {dishes.map((dish, index) => {
            const isGenerated = dishStates.find(d => d.id === dish.id);
            return isGenerated ? renderDishCard(dish) : renderLoadingCard(dish, index);
          })}

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
  loadingCard: {
    justifyContent: "center",
    alignItems: "center",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  spinnerContainer: {
    marginBottom: 12,
  },
  aiSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerCore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingTextContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  loadingText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  progressText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  progressBarContainer: {
    width: "80%",
    alignItems: "center",
  },
  progressBarBackground: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
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
  bottomPadding: {
    height: 20,
  },
});