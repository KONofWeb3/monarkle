import React, { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'JobDetail'>;

export default function JobDetailScreen({ navigation, route }: Props) {
  const { availableJobs, acceptJob, declineJob } = useAppState();
  const job = availableJobs.find((j) => j.id === route.params.jobId);
  const [busy, setBusy] = useState<'accept' | 'decline' | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!job) return null;

  const onAccept = async () => {
    setBusy('accept');
    setError(null);
    try {
      await acceptJob(job.id);
      navigation.replace('ActiveJob');
    } catch (e: any) {
      setError(e.message ?? 'Could not accept this job — it may have just been taken.');
      setBusy(null);
    }
  };

  const onDecline = async () => {
    setBusy('decline');
    setError(null);
    try {
      await declineJob(job.id);
      navigation.goBack();
    } catch (e: any) {
      setError(e.message ?? 'Could not decline this job');
      setBusy(null);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Job request" />

      <Card>
        <View style={styles.row}><Text style={styles.rowLabel}>Customer</Text><Text style={styles.rowValue}>{job.customerName}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Category</Text><Text style={styles.rowValue}>{job.category}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Quantity</Text><Text style={styles.rowValue}>{job.quantity}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Address</Text><Text style={styles.rowValue}>{job.address}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Distance</Text><Text style={styles.rowValue}>{job.distanceKm} km</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Scheduled</Text><Text style={styles.rowValue}>{job.scheduledDate} · {job.scheduledTime}</Text></View>
      </Card>

      <Card style={{ marginTop: spacing.lg, alignItems: 'center' }}>
        <Text style={styles.payoutLabel}>You&apos;ll earn</Text>
        <Text style={styles.payoutValue}>₦{job.payout.toLocaleString()}</Text>
      </Card>

      <View style={styles.infoBanner}>
        <Ionicons name="call-outline" size={16} color={colors.info} />
        <Text style={styles.infoText} onPress={() => Linking.openURL(`tel:0000000000`)}>Contact customer before heading out</Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        label="Accept job"
        loading={busy === 'accept'}
        disabled={busy !== null}
        onPress={onAccept}
        style={{ marginTop: spacing.xl }}
      />
      <Button
        label="Decline"
        variant="outline"
        loading={busy === 'decline'}
        disabled={busy !== null}
        onPress={onDecline}
        style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.captionMedium, color: colors.textPrimary },
  payoutLabel: { ...typography.caption, color: colors.textSecondary },
  payoutValue: { ...typography.h1, color: colors.primary, marginTop: 4 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.infoBg, borderRadius: 12, padding: spacing.md, marginTop: spacing.lg },
  infoText: { ...typography.caption, color: colors.info, marginLeft: spacing.sm },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.lg },
});
