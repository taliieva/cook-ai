import { styles } from "@/styles/screenStyles";
import { fetchWithAuth, isGuestUser, validateAuthState } from "@/utils/auth"; // ✅ auth faylını import elə
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

type DishCardProps = {
  name: string;
  image: string;
  calories: number;
  homeCost: string;
  outdoorCost: string;
  searchId: string;
};

export const DishCard: React.FC<DishCardProps> = ({
  name,
  image,
  calories,
  homeCost,
  outdoorCost,
  searchId,
}) => {
  const [saved, setSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  // ✅ Component mount zamanı user statusunu yoxla
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await validateAuthState();
      const guest = await isGuestUser();
      setIsLoggedIn(auth.isValid);
      setIsGuest(guest);
    };
    checkAuth();
  }, []);

  const handleSave = async () => {
    console.log("isGuest", isGuest);
    console.log("isLoggedIn", isLoggedIn);
    if (!isLoggedIn || isGuest) {
      Alert.alert("Login Required", "Please login to save recipes.");
      return;
    }

    try {
      const response = await fetchWithAuth(
        "https://cook-ai-backend-production.up.railway.app/v1/recipes/save",
        {
          method: "POST",
          body: JSON.stringify({
            searchId,
            dishName: name,
          }),
        }
      );

      const data = await response.json();
      console.log("save response", data);
      if (data.success) {
        setSaved(true);
        Alert.alert("Saved!", `${name} has been added to your recipes.`);
      } else {
        Alert.alert("Error", "Something went wrong, please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save recipe.");
    }
  };

  const handleLike = () => {
    if (!isLoggedIn || isGuest) {
      Alert.alert("Login Required", "Please login to like recipes.");
      return;
    }
    Alert.alert("Liked!", `${name} has been liked.`);
  };

  return (
    <View style={styles.dishCard}>
      <View style={styles.imageSection}>
        <Image source={{ uri: image }} style={styles.dishImage} />
      </View>

      <View style={styles.contentSection}>
        <View style={styles.nameRow}>
          <Text style={styles.dishName}>{name}</Text>
        </View>

        <View style={styles.calorieRow}>
          <View style={styles.calorieChip}>
            <Ionicons name="flame" size={14} color="#3498db" />
            <Text style={styles.calorieText}>{calories} kcal</Text>
          </View>
        </View>

        <View style={styles.costContainer}>
          <View style={styles.outdoorCost}>
            <Ionicons name="cash-outline" size={14} color="#FF6B6B" />
            <Text style={styles.outdoorCostText}>{outdoorCost}</Text>
          </View>
          <View style={styles.costSeparator} />
          <View style={styles.homeCost}>
            <Ionicons name="home-outline" size={14} color="#4ECDC4" />
            <Text style={styles.homeCostText}>{homeCost}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {/* Save button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={16}
            color={saved ? "red" : "black"}
          />
        </TouchableOpacity>

        {/* Like button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons name="share-outline" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
