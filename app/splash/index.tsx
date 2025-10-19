import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    StatusBar,
    View,
} from "react-native";
import { useAuthCheck } from "./hooks/useAuthCheck";
import { legendarySplashStyles as styles } from "./styles/legendarySplashStyles";

const LegendarySplash = ({ onAnimationComplete }: any) => {
    const { isChecking, navigateToTarget } = useAuthCheck();

    // Smooth animations
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!isChecking) {
            startLegendaryAnimation();
        }
    }, [isChecking]);

    const startLegendaryAnimation = () => {
        // Single haptic at start
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Shimmer effect
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();

        // Logo entrance - smooth and quick
        Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 40,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Subtle pulse
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });

        // Navigate after 2 seconds
        setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            if (onAnimationComplete) onAnimationComplete();
            navigateToTarget();
        }, 2000);
    };

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 300],
    });

    if (isChecking) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
                <LinearGradient
                    colors={["#0F2027", "#203A43", "#2C5364"]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Premium Gradient Background */}
            <LinearGradient
                colors={["#001F3F", "#0051D5", "#007AFF"]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Animated gradient overlay */}
            <Animated.View
                style={[
                    styles.shimmerOverlay,
                    {
                        opacity: shimmerAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 0.3, 0],
                        }),
                    },
                ]}
            >
                <LinearGradient
                    colors={["transparent", "rgba(255,255,255,0.1)", "transparent"]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                />
            </Animated.View>

            {/* Center Content */}
            <View style={styles.centerContent}>
                {/* Outer Glow Ring */}
                <Animated.View
                    style={[
                        styles.glowRing,
                        {
                            transform: [{ scale: pulseAnim }],
                            opacity: pulseAnim.interpolate({
                                inputRange: [1, 1.05],
                                outputRange: [0.2, 0.4],
                            }),
                        },
                    ]}
                />

                {/* Middle Glow Ring */}
                <Animated.View
                    style={[
                        styles.glowRingMid,
                        {
                            transform: [
                                {
                                    scale: pulseAnim.interpolate({
                                        inputRange: [1, 1.05],
                                        outputRange: [1, 1.03],
                                    })
                                }
                            ],
                            opacity: 0.3,
                        },
                    ]}
                />

                {/* Logo Container - Premium Glass Effect */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoOpacity,
                            transform: [
                                { scale: Animated.multiply(logoScale, pulseAnim) },
                            ],
                        },
                    ]}
                >
                    {/* Shimmer effect over logo */}
                    <Animated.View
                        style={[
                            styles.shimmer,
                            {
                                transform: [{ translateX: shimmerTranslate }],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
                            style={styles.shimmerGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    </Animated.View>

                    {/* Inner glow */}
                    <View style={styles.innerGlow} />

                    {/* Logo */}
                    <Image
                        source={require("../../assets/images/dark-logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>
            </View>
        </View>
    );
};

export default LegendarySplash;