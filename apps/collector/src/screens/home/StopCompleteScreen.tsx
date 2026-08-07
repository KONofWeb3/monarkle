import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'StopComplete'>;

export default function StopCompleteScreen({ navigation, route: navRoute }: Props) {
  const { route, goToNextStop } = useAppState();
  const stop = route.stops.find((s) => s.id === navRoute.params.stopId);
  if (!stop) return null;

  const nextStop = route.stops.find((s) => s.sequence === stop.sequence + 1);

  const onContinue = () => {
    goToNextStop();
    if (nextStop) navigation.replace('StopDetail', { stopId: nextStop.id });
    else navigation.replace('RouteComplete');
  };

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={32} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>Collection verified!</Text>
        <Text style={styles.subtitle}>{stop.weightKg}kg of {stop.category} recorded for {stop.customerName}</Text>
      </View>
      <View style={styles.footer}>
        <Button label={nextStop ? `Next stop (${nextStop.sequence} of ${route.stops.length})` : 'Finish route'} onPress={onContinue} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  checkCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textBody, marginTop: spacing.xs, textAlign: 'center', paddingHorizontal: spacing.xl },
  footer: { paddingBottom: spacing.xl },
});
