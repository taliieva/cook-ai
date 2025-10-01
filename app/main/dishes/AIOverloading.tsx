import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import modernStyles from "../../../styles/modernStyles";

const gradientColors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"] as const;

export const AILoadingOverlay = ({ progress, isVisible }: { progress: number; isVisible: boolean }) => {
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 4, useNativeDriver: true }).start();

      const rotateAnimation = Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 2500, useNativeDriver: true }));
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      );

      rotateAnimation.start();
      pulseAnimation.start();
      return () => { rotateAnimation.stop(); pulseAnimation.stop(); };
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const rotation = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Animated.View style={[modernStyles.loadingOverlay, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={modernStyles.modernBlurOverlay} />
      <View style={modernStyles.modernLoadingContainer}>
        {/* Glow ring */}
        <Animated.View style={[modernStyles.glowRing, { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({ inputRange: [1, 1.15], outputRange: [0.4, 0.7] }) }]}>
          <LinearGradient colors={gradientColors} style={modernStyles.glowGradient} />
        </Animated.View>

        {/* Circle */}
        <Animated.View style={[modernStyles.modernProgressCircle, { transform: [{ rotate: rotation }] }]}>
          <LinearGradient colors={gradientColors} style={modernStyles.modernProgressGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={modernStyles.modernProgressInner}>
              <View style={modernStyles.iconContainer}><Ionicons name="restaurant" size={22} color="white" /></View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Text + Progress bar */}
        <View style={modernStyles.modernTextContainer}>
          <Text style={modernStyles.modernProgressText}>{Math.round(progress)}%</Text>
          <View style={modernStyles.modernProgressBar}>
            <View style={modernStyles.modernProgressBarBg} />
            <Animated.View style={[modernStyles.modernProgressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
