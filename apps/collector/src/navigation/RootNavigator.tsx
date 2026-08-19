import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useAppState } from '../data/AppContext';
import { colors } from '../theme';

export default function RootNavigator() {
  const { isAuthenticated, isInitializing } = useAppState();

  if (isInitializing) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
