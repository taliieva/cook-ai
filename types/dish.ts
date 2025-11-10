/**
 * Shared Dish Types
 * Centralized type definitions for dish-related data across the app
 */

export interface Dish {
  id: string;
  name: string;
  culture: string;
  country: string;
  dishType: string;
  prepTime: string;
  calories: number;
  outdoorCost: number;
  homeCost: number;
  moneySaved: number;
  image: string;
  isLiked: boolean;
  isSaved: boolean;
  shortDescription: string;
  steps: string[];
  videoURL?: string;
  isLoading?: boolean;
}

export interface DishListItem extends Dish {
  // Minimal data for list view
}

export interface DishDetail extends Dish {
  // Full data for detail view (same as Dish for now)
}

export interface DishActions {
  onLike: (dish: Dish) => Promise<void>;
  onSave: (dish: Dish) => Promise<void>;
  isLiking: boolean;
  isSaving: boolean;
}

export interface DishCardVariant {
  variant: 'compact' | 'detailed';
}

export interface Ingredient {
  name: string;
  amount: string;
  icon: string;
}
