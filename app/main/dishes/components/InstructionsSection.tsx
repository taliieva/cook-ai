import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { dishDetailStyles } from "../styles/dishDetailStyles";
import { getInstructionIcons } from "../utils/instructionIconHelper";

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

    // Get dynamic icons for each instruction
    const instructionIcons = getInstructionIcons(steps);

    return (
        <View style={dishDetailStyles.section}>
            <Text style={dishDetailStyles.sectionTitle}>Instructions</Text>
            {steps.map((step, index) => {
                const iconData = instructionIcons[index];
                return (
                    <View key={index} style={dishDetailStyles.instructionStep}>
                        <View style={[dishDetailStyles.stepNumber, { backgroundColor: iconData.color + '20', borderColor: iconData.color }]}>
                            <Ionicons 
                                name={iconData.name as any} 
                                size={18} 
                                color={iconData.color} 
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={[dishDetailStyles.stepText, { color: "#FFFFFF" }]}>
                                <Text style={{ fontWeight: '700', color: iconData.color }}>
                                    Step {index + 1}:{' '}
                                </Text>
                                {step}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};