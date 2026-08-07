import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';

type Props = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export default function Header({ title, onBack, right }: Props) {
  const navigation = useNavigation();
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onBack ?? (() => navigation.goBack())}
        hitSlop={12}
        style={styles.iconBtn}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : <View style={{ flex: 1 }} />}
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  },
  right: { minWidth: 36, alignItems: 'flex-end' },
});
