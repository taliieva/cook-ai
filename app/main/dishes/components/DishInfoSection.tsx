import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { dishDetailStyles } from "../styles/dishDetailStyles";

type Props = {
    culture: string;
    dishName: string;
    dishType: string;
    calories: number;
    outdoorCost: number;
    homeCost: number;
    moneySaved: number;
    shortDescription: string;
};

export const DishInfoSection: React.FC<Props> = ({
                                                     culture,
                                                     dishName,
                                                     dishType,
                                                     calories,
                                                     outdoorCost,
                                                     homeCost,
                                                     moneySaved,
                                                     shortDescription,
                                                 }) => {
    const theme = useTheme();

    return (
        <>
            <View style={dishDetailStyles.cultureContainer}>
                <LinearGradient
                    colors={[
                        theme.colors.accent.primary,
                        theme.colors.accent.gradientEnd,
                    ]}
                    style={dishDetailStyles.cultureTag}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={dishDetailStyles.cultureText}>{culture} Cuisine</Text>
                </LinearGradient>
            </View>

            <Text style={dishDetailStyles.dishName}>{dishName}</Text>

            <View style={dishDetailStyles.infoRow}>
                <View style={dishDetailStyles.infoItem}>
                    <Ionicons name="restaurant-outline" size={16} color="#FFFFFF" />
                    <Text style={dishDetailStyles.infoText}>{dishType}</Text>
                </View>
                <View style={dishDetailStyles.infoItem}>
                    <Ionicons name="globe-outline" size={16} color="#FFFFFF" />
                    <Text style={dishDetailStyles.infoText}>{culture}</Text>
                </View>
            </View>

            <View style={dishDetailStyles.statsRow}>
                <View style={dishDetailStyles.statItem}>
                    <Ionicons name="flame" size={16} color="#FF6B6B" />
                    <Text style={dishDetailStyles.statText}>{calories} cal</Text>
                </View>
                <View style={dishDetailStyles.statItem}>
                    <Ionicons name="storefront-outline" size={16} color="#FF6B6B" />
                    <Text style={dishDetailStyles.statText}>${outdoorCost} out</Text>
                </View>
                <View style={dishDetailStyles.statItem}>
                    <Ionicons name="home-outline" size={16} color="#4ECDC4" />
                    <Text style={dishDetailStyles.statText}>${homeCost} home</Text>
                </View>
                <View style={dishDetailStyles.statItem}>
                    <Ionicons name="trending-down" size={16} color="#4ECDC4" />
                    <Text style={dishDetailStyles.statText}>Save ${moneySaved}</Text>
                </View>
            </View>

            <View style={dishDetailStyles.section}>
                <Text style={dishDetailStyles.sectionTitle}>About this dish</Text>
                <Text style={dishDetailStyles.description}>
                    {shortDescription ||
                        `This delicious ${culture} ${dishType.toLowerCase()} is perfect for any occasion. Made with fresh ingredients and traditional techniques, it brings authentic flavors to your table.`}
                </Text>
            </View>
        </>
    );
};