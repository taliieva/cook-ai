import { useTheme } from '@/hooks/useTheme';
import { default as React } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  linkText?: string;
  onLinkPress?: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onPress,
  linkText,
  onLinkPress
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[
        styles.checkbox, 
        { borderColor: checked ? theme.colors.accent.primary : theme.colors.border },
        checked && { backgroundColor: theme.colors.accent.primary }
      ]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[
        styles.label, 
        theme.typography.body.small,
        { color: theme.colors.text.secondary }
      ]}>
        {label}
        {linkText && (
          <Text 
            style={[styles.link, { color: theme.colors.accent.primary }]}
            onPress={onLinkPress}
          >
            {linkText}
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12, // Slightly increased for better spacing
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    // Removed flex: 1 to prevent text from taking full width
    // Text will now only take the space it needs
  },
  link: {
    fontWeight: '500',
  },
});