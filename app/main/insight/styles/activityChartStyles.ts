import { StyleSheet } from "react-native";

export const activityChartStyles = StyleSheet.create({
    chartContainer: {
        marginBottom: 20,
    },
    chartGradient: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
    },
    chartContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        height: 120,
    },
    chartBar: {
        alignItems: "center",
        flex: 1,
    },
    barContainer: {
        height: 80,
        width: 20,
        justifyContent: "flex-end",
        marginBottom: 8,
    },
    bar: {
        width: "100%",
        borderRadius: 10,
        minHeight: 4,
    },
    emptyBar: {
        opacity: 0.3,
    },
    chartDay: {
        fontSize: 12,
        marginBottom: 4,
        opacity: 0.7,
    },
    chartValue: {
        fontSize: 12,
        fontWeight: "600",
    },
    // ✅ Add empty state styles
    emptyState: {
        height: 120,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        textAlign: "center",
        opacity: 0.7,
    },
});