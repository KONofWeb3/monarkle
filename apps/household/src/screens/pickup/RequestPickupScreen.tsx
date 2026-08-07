import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { wasteCategories } from '../../data/mockData';
import { PickupIntent, WasteCategory } from '../../data/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'RequestPickup'>;

const intents: { key: PickupIntent; label: string; icon: keyof typeof Ionicons.glyphMap; bg: string; fg: string }[] = [
  { key: 'dispose', label: 'Dispose', icon: 'trash-outline', bg: colors.infoBg, fg: colors.info },
  { key: 'sell', label: 'Sell', icon: 'cash-outline', bg: '#FBE9DC', fg: colors.sell },
  { key: 'dropoff', label: 'Drop-off', icon: 'navigate-outline', bg: colors.primaryLight, fg: colors.primaryAlt },
];

export default function RequestPickupScreen({ navigation, route }: Props) {
  const { startPickupDraft, updatePickupDraft } = useAppState();
  const [intent, setIntent] = useState<PickupIntent>(route.params?.intent ?? 'dispose');
  const [category, setCategory] = useState<WasteCategory | null>(null);

  const onContinue = () => {
    startPickupDraft(intent);
    updatePickupDraft({ category: category ?? 'Plastic' });
    if (intent === 'dropoff') navigation.navigate('ChooseDropoffPoint');
    else navigation.navigate('PickupDetailsForm');
  };

  return (
    <ScreenContainer scroll>
      <Header title="Request pickup" />
      <ProgressBar progress={0.25} />

      <Text style={styles.question}>What do you want to do?</Text>
      <View style={styles.intentRow}>
        {intents.map((it) => {
          const active = it.key === intent;
          return (
            <Pressable key={it.key} onPress={() => setIntent(it.key)} style={[styles.intentCard, active && styles.intentCardActive]}>
              <View style={[styles.intentIcon, { backgroundColor: it.bg }]}>
                <Ionicons name={it.icon} size={20} color={it.fg} />
              </View>
              <Text style={styles.intentLabel}>{it.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={16} color={colors.info} />
        <Text style={styles.infoText}>
          {intent === 'dispose' && 'A PSP will collect and dispose of your waste responsibly.'}
          {intent === 'sell' && 'Sell your recyclables directly and get paid to your wallet.'}
          {intent === 'dropoff' && 'Find a nearby recycler and drop off your materials yourself.'}
        </Text>
      </View>

      <Text style={styles.question}>Select waste category</Text>
      <View style={styles.categoryGrid}>
        {wasteCategories.map((c) => {
          const active = c.key === category;
          return (
            <Pressable key={c.key} onPress={() => setCategory(c.key)} style={[styles.categoryCard, active && styles.categoryCardActive]}>
              <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={22} color={active ? colors.primary : colors.textBody} />
              <Text style={[styles.categoryLabel, active && { color: colors.primary }]}>{c.key}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button label="Continue" disabled={!category} onPress={onContinue} style={{ marginTop: spacing.xl, marginBottom: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  question: { ...typography.h4, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
  intentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  intentCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg, marginHorizontal: 4, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  intentCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  intentIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  intentLabel: { ...typography.captionMedium, color: colors.textPrimary },
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.infoBg, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  infoText: { ...typography.caption, color: colors.info, marginLeft: spacing.sm, flex: 1 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: { width: '31%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: spacing.md },
  categoryCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  categoryLabel: { ...typography.caption, color: colors.textBody, marginTop: spacing.xs },
});
