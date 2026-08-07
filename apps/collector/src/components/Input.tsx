import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  secure?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  prefix?: string;
};

export default function Input({ label, error, hint, secure, leftIcon, prefix, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!secure);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          error && styles.inputRowError,
        ]}
      >
        {leftIcon && <Ionicons name={leftIcon} size={18} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />}
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={hidden}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          {...rest}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg, width: '100%' },
  label: { ...typography.captionMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  inputRowFocused: { borderColor: colors.primary },
  inputRowError: { borderColor: colors.danger },
  prefix: { ...typography.body, color: colors.textPrimary, marginRight: spacing.xs },
  input: { flex: 1, ...typography.body, color: colors.textPrimary, height: '100%' },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
  hint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
});
