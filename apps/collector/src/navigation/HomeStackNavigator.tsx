import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import StopDetailScreen from '../screens/home/StopDetailScreen';
import VerifyCollectionScreen from '../screens/home/VerifyCollectionScreen';
import StopCompleteScreen from '../screens/home/StopCompleteScreen';
import RouteCompleteScreen from '../screens/home/RouteCompleteScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="StopDetail" component={StopDetailScreen} />
      <Stack.Screen name="VerifyCollection" component={VerifyCollectionScreen} />
      <Stack.Screen name="StopComplete" component={StopCompleteScreen} />
      <Stack.Screen name="RouteComplete" component={RouteCompleteScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
