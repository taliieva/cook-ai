import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { validateAuthState, clearAuthTokens } from "@/utils/auth";
import { ENV } from "@/config/env";

interface ProfileMenuProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  onDeleteAccount: () => void;
  theme: any;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  visible,
  onClose,
  onUpgrade,
  onDeleteAccount,
  theme,
}) => {
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

    if (visible) {
      loadUser();
    }
  }, [visible]);

  const handleLogout = async () => {
    try {
      console.log("🔓 Logging out user...");
      
      // Clear all auth tokens and data
      await clearAuthTokens();
      
      // Update local state
      setIsLoggedIn(false);
      setIsGuest(false);
      setUserInfo({ email: "", displayName: "" });
      setUserPlan("free");
      
      // Close the modal
      onClose();
      
      // Use replace to prevent back navigation to protected screens
      // This clears the navigation stack and prevents swipe-back
      console.log("✅ Redirecting to welcome screen (clearing navigation stack)");
      router.replace("/onboarding/welcome");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still try to redirect even on error
      router.replace("/onboarding/welcome");
    }
  };

  const handleProfileMenuOption = async (option: string) => {
    onClose();
    switch (option) {
      case "login":
        router.push("/auth/sign-in");
        break;
      case "privacy":
        try {
          await Linking.openURL(ENV.PRIVACY_POLICY_URL);
        } catch (error) {
          console.error("Error opening privacy policy:", error);
          Alert.alert("Error", "Unable to open privacy policy");
        }
        break;
      case "terms":
        try {
          await Linking.openURL(ENV.TERMS_URL);
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
        onDeleteAccount();
        break;
    }
  };

  if (!authChecked) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
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

const styles = StyleSheet.create({
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
});
