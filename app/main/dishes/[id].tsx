import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    ImageBackground,
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface DishDetail {
    id: number;
    name: string;
    culture: string;
    image: string;
    calories: number;
    outdoorCost: number;
    homeCost: number;
    moneySaved: number;
    shortDescription: string;
    steps: string[];
    dishType: string;
    videoURL?: string;
}

interface Ingredient {
    name: string;
    amount: string;
    icon: string;
}

export default function DishDetailScreen() {
    const router = useRouter();
    const theme = useTheme();
    const params = useLocalSearchParams();
    const [isFavorite, setIsFavorite] = useState(false);
    const [dishData, setDishData] = useState<DishDetail | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        parseDishData();
    }, []);

    const convertSearchedToIngredients = (
        searchedIngredients: string[]
    ): Ingredient[] => {
        const ingredientIcons: { [key: string]: string } = {
            tomato: "🍅",
            tomatoes: "🍅",
            egg: "🥚",
            eggs: "🥚",
            cheese: "🧀",
            onion: "🧅",
            onions: "🧅",
            garlic: "🧄",
            pepper: "🌶️",
            "bell pepper": "🫑",
            salt: "🧂",
            oil: "🫒",
            "olive oil": "🫒",
            butter: "🧈",
            pasta: "🍝",
            spaghetti: "🍝",
            rice: "🍚",
            chicken: "🐔",
            beef: "🥩",
            fish: "🐟",
            milk: "🥛",
            flour: "🌾",
            sugar: "🍯",
            lemon: "🍋",
            carrot: "🥕",
            carrots: "🥕",
            potato: "🥔",
            potatoes: "🥔",
            mushroom: "🍄",
            mushrooms: "🍄",
        };

        return searchedIngredients
            .filter((i) => typeof i === "string" && i.trim() !== "")
            .map((ingredient) => ({
                name: ingredient,
                amount: "as needed",
                icon: ingredientIcons[ingredient.toLowerCase()] || "🥘",
            }));
    };

    const parseDishData = () => {
        try {
            console.log("Received dish params:", params);

            if (params.dishData) {
                const parsedDish = JSON.parse(params.dishData as string);
                console.log("Parsed dish:", parsedDish);

                setDishData(parsedDish);

                let generatedIngredients: Ingredient[] = [];
                if (params.searchedIngredients) {
                    const searchedIngredients = JSON.parse(
                        params.searchedIngredients as string
                    );
                    generatedIngredients =
                        convertSearchedToIngredients(searchedIngredients);
                } else {
                    generatedIngredients = generateIngredientsFromSteps(
                        parsedDish.steps || []
                    );
                }

                setIngredients(generatedIngredients);
            }
        } catch (error) {
            console.error("Error parsing dish data:", error);
            setFallbackData();
        }
    };

    const setFallbackData = () => {
        setDishData({
            id: 1,
            name: "Delicious Recipe",
            culture: "International",
            image:
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            calories: 350,
            outdoorCost: 15,
            homeCost: 6,
            moneySaved: 9,
            shortDescription: "Quick and easy recipe",
            steps: ["Prepare ingredients", "Cook and serve"],
            dishType: "Main Course",
        });
        setIngredients([
            { name: "Fresh ingredients", amount: "as needed", icon: "🥗" },
        ]);
    };

    const generateIngredientsFromSteps = (steps: string[]): Ingredient[] => {
        const commonIngredients = [
            { keywords: ["tomato", "tomatoes"], icon: "🍅" },
            { keywords: ["egg", "eggs"], icon: "🥚" },
            { keywords: ["cheese"], icon: "🧀" },
            { keywords: ["onion", "onions"], icon: "🧅" },
            { keywords: ["garlic"], icon: "🧄" },
            { keywords: ["pepper", "black pepper"], icon: "🌶️" },
            { keywords: ["salt"], icon: "🧂" },
            { keywords: ["oil", "olive oil"], icon: "🫒" },
            { keywords: ["butter"], icon: "🧈" },
            { keywords: ["pasta", "spaghetti"], icon: "🍝" },
            { keywords: ["rice"], icon: "🍚" },
            { keywords: ["chicken"], icon: "🐔" },
            { keywords: ["beef"], icon: "🥩" },
            { keywords: ["fish"], icon: "🐟" },
            { keywords: ["milk"], icon: "🥛" },
            { keywords: ["flour"], icon: "🌾" },
            { keywords: ["sugar"], icon: "🍯" },
            { keywords: ["lemon"], icon: "🍋" },
            { keywords: ["herb", "herbs", "parsley", "basil"], icon: "🌿" },
            { keywords: ["spice", "spices"], icon: "🧄" },
        ];

        const stepsText = steps.join(" ").toLowerCase();
        const foundIngredients: Ingredient[] = [];

        commonIngredients.forEach((ingredient) => {
            const found = ingredient.keywords.some(
                (keyword) => keyword && stepsText.includes(keyword.toLowerCase())
            );

            if (found) {
                const matchedKeyword =
                    ingredient.keywords.find(
                        (keyword) => keyword && stepsText.includes(keyword.toLowerCase())
                    ) || ingredient.keywords[0];

                foundIngredients.push({
                    name: matchedKeyword,
                    amount: "as needed",
                    icon: ingredient.icon,
                });
            }
        });

        if (foundIngredients.length === 0) {
            foundIngredients.push(
                { name: "Main ingredients", amount: "as needed", icon: "🥘" },
                { name: "Seasonings", amount: "to taste", icon: "🧂" },
                { name: "Fresh herbs", amount: "optional", icon: "🌿" }
            );
        }

        return foundIngredients;
    };

    const handleBack = () => {
        router.back();
    };

    const handleStartCooking = async () => {
        if (dishData?.videoURL) {
            try {
                const supported = await Linking.canOpenURL(dishData.videoURL);
                if (supported) {
                    await Linking.openURL(dishData.videoURL);
                } else {
                    console.log("Cannot open URL:", dishData.videoURL);
                    Alert.alert("Error", "Unable to open video");
                }
            } catch (error) {
                console.error("Error opening video:", error);
                Alert.alert("Error", "Failed to open video");
            }
        } else {
            Alert.alert("No Video", "Video tutorial not available for this recipe");
        }
    };

    const handleAddToFavorites = () => {
        setIsFavorite(!isFavorite);
        console.log(
            `${isFavorite ? "Removed from" : "Added to"} favorites:`,
            dishData?.name
        );
    };

    const renderIngredient = (ingredient: Ingredient, index: number) => {
        return (
            <View
                key={index}
                style={[
                    styles.ingredientItem,
                    {
                        backgroundColor: theme.colors.background.secondary + "80",
                        borderColor: theme.colors.border + "40",
                    },
                ]}
            >
                <Text style={styles.ingredientIcon}>{ingredient.icon}</Text>
                <View style={styles.ingredientInfo}>
                    <Text
                        style={[
                            styles.ingredientName,
                            { color: theme.colors.text.primary },
                        ]}
                    >
                        {ingredient.name}
                    </Text>
                    <Text
                        style={[
                            styles.ingredientAmount,
                            { color: theme.colors.text.secondary },
                        ]}
                    >
                        {ingredient.amount}
                    </Text>
                </View>
            </View>
        );
    };

    const renderInstructions = () => {
        if (!dishData?.steps || dishData.steps.length === 0) {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <Text style={styles.description}>
                        Detailed cooking instructions will be available when you start
                        cooking.
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions</Text>
                {dishData.steps.map((step, index) => (
                    <View key={index} style={styles.instructionStep}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={[styles.stepText, { color: "#FFFFFF" }]}>{step}</Text>
                    </View>
                ))}
            </View>
        );
    };

    if (!dishData) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.background.primary },
                ]}
            >
                <SafeAreaView style={styles.loadingContainer}>
                    <Text
                        style={[styles.loadingText, { color: theme.colors.text.primary }]}
                    >
                        Loading dish details...
                    </Text>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            <ImageBackground
                source={{ uri: dishData.image }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <MaskedView
                    style={styles.maskedBlur}
                    maskElement={
                        <LinearGradient
                            colors={["transparent", "black", "black"]}
                            style={styles.mask}
                            locations={[0, 0.3, 1]}
                        />
                    }
                >
                    <BlurView intensity={40} tint="dark" style={styles.blurView} />
                </MaskedView>

                <LinearGradient
                    colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
                    style={styles.darkOverlay}
                    locations={[0, 0.5, 1]}
                />

                <SafeAreaView style={styles.contentContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
                            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={handleAddToFavorites}
                        >
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={24}
                                color={isFavorite ? "#FF3366" : "#FFFFFF"}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}
                    >
                        <View style={styles.cultureContainer}>
                            <LinearGradient
                                colors={[
                                    theme.colors.accent.primary,
                                    theme.colors.accent.gradientEnd,
                                ]}
                                style={styles.cultureTag}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.cultureText}>
                                    {dishData.culture} Cuisine
                                </Text>
                            </LinearGradient>
                        </View>

                        <Text style={styles.dishName}>{dishData.name}</Text>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Ionicons name="restaurant-outline" size={16} color="#FFFFFF" />
                                <Text style={styles.infoText}>{dishData.dishType}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="globe-outline" size={16} color="#FFFFFF" />
                                <Text style={styles.infoText}>{dishData.culture}</Text>
                            </View>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Ionicons name="flame" size={16} color="#FF6B6B" />
                                <Text style={styles.statText}>{dishData.calories} cal</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="storefront-outline" size={16} color="#FF6B6B" />
                                <Text style={styles.statText}>${dishData.outdoorCost} out</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="home-outline" size={16} color="#4ECDC4" />
                                <Text style={styles.statText}>${dishData.homeCost} home</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="trending-down" size={16} color="#4ECDC4" />
                                <Text style={styles.statText}>Save ${dishData.moneySaved}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About this dish</Text>
                            <Text style={styles.description}>
                                {dishData.shortDescription ||
                                    `This delicious ${
                                        dishData.culture
                                    } ${dishData?.dishType?.toLowerCase()} is perfect for any occasion. Made with fresh ingredients and traditional techniques, it brings authentic flavors to your table.`}
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Ingredients</Text>
                                <Text style={styles.ingredientCount}>
                                    ({ingredients.length} items)
                                </Text>
                            </View>
                            <View style={styles.ingredientsList}>
                                {ingredients.map((ingredient, index) =>
                                    renderIngredient(ingredient, index)
                                )}
                            </View>
                        </View>

                        {renderInstructions()}

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.startCookingButton}
                                onPress={handleStartCooking}
                            >
                                <LinearGradient
                                    colors={[
                                        theme.colors.accent.gradientStart,
                                        theme.colors.accent.gradientEnd,
                                    ]}
                                    style={styles.buttonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Ionicons
                                        name="play-circle-outline"
                                        size={24}
                                        color="#FFFFFF"
                                    />
                                    <Text style={styles.buttonText}>
                                        {dishData?.videoURL ? "Watch Video Tutorial" : "Start Cooking"}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.bottomPadding} />
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
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
        backdropFilter: "blur(10px)",
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
        backdropFilter: "blur(10px)",
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