/**
 * DishCard Component
 * Unified, reusable dish card for both list and detail views
 * Variant-based rendering: 'compact' for lists, 'detailed' for detail screen
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Dish } from '@/types/dish';
import { DishActions } from './DishActions';

const { width } = Dimensions.get('window');

interface DishCardProps {
  dish: Dish;
  variant?: 'compact' | 'detailed';
  onPress?: (dish: Dish) => void;
  onLike: () => void;
  onSave: () => void;
  isLiking?: boolean;
  isSaving?: boolean;
  disabled?: boolean;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  variant = 'compact',
  onPress,
  onLike,
  onSave,
  isLiking = false,
  isSaving = false,
  disabled = false,
}) => {
  const theme = useTheme();

  const getCountryBackgroundColor = (culture: string): string => {
    const colors: { [key: string]: string } = {
      Italian: '#FF6B6B',
      Chinese: '#FF8C42',
      Mexican: '#FFA07A',
      Japanese: '#FFD93D',
      French: '#FF6BB5',
      Indian: '#FF7F50',
      American: '#4ECDC4',
      Thai: '#95E1D3',
      Azerbaijani: '#D4A5A5',
      Turkish: '#C9A0DC',
    };
    return colors[culture] || '#A8E6CF';
  };

  if (variant === 'detailed') {
    return (
      <View
        style={[
          styles.detailedContainer,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* Hero Image */}
        <View style={styles.detailedImageContainer}>
          <Image
            source={{ uri: dish.image }}
            style={styles.detailedImage}
            resizeMode="cover"
          />
          <View style={styles.detailedOverlay}>
            <DishActions
              isLiked={dish.isLiked}
              isSaved={dish.isSaved}
              onLike={onLike}
              onSave={onSave}
              isLiking={isLiking}
              isSaving={isSaving}
              disabled={disabled}
              size="large"
            />
          </View>
        </View>

        {/* Content */}
        <View style={styles.detailedContent}>
          {/* Culture Badge */}
          <View
            style={[
              styles.cultureBadge,
              { backgroundColor: getCountryBackgroundColor(dish.culture) },
            ]}
          >
            <Text style={styles.cultureBadgeText}>{dish.culture}</Text>
          </View>

          {/* Dish Name */}
          <Text
            style={[
              styles.detailedName,
              { color: theme.colors.text.primary },
            ]}
          >
            {dish.name}
          </Text>

          {/* Metadata Row */}
          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Ionicons name="flame" size={16} color={theme.colors.accent.primary} />
              <Text style={[styles.metadataText, { color: theme.colors.text.secondary }]}>
                {dish.calories} cal
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={[styles.metadataText, { color: theme.colors.text.secondary }]}>
                {dish.prepTime}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Ionicons name="restaurant-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={[styles.metadataText, { color: theme.colors.text.secondary }]}>
                {dish.dishType}
              </Text>
            </View>
          </View>

          {/* Cost Comparison */}
          <View style={styles.costRow}>
            <View style={styles.costItem}>
              <Ionicons name="storefront-outline" size={14} color="#FF6B6B" />
              <Text style={styles.costLabel}>Out: </Text>
              <Text style={[styles.costValue, { color: '#FF6B6B' }]}>
                ${dish.outdoorCost}
              </Text>
            </View>
            <View style={styles.costSeparator} />
            <View style={styles.costItem}>
              <Ionicons name="home-outline" size={14} color="#4ECDC4" />
              <Text style={styles.costLabel}>Home: </Text>
              <Text style={[styles.costValue, { color: '#4ECDC4' }]}>
                ${dish.homeCost}
              </Text>
            </View>
            <View style={styles.costSeparator} />
            <View style={styles.costItem}>
              <Ionicons name="cash-outline" size={14} color="#32CD32" />
              <Text style={styles.costLabel}>Save: </Text>
              <Text style={[styles.costValue, { color: '#32CD32' }]}>
                ${dish.moneySaved}
              </Text>
            </View>
          </View>

          {/* Description */}
          {dish.shortDescription && (
            <Text
              style={[
                styles.description,
                { color: theme.colors.text.secondary },
              ]}
            >
              {dish.shortDescription}
            </Text>
          )}
        </View>
      </View>
    );
  }

  // Compact variant (for lists)
  const handlePress = () => {
    if (onPress && !disabled) {
      onPress(dish);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.compactContainer,
        {
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={handlePress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      <View style={styles.compactContent}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: dish.image }}
            style={styles.compactImage}
            resizeMode="cover"
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text
            style={[
              styles.compactName,
              { color: theme.colors.text.primary },
            ]}
            numberOfLines={2}
          >
            {dish.name}
          </Text>

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
                <Ionicons name="storefront-outline" size={10} color="#FF6B6B" />
                <Text style={styles.outdoorCostText}>${dish.outdoorCost}</Text>
              </View>
              <View style={styles.costSeparator} />
              <View style={styles.homeCost}>
                <Ionicons name="home-outline" size={10} color="#4ECDC4" />
                <Text style={styles.homeCostText}>${dish.homeCost}</Text>
              </View>
            </View>
          </View>

          <View style={styles.compactMetadataRow}>
            <View
              style={[
                styles.compactCultureChip,
                { backgroundColor: getCountryBackgroundColor(dish.culture) },
              ]}
            >
              <Text style={styles.compactCultureText}>{dish.culture}</Text>
            </View>
            <Text
              style={[
                styles.compactMetadataText,
                { color: theme.colors.text.secondary },
              ]}
              numberOfLines={1}
            >
              • {dish.dishType} • {dish.prepTime}
            </Text>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsContainer}>
          <DishActions
            isLiked={dish.isLiked}
            isSaved={dish.isSaved}
            onLike={onLike}
            onSave={onSave}
            isLiking={isLiking}
            isSaving={isSaving}
            disabled={disabled}
            size="medium"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Compact Variant Styles
  compactContainer: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  compactContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageSection: {
    marginRight: 12,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
  },
  compactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  calorieChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginRight: 8,
  },
  calorieText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outdoorCost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outdoorCostText: {
    fontSize: 10,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 2,
  },
  homeCost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeCostText: {
    fontSize: 10,
    color: '#4ECDC4',
    fontWeight: '600',
    marginLeft: 2,
  },
  costSeparator: {
    width: 1,
    height: 12,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },
  compactMetadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactCultureChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  compactCultureText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  compactMetadataText: {
    fontSize: 12,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 8,
  },

  // Detailed Variant Styles
  detailedContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  detailedImageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  detailedImage: {
    width: '100%',
    height: '100%',
  },
  detailedOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  detailedContent: {
    padding: 16,
  },
  cultureBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  cultureBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailedName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 14,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 12,
  },
  costItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  costLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
});

