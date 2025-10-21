import { useTheme } from "@/hooks/useTheme";
import React, { useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityChart } from "./components/ActivityChart";
import { CuisineCard } from "./components/CuisineCard";
import { StatCard } from "./components/StatCard";
import { useAnalytics } from "./hooks/useAnalytics";
import { insightsStyles } from "./styles/insightsStyles";

// ... (keep all imports the same)

export default function InsightsScreen() {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");
  const { data, loading, error, refetch } = useAnalytics(selectedPeriod);

  const handlePeriodChange = (period: "week" | "month" | "year") => {
    setSelectedPeriod(period);
  };

  if (loading) {
    return (
      <View
        style={[
          insightsStyles.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <SafeAreaView style={insightsStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent.primary} />
          <Text
            style={[
              insightsStyles.loadingText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Loading insights...
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          insightsStyles.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <SafeAreaView style={insightsStyles.errorContainer}>
          <Text
            style={[
              insightsStyles.errorText,
              { color: theme.colors.text.primary },
            ]}
          >
            {error}
          </Text>
          <TouchableOpacity
            style={[
              insightsStyles.retryButton,
              { backgroundColor: theme.colors.accent.primary },
            ]}
            onPress={refetch}
          >
            <Text style={insightsStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  const userActions = [
    {
      action: "Recipe Views",
      count: data.stats.recipeViews.count,
      trend: data.stats.recipeViews.change,
      icon: "👀",
    },
    {
      action: "Recipes Cooked",
      count: data.stats.recipesCooked.count,
      trend: data.stats.recipesCooked.change,
      icon: "👨‍🍳",
    },
    {
      action: "Favorites Added",
      count: data.stats.favoritesAdded.count,
      trend: data.stats.favoritesAdded.change,
      icon: "❤️",
    },
    {
      action: "Money Saved",
      count: `$${data.stats.moneySaved.amount}`,
      trend: data.stats.moneySaved.change,
      icon: "💰",
    },
  ];

  return (
    <View
      style={[
        insightsStyles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background.primary}
      />

      <SafeAreaView style={insightsStyles.safeArea}>
        <ScrollView
          style={insightsStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={insightsStyles.scrollContent}
        >
          <View style={insightsStyles.header}>
            <Text
              style={[
                insightsStyles.headerTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Your Cooking Insights
            </Text>
            <Text
              style={[
                insightsStyles.headerSubtitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              Track your culinary journey
            </Text>
          </View>

          <View
            style={[
              insightsStyles.periodSelector,
              {
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
              },
            ]}
          >
            {(["week", "month", "year"] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  insightsStyles.periodButton,
                  selectedPeriod === period && {
                    backgroundColor: "#007AFF",
                  },
                ]}
                onPress={() => handlePeriodChange(period)}
              >
                <Text
                  style={[
                    insightsStyles.periodButtonText,
                    { color: theme.colors.text.secondary },
                    selectedPeriod === period && {
                      color: "#FFFFFF",
                    },
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={insightsStyles.section}>
            <Text
              style={[
                insightsStyles.sectionTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Your Activity
            </Text>
            <View style={insightsStyles.statsGrid}>
              {userActions.map((action, index) => (
                <StatCard
                  key={index}
                  title={action.action}
                  value={action.count}
                  trend={action.trend}
                  icon={action.icon}
                />
              ))}
            </View>
          </View>

          {/* ✅ Use new ActivityChart that handles all periods */}
          <View style={insightsStyles.section}>
            <ActivityChart data={data} period={selectedPeriod} />
          </View>

          {/* ✅ Add safety check for cuisines */}
          {data.popularCuisines && data.popularCuisines.length > 0 && (
            <View style={insightsStyles.section}>
              <Text
                style={[
                  insightsStyles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Your Favorite Cuisines
              </Text>
              <View style={insightsStyles.cuisineList}>
                {data.popularCuisines.map((cuisine, index) => (
                  <CuisineCard key={index} cuisine={cuisine} />
                ))}
              </View>
            </View>
          )}

          <View style={insightsStyles.section}>
            <Text
              style={[
                insightsStyles.sectionTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Achievements
            </Text>
            <Text
              style={[
                insightsStyles.comingSoonText,
                { color: theme.colors.text.secondary },
              ]}
            >
              🏆 Achievements coming soon!
            </Text>
          </View>

          <View style={insightsStyles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
