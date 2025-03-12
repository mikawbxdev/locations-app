import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { LocationsProvider } from '@/contexts/LocationsContext';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { TopBar } from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <LocationsProvider>
      <View style={{ flex: 1 }}>
        <TopBar />
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>

      <Tabs.Screen
        name="locations"
        options={{
          title: 'Locations',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="mappin.and.ellipse" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-location"
        options={{
          title: 'Add Location',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="capitals"
        options={{
          title: 'Capitals',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="building.columns.fill" color={color} />,
        }}
      />

    </Tabs>
    </View>
    </LocationsProvider>
  );
}
