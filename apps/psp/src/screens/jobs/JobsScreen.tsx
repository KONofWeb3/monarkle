import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import StatusBadge, { StatusKind } from '../../components/StatusBadge';
import { colors, radius, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';
import { JobsStackParamList } from '../../navigation/types';
import { JobStatus } from '../../data/types';

type Props = NativeStackScreenProps<JobsStackParamList, 'JobsMain'>;

const statusMap: Record<JobStatus, StatusKind> = {
  available: 'pending', accepted: 'assigned', enRoute: 'inProgress', arrived: 'inProgress',
  completed: 'completed', declined: 'cancelled', cancelled: 'cancelled',
};

const filters: { key: 'all' | 'completed' | 'cancelled'; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'completed', label: 'Completed' }, { key: 'cancelled', label: 'Cancelled' },
];

export default function JobsScreen({ navigation }: Props) {
  const { jobHistory } = useAppState();
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const filtered = jobHistory.filter((j) => filter === 'all' || j.status === filter);

  return (
    <ScreenContainer padded={false}>
      <View style={styles.header}><Text style={styles.title}>Job history</Text></View>
      <View style={styles.filterRow}>
        {filters.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable key={f.key} onPress={() => setFilter(f.key)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(j) => j.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="briefcase-outline" size={36} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No jobs yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => navigation.navigate('JobHistoryDetail', { jobId: item.id })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.code}>#{item.code} · {item.category}</Text>
              <Text style={styles.meta}>{item.customerName} · {item.scheduledDate}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.payout}>₦{item.payout.toLocaleString()}</Text>
              <StatusBadge status={statusMap[item.status]} />
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { ...typography.h2, color: colors.textPrimary },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, marginRight: spacing.sm },
  chipActive: { backgroundColor: colors.primary },
  chipText: { ...typography.captionMedium, color: colors.textBody },
  chipTextActive: { color: colors.textInverse },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  code: { ...typography.bodyMedium, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  payout: { ...typography.bodyMedium, color: colors.textPrimary, marginBottom: 4 },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl * 2 },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
});
