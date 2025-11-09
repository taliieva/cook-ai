import { useTheme } from "@/hooks/useTheme";
import { DishData } from "@/types/dish";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { AILoadingOverlay } from "../AIOverlayLoading";
import { dishCardStyles } from "../styles/dishCardStyles";

type Props = {
  dish: DishData;
  progress: number;
  onLike: (dish: any) => void;
  onSave: (dish: any) => void;
  getCountryBackgroundColor: (culture: string) => string;
  truncateName: (name: string, maxLength?: number) => string;
};

export const DishLoadingCard: React.FC<Props> = ({
  dish,
  progress,
  onLike,
  onSave,
  getCountryBackgroundColor,
  truncateName,
}) => {
  const theme = useTheme();
  const isLoadingCard = progress < 100;
  const isPlaceholder = dish.isLoading; // Check if this is a streaming placeholder

  return (
    <View
      style={[
        dishCardStyles.dishCard,
        {
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View
        style={[
          dishCardStyles.dishContent,
          (isLoadingCard || isPlaceholder) && dishCardStyles.blurredContent,
        ]}
      >
        <View style={dishCardStyles.imageSection}>
          {dish.image ? (
            <Image
              source={{ uri: dish.image }}
              style={dishCardStyles.dishImage}
              resizeMode="cover"
            />
          ) : (
            // Placeholder skeleton for image
            <View
              style={[
                dishCardStyles.dishImage,
                {
                  backgroundColor: theme.colors.background.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <Ionicons
                name="image-outline"
                size={40}
                color={theme.colors.text.tertiary}
              />
            </View>
          )}
        </View>

        <View style={dishCardStyles.contentSection}>
          <View style={dishCardStyles.nameRow}>
            <Text
              style={[
                dishCardStyles.dishName,
                { color: isPlaceholder ? theme.colors.text.tertiary : theme.colors.text.primary },
              ]}
            >
              {dish.name === 'Loading...' ? 'Crafting recipe...' : truncateName(dish.name)}
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
                {dish.calories || '...'} cal
              </Text>
            </View>

            <View style={dishCardStyles.costContainer}>
              <View style={dishCardStyles.outdoorCost}>
                <Ionicons name="storefront-outline" size={10} color="#FF6B6B" />
                <Text style={dishCardStyles.outdoorCostText}>
                  ${dish.outdoorCost || '...'}
                </Text>
              </View>
              <View style={dishCardStyles.costSeparator} />
              <View style={dishCardStyles.homeCost}>
                <Ionicons name="home-outline" size={10} color="#4ECDC4" />
                <Text style={dishCardStyles.homeCostText}>
                  ${dish.homeCost || '...'}
                </Text>
              </View>
            </View>
          </View>

          <View style={dishCardStyles.metadataRow}>
            <View style={dishCardStyles.metadataContainer}>
              {dish.culture ? (
                <View
                  style={[
                    dishCardStyles.cultureChip,
                    { backgroundColor: getCountryBackgroundColor(dish.culture) },
                  ]}
                >
                  <Text style={dishCardStyles.cultureText}>{dish.culture}</Text>
                </View>
              ) : (
                <View
                  style={[
                    dishCardStyles.cultureChip,
                    { backgroundColor: theme.colors.background.primary },
                  ]}
                >
                  <Text style={[dishCardStyles.cultureText, { color: theme.colors.text.tertiary }]}>
                    ...
                  </Text>
                </View>
              )}
              <Text
                style={[
                  dishCardStyles.metadataText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                • {dish.dishType || '...'} • {dish.prepTime || '...'}
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
            disabled={isLoadingCard || isPlaceholder}
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
            disabled={isLoadingCard || isPlaceholder}
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

      {/* Show AI loading overlay for both AI generation and streaming placeholders */}
      <AILoadingOverlay 
        progress={isPlaceholder ? 50 : progress} 
        isVisible={isLoadingCard || isPlaceholder} 
      />
    </View>
  );
};
