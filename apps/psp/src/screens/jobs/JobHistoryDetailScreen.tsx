import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import StatusBadge, { StatusKind } from '../../components/StatusBadge';
import { colors, spacing, typography } from '../../theme';
import { JobsStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { JobStatus } from '../../data/types';

type Props = NativeStackScreenProps<JobsStackParamList, 'JobHistoryDetail'>;
const statusMap: Record<JobStatus, StatusKind> = {
  available: 'pending', accepted: 'assigned', enRoute: 'inProgress', arrived: 'inProgress',
  completed: 'completed', declined: 'cancelled', cancelled: 'cancelled',
};

export default function JobHistoryDetailScreen({ route }: Props) {
  const { jobHistory } = useAppState();
  const job = jobHistory.find((j) => j.id === route.params.jobId);
  if (!job) return null;

  return (
    <ScreenContainer scroll>
      <Header title={`#${job.code}`} right={<StatusBadge status={statusMap[job.status]} />} />
      <Card>
        <Row label="Customer" value={job.customerName} />
        <Row label="Category" value={job.category} />
        <Row label="Quantity" value={job.quantity} />
        <Row label="Address" value={job.address} />
        <Row label="Date" value={`${job.scheduledDate} · ${job.scheduledTime}`} />
        {job.weightKg && <Row label="Weight collected" value={`${job.weightKg} kg`} />}
        <Row label="Payout" value={`₦${job.payout.toLocaleString()}`} />
      </Card>
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.captionMedium, color: colors.textPrimary },
});
