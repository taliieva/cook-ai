import { StyleSheet } from "react-native";

export const dishDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        fontWeight: "500",
    },
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    maskedBlur: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    mask: {
        flex: 1,
    },
    blurView: {
        flex: 1,
    },
    darkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    cultureContainer: {
        alignSelf: "flex-start",
        marginBottom: 15,
    },
    cultureTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    cultureText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    dishName: {
        fontSize: 32,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 15,
        textShadowColor: "rgba(0, 0, 0, 0.7)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 15,
        flexWrap: "wrap",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
        marginBottom: 8,
    },
    infoText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 5,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    statsRow: {
        flexDirection: "row",
        marginBottom: 25,
        flexWrap: "wrap",
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
        marginBottom: 8,
    },
    statText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "500",
        marginLeft: 4,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#FFFFFF",
        marginBottom: 10,
        textShadowColor: "rgba(0, 0, 0, 0.7)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    ingredientCount: {
        fontSize: 14,
        color: "#CCCCCC",
        marginLeft: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: "#FFFFFF",
        textShadowColor: "rgba(0, 0, 0, 0.7)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    ingredientsList: {
        gap: 12,
    },
    ingredientItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
    },
    ingredientIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    ingredientInfo: {
        flex: 1,
    },
    ingredientName: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 2,
    },
    ingredientAmount: {
        fontSize: 14,
    },
    instructionStep: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "flex-start",
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
        marginTop: 2,
    },
    stepNumberText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        textShadowColor: "rgba(0, 0, 0, 0.7)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    buttonContainer: {
        marginTop: 20,
    },
    startCookingButton: {
        borderRadius: 25,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        paddingHorizontal: 30,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
    },
    bottomPadding: {
        height: 30,
    },
});