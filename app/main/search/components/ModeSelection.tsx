import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Mode } from "../constants/searchConstants";

interface ModeSelectionProps {
  selectedMode: Mode;
  onModePress: () => void;
  theme: any;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  selectedMode,
  onModePress,
  theme,
}) => {
  return (
    <View style={styles.modeSection}>
      <Text
        style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
      >
        Mode
      </Text>
      <TouchableOpacity
        style={[
          styles.modeSelector,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={onModePress}
      >
        <View style={styles.selectedModeContent}>
          <Ionicons
            name={selectedMode.icon as any}
            size={20}
            color={selectedMode.color}
          />
          <Text
            style={[styles.selectedModeText, { color: selectedMode.color }]}
          >
            {selectedMode.name}
          </Text>
          {selectedMode.isPro && (
            <View
              style={[
                styles.proBadgeSmall,
                { backgroundColor: selectedMode.color },
              ]}
            >
              <Text style={styles.proTextSmall}>PRO</Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color={selectedMode.color} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modeSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  modeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  selectedModeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedModeText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  proBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  proTextSmall: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
});

