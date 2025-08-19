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
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
        <View style={[
          styles.checkbox, 
          { borderColor: checked ? theme.colors.accent.primary : theme.colors.border },
          checked && { backgroundColor: theme.colors.accent.primary }
        ]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.textContainer}>
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
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    textAlign: 'center',
  },
  link: {
    fontWeight: '500',
  },
});
interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  linkText?: string;
  onLinkPress?: () => void;
}