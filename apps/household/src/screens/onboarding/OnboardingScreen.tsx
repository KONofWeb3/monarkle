import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import ProgressDots from '../../components/ProgressDots';
import { colors, spacing, typography } from '../../theme';
import { useAppState } from '../../data/AppContext';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'gift-outline' as const,
    title: 'Turn waste into wealth',
    body: 'Sell your recyclable materials to verified aggregators and earn money directly to your wallet.',
  },
  {
    icon: 'navigate-circle-outline' as const,
    title: 'Connect with the Right Collection Network',
    body: 'Find nearby recycling centers for valuable materials or schedule trusted pickups for organic waste.',
  },
  {
    icon: 'trending-up-outline' as const,
    title: 'Earn While Protecting the Environment',
    body: "Receive payments for recyclables, track your environmental impact, and join Africa's circular economy.",
  },
];

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const { completeOnboarding } = useAppState();

  const next = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      completeOnboarding();
      onDone();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(s) => s.title}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.artWrap}>
              <View style={styles.artCircle}>
                <Ionicons name={item.icon} size={72} color={colors.primary} />
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.sheet}>
        <Text style={styles.title}>{slides[index].title}</Text>
        <Text style={styles.body}>{slides[index].body}</Text>
        <View style={styles.footer}>
          <ProgressDots count={slides.length} activeIndex={index} />
          <View style={{ height: spacing.xl }} />
          <Button label="Next" icon="arrow-forward" onPress={next} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  slide: { alignItems: 'center', justifyContent: 'center' },
  artWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt, width: '100%' },
  artCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: { backgroundColor: colors.surface, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  body: { ...typography.bodyLg, color: colors.textBody },
  footer: { marginTop: spacing.xxxl, paddingBottom: spacing.xl },
});
