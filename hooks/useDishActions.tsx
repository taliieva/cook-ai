/**
 * useDishActions Hook
 * Centralized business logic for dish actions (like/save)
 * Used across all screens that need like/save functionality
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { Dish } from '@/types/dish';
import { useLikeRecipe } from '@/app/main/dishes/hooks/useLikeRecipes';
import { useSaveRecipe } from '@/app/main/dishes/hooks/useSaveRecipe';

export interface UseDishActionsProps {
  searchId: string;
  onOptimisticUpdate?: (dishId: string, action: 'like' | 'save', value: boolean) => void;
  onUpgrade?: () => void;
}

export interface UseDishActionsReturn {
  handleLike: (dish: Dish) => Promise<void>;
  handleSave: (dish: Dish) => Promise<void>;
  isLiking: boolean;
  isSaving: boolean;
}

export const useDishActions = ({
  searchId,
  onOptimisticUpdate,
  onUpgrade,
}: UseDishActionsProps): UseDishActionsReturn => {
  const { likeRecipe } = useLikeRecipe();
  const { saveRecipe } = useSaveRecipe();
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLike = async (dish: Dish) => {
    if (!searchId) {
      console.error('No searchId available');
      Alert.alert('Error', 'Unable to like recipe. Please try again.');
      return;
    }

    setIsLiking(true);

    // Optimistic UI update
    onOptimisticUpdate?.(dish.id, 'like', !dish.isLiked);

    try {
      const res = await likeRecipe(searchId, dish.name);
      
      if (res.success) {
        console.log('✅ Recipe liked:', res.data?.message);
      } else {
        throw new Error(res.error || 'Failed to like recipe');
      }
    } catch (err: any) {
      console.error('Like error:', err);
      
      // Revert optimistic UI update
      onOptimisticUpdate?.(dish.id, 'like', dish.isLiked);

      const errorMessage = err.message || 'Failed to like recipe';
      
      // Check if it's a free plan limit error
      if (errorMessage.includes('Free users can only like') || errorMessage.includes('Upgrade to premium')) {
        Alert.alert(
          'Upgrade to Premium',
          "You've reached your free plan limit. Upgrade to Premium to like unlimited recipes!",
          [
            { text: 'Not Now', style: 'cancel' },
            {
              text: 'Upgrade',
              onPress: () => {
                console.log('🔓 Opening RevenueCat paywall from like limit');
                onUpgrade?.();
              },
              style: 'default',
            },
          ]
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async (dish: Dish) => {
    if (!searchId) {
      console.error('No searchId available');
      Alert.alert('Error', 'Unable to save recipe. Please try again.');
      return;
    }

    setIsSaving(true);

    // Optimistic UI update
    onOptimisticUpdate?.(dish.id, 'save', !dish.isSaved);

    try {
      const res = await saveRecipe(searchId, dish.name);
      
      if (!res.success) throw new Error(res.error);
      
      console.log('✅ Recipe saved successfully');
    } catch (err: any) {
      console.error('Save error:', err);
      
      // Revert optimistic UI update
      onOptimisticUpdate?.(dish.id, 'save', dish.isSaved);

      const errorMessage = err.message || 'Failed to save recipe';
      
      // Check if it's a free plan limit error
      if (errorMessage.includes('Free users can only save') || errorMessage.includes('Upgrade to premium')) {
        Alert.alert(
          'Upgrade to Premium',
          "You've reached your free plan limit. Upgrade to Premium to save unlimited recipes!",
          [
            { text: 'Not Now', style: 'cancel' },
            {
              text: 'Upgrade',
              onPress: () => {
                console.log('🔓 Opening RevenueCat paywall from save limit');
                onUpgrade?.();
              },
              style: 'default',
            },
          ]
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleLike,
    handleSave,
    isLiking,
    isSaving,
  };
};

