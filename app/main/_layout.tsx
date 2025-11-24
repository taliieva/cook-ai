import { Stack } from "expo-router";
import React from "react";

/**
 * Main App Layout - Protected Routes
 * 
 * All routes under /main/ require authentication
 * This layout is wrapped by AuthGuard in the root layout
 */
export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe-back gestures
        animation: "fade",
      }}
    >
      <Stack.Screen 
        name="home" 
        options={{
          gestureEnabled: false, // Explicitly disable for home
        }}
      />
      <Stack.Screen 
        name="dishes/index" 
        options={{
          gestureEnabled: true, // Allow swipe back within app
        }}
      />
      <Stack.Screen 
        name="dishes/[id]" 
        options={{
          gestureEnabled: true, // Allow swipe back within app
        }}
      />
      <Stack.Screen 
        name="recipes/LikedRecipes" 
        options={{
          gestureEnabled: true, // Allow swipe back within app
        }}
      />
      <Stack.Screen 
        name="recipes/SavedRecipes" 
        options={{
          gestureEnabled: true, // Allow swipe back within app
        }}
      />
      <Stack.Screen 
        name="insight/index" 
        options={{
          gestureEnabled: true, // Allow swipe back within app
        }}
      />
      <Stack.Screen 
        name="subscription" 
        options={{
          gestureEnabled: true, // Allow swipe back within app
        }}
      />
    </Stack>
  );
}

