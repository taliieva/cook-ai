import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export const SignInLink: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const handleSignIn = () => {
    router.push('/auth/sign-in');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleSignIn}>
      <Text style={[
        styles.text,
        theme.typography.body.medium,
        { color: theme.colors.text.secondary }
      ]}>
        Already have an account?{' '}
        <Text style={[styles.link, { color: theme.colors.accent.primary }]}>
          Sign in
        </Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  text: {
    textAlign: 'center',
  },
  link: {
    fontWeight: '500',
  },
});