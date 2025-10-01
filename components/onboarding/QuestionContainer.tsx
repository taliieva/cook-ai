import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/hooks/useProgress";
import { useTheme } from "@/hooks/useTheme";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const QuestionContainer = ({
  title,
  children,
  progress,
  onNext,
  isAnswered,
  backgroundImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
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
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.4)"]}
          style={styles.overlay}
        />
      </ImageBackground>

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
              style={StyleSheet.absoluteFill}
              maskElement={
                <LinearGradient
                  colors={["transparent", "black"]}
                  style={StyleSheet.absoluteFill}
                  locations={[0, 0.6]}
                />
              }
            >
              <BlurView
                intensity={40}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
            </MaskedView>

            <LinearGradient
              colors={[
                "transparent",
                "rgba(0, 0, 0, 0.4)",
                "rgba(0, 0, 0, 0.8)",
              ]}
              style={StyleSheet.absoluteFill}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    resizeMode: "cover",
    // width: '100%',
    // height: '100%',
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  questionSection: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    fontStyle: "italic",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
    fontFamily: Platform.OS === "ios" ? "Georgia-Italic" : "serif",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  bottomSection: {
    position: "absolute",
    bottom: -50,
    left: 0,
    right: 0,
    height: 200,  // 👈 pick how tall you want the blur section
    // overflow: "hidden", // ensures clean edges
  },
  
  maskedBlur: {
    flex: 1,
  },
  mask: {
    flex: 1,
  },
  blurView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    left: 30,
    right: 30,
  },
  nextButton: {
    width: "100%",
  },
});
