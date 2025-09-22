import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchWithAuth } from "../../../utils/auth";

const { width, height } = Dimensions.get("window");

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

// Modes data with icons and colors
const modes = [
  { name: "Standard", icon: "restaurant-outline", code: "standard", isPro: false, color: "#FF8C00" },
  { name: "Gym", icon: "fitness-outline", code: "gym", isPro: false, color: "#FF4444" },
  { name: "Diet", icon: "leaf-outline", code: "diet", isPro: false, color: "#4CAF50" },
  { name: "Vegan", icon: "flower-outline", code: "vegan", isPro: true, color: "#8BC34A" },
  { name: "Vegetarian", icon: "nutrition-outline", code: "vegetarian", isPro: true, color: "#4CAF50" },
];

// Helper function to get mode color with transparency
const getModeColor = (mode, opacity = 1) => {
  return opacity === 1 ? mode.color : mode.color + Math.round(opacity * 255).toString(16).padStart(2, '0');
};

// Country code to country name mapping for API
const getCountryNameForAPI = (countryCode: string): string => {
  const countryMap: { [key: string]: string } = {
    "all": "All Countries",
    "it": "Italy",
    "cn": "China", 
    "mx": "Mexico",
    "jp": "Japan",
    "fr": "France",
    "in": "India",
    "us": "United States",
    "th": "Thailand",
  };
  return countryMap[countryCode] || "All Countries";
};

