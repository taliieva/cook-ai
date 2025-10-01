import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../../../styles/dishCardStyles";

export const DishCard = ({ dish, onPress, onLike, onSave, getCountryBackgroundColor, theme }: any) => {
  const truncateName = (name: string, maxLength = 16) => name?.length > maxLength ? name.substring(0, maxLength) + "..." : name;

  return (
    <TouchableOpacity
      key={`completed-${dish.id}`}
      style={[styles.dishCard, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border }]}
      onPress={() => onPress(dish)}
      activeOpacity={0.95}
    >
      <View style={styles.imageSection}>
        <Image source={{ uri: dish.image }} style={styles.dishImage} resizeMode="cover" />
      </View>

      <View style={styles.contentSection}>
        <View style={styles.nameRow}><Text style={[styles.dishName, { color: theme.colors.text.primary }]}>{truncateName(dish.name)}</Text></View>
        {/* Calories + Costs */}
        {/* Metadata */}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: dish.isLiked ? "#FF6B6B20" : theme.colors.background.primary + "90" }]} onPress={() => onLike(dish.id)}>
          <Ionicons name={dish.isLiked ? "heart" : "heart-outline"} size={18} color={dish.isLiked ? "#FF6B6B" : theme.colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: dish.isSaved ? theme.colors.accent.primary + "20" : theme.colors.background.primary + "90" }]} onPress={() => onSave(dish.id)}>
          <Ionicons name={dish.isSaved ? "bookmark" : "bookmark-outline"} size={18} color={dish.isSaved ? theme.colors.accent.primary : theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
