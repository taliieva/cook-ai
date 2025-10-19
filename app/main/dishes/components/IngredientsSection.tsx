import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Text, View } from "react-native";
import { dishDetailStyles } from "../styles/dishDetailStyles";
import { Ingredient } from "../utils/ingredientHelpers";

type Props = {
    ingredients: Ingredient[];
};

export const IngredientsSection: React.FC<Props> = ({ ingredients }) => {
    const theme = useTheme();

    return (
        <View style={dishDetailStyles.section}>
            <View style={dishDetailStyles.sectionHeader}>
                <Text style={dishDetailStyles.sectionTitle}>Ingredients</Text>
                <Text style={dishDetailStyles.ingredientCount}>
                    ({ingredients.length} items)
                </Text>
            </View>
            <View style={dishDetailStyles.ingredientsList}>
                {ingredients.map((ingredient, index) => (
                    <View
                        key={index}
                        style={[
                            dishDetailStyles.ingredientItem,
                            {
                                backgroundColor: theme.colors.background.secondary + "80",
                                borderColor: theme.colors.border + "40",
                            },
                        ]}
                    >
                        <Text style={dishDetailStyles.ingredientIcon}>
                            {ingredient.icon}
                        </Text>
                        <View style={dishDetailStyles.ingredientInfo}>
                            <Text
                                style={[
                                    dishDetailStyles.ingredientName,
                                    { color: theme.colors.text.primary },
                                ]}
                            >
                                {ingredient.name}
                            </Text>
                            <Text
                                style={[
                                    dishDetailStyles.ingredientAmount,
                                    { color: theme.colors.text.secondary },
                                ]}
                            >
                                {ingredient.amount}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};