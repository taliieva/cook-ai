import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Floating particle component
const FloatingParticle = ({ index, accent }: any) => {
  const particleAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const startDelay = index * 100;
    
    // Float animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 3000 + (index * 200),
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim, {
          toValue: 0,
          duration: 3000 + (index * 200),
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Scale animation
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000 + (index * 150),
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.3,
          duration: 2000 + (index * 150),
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    setTimeout(() => {
      floatAnimation.start();
      scaleAnimation.start();
    }, startDelay);

    return () => {
      floatAnimation.stop();
      scaleAnimation.stop();
    };
  }, [particleAnim, scaleAnim, index]);

  const translateY = particleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const translateX = particleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 30 * Math.cos(index), -20 * Math.sin(index)],
  });

  const colors = [accent, '#FFD60A', '#FF6B6B', '#32D74B', '#FF9500'];
  const particleColor = colors[index % colors.length];

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: particleColor,
          transform: [
            { translateX },
            { translateY },
            { scale: scaleAnim },
          ],
          left: (index % 3) * (SCREEN_W / 3) + Math.random() * 50,
          top: 100 + (index * 40) + Math.random() * 100,
        }
      ]}
    />
  );
};

export default function SupriseScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Colors from theme
  const bgPrimary = theme.colors.background.primary;
  const textPrimary = theme.colors.text.primary;
  const accent = theme.colors.accent.primary;

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Pulse animation for discount text
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, glowAnim, pulseAnim]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const handleContinue = useCallback(() => {
    router.push("/onboarding/ingredients-search");
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgPrimary }]}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={bgPrimary}
      />

      {/* Floating Particles */}
      <View style={styles.particlesContainer}>
        {Array.from({ length: 15 }, (_, i) => (
          <FloatingParticle key={i} index={i} accent={accent} />
        ))}
      </View>

      {/* Header */}
      <View style={styles.topSection}>
        <Animated.Text 
          style={[
            styles.congratsText, 
            { color: textPrimary, opacity: fadeAnim }
          ]}
        >
          🎉 Congratulations! 🎉
        </Animated.Text>
      </View>

      {/* Main Discount Section */}
      <View style={styles.centerSection}>
        <Animated.View 
          style={[
            styles.discountContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          {/* Glow Effect */}
          <Animated.View 
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
                backgroundColor: accent + '20',
              }
            ]}
          />
          
          {/* Main Discount Text */}
          <Animated.View 
            style={[
              styles.discountTextContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Text style={[styles.discountPercent, { color: accent }]}>50%</Text>
            <Text style={[styles.discountText, { color: textPrimary }]}>DISCOUNT</Text>
          </Animated.View>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: textPrimary + '80' }]}>
            Exclusive offer just for you!
          </Text>
        </Animated.View>

        {/* Timer Section */}
        <Animated.View 
          style={[
            styles.timerContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={[styles.timerLabel, { color: textPrimary + '60' }]}>
            Offer expires in
          </Text>
          <View style={[styles.timerBox, { backgroundColor: accent + '15', borderColor: accent + '30' }]}>
            <Text style={[styles.timerText, { color: accent }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
          <Text style={[styles.timerSubtext, { color: textPrimary + '60' }]}>
            Don't miss out on this limited-time offer!
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <Animated.View 
        style={[
          styles.bottomSection,
          { opacity: fadeAnim }
        ]}
      >
        <Button
          title="Claim My Discount"
          onPress={handleContinue}
          style={styles.claimButton}
        />
        <Text style={[styles.termsText, { color: textPrimary + '60' }]}>
          Terms and conditions apply
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  particlesContainer: {
    position: 'absolute',
    width: SCREEN_W,
    height: SCREEN_H,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.7,
  },
  topSection: {
    paddingTop: 60,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 40,
    zIndex: 2,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    zIndex: 2,
  },
  discountContainer: {
    alignItems: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -50,
    left: -50,
  },
  discountTextContainer: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 3,
  },
  discountPercent: {
    fontSize: 88,
    fontWeight: '900',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  discountText: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 4,
    marginTop: -10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  timerBox: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
  },
  timerText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
  },
  timerSubtext: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  bottomSection: { 
    paddingHorizontal: 30, 
    paddingBottom: 40,
    alignItems: 'center',
    zIndex: 2,
  },
  claimButton: {
    width: "100%",
    marginBottom: 12,
  },
  termsText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
});