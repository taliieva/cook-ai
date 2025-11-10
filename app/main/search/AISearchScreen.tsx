import { ENV } from "@/config/env";
import { useTheme } from "@/hooks/useTheme";
import { clearAuthTokens, fetchWithAuth } from "@/utils/auth";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

// Hooks
import { useAuthState } from "./hooks/useAuthState";
import { useIngredientManager } from "./hooks/useIngredientManager";

// Components
import { CountrySelector } from "./components/CountrySelector";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { FindDishesButton } from "./components/FindDishesButton";
import { IngredientsList } from "./components/IngredientsList";
import { ModeSelection } from "./components/ModeSelection";
import { ModeSelector } from "./components/ModeSelector";
import { ProfileMenu } from "./components/ProfileMenu";
import { SearchHeader } from "./components/SearchHeader";
import { SearchInput } from "./components/SearchInput";

// Types
import { Country, Mode } from "./constants/searchConstants";

interface AISearchScreenProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  selectedMode: Mode;
  setSelectedMode: (mode: Mode) => void;
  onUpgrade: () => void;
}

export default function AISearchScreen({
  ingredients: externalIngredients,
  setIngredients: setExternalIngredients,
  selectedCountry: externalCountry,
  setSelectedCountry: setExternalCountry,
  selectedMode: externalMode,
  setSelectedMode: setExternalMode,
  onUpgrade,
}: AISearchScreenProps) {
  const router = useRouter();
  const theme = useTheme();

  // State management hooks
  const {
    isCheckingAuth,
    isLoggedIn,
    userPlan,
    userInfo,
    setIsLoggedIn,
    setUserInfo,
    setUserPlan,
  } = useAuthState();

  const {
    searchText,
    setSearchText,
  } = useIngredientManager(externalIngredients);

  // Local state for modals
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle ingredient operations
  const handleAddIngredient = () => {
    if (searchText.trim() && !externalIngredients.includes(searchText.trim())) {
      const newIngredients = [...externalIngredients, searchText.trim()];
      setExternalIngredients(newIngredients);
      setSearchText("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    const newIngredients = externalIngredients.filter((i) => i !== ingredient);
    setExternalIngredients(newIngredients);
  };

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setExternalCountry(country);
    setShowCountrySelector(false);
  };

  // Handle mode selection
  const handleModeSelect = (mode: Mode) => {
    if (mode.isPro && userPlan === "free") {
      setShowModeSelector(false);
      onUpgrade();
      return;
    }
    setExternalMode(mode);
    setShowModeSelector(false);
  };

  const handleFindDishes = async () => {
    if (externalIngredients.length < 4) {
      Alert.alert(
        "More Ingredients Needed",
        "Please select minimum 4 ingredients to find the best dishes."
      );
      return;
    }

    setIsLoading(true);

    try {
      const tempSearchId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log("🚀 Immediate navigation with searchId:", tempSearchId);

      router.push({
        pathname: "/main/dishes",
        params: {
          country: externalCountry.code,
          mode: externalMode.code,
          ingredients: JSON.stringify(externalIngredients),
          searchId: tempSearchId,
          isStreaming: "true",
          expectedDishCount: "3",
        },
      });

      setIsLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { streamingService } = await import(
        "../dishes/services/streamingService"
      );

      console.log("📡 Starting streaming service...");

      streamingService
        .startStreaming(
          tempSearchId,
          externalIngredients,
          externalCountry.code,
          externalMode.code
        )
        .catch((error) => {
          console.error("Streaming error:", error);
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

  const handleDeleteAccount = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");

      if (accessToken) {
        try {
          const response = await fetchWithAuth(
            `${ENV.API_URL}/auth/account`,
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

      await clearAuthTokens();

      setIsLoggedIn(false);
      setUserInfo({
        displayName: "",
        email: "",
        isGuest: true,
      });
      setUserPlan("free");

      setShowDeleteConfirmation(false);
      console.log("Account deleted successfully");

      router.push("/onboarding/welcome");
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account. Please try again.");
    }
  };

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

  return (
    <View style={{ flex: 1 }}>
      <SearchHeader
        onNotificationPress={() => Alert.alert("Coming soon")}
        onProfilePress={() => setShowProfileMenu(true)}
        theme={theme}
      />

      <SearchInput
        searchText={searchText}
        onChangeText={setSearchText}
        onSubmit={handleAddIngredient}
        onAddIngredient={handleAddIngredient}
        selectedCountry={externalCountry}
        onCountryPress={() => setShowCountrySelector(true)}
        theme={theme}
      />

      <IngredientsList
        ingredients={externalIngredients}
        selectedCountry={externalCountry}
        onRemoveIngredient={handleRemoveIngredient}
        theme={theme}
      />

      <ModeSelection
        selectedMode={externalMode}
        onModePress={() => setShowModeSelector(true)}
        theme={theme}
      />

      <FindDishesButton
        isLoading={isLoading}
        ingredientsCount={externalIngredients.length}
        onPress={handleFindDishes}
        theme={theme}
      />

      {/* Modals - Rendered at component root level */}
      <ProfileMenu
        visible={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        onUpgrade={onUpgrade}
        onDeleteAccount={() => setShowDeleteConfirmation(true)}
        theme={theme}
      />

      <CountrySelector
        visible={showCountrySelector}
        selectedCountry={externalCountry}
        onSelect={handleCountrySelect}
        onClose={() => setShowCountrySelector(false)}
        theme={theme}
      />

      <ModeSelector
        visible={showModeSelector}
        selectedMode={externalMode}
        userPlan={userPlan}
        onSelect={handleModeSelect}
        onClose={() => setShowModeSelector(false)}
        theme={theme}
      />

      <DeleteConfirmationModal
        visible={showDeleteConfirmation}
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteAccount}
        theme={theme}
      />
    </View>
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
});

