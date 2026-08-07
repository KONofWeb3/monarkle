import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import StatusBadge, { StatusKind } from '../../components/StatusBadge';
import { colors, radius, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';
import { TrackStackParamList } from '../../navigation/types';
import { Pickup } from '../../data/types';

type Props = NativeStackScreenProps<TrackStackParamList, 'MyPickups'>;

const filters: { key: 'all' | Pickup['status']; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const statusMap: Record<Pickup['status'], StatusKind> = {
  pending: 'pending', assigned: 'assigned', inProgress: 'inProgress', completed: 'completed', cancelled: 'cancelled',
};

const intentLabel: Record<Pickup['intent'], string> = { dispose: 'DISPOSE', sell: 'SELL', dropoff: 'DROP-OFF' };

export default function MyPickupsScreen({ navigation }: Props) {
  const { pickups } = useAppState();
  const [filter, setFilter] = useState<'all' | Pickup['status']>('all');

  const filtered = pickups.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return p.status === 'pending' || p.status === 'assigned' || p.status === 'inProgress';
    return p.status === filter;
  });

  return (
    <ScreenContainer padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My pickups</Text>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable key={f.key} onPress={() => setFilter(f.key)} style={[styles.filterChip, active && styles.filterChipActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
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
            <Ionicons name="cube-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No pickups found</Text>
            <Text style={styles.emptySub}>Your pickup history will appear here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => navigation.navigate('PickupDetail', { pickupId: item.id })}>
            <View style={{ flex: 1 }}>
              <View style={styles.topRow}>
                <Text style={styles.intent}>{intentLabel[item.intent]}</Text>
                <Text style={styles.date}>{item.scheduledDate}</Text>
              </View>
              <Text style={styles.category}>{item.category} · {item.code}</Text>
            </View>
            <StatusBadge status={statusMap[item.status]} />
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
  filterChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, marginRight: spacing.sm },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { ...typography.captionMedium, color: colors.textBody },
  filterTextActive: { color: colors.textInverse },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  intent: { ...typography.tiny, fontFamily: typography.captionMedium.fontFamily, color: colors.primary },
  date: { ...typography.tiny, color: colors.textSecondary },
  category: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl * 2 },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
  emptySub: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
