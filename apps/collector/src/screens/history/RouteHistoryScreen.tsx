import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, radius, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';

export default function RouteHistoryScreen() {
  const { routeHistory } = useAppState();

  return (
    <ScreenContainer padded={false}>
      <View style={styles.header}><Text style={styles.title}>Route history</Text></View>
      <FlatList
        data={routeHistory}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="map-outline" size={36} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No routes yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name="checkmark-done" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.meta}>{item.stopsCompleted}/{item.totalStops} stops · {item.totalWeightKg}kg · {Math.round(item.durationMins / 60)}h {item.durationMins % 60}m</Text>
            </View>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { ...typography.h2, color: colors.textPrimary },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  date: { ...typography.bodyMedium, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl * 2 },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
});
