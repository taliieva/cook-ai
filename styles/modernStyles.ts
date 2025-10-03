import { StyleSheet } from "react-native";

export const modernStyles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  modernBlurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 16,
    // Add subtle shadow effect
    shadowColor: "#0598CE",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 3,
  },
  modernLoadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
    position: "relative",
    // Ensure it's perfectly centered
    width: "100%",
    height: "100%",
  },
  glowRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    // Center the glow ring relative to the progress circle
    top: "50%",
    left: "50%",
    marginTop: -50, // Half of height
    marginLeft: -50, // Half of width
    zIndex: 1,
  },
  glowGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  modernProgressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    // Perfect center positioning
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -40, // Half of height
    marginLeft: -40, // Half of width
    zIndex: 2,
    shadowColor: "#0598CE",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  modernProgressGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  modernProgressInner: {
    width: "100%",
    height: "100%",
    borderRadius: 38,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconContainer: {
    marginBottom: 6,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 3,
  },
  animatedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  modernTextContainer: {
    alignItems: "center",
    minWidth: 100,
    // Position text below the circle
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -50, // Half of minWidth
    zIndex: 3,
  },
  modernProgressText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0598CE",
    marginBottom: 2,
    textShadowColor: "rgba(5, 152, 206, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modernStatusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#113768",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  modernProgressBar: {
    width: 80,
    height: 3,
    position: "relative",
    borderRadius: 1.5,
    overflow: "hidden",
  },
  modernProgressBarBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#E6F4FF",
    borderRadius: 1.5,
  },
  modernProgressBarFill: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#0598CE",
    borderRadius: 1.5,
    shadowColor: "#0598CE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
});