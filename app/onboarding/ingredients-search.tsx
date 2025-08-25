import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Import your custom icons (adjust paths as needed)
const icons = {
  aiPowered: require("../../assets/images/ai-powered.png"),
  history: require("../../assets/images/ai-history.png"),
  billing: require("../../assets/images/ai-billing.png"),
};

// Mock countries data with flags
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

export default function IngredientsSearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [activeTab, setActiveTab] = useState("ai"); // Changed default to 'ai'
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  // Mock user state - change these to test different scenarios
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to false to test logged out state
  const [userPlan, setUserPlan] = useState("free"); // 'free' or 'pro'

  const handleAddIngredient = () => {
    if (searchText.trim() && !ingredients.includes(searchText.trim())) {
      setIngredients([...ingredients, searchText.trim()]);
      setSearchText("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setIngredients(
      ingredients.filter((ingredient) => ingredient !== ingredientToRemove)
    );
  };

  const handleFindDishes = () => {
    router.push("/main/dishes");
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    // Handle navigation based on tab
    switch (tab) {
      case "ai":
        // Stay on main search page or return to it
        // This is the main search page, so no navigation needed
        break;
      case "history":
        // Navigate to history section
        console.log("Navigate to history section");
        break;
      case "billing":
        // Navigate to billing
        console.log("Navigate to billing section");
        break;
    }
  };

  const handleProfileMenuOption = (option) => {
    setShowProfileMenu(false);
    switch (option) {
      case "login":
        // Navigate to login page
        console.log("Navigate to login");
        break;
      case "privacy":
        console.log("Navigate to Privacy & Policy");
        break;
      case "terms":
        console.log("Navigate to Terms of Use");
        break;
      case "liked":
        console.log("Navigate to Liked Recipes");
        break;
      case "saved":
        console.log("Navigate to Saved Recipes");
        break;
      case "upgrade":
        console.log("Navigate to Upgrade Plan");
        break;
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountrySelector(false);
  };

  const ProfileMenu = () => (
    <Modal
      visible={showProfileMenu}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowProfileMenu(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowProfileMenu(false)}
      >
        <View
          style={[
            styles.profileMenu,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {!isLoggedIn ? (
            // Not logged in - show only login button
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleProfileMenuOption("login")}
            >
              <Ionicons
                name="log-in-outline"
                size={20}
                color={theme.colors.text.primary}
              />
              <Text
                style={[styles.menuText, { color: theme.colors.text.primary }]}
              >
                Log in
              </Text>
            </TouchableOpacity>
          ) : (
            // Logged in - show profile options and plan
            <>
              {/* Your Plan Section */}
              <View style={styles.planSection}>
                <Text
                  style={[
                    styles.planTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Your Plan
                </Text>
                <View style={styles.planContent}>
                  <View
                    style={[
                      styles.planBadge,
                      {
                        backgroundColor:
                          userPlan === "pro"
                            ? theme.colors.accent.primary + "20"
                            : theme.colors.text.secondary + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.planLabel,
                        {
                          color:
                            userPlan === "pro"
                              ? theme.colors.accent.primary
                              : theme.colors.text.secondary,
                        },
                      ]}
                    >
                      {userPlan === "pro" ? "Premium" : "Free"}
                    </Text>
                  </View>
                  {userPlan === "free" && (
                    <TouchableOpacity
                      style={[
                        styles.upgradeButton,
                        { backgroundColor: theme.colors.accent.primary },
                      ]}
                      onPress={() => handleProfileMenuOption("upgrade")}
                    >
                      <Text style={styles.upgradeButtonText}>Upgrade</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View
                style={[
                  styles.menuDivider,
                  { backgroundColor: theme.colors.border },
                ]}
              />

              {/* Profile Menu Options */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("privacy")}
              >
                <Ionicons
                  name="shield-outline"
                  size={20}
                  color={theme.colors.text.primary}
                />
                <Text
                  style={[
                    styles.menuText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Privacy & Policy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("terms")}
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={theme.colors.text.primary}
                />
                <Text
                  style={[
                    styles.menuText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Terms of Use
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("liked")}
              >
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={theme.colors.text.primary}
                />
                <Text
                  style={[
                    styles.menuText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Liked Recipes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("saved")}
              >
                <Ionicons
                  name="bookmark-outline"
                  size={20}
                  color={theme.colors.text.primary}
                />
                <Text
                  style={[
                    styles.menuText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Saved Recipes
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const CountrySelector = () => (
    <Modal
      visible={showCountrySelector}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCountrySelector(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowCountrySelector(false)}
      >
        <View
          style={[
            styles.countrySelector,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.countrySelectorHeader}>
            <Text
              style={[
                styles.countrySelectorTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Select Cuisine
            </Text>
            <TouchableOpacity onPress={() => setShowCountrySelector(false)}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.countryList}>
            {countries.map((country, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.countryItem,
                  {
                    backgroundColor:
                      selectedCountry.code === country.code
                        ? theme.colors.accent.primary + "15"
                        : "transparent",
                  },
                ]}
                onPress={() => handleCountrySelect(country)}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <Text
                  style={[
                    styles.countryName,
                    {
                      color:
                        selectedCountry.code === country.code
                          ? theme.colors.accent.primary
                          : theme.colors.text.primary,
                    },
                  ]}
                >
                  {country.name}
                </Text>
                {selectedCountry.code === country.code && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={theme.colors.accent.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

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

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setShowProfileMenu(true)}
        >
          <Ionicons
            name="person-circle-outline"
            size={28}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Search Input Section with Country Selector */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text.primary }]}
            placeholder="Enter ingredients..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleAddIngredient}
            returnKeyType="done"
          />

          {/* Country Selector */}
          <TouchableOpacity
            style={[styles.countryButton, { borderColor: theme.colors.border }]}
            onPress={() => setShowCountrySelector(true)}
          >
            <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>

          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={handleAddIngredient}
              style={styles.addButton}
            >
              <Ionicons
                name="add-circle"
                size={24}
                color={theme.colors.accent.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Ingredients List */}
      <ScrollView
        style={styles.ingredientsSection}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Your Ingredients ({ingredients.length})
        </Text>

        <View style={styles.ingredientsContainer}>
          {ingredients.map((ingredient, index) => (
            <View
              key={index}
              style={[
                styles.ingredientTag,
                {
                  backgroundColor: theme.colors.accent.primary + "20",
                  borderColor: theme.colors.accent.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.ingredientText,
                  { color: theme.colors.accent.primary },
                ]}
              >
                {ingredient}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveIngredient(ingredient)}
                style={styles.removeButton}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={theme.colors.accent.primary}
                />
              </TouchableOpacity>
            </View>
          ))}

          {ingredients.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="restaurant-outline"
                size={48}
                color={theme.colors.text.secondary}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Add ingredients to find amazing dishes from{" "}
                {selectedCountry.name.toLowerCase()} cuisine!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Find Dishes Button */}
      <View style={styles.buttonSection}>
        <Button
          title="Find Dishes"
          onPress={handleFindDishes}
          style={{
            ...styles.findButton,
            opacity: ingredients.length > 0 ? 1 : 0.5,
          }}
          disabled={ingredients.length === 0}
        />
      </View>

      {/* Footer with Custom Icons and Background Colors */}
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

      <ProfileMenu />
      <CountrySelector />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  profileButton: {
    padding: 8,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 8,
  },
  countryFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  addButton: {
    marginLeft: 5,
  },
  ingredientsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ingredientTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  removeButton: {
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    opacity: 0.7,
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  findButton: {
    width: "100%",
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
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  profileMenu: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  planSection: {
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  planContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  planLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  upgradeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  upgradeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  menuDivider: {
    height: 1,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  countrySelector: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    maxHeight: height * 0.6,
  },
  countrySelectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  countrySelectorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  countryName: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
});
