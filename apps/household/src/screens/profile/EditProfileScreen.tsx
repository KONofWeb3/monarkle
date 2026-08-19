import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { User } from '../../data/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'EditProfile'>;
const accountTypes: User['accountType'][] = ['Household', 'Business', 'Estate', 'School', 'Market'];

export default function EditProfileScreen({ navigation }: Props) {
  const { user, updateUser } = useAppState();
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [accountType, setAccountType] = useState(user.accountType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateUser({ fullName, phone, accountType });
      navigation.goBack();
    } catch (e: any) {
      setError(e?.message ?? 'Could not save changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Header title="Edit Profile" />

      <Input label="Full name" value={fullName} onChangeText={setFullName} />
      <Input label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Account type</Text>
      <View style={styles.chipRow}>
        {accountTypes.map((type) => {
          const active = type === accountType;
          return (
            <Pressable key={type} onPress={() => setAccountType(type)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && { color: colors.primary }]}>{type}</Text>
            </Pressable>
          );
        })}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        label="Save changes"
        loading={loading}
        onPress={onSave}
        style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.captionMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, marginRight: spacing.sm, marginBottom: spacing.sm },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { ...typography.bodyMedium, color: colors.textBody },
  errorText: { ...typography.caption, color: colors.danger, marginTop: spacing.md },
});
