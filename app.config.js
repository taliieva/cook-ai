export default {
    expo: {
        name: "react-native-demo-app",
        slug: "react-native-demo-app",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "reactnativedemoapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,

        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.thecookai.app", // ✅ WILL SHOW CORRECTLY NOW
        },

        android: {
            package: "com.thecookai.app",          // ✅ WILL SHOW CORRECTLY NOW
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
        ],

        experiments: {
            typedRoutes: true,
        },

        androidStatusBar: {
            backgroundColor: "#ffffff",
        },
    },
};
