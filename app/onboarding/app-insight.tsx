import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Mock data for insights
const mockInsightsData = {
  userActions: [
    { action: "AI Searches", count: 247, trend: "+24%", icon: "✨" },
    { action: "Recipes Cooked", count: 89, trend: "+18%", icon: "👨‍🍳" },
    { action: "Favorites Added", count: 34, trend: "+31%", icon: "❤️" },
    { action: "Cooking Streak", count: 12, trend: "+12%", icon: "🔥" },
  ],
  popularCuisines: [
    {
      name: "Italian",
      searches: 45,
      percentage: 35,
      trend: "+12%",
      icon: "🇮🇹",
    },
    { 
      name: "Mexican", 
      searches: 32, 
      percentage: 25, 
      trend: "+8%", 
      icon: "🇲🇽" 
    },
    {
      name: "Japanese",
      searches: 28,
      percentage: 22,
      trend: "+15%",
      icon: "🇯🇵",
    },
    {
      name: "Indian",
      searches: 18,
      percentage: 14,
      trend: "+5%",
      icon: "🇮🇳",
    },
    {
      name: "American",
      searches: 12,
      percentage: 9,
      trend: "+3%",
      icon: "🇺🇸",
    },
  ],
  weeklyStats: [
    { day: "Mon", value: 8 },
    { day: "Tue", value: 12 },
    { day: "Wed", value: 6 },
    { day: "Thu", value: 15 },
    { day: "Fri", value: 10 },
    { day: "Sat", value: 18 },
    { day: "Sun", value: 14 },
  ],
  achievements: [
    { 
      id: 1, 
      title: "Recipe Explorer", 
      description: "Tried 50+ recipes", 
      icon: "🏆", 
      unlocked: true,
    },
    { 
      id: 2, 
      title: "Cuisine Master", 
      description: "5+ cuisines explored", 
      icon: "🥇", 
      unlocked: true,
    },
    { 
      id: 3, 
      title: "Cooking Streak", 
      description: "10 days streak", 
      icon: "🔥", 
      unlocked: true,
    },
    { 
      id: 4, 
      title: "AI Chef Pro", 
      description: "100+ AI searches", 
      icon: "⚡", 
      unlocked: false,
    },
  ],
  recentActivity: [
    {
      id: 1,
      type: "search",
      title: "Searched for pasta recipes",
      cuisine: "Italian",
      time: "2 hours ago",
      ingredients: ["pasta", "tomatoes", "basil"]
    },
    {
      id: 2,
      type: "favorite",
      title: "Added Chicken Tacos to favorites",
      cuisine: "Mexican",
      time: "1 day ago",
      ingredients: ["chicken", "tortillas", "avocado"]
    },
    {
      id: 3,
      type: "cooked",
      title: "Marked Sushi Rolls as cooked",
      cuisine: "Japanese",
      time: "2 days ago",
      ingredients: ["rice", "nori", "salmon"]
    },
  ]
};

