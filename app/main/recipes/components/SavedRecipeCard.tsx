import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCountryBackgroundColor, truncateName } from "../utils/recipeUtils";

interface SavedRecipeCardProps {
  recipe: any;
  theme: any;
  onPress: (recipe: any) => void;
  onUnsave: (recipe: any) => void;
}

export const SavedRecipeCard: React.FC<SavedRecipeCardProps> = ({
  recipe,
  theme,
  onPress,
  onUnsave,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.dishCard,
        {
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => onPress(recipe)}
      activeOpacity={0.95}
    >
      {/* Image Section */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.dishImage}
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.dishName, { color: theme.colors.text.primary }]}
          >
            {truncateName(recipe.name)}
          </Text>
        </View>

        {/* Calories and Cost */}
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
              {recipe.calories} cal
            </Text>
          </View>

          <View style={styles.costContainer}>
            <View style={styles.outdoorCost}>
              <Ionicons name="storefront-outline" size={10} color="#FF6B6B" />
              <Text style={styles.outdoorCostText}>${recipe.outdoorCost}</Text>
            </View>
            <View style={styles.costSeparator} />
            <View style={styles.homeCost}>
              <Ionicons name="home-outline" size={10} color="#4ECDC4" />
              <Text style={styles.homeCostText}>${recipe.homeCost}</Text>
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
              <Text style={styles.cultureText}>{recipe.culture}</Text>
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
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.accent.primary + "20",
            },
          ]}
          onPress={() => onUnsave(recipe)}
        >
          <Ionicons
            name="bookmark"
            size={18}
            color={theme.colors.accent.primary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dishCard: {
    flexDirection: "row",
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
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
    flexDirection: "row",
    alignItems: "center",
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cultureChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  cultureText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  metadataText: {
    fontSize: 11,
    fontWeight: "500",
  },
  actionsContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

