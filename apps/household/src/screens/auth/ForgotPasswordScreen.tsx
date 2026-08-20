import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

// Self-service reset needs a real verification channel (SMS/email) to be
// safe. That's not live yet, so this points people to support instead of
// pretending to send a code, or worse, resetting a password with no proof
// of ownership at all.
export default function ForgotPasswordScreen({ navigation }: Props) {
  return (
    <ScreenContainer scroll>
      <Header title="Forgot Password" />

      <View style={styles.iconWrap}>
        <Ionicons name="lock-closed-outline" size={32} color={colors.primary} />
      </View>

      <Text style={styles.title}>Let&apos;s get you back in</Text>
      <Text style={styles.body}>
        Self-service password reset isn&apos;t available yet. Reach out to MONARKLE support with
        your registered phone number and we&apos;ll verify your identity and reset it for you.
      </Text>

      {/* TODO: point this at your real support channel before shipping —
          this address is a placeholder. */}
      <Button
        label="Email support"
        icon="mail-outline"
        onPress={() => Linking.openURL('mailto:support@monarkle.africa?subject=Password reset request')}
        style={{ marginTop: spacing.xl }}
      />
      <Button
        label="Back to login"
        variant="ghost"
        onPress={() => navigation.navigate('Login')}
        style={{ marginTop: spacing.sm }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg, marginBottom: spacing.lg,
  },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  body: { ...typography.body, color: colors.textBody },
});
