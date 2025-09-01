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
  TouchableOpacity,
  View,
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
  {
    id: 7,
    name: "Ramen Bowl",
    culture: "Japanese",
    country: "Japan",
    dishType: "Soup",
    prepTime: "40 min",
    calories: 480,
    outdoorCost: 20,
    homeCost: 6,
    image:
      "https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isLiked: false,
    isSaved: false,
  },
  {
    id: 8,
    name: "Greek Moussaka",
    culture: "Greek",
    country: "Greece",
    dishType: "Casserole",
    prepTime: "60 min",
    calories: 580,
    outdoorCost: 25,
    homeCost: 9,
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    isLiked: true,
    isSaved: true,
  },
];

// Country color mapping with appropriate colors
const countryColors = {
  Turkey: "#DC143C", // Turkish Red
  Japan: "#BC002D", // Japanese Red (from flag)
  Italy: "#009246", // Italian Green (from flag)
  France: "#0055A4", // French Blue (from flag)
  Mexico: "#006847", // Mexican Green (from flag)
  India: "#FF9933", // Saffron (from Indian flag)
  USA: "#B22234", // American Red (from flag)
  Thailand: "#ED1C24", // Thai Red (from flag)
  Greece: "#0D5EAF", // Greek Blue (from flag)
};

export default function DishesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [dishStates, setDishStates] = useState(dishes);

  const handleBack = () => {
    router.back();
  };

  const handleDishPress = (dish: any) => {
    router.push(`/main/dishes/${dish.id}`);
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

  const truncateName = (name: string, maxLength: number = 12) => {
    return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
  };

  const getCountryBackgroundColor = (culture: string) => {
    // Map culture to country for color lookup
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
    return countryColors[country] || "#95A5A6"; // Default gray if country not found
  };

  const renderDishCard = (dish: any) => {
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

        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          Found Dishes
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Results Count */}
      <View style={styles.resultsSection}>
        <Text
          style={[styles.resultsText, { color: theme.colors.text.secondary }]}
        >
          {dishStates.length} delicious dishes found
        </Text>
      </View>

      {/* Dishes List */}
      <ScrollView
        style={styles.dishesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.dishesContent}
      >
        {dishStates.map((dish) => renderDishCard(dish))}

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
  costRow: {
    marginBottom: 8,
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