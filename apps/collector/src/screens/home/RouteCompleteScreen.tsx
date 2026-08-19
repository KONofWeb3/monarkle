import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'RouteComplete'>;

export default function RouteCompleteScreen({ navigation }: Props) {
  const { route } = useAppState();
  if (!route) return null;
  const completed = route.stops.filter((s) => s.status === 'completed');
  const totalWeight = completed.reduce((sum, s) => sum + (s.weightKg ?? 0), 0);

  return (
    <ScreenContainer scroll>
      <View style={styles.center}>
        <View style={styles.checkCircle}>
          <Ionicons name="trophy" size={30} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>Route complete!</Text>
        <Text style={styles.subtitle}>Great work today</Text>

        <Card style={{ width: '100%', marginTop: spacing.xl }}>
          <Row label="Stops completed" value={`${completed.length} / ${route.stops.length}`} />
          <Row label="Total weight collected" value={`${totalWeight.toFixed(1)} kg`} />
          <Row label="Date" value={route.date} />
        </Card>
      </View>

      <Button label="Back to dashboard" onPress={() => navigation.navigate('HomeMain')} style={{ marginTop: spacing.xxxl, marginBottom: spacing.xl }} />
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingTop: spacing.xxxl },
  checkCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textBody, marginTop: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyMedium, color: colors.textPrimary },
});
