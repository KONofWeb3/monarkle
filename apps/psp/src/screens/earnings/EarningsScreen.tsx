import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import StatusBadge from '../../components/StatusBadge';
import { colors, radius, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';

export default function EarningsScreen() {
  const { todayEarnings, payouts, jobHistory } = useAppState();
  const weekEarnings = jobHistory.filter((j) => j.status === 'completed').reduce((s, j) => s + j.payout, 0);

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Earnings</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Today</Text>
        <Text style={styles.balanceValue}>₦{todayEarnings.toLocaleString()}</Text>
        <View style={styles.divider} />
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statLabel}>This week</Text>
            <Text style={styles.statValue}>₦{weekEarnings.toLocaleString()}</Text>
          </View>
          <Pressable style={styles.withdrawBtn}>
            <Text style={styles.withdrawText}>Withdraw</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Payout history</Text>
      <FlatList
        data={payouts}
        keyExtractor={(p) => p.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cash-outline" size={36} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No payouts yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.jobCode}>#{item.jobCode}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amount}>₦{item.amount.toLocaleString()}</Text>
              <StatusBadge status={item.status} />
            </View>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md, marginBottom: spacing.lg },
  balanceCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  balanceLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  balanceValue: { ...typography.h1, color: colors.textInverse, marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  statValue: { ...typography.h4, color: colors.textInverse, marginTop: 2 },
  withdrawBtn: { backgroundColor: colors.textInverse, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  withdrawText: { ...typography.captionMedium, color: colors.primary },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  row: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  jobCode: { ...typography.bodyMedium, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  amount: { ...typography.bodyMedium, color: colors.textPrimary, marginBottom: 4 },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
});
