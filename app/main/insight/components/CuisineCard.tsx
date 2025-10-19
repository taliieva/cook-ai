import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { PopularCuisine } from "../hooks/useAnalytics";
import { cuisineCardStyles } from "../styles/cuisineCardStyles";

type Props = {
    cuisine: PopularCuisine;
};

export const CuisineCard: React.FC<Props> = ({ cuisine }) => {
    const theme = useTheme();
    const barWidth = (cuisine.percentage / 100) * 120;

    return (
        <View style={cuisineCardStyles.cuisineCard}>
            <LinearGradient
                colors={
                    theme.isDark
                        ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.03)"]
                        : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.6)"]
                }
                style={[
                    cuisineCardStyles.cuisineCardGradient,
                    {
                        borderColor: theme.isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.05)",
                    },
                ]}
            >
                <View style={cuisineCardStyles.cuisineHeader}>
                    <View style={cuisineCardStyles.cuisineInfo}>
                        <Text style={[cuisineCardStyles.cuisineRank, { color: "#007AFF" }]}>
                            #{cuisine.rank}
                        </Text>
                        <Text style={cuisineCardStyles.cuisineIcon}>{cuisine.emoji}</Text>
                        <View style={cuisineCardStyles.cuisineTextContainer}>
                            <Text
                                style={[cuisineCardStyles.cuisineName, { color: theme.colors.text.primary }]}
                            >
                                {cuisine.name}
                            </Text>
                            <Text
                                style={[
                                    cuisineCardStyles.cuisineSearches,
                                    { color: theme.colors.text.secondary },
                                ]}
                            >
                                {cuisine.searches} searches
                            </Text>
                        </View>
                    </View>
                    <View style={cuisineCardStyles.cuisineTrend}>
                        <Text
                            style={[
                                cuisineCardStyles.cuisinePercentage,
                                { color: theme.colors.text.primary },
                            ]}
                        >
                            {cuisine.percentage}%
                        </Text>
                        <Text
                            style={[
                                cuisineCardStyles.cuisineTrendText,
                                cuisine.change > 0 ? cuisineCardStyles.trendPositive : cuisineCardStyles.trendNegative,
                            ]}
                        >
                            {cuisine.change > 0 ? `+${cuisine.change}%` : `${cuisine.change}%`}
                        </Text>
                    </View>
                </View>
                <View style={cuisineCardStyles.progressBarContainer}>
                    <View
                        style={[
                            cuisineCardStyles.progressBarBackground,
                            {
                                backgroundColor: theme.isDark
                                    ? "rgba(255,255,255,0.1)"
                                    : "rgba(0,0,0,0.1)",
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={["#007AFF", "#0051D5"]}
                            style={[cuisineCardStyles.progressBar, { width: barWidth }]}
                        />
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};