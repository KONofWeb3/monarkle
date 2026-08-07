import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'RecyclerDetails'>;

const rates = [
  { material: 'Plastic (PET)', rate: '₦150/kg' },
  { material: 'Metal (Aluminium)', rate: '₦450/kg' },
  { material: 'Paper', rate: '₦80/kg' },
];

export default function RecyclerDetailsScreen({ navigation, route }: Props) {
  const { updatePickupDraft } = useAppState();

  return (
    <ScreenContainer scroll>
      <Header title="Recycler details" />

      <View style={styles.heroIcon}>
        <Ionicons name="business" size={28} color={colors.primary} />
      </View>
      <Text style={styles.name}>{route.params.recyclerName}</Text>
      <Text style={styles.address}>23 Admiralty Way, Lekki Phase 1, Lagos</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}><Text style={styles.statValue}>★ 4.7</Text><Text style={styles.statLabel}>Rating</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>0.8 km</Text><Text style={styles.statLabel}>Away</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>8am-6pm</Text><Text style={styles.statLabel}>Hours</Text></View>
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>Accepted materials & rates</Text>
        {rates.map((r) => (
          <View key={r.material} style={styles.rateRow}>
            <Text style={styles.rateLabel}>{r.material}</Text>
            <Text style={styles.rateValue}>{r.rate}</Text>
          </View>
        ))}
      </Card>

      <Button label="Get directions" variant="outline" onPress={() => {}} style={{ marginTop: spacing.xl }} />
      <Button
        label="Continue"
        onPress={() => {
          updatePickupDraft({ recyclerName: route.params.recyclerName });
          navigation.navigate('PlanVisit');
        }}
        style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  name: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.md },
  address: { ...typography.body, color: colors.textBody, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: spacing.lg, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingVertical: spacing.md },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.bodyMedium, color: colors.textPrimary },
  statLabel: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  cardTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rateLabel: { ...typography.body, color: colors.textBody },
  rateValue: { ...typography.bodyMedium, color: colors.textPrimary },
});
