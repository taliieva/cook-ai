import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleClaimOffer = () => {
    router.push("/onboarding/suprise"); // Navigate to surprise screen
  };

  const handleExpandPricing = () => {
    setIsExpanded(!isExpanded);
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
                {/* Combined Pricing Container */}
                <TouchableOpacity 
                  style={styles.combinedPricingContainer}
                  onPress={handleExpandPricing}
                  activeOpacity={0.9}
                >
                  {/* Save 50% Section */}
                  <View style={styles.saveSection}>
                    <Text style={styles.saveText}>Save 50%</Text>
                  </View>

                  {/* Pricing Section with Blur */}
                  <View style={styles.pricingSection}>
                    <BlurView intensity={20} tint="light" style={styles.pricingBlur}>
                      <View style={styles.pricingContent}>
                        {!isExpanded ? (
                          // Collapsed state - Show only Annual
                          <View style={styles.pricingOption}>
                            <Text style={styles.pricingTitle}>Annual US$2.92/mo</Text>
                            <Text style={styles.pricingSubtext}>12 mo - US$34.99</Text>
                          </View>
                        ) : (
                          // Expanded state - Show both options
                          <>
                            {/* Annual Pricing - Top */}
                            <View style={styles.pricingOption}>
                              <Text style={styles.pricingTitle}>Annual US$2.92/mo</Text>
                              <Text style={styles.pricingSubtext}>12 mo - US$34.99</Text>
                            </View>

                            {/* Divider */}
                            <View style={styles.divider} />

                            {/* Monthly Pricing - Bottom */}
                            <View style={styles.pricingOption}>
                              <Text style={styles.pricingTitle}>Monthly US$17.99/mo</Text>
                            </View>
                          </>
                        )}
                      </View>
                    </BlurView>
                  </View>
                </TouchableOpacity>

                {/* Claim Offer Button */}
                <Button
                  title="Claim your offer now"
                  onPress={handleClaimOffer}
                  style={styles.claimButton}
                />

                {/* Guarantee Text */}
                <Text style={styles.guaranteeText}>
                  Cancel anytime - Money back guarantee
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
    height:'40%',
    paddingHorizontal: 30,
    alignItems: "center",
  },
  combinedPricingContainer: {
    width: '98%',
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveSection: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)', // Blue tone
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  pricingSection: {
    overflow: 'hidden',
  },
  pricingBlur: {
    flex: 1,
  },
  pricingContent: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  pricingOption: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  pricingTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  pricingSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 6,
    marginHorizontal: 20,
  },
  claimButton: {
    width: "100%",
    marginBottom: 15,
  },
  guaranteeText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});