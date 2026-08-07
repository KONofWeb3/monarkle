import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, radius, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';
import { RewardsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RewardsStackParamList, 'RewardsMain'>;

const redeemOptions = [
  { key: 'airtime', label: 'Airtime', sub: '100 pts min', icon: 'call-outline' as const },
  { key: 'data', label: 'Mobile Data', sub: '150 pts min', icon: 'wifi-outline' as const },
];

export default function RewardsScreen({ navigation }: Props) {
  const { rewardPoints, rewardHistory } = useAppState();
  const recent = rewardHistory.slice(0, 3);

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Rewards</Text>

      <View style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>Reward points</Text>
        <Text style={styles.pointsValue}>{rewardPoints}</Text>
        <Text style={styles.pointsHint}>Convert to real rewards points</Text>
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Redeem Points</Text>
      </View>
      {redeemOptions.map((o) => (
        <Pressable key={o.key} style={styles.redeemRow} onPress={() => navigation.navigate('RedeemAirtime')}>
          <View style={styles.redeemIcon}>
            <Ionicons name={o.icon} size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.redeemLabel}>{o.label}</Text>
            <Text style={styles.redeemSub}>{o.sub}</Text>
          </View>
          <View style={styles.redeemBtn}><Text style={styles.redeemBtnText}>Redeem</Text></View>
        </Pressable>
      ))}

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Pressable onPress={() => navigation.navigate('PointsHistory')}>
          <Text style={styles.viewAll}>View all ›</Text>
        </Pressable>
      </View>
      {recent.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="ribbon-outline" size={36} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No points yet</Text>
          <Text style={styles.emptySub}>Complete your first disposal pickup to start earning</Text>
        </View>
      ) : (
        recent.map((r) => (
          <View key={r.id} style={styles.activityRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityLabel}>{r.label}</Text>
              <Text style={styles.activityDate}>{r.date}</Text>
            </View>
            <Text style={[styles.activityPoints, { color: r.points > 0 ? colors.primary : colors.danger }]}>
              {r.points > 0 ? '+' : ''}{r.points} pts
            </Text>
          </View>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md, marginBottom: spacing.lg },
  pointsCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  pointsLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  pointsValue: { ...typography.h1, color: colors.textInverse, marginVertical: spacing.xs },
  pointsHint: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md, marginTop: spacing.sm },
  sectionTitle: { ...typography.h4, color: colors.textPrimary },
  viewAll: { ...typography.captionMedium, color: colors.primary },
  redeemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  redeemIcon: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  redeemLabel: { ...typography.bodyMedium, color: colors.textPrimary },
  redeemSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  redeemBtn: { backgroundColor: colors.primaryLight, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  redeemBtnText: { ...typography.captionMedium, color: colors.primary },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
  emptySub: { ...typography.caption, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider },
  activityLabel: { ...typography.bodyMedium, color: colors.textPrimary },
  activityDate: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  activityPoints: { ...typography.bodyMedium },
});
