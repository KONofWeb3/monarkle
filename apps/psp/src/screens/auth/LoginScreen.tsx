import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { signIn, busy, authError, clearAuthError } = useAppState();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    try {
      await signIn(phone, password);
    } catch {
      // authError already set by context
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.logoWrap}>
        <View style={styles.logoCircle}>
          <Ionicons name="leaf" size={30} color={colors.primary} />
        </View>
        <Text style={styles.wordmark}>MONARKLE</Text>
        <Text style={styles.tagline}>PSP Partner App</Text>
      </View>

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to receive collection jobs</Text>

      <Input
        label="Phone Number"
        placeholder="Enter your phone number"
        value={phone}
        onChangeText={(v) => { setPhone(v); clearAuthError(); }}
        keyboardType="phone-pad"
      />
      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={(v) => { setPassword(v); clearAuthError(); }}
        secure
      />
      {authError && <Text style={styles.error}>{authError}</Text>}

      <Button label="Log In" loading={busy} disabled={!phone || !password} onPress={onLogin} style={{ marginTop: spacing.md }} />

      <Pressable style={styles.footerRow} onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.footerText}>
          New PSP partner? <Text style={styles.footerLink}>Apply to join the fleet</Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logoWrap: { alignItems: 'center', marginTop: spacing.xxxl, marginBottom: spacing.xxxl },
  logoCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  wordmark: { ...typography.h3, color: colors.primary, letterSpacing: 1 },
  tagline: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody, marginBottom: spacing.xl },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
  footerRow: { marginTop: spacing.xl, alignItems: 'center' },
  footerText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  footerLink: { color: colors.primary, fontFamily: typography.captionMedium.fontFamily },
});
