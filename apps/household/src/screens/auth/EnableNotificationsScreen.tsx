import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import PermissionScreen from './PermissionScreen';
import { colors } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'EnableNotifications'>;

// Note: this requests the real OS permission so the prompt matches what the
// screen claims, but no push-sending backend exists yet — MONARKLE doesn't
// register a push token or send anything through this permission today.
// Wiring that up (Expo push tokens + a send path from pickup/wallet events)
// is a separate, larger piece of work.
export default function EnableNotificationsScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const go = () => navigation.navigate('AllSet');

  const onAllow = async () => {
    setLoading(true);
    try {
      await Notifications.requestPermissionsAsync();
    } finally {
      setLoading(false);
      go();
    }
  };

  return (
    <PermissionScreen
      icon="notifications"
      iconBg={colors.warningBg}
      iconColor={colors.warning}
      title="Stay Updated"
      body="Get notified when your pickup is assigned, on the way, or completed."
      primaryLabel="Allow Notifications"
      primaryLoading={loading}
      onPrimary={onAllow}
      onSkip={go}
    />
  );
}
