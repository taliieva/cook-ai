import { modernStyles } from "@/styles/modernStyles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
// import { modernStyles } from "./styles";

type Props = {
  progress: number;
};

export const AILoadingOverlay: React.FC<Props> = ({ progress }) => {
  return (
    <View style={modernStyles.loadingOverlay}>
      <View style={modernStyles.modernBlurOverlay} />

      <View style={modernStyles.modernLoadingContainer}>
        <View style={modernStyles.glowRing}>
          <LinearGradient
            colors={["#0598CE", "#113768"]}
            style={modernStyles.glowGradient}
          />
        </View>

        <View style={modernStyles.modernProgressCircle}>
          <LinearGradient
            colors={["#0598CE", "#113768"]}
            style={modernStyles.modernProgressGradient}
          >
            <View style={modernStyles.modernProgressInner}>
              <Ionicons
                name="sparkles"
                size={24}
                color="#0598CE"
                style={modernStyles.iconContainer}
              />
              <Text style={modernStyles.modernProgressText}>{progress}%</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={modernStyles.modernTextContainer}>
          <Text style={modernStyles.modernStatusText}>AI is crafting</Text>
        </View>
      </View>
    </View>
  );
};
