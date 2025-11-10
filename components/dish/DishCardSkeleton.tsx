/**
 * DishCardSkeleton Component
 * Loading state for DishCard with shimmer animation
 * Reusable across all screens
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';

interface DishCardSkeletonProps {
  variant?: 'compact' | 'detailed';
}

const Shimmer: React.FC<{ width?: string | number; height?: number; borderRadius?: number }> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: theme.colors.background.primary,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            theme.colors.background.primary,
            theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            theme.colors.background.primary,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 300, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
};

export const DishCardSkeleton: React.FC<DishCardSkeletonProps> = ({ variant = 'compact' }) => {
  const theme = useTheme();

  if (variant === 'detailed') {
    return (
      <View
        style={[
          styles.detailedContainer,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Shimmer width="100%" height={200} borderRadius={12} />
        <View style={styles.detailedContent}>
          <Shimmer width="80%" height={28} borderRadius={6} />
          <View style={styles.row}>
            <Shimmer width={80} height={24} borderRadius={12} />
            <Shimmer width={100} height={24} borderRadius={12} />
          </View>
          <Shimmer width="100%" height={60} borderRadius={8} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.compactContainer,
        {
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.compactContent}>
        <View style={styles.imageSection}>
          <Shimmer width={80} height={80} borderRadius={12} />
        </View>

        <View style={styles.contentSection}>
          <Shimmer width="80%" height={24} borderRadius={6} />
          <View style={styles.row}>
            <Shimmer width={80} height={24} borderRadius={12} />
            <Shimmer width={100} height={24} borderRadius={12} />
          </View>
          <View style={styles.row}>
            <Shimmer width={60} height={22} borderRadius={11} />
            <Shimmer width="40%" height={16} borderRadius={4} />
          </View>
        </View>

        <View style={styles.actions}>
          <Shimmer width={40} height={40} borderRadius={20} />
          <Shimmer width={40} height={40} borderRadius={20} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  compactContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageSection: {
    marginRight: 12,
  },
  contentSection: {
    flex: 1,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 8,
  },
  detailedContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailedContent: {
    padding: 16,
    gap: 12,
  },
});

