import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timeline from '../../components/Timeline';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'ActiveJob'>;

export default function ActiveJobScreen({ navigation }: Props) {
  const { activeJob, advanceActiveJob } = useAppState();
  // The backend only distinguishes accepted/en-route/completed — "arrived" is
  // a client-only sub-state of en-route (gates the "start verification" step)
  // rather than something that round-trips through the API.
  const [arrived, setArrived] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeJob) navigation.replace('HomeMain');
  }, [activeJob, navigation]);

  if (!activeJob) {
    return null;
  }

  const steps = [
    { label: 'Job accepted', state: 'done' as const },
    { label: 'On the way', state: (activeJob.status === 'enRoute' || arrived ? 'done' : 'pending') as 'done' | 'pending' },
    { label: 'Arrived at pickup', state: (arrived ? 'done' : 'pending') as 'done' | 'pending' },
  ];

  const primaryLabel = activeJob.status === 'accepted'
    ? "I'm on my way"
    : arrived
      ? 'Start verification'
      : "I've arrived";

  const onPrimary = async () => {
    if (activeJob.status === 'accepted') {
      setBusy(true);
      setError(null);
      try {
        await advanceActiveJob();
      } catch (e: any) {
        setError(e.message ?? 'Could not update job status');
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!arrived) {
      setArrived(true);
      return;
    }
    navigation.navigate('VerifyPickup');
  };

  return (
    <ScreenContainer scroll>
      <Header title={`#${activeJob.code}`} />

      <View style={styles.mapPlaceholder}>
        <Ionicons name="navigate" size={28} color={colors.primary} />
        <Text style={styles.mapText}>{activeJob.distanceKm} km to pickup</Text>
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.customer}>{activeJob.customerName}</Text>
        <Text style={styles.address}>{activeJob.address}</Text>
        <View style={styles.contactRow}>
          <Button label="Call" icon="call-outline" variant="outline" onPress={() => Linking.openURL('tel:0000000000')} style={{ flex: 1, marginRight: spacing.sm }} />
          <Button label="Message" icon="chatbubble-outline" variant="outline" onPress={() => {}} style={{ flex: 1 }} />
        </View>
      </Card>

      <View style={{ marginTop: spacing.xl }}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Timeline steps={steps} />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      <Button label={primaryLabel} loading={busy} onPress={onPrimary} style={{ marginTop: spacing.lg, marginBottom: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: { height: 160, borderRadius: radius.lg, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  mapText: { ...typography.bodyMedium, color: colors.primary, marginTop: spacing.sm },
  customer: { ...typography.h4, color: colors.textPrimary },
  address: { ...typography.body, color: colors.textBody, marginTop: 2 },
  contactRow: { flexDirection: 'row', marginTop: spacing.lg },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.lg },
});
