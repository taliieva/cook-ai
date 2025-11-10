import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchHeaderProps {
  onNotificationPress: () => void;
  onProfilePress: () => void;
  theme: any;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  onNotificationPress,
  onProfilePress,
  theme,
}) => {
  return (
    <View style={styles.profileSection}>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
      >
        <Ionicons
          name="notifications-outline"
          size={28}
          color={theme.colors.text.primary}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
        <Ionicons
          name="person-circle-outline"
          size={28}
          color={theme.colors.text.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    gap: 8,
  },
  notificationButton: {
    padding: 8,
  },
  profileButton: {
    padding: 8,
  },
});

