import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

import HomeScreen from '../screens/home/HomeScreen';
import RequestPickupScreen from '../screens/pickup/RequestPickupScreen';
import PickupDetailsFormScreen from '../screens/pickup/PickupDetailsFormScreen';
import ReviewPickupScreen from '../screens/pickup/ReviewPickupScreen';
import PickupPaymentScreen from '../screens/pickup/PickupPaymentScreen';
import PickupConfirmedScreen from '../screens/pickup/PickupConfirmedScreen';
import TrackPickupScreen from '../screens/pickup/TrackPickupScreen';
import PickupDetailScreen from '../screens/pickup/PickupDetailScreen';

import ChooseDropoffPointScreen from '../screens/dropoff/ChooseDropoffPointScreen';
import RecyclerDetailsScreen from '../screens/dropoff/RecyclerDetailsScreen';
import PlanVisitScreen from '../screens/dropoff/PlanVisitScreen';
import ReviewDropoffScreen from '../screens/dropoff/ReviewDropoffScreen';
import DropoffQRCodeScreen from '../screens/dropoff/DropoffQRCodeScreen';
import LogVisitScreen from '../screens/dropoff/LogVisitScreen';
import VisitLoggedScreen from '../screens/dropoff/VisitLoggedScreen';

import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ReferEarnScreen from '../screens/profile/ReferEarnScreen';
import ReferralHistoryScreen from '../screens/profile/ReferralHistoryScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';
import DeleteAccountScreen from '../screens/profile/DeleteAccountScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="RequestPickup" component={RequestPickupScreen} />
      <Stack.Screen name="PickupDetailsForm" component={PickupDetailsFormScreen} />
      <Stack.Screen name="ReviewPickup" component={ReviewPickupScreen} />
      <Stack.Screen name="PickupPayment" component={PickupPaymentScreen} />
      <Stack.Screen name="PickupConfirmed" component={PickupConfirmedScreen} />
      <Stack.Screen name="TrackPickup" component={TrackPickupScreen} />
      <Stack.Screen name="PickupDetail" component={PickupDetailScreen} />

      <Stack.Screen name="ChooseDropoffPoint" component={ChooseDropoffPointScreen} />
      <Stack.Screen name="RecyclerDetails" component={RecyclerDetailsScreen} />
      <Stack.Screen name="PlanVisit" component={PlanVisitScreen} />
      <Stack.Screen name="ReviewDropoff" component={ReviewDropoffScreen} />
      <Stack.Screen name="DropoffQRCode" component={DropoffQRCodeScreen} />
      <Stack.Screen name="LogVisit" component={LogVisitScreen} />
      <Stack.Screen name="VisitLogged" component={VisitLoggedScreen} />

      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ReferEarn" component={ReferEarnScreen} />
      <Stack.Screen name="ReferralHistory" component={ReferralHistoryScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    </Stack.Navigator>
  );
}
