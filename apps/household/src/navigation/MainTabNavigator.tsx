import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabParamList } from './types';
import { colors, radius } from '../theme';

import HomeStackNavigator from './HomeStackNavigator';
import WalletStackNavigator from './WalletStackNavigator';
import RewardsStackNavigator from './RewardsStackNavigator';
import TrackStackNavigator from './TrackStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Wallet: { active: 'wallet', inactive: 'wallet-outline' },
  Rewards: { active: 'star', inactive: 'star-outline' },
  Track: { active: 'location', inactive: 'location-outline' },
};

function CenterFab() {
  const navigation = useNavigation<any>();
  return (
    <Pressable
      style={styles.fab}
      hitSlop={8}
      onPress={() => navigation.navigate('Home', { screen: 'RequestPickup', params: { intent: 'dispose' } })}
    >
      <Ionicons name="add" size={26} color={colors.textInverse} />
    </Pressable>
  );
}

export default function MainTabNavigator() {
  return (
    <View style={{ flex: 1 }}>
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
        <Tab.Screen name="Wallet" component={WalletStackNavigator} />
        <Tab.Screen name="Rewards" component={RewardsStackNavigator} />
        <Tab.Screen name="Track" component={TrackStackNavigator} />
      </Tab.Navigator>
      <CenterFab />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopColor: colors.divider,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
