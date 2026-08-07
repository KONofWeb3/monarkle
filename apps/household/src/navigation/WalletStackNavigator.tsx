import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletStackParamList } from './types';
import WalletScreen from '../screens/wallet/WalletScreen';
import EarningsDetailScreen from '../screens/wallet/EarningsDetailScreen';
import EarningsHistoryScreen from '../screens/wallet/EarningsHistoryScreen';
import AddBankAccountScreen from '../screens/wallet/AddBankAccountScreen';

const Stack = createNativeStackNavigator<WalletStackParamList>();

export default function WalletStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WalletMain" component={WalletScreen} />
      <Stack.Screen name="EarningsDetail" component={EarningsDetailScreen} />
      <Stack.Screen name="EarningsHistory" component={EarningsHistoryScreen} />
      <Stack.Screen name="AddBankAccount" component={AddBankAccountScreen} />
    </Stack.Navigator>
  );
}
