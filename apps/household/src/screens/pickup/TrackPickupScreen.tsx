import React from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import { useAppState } from '../../data/AppContext';
import { HomeStackParamList } from '../../navigation/types';
import PickupDetailView from './PickupDetailView';
import { typography } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'TrackPickup'>;

export default function TrackPickupScreen({ route }: Props) {
  const { pickups } = useAppState();
  const pickup = pickups.find((p) => p.id === route.params.pickupId);

  if (!pickup) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={typography.body}>Pickup not found</Text>
        </View>
      </ScreenContainer>
    );
  }

  return <PickupDetailView pickup={pickup} />;
}
