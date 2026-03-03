import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, PRESENTATION_LABELS } from '@/lib/constants';
import type { ClubPosition, ClubStand, Stand, PresentationType } from '@/lib/types';

type PositionWithStands = ClubPosition & { stands: ClubStand[] };

export type PositionStatus = 'not-started' | 'in-progress' | 'completed';

interface PositionPickerProps {
  positions: PositionWithStands[];
  /** Map of club_position_id → status based on which stands have been scored */
  positionStatuses: Record<string, PositionStatus>;
  onSelectPosition: (position: PositionWithStands) => void;
  onFinishRound: () => void;
}

const STATUS_COLORS: Record<PositionStatus, string> = {
  'not-started': Colors.bgTertiary,
  'in-progress': '#FEF3C7', // warm yellow bg
  completed: '#DCFCE7', // green bg
};

const STATUS_BORDER: Record<PositionStatus, string> = {
  'not-started': Colors.border,
  'in-progress': Colors.noBird,
  completed: Colors.hit,
};

const STATUS_LABELS: Record<PositionStatus, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export default function PositionPicker({
  positions,
  positionStatuses,
  onSelectPosition,
  onFinishRound,
}: PositionPickerProps) {
  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Choose a Position</Text>

        {positions.map((position) => {
          const status = positionStatuses[position.id] ?? 'not-started';
          return (
            <TouchableOpacity
              key={position.id}
              style={[
                styles.positionCard,
                { backgroundColor: STATUS_COLORS[status], borderColor: STATUS_BORDER[status] },
              ]}
              onPress={() => onSelectPosition(position)}
            >
              <View style={styles.positionHeader}>
                <Text style={styles.positionTitle}>
                  Position {position.position_number}
                  {position.name ? ` — ${position.name}` : ''}
                </Text>
                <Text style={[styles.statusBadge, { color: STATUS_BORDER[status] }]}>
                  {STATUS_LABELS[status]}
                </Text>
              </View>
              <Text style={styles.positionMeta}>
                {position.stands.length} stand{position.stands.length !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishBtn} onPress={onFinishRound}>
          <Text style={styles.finishBtnText}>Finish Round</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  positionCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  positionMeta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgSecondary,
  },
  finishBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  finishBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
