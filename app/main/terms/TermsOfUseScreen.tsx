import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function TermsOfUseScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    router.back();
  };

  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using this recipe discovery application, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all visitors, users, and others who access or use the service.",
        "We reserve the right to update and change the Terms of Service from time to time without notice."
      ]
    },
    {
      title: "Description of Service",
      content: [
        "Our app provides recipe recommendations based on ingredients you provide, dietary preferences, and cooking modes.",
        "The service includes features for saving recipes, marking favorites, and accessing cooking instructions.",
        "We offer both free and premium subscription tiers with different feature sets.",
        "Premium features may include advanced dietary modes, unlimited recipe saves, and exclusive content access."
      ]
    },
    {
      title: "User Account",
      content: [
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You agree to accept responsibility for all activities that occur under your account.",
        "You must immediately notify us of any unauthorized use of your account.",
        "We reserve the right to terminate accounts that violate these terms or engage in prohibited activities."
      ]
    },
    {
      title: "Acceptable Use",
      content: [
        "You may not use our service for any illegal or unauthorized purpose.",
        "You must not transmit any worms, viruses, or any code of a destructive nature.",
        "You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the service without permission.",
        "You must not use our service to spam, harass, or send unsolicited communications to other users."
      ]
    },
    {
      title: "Content and Intellectual Property",
      content: [
        "All recipe content, algorithms, and app features are owned by us or our content suppliers.",
        "You may not modify, publish, transmit, reverse engineer, or create derivative works from our content.",
        "User-generated content (like ingredient lists) remains your property, but you grant us license to use it for service improvement.",
        "We respect intellectual property rights and expect users to do the same."
      ]
    },
    {
      title: "Premium Subscription",
      content: [
        "Premium subscriptions are billed on a recurring basis (monthly or yearly) until cancelled.",
        "You may cancel your subscription at any time through your account settings or app store.",
        "Refunds are handled according to the app store policies where you made your purchase.",
        "Premium features are subject to availability and may be modified or discontinued."
      ]
    },
    {
      title: "Disclaimers and Limitations",
      content: [
        "Recipe recommendations are provided for informational purposes only and should not replace professional dietary advice.",
        "We are not responsible for any adverse reactions to ingredients or recipes suggested by our app.",
        "Users with food allergies or dietary restrictions should always verify ingredient safety before cooking.",
        "The service is provided 'as is' without any guarantees of accuracy, reliability, or availability."
      ]
    },
    {
      title: "Privacy and Data",
      content: [
        "Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your data.",
        "We use your data to personalize recommendations and improve our service quality.",
        "You can request data deletion or account termination at any time through the app settings.",
        "We implement security measures to protect your data but cannot guarantee complete security."
      ]
    },
    {
      title: "Termination",
      content: [
        "Either party may terminate this agreement at any time, with or without cause.",
        "Upon termination, your right to use the service ceases immediately.",
        "We may terminate or suspend access immediately, without prior notice, for violations of these Terms.",
        "All provisions that should survive termination shall survive, including ownership provisions and warranty disclaimers."
      ]
    }
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background.primary}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={handleBack}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          Terms of Use
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Last Updated */}
        <View style={styles.lastUpdatedSection}>
          <Text
            style={[
              styles.lastUpdatedText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Last updated: December 2024
          </Text>
        </View>

        {/* Introduction */}
        <View style={styles.introSection}>
          <Text
            style={[styles.introText, { color: theme.colors.text.primary }]}
          >
            Welcome to our recipe discovery app. These Terms of Use govern your
            use of our application and services. Please read them carefully
            before using our service.
          </Text>
        </View>

        {/* Sections */}
        {sections.map((section, index) => (
          <View
            key={index}
            style={[
              styles.section,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionNumber,
                  { color: theme.colors.accent.primary },
                ]}
              >
                {index + 1}.
              </Text>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {section.title}
              </Text>
            </View>
            {section.content.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.bulletPoint}>
                <View
                  style={[
                    styles.bullet,
                    { backgroundColor: theme.colors.accent.primary },
                  ]}
                />
                <Text
                  style={[
                    styles.bulletText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Agreement Section */}
        <View
          style={[
            styles.agreementSection,
            {
              backgroundColor: theme.colors.accent.primary + "10",
              borderColor: theme.colors.accent.primary + "30",
            },
          ]}
        >
          <View style={styles.agreementHeader}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={theme.colors.accent.primary}
            />
            <Text
              style={[
                styles.agreementTitle,
                { color: theme.colors.accent.primary },
              ]}
            >
              By Using Our App
            </Text>
          </View>
          <Text
            style={[
              styles.agreementText,
              { color: theme.colors.text.secondary },
            ]}
          >
            You acknowledge that you have read, understood, and agree to be
            bound by these Terms of Use and our Privacy Policy.
          </Text>
        </View>

        {/* Contact Information */}
        <View
          style={[
            styles.contactSection,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.contactHeader}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={theme.colors.text.primary}
            />
            <Text
              style={[
                styles.contactTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Questions about Terms?
            </Text>
          </View>
          <Text
            style={[
              styles.contactText,
              { color: theme.colors.text.secondary },
            ]}
          >
            If you have any questions about these Terms of Use, please contact us at:
          </Text>
          <Text
            style={[
              styles.contactEmail,
              { color: theme.colors.accent.primary },
            ]}
          >
            legal@recipeapp.com
          </Text>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  lastUpdatedSection: {
    paddingVertical: 10,
    alignItems: "center",
  },
  lastUpdatedText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  introSection: {
    paddingVertical: 20,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionNumber: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
    minWidth: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  agreementSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginVertical: 16,
  },
  agreementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  agreementTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  agreementText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
  },
  contactSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginVertical: 16,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  contactText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 40,
  },
});