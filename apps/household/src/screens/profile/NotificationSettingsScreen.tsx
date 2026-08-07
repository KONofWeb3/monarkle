import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'NotificationSettings'>;

const initialSettings = [
  { key: 'assigned', label: 'Pickup assigned', sub: 'When a PSP accepts your request', value: true },
  { key: 'completed', label: 'Pickup completed', sub: 'When your pickup is finished', value: true },
  { key: 'wallet', label: 'Wallet updates', sub: 'Payouts and withdrawals', value: true },
  { key: 'payout', label: 'Payout received', sub: 'When funds hit your account', value: true },
  { key: 'promotions', label: 'Promotions', sub: 'Offers and reward campaigns', value: false },
];

export default function NotificationSettingsScreen({}: Props) {
  const [settings, setSettings] = useState(initialSettings);

  return (
    <ScreenContainer scroll>
      <Header title="Notifications" />
      {settings.map((s, i) => (
        <View key={s.key} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{s.label}</Text>
            <Text style={styles.sub}>{s.sub}</Text>
          </View>
          <Switch
            value={s.value}
            onValueChange={(v) => setSettings((prev) => prev.map((p, idx) => (idx === i ? { ...p, value: v } : p)))}
            trackColor={{ true: colors.primary, false: colors.divider }}
          />
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  label: { ...typography.bodyMedium, color: colors.textPrimary },
  sub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
