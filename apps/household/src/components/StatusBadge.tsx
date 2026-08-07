import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export type StatusKind = 'pending' | 'assigned' | 'inProgress' | 'completed' | 'cancelled' | 'paid' | 'failed';

const map: Record<StatusKind, { bg: string; fg: string; label: string }> = {
  pending: { bg: colors.warningBg, fg: colors.warning, label: 'Pending' },
  assigned: { bg: colors.infoBg, fg: colors.info, label: 'Assigned' },
  inProgress: { bg: colors.infoBg, fg: colors.info, label: 'On the way' },
  completed: { bg: colors.primaryLight, fg: colors.primary, label: 'Completed' },
  cancelled: { bg: colors.dangerBg, fg: colors.danger, label: 'Cancelled' },
  paid: { bg: colors.primaryLight, fg: colors.primary, label: 'Paid' },
  failed: { bg: colors.dangerBg, fg: colors.danger, label: 'Failed' },
};

export default function StatusBadge({ status, label }: { status: StatusKind; label?: string }) {
  const s = map[status];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.text, { color: s.fg }]}>{label ?? s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { ...typography.tiny, fontFamily: typography.captionMedium.fontFamily },
});
