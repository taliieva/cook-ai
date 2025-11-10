import { Stack } from "expo-router";
import React from "react";

/**
 * Paywall Layout - Payment/Subscription screens
 * 
 * Shown after onboarding completion
 * User cannot swipe back to onboarding from here
 */
export default function PaywallLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe-back to prevent returning to onboarding
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          gestureEnabled: false, // No swipe back from paywall
        }}
      />
    </Stack>
  );
}

