import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'ReviewDropoff'>;

const steps = [
  'Head to the recycler with your sorted materials',
  'Show your QR code at the counter',
  'Weigh-in and get paid straight to your wallet',
];

export default function ReviewDropoffScreen({ navigation }: Props) {
  const { pickupDraft, submitPickupDraft } = useAppState();
  const [loading, setLoading] = useState(false);
  const estPayout = pickupDraft?.quantity === 'Large' ? 5200 : pickupDraft?.quantity === 'Small' ? 900 : 2640;

  const onGenerate = async () => {
    setLoading(true);
    try {
      const pickup = await submitPickupDraft();
      navigation.navigate('DropoffQRCode', { pickupId: pickup.id });
    } catch {
      // Button stays enabled so the user can just retry.
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Review my drop off" />

      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>Free — no booking needed</Text>
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <Row label="Recycler" value={pickupDraft?.recyclerName ?? '-'} />
        <Row label="Category" value={pickupDraft?.category ?? '-'} />
        <Row label="Quantity" value={pickupDraft?.quantity ?? '-'} />
        <Row label="Date" value={pickupDraft?.date ?? '-'} />
      </Card>

      <Card style={{ marginTop: spacing.lg, backgroundColor: colors.primaryLight, borderColor: colors.primaryLight }}>
        <Text style={styles.estLabel}>Estimated payout</Text>
        <Text style={styles.estValue}>₦{estPayout.toLocaleString()}</Text>
      </Card>

      <View style={{ marginTop: spacing.xl }}>
        <Text style={styles.cardTitle}>How drop-off works</Text>
        {steps.map((s, i) => (
          <View key={s} style={styles.stepRow}>
            <View style={styles.stepDot}><Text style={styles.stepDotText}>{i + 1}</Text></View>
            <Text style={styles.stepText}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tipBanner}>
        <Ionicons name="bulb-outline" size={16} color={colors.warning} />
        <Text style={styles.tipText}>Payment goes straight to your wallet once weight is confirmed onsite.</Text>
      </View>

      <Button
        label="Generate my QR code"
        loading={loading}
        onPress={onGenerate}
        style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
      />
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
  banner: { backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  bannerLabel: { ...typography.captionMedium, color: colors.primary, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.captionMedium, color: colors.textPrimary },
  estLabel: { ...typography.caption, color: colors.primary },
  estValue: { ...typography.h2, color: colors.primary, marginTop: 2 },
  cardTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  stepDotText: { ...typography.tiny, color: colors.textInverse, fontFamily: typography.captionMedium.fontFamily },
  stepText: { ...typography.body, color: colors.textBody, flex: 1 },
  tipBanner: { flexDirection: 'row', backgroundColor: colors.warningBg, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md, alignItems: 'flex-start' },
  tipText: { ...typography.caption, color: colors.warning, marginLeft: spacing.sm, flex: 1 },
});
