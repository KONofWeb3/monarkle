import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { fetchNotificationPrefs, NotificationPrefs, updateNotificationPrefs } from '../../lib/householdApi';

type Props = NativeStackScreenProps<HomeStackParamList, 'NotificationSettings'>;

const rows: { key: keyof NotificationPrefs; label: string; sub: string }[] = [
  { key: 'assigned', label: 'Pickup assigned', sub: 'When a PSP accepts your request' },
  { key: 'completed', label: 'Pickup completed', sub: 'When your pickup is finished' },
  { key: 'wallet', label: 'Wallet updates', sub: 'Payouts and withdrawals' },
  { key: 'payout', label: 'Payout received', sub: 'When funds hit your account' },
  { key: 'promotions', label: 'Promotions', sub: 'Offers and reward campaigns' },
];

export default function NotificationSettingsScreen({}: Props) {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchNotificationPrefs().then(setPrefs).catch(() => {});
  }, []);

  const onToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    if (!prefs) return;
    const prev = prefs;
    setPrefs({ ...prefs, [key]: value }); // optimistic
    setSavingKey(key);
    try {
      const updated = await updateNotificationPrefs({ [key]: value });
      setPrefs(updated);
    } catch {
      setPrefs(prev); // roll back on failure
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Notifications" />
      {!prefs ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        rows.map((r) => (
          <View key={r.key} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.sub}>{r.sub}</Text>
            </View>
            {savingKey === r.key ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Switch
                value={prefs[r.key]}
                onValueChange={(v) => onToggle(r.key, v)}
                trackColor={{ true: colors.primary, false: colors.divider }}
              />
            )}
          </View>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  label: { ...typography.bodyMedium, color: colors.textPrimary },
  sub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
