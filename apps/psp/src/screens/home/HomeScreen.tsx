import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, radius, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';
import { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

export default function HomeScreen({ navigation }: Props) {
  const { profile, availableJobs, activeJob, todayEarnings } = useAppState();

  return (
    <ScreenContainer padded={false} background={colors.background}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>{profile.fullName.split(' ')[0]} 👋</Text>
          </View>
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={colors.textInverse} />
              <View style={styles.badgeDot} />
            </Pressable>
            <Pressable style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.avatarText}>{profile.avatarInitials}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Today&apos;s earnings</Text>
          <Text style={styles.earningsValue}>₦{todayEarnings.toLocaleString()}</Text>
        </View>
      </View>

      <FlatList
        data={availableJobs}
        keyExtractor={(j) => j.id}
        contentContainerStyle={styles.body}
        ListHeaderComponent={
          <>
            {activeJob && (
              <Pressable style={styles.activeCard} onPress={() => navigation.navigate('ActiveJob')}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeLabel}>Active job</Text>
                  <Text style={styles.activeTitle}>{activeJob.category} · {activeJob.code}</Text>
                  <Text style={styles.activeMeta}>{activeJob.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </Pressable>
            )}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Available jobs nearby</Text>
              <Text style={styles.count}>{availableJobs.length}</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={36} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No jobs nearby right now</Text>
            <Text style={styles.emptySub}>We&apos;ll notify you when a new request comes in.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.jobRow} onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}>
            <View style={styles.jobIcon}>
              <Ionicons name="leaf-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.jobCategory}>{item.category} · {item.quantity}</Text>
              <Text style={styles.jobMeta}>{item.address} · {item.distanceKm}km away</Text>
            </View>
            <Text style={styles.jobPayout}>₦{item.payout.toLocaleString()}</Text>
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
  earningsValue: { ...typography.h1, color: colors.textInverse, marginTop: spacing.xs },

  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxxl },
  activeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  activeLabel: { ...typography.caption, color: colors.primary },
  activeTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
  activeMeta: { ...typography.caption, color: colors.textBody, marginTop: 2 },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary },
  count: { ...typography.captionMedium, color: colors.textSecondary },

  jobRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  jobIcon: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  jobCategory: { ...typography.bodyMedium, color: colors.textPrimary },
  jobMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  jobPayout: { ...typography.bodyMedium, color: colors.primary },

  empty: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
  emptySub: { ...typography.caption, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
});
