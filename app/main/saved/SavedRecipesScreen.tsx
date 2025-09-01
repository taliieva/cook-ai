import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Mock saved recipes data
const savedRecipes = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    culture: "Italian",
    dishType: "Pasta",
    prepTime: "25 min",
    calories: 520,
    outdoorCost: 18,
    homeCost: 6,
    savedDate: "2024-12-15",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["spaghetti", "eggs", "bacon", "parmesan", "black pepper"],
    difficulty: "Medium",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Pad Thai",
    culture: "Thai",
    dishType: "Stir-fry",
    prepTime: "35 min",
    calories: 450,
    outdoorCost: 16,
    homeCost: 7,
    savedDate: "2024-12-12",
    image:
      "https://images.unsplash.com/photo-1559314809-0f31657def5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["rice noodles", "shrimp", "bean sprouts", "tamarind", "peanuts"],
    difficulty: "Hard",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Chicken Curry",
    culture: "Indian",
    dishType: "Curry",
    prepTime: "45 min",
    calories: 410,
    outdoorCost: 14,
    homeCost: 5,
    savedDate: "2024-12-10",
    image:
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["chicken", "curry powder", "coconut milk", "onions", "ginger"],
    difficulty: "Medium",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Greek Moussaka",
    culture: "Greek",
    dishType: "Casserole",
    prepTime: "60 min",
    calories: 580,
    outdoorCost: 25,
    homeCost: 9,
    savedDate: "2024-12-08",
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["eggplant", "ground lamb", "bechamel", "tomatoes", "cheese"],
    difficulty: "Hard",
    rating: 4.9,
  },
];

// Country color mapping
const countryColors = {
  Italian: "#009246",
  Thai: "#ED1C24", 
  Indian: "#FF9933",
  Greek: "#0D5EAF",
  Mexican: "#006847",
  Japanese: "#BC002D",
  American: "#B22234",
  Turkish: "#DC143C",
  French: "#0055A4",
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy": return "#4CAF50";
    case "Medium": return "#FF9800";
    case "Hard": return "#F44336";
    default: return "#9E9E9E";
  }
};

export default function SavedRecipesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState(savedRecipes);
  const [sortBy, setSortBy] = useState("recent"); // recent, name, difficulty

  const handleBack = () => {
    router.back();
  };

  const handleRecipePress = (recipe: any) => {
    router.push(`/main/dishes/${recipe.id}`);
  };

  const handleUnsaveRecipe = (recipeId: number) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchText.toLowerCase()) ||
    recipe.culture.toLowerCase().includes(searchText.toLowerCase()) ||
    recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchText.toLowerCase())
    )
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

  const truncateName = (name: string, maxLength: number = 16) => {
    return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
  };

  const getCountryBackgroundColor = (culture: string) => {
    return countryColors[culture] || "#95A5A6";
  };

  const formatSavedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const renderRecipeCard = (recipe: any) => {
    return (
      <TouchableOpacity
        key={recipe.id}
        style={[
          styles.recipeCard,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => handleRecipePress(recipe)}
        activeOpacity={0.95}
      >
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
          
          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{recipe.rating}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Recipe name and unsave button */}
          <View style={styles.headerRow}>
            <Text
              style={[styles.recipeName, { color: theme.colors.text.primary }]}
            >
              {truncateName(recipe.name)}
            </Text>
            <TouchableOpacity
              style={styles.unsaveButton}
              onPress={() => handleUnsaveRecipe(recipe.id)}
            >
              <Ionicons
                name="bookmark"
                size={18}
                color={theme.colors.accent.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Calories and Cost */}
          <View style={styles.calorieRow}>
            <View style={styles.calorieChip}>
              <Ionicons
                name="flame"
                size={10}
                color={theme.colors.accent.primary}
              />
              <Text
                style={[
                  styles.calorieText,
                  { color: theme.colors.accent.primary },
                ]}
              >
                {recipe.calories} cal
              </Text>
            </View>
            
            <View style={styles.costContainer}>
              <View style={styles.outdoorCost}>
                <Ionicons
                  name="storefront-outline"
                  size={8}
                  color="#FF6B6B"
                />
                <Text style={styles.outdoorCostText}>
                  ${recipe.outdoorCost}
                </Text>
              </View>
              <View style={styles.costSeparator} />
              <View style={styles.homeCost}>
                <Ionicons
                  name="home-outline"
                  size={8}
                  color="#4ECDC4"
                />
                <Text style={styles.homeCostText}>
                  ${recipe.homeCost}
                </Text>
              </View>
            </View>
          </View>

          {/* Metadata */}
          <View style={styles.metadataRow}>
            <View style={styles.metadataContainer}>
              <View
                style={[
                  styles.cultureChip,
                  { backgroundColor: getCountryBackgroundColor(recipe.culture) },
                ]}
              >
                <Text style={styles.cultureText}>
                  {recipe.culture}
                </Text>
              </View>
              <Text
                style={[
                  styles.metadataText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                • {recipe.dishType} • {recipe.prepTime}
              </Text>
            </View>
          </View>

          {/* Bottom row - Difficulty and saved date */}
          <View style={styles.bottomRow}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(recipe.difficulty) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(recipe.difficulty) },
                ]}
              >
                {recipe.difficulty}
              </Text>
            </View>
            <Text
              style={[
                styles.savedDateText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Saved {formatSavedDate(recipe.savedDate)}
            </Text>
          </View>
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
        {sortedRecipes.length > 0 ? (
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