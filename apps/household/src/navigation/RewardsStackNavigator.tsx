import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RewardsStackParamList } from './types';
import RewardsScreen from '../screens/rewards/RewardsScreen';
import PointsHistoryScreen from '../screens/rewards/PointsHistoryScreen';
import RedeemAirtimeScreen from '../screens/rewards/RedeemAirtimeScreen';
import RedeemConfirmedScreen from '../screens/rewards/RedeemConfirmedScreen';

const Stack = createNativeStackNavigator<RewardsStackParamList>();

export default function RewardsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RewardsMain" component={RewardsScreen} />
      <Stack.Screen name="PointsHistory" component={PointsHistoryScreen} />
      <Stack.Screen name="RedeemAirtime" component={RedeemAirtimeScreen} />
      <Stack.Screen name="RedeemConfirmed" component={RedeemConfirmedScreen} />
    </Stack.Navigator>
  );
}
