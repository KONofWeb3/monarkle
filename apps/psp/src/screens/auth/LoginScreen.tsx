import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';

export default function LoginScreen() {
  const { signIn } = useAppState();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

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

      <Input label="Phone Number" placeholder="Enter your phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} secure />

      <Button label="Log In" onPress={() => signIn()} style={{ marginTop: spacing.md }} />

      <Text style={styles.footerText}>Not registered as a PSP? Contact MONARKLE Ops to onboard your fleet.</Text>
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
  footerText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
