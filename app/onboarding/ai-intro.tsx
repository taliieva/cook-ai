import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ImageBackground,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function AIIntroScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    router.back();
  };

  const handleTryForFree = () => {
    router.push("/onboarding/suprise"); // Navigate to surprise screen
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
          uri: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        }}
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        {/* Main Content Container */}
        <SafeAreaView style={styles.contentContainer}>
          {/* Top Section - Back Button */}
          <View style={styles.topSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Center Section - AI Text */}
          <View style={styles.centerSection}>
            <Text
              style={[
                styles.aiText,
                theme.typography.heading.h1,
                { color: "#FFFFFF" },
              ]}
            >
              AI will make for you
            </Text>
          </View>

          {/* Bottom Section with Smooth Gradient Blur */}
          <View style={styles.bottomSection}>
            {/* Masked Blur View for smooth transition */}
            <MaskedView
              style={styles.maskedBlur}
              maskElement={
                <LinearGradient
                  colors={["transparent", "black"]}
                  style={styles.mask}
                  locations={[0, 0.6]}
                />
              }
            >
              <BlurView intensity={60} tint="dark" style={styles.blurView} />
            </MaskedView>

            {/* Dark gradient overlay for better contrast */}
            <LinearGradient
              colors={[
                "transparent",
                "rgba(0, 0, 0, 0.1)",
                "rgba(0, 0, 0, 0.3)",
                "rgba(0, 0, 0, 0.6)",
              ]}
              style={styles.darkOverlay}
              locations={[0, 0.3, 0.6, 1]}
            />

            {/* Content Container */}
            <View style={styles.bottomContent}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Try for Free"
                  onPress={handleTryForFree}
                  style={styles.tryFreeButton}
                />

                {/* Subscription Details */}
                <Text
                  style={[
                    styles.subscriptionText,
                    theme.typography.body.medium,
                    { color: "#FFFFFF" },
                  ]}
                >
                  Yearly $80 / Monthly $20
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "105%",
  },
  contentContainer: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "flex-start",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  aiText: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Italic' : 'serif',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    lineHeight: 44,
    fontStyle: 'italic',
  },
  bottomSection: {
    height: 280,
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  tryFreeButton: {
    width: "100%",
    marginBottom: 15,
  },
  subscriptionText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
