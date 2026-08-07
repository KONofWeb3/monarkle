import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { RewardsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RewardsStackParamList, 'RedeemConfirmed'>;

export default function RedeemConfirmedScreen({ navigation, route }: Props) {
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={30} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>Redeemed!</Text>
        <Text style={styles.subtitle}>Your airtime of ₦{route.params.amount} is on its way. Allow up to 5 minutes.</Text>
      </View>
      <View style={styles.footer}>
        <Button label="Back to rewards" onPress={() => navigation.navigate('RewardsMain')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  checkCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textBody, marginTop: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.xl },
  footer: { paddingBottom: spacing.xl },
});
