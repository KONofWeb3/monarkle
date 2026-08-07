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

type Props = NativeStackScreenProps<HomeStackParamList, 'StopDetail'>;

export default function StopDetailScreen({ navigation, route: navRoute }: Props) {
  const { route, setStopStatus } = useAppState();
  const stop = route.stops.find((s) => s.id === navRoute.params.stopId);
  if (!stop) return null;

  const isEnRoute = stop.status === 'enRoute';

  return (
    <ScreenContainer scroll>
      <Header title={`Stop ${stop.sequence} of ${route.stops.length}`} />

      <View style={styles.mapPlaceholder}>
        <Ionicons name="navigate" size={28} color={colors.primary} />
        <Text style={styles.mapText}>Route to {stop.customerName.split(' ')[0]}&apos;s pickup point</Text>
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.row}><Text style={styles.rowLabel}>Customer</Text><Text style={styles.rowValue}>{stop.customerName}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Category</Text><Text style={styles.rowValue}>{stop.category}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Expected qty</Text><Text style={styles.rowValue}>{stop.quantityLabel}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Address</Text><Text style={styles.rowValue}>{stop.address}</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Pickup code</Text><Text style={styles.rowValue}>{stop.code}</Text></View>
      </Card>

      {isEnRoute ? (
        <Button
          label="I've arrived"
          onPress={() => setStopStatus(stop.id, 'arrived')}
          style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
        />
      ) : (
        <Button
          label="Verify collection"
          onPress={() => navigation.navigate('VerifyCollection', { stopId: stop.id })}
          style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: { height: 160, borderRadius: radius.lg, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  mapText: { ...typography.bodyMedium, color: colors.primary, marginTop: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.captionMedium, color: colors.textPrimary },
});
