import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
  textStyle
}) => {
  const theme = useTheme();

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={[styles.buttonContainer, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled}
      >
        <LinearGradient
          colors={disabled 
            ? [theme.baseColors.gray300, theme.baseColors.gray300]
            : [theme.colors.accent.gradientStart, theme.colors.accent.gradientEnd]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={[
            styles.buttonText,
            theme.typography.button.primary,
            disabled && { color: theme.baseColors.gray400 },
            textStyle
          ]}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        styles.secondaryButton,
        { borderColor: theme.colors.border },
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.buttonText,
        { color: theme.colors.text.primary },
        disabled && { color: theme.baseColors.gray400 },
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});