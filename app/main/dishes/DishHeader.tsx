import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DishesHeaderProps {
  title: string;
  isLoading: boolean;
  onBack: () => void;
  theme: any;
}

export const DishesHeader: React.FC<DishesHeaderProps> = ({
  title,
  isLoading,
  onBack,
  theme
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={onBack}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={theme.colors.text.primary}
        />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          {isLoading ? "AI Discovering..." : title || "Found Dishes"}
        </Text>
        {isLoading && (
          <View style={styles.aiHeaderIndicator}>
            <Ionicons name="sparkles" size={16} color="#667eea" />
            <Text style={[styles.aiHeaderText, { color: "#667eea" }]}>
              Powered by AI
            </Text>
          </View>
        )}
      </View>

      <View style={styles.headerSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  aiHeaderIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  aiHeaderText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  headerSpacer: {
    width: 44,
  },
});