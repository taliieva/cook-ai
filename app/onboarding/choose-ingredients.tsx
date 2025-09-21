import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ChooseIngredientsScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleNext = () => {
    router.push('/questions/CookingExperienceScreen');
    // router.push('/onboarding/app-insight');
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
        translucent
      />
      
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Main Content Container */}
        <View style={styles.contentContainer}>
          
          {/* Center Section - Heading */}
          <View style={styles.centerSection}>
            <Text style={[
              styles.heading,
              theme.typography.heading.h1,
              { color: '#FFFFFF' }
            ]}>
              Choose Ingredients
            </Text>
          </View>

          {/* Bottom Section with Smooth Gradient Blur */}
          <View style={styles.bottomSection}>
            
            {/* Masked Blur View for smooth transition */}
            <MaskedView
              style={styles.maskedBlur}
              maskElement={
                <LinearGradient
                  colors={['transparent', 'black']}
                  style={styles.mask}
                  locations={[0, 0.7]}
                />
              }
            >
              <BlurView 
                intensity={60} 
                tint="dark"
                style={styles.blurView}
              />
            </MaskedView>

            {/* Dark gradient overlay for better contrast */}
            <LinearGradient
              colors={[
                'transparent',
                'rgba(0, 0, 0, 0.1)',
                'rgba(0, 0, 0, 0.3)',
                'rgba(0, 0, 0, 0.5)',
              ]}
              style={styles.darkOverlay}
              locations={[0, 0.4, 0.7, 1]}
            />
            
            {/* Button Container */}
            <SafeAreaView style={styles.safeAreaBottom}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Next"
                  onPress={handleNext}
                  style={styles.nextButton}
                />
              </View>
            </SafeAreaView>
          </View>
          
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  heading: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Italic' : 'serif',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    fontStyle: 'italic',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 500,
  },
  maskedBlur: {
    flex: 2,
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
  safeAreaBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30, // This stays the same
  },
  nextButton: {
    width: '100%',
  },
});