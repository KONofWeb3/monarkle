import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'VerifyCollection'>;

export default function VerifyCollectionScreen({ navigation, route: navRoute }: Props) {
  const { route, completeStop } = useAppState();
  const stop = route.stops.find((s) => s.id === navRoute.params.stopId);
  const [scanned, setScanned] = useState(false);
  const [weight, setWeight] = useState('');
  if (!stop) return null;

  const onConfirm = () => {
    completeStop(stop.id, parseFloat(weight || '0'));
    navigation.replace('StopComplete', { stopId: stop.id });
  };

  return (
    <ScreenContainer scroll>
      <Header title="Verify collection" />

      <Pressable style={styles.qrBox} onPress={() => setScanned(true)}>
        <Ionicons name={scanned ? 'checkmark-circle' : 'qr-code-outline'} size={64} color={colors.primary} />
        <Text style={styles.qrText}>
          {scanned ? `Matched code ${stop.qrExpected}` : 'Tap to scan the household’s QR code'}
        </Text>
      </Pressable>

      <Text style={styles.label}>Weight collected (kg)</Text>
      <Input placeholder="e.g. 8.5" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>{stop.category} · {stop.quantityLabel}</Text>
        <Text style={styles.summarySub}>{stop.customerName} · {stop.code}</Text>
      </View>

      <Button
        label="Confirm collection"
        disabled={!weight || !scanned}
        onPress={onConfirm}
        style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  qrBox: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight, borderRadius: radius.lg, paddingVertical: spacing.xxxl, marginBottom: spacing.xl },
  qrText: { ...typography.caption, color: colors.primary, marginTop: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.xl },
  label: { ...typography.captionMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  summary: { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  summaryLabel: { ...typography.bodyMedium, color: colors.textPrimary },
  summarySub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
