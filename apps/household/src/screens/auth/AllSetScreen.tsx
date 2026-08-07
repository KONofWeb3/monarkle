import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'AllSet'>;

const steps: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[] = [
  { icon: 'trash-outline', title: 'Request a pickup', body: 'Choose Dispose, Sell, or Drop-off' },
  { icon: 'person-outline', title: 'We assign a collector', body: 'A PSP operator is sent to you' },
  { icon: 'wallet-outline', title: 'Earn points or get paid', body: 'Rewards for every pickup completed' },
];

export default function AllSetScreen({}: Props) {
  const { signIn } = useAppState();

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={32} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>You&apos;re all set!</Text>
        <Text style={styles.subtitle}>Here&apos;s how MONARKLE works</Text>

        <View style={{ width: '100%', marginTop: spacing.xxl }}>
          {steps.map((s) => (
            <View key={s.title} style={styles.stepRow}>
              <View style={styles.stepIcon}>
                <Ionicons name={s.icon} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepBody}>{s.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Go to my dashboard" onPress={() => signIn()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', paddingTop: spacing.xxxl },
  checkCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg },
  stepIcon: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  stepTitle: { ...typography.bodyMedium, color: colors.textPrimary },
  stepBody: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  footer: { paddingBottom: spacing.xl },
});
