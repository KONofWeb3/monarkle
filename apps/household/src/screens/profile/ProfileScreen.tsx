import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'Profile'>;

type MenuItem = { icon: keyof typeof Ionicons.glyphMap; label: string; badge?: string; onPress: () => void; danger?: boolean };

export default function ProfileScreen({ navigation }: Props) {
  const { user, signOut } = useAppState();

  const menu: MenuItem[] = [
    { icon: 'person-outline', label: 'Edit profile', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'gift-outline', label: 'Refer a friend', badge: 'Earn ₦', onPress: () => navigation.navigate('ReferEarn') },
    { icon: 'notifications-outline', label: 'Notification settings', onPress: () => navigation.navigate('NotificationSettings') },
    {
      icon: 'help-circle-outline',
      label: 'Help & support',
      onPress: () => Linking.openURL('mailto:support@monarkle.africa?subject=Support request'),
    },
    {
      icon: 'information-circle-outline',
      label: 'About Monarkle',
      onPress: () =>
        Alert.alert(
          'About MONARKLE',
          `Version ${Constants.expoConfig?.version ?? '1.0.0'}\n\nMONARKLE turns waste into wealth — connecting households, PSPs, and recyclers across Africa's circular economy.`
        ),
    },
    { icon: 'trash-outline', label: 'Delete account', danger: true, onPress: () => navigation.navigate('DeleteAccount') },
  ];

  return (
    <ScreenContainer scroll>
      <Header title="Profile" />

      <View style={styles.userRow}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user.avatarInitials}</Text></View>
        <View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.accountType}>{user.accountType}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {menu.map((item) => (
          <Pressable key={item.label} style={styles.menuRow} onPress={item.onPress}>
            <Ionicons name={item.icon} size={20} color={item.danger ? colors.danger : colors.textBody} style={{ marginRight: spacing.md }} />
            <Text style={[styles.menuLabel, item.danger && { color: colors.danger }]}>{item.label}</Text>
            {item.badge && (
              <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>
            )}
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logout} onPress={signOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  userRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.xl },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  avatarText: { ...typography.h4, color: colors.textInverse },
  name: { ...typography.h4, color: colors.textPrimary },
  accountType: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  menu: { borderTopWidth: 1, borderTopColor: colors.divider },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.divider },
  menuLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  badge: { backgroundColor: colors.primaryLight, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2, marginRight: spacing.sm },
  badgeText: { ...typography.tiny, color: colors.primary },
  logout: { marginTop: spacing.xl, marginBottom: spacing.xl, alignItems: 'center', backgroundColor: colors.dangerBg, borderRadius: radius.md, paddingVertical: spacing.md },
  logoutText: { ...typography.bodyMedium, color: colors.danger },
});
