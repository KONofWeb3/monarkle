import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import JobDetailScreen from '../screens/home/JobDetailScreen';
import ActiveJobScreen from '../screens/home/ActiveJobScreen';
import VerifyPickupScreen from '../screens/home/VerifyPickupScreen';
import JobCompleteScreen from '../screens/home/JobCompleteScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} />
      <Stack.Screen name="ActiveJob" component={ActiveJobScreen} />
      <Stack.Screen name="VerifyPickup" component={VerifyPickupScreen} />
      <Stack.Screen name="JobComplete" component={JobCompleteScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
