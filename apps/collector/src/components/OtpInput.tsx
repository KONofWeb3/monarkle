import React, { useRef } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { colors, radius, typography } from '../theme';

type Props = {
  length?: number;
  value: string;
  onChange: (v: string) => void;
};

export default function OtpInput({ length = 4, value, onChange }: Props) {
  const refs = useRef<Array<TextInput | null>>([]);
  const digits = value.split('');

  const setDigit = (i: number, d: string) => {
    const next = value.split('');
    next[i] = d;
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (d && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onKeyPress = (i: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(r) => { refs.current[i] = r; }}
          value={digits[i] ?? ''}
          onChangeText={(d) => setDigit(i, d.replace(/[^0-9]/g, '').slice(-1))}
          onKeyPress={(e) => onKeyPress(i, e)}
          keyboardType="number-pad"
          maxLength={1}
          style={[styles.box, digits[i] && styles.boxFilled]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  box: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    textAlign: 'center',
    ...typography.h3,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  boxFilled: { borderColor: colors.primary },
});
