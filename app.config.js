export default {
  expo: {
    name: "react-native-demo-app",
    slug: "react-native-demo-app",
    owner: "umidtest123321",
    version: process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "reactnativedemoapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    // EAS Project Configuration
    extra: {
      eas: {
        projectId: "6fe0b2c6-fd1c-43d1-a8e1-c834d6cc4d5f",
      },
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.thecookai.app",
      config: {
        usesNonExemptEncryption: false,
      },
    },

    android: {
      package: "com.thecookai.app",
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-web-browser",
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-font",
      "expo-secure-store",
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1",
          },
          android: {
            minSdkVersion: 24,
          },
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    androidStatusBar: {
      backgroundColor: "#ffffff",
    },
  },
};
