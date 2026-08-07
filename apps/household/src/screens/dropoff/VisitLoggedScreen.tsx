import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'VisitLogged'>;

export default function VisitLoggedScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name="person-circle-outline" size={40} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>Visit logged!</Text>
        <Text style={styles.subtitle}>121 points earned</Text>
      </View>
      <View style={styles.footer}>
        <Button label="View my rewards" onPress={() => navigation.navigate('HomeMain')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.bodyLg, color: colors.textBody, marginTop: spacing.xs },
  footer: { paddingBottom: spacing.xl },
});
