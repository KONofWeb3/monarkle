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

type Props = NativeStackScreenProps<HomeStackParamList, 'PickupPayment'>;

const SERVICE_FEE = 1500;

export default function PickupPaymentScreen({ navigation }: Props) {
  const { submitPickupDraft } = useAppState();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPay = async () => {
    setProcessing(true);
    setError(null);
    try {
      const pickup = await submitPickupDraft();
      navigation.replace('PickupConfirmed', { pickupId: pickup.id });
    } catch (e: any) {
      setError(e?.message ?? 'Could not confirm your pickup. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Complete your payment" />
      <Text style={styles.subtitle}>Your pickup will be confirmed once payment is received.</Text>

      <Card style={{ marginTop: spacing.xl }}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Service fee</Text>
          <Text style={styles.rowValue}>₦{SERVICE_FEE.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Payment method</Text>
          <Text style={styles.rowValue}>Wallet balance</Text>
        </View>
      </Card>

      <View style={styles.secureBanner}>
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
        <Text style={styles.secureText}>Payments are securely processed via Paystack. Your card details never leave the app.</Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        label={`Pay ₦${SERVICE_FEE.toLocaleString()}`}
        loading={processing}
        onPress={onPay}
        style={{ marginTop: spacing.xxl }}
      />
      <Button label="Cancel and go back" variant="ghost" onPress={() => navigation.goBack()} style={{ marginTop: spacing.sm, marginBottom: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { ...typography.body, color: colors.textBody, marginTop: -spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyMedium, color: colors.textPrimary },
  secureBanner: { flexDirection: 'row', backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, alignItems: 'flex-start' },
  secureText: { ...typography.caption, color: colors.primary, marginLeft: spacing.sm, flex: 1 },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.lg },
});
