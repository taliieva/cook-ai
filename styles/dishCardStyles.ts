import { StyleSheet } from "react-native";

const dishCardStyles = StyleSheet.create({
  dishCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    position: "relative",
  },
  imageSection: {
    width: "100%",
    height: 160,
    backgroundColor: "#e9e9e9",
  },
  dishImage: {
    width: "100%",
    height: "100%",
  },
  contentSection: {
    padding: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dishName: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionsContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 6,
  },
  actionButton: {
    padding: 8,
    borderRadius: 50,
    marginLeft: 6,
  },
});

export default dishCardStyles;
