import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { smcGetRound } from '@/db/queries/smc-rounds';
import { smcGetSquadByRound, smcListShooterEntries } from '@/db/queries/smc-squads';
import { smcListStands } from '@/db/queries/smc-stands';
import { smcGetShooterRoundScore, smcGetResultsForStandAndShooter } from '@/db/queries/smc-scoring';
import { smcGetClubPositions } from '@/db/queries/smc-clubs';
import { useAuth } from '@/providers/AuthProvider';
import { PRESENTATION_LABELS } from '@/lib/constants';
import { color, fontFamily, radius, space } from '@/lib/design-system';
import LoadingPlaceholder from '@/components/LoadingPlaceholder';
import {
  ShotResult,
  RoundStatus,
  type Round,
  type Stand,
  type ShooterEntry,
  type PresentationType,
  type ClubPosition,
} from '@/lib/types';
import {
  Badge,
  Body,
  BodySm,
  Button,
  Card,
  CircularStat,
  H3,
  Meta,
  PhotoHeader,
  Screen,
  Typography,
} from '@/components/ui';

interface ShooterScore {
  shooter: ShooterEntry;
  kills: number;
  total: number;
  hasConflicts: boolean;
}

interface StandBreakdown {
  stand: Stand;
  results: { shooter: ShooterEntry; kills: number; total: number }[];
}

interface PositionBreakdown {
  position: ClubPosition;
  stands: StandBreakdown[];
}

