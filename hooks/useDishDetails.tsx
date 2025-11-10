/**
 * useDishDetails Hook
 * Business logic for dish detail screen
 * Handles data loading from navigation params or API (future-proof)
 */

import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Dish, Ingredient } from '@/types/dish';
import {
  convertSearchedToIngredients,
  generateIngredientsFromSteps,
} from '@/app/main/dishes/utils/ingredientHelpers';

export interface UseDishDetailsReturn {
  dish: Dish | null;
  ingredients: Ingredient[];
  searchId: string | null;
  loading: boolean;
  error: string | null;
}

export const useDishDetails = (): UseDishDetailsReturn => {
  const params = useLocalSearchParams();
  const [dish, setDish] = useState<Dish | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract searchId from params
  const searchId = params?.searchId as string ?? null;

  useEffect(() => {
    loadDishData();
  }, [params]);

  const loadDishData = () => {
    try {
      setLoading(true);
      console.log('Loading dish details from params:', params);

      // Current implementation: Load from navigation params
      if (params.dishData) {
        const parsedDish = JSON.parse(params.dishData as string);
        console.log('Parsed dish:', parsedDish);

        setDish(parsedDish);

        // Generate ingredients
        let generatedIngredients: Ingredient[] = [];
        if (params.searchedIngredients) {
          const searchedIngredients = JSON.parse(
            params.searchedIngredients as string
          );
          generatedIngredients = convertSearchedToIngredients(searchedIngredients);
        } else {
          generatedIngredients = generateIngredientsFromSteps(parsedDish.steps || []);
        }

        setIngredients(generatedIngredients);
        setError(null);
      } else {
        // Future: Could fetch from API by ID here
        // const dishId = params.id;
        // const fetchedDish = await fetchDishById(dishId);
        // setDish(fetchedDish);
        
        setError('No dish data available');
      }
    } catch (err) {
      console.error('Error loading dish details:', err);
      setError('Failed to load dish details');
      
      // Set fallback data
      setDish({
        id: 'fallback-1',
        name: 'Delicious Recipe',
        culture: 'International',
        country: 'International',
        dishType: 'Main Course',
        prepTime: '30 min',
        calories: 350,
        outdoorCost: 15,
        homeCost: 6,
        moneySaved: 9,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        isLiked: false,
        isSaved: false,
        shortDescription: 'Quick and easy recipe',
        steps: ['Prepare ingredients', 'Cook and serve'],
      });
      setIngredients([{ name: 'Fresh ingredients', amount: 'as needed', icon: '🥗' }]);
    } finally {
      setLoading(false);
    }
  };

  return {
    dish,
    ingredients,
    searchId,
    loading,
    error,
  };
};

