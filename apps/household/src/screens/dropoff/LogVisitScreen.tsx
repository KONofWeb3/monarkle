import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'LogVisit'>;

export default function LogVisitScreen({ navigation, route }: Props) {
  const [weight, setWeight] = useState('');

  return (
    <ScreenContainer scroll>
      <Header title="Log your visit" />
      <Text style={styles.subtitle}>Did you complete your visit?</Text>

      <Input label="Weight collected (kg)" placeholder="e.g. 8.5" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />

      <View style={styles.previewCard}>
        <Text style={styles.previewLabel}>+120 points</Text>
        <Text style={styles.previewSub}>Est. payout: ₦{weight ? Math.round(parseFloat(weight || '0') * 150).toLocaleString() : '0'}</Text>
      </View>

      <Button
        label="Submit and earn points"
        disabled={!weight}
        onPress={() => navigation.replace('VisitLogged', { pickupId: route.params.pickupId })}
        style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { ...typography.body, color: colors.textBody, marginTop: spacing.lg, marginBottom: spacing.lg },
  previewCard: { backgroundColor: colors.primaryLight, borderRadius: 12, padding: spacing.lg, alignItems: 'center' },
  previewLabel: { ...typography.h4, color: colors.primary },
  previewSub: { ...typography.caption, color: colors.primary, marginTop: 4 },
});
