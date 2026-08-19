import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { requestPasswordReset } from '../../lib/householdApi';
import { normalizePhone } from '../../lib/phone';
import { ApiError } from '../../lib/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    setError(null);
    setLoading(true);
    const normalized = normalizePhone(phone);
    try {
      await requestPasswordReset(normalized);
      navigation.navigate('ForgotPasswordVerify', { phone: normalized });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Forgot Password" />
      <View style={{ marginBottom: spacing.xxl }}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>Enter your phone number to receive a code.</Text>
      </View>
      <Input label="Phone number" prefix="+234" placeholder="801 234 5678" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button label="Send Code" disabled={phone.length < 7} loading={loading} onPress={onSend} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
});
