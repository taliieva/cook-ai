import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { statCardStyles } from "../styles/statCardStyles";

type Props = {
    title: string;
    value: number | string;
    trend?: number;
    icon: string;
};

export const StatCard: React.FC<Props> = ({ title, value, trend, icon }) => {
    const theme = useTheme();

    const formatTrend = (trendValue: number) => {
        if (trendValue > 0) return `+${trendValue}%`;
        if (trendValue < 0) return `${trendValue}%`;
        return "0%";
    };

    return (
        <View style={statCardStyles.statCard}>
            <LinearGradient
                colors={
                    theme.isDark
                        ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.03)"]
                        : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.6)"]
                }
                style={[
                    statCardStyles.statCardGradient,
                    {
                        borderColor: theme.isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.05)",
                    },
                ]}
            >
                <View style={statCardStyles.statHeader}>
                    <Text style={statCardStyles.statIcon}>{icon}</Text>
                    {trend !== undefined && trend !== 0 && (
                        <View
                            style={[
                                statCardStyles.trendContainer,
                                {
                                    backgroundColor: theme.isDark
                                        ? "rgba(255,255,255,0.1)"
                                        : "rgba(0,0,0,0.05)",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    statCardStyles.trendText,
                                    trend > 0 ? statCardStyles.trendPositive : statCardStyles.trendNegative,
                                ]}
                            >
                                {formatTrend(trend)}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={[statCardStyles.statValue, { color: theme.colors.text.primary }]}>
                    {typeof value === "number" ? value.toLocaleString() : value}
                </Text>
                <Text style={[statCardStyles.statTitle, { color: theme.colors.text.secondary }]}>
                    {title}
                </Text>
            </LinearGradient>
        </View>
    );
};