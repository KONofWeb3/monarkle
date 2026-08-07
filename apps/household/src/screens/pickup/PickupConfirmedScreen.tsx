import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'PickupConfirmed'>;

export default function PickupConfirmedScreen({ navigation, route }: Props) {
  const { pickups } = useAppState();
  const pickup = pickups.find((p) => p.id === route.params.pickupId);

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={32} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>Pickup confirmed!</Text>
        <Text style={styles.subtitle}>Your payment is confirmed and your pickup is scheduled</Text>

        <Card style={{ width: '100%', marginTop: spacing.xl }}>
          <View style={styles.row}><Text style={styles.rowLabel}>Amount paid</Text><Text style={styles.rowValue}>₦{pickup?.serviceFee.toLocaleString() ?? '1,500'}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Reference</Text><Text style={styles.rowValue}>PST-{pickup?.code ?? '2026-6491'}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Pickup ID</Text><Text style={styles.rowValue}>{pickup?.code ?? '-'}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Rewards earned</Text><Text style={styles.rowValue}>+50 pts on completion</Text></View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button label="Track my pickup" onPress={() => navigation.replace('TrackPickup', { pickupId: route.params.pickupId })} />
        <Button label="Cancel and go back" variant="ghost" onPress={() => navigation.navigate('HomeMain')} style={{ marginTop: spacing.sm }} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', paddingTop: spacing.xxxl },
  checkCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyMedium, color: colors.textPrimary },
  footer: { paddingBottom: spacing.xl },
});
