import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import separate components
import BillingComponent from '../main/billing/BillingComponent';
import LikedComponent from '../main/liked/LikedComponent';
import AIPoweredComponent from '../main/search/AIPoweredComponent';
import InsightsComponent from './app-insight';

const { width, height } = Dimensions.get("window");

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

// Tab configuration with attractive icons
const tabs = [
  { 
    id: "ai", 
    icon: "sparkles", 
    activeIcon: "sparkles",
    label: "AI Search" 
  },
  { 
    id: "insights", 
    icon: "analytics-outline", 
    activeIcon: "analytics",
    label: "Insights" 
  },
  { 
    id: "liked", 
    icon: "heart-outline", 
    activeIcon: "heart",
    label: "Favorites" 
  },
  { 
    id: "billing", 
    icon: "diamond-outline", 
    activeIcon: "diamond",
    label: "Premium" 
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
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  // Handle upgrade from any component
  const handleUpgrade = () => {
    setActiveTab("billing");
  };

  // Handle search again from insights
  const handleSearchAgain = (searchTerms, cuisine, mode) => {
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
      case "insights":
        return (
          <InsightsComponent 
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

      {/* Footer with Attractive Icons */}
      <View style={styles.footerContainer}>
        {/* Modern glassmorphism background */}
        <View style={[
          styles.footerBackground,
          { 
            backgroundColor: theme.isDark 
              ? 'rgba(28, 28, 30, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            borderTopColor: theme.isDark 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(0, 0, 0, 0.08)'
          }
        ]}>
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
                          ? 'rgba(0, 122, 255, 0.2)' 
                          : 'rgba(0, 122, 255, 0.1)',
                        shadowColor: "#007AFF",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                      }
                    ]
                  ]}
                  onPress={() => handleTabPress(tab.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isActive ? tab.activeIcon : tab.icon}
                    size={24}
                    color={isActive ? "#007AFF" : theme.colors.text.secondary}
                  />
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
    position: 'absolute',
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
    backdropFilter: 'blur(20px)', // For iOS blur effect
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  tabItem: {
    alignItems: "center",
    justifyContent: 'center',
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
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
});