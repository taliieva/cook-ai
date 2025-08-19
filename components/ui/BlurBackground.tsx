import { useTheme } from '@/hooks/useTheme';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
    ImageBackground,
    ImageSourcePropType,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';

interface BlurBackgroundProps {
  imageSource: ImageSourcePropType;
  children: React.ReactNode;
  blurIntensity?: number;
  overlayOpacity?: number;
  blurHeight?: number;
  style?: ViewStyle;
}

export const BlurBackground: React.FC<BlurBackgroundProps> = ({
  imageSource,
  children,
  blurIntensity = 80,
  overlayOpacity = 0.3,
  blurHeight = 150,
  style
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={imageSource}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Content overlay */}
        <View style={[
          styles.contentOverlay, 
          { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }
        ]}>
          {children}
        </View>
        
        {/* Bottom blur area */}
        <View style={[styles.blurArea, { height: blurHeight }]}>
          <BlurView 
            intensity={blurIntensity} 
            tint={theme.isDark ? 'dark' : 'light'}
            style={styles.blurView}
          />
        </View>
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
    width: '100%',
    height: '100%',
  },
  contentOverlay: {
    flex: 1,
  },
  blurArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurView: {
    flex: 1,
  },
});