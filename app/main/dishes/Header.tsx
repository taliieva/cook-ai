import { styles } from "@/styles/screenStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
// import styles from "./styles";

type HeaderProps = {
  title: string;
  onBack: () => void;
  isAIActive?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ title, onBack, isAIActive }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {isAIActive && (
          <View style={styles.aiHeaderIndicator}>
            <Ionicons name="sparkles" size={14} color="#764ba2" />
            <Text style={styles.aiHeaderText}>AI Mode</Text>
          </View>
        )}
      </View>

      <View style={styles.headerSpacer} />
    </View>
  );
};
