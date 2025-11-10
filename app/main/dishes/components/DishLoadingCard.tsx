import { useTheme } from "@/hooks/useTheme";
import { DishData } from "@/types/dish";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

// Shimmer Component for Skeleton Loading
const Shimmer: React.FC<{ width?: string | number; height?: number; borderRadius?: number }> = ({ 
  width = "100%", 
  height = 20, 
  borderRadius = 8 
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View 
      style={{ 
        width, 
        height, 
        borderRadius,
        backgroundColor: theme.colors.background.primary,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            theme.colors.background.primary,
            theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            theme.colors.background.primary,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 300, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
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
  const showSkeleton = isPlaceholder || isLoadingCard;

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
            {showSkeleton && !dish.name ? (
              <Shimmer width="80%" height={24} borderRadius={6} />
            ) : (
              <Text
                style={[
                  dishCardStyles.dishName,
                  { color: showSkeleton ? theme.colors.text.tertiary : theme.colors.text.primary },
                ]}
              >
                {dish.name === 'Loading...' ? 'Crafting recipe...' : truncateName(dish.name)}
              </Text>
            )}
          </View>

          <View style={dishCardStyles.calorieRow}>
            {showSkeleton && !dish.calories ? (
              <>
                <Shimmer width={80} height={24} borderRadius={12} />
                <View style={{ width: 8 }} />
                <Shimmer width={100} height={24} borderRadius={12} />
              </>
            ) : (
              <>
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
              </>
            )}
          </View>

          <View style={dishCardStyles.metadataRow}>
            <View style={dishCardStyles.metadataContainer}>
              {showSkeleton && !dish.culture ? (
                <>
                  <Shimmer width={60} height={22} borderRadius={11} />
                  <View style={{ width: 8 }} />
                  <Shimmer width="60%" height={16} borderRadius={4} />
                </>
              ) : (
                <>
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
                </>
              )}
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

      {/* 
        Show AI loading overlay ONLY for AI generation (not for streaming placeholders)
        Streaming placeholders look better with just shimmer skeleton
      */}
      <AILoadingOverlay 
        progress={progress} 
        isVisible={isLoadingCard && !isPlaceholder} 
      />
    </View>
  );
};