export default function RoundSummaryScreen() {
  const { id: roundId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();

  const [round, setRound] = useState<Round | null>(null);
  const [shooterScores, setShooterScores] = useState<ShooterScore[]>([]);
  const [positionBreakdowns, setPositionBreakdowns] = useState<PositionBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!roundId) return;
      const r = await smcGetRound(db, roundId);
      setRound(r);

      const stands = await smcListStands(db, roundId);
      const squad = await smcGetSquadByRound(db, roundId);
      if (!squad) {
        setIsLoading(false);
        return;
      }
      const shooters = await smcListShooterEntries(db, squad.id);

      const scores: ShooterScore[] = [];
      for (const shooter of shooters) {
        const score = await smcGetShooterRoundScore(db, roundId, shooter.id);
        scores.push({ shooter, kills: score.kills, total: score.total, hasConflicts: score.hasConflicts });
      }
      setShooterScores(scores);

      const breakdowns: StandBreakdown[] = [];
      for (const stand of stands) {
        const results: StandBreakdown['results'] = [];
        for (const shooter of shooters) {
          const standResults = await smcGetResultsForStandAndShooter(db, stand.id, shooter.id);
          const kills = standResults.filter((res) => res.result === ShotResult.KILL).length;
          results.push({ shooter, kills, total: standResults.length });
        }
        breakdowns.push({ stand, results });
      }

      if (r?.club_id) {
        const positions = await smcGetClubPositions(db, r.club_id);
        const grouped = new Map<string, StandBreakdown[]>();
        for (const bd of breakdowns) {
          const posId = bd.stand.club_position_id;
          if (posId) {
            const arr = grouped.get(posId) ?? [];
            arr.push(bd);
            grouped.set(posId, arr);
          }
        }
        const posBreakdowns: PositionBreakdown[] = [];
        for (const pos of positions) {
          const posStands = grouped.get(pos.id);
          if (posStands && posStands.length > 0) {
            posBreakdowns.push({ position: pos, stands: posStands });
          }
        }
        setPositionBreakdowns(posBreakdowns);
      }

      setIsLoading(false);
    })();
  }, [db, roundId]);

  if (isLoading) return <LoadingPlaceholder message="Loading summary…" />;

  const myScore = shooterScores.find((s) => s.shooter.user_id === user?.id) ?? shooterScores[0];
  const myPercent = myScore && myScore.total > 0 ? (myScore.kills / myScore.total) * 100 : 0;
  const anyConflicts = shooterScores.some((s) => s.hasConflicts);
  const isOwner = user?.id === round?.created_by;

  return (
    <Screen edges={['left', 'right']}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.floatingBack}>
        <View style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={color.fgInverse} />
        </View>
      </Pressable>
      <ScrollView contentContainerStyle={styles.scroll}>
        <PhotoHeader
          eyebrow={round?.date ?? 'Round'}
          title={round?.ground_name ?? 'Round'}
          height={220}
        />

        <View style={styles.body}>
          {myScore ? (
            <View style={styles.heroStat}>
              <CircularStat
                value={myPercent}
                size={160}
                stroke={14}
                label={myScore.shooter.shooter_name.toUpperCase()}
              />
              <Meta style={{ marginTop: space[3] }}>
                {myScore.kills} of {myScore.total} Targets
              </Meta>
            </View>
          ) : null}

          <View style={styles.sectionHead}>
            <H3>Scores</H3>
            {anyConflicts && isOwner ? (
              <Button
                label="Resolve Conflicts"
                variant="destructive"
                size="md"
                onPress={() => router.push(`/round/${roundId}/conflicts`)}
              />
            ) : null}
          </View>

          <Card padded={false} style={styles.scoresCard}>
            {shooterScores.map((s, idx) => (
              <View
                key={s.shooter.id}
                style={[
                  styles.scoreRow,
                  idx === shooterScores.length - 1 ? styles.scoreRowLast : null,
                ]}
              >
                <Body weight="600" style={{ flex: 1 }}>
                  {s.shooter.shooter_name}
                </Body>
                {s.hasConflicts ? (
                  <Badge label="Conflicted" tone="warning" />
                ) : (
                  <Typography
                    style={{
                      fontFamily: fontFamily.monoBold,
                      fontSize: 22,
                      color: color.primary,
                    }}
                  >
                    {s.kills} / {s.total}
                  </Typography>
                )}
              </View>
            ))}
          </Card>

          {positionBreakdowns.length > 0 ? (
            <View style={styles.section}>
              <H3>Position Breakdown</H3>
              {positionBreakdowns.map((pb) => (
                <View key={pb.position.id} style={{ gap: space[2] }}>
                  <Typography
                    style={{
                      fontFamily: fontFamily.bodyBold,
                      fontSize: 14,
                      color: color.primary,
                      textTransform: 'uppercase',
                      letterSpacing: 1.2,
                    }}
                  >
                    Position {pb.position.position_number}
                    {pb.position.name ? ` — ${pb.position.name}` : ''}
                  </Typography>
                  {pb.stands.map((bd) => (
                    <Card key={bd.stand.id}>
                      <Body weight="600">
                        Stand {bd.stand.stand_number} ·{' '}
                        {PRESENTATION_LABELS[bd.stand.presentation as PresentationType]}
                      </Body>
                      <View style={{ marginTop: space[2], gap: space[1] }}>
                        {bd.results.map((r) => (
                          <View key={r.shooter.id} style={styles.standResultRow}>
                            <BodySm tone="muted">{r.shooter.shooter_name}</BodySm>
                            <Typography
                              style={{
                                fontFamily: fontFamily.monoSemibold,
                                fontSize: 14,
                                color: color.fg1,
                              }}
                            >
                              {r.kills}/{r.total}
                            </Typography>
                          </View>
                        ))}
                      </View>
                    </Card>
                  ))}
                </View>
              ))}
            </View>
          ) : null}

          <View style={{ gap: space[3], marginTop: space[6] }}>
            {round?.status === RoundStatus.IN_PROGRESS ? (
              <Button
                label="Continue Scoring"
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => router.push(`/round/${roundId}/score`)}
              />
            ) : null}
            <Button
              label="Back to Home"
              variant="secondary"
              size="lg"
              fullWidth
              onPress={() => router.replace('/')}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: space[12],
  },
  floatingBack: {
    position: 'absolute',
    top: space[3],
    left: space[4],
    zIndex: 2,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15,29,13,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: space[5],
    paddingTop: space[5],
    gap: space[6],
  },
  heroStat: {
    alignItems: 'center',
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space[2],
  },
  scoresCard: {
    overflow: 'hidden',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space[3] + 2,
    paddingHorizontal: space[4],
    borderBottomWidth: 1,
    borderBottomColor: color.border1,
  },
  scoreRowLast: {
    borderBottomWidth: 0,
  },
  section: {
    gap: space[3],
  },
  standResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
