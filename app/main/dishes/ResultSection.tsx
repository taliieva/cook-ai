import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ResultsSectionProps {
  isLoading: boolean;
  dishesCount: number;
  totalDishes: number;
  summary?: string;
  theme: any;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  isLoading,
  dishesCount,
  totalDishes,
  summary,
  theme
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderSummaryText = (text: string) => {
    if (!text) return null;

    const words = text.split(' ');
    const maxWords = 20;
    const shouldTruncate = words.length > maxWords;
    
    const displayText = isExpanded ? text : words.slice(0, maxWords).join(' ');
    
    return (
      <View>
        <Text style={[styles.summaryText, { color: theme.colors.text.secondary }]}>
          {displayText}
          {!isExpanded && shouldTruncate && '...'}
        </Text>
        {shouldTruncate && (
          <TouchableOpacity 
            onPress={() => setIsExpanded(!isExpanded)}
            style={styles.readMoreButton}
          >
            <Text style={[styles.readMoreText, { color: theme.colors.accent.primary }]}>
              {isExpanded ? 'Read less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.resultsSection}>
      <Text
        style={[styles.resultsText, { color: theme.colors.text.secondary }]}
      >
        {isLoading
          ? `Generating ${totalDishes} personalized recipes...`
          : `${dishesCount} delicious dishes found`
        }
      </Text>
      {summary && !isLoading && renderSummaryText(summary)}
    </View>
  );
};

const styles = StyleSheet.create({
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
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
