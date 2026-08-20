import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { normalizePhone } from '../../lib/phone';
import { ApiError } from '../../lib/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAccount'>;

export default function CreateAccountScreen({ navigation }: Props) {
  const { registerAccount } = useAppState();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canContinue = fullName.length > 1 && phone.length >= 7 && password.length >= 6;

  const onContinue = async () => {
    setError(null);
    setLoading(true);
    try {
      await registerAccount({
        fullName,
        phone: normalizePhone(phone),
        email: email || undefined,
        password,
        referredBy: referralCode.trim() || undefined,
      });
      navigation.navigate('SetupProfile');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not create your account');
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
      <Input
        label="Referral Code (Optional)"
        placeholder="e.g. EMEKA-7K2P"
        value={referralCode}
        onChangeText={setReferralCode}
        autoCapitalize="characters"
      />
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
