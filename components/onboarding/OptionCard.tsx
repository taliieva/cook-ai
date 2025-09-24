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
}: any) => {
  const theme = useTheme();
  const scaleAnim = new Animated.Value(isSelected ? 1 : 0.99);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1 : 0.99,
      useNativeDriver: true,
      tension: 400,
      friction: 8,
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
            end={{ x: 1, y: 0.8 }}
          />

          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Main Content Row */}
            <View style={styles.mainRow}>
              {/* Left Side: Icon and Text */}
              <View style={styles.leftContent}>
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

              {/* Right Side: Selection Indicator */}
              <View style={[
                styles.radioButton,
                isSelected && styles.radioButtonSelected
              ]}>
                {isSelected && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </View>
          </View>

          {/* Subtle Selection Border */}
          {isSelected && (
            <View style={styles.selectionBorder} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 8,
    alignSelf: 'center',
    width: '95%',
    maxWidth: 450,
  },
  touchable: {
    borderRadius: 14,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    position: 'relative',
  },
  selectedCard: {
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
    minHeight: 80,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  icon: {
    fontSize: 16,
  },
  selectedIcon: {
    // Icon color remains the same for emoji
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    lineHeight: 18,
    marginBottom: 2,
  },
  selectedTitle: {
    color: '#FFFFFF',
  },
  cardDescription: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 16,
    fontWeight: '400',
  },
  selectedDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioButtonSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  selectionBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    pointerEvents: 'none',
  },
});