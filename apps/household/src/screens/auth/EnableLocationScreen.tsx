import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PermissionScreen from './PermissionScreen';
import { colors } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'EnableLocation'>;

export default function EnableLocationScreen({ navigation }: Props) {
  const go = () => navigation.navigate('EnableNotifications');
  return (
    <PermissionScreen
      icon="location"
      iconBg={colors.infoBg}
      iconColor={colors.info}
      title="Enable Location"
      body="We use your location to quickly find your address when requesting a pickup."
      primaryLabel="Allow Location"
      onPrimary={go}
      onSkip={go}
    />
  );
}
