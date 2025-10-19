import { StyleSheet } from "react-native";

export const statCardStyles = StyleSheet.create({
    statCard: {
        width: "48%",
        marginBottom: 12,
    },
    statCardGradient: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    statHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    statIcon: {
        fontSize: 24,
    },
    trendContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    trendText: {
        fontSize: 12,
        fontWeight: "600",
    },
    trendPositive: {
        color: "#34C759",
    },
    trendNegative: {
        color: "#FF3B30",
    },
    statValue: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 14,
        opacity: 0.8,
    },
});