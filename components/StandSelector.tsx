import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, PRESENTATION_LABELS } from '@/lib/constants';
import type { ClubStand, PresentationType } from '@/lib/types';

const TARGET_CONFIG_LABELS: Record<string, string> = {
  SINGLE: 'Single',
  REPORT_PAIR: 'Report Pair',
  SIMULTANEOUS_PAIR: 'Sim Pair',
  FOLLOWING_PAIR: 'Following Pair',
};

interface StandSelectorProps {
  positionName: string;
  stands: ClubStand[];
  /** Set of club_stand_ids already scored in this round */
  completedStandIds: Set<string>;
  onSelectStand: (clubStand: ClubStand) => void;
  onBack: () => void;
}

export default function StandSelector({
  positionName,
  stands,
  completedStandIds,
  onSelectStand,
  onBack,
}: StandSelectorProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{positionName}</Text>
      </View>

      <View style={styles.container}>
        {stands.map((stand) => {
          const isCompleted = completedStandIds.has(stand.id);
          return (
            <TouchableOpacity
              key={stand.id}
              style={[styles.standCard, isCompleted && styles.standCardCompleted]}
              onPress={() => onSelectStand(stand)}
            >
              <View style={styles.standHeader}>
                <Text style={styles.standTitle}>Stand {stand.stand_number}</Text>
                {isCompleted && (
                  <Text style={styles.completedBadge}>✓ Done</Text>
                )}
              </View>
              <Text style={styles.standDetail}>
                {TARGET_CONFIG_LABELS[stand.target_config] ?? stand.target_config} · {PRESENTATION_LABELS[stand.presentation as PresentationType] ?? stand.presentation} · {stand.num_targets} targets
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bgSecondary,
    gap: Spacing.md,
  },
  backText: {
    fontSize: FontSize.base,
    color: Colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  container: {
    padding: Spacing.lg,
  },
  standCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
  },
  standCardCompleted: {
    backgroundColor: '#DCFCE7',
    borderColor: Colors.hit,
  },
  standHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  standTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  completedBadge: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.hit,
  },
  standDetail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
