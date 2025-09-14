import { useEffect, useState } from 'react';

export const useProgress = (totalSteps, currentStep) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = (currentStep / totalSteps) * 100;
    setProgress(newProgress);
  }, [currentStep, totalSteps]);

  return progress;
};

// components/ProgressBar.js
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const ProgressBar = ({ progress }) => {
  const animatedProgress = new Animated.Value(progress);

  React.useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animatedProgress.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
});