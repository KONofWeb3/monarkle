import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { RewardsStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<RewardsStackParamList, 'RedeemAirtime'>;

const amounts = [
  { naira: 100, points: 100 },
  { naira: 500, points: 500 },
  { naira: 1000, points: 1000 },
  { naira: 2000, points: 2000 },
];

export default function RedeemAirtimeScreen({ navigation }: Props) {
  const { rewardPoints, redeemPoints } = useAppState();
  const [mobile, setMobile] = useState('');
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chosen = amounts[selected];
  const remaining = rewardPoints - chosen.points;

  const onContinue = async () => {
    setLoading(true);
    setError(null);
    try {
      await redeemPoints(chosen.points, `Airtime redemption — ₦${chosen.naira} cost`);
      navigation.replace('RedeemConfirmed', { amount: chosen.naira });
    } catch (e: any) {
      setError(e?.message ?? 'Could not redeem points');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Redeem Airtime" />

      <Input label="Mobile number" placeholder="0812 345 6789" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountGrid}>
        {amounts.map((a, i) => {
          const active = i === selected;
          const disabled = a.points > rewardPoints;
          return (
            <Pressable key={a.naira} disabled={disabled} onPress={() => setSelected(i)} style={[styles.amountCard, active && styles.amountCardActive, disabled && { opacity: 0.4 }]}>
              <Text style={[styles.amountText, active && { color: colors.primary }]}>₦{a.naira}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summary}>
        <Row label="Airtime value" value={`₦${chosen.naira}`} />
        <Row label="Points cost" value={`-${chosen.points} pts`} danger />
        <Row label="Remaining balance" value={`${Math.max(0, remaining)} pts`} />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        label="Continue"
        disabled={!mobile || remaining < 0}
        loading={loading}
        onPress={onContinue}
        style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

function Row({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, danger && { color: colors.danger }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.captionMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  amountCard: { width: '48%', alignItems: 'center', paddingVertical: spacing.lg, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, marginRight: '4%', marginBottom: spacing.md },
  amountCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  amountText: { ...typography.h4, color: colors.textPrimary },
  summary: { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.captionMedium, color: colors.textPrimary },
  errorText: { ...typography.caption, color: colors.danger, marginTop: spacing.md },
});
