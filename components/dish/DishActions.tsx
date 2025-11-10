/**
 * DishActions Component
 * Reusable Like & Save buttons for dishes
 * Pure presentational component - receives handlers as props
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface DishActionsProps {
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  isLiking?: boolean;
  isSaving?: boolean;
}

export const DishActions: React.FC<DishActionsProps> = ({
  isLiked,
  isSaved,
  onLike,
  onSave,
  disabled = false,
  size = 'medium',
  isLiking = false,
  isSaving = false,
}) => {
  const theme = useTheme();

  const sizeMap = {
    small: { button: 32, icon: 16 },
    medium: { button: 40, icon: 18 },
    large: { button: 48, icon: 22 },
  };

  const dimensions = sizeMap[size];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            width: dimensions.button,
            height: dimensions.button,
            backgroundColor: isLiked
              ? '#FF6B6B20'
              : `${theme.colors.background.primary}90`,
          },
        ]}
        onPress={onLike}
        disabled={disabled || isLiking}
        activeOpacity={0.7}
      >
        {isLiking ? (
          <ActivityIndicator size="small" color="#FF6B6B" />
        ) : (
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={dimensions.icon}
            color={isLiked ? '#FF6B6B' : theme.colors.text.secondary}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            width: dimensions.button,
            height: dimensions.button,
            backgroundColor: isSaved
              ? `${theme.colors.accent.primary}20`
              : `${theme.colors.background.primary}90`,
          },
        ]}
        onPress={onSave}
        disabled={disabled || isSaving}
        activeOpacity={0.7}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={theme.colors.accent.primary} />
        ) : (
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={dimensions.icon}
            color={isSaved ? theme.colors.accent.primary : theme.colors.text.secondary}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

