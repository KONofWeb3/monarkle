import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  padded?: boolean;
  background?: string;
  edges?: Edge[];
};

export default function ScreenContainer({
  children,
  scroll = false,
  style,
  padded = true,
  background = colors.background,
  edges = ['top', 'left', 'right'],
}: Props) {
  const Container = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={edges}>
      <Container
        style={scroll ? undefined : [styles.body, padded && styles.padded, style]}
        contentContainerStyle={scroll ? [styles.body, padded && styles.padded, style] : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: { flexGrow: 1 },
  padded: { paddingHorizontal: spacing.xl },
});
