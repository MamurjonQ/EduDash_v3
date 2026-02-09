import { Stack, useRouter } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";

const c = Colors.dark;

export default function SchoolLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.text,
        headerTitleStyle: { fontWeight: "700" as const },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "School",
          headerRight: () => (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(tabs)/inbox");
              }}
              style={headerStyles.inboxBtn}
            >
              <MessageCircle size={20} color={c.textSecondary} />
              <View style={headerStyles.badge}>
                <Text style={headerStyles.badgeText}>2</Text>
              </View>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}

const headerStyles = StyleSheet.create({
  inboxBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: c.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: c.danger,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700" as const,
  },
});
