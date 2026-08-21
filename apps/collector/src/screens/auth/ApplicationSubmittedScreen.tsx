import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ApplicationSubmitted'>;

export default function ApplicationSubmittedScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name="time-outline" size={36} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>Application submitted</Text>
        <Text style={styles.body}>
          An admin will review your details and approve your account. You&apos;ll be able to log in once
          it&apos;s approved.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button label="Back to login" onPress={() => navigation.replace('Login')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm, textAlign: 'center' },
  body: { ...typography.body, color: colors.textBody, textAlign: 'center' },
  footer: { paddingBottom: spacing.xl },
});
