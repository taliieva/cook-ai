import React from "react";
import { Text, View } from "react-native";
import { dishDetailStyles } from "../styles/dishDetailStyles";

type Props = {
    steps: string[];
};

export const InstructionsSection: React.FC<Props> = ({ steps }) => {
    if (!steps || steps.length === 0) {
        return (
            <View style={dishDetailStyles.section}>
                <Text style={dishDetailStyles.sectionTitle}>Instructions</Text>
                <Text style={dishDetailStyles.description}>
                    Detailed cooking instructions will be available when you start
                    cooking.
                </Text>
            </View>
        );
    }

    return (
        <View style={dishDetailStyles.section}>
            <Text style={dishDetailStyles.sectionTitle}>Instructions</Text>
            {steps.map((step, index) => (
                <View key={index} style={dishDetailStyles.instructionStep}>
                    <View style={dishDetailStyles.stepNumber}>
                        <Text style={dishDetailStyles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={[dishDetailStyles.stepText, { color: "#FFFFFF" }]}>
                        {step}
                    </Text>
                </View>
            ))}
        </View>
    );
};