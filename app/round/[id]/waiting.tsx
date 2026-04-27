import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { usePowerSync, useQuery } from '@powersync/react';
import { smcGetRound } from '@/db/queries/smc-rounds';
import { smcGetSquadByRound, smcListShooterEntries } from '@/db/queries/smc-squads';
import { smcGetClubWithDetails } from '@/db/queries/smc-clubs';
import { smcGetUserById } from '@/db/queries/smc-users';
import { color, radius, space } from '@/lib/design-system';
import { formatStandDetail, formatPositionTitle } from '@/lib/formatting';
import { RoundStatus, type ShooterEntry, type Round, type PositionWithStands, type User } from '@/lib/types';
import {
  Badge,
  Body,
  BodySm,
  Card,
  H1,
  H3,
  Meta,
  Screen,
  TopBar,
} from '@/components/ui';

export default function RoundWaitingScreen() {
  const { id: roundId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();

  const [round, setRound] = useState<Round | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [shooters, setShooters] = useState<ShooterEntry[]>([]);
  const [clubName, setClubName] = useState<string | null>(null);
  const [clubPositions, setClubPositions] = useState<PositionWithStands[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: roundRows } = useQuery<Round>('SELECT * FROM rounds WHERE id = ?', [
    roundId ?? '',
  ]);
  const reactiveRound = roundRows?.[0] ?? null;

  const { data: shooterRows } = useQuery<ShooterEntry>(
    `SELECT se.* FROM shooter_entries se
     JOIN squads s ON se.squad_id = s.id
     WHERE s.round_id = ?
     ORDER BY se.position_in_squad`,
    [roundId ?? ''],
  );
  const reactiveShooters = shooterRows ?? [];

  useEffect(() => {
    if (reactiveRound?.status === RoundStatus.IN_PROGRESS) {
      router.replace(`/round/${roundId}/score`);
    }
  }, [reactiveRound?.status, roundId, router]);

  const reload = useCallback(async () => {
    if (!roundId) return;
    setLoading(true);
    try {
      const r = await smcGetRound(db, roundId);
      setRound(r);
      if (r?.created_by) setOwner(await smcGetUserById(db, r.created_by));
      if (r?.club_id) {
        const clubData = await smcGetClubWithDetails(db, r.club_id);
        if (clubData) {
          setClubName(clubData.club.name);
          setClubPositions(clubData.positions);
        }
      }
      const squad = await smcGetSquadByRound(db, roundId);
      if (squad) setShooters(await smcListShooterEntries(db, squad.id));
    } finally {
      setLoading(false);
    }
  }, [db, roundId]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const displayShooters = reactiveShooters.length > 0 ? reactiveShooters : shooters;

  if (loading) {
    return (
      <Screen>
        <TopBar title="Waiting" onBack={() => router.back()} />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      </Screen>
    );
  }

  const ownerName = owner?.display_name ?? 'the round owner';

  return (
    <Screen>
      <TopBar title={clubName ?? 'Waiting'} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.banner}>
          <H3 tone="default" style={{ color: color.noBird }}>
            Waiting to Start
          </H3>
          <Body tone="muted" align="center" style={{ marginTop: space[1] }}>
            Waiting for {ownerName} to start the round.
          </Body>
        </View>

        {clubName ? <H1>{clubName}</H1> : null}

        {clubPositions.length > 0 ? (
          <View style={styles.section}>
            <H3>Positions</H3>
            <View style={{ gap: space[2] }}>
              {clubPositions.map((position) => (
                <Card key={position.id}>
                  <Body weight="600">{formatPositionTitle(position)}</Body>
                  {position.stands.map((stand) => (
                    <Meta key={stand.id} style={{ marginTop: space[1] }}>
                      Stand {stand.stand_number} · {formatStandDetail(stand)}
                    </Meta>
                  ))}
                </Card>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <H3>Squad</H3>
          {displayShooters.length === 0 ? (
            <BodySm tone="meta" style={{ fontStyle: 'italic' }}>
              No shooters added yet.
            </BodySm>
          ) : (
            <View style={{ gap: space[2] }}>
              {displayShooters.map((entry) => (
                <Card key={entry.id}>
                  <Body weight="600">
                    {entry.position_in_squad}. {entry.shooter_name}
                  </Body>
                  {entry.user_id ? (
                    <Badge label="Linked" tone="info" style={{ marginTop: space[1] }} />
                  ) : null}
                </Card>
              ))}
            </View>
          )}
        </View>

        {round ? null : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    padding: space[5],
    paddingBottom: space[12],
    gap: space[6],
  },
  banner: {
    backgroundColor: color.noBirdBg,
    borderColor: color.noBird,
    borderLeftWidth: 4,
    borderRadius: radius.md,
    padding: space[4],
    alignItems: 'center',
  },
  section: {
    gap: space[3],
  },
});
