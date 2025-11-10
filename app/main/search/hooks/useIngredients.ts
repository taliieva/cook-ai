import { useState } from "react";

export const useIngredients = (initialIngredients: string[] = []) => {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [searchText, setSearchText] = useState("");

  const handleAddIngredient = () => {
    if (searchText.trim() && !ingredients.includes(searchText.trim())) {
      setIngredients([...ingredients, searchText.trim()]);
      setSearchText("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(
      ingredients.filter((ingredient) => ingredient !== ingredientToRemove)
    );
  };

  const clearIngredients = () => {
    setIngredients([]);
  };

  return {
    ingredients,
    setIngredients,
    searchText,
    setSearchText,
    handleAddIngredient,
    handleRemoveIngredient,
    clearIngredients,
  };
};

