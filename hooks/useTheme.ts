import { colors } from '@/constants/Colors';
import { typography } from '@/constants/Typography';
import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    colors: colors.semantic[isDark ? 'dark' : 'light'],
    baseColors: colors.base,
    typography: typography[isDark ? 'dark' : 'light'],
    isDark,
  };
};