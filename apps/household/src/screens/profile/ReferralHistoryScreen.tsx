import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { fetchReferrals } from '../../lib/householdApi';

type Props = NativeStackScreenProps<HomeStackParamList, 'ReferralHistory'>;
type Referral = { id: string; fullName: string; createdAt: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ReferralHistoryScreen({}: Props) {
  const [referrals, setReferrals] = useState<Referral[] | null>(null);

  useEffect(() => {
    fetchReferrals()
      .then((res) => setReferrals(res.referrals))
      .catch(() => setReferrals([]));
  }, []);

  if (referrals === null) {
    return (
      <ScreenContainer>
        <Header title="Referral History" />
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      </ScreenContainer>
    );
  }

  const totalPoints = referrals.length * 100;

  return (
    <ScreenContainer padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header title="Referral History" />
        <View style={styles.statsRow}>
          <Stat value={String(referrals.length)} label="Referred" />
          <Stat value={String(totalPoints)} label="Points earned" />
        </View>
      </View>
      <FlatList
        data={referrals}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={36} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No referrals yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            </View>
            <Text style={styles.status}>Joined</Text>
            <Text style={styles.points}>+100 pts</Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingVertical: spacing.md, marginBottom: spacing.lg },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.h3, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  status: { ...typography.caption, color: colors.primary, marginRight: spacing.md },
  points: { ...typography.captionMedium, color: colors.textPrimary },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl * 2 },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
});
