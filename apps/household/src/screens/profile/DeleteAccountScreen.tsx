import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'DeleteAccount'>;

export default function DeleteAccountScreen({}: Props) {
  const { signOut } = useAppState();
  const [password, setPassword] = useState('');

  return (
    <ScreenContainer scroll>
      <Header title="Delete Account" />

      <View style={styles.warning}>
        <Ionicons name="warning-outline" size={18} color={colors.danger} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={styles.warningTitle}>This is permanent</Text>
          <Text style={styles.warningBody}>All your data, wallet balance, and pickup history will be permanently deleted.</Text>
        </View>
      </View>

      <Input label="Confirm your password" placeholder="Password" value={password} onChangeText={setPassword} secure />

      <Button label="Delete my account" variant="danger" disabled={!password} onPress={signOut} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  warning: { flexDirection: 'row', backgroundColor: colors.dangerBg, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.xl },
  warningTitle: { ...typography.bodyMedium, color: colors.danger },
  warningBody: { ...typography.caption, color: colors.danger, marginTop: 2 },
});