export default function AIPoweredComponent({
  ingredients,
  setIngredients,
  selectedCountry,
  setSelectedCountry,
  selectedMode,
  setSelectedMode,
  onUpgrade
}: any) {
  const router = useRouter();
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [userInfo, setUserInfo] = useState({
    displayName: "",
    email: "",
    isGuest: true
  });

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const displayName = await SecureStore.getItemAsync("displayName");
      const userEmail = await SecureStore.getItemAsync("userEmail");
      
      if (accessToken && displayName && userEmail) {
        setIsLoggedIn(true);
        setUserInfo({
          displayName,
          email: userEmail,
          isGuest: false
        });
        
        // You might want to fetch subscription status from your API here
        // For now, assuming free plan
        setUserPlan("free");
      } else {
        setIsLoggedIn(false);
        setUserInfo({
          displayName: "",
          email: "",
          isGuest: true
        });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
    }
  };

  const handleAddIngredient = () => {
    if (searchText.trim() && !ingredients.includes(searchText.trim())) {
      setIngredients([...ingredients, searchText.trim()]);
      setSearchText("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: any) => {
    setIngredients(
      ingredients.filter((ingredient: any) => ingredient !== ingredientToRemove)
    );
  };

  const handleFindDishes = async () => {
    if (ingredients.length === 0) {
      Alert.alert("No Ingredients", "Please add at least one ingredient to find dishes.");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        ingredients: ingredients,
        country: getCountryNameForAPI(selectedCountry.code),
        language: "en",
        deviceLanguage: "en-US",
        dietType: selectedMode.code
      };

      console.log("=== API Request Debug ===");
      console.log("Endpoint:", "https://api.thecookai.app/v1/recipes");
      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      console.log("========================");

      const response = await fetchWithAuth("https://api.thecookai.app/v1/recipes", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log("Full response:", JSON.stringify(data, null, 2));

      if (!data.dishData || !data.dishData.DishSuggestions) {
        throw new Error("Invalid response structure from API");
      }

      router.push({
        pathname: "/main/dishes",
        params: {
          country: selectedCountry.code,
          mode: selectedMode.code,
          ingredients: JSON.stringify(ingredients),
          dishData: JSON.stringify(data.dishData),
          localizedSummary: JSON.stringify(data.localizedSummary || {}),
          requestId: data.requestId || "",
          searchId: data.searchId || "",
          usageInfo: JSON.stringify(data.usageInfo || {})
        }
      });

    } catch (error) {
      console.error("Error fetching dishes:", error);
      Alert.alert(
        "Error", 
        "Failed to fetch dishes. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileMenuOption = (option: any) => {
    setShowProfileMenu(false);
    switch (option) {
      case "login":
        router.push("/auth/sign-in");
        break;
      case "privacy":
        router.push('/main/privacy/PrivacyPolicyScreen');
        break;
      case "terms":
        router.push('/main/terms/TermsOfUseScreen');
        break;
      case "liked":
        router.push({
          pathname: '/main/liked/LikedComponent',
          params: { standalone: 'true' }
        });
        break;
      case "saved":
        router.push('/main/saved/SavedRecipesScreen');
        break;
      case "upgrade":
        onUpgrade();
        break;
      case "logout":
        handleLogout();
        break;
      case "delete":
        setShowDeleteConfirmation(true);
        break;
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all stored auth data
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userId");
      await SecureStore.deleteItemAsync("userEmail");
      await SecureStore.deleteItemAsync("displayName");
      await SecureStore.deleteItemAsync("appleUserEmail");
      await SecureStore.deleteItemAsync("appleUserName");
      
      // Update state
      setIsLoggedIn(false);
      setUserInfo({
        displayName: "",
        email: "",
        isGuest: true
      });
      setUserPlan("free");
      
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // You might want to call your API to delete the account first
      // await fetchWithAuth("https://api.thecookai.app/v1/auth/delete-account", { method: "DELETE" });
      
      // Clear all stored data
      await handleLogout();
      
      setShowDeleteConfirmation(false);
      
      // Navigate to onboarding
      router.push("/onboarding");
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setShowCountrySelector(false);
  };

  const handleModeSelect = (mode: any) => {
    if (mode.isPro && userPlan === "free") {
      setShowModeSelector(false);
      onUpgrade();
      return;
    }
    setSelectedMode(mode);
    setShowModeSelector(false);
  };

  const DeleteConfirmationModal = () => (
    <Modal
      visible={showDeleteConfirmation}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancelDelete}
    >
      <View style={styles.confirmationOverlay}>
        <View style={[
          styles.confirmationModal,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}>
          <View style={styles.confirmationHeader}>
            <Text style={[
              styles.confirmationTitle,
              { color: theme.colors.text.primary },
            ]}>
              Delete Account
            </Text>
            <TouchableOpacity onPress={handleCancelDelete}>
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.confirmationContent}>
            <Ionicons name="warning-outline" size={48} color="#FF4444" style={styles.warningIcon} />
            <Text style={[
              styles.confirmationMessage,
              { color: theme.colors.text.primary },
            ]}>
              Are you sure?
            </Text>
            <Text style={[
              styles.confirmationSubMessage,
              { color: theme.colors.text.secondary },
            ]}>
              This action cannot be undone and all your data will be permanently lost.
            </Text>
          </View>
          
          <View style={styles.confirmationButtons}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: theme.colors.background.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={handleCancelDelete}
            >
              <Text style={[
                styles.cancelButtonText,
                { color: theme.colors.text.primary },
              ]}>
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Yes, Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
        <View style={[
          styles.profileMenu,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}>
          {!isLoggedIn ? (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleProfileMenuOption("login")}
            >
              <Ionicons name="log-in-outline" size={20} color={theme.colors.text.primary} />
              <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
                Log in
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.userInfoSection}>
                <Text style={[
                  styles.userDisplayName,
                  { color: theme.colors.text.primary },
                ]}>
                  {userInfo.displayName}
                </Text>
                <Text style={[
                  styles.userEmail,
                  { color: theme.colors.text.secondary },
                ]}>
                  {userInfo.email}
                </Text>
              </View>

              <View style={styles.planSection}>
                <Text style={[
                  styles.planTitle,
                  { color: theme.colors.text.primary },
                ]}>
                  Your Plan
                </Text>
                <View style={styles.planContent}>
                  <View style={[
                    styles.planBadge,
                    {
                      backgroundColor: userPlan === "pro" 
                        ? theme.colors.accent.primary + "20" 
                        : theme.colors.text.secondary + "20",
                    },
                  ]}>
                    <Text style={[
                      styles.planLabel,
                      {
                        color: userPlan === "pro" 
                          ? theme.colors.accent.primary 
                          : theme.colors.text.secondary,
                      },
                    ]}>
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
              
              <View style={[
                styles.menuDivider,
                { backgroundColor: theme.colors.border },
              ]} />
              
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("privacy")}
              >
                <Ionicons name="shield-outline" size={20} color={theme.colors.text.primary} />
                <Text style={[
                  styles.menuText,
                  { color: theme.colors.text.primary },
                ]}>
                  Privacy & Policy
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("terms")}
              >
                <Ionicons name="document-text-outline" size={20} color={theme.colors.text.primary} />
                <Text style={[
                  styles.menuText,
                  { color: theme.colors.text.primary },
                ]}>
                  Terms of Use
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("liked")}
              >
                <Ionicons name="heart-outline" size={20} color={theme.colors.text.primary} />
                <Text style={[
                  styles.menuText,
                  { color: theme.colors.text.primary },
                ]}>
                  Liked Recipes
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("saved")}
              >
                <Ionicons name="bookmark-outline" size={20} color={theme.colors.text.primary} />
                <Text style={[
                  styles.menuText,
                  { color: theme.colors.text.primary },
                ]}>
                  Saved Recipes
                </Text>
              </TouchableOpacity>
              
              <View style={[
                styles.menuDivider,
                { backgroundColor: theme.colors.border },
              ]} />
              
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("logout")}
              >
                <Ionicons name="log-out-outline" size={20} color={theme.colors.text.primary} />
                <Text style={[
                  styles.menuText,
                  { color: theme.colors.text.primary },
                ]}>
                  Log out
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleProfileMenuOption("delete")}
              >
                <Ionicons name="trash-outline" size={20} color="#FF4444" />
                <Text style={[
                  styles.menuText,
                  { color: "#FF4444" },
                ]}>
                  Delete account
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
        <View style={[
          styles.countrySelector,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}>
          <View style={styles.countrySelectorHeader}>
            <Text style={[
              styles.countrySelectorTitle,
              { color: theme.colors.text.primary },
            ]}>
              Select Cuisine
            </Text>
            <TouchableOpacity onPress={() => setShowCountrySelector(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.countryList}>
            {countries.map((country, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.countryItem,
                  {
                    backgroundColor: selectedCountry.code === country.code
                      ? theme.colors.accent.primary + "15"
                      : "transparent",
                  },
                ]}
                onPress={() => handleCountrySelect(country)}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <Text style={[
                  styles.countryName,
                  {
                    color: selectedCountry.code === country.code
                      ? theme.colors.accent.primary
                      : theme.colors.text.primary,
                  },
                ]}>
                  {country.name}
                </Text>
                {selectedCountry.code === country.code && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.accent.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const ModeSelector = () => (
    <Modal
      visible={showModeSelector}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModeSelector(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowModeSelector(false)}
      >
        <View style={[
          styles.modeSelectorModal,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}>
          <View style={styles.modeSelectorHeader}>
            <Text style={[
              styles.modeSelectorTitle,
              { color: theme.colors.text.primary },
            ]}>
              Select Mode
            </Text>
            <TouchableOpacity onPress={() => setShowModeSelector(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modeList}>
            {modes.map((mode, index) => {
              const isDisabled = mode.isPro && userPlan === "free";
              const isSelected = selectedMode.code === mode.code;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modeItem,
                    {
                      backgroundColor: isSelected
                        ? getModeColor(mode, 0.15)
                        : "transparent",
                      opacity: isDisabled ? 0.6 : 1,
                    },
                  ]}
                  onPress={() => handleModeSelect(mode)}
                >
                  <Ionicons name={mode.icon as any} size={24} color={mode.color} />
                  <View style={styles.modeContent}>
                    <Text style={[
                      styles.modeName,
                      { color: mode.color },
                    ]}>
                      {mode.name}
                    </Text>
                    {mode.isPro && (
                      <View style={[
                        styles.proBadge,
                        { backgroundColor: mode.color },
                      ]}>
                        <Text style={styles.proText}>PRO</Text>
                      </View>
                    )}
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={mode.color} />
                  )}
                  {isDisabled && (
                    <Ionicons name="lock-closed" size={16} color={theme.colors.text.secondary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => alert('Coming soon')}
        >
          <Ionicons name="notifications-outline" size={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setShowProfileMenu(true)}
        >
          <Ionicons name="person-circle-outline" size={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Input Section with Country Selector */}
      <View style={styles.searchSection}>
        <View style={[
          styles.searchContainer,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}>
          <Ionicons name="search" size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text.primary }]}
            placeholder="Enter ingredients..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleAddIngredient}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.countryButton, { borderColor: theme.colors.border }]}
            onPress={() => setShowCountrySelector(true)}
          >
            <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
            <Ionicons name="chevron-down" size={16} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleAddIngredient} style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color={theme.colors.accent.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Ingredients List */}
      <ScrollView style={styles.ingredientsSection} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
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
              <Text style={[
                styles.ingredientText,
                { color: theme.colors.accent.primary },
              ]}>
                {ingredient}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveIngredient(ingredient)}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={18} color={theme.colors.accent.primary} />
              </TouchableOpacity>
            </View>
          ))}
          {ingredients.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color={theme.colors.text.secondary} />
              <Text style={[
                styles.emptyText,
                { color: theme.colors.text.secondary },
              ]}>
                Add ingredients to find amazing dishes from{" "}
                {selectedCountry.name.toLowerCase()} cuisine!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Mode Selection */}
      <View style={styles.modeSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Mode
        </Text>
        <TouchableOpacity
          style={[
            styles.modeSelector,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => setShowModeSelector(true)}
        >
          <View style={styles.selectedModeContent}>
            <Ionicons name={selectedMode.icon as any} size={20} color={selectedMode.color} />
            <Text style={[
              styles.selectedModeText,
              { color: selectedMode.color },
            ]}>
              {selectedMode.name}
            </Text>
            {selectedMode.isPro && (
              <View style={[
                styles.proBadgeSmall,
                { backgroundColor: selectedMode.color },
              ]}>
                <Text style={styles.proTextSmall}>PRO</Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-down" size={20} color={selectedMode.color} />
        </TouchableOpacity>
      </View>

      {/* Find Dishes Button */}
      <View style={styles.buttonSection}>
        <Button
          title={isLoading ? "Finding Dishes..." : "Find Dishes"}
          onPress={handleFindDishes}
          style={{
            ...styles.findButton,
            opacity: (ingredients.length > 0 && !isLoading) ? 1 : 0.5,
          }}
          disabled={ingredients.length === 0 || isLoading}
        />
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={theme.colors.accent.primary}
            style={styles.loadingIndicator}
          />
        )}
      </View>

      <ProfileMenu />
      <CountrySelector />
      <ModeSelector />
      <DeleteConfirmationModal />
    </>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    gap: 8,
  },
  userInfoSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  userDisplayName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "400",
  },
  notificationButton: {
    padding: 8,
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
    paddingBottom: 30,
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
  modeSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  selectedModeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedModeText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  proBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  proTextSmall: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  findButton: {
    width: "100%",
  },
  loadingIndicator: {
    marginTop: 10,
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
  modeSelectorModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    maxHeight: height * 0.4,
  },
  modeSelectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modeSelectorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modeList: {
    flex: 1,
  },
  modeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modeContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },
  modeName: {
    fontSize: 16,
    fontWeight: "500",
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },
  proText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  // Delete Confirmation Modal Styles
  confirmationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  confirmationModal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  confirmationContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  warningIcon: {
    marginBottom: 16,
  },
  confirmationMessage: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  confirmationSubMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  confirmationButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF4444",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});