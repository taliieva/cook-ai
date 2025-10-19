import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const insightsStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    errorText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    header: {
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        textAlign: "center",
        opacity: 0.8,
    },
    periodSelector: {
        flexDirection: "row",
        borderRadius: 12,
        padding: 4,
        marginBottom: 30,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
    },
    periodButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    cuisineList: {
        gap: 12,
    },
    comingSoonText: {
        fontSize: 16,
        textAlign: "center",
        opacity: 0.7,
        paddingVertical: 40,
    },
    bottomPadding: {
        height: 20,
    },
});