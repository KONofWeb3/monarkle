import React, { useState } from 'react';
import { Linking, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge, { StatusKind } from '../../components/StatusBadge';
import Timeline, { TimelineStep } from '../../components/Timeline';
import { colors, radius, spacing, typography } from '../../theme';
import { Pickup } from '../../data/types';
import { useAppState } from '../../data/AppContext';

const statusMap: Record<Pickup['status'], StatusKind> = {
  pending: 'pending',
  assigned: 'assigned',
  inProgress: 'inProgress',
  completed: 'completed',
  cancelled: 'cancelled',
};

function buildSteps(pickup: Pickup): TimelineStep[] {
  const order: Pickup['status'][] = ['pending', 'assigned', 'inProgress', 'completed'];
  const labels: Record<Pickup['status'], string> = {
    pending: 'Submitted',
    assigned: 'PSP Assigned',
    inProgress: 'On the way',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  if (pickup.status === 'cancelled') {
    return [
      { label: 'Submitted', state: 'done', timestamp: pickup.createdAt },
      { label: 'Cancelled', state: 'active' },
    ];
  }
  const currentIdx = order.indexOf(pickup.status);
  return order.map((s, i) => ({
    label: labels[s],
    state: i < currentIdx ? 'done' : i === currentIdx ? 'done' : 'pending',
    timestamp: i === 0 ? pickup.createdAt : i === order.length - 1 ? pickup.completedAt : undefined,
  }));
}

export default function PickupDetailView({ pickup, onBack }: { pickup: Pickup; onBack?: () => void }) {
  const { cancelPickup, ratePickup } = useAppState();
  const [rateOpen, setRateOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const steps = buildSteps(pickup);
  const isCompleted = pickup.status === 'completed';
  const isCancellable = pickup.status === 'pending' || pickup.status === 'assigned';

  return (
    <ScreenContainer scroll>
      <Header title={`#${pickup.code}`} onBack={onBack} right={<StatusBadge status={statusMap[pickup.status]} />} />

      <Card>
        <Text style={styles.cardTitle}>Pickup details</Text>
        <Row label="Category" value={pickup.category} />
        <Row label="Quantity" value={pickup.quantity} />
        <Row label="Intent" value={pickup.intent} />
        <Row label="Address" value={pickup.address} />
        <Row label="Scheduled" value={`${pickup.scheduledDate} · ${pickup.scheduledTime}`} />
        {pickup.psp && <Row label="PSP" value={pickup.psp.name} />}
        {isCompleted && (
          <>
            <Row label="Weight collected" value={`${pickup.weightKg ?? 12} kg`} />
            <Row label="Net payout" value={`₦${(pickup.netPayout ?? 0).toLocaleString()}`} />
          </>
        )}
      </Card>

      {pickup.psp && !isCompleted && (
        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.pspRow}>
            <View style={styles.pspAvatar}><Ionicons name="person" size={18} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pspName}>{pickup.psp.name}</Text>
              <Text style={styles.pspRating}>★ {pickup.psp.rating.toFixed(1)}</Text>
            </View>
            <Pressable style={styles.circleBtn} onPress={() => Linking.openURL(`tel:${pickup.psp?.phone}`)}>
              <Ionicons name="call-outline" size={16} color={colors.primary} />
            </Pressable>
            <Pressable style={[styles.circleBtn, { marginLeft: spacing.sm }]}>
              <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
            </Pressable>
          </View>
        </Card>
      )}

      <View style={{ marginTop: spacing.xl }}>
        <Text style={styles.cardTitle}>Timeline</Text>
        <Timeline steps={steps} />
      </View>

      {isCompleted && (
        <View style={{ marginTop: spacing.md }}>
          <Button label="Rate your operator" variant="outline" onPress={() => setRateOpen(true)} style={{ marginBottom: spacing.sm }} />
          <Button label="Download receipt" variant="outline" onPress={() => {}} />
        </View>
      )}

      {isCancellable && (
        <Pressable style={styles.cancelRow} onPress={() => cancelPickup(pickup.id).catch(() => {})}>
          <Text style={styles.cancelText}>Cancel pickup</Text>
        </Pressable>
      )}

      <Modal visible={rateOpen} transparent animationType="fade" onRequestClose={() => setRateOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rate your operator</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => setRating(n)}>
                  <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={30} color={n <= rating ? colors.warning : colors.textSecondary} style={{ marginHorizontal: 4 }} />
                </Pressable>
              ))}
            </View>
            <TextInput
              placeholder="Optional feedback (max 300 chars)..."
              placeholderTextColor={colors.textSecondary}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              style={styles.feedbackInput}
              maxLength={300}
            />
            <Button
              label="Submit rating"
              disabled={rating === 0}
              onPress={() => {
                ratePickup(pickup.id, rating, feedback);
                setRateOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.captionMedium, color: colors.textPrimary },
  pspRow: { flexDirection: 'row', alignItems: 'center' },
  pspAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  pspName: { ...typography.bodyMedium, color: colors.textPrimary },
  pspRating: { ...typography.caption, color: colors.textSecondary },
  circleBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  cancelRow: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl },
  cancelText: { ...typography.bodyMedium, color: colors.danger },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  modalCard: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl },
  modalTitle: { ...typography.h4, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.lg },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg },
  feedbackInput: { minHeight: 80, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, ...typography.body, color: colors.textPrimary, marginBottom: spacing.lg, textAlignVertical: 'top' },
});
