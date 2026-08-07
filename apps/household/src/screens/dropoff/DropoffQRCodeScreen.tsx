import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';
import { useAppState } from '../../data/AppContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'DropoffQRCode'>;

export default function DropoffQRCodeScreen({ navigation, route }: Props) {
  const { pickups } = useAppState();
  const pickup = pickups.find((p) => p.id === route.params.pickupId);
  const code = `DO-2026-${(pickup?.code ?? 'K7X3').slice(-4).toUpperCase()}`;

  return (
    <ScreenContainer scroll>
      <Header title="Drop-off details" onBack={() => navigation.navigate('HomeMain')} />

      <View style={styles.center}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={26} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>You&apos;re all set!</Text>
        <Text style={styles.subtitle}>Show this code at {pickup?.address ?? 'the recycler'}</Text>

        <Card style={{ alignItems: 'center', marginTop: spacing.xl }}>
          <QRCode value={code} size={160} color={colors.textPrimary} backgroundColor={colors.surface} />
          <Text style={styles.code}>{code}</Text>
        </Card>

        <Text style={styles.hint}>This code is valid for 7 days</Text>
      </View>

      <Button label="Get directions" variant="outline" onPress={() => {}} style={{ marginTop: spacing.xl }} />
      <Button label="Back to Home" onPress={() => navigation.navigate('HomeMain')} style={{ marginTop: spacing.sm, marginBottom: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginTop: spacing.lg },
  checkCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textBody, marginTop: 2, textAlign: 'center' },
  code: { ...typography.h4, color: colors.textPrimary, marginTop: spacing.lg, letterSpacing: 1 },
  hint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.md },
});
