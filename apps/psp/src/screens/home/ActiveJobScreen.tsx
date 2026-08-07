import React from 'react';
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
import { JobStatus } from '../../data/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ActiveJob'>;

const stepLabels: { key: JobStatus; label: string }[] = [
  { key: 'accepted', label: 'Job accepted' },
  { key: 'enRoute', label: 'On the way' },
  { key: 'arrived', label: 'Arrived at pickup' },
];

const nextActionLabel: Record<JobStatus, string> = {
  available: 'Accept job', accepted: "I'm on my way", enRoute: "I've arrived",
  arrived: 'Start verification', completed: 'Completed', declined: 'Declined', cancelled: 'Cancelled',
};

export default function ActiveJobScreen({ navigation }: Props) {
  const { activeJob, advanceActiveJob } = useAppState();
  if (!activeJob) {
    navigation.replace('HomeMain');
    return null;
  }

  const steps = stepLabels.map((s, i) => {
    const order = stepLabels.map((x) => x.key);
    const currentIdx = order.indexOf(activeJob.status);
    return { label: s.label, state: (i <= currentIdx ? 'done' : 'pending') as 'done' | 'pending' };
  });

  const onPrimary = () => {
    if (activeJob.status === 'arrived') {
      navigation.navigate('VerifyPickup');
    } else {
      advanceActiveJob();
    }
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

      <Button label={nextActionLabel[activeJob.status]} onPress={onPrimary} style={{ marginTop: spacing.lg, marginBottom: spacing.xl }} />
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
});
