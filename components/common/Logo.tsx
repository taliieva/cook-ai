import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import logo from "../../assets/images/logo.png";
interface LogoProps {
  size?: "small" | "medium" | "large";
}

export const Logo: React.FC<LogoProps> = ({ size = "large" }) => {
  const theme = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { icon: 40, text: 18 };
      case "medium":
        return { icon: 60, text: 24 };
      case "large":
      default:
        return { icon: 110, text: 32 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={styles.container}>
      {/* <Text style={[styles.logoIcon, { fontSize: sizeStyles.icon }]}>🍽️</Text> */}
      <Image
        source={logo}
        style={[
          styles.logoIcon,
          {
            width: sizeStyles.icon,
            height: sizeStyles.icon,
          },
        ]}
        resizeMode="contain"
      />
      <Text
        style={[
          styles.appName,
          {
            fontSize: sizeStyles.text,
            fontWeight: theme.typography.heading.h1.fontWeight,
            lineHeight: theme.typography.heading.h1.lineHeight,
            color: theme.colors.text.primary,
          },
        ]}
      >
        Cook AI
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logoIcon: {
    marginBottom: 10,
    borderRadius: 25
  },
  appName: {
    textAlign: "center",
  }
});
