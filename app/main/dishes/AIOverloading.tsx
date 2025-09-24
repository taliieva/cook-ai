import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface AILoadingOverlayProps {
  progress: number;
  isVisible: boolean;
}

export const AILoadingOverlay: React.FC<AILoadingOverlayProps> = ({ progress, isVisible }) => {
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Scale in animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 4,
        useNativeDriver: true,
      }).start();

      // Rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        })
      );

      // Pulse animation for the glow effect
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      pulseAnimation.start();

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
      };
    } else {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.loadingOverlay,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      {/* Enhanced blur background */}
      <View style={styles.modernBlurOverlay} />

      {/* Main loading container - Properly centered */}
      <View style={styles.modernLoadingContainer}>
        {/* Outer glow ring */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.15],
                outputRange: [0.4, 0.7],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={['#E6F4FF', '#0598CE', '#113768']}
            style={styles.glowGradient}
          />
        </Animated.View>

        {/* Main progress circle */}
        <Animated.View
          style={[
            styles.modernProgressCircle,
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <LinearGradient
            colors={['#0598CE', '#33A7FF', '#66BDFF']}
            style={styles.modernProgressGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Inner content */}
            <View style={styles.modernProgressInner}>
              {/* Chef hat icon */}
              <View style={styles.iconContainer}>
                <Ionicons name="restaurant" size={22} color="white" />
              </View>
              
              {/* Animated dots */}
              <View style={styles.dotsContainer}>
                {[0, 1, 2].map((index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.animatedDot,
                      {
                        opacity: rotateAnim.interpolate({
                          inputRange: [0, 0.33, 0.66, 1],
                          outputRange: index === 0 ? [1, 0.3, 0.3, 1] : 
                                      index === 1 ? [0.3, 1, 0.3, 0.3] : 
                                      [0.3, 0.3, 1, 0.3],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Progress text with enhanced styling - positioned absolutely */}
        <View style={styles.modernTextContainer}>
          <Text style={styles.modernProgressText}>{Math.round(progress)}%</Text>
          <View style={styles.modernProgressBar}>
            <View style={styles.modernProgressBarBg} />
            <Animated.View
              style={[
                styles.modernProgressBarFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  modernBlurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 16,
    shadowColor: "#0598CE",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 3,
  },
  modernLoadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
    position: "relative",
    width: "100%",
    height: "100%",
  },
  glowRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: "50%",
    left: "50%",
    marginTop: -50,
    marginLeft: -50,
    zIndex: 1,
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  modernProgressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -40,
    marginLeft: -40,
    zIndex: 2,
    shadowColor: '#0598CE',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  modernProgressGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  modernProgressInner: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 6,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  animatedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  modernTextContainer: {
    alignItems: "center",
    minWidth: 100,
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -50,
    zIndex: 3,
  },
  modernProgressText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0598CE",
    marginBottom: 2,
    textShadowColor: 'rgba(5, 152, 206, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modernProgressBar: {
    width: 80,
    height: 3,
    position: 'relative',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  modernProgressBarBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#E6F4FF',
    borderRadius: 1.5,
  },
  modernProgressBarFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#0598CE',
    borderRadius: 1.5,
    shadowColor: '#0598CE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
});
