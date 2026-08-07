import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { MainTabParamList } from './types';
import { colors } from '../theme';

import HomeStackNavigator from './HomeStackNavigator';
import JobsStackNavigator from './JobsStackNavigator';
import EarningsScreen from '../screens/earnings/EarningsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Jobs: { active: 'briefcase', inactive: 'briefcase-outline' },
  Earnings: { active: 'wallet', inactive: 'wallet-outline' },
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          const set = icons[route.name as keyof MainTabParamList];
          return <Ionicons name={focused ? set.active : set.inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Jobs" component={JobsStackNavigator} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: { height: 64, paddingBottom: 8, paddingTop: 8, borderTopColor: colors.divider },
});
