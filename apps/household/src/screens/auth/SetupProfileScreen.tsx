import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { User } from '../../data/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SetupProfile'>;

const accountTypes: User['accountType'][] = ['Household', 'Business', 'Estate', 'School', 'Market'];

export default function SetupProfileScreen({ navigation }: Props) {
  const { updateUser } = useAppState();
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<User['accountType']>('Household');
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    setLoading(true);
    try {
      await updateUser(fullName ? { fullName, accountType } : { accountType });
    } catch {
      // Non-fatal — profile can be edited later from the Profile tab.
    } finally {
      setLoading(false);
      navigation.navigate('EnableLocation');
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={{ marginTop: spacing.xxl, marginBottom: spacing.xxl }}>
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
      </View>

      <Input label="Full name" placeholder="e.g. Adaeze Okafor" value={fullName} onChangeText={setFullName} autoCapitalize="words" />

      <Text style={styles.label}>Account type</Text>
      <View style={styles.chipRow}>
        {accountTypes.map((type) => {
          const active = type === accountType;
          return (
            <Pressable key={type} onPress={() => setAccountType(type)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{type}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button label="Continue" loading={loading} onPress={onContinue} style={{ marginTop: spacing.xxxl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textBody },
  label: { ...typography.captionMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { ...typography.bodyMedium, color: colors.textBody },
  chipTextActive: { color: colors.primary },
});
