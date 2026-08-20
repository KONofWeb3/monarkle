import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { fetchReferrals } from '../../lib/householdApi';

type Props = NativeStackScreenProps<HomeStackParamList, 'ReferEarn'>;

type Referral = { id: string; fullName: string; createdAt: string };

export default function ReferEarnScreen({ navigation }: Props) {
  const { user } = useAppState();
  const [referrals, setReferrals] = useState<Referral[] | null>(null);

  useEffect(() => {
    fetchReferrals()
      .then((res) => setReferrals(res.referrals))
      .catch(() => setReferrals([]));
  }, []);

  return (
    <ScreenContainer scroll>
      <Header title="Refer & earn" right={<Pressable onPress={() => navigation.navigate('ReferralHistory')}><Text style={styles.historyLink}>History</Text></Pressable>} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Give 50 pts, get 100 pts</Text>
        <Text style={styles.cardSub}>Invite friends to MONARKLE with your code below. They get 50 points and you get 100 points the moment they sign up.</Text>
        <View style={styles.codeRow}>
          <Text style={styles.code}>{user.referralCode}</Text>
          <Pressable onPress={() => Alert.alert('Copied', user.referralCode)}>
            <Text style={styles.copy}>Copy</Text>
          </Pressable>
        </View>
        <Button
          label="Share with friends"
          variant="secondary"
          onPress={() => Share.share({ message: `Join me on MONARKLE and turn waste into wealth! Use my code ${user.referralCode}` })}
          style={{ marginTop: spacing.md }}
        />
      </View>

      <Text style={styles.sectionTitle}>Your referrals</Text>
      {referrals === null ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : referrals.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={36} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No referrals yet</Text>
          <Text style={styles.emptySub}>Share your code above — you&apos;ll earn 100 points the moment a friend joins.</Text>
        </View>
      ) : (
        <FlatList
          data={referrals}
          keyExtractor={(i) => i.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.inviteeRow}>
              <View style={styles.avatar}><Ionicons name="person" size={16} color={colors.primary} /></View>
              <Text style={styles.inviteeName}>{item.fullName}</Text>
              <Text style={styles.status}>Joined</Text>
              <Text style={styles.points}>+100 pts</Text>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  historyLink: { ...typography.captionMedium, color: colors.primary },
  card: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.xl },
  cardTitle: { ...typography.h4, color: colors.textInverse },
  cardSub: { ...typography.caption, color: 'rgba(255,255,255,0.85)', marginTop: spacing.xs },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginTop: spacing.md },
  code: { ...typography.bodyMedium, color: colors.textInverse, letterSpacing: 1 },
  copy: { ...typography.captionMedium, color: colors.textInverse, textDecorationLine: 'underline' },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  inviteeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  inviteeName: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1 },
  status: { ...typography.caption, color: colors.primary, marginRight: spacing.md },
  points: { ...typography.captionMedium, color: colors.textPrimary },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: spacing.md },
  emptySub: { ...typography.caption, color: colors.textSecondary, marginTop: 4, textAlign: 'center', paddingHorizontal: spacing.xl },
});
