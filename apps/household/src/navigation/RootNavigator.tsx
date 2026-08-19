import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useAppState } from '../data/AppContext';

export default function RootNavigator() {
  const { isInitializing, hasOnboarded, isAuthenticated } = useAppState();

  if (isInitializing) {
    return <SplashScreen />;
  }

  if (!isAuthenticated && !hasOnboarded) {
    return <OnboardingScreen onDone={() => {}} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
