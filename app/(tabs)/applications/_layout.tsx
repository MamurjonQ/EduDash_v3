import { Stack } from "expo-router";
import React from "react";

import Colors from "@/constants/colors";

const c = Colors.dark;

export default function ApplicationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.text,
        headerTitleStyle: { fontWeight: "700" as const },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Applications" }} />
    </Stack>
  );
}
