import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAccount'>;

export default function CreateAccountScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canContinue = fullName.length > 1 && phone.length >= 7 && password.length >= 6;

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

      <Button
        label="Continue"
        disabled={!canContinue}
        onPress={() => navigation.navigate('VerifyPhone', { phone, mode: 'signup' })}
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
  loginRow: { marginTop: spacing.lg, alignItems: 'center' },
  loginText: { ...typography.body, color: colors.textBody },
  loginLink: { color: colors.primary, fontFamily: typography.bodyMedium.fontFamily },
});
