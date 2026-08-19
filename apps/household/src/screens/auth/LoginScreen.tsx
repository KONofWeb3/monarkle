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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { signIn, busy } = useAppState();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);
    try {
      await signIn(normalizePhone(phone), password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Login failed');
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={{ marginTop: spacing.xxl, marginBottom: spacing.xxl }}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to your MONARKLE account.</Text>
      </View>

      <Input label="Phone Number" placeholder="Enter your phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} secure />
      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginBottom: spacing.xl }}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </Pressable>

      <Button label="Log In" loading={busy} disabled={!phone || !password} onPress={onLogin} />

      <Pressable style={styles.loginRow} onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.loginText}>
          Don&apos;t have an account? <Text style={styles.loginLink}>Sign up</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
  forgot: { ...typography.bodyMedium, color: colors.primary },
  loginRow: { marginTop: spacing.lg, alignItems: 'center' },
  loginText: { ...typography.body, color: colors.textBody },
  loginLink: { color: colors.primary, fontFamily: typography.bodyMedium.fontFamily },
});
