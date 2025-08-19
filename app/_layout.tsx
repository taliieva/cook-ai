import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="choose-ingredients" />
      <Stack.Screen name="ai-intro" />
      <Stack.Screen name="surprise" />
      <Stack.Screen name="ingredients-search" />
      <Stack.Screen name="dishes" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}