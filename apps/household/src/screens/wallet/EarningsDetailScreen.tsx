import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import StatusBadge, { StatusKind } from '../../components/StatusBadge';
import { colors, spacing, typography } from '../../theme';
import { WalletStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { Payout } from '../../data/types';

type Props = NativeStackScreenProps<WalletStackParamList, 'EarningsDetail'>;
const statusMap: Record<Payout['status'], StatusKind> = { paid: 'paid', pending: 'pending', failed: 'failed' };

export default function EarningsDetailScreen({ route }: Props) {
  const { payouts } = useAppState();
  const payout = payouts.find((p) => p.id === route.params.payoutId);
  if (!payout) return null;

  const rate = Math.round(payout.amount / payout.weightKg);
  const commission = Math.round(payout.amount * 0.02);

  return (
    <ScreenContainer scroll>
      <Header title="Earnings detail" right={<StatusBadge status={statusMap[payout.status]} />} />
      <Card style={{ marginTop: spacing.lg }}>
        <Row label="Pickup ID" value={`#${payout.pickupCode}`} />
        <Row label="Date" value={payout.date} />
        <Row label="Category" value={payout.category} />
        <Row label="Rate" value={`₦${rate}/kg`} />
        <Row label="Weight" value={`${payout.weightKg} kg`} />
        <Row label="Gross" value={`₦${payout.amount.toLocaleString()}`} />
        <Row label="Commission (2%)" value={`₦${commission.toLocaleString()}`} />
        <Row label="Net paid" value={`₦${(payout.amount - commission).toLocaleString()}`} bold />
        <Row label="Bank" value={payout.bank} />
        <Row label="Status" value={payout.status === 'paid' ? 'Transferred' : payout.status === 'pending' ? 'Processing' : 'Failed'} />
      </Card>
    </ScreenContainer>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && { fontFamily: typography.h4.fontFamily }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.captionMedium, color: colors.textPrimary },
});
