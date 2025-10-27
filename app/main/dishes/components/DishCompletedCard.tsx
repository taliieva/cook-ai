import { useTheme } from "@/hooks/useTheme";
import { DishData } from "@/types/dish";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { dishCardStyles } from "../styles/dishCardStyles";

type Props = {
  dish: DishData;
  onPress: (dish: DishData, searchId?: string) => void;
  onLike: (dish: any) => void;
  onSave: (dishId: any) => void;
  getCountryBackgroundColor: (culture: string) => string;
  truncateName: (name: string, maxLength?: number) => string;
};

export const DishCompletedCard: React.FC<Props> = ({
  dish,
  onPress,
  onLike,
  onSave,
  getCountryBackgroundColor,
  truncateName,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        dishCardStyles.dishCard,
        {
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => onPress(dish)}
      activeOpacity={0.95}
    >
      <View style={dishCardStyles.imageSection}>
        <Image
          source={{ uri: dish.image }}
          style={dishCardStyles.dishImage}
          resizeMode="cover"
        />
      </View>

      <View style={dishCardStyles.contentSection}>
        <View style={dishCardStyles.nameRow}>
          <Text
            style={[
              dishCardStyles.dishName,
              { color: theme.colors.text.primary },
            ]}
          >
            {truncateName(dish.name)}
          </Text>
        </View>

        <View style={dishCardStyles.calorieRow}>
          <View style={dishCardStyles.calorieChip}>
            <Ionicons
              name="flame"
              size={12}
              color={theme.colors.accent.primary}
            />
            <Text
              style={[
                dishCardStyles.calorieText,
                { color: theme.colors.accent.primary },
              ]}
            >
              {dish.calories} cal
            </Text>
          </View>

          <View style={dishCardStyles.costContainer}>
            <View style={dishCardStyles.outdoorCost}>
              <Ionicons name="storefront-outline" size={10} color="#FF6B6B" />
              <Text style={dishCardStyles.outdoorCostText}>
                ${dish.outdoorCost}
              </Text>
            </View>
            <View style={dishCardStyles.costSeparator} />
            <View style={dishCardStyles.homeCost}>
              <Ionicons name="home-outline" size={10} color="#4ECDC4" />
              <Text style={dishCardStyles.homeCostText}>${dish.homeCost}</Text>
            </View>
          </View>
        </View>

        <View style={dishCardStyles.metadataRow}>
          <View style={dishCardStyles.metadataContainer}>
            <View
              style={[
                dishCardStyles.cultureChip,
                { backgroundColor: getCountryBackgroundColor(dish.culture) },
              ]}
            >
              <Text style={dishCardStyles.cultureText}>{dish.culture}</Text>
            </View>
            <Text
              style={[
                dishCardStyles.metadataText,
                { color: theme.colors.text.secondary },
              ]}
            >
              • {dish.dishType} • {dish.prepTime}
            </Text>
          </View>
        </View>
      </View>

      <View style={dishCardStyles.actionsContainer}>
        <TouchableOpacity
          style={[
            dishCardStyles.actionButton,
            {
              backgroundColor: dish.isLiked
                ? "#FF6B6B" + "20"
                : theme.colors.background.primary + "90",
            },
          ]}
          onPress={() => onLike(dish)}
        >
          <Ionicons
            name={dish.isLiked ? "heart" : "heart-outline"}
            size={18}
            color={dish.isLiked ? "#FF6B6B" : theme.colors.text.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            dishCardStyles.actionButton,
            {
              backgroundColor: dish.isSaved
                ? theme.colors.accent.primary + "20"
                : theme.colors.background.primary + "90",
            },
          ]}
          onPress={() => onSave(dish)}
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
