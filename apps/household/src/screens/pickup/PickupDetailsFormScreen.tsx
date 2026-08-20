import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import ProgressBar from '../../components/ProgressBar';
import Input from '../../components/Input';
import DateField from '../../components/DateField';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';
import { getCurrentAddress } from '../../lib/location';

type Props = NativeStackScreenProps<HomeStackParamList, 'PickupDetailsForm'>;

const quantities: { key: 'Small' | 'Medium' | 'Large'; sub: string }[] = [
  { key: 'Small', sub: '0-5 kg' },
  { key: 'Medium', sub: '5-20 kg' },
  { key: 'Large', sub: '20+ kg' },
];

const times = ['Morning', 'Afternoon', 'Any time'];

function formatForDraft(d: Date) {
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PickupDetailsFormScreen({ navigation }: Props) {
  const { updatePickupDraft } = useAppState();
  const [quantity, setQuantity] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [address, setAddress] = useState('14 Admiralty Way, Lekki Phase 1, Lagos');
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('Morning');

  const onUseGps = async () => {
    setLocating(true);
    setLocationError(null);
    try {
      const result = await getCurrentAddress();
      if (!result) {
        setLocationError('Location permission denied — enter your address manually.');
        return;
      }
      setAddress(result.address);
    } catch {
      setLocationError('Could not get your location. Enter your address manually.');
    } finally {
      setLocating(false);
    }
  };

  const onContinue = () => {
    updatePickupDraft({
      quantity,
      address,
      date: date ? formatForDraft(date) : 'Tomorrow',
      time,
    });
    navigation.navigate('ReviewPickup');
  };

  return (
    <ScreenContainer scroll>
      <Header title="Request pickup" />
      <ProgressBar progress={0.5} />

      <Text style={styles.question}>How much waste?</Text>
      <View style={styles.qtyRow}>
        {quantities.map((q) => {
          const active = q.key === quantity;
          return (
            <Pressable key={q.key} onPress={() => setQuantity(q.key)} style={[styles.qtyCard, active && styles.qtyCardActive]}>
              <Text style={[styles.qtyLabel, active && { color: colors.primary }]}>{q.key}</Text>
              <Text style={styles.qtySub}>{q.sub}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.question}>Collection address</Text>
      <Input leftIcon="location-outline" value={address} onChangeText={setAddress} placeholder="Enter your address" />
      <Pressable style={styles.gpsRow} onPress={onUseGps} disabled={locating}>
        {locating ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="navigate-circle-outline" size={16} color={colors.primary} />
        )}
        <Text style={styles.gpsText}>{locating ? 'Getting your location…' : 'Use my GPS location'}</Text>
      </Pressable>
      {locationError && <Text style={styles.errorText}>{locationError}</Text>}

      <DateField
        label="Preferred date"
        value={date}
        onChange={setDate}
        minimumDate={new Date()}
        placeholder="Select a pickup date"
      />

      <Text style={styles.question}>Time preference</Text>
      <View style={styles.qtyRow}>
        {times.map((t) => {
          const active = t === time;
          return (
            <Pressable key={t} onPress={() => setTime(t)} style={[styles.timeChip, active && styles.qtyCardActive]}>
              <Text style={[styles.qtyLabel, active && { color: colors.primary }]}>{t}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button label="Continue" disabled={!date} onPress={onContinue} style={{ marginTop: spacing.xl, marginBottom: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  question: { ...typography.h4, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between' },
  qtyCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, marginHorizontal: 4, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  qtyCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  qtyLabel: { ...typography.bodyMedium, color: colors.textPrimary },
  qtySub: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  timeChip: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, marginHorizontal: 4, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  gpsRow: { flexDirection: 'row', alignItems: 'center', marginTop: -spacing.sm, marginBottom: spacing.sm },
  gpsText: { ...typography.captionMedium, color: colors.primary, marginLeft: spacing.xs },
  errorText: { ...typography.caption, color: colors.danger, marginBottom: spacing.sm },
});
