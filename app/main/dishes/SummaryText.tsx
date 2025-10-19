import { styles } from "@/styles/screenStyles";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    text: string;
    onReadMore: () => void;
};

export const SummaryText: React.FC<Props> = ({ text, onReadMore }) => {
    return (
        <View style={styles.resultsSection}>
            <Text style={styles.resultsText}>Summary</Text>
            <Text style={styles.summaryText}>{text}</Text>
            <TouchableOpacity style={styles.readMoreButton} onPress={onReadMore}>
                <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
        </View>
    );
};