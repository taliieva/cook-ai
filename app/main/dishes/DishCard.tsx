import { DishData } from '@/types/Dish';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AILoadingOverlay } from './AIOverloading';
// import { DishData } from '../types/Dish';
// import { AILoadingOverlay } from './AILoadingOverlay';

interface DishCardProps {
  dish: DishData;
  isLoading?: boolean;
  progress?: number;
  onPress: (dish: DishData) => void;
  onLike: (dishId: number) => void;
  onSave: (dishId: number) => void;
  theme: any;
}

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

const cultureToCountry: { [key: string]: string } = {
  'Italian': 'Italy',
  'Japanese': 'Japan',
  'Mexican': 'Mexico',
  'Thai': 'Thailand',
  'Indian': 'India',
  'American': 'USA',
  'Greek': 'Greece',
  'Turkish': 'Turkey',
  'Chinese': 'China',
  'Azerbaijani': 'Azerbaijan',
  'French': 'France',
};

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  isLoading = false,
  progress = 0,
  onPress,
  onLike,
  onSave,
  theme
}) => {
  const truncateName = (name: string, maxLength = 16): string => {
    return name?.length > maxLength ? name.substring(0, maxLength) + "..." : name;
  };

  const getCountryBackgroundColor = (culture: string): string => {
    const country = cultureToCountry[culture] || culture;
    return countryColors[country] || "#95A5A6";
  };

  const handlePress = () => {
    if (!isLoading) {
      onPress(dish);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.dishCard,
        {
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={handlePress}
      activeOpacity={isLoading ? 1 : 0.95}
      disabled={isLoading}
    >
      {/* Background dish content */}
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
            onPress={() => onLike(dish.id)}
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
            onPress={() => onSave(dish.id)}
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
      {isLoading && <AILoadingOverlay progress={progress} isVisible={isLoading} />}
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
});