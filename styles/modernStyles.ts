import { StyleSheet } from "react-native";

const modernStyles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  modernBlurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modernLoadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  glowGradient: {
    flex: 1,
  },
  modernProgressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  modernProgressGradient: {
    flex: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  modernProgressInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 20,
  },
  modernTextContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  modernProgressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 6,
  },
  modernProgressBar: {
    width: 120,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  modernProgressBarBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  modernProgressBarFill: {
    height: "100%",
    backgroundColor: "white",
  },
});

export default modernStyles;
