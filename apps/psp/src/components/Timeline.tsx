import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export type TimelineStep = {
  label: string;
  timestamp?: string;
  state: 'done' | 'active' | 'pending';
};

export default function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <View>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <View key={step.label} style={styles.row}>
            <View style={styles.iconCol}>
              <View
                style={[
                  styles.dot,
                  step.state === 'done' && styles.dotDone,
                  step.state === 'active' && styles.dotActive,
                ]}
              >
                {step.state === 'done' && <Ionicons name="checkmark" size={12} color={colors.textInverse} />}
              </View>
              {!isLast && (
                <View style={[styles.line, step.state === 'done' && styles.lineDone]} />
              )}
            </View>
            <View style={styles.textCol}>
              <Text
                style={[
                  typography.bodyMedium,
                  { color: step.state === 'pending' ? colors.textSecondary : colors.textPrimary },
                ]}
              >
                {step.label}
              </Text>
              {step.timestamp && <Text style={styles.timestamp}>{step.timestamp}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  iconCol: { alignItems: 'center', width: 24, marginRight: spacing.md },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.primary },
  dotActive: { backgroundColor: colors.primary, opacity: 0.55 },
  line: { width: 2, flex: 1, minHeight: 28, backgroundColor: colors.divider, marginVertical: 2 },
  lineDone: { backgroundColor: colors.primary },
  textCol: { flex: 1, paddingBottom: spacing.lg },
  timestamp: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
