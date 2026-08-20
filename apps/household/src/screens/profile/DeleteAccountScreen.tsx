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
import { deactivateAccount } from '../../lib/householdApi';
import { ApiError } from '../../lib/api';

type Props = NativeStackScreenProps<HomeStackParamList, 'DeleteAccount'>;

export default function DeleteAccountScreen({}: Props) {
  const { signOut } = useAppState();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setError(null);
    setLoading(true);
    try {
      await deactivateAccount(password);
      signOut();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not delete your account');
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Delete Account" />

      <View style={styles.warning}>
        <Ionicons name="warning-outline" size={18} color={colors.danger} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={styles.warningTitle}>Your account will be deactivated</Text>
          <Text style={styles.warningBody}>
            You&apos;ll be logged out immediately and won&apos;t be able to sign back in. To have your
            data fully erased or your account reactivated, contact support afterward.
          </Text>
        </View>
      </View>

      <Input label="Confirm your password" placeholder="Password" value={password} onChangeText={setPassword} secure />
      {error && <Text style={styles.error}>{error}</Text>}

      <Button label="Delete my account" variant="danger" loading={loading} disabled={!password} onPress={onDelete} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  warning: { flexDirection: 'row', backgroundColor: colors.dangerBg, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.xl },
  warningTitle: { ...typography.bodyMedium, color: colors.danger },
  warningBody: { ...typography.caption, color: colors.danger, marginTop: 2 },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
});
