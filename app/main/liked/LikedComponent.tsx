import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

const { width } = Dimensions.get("window");

// Mock liked recipes data
const mockLikedRecipes = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    cuisine: "Italian",
    cookTime: "20 min",
    difficulty: "Easy",
    ingredients: ["pasta", "eggs", "bacon", "parmesan"],
    rating: 4.8,
    image: "🍝",
    dateAdded: "2025-08-28",
    description: "Classic Italian pasta dish with creamy egg and cheese sauce"
  },
  {
    id: 2,
    name: "Chicken Teriyaki Bowl",
    cuisine: "Japanese",
    cookTime: "25 min",
    difficulty: "Medium",
    ingredients: ["chicken", "rice", "teriyaki sauce", "vegetables"],
    rating: 4.6,
    image: "🍱",
    dateAdded: "2025-08-25",
    description: "Delicious grilled chicken with sweet teriyaki glaze over rice"
  },
  {
    id: 3,
    name: "Vegetable Pad Thai",
    cuisine: "Thai",
    cookTime: "15 min",
    difficulty: "Easy",
    ingredients: ["rice noodles", "vegetables", "tofu", "pad thai sauce"],
    rating: 4.5,
    image: "🍜",
    dateAdded: "2025-08-20",
    description: "Authentic Thai stir-fried noodles with fresh vegetables"
  },
  {
    id: 4,
    name: "Beef Tacos",
    cuisine: "Mexican",
    cookTime: "30 min",
    difficulty: "Medium",
    ingredients: ["ground beef", "tortillas", "onions", "spices"],
    rating: 4.7,
    image: "🌮",
    dateAdded: "2025-08-15",
    description: "Flavorful ground beef tacos with traditional Mexican spices"
  },
  {
    id: 5,
    name: "Greek Salad",
    cuisine: "Greek",
    cookTime: "10 min",
    difficulty: "Easy",
    ingredients: ["tomatoes", "cucumber", "feta", "olives", "olive oil"],
    rating: 4.4,
    image: "🥗",
    dateAdded: "2025-08-10",
    description: "Fresh Mediterranean salad with feta cheese and olives"
  },
];

export default function LikedComponent({ userPlan = "free", onUpgrade, standalone = false }) {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Check if standalone mode from params or prop
  const isStandalone = standalone || params.standalone === 'true';
  
  const [likedRecipes, setLikedRecipes] = useState(mockLikedRecipes);
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

  const handleRemoveFromLiked = (recipeId) => {
    Alert.alert(
      "Remove Recipe",
      "Are you sure you want to remove this recipe from your liked list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setLikedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
          },
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "#4CAF50";
      case "medium": return "#FF9800";
      case "hard": return "#F44336";
      default: return theme.colors.text.secondary;
    }
  };

  const renderRecipeCard = (recipe) => (
    <View key={recipe.id} style={[styles.recipeCard, { 
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border
    }]}>
      {/* Recipe Header */}
      <View style={styles.recipeHeader}>
        <View style={styles.recipeImageContainer}>
          <Text style={styles.recipeEmoji}>{recipe.image}</Text>
        </View>
        
        <View style={styles.recipeInfo}>
          <Text style={[styles.recipeName, { color: theme.colors.text.primary }]}>
            {recipe.name}
          </Text>
          <Text style={[styles.cuisineText, { color: theme.colors.text.secondary }]}>
            {recipe.cuisine} • {recipe.cookTime}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(recipe.difficulty) }]}>
                {recipe.difficulty}
              </Text>
            </View>
            <Text style={[styles.ratingText, { color: theme.colors.text.secondary }]}>
              ⭐ {recipe.rating}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromLiked(recipe.id)}
        >
          <Ionicons
            name="heart"
            size={20}
            color="#FF6B6B"
          />
        </TouchableOpacity>
      </View>

      {/* Recipe Description */}
      <Text style={[styles.recipeDescription, { color: theme.colors.text.secondary }]}>
        {recipe.description}
      </Text>

      {/* Ingredients */}
      <View style={styles.ingredientsContainer}>
        <Text style={[styles.ingredientsLabel, { color: theme.colors.text.primary }]}>
          Ingredients:
        </Text>
        <View style={styles.ingredientsList}>
          {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
            <View key={index} style={[styles.ingredientTag, { 
              backgroundColor: theme.colors.accent.primary + "15",
              borderColor: theme.colors.accent.primary + "30"
            }]}>
              <Text style={[styles.ingredientText, { color: theme.colors.accent.primary }]}>
                {ingredient}
              </Text>
            </View>
          ))}
          {recipe.ingredients.length > 4 && (
            <View style={[styles.ingredientTag, { 
              backgroundColor: theme.colors.text.secondary + "15"
            }]}>
              <Text style={[styles.ingredientText, { color: theme.colors.text.secondary }]}>
                +{recipe.ingredients.length - 4} more
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.viewButton, { backgroundColor: theme.colors.accent.primary }]}
          onPress={() => router.push(`/main/dishes/${recipe.id}`)}
        >
          <Text style={styles.viewButtonText}>View Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cookButton, { 
          backgroundColor: theme.colors.background.primary,
          borderColor: theme.colors.accent.primary
        }]}>
          <Text style={[styles.cookButtonText, { color: theme.colors.accent.primary }]}>Cook Again</Text>
        </TouchableOpacity>
      </View>

      {/* Date Added */}
      <Text style={[styles.dateAdded, { color: theme.colors.text.secondary }]}>
        Saved on {new Date(recipe.dateAdded).toLocaleDateString()}
      </Text>
    </View>
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

      {likedRecipes.length === 0 ? (
        // Empty State
        <View style={styles.emptyState}>
          <Ionicons
            name="heart-outline"
            size={64}
            color={theme.colors.text.secondary}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
            No Saved Recipes Yet
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