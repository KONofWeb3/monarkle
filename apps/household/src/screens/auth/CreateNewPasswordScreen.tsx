import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateNewPassword'>;

export default function CreateNewPasswordScreen({ navigation }: Props) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && password !== confirm;

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
      <Button
        label="Continue"
        disabled={password.length < 8 || password !== confirm}
        onPress={() => navigation.navigate('Login')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
});
