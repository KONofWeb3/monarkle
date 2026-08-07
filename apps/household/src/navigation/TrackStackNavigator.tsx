import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrackStackParamList } from './types';
import MyPickupsScreen from '../screens/track/MyPickupsScreen';
import PickupDetailScreen from '../screens/pickup/PickupDetailScreen';

const Stack = createNativeStackNavigator<TrackStackParamList>();

export default function TrackStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyPickups" component={MyPickupsScreen} />
      <Stack.Screen name="PickupDetail" component={PickupDetailScreen as never} />
    </Stack.Navigator>
  );
}
