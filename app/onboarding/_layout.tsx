import { Stack } from "expo-router";
import React from "react";

/**
 * Onboarding Layout - Public Routes
 * 
 * Welcome and onboarding question screens accessible to all users
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe-back from onboarding
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen 
        name="welcome" 
        options={{
          gestureEnabled: false, // No swipe back from welcome
        }}
      />
      <Stack.Screen 
        name="questions/CookingExperienceScreen" 
        options={{
          gestureEnabled: true, // Allow back within onboarding flow
        }}
      />
      <Stack.Screen 
        name="questions/AgeScreen" 
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="questions/CookingModeScreen" 
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="questions/CuisinePreferenceScreen" 
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="questions/IngredientsAvailableScreen" 
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}

