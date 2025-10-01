import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../../../styles/dishCardStyles";
import { AILoadingOverlay } from "./AIOverloading";

export const DishLoadingCard = ({ dish, progress, theme }: any) => {
  return (
    <TouchableOpacity
      key={`loading-${dish.id}`}
      style={[
        styles.dishCard,
        {
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border,
        },
      ]}
      activeOpacity={0.95}
    >
      {/* Yemək şəkli əvəzinə loading overlay */}
      <View style={styles.imageSection}>
        <AILoadingOverlay progress={progress} isVisible={true} />
      </View>

      {/* Content */}
      <View style={styles.contentSection}>
        <View style={styles.nameRow}>
          <Text style={[styles.dishName, { color: theme.colors.text.primary }]}>
            {dish.name || "Loading..."}
          </Text>
        </View>
      </View>

      {/* Sağdakı action button-lar disabled */}
      <View style={styles.actionsContainer}>
        <View
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.background.primary + "60" },
          ]}
        >
          <Ionicons name="heart-outline" size={18} color={theme.colors.text.secondary} />
        </View>
        <View
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.background.primary + "60" },
          ]}
        >
          <Ionicons name="bookmark-outline" size={18} color={theme.colors.text.secondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
