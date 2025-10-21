import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { dishDetailStyles } from "../styles/dishDetailStyles";

type Props = {
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export const DetailHeader: React.FC<Props> = ({
  onBack,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <View style={dishDetailStyles.header}>
      <TouchableOpacity style={dishDetailStyles.headerButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={dishDetailStyles.headerButton}
        onPress={onToggleFavorite}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "#FF3366" : "#FFFFFF"}
        />
      </TouchableOpacity>
    </View>
  );
};
