import { StyleSheet } from "react-native";

export const dishesScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: "space-between",
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContent: {
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    aiHeaderIndicator: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    aiHeaderText: {
        fontSize: 12,
        fontWeight: "500",
        marginLeft: 4,
    },
    headerSpacer: {
        width: 44,
    },
    resultsSection: {
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    resultsText: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.8,
    },
    readMoreButton: {
        marginTop: 4,
        alignSelf: "flex-start",
    },
    readMoreText: {
        fontSize: 14,
        fontWeight: "600",
        textDecorationLine: "underline",
    },
    dishesContainer: {
        flex: 1,
    },
    dishesContent: {
        paddingHorizontal: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 16,
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    bottomPadding: {
        height: 20,
    },
});