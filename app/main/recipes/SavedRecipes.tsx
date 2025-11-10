import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
    View,
} from "react-native";
import { useFetchSavedRecipes } from "../dishes/hooks/useFetchSavedRecipes";
import { useSaveRecipe } from "../dishes/hooks/useSaveRecipe";
import { SavedRecipeCard } from "./components/SavedRecipeCard";

const { width, height } = Dimensions.get("window");

export default function SavedRecipesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { recipes: apiRecipes, loading, error, refreshRecipes } = useFetchSavedRecipes();
  const { saveRecipe } = useSaveRecipe();
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, name, difficulty
  
  // Transform API recipes to match component format
  const recipes = apiRecipes.map(recipe => ({
    id: recipe.id,
    name: recipe.dishName,
    culture: recipe.cuisineType,
    dishType: recipe.dishType || "Main Course",
    prepTime: recipe.prepTime || "25 min",
    calories: recipe.calories || 400,
    outdoorCost: recipe.outdoorCost || 15,
    homeCost: recipe.homeCost || 6,
    savedDate: recipe.savedAt,
    image: recipe.pictureUrl || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: [], // Could parse from steps
    difficulty: "Medium",
    rating: 4.5,
    searchId: recipe.searchId,
    // Store full API data for detail view
    apiRecipe: recipe,
  }));

  const handleBack = () => {
    router.back();
  };

  const handleRecipePress = (recipe: any) => {
    // Use the full API data that now includes steps and videoURL
    const fullRecipe = recipe.apiRecipe || apiRecipes.find(r => r.id === recipe.id);
    
    // Construct complete dish data object with backend data
    const dishData = {
      id: recipe.id,
      name: recipe.name,
      culture: recipe.culture,
      country: recipe.culture,
      dishType: recipe.dishType,
      prepTime: recipe.prepTime,
      calories: recipe.calories,
      outdoorCost: recipe.outdoorCost,
      homeCost: recipe.homeCost,
      moneySaved: recipe.outdoorCost - recipe.homeCost,
      image: recipe.image,
      isLiked: false,
      isSaved: true,
      shortDescription: fullRecipe?.shortDescription || "",
      steps: fullRecipe?.steps || [],           // ✅ Now has real steps from backend
      videoURL: fullRecipe?.videoURL || ""      // ✅ Now has real video URL from backend
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

  const handleUnsaveRecipe = async (recipe: any) => {
    try {
      // Call the save API again to toggle (unsave)
      const res = await saveRecipe(recipe.searchId, recipe.name);
      if (res.success) {
        // Refresh the list after successful unsave
        await refreshRecipes();
        console.log("✅ Recipe unsaved successfully");
      } else {
        Alert.alert("Error", res.error || "Failed to unsave recipe");
      }
    } catch (err) {
      console.error("Error unsaving recipe:", err);
      Alert.alert("Error", "Failed to remove recipe from saved list");
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchText.toLowerCase()) ||
    recipe.culture.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "difficulty":
        const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      default:
        return 0;
    }
  });

  const renderRecipeCard = (recipe: any) => {
    return (
      <SavedRecipeCard
        key={recipe.id}
        recipe={recipe}
        theme={theme}
        onPress={handleRecipePress}
        onUnsave={handleUnsaveRecipe}
      />
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

      {/* Header */}
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

        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          Saved Recipes
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchFilterSection}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text.primary }]}
            placeholder="Search saved recipes..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          {[
            { key: "recent", label: "Recent", icon: "time-outline" },
            { key: "name", label: "Name", icon: "text-outline" },
            { key: "difficulty", label: "Difficulty", icon: "bar-chart-outline" },
          ].map((sort) => (
            <TouchableOpacity
              key={sort.key}
              style={[
                styles.sortButton,
                {
                  backgroundColor:
                    sortBy === sort.key
                      ? theme.colors.accent.primary + "20"
                      : theme.colors.background.secondary,
                  borderColor:
                    sortBy === sort.key
                      ? theme.colors.accent.primary
                      : theme.colors.border,
                },
              ]}
              onPress={() => setSortBy(sort.key)}
            >
              <Ionicons
                name={sort.icon}
                size={16}
                color={
                  sortBy === sort.key
                    ? theme.colors.accent.primary
                    : theme.colors.text.secondary
                }
              />
              <Text
                style={[
                  styles.sortButtonText,
                  {
                    color:
                      sortBy === sort.key
                        ? theme.colors.accent.primary
                        : theme.colors.text.secondary,
                  },
                ]}
              >
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsSection}>
        <Text
          style={[styles.resultsText, { color: theme.colors.text.secondary }]}
        >
          {sortedRecipes.length} saved recipe{sortedRecipes.length !== 1 ? 's' : ''}
          {searchText ? ` matching "${searchText}"` : ''}
        </Text>
      </View>

      {/* Recipes List */}
      <ScrollView
        style={styles.recipesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.recipesContent}
      >
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={theme.colors.accent.primary} />
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary, marginTop: 16 }]}>
              Loading your saved recipes...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="alert-circle-outline"
              size={64}
              color={theme.colors.text.secondary}
              style={styles.emptyIcon}
            />
            <Text
              style={[
                styles.emptyTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Error Loading Recipes
            </Text>
            <Text
              style={[
                styles.emptyText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {error}
            </Text>
            <TouchableOpacity 
              style={[styles.viewButton, { backgroundColor: theme.colors.accent.primary, marginTop: 16, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }]}
              onPress={refreshRecipes}
            >
              <Text style={[styles.viewButtonText, { color: "white" }]}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : sortedRecipes.length > 0 ? (
          sortedRecipes.map((recipe) => renderRecipeCard(recipe))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="bookmark-outline"
              size={64}
              color={theme.colors.text.secondary}
              style={styles.emptyIcon}
            />
            <Text
              style={[
                styles.emptyTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {searchText ? "No matching recipes" : "No saved recipes yet"}
            </Text>
            <Text
              style={[
                styles.emptyText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {searchText 
                ? "Try adjusting your search terms"
                : "Start saving recipes you love to see them here!"
              }
            </Text>
          </View>
        )}

        {/* Bottom padding */}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },
  searchFilterSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },
  sortContainer: {
    flexDirection: "row",
    gap: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  recipesContainer: {
    flex: 1,
  },
  recipesContent: {
    paddingHorizontal: 20,
  },
  recipeCard: {
    flexDirection: "row",
    height: 140,
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
  imageSection: {
    width: 120,
    height: "100%",
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 2,
  },
  contentSection: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  unsaveButton: {
    padding: 4,
  },
  calorieRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calorieChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "rgba(52, 152, 219, 0.15)",
  },
  calorieText: {
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 3,
  },
  costContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  outdoorCost: {
    flexDirection: "row",
    alignItems: "center",
  },
  outdoorCostText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FF6B6B",
    marginLeft: 2,
  },
  costSeparator: {
    width: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 6,
  },
  homeCost: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeCostText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#4ECDC4",
    marginLeft: 2,
  },
  metadataRow: {
    marginBottom: 8,
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cultureChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 4,
  },
  cultureText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  metadataText: {
    fontSize: 9,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 9,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  savedDateText: {
    fontSize: 9,
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});