import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import ProgressBar from '../../components/ProgressBar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'ReviewPickup'>;

const SERVICE_FEE = 1500;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function ReviewPickupScreen({ navigation }: Props) {
  const { pickupDraft } = useAppState();

  return (
    <ScreenContainer scroll>
      <Header title="Review your request" />
      <ProgressBar progress={0.75} />

      <Card style={{ marginTop: spacing.xl }}>
        <Row label="Intent" value={pickupDraft?.intent ?? 'Dispose'} />
        <Row label="Category" value={pickupDraft?.category ?? 'Plastic'} />
        <Row label="Quantity" value={pickupDraft?.quantity ?? 'Medium'} />
        <Row label="Address" value={pickupDraft?.address ?? '-'} />
        <Row label="Date" value={pickupDraft?.date ?? '-'} />
        <Row label="Time" value={pickupDraft?.time ?? '-'} />
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Service fee</Text>
          <Text style={styles.feeValue}>₦{SERVICE_FEE.toLocaleString()}</Text>
        </View>
        <Text style={styles.feeHint}>Charged upon confirmation</Text>
      </Card>

      <Button
        label={`Proceed to payment · ₦${SERVICE_FEE.toLocaleString()}`}
        onPress={() => navigation.navigate('PickupPayment')}
        style={{ marginTop: spacing.xxl, marginBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyMedium, color: colors.textPrimary },
  feeValue: { ...typography.h4, color: colors.textPrimary },
  feeHint: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
