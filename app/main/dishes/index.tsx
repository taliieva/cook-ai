import { useTheme } from "@/hooks/useTheme";
import { DishData } from "@/types/dish";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { DishCompletedCard } from "./components/DishCompletedCard";
import { DishLoadingCard } from "./components/DishLoadingCard";
import { useDishGeneration } from "./hooks/useDishGeneration";
import { dishesScreenStyles } from "./styles/dishesScreenStyles";
import {
    getCountryBackgroundColor,
    transformApiDishesToDishData,
    truncateName,
} from "./utils/dishHelpers";

export default function DishesScreen() {
    const router = useRouter();
    const theme = useTheme();
    const params = useLocalSearchParams();

    const [dishStates, setDishStates] = useState<DishData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dishes, setDishes] = useState<DishData[]>([]);
    const [headerInfo, setHeaderInfo] = useState({
        title: "",
        description: "",
        summary: "",
    });
    const [isExpanded, setIsExpanded] = useState(false);

    const { loadingProgress, simulateAIRecipeGeneration } = useDishGeneration();

    useEffect(() => {
        parseApiData();
    }, []);

    const parseApiData = () => {
        try {
            console.log("Received params:", params);

            const dishData = params.dishData
                ? JSON.parse(params.dishData as string)
                : null;
            const localizedSummary = params.localizedSummary
                ? JSON.parse(params.localizedSummary as string)
                : null;

            console.log("Parsed dish data:", dishData);
            console.log("Localized summary:", localizedSummary);

            if (
                dishData &&
                dishData.DishSuggestions &&
                Array.isArray(dishData.DishSuggestions)
            ) {
                const transformedDishes = transformApiDishesToDishData(
                    dishData.DishSuggestions
                );

                console.log("Transformed dishes:", transformedDishes);

                setDishes(transformedDishes);
                setHeaderInfo({
                    title: dishData.CatchyTitle || "Found Dishes",
                    description: dishData.IngredientDescription || "",
                    summary: localizedSummary?.Summary || "",
                });

                startAIGeneration(transformedDishes);
            } else {
                console.warn("No dish data found in params or invalid format");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error parsing API data:", error);
            setIsLoading(false);
        }
    };

    const startAIGeneration = async (dishesToGenerate: DishData[]) => {
        for (let i = 0; i < dishesToGenerate.length; i++) {
            const dish = dishesToGenerate[i];
            await simulateAIRecipeGeneration([dish]);

            setTimeout(() => {
                setDishStates((prev) => [...prev, dish]);
            }, 100);
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    const handleBack = () => {
        router.back();
    };

    const handleDishPress = (dish: DishData) => {
        const searchedIngredients = params.ingredients
            ? JSON.parse(params.ingredients as string)
            : [];

        router.push({
            pathname: `/main/dishes/${dish.id}` as any,
            params: {
                dishData: JSON.stringify(dish),
                searchedIngredients: JSON.stringify(searchedIngredients),
            },
        });
    };

    const handleLike = (dishId: number) => {
        setDishStates((prev) =>
            prev.map((dish) =>
                dish.id === dishId ? { ...dish, isLiked: !dish.isLiked } : dish
            )
        );
    };

    const handleSave = (dishId: number) => {
        setDishStates((prev) =>
            prev.map((dish) =>
                dish.id === dishId ? { ...dish, isSaved: !dish.isSaved } : dish
            )
        );
    };

    const renderSummaryText = (text: string) => {
        if (!text) return null;

        const words = text.split(" ");
        const maxWords = 20;
        const shouldTruncate = words.length > maxWords;

        const displayText = isExpanded ? text : words.slice(0, maxWords).join(" ");

        return (
            <View>
                <Text
                    style={[dishesScreenStyles.summaryText, { color: theme.colors.text.secondary }]}
                >
                    {displayText}
                    {!isExpanded && shouldTruncate && "..."}
                </Text>
                {shouldTruncate && (
                    <TouchableOpacity
                        onPress={() => setIsExpanded(!isExpanded)}
                        style={dishesScreenStyles.readMoreButton}
                    >
                        <Text
                            style={[
                                dishesScreenStyles.readMoreText,
                                { color: theme.colors.accent.primary },
                            ]}
                        >
                            {isExpanded ? "Read less" : "Read more"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView
            style={[
                dishesScreenStyles.container,
                { backgroundColor: theme.colors.background.primary },
            ]}
        >
            <StatusBar
                barStyle={theme.isDark ? "light-content" : "dark-content"}
                backgroundColor={theme.colors.background.primary}
            />

            {/* Header */}
            <View style={dishesScreenStyles.header}>
                <TouchableOpacity
                    style={[
                        dishesScreenStyles.backButton,
                        {
                            backgroundColor: theme.colors.background.secondary,
                            borderColor: theme.colors.border,
                        },
                    ]}
                    onPress={handleBack}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={theme.colors.text.primary}
                    />
                </TouchableOpacity>

                <View style={dishesScreenStyles.headerContent}>
                    <Text
                        style={[dishesScreenStyles.headerTitle, { color: theme.colors.text.primary }]}
                    >
                        {isLoading
                            ? "AI Discovering..."
                            : headerInfo.title || "Found Dishes"}
                    </Text>
                    {isLoading && (
                        <View style={dishesScreenStyles.aiHeaderIndicator}>
                            <Ionicons name="sparkles" size={16} color="#667eea" />
                            <Text style={[dishesScreenStyles.aiHeaderText, { color: "#667eea" }]}>
                                Powered by AI
                            </Text>
                        </View>
                    )}
                </View>

                <View style={dishesScreenStyles.headerSpacer} />
            </View>

            {/* Results Count */}
            <View style={dishesScreenStyles.resultsSection}>
                <Text
                    style={[dishesScreenStyles.resultsText, { color: theme.colors.text.secondary }]}
                >
                    {isLoading
                        ? `Generating ${dishes.length} personalized recipes...`
                        : `${dishStates.length} delicious dishes found`}
                </Text>
                {headerInfo.summary &&
                    !isLoading &&
                    renderSummaryText(headerInfo.summary)}
            </View>

            {/* Dishes List */}
            <ScrollView
                style={dishesScreenStyles.dishesContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={dishesScreenStyles.dishesContent}
            >
                {dishes.map((dish) => {
                    const isGenerated = dishStates.find((d) => d.id === dish.id);
                    const progress = loadingProgress[dish.id] || 0;

                    return isGenerated ? (
                        <DishCompletedCard
                            key={`completed-${dish.id}`}
                            dish={dish}
                            onPress={handleDishPress}
                            onLike={handleLike}
                            onSave={handleSave}
                            getCountryBackgroundColor={getCountryBackgroundColor}
                            truncateName={truncateName}
                        />
                    ) : (
                        <DishLoadingCard
                            key={`loading-${dish.id}`}
                            dish={dish}
                            progress={progress}
                            onLike={handleLike}
                            onSave={handleSave}
                            getCountryBackgroundColor={getCountryBackgroundColor}
                            truncateName={truncateName}
                        />
                    );
                })}

                {/* Empty state */}
                {!isLoading && dishes.length === 0 && (
                    <View style={dishesScreenStyles.emptyState}>
                        <Ionicons
                            name="restaurant-outline"
                            size={64}
                            color={theme.colors.text.secondary}
                        />
                        <Text
                            style={[dishesScreenStyles.emptyText, { color: theme.colors.text.secondary }]}
                        >
                            No dishes found. Try adjusting your ingredients or search
                            criteria.
                        </Text>
                    </View>
                )}

                <View style={dishesScreenStyles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
};