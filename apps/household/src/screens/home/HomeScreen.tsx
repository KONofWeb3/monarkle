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
import { Pickup } from '../../data/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const statusMap: Record<Pickup['status'], StatusKind> = {
  pending: 'pending',
  assigned: 'assigned',
  inProgress: 'inProgress',
  completed: 'completed',
  cancelled: 'cancelled',
};

const intentMeta = {
  dispose: { label: 'DISPOSE', color: colors.info },
  sell: { label: 'SELL', color: colors.sell },
  dropoff: { label: 'DROP-OFF', color: colors.primaryAlt },
};

export default function HomeScreen({ navigation }: Props) {
  const { user, pickups, walletBalance } = useAppState();
  const activePickup = pickups.find((p) => p.status === 'pending' || p.status === 'assigned' || p.status === 'inProgress');
  const recent = pickups.slice(0, 3);

  return (
    <ScreenContainer padded={false} background={colors.background}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>{user.fullName.split(' ')[0]} 👋</Text>
          </View>
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={colors.textInverse} />
              <View style={styles.badgeDot} />
            </Pressable>
            <Pressable style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.avatarText}>{user.avatarInitials}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsValue}>₦{walletBalance.toLocaleString()}</Text>
            <Pressable style={styles.withdrawBtn}>
              <Text style={styles.withdrawText}>Withdraw</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <FlatList
        data={recent}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.body}
        ListHeaderComponent={
          <>
            {activePickup && (
              <Pressable
                style={styles.activeCard}
                onPress={() => navigation.navigate('TrackPickup', { pickupId: activePickup.id })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeLabel}>Active pickup</Text>
                  <View style={styles.activeRow}>
                    <Text style={[styles.activeIntent, { color: intentMeta[activePickup.intent].color }]}>
                      {intentMeta[activePickup.intent].label}
                    </Text>
                    <Text style={styles.activeMeta}>· {activePickup.category} · {activePickup.quantity}</Text>
                  </View>
                  <Text style={styles.activeMeta}>{activePickup.scheduledDate} · {activePickup.scheduledTime}</Text>
                </View>
                <StatusBadge status={statusMap[activePickup.status]} />
              </Pressable>
            )}

            <Button
              label="Start New Request"
              icon="add"
              iconPosition="left"
              onPress={() => navigation.navigate('RequestPickup', { intent: 'dispose' })}
              style={{ marginBottom: spacing.xl }}
            />

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Recent pickups</Text>
              <Pressable onPress={() => navigation.getParent()?.navigate('Track' as never)}>
                <Text style={styles.viewAll}>View all ›</Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.pickupRow} onPress={() => navigation.navigate('PickupDetail', { pickupId: item.id })}>
            <View style={styles.pickupIcon}>
              <Ionicons name="leaf-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.pickupTopRow}>
                <Text style={[styles.intentTag, { color: intentMeta[item.intent].color }]}>{intentMeta[item.intent].label}</Text>
                <Text style={styles.pickupDate}>{item.scheduledDate}</Text>
              </View>
              <Text style={styles.pickupCategory}>{item.category} · {item.code}</Text>
            </View>
            <StatusBadge status={statusMap[item.status]} label={item.status === 'completed' ? 'Completed' : undefined} />
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xxxl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  greeting: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  name: { ...typography.h3, color: colors.textInverse, marginTop: 2 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  badgeDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...typography.captionMedium, color: colors.textInverse },
  earningsCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.lg, padding: spacing.lg },
  earningsLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  earningsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  earningsValue: { ...typography.h1, color: colors.textInverse, fontSize: 28 },
  withdrawBtn: { backgroundColor: colors.textInverse, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  withdrawText: { ...typography.captionMedium, color: colors.primary },

  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  activeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  activeLabel: { ...typography.caption, color: colors.textSecondary },
  activeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  activeIntent: { ...typography.captionMedium },
  activeMeta: { ...typography.caption, color: colors.textBody, marginLeft: 4 },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary },
  viewAll: { ...typography.captionMedium, color: colors.primary },

  pickupRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  pickupIcon: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  pickupTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  intentTag: { ...typography.tiny, fontFamily: typography.captionMedium.fontFamily },
  pickupDate: { ...typography.tiny, color: colors.textSecondary },
  pickupCategory: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
});
