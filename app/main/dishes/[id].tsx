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
  const handleBack = () => {
    router.back();
  };

  console.log("searchid on details page", searchId);

  const handleStartCooking = async () => {
    if (dishData?.videoURL) {
      try {
        const supported = await Linking.canOpenURL(dishData.videoURL);
        if (supported) {
          await Linking.openURL(dishData.videoURL);
        } else {
          console.log("Cannot open URL:", dishData.videoURL);
          Alert.alert("Error", "Unable to open video");
        }
      } catch (error) {
        console.error("Error opening video:", error);
        Alert.alert("Error", "Failed to open video");
      }
    } else {
      Alert.alert("No Video", "Video tutorial not available for this recipe");
    }
  };

  console.log("dishdata: ", dishData);

  const handleToggleFavorite = async () => {
    if (!dishData || !searchId) return;

    const id =
      typeof searchId === "string"
        ? searchId
        : Array.isArray(searchId)
        ? searchId[0]
        : null;

    if (!id) return;

    setIsFavorite((prev) => !prev);

    try {
      const res = await likeRecipe(id, dishData.name);
      if (res.success) {
        console.log("✅", res.data?.message);
      } else {
        Alert.alert("Error", res.error || "Failed to like recipe");
        setIsFavorite((prev) => !prev);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
      setIsFavorite((prev) => !prev);
    }
  };

  // const handleToggleFavorite = () => {
  //     setIsFavorite(!isFavorite);
  //     console.log(
  //         `${isFavorite ? "Removed from" : "Added to"} favorites:`,
  //         dishData?.name
  //     );
  // };

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
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

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
          <BlurView
            intensity={40}
            tint="dark"
            style={dishDetailStyles.blurView}
          />
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
