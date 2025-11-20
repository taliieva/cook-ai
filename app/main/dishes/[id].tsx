import { useTheme } from "@/hooks/useTheme";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { DetailHeader } from "./components/DetailHeader";
import { DishInfoSection } from "./components/DishInfoSection";
import { IngredientsSection } from "./components/IngredientsSection";
import { InstructionsSection } from "./components/InstructionsSection";
import { StartCookingButton } from "./components/StartCookingButton";
import { useDishData } from "./hooks/useDishData";
import { useLikeRecipe } from "./hooks/useLikeRecipes";
import { dishDetailStyles } from "./styles/dishDetailStyles";

export default function DishDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { dishData, ingredients, searchId } = useDishData();
  const [isFavorite, setIsFavorite] = useState(false);
  const { likeRecipe, loading } = useLikeRecipe();

  const handleBack = () => router.back();

  const handleStartCooking = async () => {
    if (!dishData?.videoURL) {
      return Alert.alert("No Video", "Video tutorial not available for this recipe");
    }

    try {
      const supported = await Linking.canOpenURL(dishData.videoURL);
      if (supported) {
        await Linking.openURL(dishData.videoURL);
      } else {
        Alert.alert("Error", "Unable to open video");
      }
    } catch (error) {
      console.error("Error opening video:", error);
      Alert.alert("Error", "Failed to open video");
    }
  };

  // ✅ Fixed: Use searchId from params, not dish.id
  const handleToggleFavorite = async () => {
    if (!searchId || !dishData?.name) {
      console.error("Missing searchId or dish name");
      Alert.alert("Error", "Unable to like recipe. Please try again.");
      return;
    }

    console.log('Liking recipe:', { searchId, dishName: dishData.name });

    // Optimistic UI
    setIsFavorite((prev) => !prev);

    try {
      const res = await likeRecipe(searchId as string, dishData.name);
      
      if (res.success) {
        console.log("✅ Recipe liked:", res.data?.message);
      } else {
        throw new Error(res.error || "Failed to like recipe");
      }
    } catch (err: any) {
      console.error("Like error:", err);
      
      // Revert optimistic UI update
      setIsFavorite((prev) => !prev);

      // Show user-friendly error message
      const errorMessage = err.message || "Failed to like recipe";
      
      if (errorMessage.includes("Free users can only like")) {
        // Premium upgrade prompt - Show RevenueCat paywall
        Alert.alert(
          "Upgrade to Premium",
          "You've reached your free plan limit. Upgrade to Premium to like unlimited recipes!",
          [
            { text: "Not Now", style: "cancel" },
            { 
              text: "Upgrade", 
              onPress: async () => {
                console.log("🔓 Opening RevenueCat paywall from like limit (detail)");
                const { showPaywall } = await import('@/utils/subscriptions');
                await showPaywall();
              },
              style: "default"
            }
          ]
        );
      } else {
        // Generic error
        Alert.alert("Error", errorMessage);
      }
    }
  };

  if (!dishData) {
    return (
      <View
        style={[
          dishDetailStyles.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <SafeAreaView style={dishDetailStyles.loadingContainer}>
          <Text
            style={[
              dishDetailStyles.loadingText,
              { color: theme.colors.text.primary },
            ]}
          >
            Loading dish details...
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={dishDetailStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={{ uri: dishData.image }}
        style={dishDetailStyles.backgroundImage}
        resizeMode="cover"
      >
        <MaskedView
          style={dishDetailStyles.maskedBlur}
          maskElement={
            <LinearGradient
              colors={["transparent", "black", "black"]}
              style={dishDetailStyles.mask}
              locations={[0, 0.3, 1]}
            />
          }
        >
          <BlurView intensity={40} tint="dark" style={dishDetailStyles.blurView} />
        </MaskedView>

        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          style={dishDetailStyles.darkOverlay}
          locations={[0, 0.5, 1]}
        />

        <SafeAreaView style={dishDetailStyles.contentContainer}>
          <DetailHeader
            onBack={handleBack}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            disabled={loading}
          />

          <ScrollView
            style={dishDetailStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={dishDetailStyles.scrollContainer}
          >
            <DishInfoSection
              culture={dishData.culture}
              dishName={dishData.name}
              dishType={dishData.dishType}
              calories={dishData.calories}
              outdoorCost={dishData.outdoorCost}
              homeCost={dishData.homeCost}
              moneySaved={dishData.moneySaved}
              shortDescription={dishData.shortDescription}
            />

            <IngredientsSection ingredients={ingredients} />

            <InstructionsSection steps={dishData.steps} />

            <StartCookingButton
              hasVideo={!!dishData.videoURL}
              onPress={handleStartCooking}
            />

            <View style={dishDetailStyles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

