import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import OtpInput from '../../components/OtpInput';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPasswordVerify'>;

export default function ForgotPasswordVerifyScreen({ navigation, route }: Props) {
  const [code, setCode] = useState('');

  return (
    <ScreenContainer scroll>
      <Header title="Forgot Password" />
      <View style={{ marginBottom: spacing.xxl }}>
        <Text style={styles.title}>Enter code</Text>
        <Text style={styles.subtitle}>We sent a 6-digit code to +234 {route.params.phone || '701 234 5678'}</Text>
      </View>
      <OtpInput length={6} value={code} onChange={setCode} />
      <Button
        label="Verify Code"
        disabled={code.length < 6}
        onPress={() => navigation.navigate('CreateNewPassword')}
        style={{ marginTop: spacing.xxl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
});
