import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { dishDetailStyles } from "../styles/dishDetailStyles";

type Props = {
    hasVideo: boolean;
    onPress: () => void;
};

export const StartCookingButton: React.FC<Props> = ({ hasVideo, onPress }) => {
    const theme = useTheme();

    return (
        <View style={dishDetailStyles.buttonContainer}>
            <TouchableOpacity
                style={dishDetailStyles.startCookingButton}
                onPress={onPress}
            >
                <LinearGradient
                    colors={[
                        theme.colors.accent.gradientStart,
                        theme.colors.accent.gradientEnd,
                    ]}
                    style={dishDetailStyles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Ionicons name="play-circle-outline" size={24} color="#FFFFFF" />
                    <Text style={dishDetailStyles.buttonText}>
                        {hasVideo ? "Watch Video Tutorial" : "Start Cooking"}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};