export default function InsightsComponent({ userPlan, onUpgrade, onSearchAgain }) {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [data] = useState(mockInsightsData);

  const StatCard = ({ title, value, trend, icon }) => (
    <View style={styles.statCard}>
      <LinearGradient
        colors={theme.isDark 
          ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.03)"]
          : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.6)"]
        }
        style={[
          styles.statCardGradient,
          { 
            borderColor: theme.isDark 
              ? "rgba(255,255,255,0.1)" 
              : "rgba(0,0,0,0.05)",
          }
        ]}
      >
        <View style={styles.statHeader}>
          <Text style={styles.statIcon}>{icon}</Text>
          {trend && (
            <View style={[
              styles.trendContainer,
              { backgroundColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }
            ]}>
              <Text
                style={[
                  styles.trendText,
                  trend.startsWith("+") ? styles.trendPositive : styles.trendNegative,
                ]}
              >
                {trend}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        <Text style={[styles.statTitle, { color: theme.colors.text.secondary }]}>
          {title}
        </Text>
      </LinearGradient>
    </View>
  );

  const CuisineCard = ({ cuisine, rank }) => {
    const barWidth = (cuisine.percentage / 100) * 120;
    return (
      <View style={styles.cuisineCard}>
        <LinearGradient
          colors={theme.isDark 
            ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.03)"]
            : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.6)"]
          }
          style={[
            styles.cuisineCardGradient,
            { 
              borderColor: theme.isDark 
                ? "rgba(255,255,255,0.1)" 
                : "rgba(0,0,0,0.05)",
            }
          ]}
        >
          <View style={styles.cuisineHeader}>
            <View style={styles.cuisineInfo}>
              <Text style={[styles.cuisineRank, { color: "#007AFF" }]}>#{rank}</Text>
              <Text style={styles.cuisineIcon}>{cuisine.icon}</Text>
              <View style={styles.cuisineTextContainer}>
                <Text style={[styles.cuisineName, { color: theme.colors.text.primary }]}>
                  {cuisine.name}
                </Text>
                <Text style={[styles.cuisineSearches, { color: theme.colors.text.secondary }]}>
                  {cuisine.searches} recipes
                </Text>
              </View>
            </View>
            <View style={styles.cuisineTrend}>
              <Text style={[styles.cuisinePercentage, { color: theme.colors.text.primary }]}>
                {cuisine.percentage}%
              </Text>
              <Text
                style={[
                  styles.cuisineTrendText,
                  cuisine.trend.startsWith("+") ? styles.trendPositive : styles.trendNegative,
                ]}
              >
                {cuisine.trend}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[
              styles.progressBarBackground,
              { backgroundColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }
            ]}>
              <LinearGradient
                colors={["#007AFF", "#0051D5"]}
                style={[styles.progressBar, { width: barWidth }]}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const WeeklyChart = ({ data }) => {
    const maxValue = Math.max(...data.map((item) => item.value));
    return (
      <View style={styles.chartContainer}>
        <LinearGradient
          colors={theme.isDark 
            ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.03)"]
            : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.6)"]
          }
          style={[
            styles.chartGradient,
            { 
              borderColor: theme.isDark 
                ? "rgba(255,255,255,0.1)" 
                : "rgba(0,0,0,0.05)",
            }
          ]}
        >
          <Text style={[styles.chartTitle, { color: theme.colors.text.primary }]}>
            Weekly Activity
          </Text>
          <View style={styles.chartContent}>
            {data.map((item, index) => {
              const barHeight = (item.value / maxValue) * 100;
              return (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <LinearGradient
                      colors={["#007AFF", "#0051D5"]}
                      style={[styles.bar, { height: `${barHeight}%` }]}
                    />
                  </View>
                  <Text style={[styles.chartDay, { color: theme.colors.text.secondary }]}>
                    {item.day}
                  </Text>
                  <Text style={[styles.chartValue, { color: theme.colors.text.primary }]}>
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

  const AchievementCard = ({ achievement }) => (
    <View style={[
      styles.achievementCard,
      { opacity: achievement.unlocked ? 1 : 0.6 }
    ]}>
      <LinearGradient
        colors={achievement.unlocked 
          ? theme.isDark 
            ? ["rgba(255, 255, 255, 0.12)", "rgba(255, 255, 255, 0.06)"]
            : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.8)"]
          : theme.isDark 
            ? ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]
            : ["rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.4)"]
        }
        style={[
          styles.achievementGradient,
          { 
            borderColor: theme.isDark 
              ? "rgba(255,255,255,0.1)" 
              : "rgba(0,0,0,0.05)",
          }
        ]}
      >
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <Text style={[styles.achievementTitle, { color: theme.colors.text.primary }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: theme.colors.text.secondary }]}>
          {achievement.description}
        </Text>
        {achievement.unlocked && (
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedText}>Unlocked</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  const RecentActivityCard = ({ activity }) => (
    <TouchableOpacity 
      style={styles.activityCard}
      onPress={() => onSearchAgain && onSearchAgain(activity.ingredients, activity.cuisine)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={theme.isDark 
          ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.03)"]
          : ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.6)"]
        }
        style={[
          styles.activityGradient,
          { 
            borderColor: theme.isDark 
              ? "rgba(255,255,255,0.1)" 
              : "rgba(0,0,0,0.05)",
          }
        ]}
      >
        <View style={styles.activityHeader}>
          <View style={[
            styles.activityTypeIcon,
            { 
              backgroundColor: activity.type === 'search' ? '#007AFF' 
                : activity.type === 'favorite' ? '#FF3B30' 
                : '#34C759'
            }
          ]}>
            <Ionicons 
              name={
                activity.type === 'search' ? 'search' 
                : activity.type === 'favorite' ? 'heart' 
                : 'checkmark'
              } 
              size={16} 
              color="white" 
            />
          </View>
          <Text style={[styles.activityTime, { color: theme.colors.text.secondary }]}>
            {activity.time}
          </Text>
        </View>
        <Text style={[styles.activityTitle, { color: theme.colors.text.primary }]}>
          {activity.title}
        </Text>
        <Text style={[styles.activityCuisine, { color: theme.colors.text.secondary }]}>
          {activity.cuisine} cuisine
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background.primary}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
              Your Cooking Insights
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
              Track your culinary journey and achievements
            </Text>
          </View>

          {/* Period Selector */}
          <View style={[
            styles.periodSelector,
            { backgroundColor: theme.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }
          ]}>
            {["week", "month", "year"].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && {
                    backgroundColor: "#007AFF"
                  }
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    { color: theme.colors.text.secondary },
                    selectedPeriod === period && {
                      color: "#FFFFFF"
                    }
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Your Activity Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Your Activity
            </Text>
            <View style={styles.statsGrid}>
              {data.userActions.map((action, index) => (
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

          {/* Weekly Chart */}
          <View style={styles.section}>
            <WeeklyChart data={data.weeklyStats} />
          </View>

          {/* Popular Cuisines */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Your Favorite Cuisines
            </Text>
            <View style={styles.cuisineList}>
              {data.popularCuisines.map((cuisine, index) => (
                <CuisineCard key={index} cuisine={cuisine} rank={index + 1} />
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Achievements
            </Text>
            <View style={styles.achievementsGrid}>
              {data.achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Recent Activity
            </Text>
            <View style={styles.activityList}>
              {data.recentActivity.map((activity) => (
                <RecentActivityCard 
                  key={activity.id} 
                  activity={activity}
                />
              ))}
            </View>
          </View>

          {/* Premium Upgrade CTA */}
          {/* {userPlan === "free" && (
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.upgradeCard}
                onPress={onUpgrade}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#007AFF", "#0051D5"]}
                  style={styles.upgradeGradient}
                >
                  <Text style={styles.upgradeIcon}>💎</Text>
                  <Text style={styles.upgradeTitle}>Unlock Premium Insights</Text>
                  <Text style={styles.upgradeSubtitle}>
                    Get detailed analytics, export data, and advanced features
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )} */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  safeArea: { 
    flex: 1 
  },
  scrollView: { 
    flex: 1 
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: { 
    paddingTop: 20, 
    paddingBottom: 30, 
    alignItems: "center" 
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  periodSelector: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: { 
    marginBottom: 30 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: { 
    width: (width - 50) / 2, 
    marginBottom: 12 
  },
  statCardGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: { 
    fontSize: 24 
  },
  trendContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: { 
    fontSize: 12, 
    fontWeight: "600" 
  },
  trendPositive: { 
    color: "#34C759" 
  },
  trendNegative: { 
    color: "#FF3B30" 
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statTitle: { 
    fontSize: 14, 
    opacity: 0.8 
  },
  cuisineList: { 
    gap: 12 
  },
  cuisineCard: { 
    marginBottom: 12 
  },
  cuisineCardGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cuisineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cuisineInfo: { 
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1 
  },
  cuisineRank: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 30,
  },
  cuisineIcon: { 
    fontSize: 20, 
    marginHorizontal: 12 
  },
  cuisineTextContainer: { 
    flex: 1 
  },
  cuisineName: { 
    fontSize: 18, 
    fontWeight: "600" 
  },
  cuisineSearches: { 
    fontSize: 14, 
    opacity: 0.7 
  },
  cuisineTrend: { 
    alignItems: "flex-end" 
  },
  cuisinePercentage: { 
    fontSize: 18, 
    fontWeight: "700" 
  },
  cuisineTrendText: { 
    fontSize: 12, 
    fontWeight: "600" 
  },
  progressBarContainer: { 
    marginTop: 8 
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: { 
    height: "100%", 
    borderRadius: 3 
  },
  chartContainer: { 
    marginBottom: 20 
  },
  chartGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  chartContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  chartBar: { 
    alignItems: "center", 
    flex: 1 
  },
  barContainer: {
    height: 80,
    width: 20,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  bar: { 
    width: "100%", 
    borderRadius: 10, 
    minHeight: 4 
  },
  chartDay: { 
    fontSize: 12, 
    marginBottom: 4, 
    opacity: 0.7 
  },
  chartValue: { 
    fontSize: 12, 
    fontWeight: "600" 
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementCard: { 
    width: (width - 50) / 2, 
    marginBottom: 12 
  },
  achievementGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  achievementIcon: { 
    fontSize: 32, 
    marginBottom: 8 
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
  unlockedBadge: {
    backgroundColor: "#34C759",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  unlockedText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  activityList: { 
    gap: 12 
  },
  activityCard: { 
    marginBottom: 12 
  },
  activityGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  activityTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  activityCuisine: {
    fontSize: 14,
    opacity: 0.8,
  },
  upgradeCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  upgradeGradient: {
    padding: 24,
    alignItems: "center",
  },
  upgradeIcon: { 
    fontSize: 32, 
    marginBottom: 12 
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
});