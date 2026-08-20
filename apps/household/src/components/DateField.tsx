import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  label?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  placeholder?: string;
};

function formatDate(d: Date) {
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DateField({ label, value, onChange, minimumDate, placeholder = 'Select a date' }: Props) {
  const [open, setOpen] = useState(false);

  // Android's picker is a modal dialog that fires once and closes itself;
  // iOS's inline spinner stays mounted and needs an explicit "Done".
  const onAndroidChange = (event: { type: string }, selected?: Date) => {
    setOpen(false);
    if (event.type === 'set' && selected) onChange(selected);
  };

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
        <Text style={value ? styles.value : styles.placeholder}>{value ? formatDate(value) : placeholder}</Text>
      </Pressable>

      {open && Platform.OS === 'android' && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          onChange={onAndroidChange}
        />
      )}

      {open && Platform.OS === 'ios' && (
        <View style={styles.iosPickerWrap}>
          <DateTimePicker
            value={value ?? new Date()}
            mode="date"
            display="spinner"
            minimumDate={minimumDate}
            onChange={(_, selected) => selected && onChange(selected)}
          />
          <Pressable style={styles.doneBtn} onPress={() => setOpen(false)}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      )}

      {open && Platform.OS === 'web' && (
        // Plain HTML date input — only rendered on web, where react-native-web
        // already types intrinsic DOM elements.
        <input
          type="date"
          autoFocus
          onBlur={() => setOpen(false)}
          onChange={(e: any) => {
            if (e.target.value) onChange(new Date(e.target.value));
            setOpen(false);
          }}
          style={{ marginTop: 8, padding: 8, borderRadius: 8, border: `1px solid ${colors.border}` }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg, width: '100%' },
  label: { ...typography.captionMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  field: {
    flexDirection: 'row', alignItems: 'center', height: 56,
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, backgroundColor: colors.surface,
  },
  value: { ...typography.body, color: colors.textPrimary },
  placeholder: { ...typography.body, color: colors.textSecondary },
  iosPickerWrap: { backgroundColor: colors.surface, borderRadius: radius.md, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border },
  doneBtn: { alignItems: 'center', paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider },
  doneText: { ...typography.bodyMedium, color: colors.primary },
});
