import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    convertSearchedToIngredients,
    generateIngredientsFromSteps,
    Ingredient,
} from "../utils/ingredientHelpers";

export interface DishDetail {
    id: number;
    name: string;
    culture: string;
    image: string;
    calories: number;
    outdoorCost: number;
    homeCost: number;
    moneySaved: number;
    shortDescription: string;
    steps: string[];
    dishType: string;
    videoURL?: string;
}

export const useDishData = () => {
    const params = useLocalSearchParams();
    const [dishData, setDishData] = useState<DishDetail | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        parseDishData();
    }, []);

    const parseDishData = () => {
        try {
            console.log("Received dish params:", params);

            if (params.dishData) {
                const parsedDish = JSON.parse(params.dishData as string);
                console.log("Parsed dish:", parsedDish);

                setDishData(parsedDish);

                let generatedIngredients: Ingredient[] = [];
                if (params.searchedIngredients) {
                    const searchedIngredients = JSON.parse(
                        params.searchedIngredients as string
                    );
                    generatedIngredients =
                        convertSearchedToIngredients(searchedIngredients);
                } else {
                    generatedIngredients = generateIngredientsFromSteps(
                        parsedDish.steps || []
                    );
                }

                setIngredients(generatedIngredients);
            }
        } catch (error) {
            console.error("Error parsing dish data:", error);
            setFallbackData();
        }
    };

    const setFallbackData = () => {
        setDishData({
            id: 1,
            name: "Delicious Recipe",
            culture: "International",
            image:
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            calories: 350,
            outdoorCost: 15,
            homeCost: 6,
            moneySaved: 9,
            shortDescription: "Quick and easy recipe",
            steps: ["Prepare ingredients", "Cook and serve"],
            dishType: "Main Course",
        });
        setIngredients([
            { name: "Fresh ingredients", amount: "as needed", icon: "🥗" },
        ]);
    };

    return { dishData, ingredients };
};