import { ApiDish, DishData } from "@/types/dish";

export const countryColors: { [key: string]: string } = {
    Turkey: "#DC143C",
    Japan: "#BC002D",
    Italy: "#009246",
    France: "#0055A4",
    Mexico: "#006847",
    India: "#FF9933",
    USA: "#B22234",
    "United States": "#B22234",
    Thailand: "#ED1C24",
    Greece: "#0D5EAF",
    China: "#DE2910",
    Azerbaijan: "#3F9C35",
    "All Countries": "#95A5A6",
};

export const cultureToCountry: { [key: string]: string } = {
    Italian: "Italy",
    Japanese: "Japan",
    Mexican: "Mexico",
    Thai: "Thailand",
    Indian: "India",
    American: "USA",
    Greek: "Greece",
    Turkish: "Turkey",
    Chinese: "China",
    Azerbaijani: "Azerbaijan",
    French: "France",
};

export const getCountryBackgroundColor = (culture: string): string => {
    const country = cultureToCountry[culture] || culture;
    return countryColors[country] || "#95A5A6";
};

export const truncateName = (name: string, maxLength = 16): string => {
    return name?.length > maxLength
        ? name.substring(0, maxLength) + "..."
        : name;
};

export const extractPrepTime = (portionSize: string): string => {
    if (portionSize && typeof portionSize === "string") {
        if (portionSize.includes("min")) {
            return portionSize;
        }
        return "25 min";
    }
    return "25 min";
};

export const getDefaultImageForCuisine = (cuisine: string): string => {
    const defaultImages: { [key: string]: string } = {
        Italian:
            "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        Mexican:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        American:
            "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        Japanese:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        Chinese:
            "https://images.unsplash.com/photo-1559314809-0f31657def5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        Indian:
            "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        Thai: "https://images.unsplash.com/photo-1559314809-0f31657def5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        French:
            "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    };

    return (
        defaultImages[cuisine] ||
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    );
};

export const transformApiDishesToDishData = (
    apiDishes: ApiDish[]
): DishData[] => {
    return apiDishes.map((dish: ApiDish, index: number) => ({
        id: index + 1,
        name: dish.DishName || "Unknown Dish",
        culture: dish.CuisineType || "Unknown",
        country: dish.CuisineType || "Unknown",
        dishType: dish.DishType || "Unknown",
        prepTime: extractPrepTime(dish.EstimatedPortionSize) || "25 min",
        calories: dish.EstimatedCalories || 0,
        outdoorCost: dish.EstimatedOutsideCost || 0,
        homeCost: dish.EstimatedHomeCost || 0,
        moneySaved: dish.MoneySaved || 0,
        image: dish.PictureURL || getDefaultImageForCuisine(dish.CuisineType),
        isLiked: false,
        isSaved: false,
        shortDescription: dish.ShortDescription || "",
        steps: dish.Steps || [],
        videoURL: dish.VideoURL || "",
    }));
};