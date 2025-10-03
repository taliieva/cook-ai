import { styles } from "@/styles/screenStyles";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { AILoadingOverlay } from "../AIOverlayLoading";
import { DishCard } from "../DishCard";
import { EmptyState } from "../EmptyState";
import { Header } from "../Header";
import { SummaryText } from "../SummaryText";

export const DishesScreen = () => {
  const [loading, setLoading] = useState(false);

  // ✅ Get params from router.push
  const { searchId, dishData, country, mode, ingredients } =
    useLocalSearchParams<{
      searchId?: string;
      dishData?: string;
      country?: string;
      mode?: string;
      ingredients?: string;
    }>();

  // Parse dishData if needed
  const parsedDishData = dishData ? JSON.parse(dishData) : null;

  return (
    <View style={styles.container}>
      <Header title="Your Dishes" onBack={() => {}} isAIActive={loading} />

      {loading && <AILoadingOverlay progress={40} />}

      <ScrollView contentContainerStyle={styles.dishesContent}>
        <SummaryText
          text="AI summary about your dishes..."
          onReadMore={() => {}}
        />

        <DishCard
          name="Plov"
          image="https://picsum.photos/200"
          calories={450}
          homeCost="3₼"
          outdoorCost="8₼"
          searchId={searchId || ""}
        />

        <EmptyState />
      </ScrollView>
    </View>
  );
};
