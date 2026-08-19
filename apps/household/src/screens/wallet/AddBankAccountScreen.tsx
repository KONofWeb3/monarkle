import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { WalletStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { banks } from '../../data/mockData';

type Props = NativeStackScreenProps<WalletStackParamList, 'AddBankAccount'>;
type Step = 'form' | 'verifying' | 'confirm';

export default function AddBankAccountScreen({ navigation }: Props) {
  const { user, setBankAccount } = useAppState();
  const [step, setStep] = useState<Step>('form');
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [showBanks, setShowBanks] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // No bank-account-resolution API wired up (would need Paystack) — this
  // mocks the "confirm your name" UX step using the signed-in user's name.
  const resolvedName = user.fullName.toUpperCase();

  const onVerify = () => {
    setStep('verifying');
    setTimeout(() => setStep('confirm'), 1200);
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await setBankAccount({ bankName: bank, accountNumber: account, accountName: resolvedName });
      navigation.goBack();
    } catch (e: any) {
      setError(e?.message ?? 'Could not save this account');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Bank account" />

      <Text style={styles.label}>Select bank</Text>
      <Pressable style={styles.selectBox} onPress={() => setShowBanks((s) => !s)}>
        <Text style={bank ? styles.selectValue : styles.selectPlaceholder}>{bank || 'Choose your bank'}</Text>
        <Ionicons name={showBanks ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
      </Pressable>
      {showBanks && (
        <View style={styles.bankList}>
          {banks.map((b) => (
            <Pressable key={b} style={styles.bankItem} onPress={() => { setBank(b); setShowBanks(false); }}>
              <Text style={styles.bankItemText}>{b}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Input
        label="Account number"
        placeholder="10-digit account number"
        value={account}
        onChangeText={setAccount}
        keyboardType="number-pad"
        maxLength={10}
      />

      {step === 'confirm' && (
        <View style={styles.confirmBanner}>
          <Text style={styles.confirmName}>{resolvedName}</Text>
          <Text style={styles.confirmHint}>Confirm this is the correct account before saving.</Text>
        </View>
      )}

      <Text style={styles.secureHint}>
        <Ionicons name="lock-closed-outline" size={12} color={colors.textSecondary} /> Your account details are encrypted. We use Paystack to process all transfers.
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {step === 'verifying' ? (
        <View style={styles.verifyingRow}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.verifyingText}>Checking your account details...</Text>
        </View>
      ) : (
        <Button
          label="Save account"
          disabled={!bank || account.length < 10}
          loading={saving}
          onPress={step === 'confirm' ? onSave : onVerify}
          style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.captionMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  selectBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 56, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, marginBottom: spacing.lg },
  selectValue: { ...typography.body, color: colors.textPrimary },
  selectPlaceholder: { ...typography.body, color: colors.textSecondary },
  bankList: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, marginTop: -spacing.md, marginBottom: spacing.lg, overflow: 'hidden' },
  bankItem: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  bankItemText: { ...typography.body, color: colors.textPrimary },
  confirmBanner: { backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  confirmName: { ...typography.h4, color: colors.primary },
  confirmHint: { ...typography.caption, color: colors.primary, marginTop: 4 },
  secureHint: { ...typography.caption, color: colors.textSecondary },
  errorText: { ...typography.caption, color: colors.danger, marginTop: spacing.md },
  verifyingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, marginBottom: spacing.xl },
  verifyingText: { ...typography.body, color: colors.textBody, marginLeft: spacing.sm },
});
