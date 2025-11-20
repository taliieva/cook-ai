import { useTheme } from "@/hooks/useTheme";
import { validateAuthState } from "@/utils/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import InsightsScreen from "./insight";
import LikedComponent from "./recipes/LikedRecipes";
import AIPoweredComponent from "./search/AIPoweredComponent";
import { countries, modes } from "./search/constants/searchConstants";

// Import your PNG icon
const siriLogo = require("../../assets/images/ai-logo.png");

// RevenueCat is initialized in the root layout

// Tab configuration - simplified approach
const tabs = [
  {
    id: "ai",
    label: "AI Search",
    type: "image", // Special type for PNG
  },
  {
    id: "insights",
    icon: "analytics-outline",
    activeIcon: "analytics",
    label: "Insights",
    type: "icon",
  },
  {
    id: "liked",
    icon: "heart-outline",
    activeIcon: "heart",
    label: "Favorites",
    type: "icon",
  },
  {
    id: "premium",
    icon: "diamond-outline",
    activeIcon: "diamond",
    label: "Premium",
    type: "icon",
    isPaywall: true, // Special flag to open RevenueCat paywall
  },
];

export default function UnifiedMainScreen() {
  const theme = useTheme();
  const router = useRouter();

  // Auth state
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Main app state
  const [activeTab, setActiveTab] = useState("ai");

  // Shared state between components
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [userPlan, setUserPlan] = useState("free");

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      console.log("🔐 Home: Checking authentication...");
      const authResult = await validateAuthState();
      
      // Allow both authenticated users AND guest users
      const hasAccess = authResult.isValid && authResult.userData;
      
      if (!hasAccess) {
        console.log("⛔ Home: No valid tokens - redirecting to welcome");
        router.replace("/onboarding/welcome");
        return;
      }
      
      const isGuest = authResult.userData?.isGuest;
      console.log(`✅ Home: User has access (${isGuest ? 'Guest' : 'Authenticated'})`);
      setIsAuthenticated(true);
      
      // Update user plan if available
      if (authResult.userData?.subscriptionStatus) {
        setUserPlan(authResult.userData.subscriptionStatus);
      }
    } catch (error) {
      console.error("❌ Home: Auth check error:", error);
      router.replace("/onboarding/welcome");
    } finally {
      setIsAuthChecking(false);
    }
  };

  // Handle tab switching
  const handleTabPress = (tabId: string) => {
    // Check if it's the premium tab - show RevenueCat paywall instead of switching tabs
    const selectedTab = tabs.find(t => t.id === tabId);
    if (selectedTab?.isPaywall) {
      console.log("🔓 Opening RevenueCat paywall from Premium tab");
      handleUpgrade();
      return;
    }
    
    setActiveTab(tabId);
  };

  // Handle upgrade from any component - Show RevenueCat paywall
  const handleUpgrade = async () => {
    console.log("🔓 Showing RevenueCat paywall for upgrade");
    const { showPaywall } = await import('@/utils/subscriptions');
    await showPaywall();
  };

  // Handle search again from insights
  const handleSearchAgain = (searchTerms: any[], cuisine: string, mode?: string) => {
    setIngredients(searchTerms);
    setSelectedCountry(
      countries.find((c) => c.name === cuisine) || countries[0]
    );
    if (mode) {
      setSelectedMode(modes.find((m) => m.name === mode) || modes[0]);
    }
    setActiveTab("ai");
  };

  // Custom function to render tab icon
  const renderTabIcon = (tab: any, isActive: boolean) => {
    if (tab.type === "image") {
      // Special handling for AI Search tab with PNG
      return (
        <View style={styles.imageIconContainer}>
          <Image
            source={siriLogo}
            style={[
              styles.tabImageIcon,
              {
                opacity: isActive ? 1 : 0.7,
                // Remove tintColor to preserve original PNG colors
                // Or keep it if you want color changes:
                // tintColor: isActive ? "#007AFF" : theme.colors.text.secondary,
              },
            ]}
            resizeMode="contain"
          />
        </View>
      );
    } else {
      // Regular Ionicons for other tabs
      return (
        <Ionicons
          name={isActive ? tab.activeIcon : tab.icon}
          size={24}
          color={isActive ? "#007AFF" : theme.colors.text.secondary}
        />
      );
    }
  };

  // Show loading while checking authentication
  if (isAuthChecking) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render current section based on active tab (content only, no modals)
  const renderCurrentSection = () => {
    const aiComponent = (
      <AIPoweredComponent
        ingredients={ingredients}
        setIngredients={setIngredients}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        onUpgrade={handleUpgrade}
      />
    );

    switch (activeTab) {
      case "ai":
        return aiComponent;
      case "insights":
        return <InsightsScreen />;
      case "liked":
        return <LikedComponent userPlan={userPlan} onUpgrade={handleUpgrade} />;
      default:
        return aiComponent;
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background.primary}
      />

      {/* Dynamic content based on active tab */}
      <View style={styles.contentContainer}>{renderCurrentSection()}</View>

      {/* Footer Navigation */}
      <View style={styles.footerContainer}>
        <View
          style={[
            styles.footerBackground,
            {
              backgroundColor: theme.isDark
                ? "rgba(28, 28, 30, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              borderTopColor: theme.isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.08)",
            },
          ]}
        >
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tabItem,
                    isActive && [
                      styles.activeTabItem,
                      {
                        backgroundColor: theme.isDark
                          ? "rgba(0, 122, 255, 0.2)"
                          : "rgba(0, 122, 255, 0.1)",
                      },
                    ],
                  ]}
                  onPress={() => handleTabPress(tab.id)}
                  activeOpacity={0.7}
                >
                  {/* Render icon using custom function */}
                  {renderTabIcon(tab, isActive)}

                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isActive
                          ? "#007AFF"
                          : theme.colors.text.secondary,
                        opacity: isActive ? 1 : 0.7,
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 50, // Space for footer
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20, // Safe area padding
  },
  footerBackground: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backdropFilter: "blur(20px)",
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minHeight: 60,
    minWidth: 60,
    flex: 1,
    maxWidth: 80,
  },
  activeTabItem: {
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "500",
  },
  // New styles for PNG icon
  imageIconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tabImageIcon: {
    width: 38,
    height: 38,
  },
});