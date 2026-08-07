import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import { colors, spacing, typography } from '../../theme';
import { RewardsStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<RewardsStackParamList, 'PointsHistory'>;

export default function PointsHistoryScreen({}: Props) {
  const { rewardHistory } = useAppState();

  return (
    <ScreenContainer padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header title="Points History" />
      </View>
      <FlatList
        data={rewardHistory}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="trophy-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptySub}>Your points earnings and redemptions will appear here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={[styles.points, { color: item.points > 0 ? colors.primary : colors.danger }]}>
              {item.points > 0 ? '+' : ''}{item.points} pts
            </Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  label: { ...typography.bodyMedium, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  points: { ...typography.bodyMedium },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl * 2 },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
  emptySub: { ...typography.caption, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
});
