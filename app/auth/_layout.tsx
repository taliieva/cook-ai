import { Stack } from "expo-router";
import React from "react";

/**
 * Auth Layout - Public Routes
 * 
 * Authentication screens accessible to all users
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe-back to prevent going back to protected routes
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen 
        name="sign-in" 
        options={{
          gestureEnabled: false, // No swipe back from login
        }}
      />
    </Stack>
  );
}

