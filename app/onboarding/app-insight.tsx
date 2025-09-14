import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// Mock data for analytics
const mockData = {
  popularCuisines: [
    {
      name: "Italian",
      searches: 1247,
      percentage: 28,
      trend: "+12%",
      icon: "🇮🇹",
    },
    { name: "Asian", searches: 986, percentage: 22, trend: "+8%", icon: "🥢" },
    {
      name: "Mexican",
      searches: 743,
      percentage: 17,
      trend: "+15%",
      icon: "🌮",
    },
    {
      name: "Mediterranean",
      searches: 621,
      percentage: 14,
      trend: "+5%",
      icon: "🫒",
    },
    {
      name: "American",
      searches: 512,
      percentage: 12,
      trend: "+3%",
      icon: "🍔",
    },
    { name: "Indian", searches: 298, percentage: 7, trend: "+18%", icon: "🍛" },
  ],
  userActions: [
    { action: "Recipe Views", count: 4521, trend: "+24%", icon: "👁️" },
    { action: "Favorites Added", count: 1834, trend: "+18%", icon: "❤️" },
    { action: "Recipes Cooked", count: 967, trend: "+31%", icon: "👨‍🍳" },
    { action: "Shopping Lists", count: 623, trend: "+12%", icon: "🛒" },
  ],
  weeklyStats: [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 62 },
    { day: "Wed", value: 38 },
    { day: "Thu", value: 71 },
    { day: "Fri", value: 84 },
    { day: "Sat", value: 92 },
    { day: "Sun", value: 67 },
  ],
};

const StatCard = ({ title, value, trend, icon, isLarge = false }) => (
  <View style={[styles.statCard, isLarge && styles.largeStatCard]}>
    <LinearGradient
      colors={["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.05)"]}
      style={styles.statCardGradient}
    >
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Text
              style={[
                styles.trendText,
                trend.startsWith("+")
                  ? styles.trendPositive
                  : styles.trendNegative,
              ]}
            >
              {trend}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </LinearGradient>
  </View>
);

const CuisineCard = ({ cuisine, rank }) => {
  const barWidth = (cuisine.percentage / 100) * 200;
  return (
    <View style={styles.cuisineCard}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
        style={styles.cuisineCardGradient}
      >
        <View style={styles.cuisineHeader}>
          <View style={styles.cuisineInfo}>
            <Text style={styles.cuisineRank}>#{rank}</Text>
            <Text style={styles.cuisineIcon}>{cuisine.icon}</Text>
            <View style={styles.cuisineTextContainer}>
              <Text style={styles.cuisineName}>{cuisine.name}</Text>
              <Text style={styles.cuisineSearches}>
                {cuisine.searches} searches
              </Text>
            </View>
          </View>
          <View style={styles.cuisineTrend}>
            <Text style={styles.cuisinePercentage}>{cuisine.percentage}%</Text>
            <Text
              style={[
                styles.cuisineTrendText,
                cuisine.trend.startsWith("+")
                  ? styles.trendPositive
                  : styles.trendNegative,
              ]}
            >
              {cuisine.trend}
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <LinearGradient
              colors={["#FF6B6B", "#FF8E53"]}
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
        colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
        style={styles.chartGradient}
      >
        <Text style={styles.chartTitle}>Weekly Activity</Text>
        <View style={styles.chartContent}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            return (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <LinearGradient
                    colors={["#FF6B6B", "#FF8E53"]}
                    style={[styles.bar, { height: barHeight }]}
                  />
                </View>
                <Text style={styles.chartDay}>{item.day}</Text>
                <Text style={styles.chartValue}>{item.value}</Text>
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

export default function AppInsightsScreen() {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}
          style={styles.overlay}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 120,
              paddingHorizontal: 20,
            }}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>App Insights</Text>
              <Text style={styles.headerSubtitle}>
                Track your cooking journey
              </Text>
            </View>

            <View style={styles.periodSelector}>
              {["week", "month", "year"].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period &&
                        styles.periodButtonTextActive,
                    ]}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Activity</Text>
              <View style={styles.statsGrid}>
                {mockData.userActions.map((action, index) => (
                  <StatCard
                    key={index}
                    title={action.action}
                    value={action.count.toLocaleString()}
                    trend={action.trend}
                    icon={action.icon}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <WeeklyChart data={mockData.weeklyStats} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Most Popular Cuisines</Text>
              <View style={styles.cuisineList}>
                {mockData.popularCuisines.map((cuisine, index) => (
                  <CuisineCard key={index} cuisine={cuisine} rank={index + 1} />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Sticky Next Page Button */}
          <View style={styles.stickyButtonContainer}>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => {
               router.push('/onboarding/ingredients-search')
              }}
            >
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={styles.primaryActionGradient}
              >
                <Text style={styles.primaryActionText}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  header: { paddingTop: 20, paddingBottom: 30, alignItems: "center" },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
    textAlign: "center",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
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
  periodButtonActive: { backgroundColor: "rgba(255,107,107,0.8)" },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  periodButtonTextActive: { color: "#FFFFFF" },
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: { width: (width - 50) / 2, marginBottom: 12 },
  statCardGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: { fontSize: 24 },
  trendContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: { fontSize: 12, fontWeight: "600" },
  trendPositive: { color: "#4ADE80" },
  trendNegative: { color: "#F87171" },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statTitle: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  cuisineList: { gap: 12 },
  cuisineCard: { marginBottom: 12 },
  cuisineCardGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  cuisineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cuisineInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  cuisineRank: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B6B",
    minWidth: 30,
  },
  cuisineIcon: { fontSize: 20, marginHorizontal: 12 },
  cuisineTextContainer: { flex: 1 },
  cuisineName: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  cuisineSearches: { fontSize: 14, color: "rgba(255,255,255,0.7)" },
  cuisineTrend: { alignItems: "flex-end" },
  cuisinePercentage: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  cuisineTrendText: { fontSize: 12, fontWeight: "600" },
  progressBarContainer: { marginTop: 8 },
  progressBarBackground: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: { height: "100%", borderRadius: 3 },
  chartContainer: { marginBottom: 20 },
  chartGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  chartContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  chartBar: { alignItems: "center", flex: 1 },
  barContainer: {
    height: 80,
    width: 20,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  bar: { width: "100%", borderRadius: 10 },
  chartDay: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  chartValue: { fontSize: 12, fontWeight: "600", color: "#FFFFFF" },
  stickyButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  primaryActionButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryActionGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  primaryActionText: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
});
