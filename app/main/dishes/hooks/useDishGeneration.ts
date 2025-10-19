import { DishData } from "@/types/dish";
import * as Haptics from "expo-haptics";
import { useState } from "react";

export const useDishGeneration = () => {
    const [loadingProgress, setLoadingProgress] = useState<{
        [key: number]: number;
    }>({});

    const simulateDishGeneration = (
        dishId: number,
        index: number
    ): Promise<void> => {
        return new Promise((resolve) => {
            let progress = 0;
            let lastPercentage = 0;

            const interval = setInterval(() => {
                progress += Math.random() * 8 + 2;

                const currentPercentage = Math.floor(progress);
                if (currentPercentage > lastPercentage && currentPercentage <= 100) {
                    lastPercentage = currentPercentage;

                    if (currentPercentage <= 25) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    } else if (currentPercentage <= 50) {
                        if (currentPercentage % 2 === 0) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        }
                    } else if (currentPercentage <= 75) {
                        if (currentPercentage % 3 === 0) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        }
                    } else if (currentPercentage <= 90) {
                        if (currentPercentage % 2 === 0) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        }
                    } else if (currentPercentage <= 99) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    }
                }

                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    resolve();
                }

                setLoadingProgress((prev) => ({
                    ...prev,
                    [dishId]: progress,
                }));
            }, 150 + Math.random() * 200);
        });
    };

    const simulateAIRecipeGeneration = async (dishesToGenerate: DishData[]) => {
        const initialProgress: { [key: number]: number } = {};
        dishesToGenerate.forEach((dish) => {
            initialProgress[dish.id] = 0;
        });
        setLoadingProgress(initialProgress);

        const generatedDishes: DishData[] = [];

        for (let i = 0; i < dishesToGenerate.length; i++) {
            const dish = dishesToGenerate[i];
            await simulateDishGeneration(dish.id, i);
            generatedDishes.push(dish);
        }

        return generatedDishes;
    };

    return {
        loadingProgress,
        simulateAIRecipeGeneration,
    };
};