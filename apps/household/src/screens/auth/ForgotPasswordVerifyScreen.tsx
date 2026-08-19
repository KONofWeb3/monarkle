import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import OtpInput from '../../components/OtpInput';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { verifyOtp } from '../../lib/householdApi';
import { ApiError } from '../../lib/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPasswordVerify'>;

export default function ForgotPasswordVerifyScreen({ navigation, route }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    setError(null);
    setLoading(true);
    try {
      const { verified } = await verifyOtp(route.params.phone, code);
      if (!verified) {
        setError('Incorrect code. Please try again.');
        return;
      }
      navigation.navigate('CreateNewPassword', { phone: route.params.phone });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Forgot Password" />
      <View style={{ marginBottom: spacing.xxl }}>
        <Text style={styles.title}>Enter code</Text>
        <Text style={styles.subtitle}>We sent a code to {route.params.phone}</Text>
      </View>
      <OtpInput length={4} value={code} onChange={setCode} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        label="Verify Code"
        disabled={code.length < 4}
        loading={loading}
        onPress={onVerify}
        style={{ marginTop: spacing.xxl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.md },
});
