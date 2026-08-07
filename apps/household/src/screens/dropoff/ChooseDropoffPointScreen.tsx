import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ChooseDropoffPoint'>;

const points = [
  { name: 'EcoHand Depo', distance: '0.8 km', accepts: 'Plastic, Metal', rating: 4.7 },
  { name: 'GreenCity Recyclers', distance: '1.4 km', accepts: 'Paper, Glass', rating: 4.5 },
  { name: 'Recycle Point Lekki', distance: '2.1 km', accepts: 'All materials', rating: 4.9 },
];

export default function ChooseDropoffPointScreen({ navigation }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <ScreenContainer scroll>
      <Header title="Choose Drop-off points" />
      <ProgressBar progress={0.4} />

      <Text style={styles.subtitle}>Nearby recyclers matching your materials</Text>

      {points.map((p, i) => {
        const active = i === selected;
        return (
          <Pressable key={p.name} onPress={() => setSelected(i)} style={[styles.card, active && styles.cardActive]}>
            <View style={styles.iconWrap}>
              <Ionicons name="business-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.meta}>{p.distance} away · Accepts {p.accepts}</Text>
            </View>
            <Text style={styles.rating}>★ {p.rating}</Text>
          </Pressable>
        );
      })}

      <Button
        label="Select this recycler"
        onPress={() => navigation.navigate('RecyclerDetails', { recyclerName: points[selected].name })}
        style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { ...typography.body, color: colors.textBody, marginTop: spacing.lg, marginBottom: spacing.lg },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1.5, borderColor: colors.border, marginBottom: spacing.md },
  cardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  rating: { ...typography.captionMedium, color: colors.warning },
});
