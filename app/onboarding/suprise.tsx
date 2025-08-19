import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Svg, {
    Circle,
    Defs,
    LinearGradient,
    Path,
    Stop,
    Text as SvgText,
} from "react-native-svg";
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const WHEEL_SIZE = Math.min(SCREEN_W, SCREEN_H) * 0.68; // responsive
const RADIUS = WHEEL_SIZE / 2;
const CENTER = RADIUS;
const SLICE_COUNT = 8;
const SLICE_ANGLE = 360 / SLICE_COUNT;
// Original sections, but we’ll style via theme (blue-tech)
const sections = [
  { percentage: "10%" },
  { percentage: "20%" },
  { percentage: "5%" },
  { percentage: "50%" }, // winner
  { percentage: "15%" },
  { percentage: "30%" },
  { percentage: "25%" },
  { percentage: "35%" },
];
// helper: polar -> cartesian
const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) => {
  const angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
};
// path arc for slice
const createSlicePath = (
  startAngle: number,
  endAngle: number,
  radius: number
) => {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const start = polarToCartesian(CENTER, CENTER, radius, startAngle);
  const end = polarToCartesian(CENTER, CENTER, radius, endAngle);
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
};
export default function SurpriseScreen() {
  const router = useRouter();
  const theme = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(true);
  const [showResult, setShowResult] = useState(false);
  // Colors from your theme (no edits to color ts)
  const bgPrimary = theme.colors.background.primary;
  const textPrimary = theme.isDark
    ? theme.colors.text.secondary
    : theme.colors.text.primary;
  const accent = theme.colors.accent.primary;
  const gradientStart =
    theme.colors.accent.gradientStart || theme.colors.accent.primary;
  const gradientEnd =
    theme.colors.accent.gradientEnd || theme.colors.accent.primary;
  const borderColor = theme.colors.border;
  // Build blue-tech palette for slices using your brand blues (fallbacks to accent)
  //   const sliceFills = useMemo(() => {
  //     const brand = [
  //       theme.colors.base?.blue900 || accent,
  //       theme.colors.base?.blue800 || accent,
  //       theme.colors.base?.blue700 || accent,
  //       theme.colors.base?.blue600 || accent,
  //       theme.colors.base?.blue500 || accent,
  //       theme.colors.base?.blue400 || accent,
  //       theme.colors.base?.blue300 || accent,
  //       theme.colors.base?.blue200 || accent,
  //     ];
  //     return brand.slice(0, SLICE_COUNT);
  //   }, [theme, accent]);
  // Precompute labels and paths for performance
  const slices = useMemo(() => {
    return sections.map((s, index) => {
      const startAngle = index * SLICE_ANGLE - SLICE_ANGLE / 2;
      const endAngle = startAngle + SLICE_ANGLE;
      const middleAngle = startAngle + SLICE_ANGLE / 2;
      const path = createSlicePath(startAngle, endAngle, RADIUS * 0.86);
      const labelPoint = polarToCartesian(
        CENTER,
        CENTER,
        RADIUS * 0.62,
        middleAngle
      );
      return {
        ...s,
        index,
        startAngle,
        endAngle,
        middleAngle,
        path,
        labelX: labelPoint.x,
        labelY: labelPoint.y,
      };
    });
  }, []);
  // Smooth spin with easing + tiny settle overshoot
  useEffect(() => {
    // Land on slice index 3 (0-based) which is "50%"
    const targetSliceIndex = 3;
    const landingAngle = targetSliceIndex * SLICE_ANGLE; // where pointer at 12 o’clock meets this slice center
    // Do multiple full rotations + align to landingAngle (pointer is fixed at top)
    const rotations = 5; // more spins = smoother feel
    const targetAngle = rotations * 360 + landingAngle;
    Animated.sequence([
      Animated.timing(spinValue, {
        toValue: targetAngle,
        duration: 3400,
        easing: Easing.bezier(0.17, 0.84, 0.44, 1), // smooth-out cubic bezier
        useNativeDriver: true,
      }),
      // tiny settle for a premium feel (1–2 deg)
      Animated.timing(spinValue, {
        toValue: targetAngle + 2.5,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(spinValue, {
        toValue: targetAngle,
        duration: 160,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSpinning(false);
      setTimeout(() => setShowResult(true), 450);
    });
  }, []);
  const spin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });
  const shadow = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
    android: {
      elevation: 14,
    },
  });
  const handleContinue = () => {
    router.push("/onboarding/ingredients-search" as any);
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgPrimary }]}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={bgPrimary}
      />
      <View style={styles.topSection}>
        <Text
          style={[styles.title, { color: textPrimary }]}
          accessibilityRole="header"
        >
          Spin to win your credit!
        </Text>
      </View>
      <View style={styles.centerSection}>
        <View
          style={[
            styles.wheelWrapper,
            { width: WHEEL_SIZE, height: WHEEL_SIZE },
          ]}
        >
          {/* pointer (fixed at top center) */}
          <View style={[styles.pointer, { top: -8 }]}>
            <View style={[styles.pointerStem, { backgroundColor: accent }]} />
            <View
              style={[styles.pointerTriangle, { borderTopColor: accent }]}
            />
          </View>
          {/* wheel */}
          <Animated.View
            style={[
              { transform: [{ rotate: spin }] },
              styles.wheelShadow,
              shadow,
            ]}
            accessibilityLabel={isSpinning ? "Spinning" : "Stopped"}
            accessibilityState={{ busy: isSpinning }}
          >
            <Svg
              width={WHEEL_SIZE}
              height={WHEEL_SIZE}
              viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            >
              <Defs>
                {Array.from({ length: SLICE_COUNT }).map((_, i) => (
                  <LinearGradient
                    key={`slice-grad-${i}`}
                    id={`slice-grad-${i}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <Stop
                      offset="0%"
                      stopColor={gradientStart}
                      stopOpacity={0.8 - i * 0.03}
                    />
                    <Stop
                      offset="100%"
                      stopColor={gradientEnd}
                      stopOpacity={1}
                    />
                  </LinearGradient>
                ))}
              </Defs>
              {/* outer ring */}
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS * 0.92}
                stroke="url(#ring)"
                strokeWidth={RADIUS * 0.08}
                fill="none"
              />
              {/* slices */}
              {slices.map((s, idx) => (
                <Path
                  key={`slice-${idx}`}
                  d={s.path}
                  fill={`url(#slice-grad-${idx})`}
                  stroke="url(#divider)" // keep your divider if you had it
                  strokeWidth={1.5}
                />
              ))}
              {/* labels */}
              {slices.map((s, idx) => (
                <SvgText
                  key={`label-${idx}`}
                  x={s.labelX}
                  y={s.labelY}
                  fontSize={RADIUS * 0.16}
                  fontWeight="700"
                  fill="#FFFFFF"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {s.percentage}
                </SvgText>
              ))}
            </Svg>
          </Animated.View>
          {/* center button (solid accent, subtle border) */}
          <View
            style={[
              styles.centerButton,
              {
                width: RADIUS * 0.46,
                height: RADIUS * 0.46,
                borderRadius: (RADIUS * 0.46) / 2,
                backgroundColor: accent,
                borderColor,
              },
            ]}
            pointerEvents="none"
          >
            <Text style={styles.centerText}>SPIN</Text>
          </View>
        </View>
        {showResult && (
          <View
            style={[
              styles.resultCard,
              { borderColor, backgroundColor: "transparent" },
            ]}
          >
            <View
              style={[
                styles.resultPill,
                {
                  backgroundColor: `${accent}1A` /* ~10% alpha if your color parser supports */,
                },
              ]}
            >
              <Text style={[styles.resultText, { color: accent }]}>
                :tada: You won 50% credit! :tada:
              </Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.bottomSection}>
        <Button
          title="Continue"
          onPress={handleContinue}
          style={{ width: "100%", opacity: showResult ? 1 : 0.6 }}
          disabled={!showResult}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { paddingTop: 48, paddingHorizontal: 24, alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  wheelWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  wheelShadow: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: RADIUS,
    overflow: "visible",
  },
  pointer: {
    position: "absolute",
    zIndex: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  pointerStem: {
    width: 4,
    height: 14,
    borderRadius: 2,
    marginBottom: 2,
    opacity: 0.95,
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  centerButton: {
    position: "absolute",
    zIndex: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  centerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  resultCard: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  resultPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  bottomSection: { paddingHorizontal: 24, paddingBottom: 36 },
});
