import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { getRound } from '@/db/queries/rounds';
import { getSquadByRound, listShooterEntries } from '@/db/queries/squads';
import { listStands } from '@/db/queries/stands';
import { getShooterRoundScore, getResultsForStandAndShooter } from '@/db/queries/scoring';
import { Colors, Spacing, FontSize, BorderRadius, PRESENTATION_LABELS } from '@/lib/constants';
import { ShotResult, type Round, type Stand, type ShooterEntry, type PresentationType } from '@/lib/types';

interface ShooterScore {
  shooter: ShooterEntry;
  kills: number;
  total: number;
}

interface StandBreakdown {
  stand: Stand;
  results: { shooter: ShooterEntry; kills: number; total: number }[];
}

export default function RoundSummaryScreen() {
  const { id: roundId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();

  const [round, setRound] = useState<Round | null>(null);
  const [shooterScores, setShooterScores] = useState<ShooterScore[]>([]);
  const [standBreakdowns, setStandBreakdowns] = useState<StandBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!roundId) return;

      const r = await getRound(db, roundId);
      setRound(r);

      const stands = await listStands(db, roundId);
      const squad = await getSquadByRound(db, roundId);
      if (!squad) { setIsLoading(false); return; }
      const shooters = await listShooterEntries(db, squad.id);

      // Per-shooter totals
      const scores: ShooterScore[] = [];
      for (const shooter of shooters) {
        const score = await getShooterRoundScore(db, roundId, shooter.id);
        scores.push({ shooter, kills: score.kills, total: score.total });
      }
      setShooterScores(scores);

      // Per-stand breakdown
      const breakdowns: StandBreakdown[] = [];
      for (const stand of stands) {
        const results: StandBreakdown['results'] = [];
        for (const shooter of shooters) {
          const standResults = await getResultsForStandAndShooter(db, stand.id, shooter.id);
          const kills = standResults.filter((r) => r.result === ShotResult.KILL).length;
          results.push({ shooter, kills, total: standResults.length });
        }
        breakdowns.push({ stand, results });
      }
      setStandBreakdowns(breakdowns);
      setIsLoading(false);
    })();
  }, [db, roundId]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading summary...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.groundName}>{round?.ground_name ?? 'Round'}</Text>
        <Text style={styles.date}>{round?.date}</Text>
      </View>

      {/* Overall scores */}
      <Text style={styles.sectionTitle}>Scores</Text>
      {shooterScores.map((s) => (
        <View key={s.shooter.id} style={styles.scoreRow}>
          <Text style={styles.shooterName}>{s.shooter.shooter_name}</Text>
          <Text style={styles.shooterScore}>
            {s.kills} / {s.total}
          </Text>
        </View>
      ))}

      {/* Per-stand breakdown */}
      <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Stand Breakdown</Text>
      {standBreakdowns.map((bd) => (
        <View key={bd.stand.id} style={styles.standCard}>
          <Text style={styles.standTitle}>
            Stand {bd.stand.stand_number} · {PRESENTATION_LABELS[bd.stand.presentation as PresentationType]}
          </Text>
          {bd.results.map((r) => (
            <View key={r.shooter.id} style={styles.standResultRow}>
              <Text style={styles.standShooterName}>{r.shooter.shooter_name}</Text>
              <Text style={styles.standShooterScore}>
                {r.kills}/{r.total}
              </Text>
            </View>
          ))}
        </View>
      ))}

      {/* Back to Home */}
      <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/')}>
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  groundName: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  date: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  shooterName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  shooterScore: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.hit,
  },
  standCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
  },
  standTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  standResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  standShooterName: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  standShooterScore: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  homeBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  homeBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
