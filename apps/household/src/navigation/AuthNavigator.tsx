import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import VerifyPhoneScreen from '../screens/auth/VerifyPhoneScreen';
import SetupProfileScreen from '../screens/auth/SetupProfileScreen';
import EnableLocationScreen from '../screens/auth/EnableLocationScreen';
import EnableNotificationsScreen from '../screens/auth/EnableNotificationsScreen';
import AllSetScreen from '../screens/auth/AllSetScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ForgotPasswordVerifyScreen from '../screens/auth/ForgotPasswordVerifyScreen';
import CreateNewPasswordScreen from '../screens/auth/CreateNewPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="CreateAccount">
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
      <Stack.Screen name="SetupProfile" component={SetupProfileScreen} />
      <Stack.Screen name="EnableLocation" component={EnableLocationScreen} />
      <Stack.Screen name="EnableNotifications" component={EnableNotificationsScreen} />
      <Stack.Screen name="AllSet" component={AllSetScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ForgotPasswordVerify" component={ForgotPasswordVerifyScreen} />
      <Stack.Screen name="CreateNewPassword" component={CreateNewPasswordScreen} />
    </Stack.Navigator>
  );
}
