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
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Added these imports:
import {
  clearAuthTokens,
  fetchWithAuth,
  validateAuthState,
} from "../../../utils/auth";
const { width, height } = Dimensions.get("window");

// Mock countries data with flags
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

// Modes data with icons and colors
const modes = [
  {
    name: "Standard",
    icon: "restaurant-outline",
    code: "standard",
    isPro: false,
    color: "#FF8C00",
  },
  {
    name: "Gym",
    icon: "fitness-outline",
    code: "gym",
    isPro: false,
    color: "#FF4444",
  },
  {
    name: "Diet",
    icon: "leaf-outline",
    code: "diet",
    isPro: false,
    color: "#4CAF50",
  },
  {
    name: "Vegan",
    icon: "flower-outline",
    code: "vegan",
    isPro: true,
    color: "#8BC34A",
  },
  {
    name: "Vegetarian",
    icon: "nutrition-outline",
    code: "vegetarian",
    isPro: true,
    color: "#4CAF50",
  },
];

// Helper function to get mode color with transparency
const getModeColor = (mode: any, opacity: number = 1) => {
  return opacity === 1
    ? mode.color
    : mode.color +
        Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0");
};

// Country code to country name mapping for API
const getCountryNameForAPI = (countryCode: string): string => {
  const countryMap: { [key: string]: string } = {
    all: "All Countries",
    az: "Azərbaycan",
    tr: "Türkiye",
    it: "Italy",
    cn: "China",
    mx: "Mexico",
    jp: "Japan",
    fr: "France",
    in: "India",
    us: "United States",
    th: "Thailand",
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
  onUpgrade,
}: any) {
  const router = useRouter();
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Added new state variable:
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Dynamic auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [userInfo, setUserInfo] = useState({
    displayName: "",
    email: "",
    isGuest: true,
  });

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      console.log("🔍 Checking authentication status...");

      // Use the comprehensive validation from utils/auth.ts
      const authResult = await validateAuthState();

      console.log("Auth validation result:", authResult);

      if (authResult.isValid && authResult.userData) {
        // User is properly authenticated
        setIsLoggedIn(true);
        setUserInfo({
          displayName:
            authResult.userData.displayName ||
            authResult.userData.email ||
            "User",
          email: authResult.userData.email,
          isGuest: authResult.userData.isGuest,
        });

        // Set the user plan based on the subscription status from userData
        setUserPlan(authResult.userData.subscriptionStatus || "free");

        console.log("✅ User is authenticated:", {
          displayName: authResult.userData.displayName,
          email: authResult.userData.email,
          isGuest: authResult.userData.isGuest,
          plan: authResult.userData.subscriptionStatus,
        });
      } else {
        // User is not authenticated or validation failed
        setIsLoggedIn(false);
        setUserInfo({
          displayName: "",
          email: "",
          isGuest: true,
        });
        setUserPlan("free");

        console.log("❌ User is not authenticated");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);

      // Fallback to guest state on error
      setIsLoggedIn(false);
      setUserInfo({
        displayName: "",
        email: "",
        isGuest: true,
      });
      setUserPlan("free");
    } finally {
      setIsCheckingAuth(false);
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

  // Add a function to refresh auth status (useful for when user logs in from another screen)
  const refreshAuthStatus = async () => {
    await checkAuthStatus();
  };
  const handleFindDishes = async () => {
    if (ingredients.length < 4) {
      Alert.alert(
        "More Ingredients Needed",
        "Please select minimum 4 ingredients to find the best dishes."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Generate temporary searchId for immediate navigation
      const tempSearchId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log("🚀 Immediate navigation with searchId:", tempSearchId);

      // ✨ NAVIGATE IMMEDIATELY (don't wait for API response)
      router.push({
        pathname: "/main/dishes",
        params: {
          country: selectedCountry.code,
          mode: selectedMode.code,
          ingredients: JSON.stringify(ingredients),
          searchId: tempSearchId,
          isStreaming: "true", // Flag to indicate streaming mode
          expectedDishCount: "3", // Show 3 placeholder cards initially
        },
      });

      // Reset loading state immediately since we've navigated
      setIsLoading(false);

      // ⏱️ WAIT 100ms for dishes screen to mount and set up listeners
      await new Promise(resolve => setTimeout(resolve, 100));

      // Import streaming service dynamically
      const { streamingService } = await import('../dishes/services/streamingService');

      console.log("📡 Starting streaming service...");

      // Start streaming in background (don't await - let it run asynchronously)
      streamingService.startStreaming(
        tempSearchId,
        ingredients,
        selectedCountry.code,
        selectedMode.code
      ).catch((error) => {
        console.error("Streaming error:", error);
        // Error will be handled by the streaming service events
      });

    } catch (error) {
      console.error("Error initiating dish search:", error);
      setIsLoading(false);
      Alert.alert(
        "Error",
        "Failed to start dish search. Please check your internet connection and try again."
      );
    }
  };

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text
          style={[styles.loadingText, { color: theme.colors.text.secondary }]}
        >
          Checking authentication...
        </Text>
      </View>
    );
  }

  const handleProfileMenuOption = async (option: any) => {
    setShowProfileMenu(false);
    switch (option) {
      case "login":
        router.push("/auth/sign-in");
        break;
      case "privacy":
        try {
          await Linking.openURL("https://thecookai.app/privacy");
        } catch (error) {
          console.error("Error opening privacy policy:", error);
          Alert.alert("Error", "Unable to open privacy policy");
        }
        break;
      case "terms":
        try {
          await Linking.openURL("https://thecookai.app/terms");
        } catch (error) {
          console.error("Error opening terms:", error);
          Alert.alert("Error", "Unable to open terms of use");
        }
        break;
      case "liked":
        router.push({
          pathname: "/main/recipes/LikedRecipes",
          params: { standalone: "true" },
        });
        break;
      case "saved":
        router.push("/main/recipes/SavedRecipes");
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
      // Get the access token before clearing it
      const accessToken = await SecureStore.getItemAsync("accessToken");

      // Call the signout endpoint if we have a token
      if (accessToken) {
        try {
          const response = await fetchWithAuth(
            "https://cook-ai-backend-production.up.railway.app/v1/auth/signout",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("Signout response status:", response.status);
        } catch (apiError) {
          console.error("Error calling signout API:", apiError);
        }
      }

      // Use the auth utility to clear tokens
      await clearAuthTokens();

      // Update local state
      setIsLoggedIn(false);
      setUserInfo({
        displayName: "",
        email: "",
        isGuest: true,
      });
      setUserPlan("free");

      console.log("User logged out successfully");

      // Navigate to onboarding welcome page
      router.push("/onboarding/welcome");
    } catch (error) {
      console.error("Error during logout:", error);

      // Fallback: force clear local state even if API calls fail
      setIsLoggedIn(false);
      setUserInfo({
        displayName: "",
        email: "",
        isGuest: true,
      });
      setUserPlan("free");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");

      if (accessToken) {
        try {
          const response = await fetchWithAuth(
            "https://cook-ai-backend-production.up.railway.app/v1/auth/account",
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("Delete account response status:", response.status);

          if (!response.ok) {
            throw new Error(
              `Account deletion failed with status: ${response.status}`
            );
          }
        } catch (apiError) {
          console.error("Error calling delete account API:", apiError);
          Alert.alert("Error", "Failed to delete account. Please try again.");
          return;
        }
      }

      // Use the auth utility to clear tokens
      await clearAuthTokens();

      // Update local state
      setIsLoggedIn(false);
      setUserInfo({
        displayName: "",
        email: "",
        isGuest: true,
      });
      setUserPlan("free");

      setShowDeleteConfirmation(false);
      console.log("Account deleted successfully");

      // Navigate to onboarding welcome page
      router.push("/onboarding/welcome");
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
        <View
          style={[
            styles.confirmationModal,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.confirmationHeader}>
            <Text
              style={[
                styles.confirmationTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Delete Account
            </Text>
            <TouchableOpacity onPress={handleCancelDelete}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.confirmationContent}>
            <Ionicons
              name="warning-outline"
              size={48}
              color="#FF4444"
              style={styles.warningIcon}
            />
            <Text
              style={[
                styles.confirmationMessage,
                { color: theme.colors.text.primary },
              ]}
            >
              Are you sure?
            </Text>
            <Text
              style={[
                styles.confirmationSubMessage,
                { color: theme.colors.text.secondary },
              ]}
            >
              This action cannot be undone and all your data will be permanently
              lost.
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
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: theme.colors.text.primary },
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Yes, Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const ProfileMenu = ({
    showProfileMenu,
    setShowProfileMenu,
    theme,
    onUpgrade,
    setShowDeleteConfirmation,
  }: any) => {
    const router = useRouter();

    const [authChecked, setAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [userInfo, setUserInfo] = useState<{
      email: string;
      displayName: string;
    }>({
      email: "",
      displayName: "",
    });
    const [userPlan, setUserPlan] = useState<"free" | "pro">("free");

    useEffect(() => {
      const loadUser = async () => {
        const result = await validateAuthState();
        if (result.isValid && result.userData) {
          setIsLoggedIn(true);
          setIsGuest(result.userData.isGuest);
          setUserInfo({
            email: result.userData.email,
            displayName: result.userData.displayName,
          });
          setUserPlan(
            result.userData.subscriptionStatus === "pro" ? "pro" : "free"
          );
        } else {
          setIsLoggedIn(false);
          setIsGuest(false);
          setUserInfo({ email: "", displayName: "" });
          setUserPlan("free");
        }
        setAuthChecked(true);
      };

      if (showProfileMenu) {
        loadUser();
      }
    }, [showProfileMenu]);

    const handleLogout = async () => {
      await clearAuthTokens();
      setIsLoggedIn(false);
      setUserInfo({ email: "", displayName: "" });
      setShowProfileMenu(false);
      router.push("/auth/sign-in");
    };

    const handleProfileMenuOption = async (option: string) => {
      setShowProfileMenu(false);
      switch (option) {
        case "login":
          router.push("/auth/sign-in");
          break;
        case "privacy":
          try {
            await Linking.openURL("https://thecookai.app/privacy");
          } catch (error) {
            console.error("Error opening privacy policy:", error);
            Alert.alert("Error", "Unable to open privacy policy");
          }
          break;
        case "terms":
          try {
            await Linking.openURL("https://thecookai.app/terms");
          } catch (error) {
            console.error("Error opening terms:", error);
            Alert.alert("Error", "Unable to open terms of use");
          }
          break;
        case "liked":
          router.push({
            pathname: "/main/recipes/LikedRecipes",
            params: { standalone: "true" },
          });
          break;
        case "saved":
          router.push("/main/recipes/SavedRecipes");
          break;
        case "upgrade":
          onUpgrade?.();
          break;
        case "logout":
          handleLogout();
          break;
        case "delete":
          setShowDeleteConfirmation(true);
          break;
      }
    };

    if (!authChecked) return null; // don’t render until checked

    return (
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
            {/* Guest / Not logged in → Show only Login */}
            {!isLoggedIn || isGuest ? (
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
                  style={[
                    styles.menuText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Log in
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                {/* User info */}
                <View style={styles.userInfoSection}>
                  <Text
                    style={[
                      styles.userDisplayName,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {userInfo.displayName}
                  </Text>
                  <Text
                    style={[
                      styles.userEmail,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {userInfo.email}
                  </Text>
                </View>

                {/* Subscription plan */}
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

                {/* Menu options */}
                <View
                  style={[
                    styles.menuDivider,
                    { backgroundColor: theme.colors.border },
                  ]}
                />

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

                <View
                  style={[
                    styles.menuDivider,
                    { backgroundColor: theme.colors.border },
                  ]}
                />

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleProfileMenuOption("logout")}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={theme.colors.text.primary}
                  />
                  <Text
                    style={[
                      styles.menuText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Log out
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleProfileMenuOption("delete")}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF4444" />
                  <Text style={[styles.menuText, { color: "#FF4444" }]}>
                    Delete account
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

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
        <View
          style={[
            styles.modeSelectorModal,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.modeSelectorHeader}>
            <Text
              style={[
                styles.modeSelectorTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Select Mode
            </Text>
            <TouchableOpacity onPress={() => setShowModeSelector(false)}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.primary}
              />
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
                  <Ionicons
                    name={mode.icon as any}
                    size={24}
                    color={mode.color}
                  />
                  <View style={styles.modeContent}>
                    <Text style={[styles.modeName, { color: mode.color }]}>
                      {mode.name}
                    </Text>
                    {mode.isPro && (
                      <View
                        style={[
                          styles.proBadge,
                          { backgroundColor: mode.color },
                        ]}
                      >
                        <Text style={styles.proText}>PRO</Text>
                      </View>
                    )}
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={mode.color} />
                  )}
                  {isDisabled && (
                    <Ionicons
                      name="lock-closed"
                      size={16}
                      color={theme.colors.text.secondary}
                    />
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
          onPress={() => alert("Coming soon")}
        >
          <Ionicons
            name="notifications-outline"
            size={28}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
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
          {ingredients.map((ingredient: string, index: number) => (
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
      {/* Mode Selection */}
      <View style={styles.modeSection}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
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
            <Ionicons
              name={selectedMode.icon as any}
              size={20}
              color={selectedMode.color}
            />
            <Text
              style={[styles.selectedModeText, { color: selectedMode.color }]}
            >
              {selectedMode.name}
            </Text>
            {selectedMode.isPro && (
              <View
                style={[
                  styles.proBadgeSmall,
                  { backgroundColor: selectedMode.color },
                ]}
              >
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
            opacity: ingredients.length > 0 && !isLoading ? 1 : 0.5,
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
      <ProfileMenu
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        theme={theme}
        onUpgrade={onUpgrade} // make sure this is defined in your parent component
        setShowDeleteConfirmation={setShowDeleteConfirmation}
      />
      <CountrySelector />
      <ModeSelector />
      <DeleteConfirmationModal />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 15,
    textAlign: "center",
  },
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
    backgroundColor: "#007AFF",
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
