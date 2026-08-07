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
import { wasteCategories } from '../../data/mockData';
import { WasteCategory } from '../../data/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'PlanVisit'>;

export default function PlanVisitScreen({ navigation }: Props) {
  const { updatePickupDraft } = useAppState();
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<WasteCategory>('Plastic');
  const [quantity, setQuantity] = useState<'Small' | 'Medium' | 'Large'>('Medium');

  return (
    <ScreenContainer scroll>
      <Header title="Plan your visit" />

      <Text style={styles.question}>When will you drop it off?</Text>
      <Input leftIcon="calendar-outline" placeholder="e.g. Jul 8, 2026" value={date} onChangeText={setDate} />

      <Text style={styles.question}>What are you bringing?</Text>
      <View style={styles.chipRow}>
        {wasteCategories.map((c) => {
          const active = c.key === category;
          return (
            <Pressable key={c.key} onPress={() => setCategory(c.key)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && { color: colors.primary }]}>{c.key}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.question}>Estimated quantity</Text>
      <View style={styles.chipRow}>
        {(['Small', 'Medium', 'Large'] as const).map((q) => {
          const active = q === quantity;
          return (
            <Pressable key={q} onPress={() => setQuantity(q)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && { color: colors.primary }]}>{q}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        label="Review my visit"
        onPress={() => {
          updatePickupDraft({ date: date || 'This week', category, quantity });
          navigation.navigate('ReviewDropoff');
        }}
        style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  question: { ...typography.h4, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, marginRight: spacing.sm, marginBottom: spacing.sm },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { ...typography.bodyMedium, color: colors.textBody },
});
