import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';

export default function ProgressDots({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { height: 8, borderRadius: radius.pill, marginRight: 8 },
  dotActive: { width: 32, backgroundColor: colors.primary },
  dotInactive: { width: 8, backgroundColor: colors.divider },
});
