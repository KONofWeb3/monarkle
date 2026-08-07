import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ReferralHistory'>;

const referrals = [
  { name: 'Adaeze O.', date: 'Jun 12, 2026', points: 100, status: 'Joined' },
  { name: 'Biodun A.', date: 'Jun 5, 2026', points: 100, status: 'Pending' },
  { name: 'Team B.', date: 'May 20, 2026', points: 100, status: 'Joined' },
];

export default function ReferralHistoryScreen({}: Props) {
  return (
    <ScreenContainer padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header title="Referral History" />
        <View style={styles.statsRow}>
          <Stat value="8" label="Invited" />
          <Stat value="6" label="Joined" />
          <Stat value="2" label="Pending" />
        </View>
      </View>
      <FlatList
        data={referrals}
        keyExtractor={(r) => r.name}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={[styles.status, item.status === 'Pending' && { color: colors.warning }]}>{item.status}</Text>
            <Text style={styles.points}>+{item.points} pts</Text>
          </View>
        )}
      />
      <View style={styles.footerBanner}>
        <Text style={styles.footerText}>600 points earned from referrals</Text>
      </View>
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
  footerBanner: { alignItems: 'center', paddingBottom: spacing.xl },
  footerText: { ...typography.captionMedium, color: colors.primary },
});
