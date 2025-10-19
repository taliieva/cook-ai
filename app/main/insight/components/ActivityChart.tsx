import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { AnalyticsData } from "../hooks/useAnalytics";
import { activityChartStyles } from "../styles/activityChartStyles";

type Props = {
    data: AnalyticsData;
    period: "week" | "month" | "year";
};

export const ActivityChart: React.FC<Props> = ({ data, period }) => {
    const theme = useTheme();

    // ✅ Get the correct activity data based on period
    const getActivityData = () => {
        switch (period) {
            case "week":
                return data.weeklyActivity || [];
            case "month":
                return data.monthlyActivity || [];
            case "year":
                return data.yearlyActivity || [];
            default:
                return [];
        }
    };

    // ✅ Get chart title based on period
    const getChartTitle = () => {
        switch (period) {
            case "week":
                return "Weekly Activity";
            case "month":
                return "Monthly Activity";
            case "year":
                return "Yearly Activity";
            default:
                return "Activity";
        }
    };

    const activityData = getActivityData();

    // ✅ Log what we got
    console.log(`📊 ${period} activity data:`, activityData);

    if (!activityData || activityData.length === 0) {
        return (
            <View style={activityChartStyles.chartContainer}>
                <LinearGradient
                    colors={
                        theme.isDark
                            ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.03)"]
                            : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.6)"]
                    }
                    style={[
                        activityChartStyles.chartGradient,
                        {
                            borderColor: theme.isDark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.05)",
                        },
                    ]}
                >
                    <Text style={[activityChartStyles.chartTitle, { color: theme.colors.text.primary }]}>
                        {getChartTitle()}
                    </Text>
                    <View style={activityChartStyles.emptyState}>
                        <Text style={[activityChartStyles.emptyText, { color: theme.colors.text.secondary }]}>
                            No activity data available for this period
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    const maxValue = Math.max(...activityData.map((item) => item.value), 1);

    return (
        <View style={activityChartStyles.chartContainer}>
            <LinearGradient
                colors={
                    theme.isDark
                        ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.03)"]
                        : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.6)"]
                }
                style={[
                    activityChartStyles.chartGradient,
                    {
                        borderColor: theme.isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.05)",
                    },
                ]}
            >
                <Text style={[activityChartStyles.chartTitle, { color: theme.colors.text.primary }]}>
                    {getChartTitle()}
                </Text>
                <View style={activityChartStyles.chartContent}>
                    {activityData.map((item, index) => {
                        const barHeight = (item.value / maxValue) * 100;
                        return (
                            <View key={index} style={activityChartStyles.chartBar}>
                                <View style={activityChartStyles.barContainer}>
                                    <LinearGradient
                                        colors={["#007AFF", "#0051D5"]}
                                        style={[activityChartStyles.bar, { height: `${barHeight}%` }]}
                                    />
                                </View>
                                <Text
                                    style={[activityChartStyles.chartDay, { color: theme.colors.text.secondary }]}
                                >
                                    {item.dayName}
                                </Text>
                                <Text
                                    style={[activityChartStyles.chartValue, { color: theme.colors.text.primary }]}
                                >
                                    {item.value}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </LinearGradient>
        </View>
    );
};