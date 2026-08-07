import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'VerifyPickup'>;

export default function VerifyPickupScreen({ navigation }: Props) {
  const { activeJob, completeActiveJob } = useAppState();
  const [weight, setWeight] = useState('');
  if (!activeJob) return null;

  const onSubmit = () => {
    const w = parseFloat(weight || '0');
    completeActiveJob(w);
    navigation.replace('JobComplete', { payout: activeJob.payout });
  };

  return (
    <ScreenContainer scroll>
      <Header title="Verify pickup" />

      <View style={styles.qrBox}>
        <Ionicons name="qr-code-outline" size={64} color={colors.primary} />
        <Text style={styles.qrText}>Scan customer&apos;s QR code (optional)</Text>
      </View>

      <Text style={styles.label}>Or enter weight collected</Text>
      <Input placeholder="e.g. 8.5" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Category</Text>
        <Text style={styles.summaryValue}>{activeJob.category} · {activeJob.quantity}</Text>
      </View>

      <Button label="Confirm collection" disabled={!weight} onPress={onSubmit} style={{ marginTop: spacing.xl, marginBottom: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrBox: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight, borderRadius: radius.lg, paddingVertical: spacing.xxxl, marginBottom: spacing.xl },
  qrText: { ...typography.caption, color: colors.primary, marginTop: spacing.sm },
  label: { ...typography.captionMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  summary: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  summaryLabel: { ...typography.caption, color: colors.textSecondary },
  summaryValue: { ...typography.captionMedium, color: colors.textPrimary },
});
