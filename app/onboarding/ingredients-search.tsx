import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
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
import LikedComponent from '../main/liked/LikedComponent'; // Add LikedComponent
import AIPoweredComponent from '../main/search/AIPoweredComponent';

const { width, height } = Dimensions.get("window");

// Import your custom icons
const icons = {
  aiPowered: require("../../assets/images/ai.png"),
  history: require("../../assets/images/archive.png"),
  liked: require("../../assets/images/heart.png"), // Add heart icon for liked section
  billing: require("../../assets/images/price.png"),
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
      case "liked":
        return (
          <LikedComponent 
            userPlan={userPlan}
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

      {/* Footer with Smooth Background Effect */}
      <View style={styles.footerContainer}>
        {/* Gradient fade effect */}
        <LinearGradient
          colors={[
            'transparent',
            theme.isDark 
              ? 'rgba(255, 255, 255, 0.02)' 
              : 'rgba(0, 0, 0, 0.02)',
            theme.isDark 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.05)',
            theme.isDark 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(0, 0, 0, 0.08)',
            theme.isDark 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(0, 0, 0, 0.12)',
          ]}
          style={styles.gradientOverlay}
          locations={[0, 0.3, 0.6, 0.8, 1]}
        />

        {/* Removed blur background */}

        {/* Main footer content */}
        <View style={styles.bottomToolbar}>
          {/* Subtle top border */}
          <View style={[
            styles.topBorder,
            { backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
          ]} />
          
          {/* Content wrapper for proper centering within full-width background */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress("ai")}
              activeOpacity={0.7}
            >
              <Image
                source={icons.aiPowered}
                style={[
                  styles.tabIcon,
                  {
                    tintColor: activeTab === "ai" ? "#007AFF" : theme.colors.text.secondary,
                  },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress("history")}
              activeOpacity={0.7}
            >
              <Image
                source={icons.history}
                style={[
                  styles.tabIcon,
                  {
                    tintColor: activeTab === "history" ? "#007AFF" : theme.colors.text.secondary,
                  },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress("liked")}
              activeOpacity={0.7}
            >
              <Image
                source={icons.liked}
                style={[
                  styles.tabIcon,
                  {
                    tintColor: activeTab === "liked" ? "#007AFF" : theme.colors.text.secondary,
                  },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress("billing")}
              activeOpacity={0.7}
            >
              <Image
                source={icons.billing}
                style={[
                  styles.tabIcon,
                  {
                    tintColor: activeTab === "billing" ? "#007AFF" : theme.colors.text.secondary,
                  },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
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
    paddingBottom: 20, // Add some space before footer
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120, // Increased height for gradient effect
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurBackground: {
    // Removed blur background styles
  },
  bottomToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 24,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 6,
    minHeight: 52,
    // Removed background color and shadow properties
  },
  tabIcon: {
    width: 26,
    height: 26,
  },
});