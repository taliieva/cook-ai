import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Import your PNG icon
import siriLogo from "../../assets/images/ai-logo.png";
import InsightsScreen from "../main/insight";
import LikedComponent from "../main/liked/LikedComponent";
import AIPoweredComponent from "../main/search/AIPoweredComponent";

// TODO: Import and initialize Superwall when ready
// import Superwall from '@superwall/react-native';


const { width, height } = Dimensions.get("window");

// Mock countries data
const countries = [
  { name: "All Countries", flag: "🌍", code: "all" },
  { name: "Azərbaycan", flag: "🇦🇿", code: "az" },
  { name: "Türkiye", flag: "🇹🇷", code: "tr" },
  { name: "Italian", flag: "🇮🇹", code: "it" },
  { name: "Chinese", flag: "🇨🇳", code: "cn" },
  { name: "Mexican", flag: "🇲🇽", code: "mx" },
  { name: "Japanese", flag: "🇯🇵", code: "jp" },
  { name: "French", flag: "🇫🇷", code: "fr" },
  { name: "Indian", flag: "🇮🇳", code: "in" },
  { name: "American", flag: "🇺🇸", code: "us" },
  { name: "Thai", flag: "🇹🇭", code: "th" },

];

// Modes data
const modes = [
  {
    name: "Standard",
    icon: "restaurant-outline",
    code: "standard",
    isPro: false,
  },
  { name: "Gym", icon: "fitness-outline", code: "gym", isPro: false },
  { name: "Diet", icon: "leaf-outline", code: "diet", isPro: false },
  { name: "Vegan", icon: "flower-outline", code: "vegan", isPro: true },
  {
    name: "Vegetarian",
    icon: "nutrition-outline",
    code: "vegetarian",
    isPro: true,
  },
];

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
    isPaywall: true, // Special flag to open Superwall
  },
];

export default function UnifiedMainScreen() {
  const theme = useTheme();

  // Main app state
  const [activeTab, setActiveTab] = useState("ai");

  // Shared state between components
  const [ingredients, setIngredients] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [userPlan, setUserPlan] = useState("free");

  // Handle tab switching
  const handleTabPress = (tabId) => {
    // Check if it's the premium tab - show Superwall instead of switching tabs
    const selectedTab = tabs.find(t => t.id === tabId);
    if (selectedTab?.isPaywall) {
      console.log("🔓 Opening Superwall paywall from Premium tab");
      handleUpgrade();
      return;
    }
    
    setActiveTab(tabId);
  };

  // Handle upgrade from any component - Show Superwall paywall
  const handleUpgrade = () => {
    console.log("🔓 Showing Superwall paywall for upgrade");
    // TODO: Implement Superwall paywall display
    // Superwall.register('upgrade_clicked', {
    //   source: 'app_navigation',
    //   user_plan: userPlan
    // });
  };

  // Handle search again from insights
  const handleSearchAgain = (searchTerms, cuisine, mode) => {
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
  const renderTabIcon = (tab, isActive) => {
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

  // Render current section based on active tab
  const renderCurrentSection = () => {
    switch (activeTab) {
      case "ai":
        return (
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
      case "insights":
        return <InsightsScreen />;
      case "liked":
        return <LikedComponent userPlan={userPlan} onUpgrade={handleUpgrade} />;
      default:
        return (
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