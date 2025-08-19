import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function SignInScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Sign In
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Welcome back! Please sign in to continue.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});