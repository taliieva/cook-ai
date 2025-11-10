import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IngredientsListProps {
  ingredients: string[];
  selectedCountry: { name: string };
  onRemoveIngredient: (ingredient: string) => void;
  theme: any;
}

export const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  selectedCountry,
  onRemoveIngredient,
  theme,
}) => {
  return (
    <ScrollView
      style={styles.ingredientsSection}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
      >
        Your Ingredients ({ingredients.length})
      </Text>
      <View style={styles.ingredientsContainer}>
        {ingredients.map((ingredient: string, index: number) => (
          <View
            key={index}
            style={[
              styles.ingredientTag,
              {
                backgroundColor: theme.colors.accent.primary + "20",
                borderColor: theme.colors.accent.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.ingredientText,
                { color: theme.colors.accent.primary },
              ]}
            >
              {ingredient}
            </Text>
            <TouchableOpacity
              onPress={() => onRemoveIngredient(ingredient)}
              style={styles.removeButton}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.colors.accent.primary}
              />
            </TouchableOpacity>
          </View>
        ))}
        {ingredients.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="restaurant-outline"
              size={48}
              color={theme.colors.text.secondary}
            />
            <Text
              style={[
                styles.emptyText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Add ingredients to find amazing dishes from{" "}
              {selectedCountry.name.toLowerCase()} cuisine!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ingredientsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ingredientTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  removeButton: {
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    opacity: 0.7,
  },
});

