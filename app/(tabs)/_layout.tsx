import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Hide the default tab layout header
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          default: {
            borderTopWidth: 1,
            borderTopColor: '#ccc',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recent News',
          headerShown: true, // Enable header just for this screen
          headerTitle: 'Recent News',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: true, // Enable header just for this screen
          headerTitle: 'Search News',
          tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile-menu"
        options={{
          title: 'Profile',
          headerShown: true, // Enable header just for this screen
          headerTitle: 'My Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
      {/* Hide [id].tsx from the tab bar but keep it in the same navigator group */}
      <Tabs.Screen 
        name="[id]"
        options={{
          href: null, // This prevents it from showing in the tab bar
          headerShown: true,
          headerTitle: 'News Detail',
        }}
      />
    </Tabs>
  );
}
