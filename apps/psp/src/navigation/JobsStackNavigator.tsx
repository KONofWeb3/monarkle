import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobsStackParamList } from './types';
import JobsScreen from '../screens/jobs/JobsScreen';
import JobHistoryDetailScreen from '../screens/jobs/JobHistoryDetailScreen';

const Stack = createNativeStackNavigator<JobsStackParamList>();

export default function JobsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsMain" component={JobsScreen} />
      <Stack.Screen name="JobHistoryDetail" component={JobHistoryDetailScreen} />
    </Stack.Navigator>
  );
}
