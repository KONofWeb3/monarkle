import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Ionicons name="leaf" size={40} color={colors.primary} />
      </View>
      <Text style={styles.wordmark}>MONARKLE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  wordmark: { ...typography.h2, color: colors.primary, letterSpacing: 1 },
});
