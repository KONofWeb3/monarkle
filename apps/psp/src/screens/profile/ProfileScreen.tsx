import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'Profile'>;

export default function ProfileScreen({}: Props) {
  const { profile, signOut } = useAppState();

  return (
    <ScreenContainer scroll>
      <Header title="Profile" />

      <View style={styles.userRow}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{profile.avatarInitials}</Text></View>
        <View>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.rating}>★ {profile.rating.toFixed(1)} · {profile.totalJobs} jobs completed</Text>
        </View>
      </View>

      <Card style={{ marginBottom: spacing.lg }}>
        <Row label="Phone" value={profile.phone} />
        <Row label="Vehicle" value={profile.vehicleType} />
        <Row label="Plate number" value={profile.plateNumber} />
        <Row label="Verification" value="Verified ✓" />
      </Card>

      {[
        { icon: 'document-text-outline' as const, label: 'Documents & compliance' },
        { icon: 'card-outline' as const, label: 'Payout settings' },
        { icon: 'help-circle-outline' as const, label: 'Help & support' },
      ].map((item) => (
        <Pressable key={item.label} style={styles.menuRow}>
          <Ionicons name={item.icon} size={20} color={colors.textBody} style={{ marginRight: spacing.md }} />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </Pressable>
      ))}

      <Pressable style={styles.logout} onPress={signOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  avatarText: { ...typography.h4, color: colors.textInverse },
  name: { ...typography.h4, color: colors.textPrimary },
  rating: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.captionMedium, color: colors.textPrimary },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  menuLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  logout: { marginTop: spacing.xl, marginBottom: spacing.xl, alignItems: 'center', backgroundColor: colors.dangerBg, borderRadius: radius.md, paddingVertical: spacing.md },
  logoutText: { ...typography.bodyMedium, color: colors.danger },
});
