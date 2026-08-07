import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'JobComplete'>;

export default function JobCompleteScreen({ navigation, route }: Props) {
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={32} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>Job completed!</Text>
        <Text style={styles.subtitle}>₦{route.params.payout.toLocaleString()} added to your earnings</Text>
      </View>
      <View style={styles.footer}>
        <Button label="Back to dashboard" onPress={() => navigation.navigate('HomeMain')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  checkCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.bodyLg, color: colors.textBody, marginTop: spacing.xs },
  footer: { paddingBottom: spacing.xl },
});
