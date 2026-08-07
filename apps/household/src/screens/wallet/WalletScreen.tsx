import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import StatusBadge, { StatusKind } from '../../components/StatusBadge';
import { colors, radius, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';
import { WalletStackParamList } from '../../navigation/types';
import { Payout } from '../../data/types';

type Props = NativeStackScreenProps<WalletStackParamList, 'WalletMain'>;

const statusMap: Record<Payout['status'], StatusKind> = { paid: 'paid', pending: 'pending', failed: 'failed' };

export default function WalletScreen({ navigation }: Props) {
  const { walletBalance, bankAccount, payouts } = useAppState();
  const recent = payouts.slice(0, 3);

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Earnings</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total earnings</Text>
        <Text style={styles.balanceValue}>₦{walletBalance.toLocaleString()}</Text>
        <Pressable style={styles.withdrawBtn}>
          <Text style={styles.withdrawText}>Withdraw</Text>
        </Pressable>
      </View>

      <Pressable style={styles.bankRow} onPress={() => navigation.navigate('AddBankAccount')}>
        <View style={styles.bankIcon}>
          <Ionicons name="card-outline" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bankTitle}>Bank Account</Text>
          <Text style={styles.bankSub}>
            {bankAccount ? `${bankAccount.bankName} ending ${bankAccount.accountNumber.slice(-4)}` : 'No bank account added'}
          </Text>
        </View>
        <Text style={styles.bankAction}>{bankAccount ? 'Change' : 'Add now'}</Text>
      </Pressable>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Recent payouts</Text>
        <Pressable onPress={() => navigation.navigate('EarningsHistory')}>
          <Text style={styles.viewAll}>View all ›</Text>
        </Pressable>
      </View>

      {recent.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="wallet-outline" size={36} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No earnings yet</Text>
          <Text style={styles.emptySub}>Complete your first recyclable sale</Text>
        </View>
      ) : (
        <FlatList
          data={recent}
          keyExtractor={(p) => p.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Pressable style={styles.payoutRow} onPress={() => navigation.navigate('EarningsDetail', { payoutId: item.id })}>
              <View style={{ flex: 1 }}>
                <Text style={styles.payoutCode}>#{item.pickupCode}</Text>
                <Text style={styles.payoutMeta}>{item.category} · {item.weightKg}kg · {item.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.payoutAmount}>₦{item.amount.toLocaleString()}</Text>
                <StatusBadge status={statusMap[item.status]} />
              </View>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md, marginBottom: spacing.lg },
  balanceCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  balanceLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  balanceValue: { ...typography.h1, color: colors.textInverse, marginVertical: spacing.xs },
  withdrawBtn: { alignSelf: 'flex-start', backgroundColor: colors.textInverse, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, marginTop: spacing.xs },
  withdrawText: { ...typography.captionMedium, color: colors.primary },
  bankRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.xl },
  bankIcon: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  bankTitle: { ...typography.bodyMedium, color: colors.textPrimary },
  bankSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  bankAction: { ...typography.captionMedium, color: colors.primary },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary },
  viewAll: { ...typography.captionMedium, color: colors.primary },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
  emptySub: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  payoutRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  payoutCode: { ...typography.bodyMedium, color: colors.textPrimary },
  payoutMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  payoutAmount: { ...typography.bodyMedium, color: colors.textPrimary, marginBottom: 4 },
});
