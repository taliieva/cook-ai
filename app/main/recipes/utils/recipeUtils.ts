import { countryColors, difficultyColors, DifficultyLevel } from "../constants/recipeConstants";

// Get country background color
export const getCountryBackgroundColor = (culture: string): string => {
  return countryColors[culture] || "#95A5A6";
};

// Get difficulty color
export const getDifficultyColor = (difficulty: string): string => {
  return difficultyColors[difficulty as DifficultyLevel] || "#9E9E9E";
};

// Truncate recipe name
export const truncateName = (name: string, maxLength: number = 16): string => {
  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
};

// Format saved/liked date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  return date.toLocaleDateString();
};

