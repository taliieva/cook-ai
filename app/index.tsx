import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { clearAuthTokens, validateAuthState } from "../utils/auth";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ onAnimationComplete }: any) => {
  const router = useRouter();

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;

  const text1Opacity = useRef(new Animated.Value(0)).current;
  const text1TranslateY = useRef(new Animated.Value(30)).current;

  const text2Opacity = useRef(new Animated.Value(0)).current;
  const text2TranslateY = useRef(new Animated.Value(30)).current;

  const gradientAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  
  // Separate particle animations to avoid mixing native/non-native drivers
  const particle1Rotation = useRef(new Animated.Value(0)).current;
  const particle2Rotation = useRef(new Animated.Value(0)).current;

  // Typewriter effect state and animations
  const [text1Content, setText1Content] = useState("");
  const [text2Content, setText2Content] = useState("");
  const [showCursor1, setShowCursor1] = useState(false);
  const [showCursor2, setShowCursor2] = useState(false);
  const text1TypewriterProgress = useRef(new Animated.Value(0)).current;
  const text2TypewriterProgress = useRef(new Animated.Value(0)).current;
  const cursorBlink = useRef(new Animated.Value(1)).current;

  // ✅ Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState("/onboarding/welcome");

  useEffect(() => {
    // ✅ Check auth first, then start animations
    checkAuthAndStartAnimations();
  }, []);

  // ✅ New function to handle auth check and navigation
  const checkAuthAndStartAnimations = async () => {
    try {
      console.log("🚀 Splash screen - checking auth state...");
      
      // Check authentication state
      const authResult = await validateAuthState();
      console.log("Auth validation result:", authResult);
      
      let targetRoute = "/onboarding/welcome"; // Default for new users or expired tokens
      
      if (authResult.isValid && authResult.userData) {
        // User has valid authentication - go directly to main app
        console.log("✅ User has valid token, going directly to ingredients-search");
        targetRoute = "/onboarding/ingredients-search";
        console.log("✅ Target route set to:", targetRoute);
      } else {
        // No token or expired token - send to welcome page for authentication
        console.log("❌ No valid token or expired token, going to welcome page");
        targetRoute = "/onboarding/welcome";
        console.log("❌ Target route set to:", targetRoute);
      }
      
      setNavigationTarget(targetRoute);
      console.log("🎯 navigationTarget state updated to:", targetRoute);
      setAuthChecked(true);
      
      // Start animations after auth check and pass the target route directly
      startAnimationSequence(targetRoute);
      
    } catch (error) {
      console.error("Error during auth check:", error);
      // On error, clear any corrupted auth data and go to welcome
      await clearAuthTokens();
      const fallbackRoute = "/onboarding/welcome";
      setNavigationTarget(fallbackRoute);
      setAuthChecked(true);
      startAnimationSequence(fallbackRoute);
    }
  };

  const startTypewriterEffect = (
    text: string,
    progress: any, // Not used in interval approach
    setText: (text: string) => void,
    setShowCursor: (show: boolean) => void,
    duration: number
  ) => {
    setShowCursor(true);
    setText(""); // Start with empty text
    
    const charDelay = duration / text.length;
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setText(text.substring(0, currentIndex + 1));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setShowCursor(false);
        }, 500);
      }
    }, charDelay);
    
    // Return cleanup function
    return () => clearInterval(typeInterval);
  };

  const startAnimationSequence = (finalTargetRoute: string) => {
    let gradientLoop;
    let pulseLoop;
    let particle1Loop;
    let particle2Loop;
    let cursorBlinkLoop;
    let text1Cleanup;
    let text2Cleanup;
  
    // Start cursor blink animation
    cursorBlinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorBlink, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorBlink, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    cursorBlinkLoop.start();
  
    // Start background gradient animation independently (non-native driver)
    gradientLoop = Animated.loop(
      Animated.timing(gradientAnimation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    );
    gradientLoop.start();
  
    // Prepare pulse animation for logo (native driver)
    pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
  
    // Particle rotation animations (native driver)
    particle1Loop = Animated.loop(
      Animated.timing(particle1Rotation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );
  
    particle2Loop = Animated.loop(
      Animated.timing(particle2Rotation, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    );
  
    // Main animation sequence (using native driver)
    Animated.sequence([
      // Step 1: Logo appears with haptic feedback
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
  
      // Step 2: Wait before text
      Animated.delay(500),
  
      // Step 3: First text container appears
      Animated.parallel([
        Animated.timing(text1Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(text1TranslateY, {
          toValue: 0,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
  
      // Step 4: Wait before second text
      Animated.delay(1500), // Wait for first text to finish typing
  
      // Step 5: Second text container appears
      Animated.parallel([
        Animated.timing(text2Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(text2TranslateY, {
          toValue: 0,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
  
      // Step 6: Hold for a moment
      Animated.delay(1200), // Wait for second text to finish typing
    ]).start(() => {
      // Stop all animations before navigating
      if (gradientLoop) gradientLoop.stop();
      if (pulseLoop) pulseLoop.stop();
      if (particle1Loop) particle1Loop.stop();
      if (particle2Loop) particle2Loop.stop();
      if (cursorBlinkLoop) cursorBlinkLoop.stop();
      if (text1Cleanup) text1Cleanup();
      if (text2Cleanup) text2Cleanup();
  
      // ✅ Animation complete - navigate based on auth state
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        
        // ✅ Navigate to the determined target route using the parameter
        console.log(`🎯 Navigating to: ${finalTargetRoute}`);
        console.log(`🎯 Using finalTargetRoute parameter: ${finalTargetRoute}`);
        
        // Ensure we're using the correct route
        if (finalTargetRoute.includes("ingredients-search")) {
          console.log("🚀 Attempting to navigate to ingredients-search...");
          // Try both possible route paths
          try {
            router.replace("/onboarding/ingredients-search" as any);
          } catch (error) {
            console.error("Failed to navigate to ingredients-search, trying alternative:", error);
            // Fallback to a route that definitely exists
            router.replace("/onboarding/welcome" as any);
          }
        } else {
          console.log("🚀 Navigating to welcome screen...");
          router.replace("/onboarding/welcome" as any);
        }
      }, 500);
    });
  
    // Haptic feedback timing for major events
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 0); // Logo
    setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 5000); // Completion
  
    // Start typewriter effects with delays (using interval-based approach)
    setTimeout(() => {
      text1Cleanup = startTypewriterEffect("Choose ingredients", null, setText1Content, setShowCursor1, 1200);
    }, 1300); // After first text container appears
  
    setTimeout(() => {
      text2Cleanup = startTypewriterEffect("AI will make for you", null, setText2Content, setShowCursor2, 1000);
    }, 3100); // After second text container appears
  
    // Start other animations after logo appears
    setTimeout(() => {
      if (pulseLoop) pulseLoop.start();
      if (particle1Loop) particle1Loop.start();
      if (particle2Loop) particle2Loop.start();
    }, 1200);
  
    // Cleanup function
    return () => {
      if (gradientLoop) gradientLoop.stop();
      if (pulseLoop) pulseLoop.stop();
      if (particle1Loop) particle1Loop.stop();
      if (particle2Loop) particle2Loop.stop();
      if (cursorBlinkLoop) cursorBlinkLoop.stop();
      if (text1Cleanup) text1Cleanup();
      if (text2Cleanup) text2Cleanup();
      text1TypewriterProgress.removeAllListeners();
      text2TypewriterProgress.removeAllListeners();
    };
  };

  const logoRotate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const particle1Rotate = particle1Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const particle2Rotate = particle2Rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  // ✅ Don't render anything until auth is checked
  if (!authChecked) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {/* Show just a minimal loading state during auth check */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Gradient Background */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Overlay gradients for animation effect */}
        <Animated.View
          style={[
            styles.gradientOverlay,
            {
              opacity: gradientAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={["#f093fb", "#f5576c"]}
            style={styles.gradient}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.gradientOverlay,
            {
              opacity: gradientAnimation.interpolate({
                inputRange: [0, 0.25, 0.75, 1],
                outputRange: [0, 0, 1, 0],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            style={styles.gradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: Animated.multiply(logoScale, pulseAnimation) },
                { rotate: logoRotate },
              ],
            },
          ]}
        >
          <View style={styles.logo}>
            <Image
              source={require("../assets/images/logo-light.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Logo glow effect */}
          <Animated.View
            style={[
              styles.logoGlow,
              {
                opacity: pulseAnimation.interpolate({
                  inputRange: [1, 1.15],
                  outputRange: [0.3, 0.6],
                }),
                transform: [{ scale: pulseAnimation }],
              },
            ]}
          />
        </Animated.View>

        {/* Text Container */}
        <View style={styles.textContainer}>
          {/* First Text */}
          <Animated.View
            style={[
              styles.textWrapper,
              {
                opacity: text1Opacity,
                transform: [{ translateY: text1TranslateY }],
              },
            ]}
          >
            <View style={styles.typewriterContainer}>
              <Text style={styles.primaryText}>
                {text1Content}
                {showCursor1 && (
                  <Animated.Text style={[styles.cursor, { opacity: cursorBlink }]}>
                    |
                  </Animated.Text>
                )}
              </Text>
            </View>
            <View style={styles.textUnderline} />
          </Animated.View>

          {/* Second Text */}
          <Animated.View
            style={[
              styles.textWrapper,
              {
                opacity: text2Opacity,
                transform: [{ translateY: text2TranslateY }],
                marginTop: 20,
              },
            ]}
          >
            <View style={styles.typewriterContainer}>
              <Text style={styles.secondaryText}>
                {text2Content}
                {showCursor2 && (
                  <Animated.Text style={[styles.cursor, { opacity: cursorBlink }]}>
                    |
                  </Animated.Text>
                )}
              </Text>
            </View>
            <View style={styles.aiIndicator}>
              <Text style={styles.sparkles}>✨</Text>
            </View>
          </Animated.View>
        </View>

        {/* Floating particles with separate native driver animations */}
        <Animated.View
          style={[
            styles.particle1,
            {
              opacity: logoOpacity,
              transform: [{ rotate: particle1Rotate }],
            },
          ]}
        >
          <Text style={styles.particleEmoji}>🥗</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.particle2,
            {
              opacity: text1Opacity,
              transform: [{ rotate: particle2Rotate }],
            },
          ]}
        >
          <Text style={styles.particleEmoji}>🤖</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.particle3,
            {
              opacity: text2Opacity,
              transform: [
                {
                  scale: pulseAnimation.interpolate({
                    inputRange: [1, 1.15],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.particleEmoji}>✨</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  gradientContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: 80,
    height: 70,
  },
  logoGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    top: -10,
    left: -10,
  },
  textContainer: {
    alignItems: "center",
  },
  textWrapper: {
    alignItems: "center",
  },
  typewriterContainer: {
    minHeight: 35, // Prevent layout shifts during typing
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  secondaryText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.3,
  },
  cursor: {
    fontSize: 28,
    fontWeight: "300",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  textUnderline: {
    width: 80,
    height: 3,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    borderRadius: 1.5,
    opacity: 0.8,
  },
  aiIndicator: {
    marginTop: 8,
  },
  sparkles: {
    fontSize: 20,
  },
  particle1: {
    position: "absolute",
    top: height * 0.25,
    left: width * 0.15,
  },
  particle2: {
    position: "absolute",
    top: height * 0.35,
    right: width * 0.2,
  },
  particle3: {
    position: "absolute",
    bottom: height * 0.25,
    left: width * 0.2,
  },
  particleEmoji: {
    fontSize: 24,
    opacity: 0.8,
  },
});

export default SplashScreen;