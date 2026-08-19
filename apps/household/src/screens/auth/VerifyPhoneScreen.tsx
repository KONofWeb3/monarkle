import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import OtpInput from '../../components/OtpInput';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { verifyOtp, sendOtp } from '../../lib/householdApi';
import { useAppState } from '../../data/AppContext';
import { ApiError } from '../../lib/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyPhone'>;

export default function VerifyPhoneScreen({ navigation, route }: Props) {
  const { phone, mode } = route.params;
  const { registerAccount } = useAppState();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    setError(null);
    setLoading(true);
    try {
      const { verified } = await verifyOtp(phone, code);
      if (!verified) {
        setError('Incorrect code. Please try again.');
        return;
      }
      if (mode === 'signup') {
        await registerAccount({
          fullName: route.params.fullName,
          phone,
          email: route.params.email,
          password: route.params.password,
        });
        navigation.navigate('SetupProfile');
      } else {
        navigation.navigate('CreateNewPassword', { phone });
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError(null);
    try {
      await sendOtp(phone);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not resend code');
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={{ marginTop: spacing.xxl, marginBottom: spacing.xxl }}>
        <Text style={styles.title}>Verify Phone</Text>
        <Text style={styles.subtitle}>We sent a code to {phone}</Text>
      </View>

      <OtpInput length={4} value={code} onChange={setCode} />
      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.resendRow} onPress={onResend}>
        <Text style={styles.resendText}>
          Didn&apos;t receive code? <Text style={styles.resendLink}>Resend</Text>
        </Text>
      </Pressable>

      <Button label="Verify & Continue" disabled={code.length < 4} loading={loading} onPress={onVerify} style={{ marginTop: spacing.xxl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.md },
  resendRow: { marginTop: spacing.lg },
  resendText: { ...typography.body, color: colors.textBody },
  resendLink: { color: colors.primary, fontFamily: typography.bodyMedium.fontFamily },
});
