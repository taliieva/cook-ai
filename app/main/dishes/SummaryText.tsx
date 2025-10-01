import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const SummaryText = ({ text, isExpanded, setIsExpanded, theme }: any) => {
  if (!text) return null;
  const words = text.split(" ");
  const maxWords = 20;
  const shouldTruncate = words.length > maxWords;
  const displayText = isExpanded ? text : words.slice(0, maxWords).join(" ");

  return (
    <View>
      <Text style={{ color: theme.colors.text.secondary }}>{displayText}{!isExpanded && shouldTruncate && "..."}</Text>
      {shouldTruncate && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={{ color: theme.colors.accent.primary }}>{isExpanded ? "Read less" : "Read more"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
