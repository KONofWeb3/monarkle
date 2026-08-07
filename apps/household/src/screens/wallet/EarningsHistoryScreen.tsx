import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import StatusBadge, { StatusKind } from '../../components/StatusBadge';
import { colors, radius, spacing, typography } from '../../theme';
import { WalletStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { Payout } from '../../data/types';

type Props = NativeStackScreenProps<WalletStackParamList, 'EarningsHistory'>;
const statusMap: Record<Payout['status'], StatusKind> = { paid: 'paid', pending: 'pending', failed: 'failed' };
const filters: { key: 'all' | Payout['status']; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'paid', label: 'Completed' }, { key: 'pending', label: 'Pending' }, { key: 'failed', label: 'Failed' },
];

export default function EarningsHistoryScreen({ navigation }: Props) {
  const { payouts } = useAppState();
  const [filter, setFilter] = useState<'all' | Payout['status']>('all');
  const filtered = payouts.filter((p) => filter === 'all' || p.status === filter);

  return (
    <ScreenContainer padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header title="Earnings History" />
      </View>
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
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={36} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No earnings yet</Text>
            <Text style={styles.emptySub}>Complete your first recyclable sale</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => navigation.navigate('EarningsDetail', { payoutId: item.id })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.code}>#{item.pickupCode}</Text>
              <Text style={styles.meta}>{item.category} · {item.weightKg}kg · {item.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amount}>₦{item.amount.toLocaleString()}</Text>
              <StatusBadge status={statusMap[item.status]} />
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.md, flexWrap: 'wrap' },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, marginRight: spacing.sm, marginBottom: spacing.sm },
  chipActive: { backgroundColor: colors.primary },
  chipText: { ...typography.captionMedium, color: colors.textBody },
  chipTextActive: { color: colors.textInverse },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  row: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  code: { ...typography.bodyMedium, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  amount: { ...typography.bodyMedium, color: colors.textPrimary, marginBottom: 4 },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl * 2 },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
  emptySub: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
