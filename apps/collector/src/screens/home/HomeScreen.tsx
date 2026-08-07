import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import StatusBadge, { StatusKind } from '../../components/StatusBadge';
import { colors, radius, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';
import { HomeStackParamList } from '../../navigation/types';
import { StopStatus } from '../../data/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const statusMap: Record<StopStatus, StatusKind> = {
  pending: 'pending', enRoute: 'inProgress', arrived: 'inProgress', verifying: 'inProgress',
  completed: 'completed', skipped: 'cancelled',
};

export default function HomeScreen({ navigation }: Props) {
  const { profile, route, startRoute, activeStopIndex } = useAppState();
  const totalWeightEst = route.stops.length * 8;

  const onStopPress = (stopId: string, sequence: number) => {
    if (route.status === 'notStarted') return;
    if (sequence - 1 === activeStopIndex) navigation.navigate('StopDetail', { stopId });
  };

  return (
    <ScreenContainer padded={false} background={colors.background}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>{profile.fullName.split(' ')[0]} 👋</Text>
          </View>
          <Pressable style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.avatarText}>{profile.avatarInitials}</Text>
          </Pressable>
        </View>

        <View style={styles.routeCard}>
          <Text style={styles.routeLabel}>Today&apos;s route</Text>
          <Text style={styles.routeValue}>{route.stops.length} stops · ~{totalWeightEst}kg est.</Text>
          {route.status === 'notStarted' ? (
            <Button label="Start Route" variant="secondary" onPress={startRoute} style={{ marginTop: spacing.md }} fullWidth={false} />
          ) : route.status === 'inProgress' ? (
            <Text style={styles.inProgressText}>Stop {activeStopIndex + 1} of {route.stops.length} in progress</Text>
          ) : (
            <Pressable onPress={() => navigation.navigate('RouteComplete')}>
              <Text style={styles.inProgressText}>Route completed — view summary ›</Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={route.stops}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.body}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Stops</Text>}
        renderItem={({ item }) => {
          const isActive = route.status === 'inProgress' && item.sequence - 1 === activeStopIndex;
          return (
            <Pressable
              style={[styles.stopRow, isActive && styles.stopRowActive]}
              onPress={() => onStopPress(item.id, item.sequence)}
            >
              <View style={styles.seqCircle}>
                <Text style={styles.seqText}>{item.sequence}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stopCustomer}>{item.customerName}</Text>
                <Text style={styles.stopMeta}>{item.category} · {item.quantityLabel}</Text>
                <Text style={styles.stopAddress}>{item.address}</Text>
              </View>
              <StatusBadge status={statusMap[item.status]} />
            </Pressable>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xxxl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  greeting: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  name: { ...typography.h3, color: colors.textInverse, marginTop: 2 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...typography.captionMedium, color: colors.textInverse },
  routeCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.lg, padding: spacing.lg },
  routeLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  routeValue: { ...typography.h4, color: colors.textInverse, marginTop: spacing.xs },
  inProgressText: { ...typography.captionMedium, color: colors.textInverse, marginTop: spacing.md },

  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  stopRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  stopRowActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  seqCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  seqText: { ...typography.captionMedium, color: colors.textInverse },
  stopCustomer: { ...typography.bodyMedium, color: colors.textPrimary },
  stopMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  stopAddress: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
});
