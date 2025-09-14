import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const OptionCard = ({
  title,
  description,
  isSelected,
  onPress,
  icon,
}) => {
  const theme = useTheme();
  const scaleAnim = new Animated.Value(isSelected ? 1 : 0.98);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1 : 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <View style={[
          styles.card, 
          isSelected && styles.selectedCard
        ]}>
          {/* Background Gradient */}
          <LinearGradient
            colors={
              isSelected
                ? ["#FF6B6B", "#FF8E53"]
                : ["#FFFFFF", "#F8F9FA"]
            }
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Icon and Check Row */}
            <View style={styles.topRow}>
              {icon && (
                <View style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer
                ]}>
                  <Text style={[
                    styles.icon,
                    isSelected && styles.selectedIcon
                  ]}>{icon}</Text>
                </View>
              )}
              
              <View style={[
                styles.checkmark,
                isSelected && styles.checkmarkSelected
              ]}>
                {isSelected && (
                  <View style={styles.checkmarkInner}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={[
                styles.cardTitle,
                isSelected && styles.selectedTitle
              ]}>
                {title}
              </Text>

              {description && (
                <Text style={[
                  styles.cardDescription,
                  isSelected && styles.selectedDescription
                ]}>
                  {description}
                </Text>
              )}
            </View>
          </View>

          {/* Selection Indicator */}
          {isSelected && (
            <View style={styles.selectionIndicator} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  touchable: {
    borderRadius: 20,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  selectedCard: {
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 24,
  },
  selectedIcon: {
    // Icon color remains the same for emoji
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  checkmarkInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 26,
  },
  selectedTitle: {
    color: '#FFFFFF',
  },
  cardDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    fontWeight: '400',
  },
  selectedDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});