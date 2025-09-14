import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/hooks/useProgress';
import { useTheme } from '@/hooks/useTheme';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const QuestionContainer = ({
  title,
  children,
  progress,
  onNext,
  isAnswered,
  backgroundImage = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
        translucent
      />
      
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
          style={styles.overlay}
        />

        <SafeAreaView style={styles.safeArea}>
          <ProgressBar progress={progress} />
          
          <View style={styles.contentContainer}>
            <View style={styles.questionSection}>
              <Text style={[styles.title, theme.typography.heading.h2]}>
                {title}
              </Text>
              {children}
            </View>

            {/* Bottom section with blur effect */}
            <View style={styles.bottomSection}>
              <MaskedView
                style={styles.maskedBlur}
                maskElement={
                  <LinearGradient
                    colors={['transparent', 'black']}
                    style={styles.mask}
                    locations={[0, 0.6]}
                  />
                }
              >
                <BlurView 
                  intensity={40} 
                  tint="dark"
                  style={styles.blurView}
                />
              </MaskedView>

              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(0, 0, 0, 0.4)',
                  'rgba(0, 0, 0, 0.8)',
                ]}
                style={styles.darkOverlay}
                locations={[0, 0.3, 1]}
              />

              {isAnswered && (
                <View style={styles.buttonContainer}>
                  <Button
                    title="Next"
                    onPress={onNext}
                    style={styles.nextButton}
                  />
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  questionSection: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  maskedBlur: {
    flex: 1,
  },
  mask: {
    flex: 1,
  },
  blurView: {
    flex: 1,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
  },
  nextButton: {
    width: '100%',
  },
});