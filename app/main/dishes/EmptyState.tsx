import { styles } from "@/styles/screenStyles";
import React from "react";
import { Text, View } from "react-native";
// import styles from "./styles";

export const EmptyState = () => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        No dishes found. Try changing your ingredients.
      </Text>
    </View>
  );
};
