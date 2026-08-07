import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PermissionScreen from './PermissionScreen';
import { colors } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'EnableNotifications'>;

export default function EnableNotificationsScreen({ navigation }: Props) {
  const go = () => navigation.navigate('AllSet');
  return (
    <PermissionScreen
      icon="notifications"
      iconBg={colors.warningBg}
      iconColor={colors.warning}
      title="Stay Updated"
      body="Get notified when your pickup is assigned, on the way, or completed."
      primaryLabel="Allow Notifications"
      onPrimary={go}
      onSkip={go}
    />
  );
}
