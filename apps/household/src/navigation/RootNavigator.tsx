import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useAppState } from '../data/AppContext';

export default function RootNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const { hasOnboarded, isAuthenticated } = useAppState();

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  if (!hasOnboarded) {
    return <OnboardingScreen onDone={() => {}} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
