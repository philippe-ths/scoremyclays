import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, MIN_TAP_TARGET_SIZE } from '@/lib/constants';
import type { ShooterEntry, EnrichedShooterEntry } from '@/lib/types';

export type ShooterStatus = 'not-started' | 'in-progress' | 'completed';

export interface ShooterProgress {
  recorded: number;
  total: number;
}

interface ShooterPickerProps {
  standLabel: string;
  shooters: (ShooterEntry | EnrichedShooterEntry)[];
  shooterStatuses: Record<string, ShooterStatus>;
  shooterProgress: Record<string, ShooterProgress>;
  onSelectShooter: (shooter: ShooterEntry | EnrichedShooterEntry) => void;
  onBack?: () => void;
  /** Action when all shooters at this stand are completed */
  onAllComplete?: () => void;
  allCompleteLabel?: string;
}

const STATUS_COLORS: Record<ShooterStatus, string> = {
  'not-started': Colors.bgTertiary,
  'in-progress': '#FEF3C7',
  completed: '#DCFCE7',
};

const STATUS_BORDER: Record<ShooterStatus, string> = {
  'not-started': Colors.border,
  'in-progress': Colors.noBird,
  completed: Colors.hit,
};

const STATUS_LABELS: Record<ShooterStatus, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export default function ShooterPicker({
  standLabel,
  shooters,
  shooterStatuses,
  shooterProgress,
  onSelectShooter,
  onBack,
  onAllComplete,
  allCompleteLabel,
}: ShooterPickerProps) {
  const allCompleted = shooters.length > 0 && shooters.every(
    (s) => (shooterStatuses[s.id] ?? 'not-started') === 'completed',
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{standLabel}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}>Choose a Shooter</Text>

        {shooters.map((shooter) => {
          const status = shooterStatuses[shooter.id] ?? 'not-started';
          const progress = shooterProgress[shooter.id];
          return (
            <TouchableOpacity
              key={shooter.id}
              style={[
                styles.shooterCard,
                { backgroundColor: STATUS_COLORS[status], borderColor: STATUS_BORDER[status] },
              ]}
              onPress={() => onSelectShooter(shooter)}
            >
              <View style={styles.shooterHeader}>
                <View style={styles.shooterNameGroup}>
                  <Text style={styles.shooterName}>{shooter.shooter_name}</Text>
                  {'user_handle' in shooter && shooter.user_handle ? (
                    <Text style={styles.shooterHandle}>@{shooter.user_handle}</Text>
                  ) : null}
                </View>
                <Text style={[styles.statusBadge, { color: STATUS_BORDER[status] }]}>
                  {STATUS_LABELS[status]}
                </Text>
              </View>
              <Text style={styles.shooterMeta}>
                Position {shooter.position_in_squad}
                {progress ? ` · ${progress.recorded}/${progress.total} targets` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {allCompleted && onAllComplete && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} onPress={onAllComplete}>
            <Text style={styles.nextBtnText}>
              {allCompleteLabel ?? 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  scroll: {
    flex: 1,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  subtitle: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  shooterCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    minHeight: MIN_TAP_TARGET_SIZE,
  },
  shooterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shooterNameGroup: {
    flex: 1,
  },
  shooterName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  shooterHandle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  statusBadge: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  shooterMeta: {
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
  nextBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
