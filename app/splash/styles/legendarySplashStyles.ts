import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const legendarySplashStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F2027",
    },
    gradient: {
        flex: 1,
    },
    shimmerOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    centerContent: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    // Outer glow ring
    glowRing: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: "rgba(45, 212, 191, 0.15)",
        shadowColor: "#2DD4BF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
    },
    // Middle glow ring
    glowRingMid: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: "rgba(45, 212, 191, 0.1)",
        shadowColor: "#2DD4BF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
    },
    // Logo container - Glass morphism
    logoContainer: {
        width: 180,
        height: 180,
        borderRadius: 45,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        // Border with gradient feel
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.18)",
        // Premium shadow
        shadowColor: "#2DD4BF",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    innerGlow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(45, 212, 191, 0.05)",
        borderRadius: 45,
    },
    logo: {
        width: 140,
        height: 105,
        zIndex: 2,
    },
    // Shimmer animation over logo
    shimmer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 3,
        overflow: "hidden",
        borderRadius: 45,
    },
    shimmerGradient: {
        width: 100,
        height: "100%",
    },
});