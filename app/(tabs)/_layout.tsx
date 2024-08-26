import { Tabs } from "expo-router";
import React from "react";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              color="black"
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={28}
              color={"#000"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
