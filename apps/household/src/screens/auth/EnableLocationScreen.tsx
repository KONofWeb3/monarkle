import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import PermissionScreen from './PermissionScreen';
import { colors } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'EnableLocation'>;

export default function EnableLocationScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const go = () => navigation.navigate('EnableNotifications');

  const onAllow = async () => {
    setLoading(true);
    try {
      // We don't need the result here — this screen exists purely to prompt
      // for the permission early. Whether it's granted or denied, the pickup
      // flow's "Use my GPS location" button re-checks and re-prompts itself.
      await Location.requestForegroundPermissionsAsync();
    } finally {
      setLoading(false);
      go();
    }
  };

  return (
    <PermissionScreen
      icon="location"
      iconBg={colors.infoBg}
      iconColor={colors.info}
      title="Enable Location"
      body="We use your location to quickly find your address when requesting a pickup."
      primaryLabel="Allow Location"
      primaryLoading={loading}
      onPrimary={onAllow}
      onSkip={go}
    />
  );
}
