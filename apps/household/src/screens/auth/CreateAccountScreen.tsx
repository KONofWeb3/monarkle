import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { sendOtp } from '../../lib/householdApi';
import { normalizePhone } from '../../lib/phone';
import { ApiError } from '../../lib/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAccount'>;

export default function CreateAccountScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canContinue = fullName.length > 1 && phone.length >= 7 && password.length >= 6;

  const onContinue = async () => {
    setError(null);
    setLoading(true);
    const normalizedPhone = normalizePhone(phone);
    try {
      await sendOtp(normalizedPhone);
      navigation.navigate('VerifyPhone', {
        mode: 'signup',
        phone: normalizedPhone,
        fullName,
        email: email || undefined,
        password,
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={{ marginTop: spacing.xxl, marginBottom: spacing.xxl }}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join MONARKLE and start earning.</Text>
      </View>

      <Input label="Full Name" placeholder="e.g. Jane Doe" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
      <Input label="Phone Number" placeholder="Enter your phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Email (Optional)" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} secure />
      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        label="Continue"
        disabled={!canContinue}
        loading={loading}
        onPress={onContinue}
        style={{ marginTop: spacing.md }}
      />

      <Pressable style={styles.loginRow} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log In</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
  loginRow: { marginTop: spacing.lg, alignItems: 'center' },
  loginText: { ...typography.body, color: colors.textBody },
  loginLink: { color: colors.primary, fontFamily: typography.bodyMedium.fontFamily },
});
