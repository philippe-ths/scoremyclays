import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { usePowerSync, useQuery } from '@powersync/react';
import { smcGetRound } from '@/db/queries/smc-rounds';
import { smcGetSquadByRound, smcListShooterEntries } from '@/db/queries/smc-squads';
import { smcGetClubWithDetails } from '@/db/queries/smc-clubs';
import { smcGetUserById } from '@/db/queries/smc-users';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/constants';
import { formatStandDetail, formatPositionTitle } from '@/lib/formatting';
import { RoundStatus, type ShooterEntry, type Round, type PositionWithStands, type User } from '@/lib/types';

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

  // Reactive subscription on round status — triggers re-render when status changes
  const { data: roundRows } = useQuery<Round>(
    'SELECT * FROM rounds WHERE id = ?',
    [roundId ?? ''],
  );
  const reactiveRound = roundRows?.[0] ?? null;

  // Reactive subscription on squad members — updates when owner modifies squad
  const { data: shooterRows } = useQuery<ShooterEntry>(
    `SELECT se.* FROM shooter_entries se
     JOIN squads s ON se.squad_id = s.id
     WHERE s.round_id = ?
     ORDER BY se.position_in_squad`,
    [roundId ?? ''],
  );
  const reactiveShooters = shooterRows ?? [];

  // Auto-navigate to scoring when round status becomes IN_PROGRESS
  useEffect(() => {
    if (reactiveRound?.status === RoundStatus.IN_PROGRESS) {
      router.replace(`/round/${roundId}/score`);
    }
  }, [reactiveRound?.status, roundId, router]);

  // Load non-reactive data (club, owner) on focus
  const reload = useCallback(async () => {
    if (!roundId) return;
    setLoading(true);

    try {
      const r = await smcGetRound(db, roundId);
      setRound(r);

      // Load owner info
      if (r?.created_by) {
        const ownerUser = await smcGetUserById(db, r.created_by);
        setOwner(ownerUser);
      }

      // Load club details
      if (r?.club_id) {
        const clubData = await smcGetClubWithDetails(db, r.club_id);
        if (clubData) {
          setClubName(clubData.club.name);
          setClubPositions(clubData.positions);
        }
      }

      // Load squad members (initial load, reactive query takes over)
      const squad = await smcGetSquadByRound(db, roundId);
      if (squad) {
        const entries = await smcListShooterEntries(db, squad.id);
        setShooters(entries);
      }
    } finally {
      setLoading(false);
    }
  }, [db, roundId]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  // Use reactive shooters once available, fall back to initial load
  const displayShooters = reactiveShooters.length > 0 ? reactiveShooters : shooters;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const ownerName = owner?.display_name ?? 'the round owner';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Waiting Banner */}
      <View style={styles.waitingBanner}>
        <Text style={styles.waitingTitle}>Waiting to Start</Text>
        <Text style={styles.waitingText}>
          Waiting for {ownerName} to start the round...
        </Text>
      </View>

      {/* Club Name */}
      {clubName && (
        <View style={styles.clubSection}>
          <Text style={styles.clubName}>{clubName}</Text>
        </View>
      )}

      {/* Positions Section */}
      {clubPositions.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Positions</Text>
          {clubPositions.map((position) => (
            <View key={position.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {formatPositionTitle(position)}
              </Text>
              {position.stands.map((stand) => (
                <Text key={stand.id} style={styles.cardDetail}>
                  Stand {stand.stand_number} · {formatStandDetail(stand)}
                </Text>
              ))}
            </View>
          ))}
        </>
      )}

      {/* Squad Section */}
      <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Squad</Text>
      {displayShooters.length === 0 ? (
        <Text style={styles.emptyText}>No shooters added yet</Text>
      ) : (
        displayShooters.map((entry) => (
          <View key={entry.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {entry.position_in_squad}. {entry.shooter_name}
            </Text>
            {entry.user_id && (
              <Text style={styles.userIdBadge}>Linked user</Text>
            )}
          </View>
        ))
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgPrimary,
  },
  waitingBanner: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  waitingTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: Spacing.xs,
  },
  waitingText: {
    fontSize: FontSize.base,
    color: '#92400E',
    textAlign: 'center',
  },
  clubSection: {
    marginBottom: Spacing.lg,
  },
  clubName: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
  },
  cardTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardDetail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  userIdBadge: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
