import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useFetchLikedRecipes } from "../dishes/hooks/useFetchLikedRecipes";
import { useLikeRecipe } from "../dishes/hooks/useLikeRecipes";
import { LikedRecipeCard } from "./components/LikedRecipeCard";

const { width } = Dimensions.get("window");

interface LikedComponentProps {
  userPlan?: string;
  onUpgrade?: () => void;
  standalone?: boolean;
}

export default function LikedComponent({ userPlan = "free", onUpgrade, standalone = false }: LikedComponentProps) {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { recipes: apiRecipes, loading, error, refreshRecipes } = useFetchLikedRecipes();
  const { likeRecipe } = useLikeRecipe();
  
  // Check if standalone mode from params or prop
  const isStandalone = standalone || params.standalone === 'true';
  
  // Transform API recipes to match component format
  const likedRecipes = apiRecipes.map(recipe => ({
    id: recipe.id,
    name: recipe.dishName,
    cuisine: recipe.cuisineType,
    cookTime: recipe.prepTime || "25 min",
    difficulty: "Medium", // Default value
    ingredients: [] as string[], // Type it as string array
    rating: 4.5, // Default value
    image: "🍽️", // Default emoji
    dateAdded: recipe.likedAt,
    description: recipe.shortDescription || "Delicious recipe",
    searchId: recipe.searchId,
    // Store full data for detail view
    apiRecipe: recipe,
  }));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleBack = () => {
    router.back();
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "italian", label: "Italian" },
    { key: "japanese", label: "Japanese" },
    { key: "thai", label: "Thai" },
    { key: "mexican", label: "Mexican" },
    { key: "greek", label: "Greek" },
  ];

  // Filter recipes based on search and filter
  const filteredRecipes = likedRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesFilter = selectedFilter === "all" || 
                         recipe.cuisine.toLowerCase() === selectedFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleRemoveFromLiked = async (recipe: any) => {
    Alert.alert(
      "Remove Recipe",
      "Are you sure you want to remove this recipe from your liked list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // Call the like API again to toggle (unlike)
              const res = await likeRecipe(recipe.searchId, recipe.name);
              if (res.success) {
                // Refresh the list after successful unlike
                await refreshRecipes();
                console.log("✅ Recipe unliked successfully");
              } else {
                Alert.alert("Error", res.error || "Failed to unlike recipe");
              }
            } catch (err) {
              console.error("Error unliking recipe:", err);
              Alert.alert("Error", "Failed to remove recipe from liked list");
            }
          },
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "#4CAF50";
      case "medium": return "#FF9800";
      case "hard": return "#F44336";
      default: return theme.colors.text.secondary;
    }
  };

  const handleViewRecipe = (recipe: any) => {
    // Use the full API data that now includes steps and videoURL
    const fullRecipe = recipe.apiRecipe || apiRecipes.find(r => r.id === recipe.id);
    
    // Construct complete dish data object
    const dishData = {
      id: recipe.id,
      name: recipe.name,
      culture: recipe.cuisine,
      country: recipe.cuisine,
      dishType: fullRecipe?.dishType || "Main Course",
      prepTime: fullRecipe?.prepTime || recipe.cookTime,
      calories: fullRecipe?.calories || 400,
      outdoorCost: fullRecipe?.outdoorCost || 15,
      homeCost: fullRecipe?.homeCost || 6,
      moneySaved: (fullRecipe?.outdoorCost || 15) - (fullRecipe?.homeCost || 6),
      image: fullRecipe?.pictureUrl || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
      isLiked: true,
      isSaved: false,
      shortDescription: fullRecipe?.shortDescription || recipe.description,
      steps: fullRecipe?.steps || [],
      videoURL: fullRecipe?.videoURL || ""
    };

    console.log("📱 Navigating to dish detail with full data:", {
      hasSteps: dishData.steps.length > 0,
      hasVideo: !!dishData.videoURL,
      stepsCount: dishData.steps.length
    });

    router.push({
      pathname: `/main/dishes/${recipe.id}` as any,
      params: {
        dishData: JSON.stringify(dishData),
        searchedIngredients: JSON.stringify(recipe.ingredients || []),
        searchId: recipe.searchId || "",
      },
    });
  };

  const handleCookAgain = (recipe: any) => {
    // Implement cook again functionality
    console.log("Cook again:", recipe.name);
  };

  const renderRecipeCard = (recipe: any) => (
    <LikedRecipeCard
      key={recipe.id}
      recipe={recipe}
      theme={theme}
      onViewRecipe={handleViewRecipe}
      onCookAgain={handleCookAgain}
      onRemove={handleRemoveFromLiked}
    />
  );

  const renderUpgradePrompt = () => (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Liked Recipes ❤️
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Your saved favorite recipes
          </Text>
        </View>

        {/* Show first 3 recipes */}
        {likedRecipes.slice(0, 3).map(renderRecipeCard)}

        {/* Upgrade Prompt */}
        <LinearGradient
          colors={['#007AFF', '#0056CC']}
          style={styles.upgradeCard}
        >
          <Text style={styles.upgradeTitle}>Unlock All Saved Recipes</Text>
          <Text style={styles.upgradeSubtitle}>
            You have {likedRecipes.length} saved recipes. Upgrade to Pro to access all of them and save unlimited recipes!
          </Text>
          <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
            <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );

  const renderMainContent = () => (
    <>
      {/* Header */}
      <View style={[styles.header, isStandalone && styles.standaloneHeader]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Liked Recipes ❤️
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {likedRecipes.length} saved recipes
        </Text>
      </View>

      {loading ? (
        // Loading State
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={theme.colors.accent.primary} />
          <Text style={[styles.emptySubtitle, { color: theme.colors.text.secondary, marginTop: 16 }]}>
            Loading your liked recipes...
          </Text>
        </View>
      ) : error ? (
        // Error State
        <View style={styles.emptyState}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={theme.colors.text.secondary}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
            Error Loading Recipes
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.text.secondary }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.viewButton, { backgroundColor: theme.colors.accent.primary, marginTop: 16 }]}
            onPress={refreshRecipes}
          >
            <Text style={styles.viewButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : likedRecipes.length === 0 ? (
        // Empty State
        <View style={styles.emptyState}>
          <Ionicons
            name="heart-outline"
            size={64}
            color={theme.colors.text.secondary}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
            No Liked Recipes Yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.text.secondary }]}>
            Start exploring recipes and save your favorites by tapping the heart icon!
          </Text>
        </View>
      ) : (
        <>
          {/* Search Bar */}
          <View style={[styles.searchContainer, { 
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border
          }]}>
            <Ionicons
              name="search"
              size={16}
              color={theme.colors.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text.primary }]}
              placeholder="Search your saved recipes..."
              placeholderTextColor={theme.colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={[styles.filterContainer, isStandalone && styles.standaloneFilterContainer]}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: selectedFilter === filter.key 
                      ? theme.colors.accent.primary
                      : theme.colors.background.secondary,
                    borderColor: selectedFilter === filter.key
                      ? theme.colors.accent.primary
                      : theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[
                  styles.filterText,
                  {
                    color: selectedFilter === filter.key 
                      ? 'white' 
                      : theme.colors.text.secondary,
                  },
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Recipes List */}
          <ScrollView 
            style={[styles.scrollView, isStandalone && styles.standaloneScrollView]} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {filteredRecipes.length === 0 ? (
              <View style={styles.noResultsState}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={theme.colors.text.secondary}
                  style={styles.noResultsIcon}
                />
                <Text style={[styles.noResultsText, { color: theme.colors.text.secondary }]}>
                  No recipes found matching your search.
                </Text>
              </View>
            ) : (
              filteredRecipes.map(renderRecipeCard)
            )}

            {/* Bottom Padding for standalone mode */}
            {isStandalone && <View style={styles.bottomPadding} />}
          </ScrollView>
        </>
      )}
    </>
  );

  // If standalone mode, wrap with SafeAreaView and header
  if (isStandalone) {
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

        {/* Header with Back Button for standalone */}
        <View style={styles.standaloneHeaderSection}>
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

          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            Liked Recipes
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Results Count for standalone */}
        {likedRecipes.length > 0 && (
          <View style={styles.resultsSection}>
            <Text
              style={[styles.resultsText, { color: theme.colors.text.secondary }]}
            >
              {likedRecipes.length} liked recipe{likedRecipes.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* Handle upgrade prompt in standalone mode */}
        {userPlan === "free" && likedRecipes.length > 3 ? renderUpgradePrompt() : renderMainContent()}
      </SafeAreaView>
    );
  }

  // Regular tab mode
  if (userPlan === "free" && likedRecipes.length > 3) {
    return renderUpgradePrompt();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {renderMainContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Standalone mode styles
  standaloneHeaderSection: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  standaloneHeader: {
    paddingTop: 5,
  },
  standaloneFilterContainer: {
    maxHeight: 36,
  },
  standaloneScrollView: {
    paddingHorizontal: 20,
  },
  bottomPadding: {
    height: 40,
  },
  // Regular styles
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    maxHeight: 44,
  },
  filterContent: {
    alignItems: 'center',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  recipeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recipeImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  recipeEmoji: {
    fontSize: 20,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cuisineText: {
    fontSize: 14,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  ratingText: {
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
  },
  recipeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientsLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  ingredientsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ingredientTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  ingredientText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  cookButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  cookButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateAdded: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.7,
  },
  noResultsState: {
    padding: 40,
    alignItems: "center",
  },
  noResultsIcon: {
    opacity: 0.5,
    marginBottom: 12,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
  },
  upgradeCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  upgradeButton: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});