import { useTheme } from "@/hooks/useTheme";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Import separate components
import BillingComponent from '../main/billing/BillingComponent';
import HistoryComponent from '../main/history/HistoryComponent';
import AIPoweredComponent from '../main/search/AIPoweredComponent';

const { width, height } = Dimensions.get("window");

// Import your custom icons
const icons = {
  aiPowered: require("../../assets/images/ai-powered.png"),
  history: require("../../assets/images/ai-history.png"),
  billing: require("../../assets/images/ai-billing.png"),
};

// Mock countries data
const countries = [
  { name: "All Countries", flag: "🌍", code: "all" },
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
  { name: "Standard", icon: "restaurant-outline", code: "standard", isPro: false },
  { name: "Gym", icon: "fitness-outline", code: "gym", isPro: false },
  { name: "Diet", icon: "leaf-outline", code: "diet", isPro: false },
  { name: "Vegan", icon: "flower-outline", code: "vegan", isPro: true },
  { name: "Vegetarian", icon: "nutrition-outline", code: "vegetarian", isPro: true },
];

export default function UnifiedMainScreen() {
  const theme = useTheme();
  
  // Main app state
  const [activeTab, setActiveTab] = useState("ai");
  
  // Shared state between components
  const [ingredients, setIngredients] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedMode, setSelectedMode] = useState(modes[0]); // Default to Standard mode
  const [userPlan, setUserPlan] = useState("free"); // 'free' or 'pro'

  // Handle tab switching
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  // Handle upgrade from any component
  const handleUpgrade = () => {
    setActiveTab("billing");
  };

  // Handle search again from history
  const handleSearchAgain = (searchTerms, cuisine, mode) => {
    // Switch to AI tab and pre-fill ingredients, cuisine, and mode
    setIngredients(searchTerms);
    setSelectedCountry(countries.find(c => c.name === cuisine) || countries[0]);
    if (mode) {
      setSelectedMode(modes.find(m => m.name === mode) || modes[0]);
    }
    setActiveTab('ai');
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
      case "history":
        return (
          <HistoryComponent 
            userPlan={userPlan}
            onSearchAgain={handleSearchAgain}
            onUpgrade={handleUpgrade}
          />
        );
      case "billing":
        return <BillingComponent />;
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
      <View style={styles.contentContainer}>
        {renderCurrentSection()}
      </View>

      {/* Footer with Custom Icons - Always Visible */}
      <View
        style={[
          styles.bottomToolbar,
          {
            backgroundColor: theme.colors.background.secondary,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tabItem,
            {
              backgroundColor:
                activeTab === "ai"
                  ? theme.colors.accent.primary + "15"
                  : "transparent",
            },
          ]}
          onPress={() => handleTabPress("ai")}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  activeTab === "ai"
                    ? theme.colors.accent.primary
                    : "transparent",
              },
            ]}
          >
            <Image
              source={icons.aiPowered}
              style={styles.tabIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            {
              backgroundColor:
                activeTab === "history"
                  ? theme.colors.accent.primary + "15"
                  : "transparent",
            },
          ]}
          onPress={() => handleTabPress("history")}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  activeTab === "history"
                    ? theme.colors.accent.primary
                    : "transparent",
              },
            ]}
          >
            <Image
              source={icons.history}
              style={styles.tabIcon1}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            {
              backgroundColor:
                activeTab === "billing"
                  ? theme.colors.accent.primary + "15"
                  : "transparent",
            },
          ]}
          onPress={() => handleTabPress("billing")}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  activeTab === "billing"
                    ? theme.colors.accent.primary
                    : "transparent",
              },
            ]}
          >
            <Image
              source={icons.billing}
              style={styles.tabIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
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
  },
  bottomToolbar: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
  tabIcon1: {
    width: 40,
    height: 40,
  },
});