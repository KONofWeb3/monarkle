import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  fullWidth?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  iconPosition = 'right',
  style,
  fullWidth = true,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        fullWidth && { width: '100%' },
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={18} color={textColor[variant]} style={{ marginRight: spacing.sm }} />
          )}
          <Text style={[styles.label, { color: textColor[variant] }]}>{label}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={18} color={textColor[variant]} style={{ marginLeft: spacing.sm }} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label: { ...typography.button },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryLight },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.danger },
};

const textColor: Record<Variant, string> = {
  primary: colors.textInverse,
  secondary: colors.primary,
  outline: colors.textPrimary,
  ghost: colors.primary,
  danger: colors.textInverse,
};
