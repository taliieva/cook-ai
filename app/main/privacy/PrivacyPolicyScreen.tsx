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

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    router.back();
  };

  const sections = [
    {
      title: "Information We Collect",
      content: [
        "We collect information you provide directly to us, such as when you create an account, add ingredients, save recipes, or contact us for support.",
        "Usage information including your interactions with the app, features used, and time spent on different sections.",
        "Device information such as your device type, operating system, and unique device identifiers.",
        "Location data when you allow us to access your location for local restaurant recommendations."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To provide, maintain, and improve our recipe recommendation services.",
        "To personalize your experience and provide customized content based on your dietary preferences.",
        "To send you notifications about new features, recipes, and app updates.",
        "To analyze usage patterns and improve our algorithms for better recipe matching.",
        "To provide customer support and respond to your inquiries."
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.",
        "We may share aggregated, non-personally identifiable information for analytics and improvement purposes.",
        "We may disclose your information when required by law or to protect our rights and safety.",
        "Service providers who assist us in operating our app may have access to your information under strict confidentiality agreements."
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        "Your data is encrypted both in transit and at rest using industry-standard encryption protocols.",
        "We regularly review and update our security practices to ensure the highest level of protection.",
        "However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
      ]
    },
    {
      title: "Your Rights",
      content: [
        "You have the right to access, update, or delete your personal information at any time through your account settings.",
        "You can opt out of promotional communications by following the unsubscribe instructions in any email we send.",
        "You may request a copy of the personal information we hold about you.",
        "You can delete your account and all associated data through the app settings or by contacting us."
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        "Our service is not intended for children under 13 years of age.",
        "We do not knowingly collect personal information from children under 13.",
        "If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.",
        "Parents who believe their child has provided us with personal information should contact us immediately."
      ]
    },
    {
      title: "Changes to This Policy",
      content: [
        "We may update our Privacy Policy from time to time to reflect changes in our practices or legal requirements.",
        "We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date.",
        "For significant changes, we may also send you an email notification or display a prominent notice in the app.",
        "Your continued use of the app after any changes constitutes acceptance of the updated policy."
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
          Privacy & Policy
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
            This Privacy Policy describes how we collect, use, and protect your
            information when you use our recipe discovery app. We are committed
            to protecting your privacy and ensuring the security of your personal
            data.
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
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {section.title}
            </Text>
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

        {/* Contact Information */}
        <View
          style={[
            styles.contactSection,
            {
              backgroundColor: theme.colors.accent.primary + "10",
              borderColor: theme.colors.accent.primary + "30",
            },
          ]}
        >
          <View style={styles.contactHeader}>
            <Ionicons
              name="mail-outline"
              size={24}
              color={theme.colors.accent.primary}
            />
            <Text
              style={[
                styles.contactTitle,
                { color: theme.colors.accent.primary },
              ]}
            >
              Questions about Privacy?
            </Text>
          </View>
          <Text
            style={[
              styles.contactText,
              { color: theme.colors.text.secondary },
            ]}
          >
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at:
          </Text>
          <Text
            style={[
              styles.contactEmail,
              { color: theme.colors.accent.primary },
            ]}
          >
            privacy@recipeapp.com
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
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
});8