import { StyleSheet } from "react-native";

export const cuisineCardStyles = StyleSheet.create({
    cuisineCard: {
        marginBottom: 12,
    },
    cuisineCardGradient: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cuisineHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    cuisineInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    cuisineRank: {
        fontSize: 16,
        fontWeight: "700",
        minWidth: 30,
    },
    cuisineIcon: {
        fontSize: 20,
        marginHorizontal: 12,
    },
    cuisineTextContainer: {
        flex: 1,
    },
    cuisineName: {
        fontSize: 18,
        fontWeight: "600",
    },
    cuisineSearches: {
        fontSize: 14,
        opacity: 0.7,
    },
    cuisineTrend: {
        alignItems: "flex-end",
    },
    cuisinePercentage: {
        fontSize: 18,
        fontWeight: "700",
    },
    cuisineTrendText: {
        fontSize: 12,
        fontWeight: "600",
    },
    trendPositive: {
        color: "#34C759",
    },
    trendNegative: {
        color: "#FF3B30",
    },
    progressBarContainer: {
        marginTop: 8,
    },
    progressBarBackground: {
        height: 6,
        borderRadius: 3,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        borderRadius: 3,
    },
});