import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Button } from "@/components/ui/Button";

interface FindDishesButtonProps {
  isLoading: boolean;
  ingredientsCount: number;
  onPress: () => void;
  theme: any;
}

export const FindDishesButton: React.FC<FindDishesButtonProps> = ({
  isLoading,
  ingredientsCount,
  onPress,
  theme,
}) => {
  return (
    <View style={styles.buttonSection}>
      <Button
        title={isLoading ? "Finding Dishes..." : "Find Dishes"}
        onPress={onPress}
        style={{
          ...styles.findButton,
          opacity: ingredientsCount > 0 && !isLoading ? 1 : 0.5,
        }}
        disabled={ingredientsCount === 0 || isLoading}
      />
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={theme.colors.accent.primary}
          style={styles.loadingIndicator}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  findButton: {
    width: "100%",
    backgroundColor: "#007AFF",
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

