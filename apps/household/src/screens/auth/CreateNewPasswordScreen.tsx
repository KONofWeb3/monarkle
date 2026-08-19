import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { resetPassword } from '../../lib/householdApi';
import { ApiError } from '../../lib/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateNewPassword'>;

export default function CreateNewPasswordScreen({ navigation, route }: Props) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mismatch = confirm.length > 0 && password !== confirm;

  const onContinue = async () => {
    setError(null);
    setLoading(true);
    try {
      await resetPassword(route.params.phone, password);
      navigation.navigate('Login');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Forgot Password" />
      <View style={{ marginBottom: spacing.xxl }}>
        <Text style={styles.title}>Create a password</Text>
        <Text style={styles.subtitle}>Choose a strong password for your account</Text>
      </View>
      <Input label="Password" placeholder="Min. 8 characters" value={password} onChangeText={setPassword} secure />
      <Input
        label="Confirm password"
        placeholder="Repeat password"
        value={confirm}
        onChangeText={setConfirm}
        secure
        error={mismatch ? "The two passwords don't match. Try again." : undefined}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        label="Continue"
        disabled={password.length < 8 || password !== confirm}
        loading={loading}
        onPress={onContinue}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
});
