import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  primaryLabel: string;
  onPrimary: () => void;
  onSkip: () => void;
};

export default function PermissionScreen({ icon, iconBg, iconColor, title, body, primaryLabel, onPrimary, onSkip }: Props) {
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={40} color={iconColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
      <View style={styles.footer}>
        <Button label={primaryLabel} onPress={onPrimary} />
        <Button label="Not now" variant="ghost" onPress={onSkip} style={{ marginTop: spacing.sm }} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxl },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md, textAlign: 'center' },
  body: { ...typography.body, color: colors.textBody, textAlign: 'center' },
  footer: { paddingBottom: spacing.xl },
});
