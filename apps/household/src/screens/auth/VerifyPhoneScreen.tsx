import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import OtpInput from '../../components/OtpInput';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyPhone'>;

export default function VerifyPhoneScreen({ navigation, route }: Props) {
  const { phone, mode } = route.params;
  const [code, setCode] = useState('');

  const onVerify = () => {
    if (mode === 'signup') navigation.navigate('SetupProfile');
    else navigation.navigate('CreateNewPassword');
  };

  return (
    <ScreenContainer scroll>
      <View style={{ marginTop: spacing.xxl, marginBottom: spacing.xxl }}>
        <Text style={styles.title}>Verify Phone</Text>
        <Text style={styles.subtitle}>We sent a 4-digit code to {phone || '+234 800 000 0000'}</Text>
      </View>

      <OtpInput length={4} value={code} onChange={setCode} />

      <Pressable style={styles.resendRow}>
        <Text style={styles.resendText}>
          Didn&apos;t receive code? <Text style={styles.resendLink}>Resend</Text>
        </Text>
      </Pressable>

      <Button label="Verify & Continue" disabled={code.length < 4} onPress={onVerify} style={{ marginTop: spacing.xxl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
  resendRow: { marginTop: spacing.lg },
  resendText: { ...typography.body, color: colors.textBody },
  resendLink: { color: colors.primary, fontFamily: typography.bodyMedium.fontFamily },
});
