import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { usePowerSync } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { deterministicUUID } from '@/lib/uuid';
import { useAuth } from '@/providers/AuthProvider';
import { getRound } from '@/db/queries/rounds';
import { getSquadByRound, listShooterEntriesWithUsers } from '@/db/queries/squads';
import { listStands, createStand } from '@/db/queries/stands';
import { recordTargetResult, getResultsForStandAndShooter, getRoundConflicts, type ConflictedShotGroup } from '@/db/queries/scoring';
import { updateRoundStatus } from '@/db/queries/rounds';
import { getClubWithDetails } from '@/db/queries/clubs';
import { Colors, Spacing, FontSize, BorderRadius, PRESENTATION_LABELS } from '@/lib/constants';
import LoadingPlaceholder from '@/components/LoadingPlaceholder';
import PositionPicker, { type PositionStatus } from '@/components/PositionPicker';
import StandSelector from '@/components/StandSelector';
import ShooterPicker, { type ShooterStatus, type ShooterProgress } from '@/components/ShooterPicker';
import {
  ShotResult,
  RoundStatus,
  TargetConfig,
  type Stand,
  type EnrichedShooterEntry,
  type PresentationType,
  type Round,
  type ClubStand,
  type PositionWithStands,
} from '@/lib/types';

// Graceful haptics: no-op if not available (web)
let triggerHaptic = () => {};
try {
  const Haptics = require('expo-haptics');
  triggerHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
} catch {}

function birdsPerTarget(config: TargetConfig): number {
  return config === TargetConfig.SINGLE ? 1 : 2;
}

type ClubPhase = 'position-picker' | 'stand-selector' | 'shooter-picker' | 'scoring';
type ScoringPhase = 'shooter-picker' | 'scoring';

export default function ScoringScreen() {
  const { id: roundId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();

  // Shared state
  const [round, setRound] = useState<Round | null>(null);
  const [shooters, setShooters] = useState<EnrichedShooterEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conflicts, setConflicts] = useState<ConflictedShotGroup[]>([]);
  const deviceId = useMemo(() => `web-${user?.id?.slice(0, 8) ?? 'anon'}`, [user]);

  // Custom mode state (sequential)
  const [stands, setStands] = useState<Stand[]>([]);
  const [standIdx, setStandIdx] = useState(0);

  // Club mode state
  const [clubPositions, setClubPositions] = useState<PositionWithStands[]>([]);
  const [clubPhase, setClubPhase] = useState<ClubPhase>('position-picker');
  const [selectedPosition, setSelectedPosition] = useState<PositionWithStands | null>(null);
  const [currentClubStand, setCurrentClubStand] = useState<Stand | null>(null);
  /** Map of club_stand_id → round stand_id for stands already created this round */
  const [createdStandMap, setCreatedStandMap] = useState<Map<string, string>>(new Map());
  /** Set of club_stand_ids that have been fully completed */
  const [completedClubStandIds, setCompletedClubStandIds] = useState<Set<string>>(new Set());

  // Shooter picker state
  const [scoringPhase, setScoringPhase] = useState<ScoringPhase>('shooter-picker');
  const [shooterStatuses, setShooterStatuses] = useState<Record<string, ShooterStatus>>({});
  const [shooterProgress, setShooterProgress] = useState<Record<string, ShooterProgress>>({});

  // Scoring state (shared)
  const [shooterIdx, setShooterIdx] = useState(0);
  const [targetNum, setTargetNum] = useState(1);
  const [birdNum, setBirdNum] = useState(1);
  const [killCount, setKillCount] = useState(0);
  const [totalRecorded, setTotalRecorded] = useState(0);

  const isClubRound = !!round?.club_id;
  const currentStand = isClubRound ? currentClubStand : (stands[standIdx] ?? null);
  const currentShooter = shooters[shooterIdx] ?? null;
  const maxBirds = currentStand ? birdsPerTarget(currentStand.target_config as TargetConfig) : 1;

  // Initial data load
  useEffect(() => {
    (async () => {
      if (!roundId) return;
      const r = await getRound(db, roundId);
      setRound(r);

      const squad = await getSquadByRound(db, roundId);
      if (squad) {
        const entries = await listShooterEntriesWithUsers(db, squad.id);
        setShooters(entries);
      }

      if (r?.club_id) {
        // Club mode: load positions and check for already-created stands
        const clubData = await getClubWithDetails(db, r.club_id);
        if (clubData) {
          setClubPositions(clubData.positions);
        }
        // Load existing stands (for resume)
        const existingStands = await listStands(db, roundId);
        const standMap = new Map<string, string>();
        const completedIds = new Set<string>();
        for (const s of existingStands) {
          if (s.club_stand_id) {
            standMap.set(s.club_stand_id, s.id);
          }
        }
        setCreatedStandMap(standMap);
        // Check which stands are fully completed by checking scorer results
        // (simplified: a stand is "completed" if results exist for all shooters)
        // We'll refine this when entering the stand
        setCompletedClubStandIds(completedIds);
      } else {
        // Custom mode: load pre-created stands
        const s = await listStands(db, roundId);
        setStands(s);
      }

      // Load conflicts for this round
      const c = await getRoundConflicts(db, roundId);
      setConflicts(c);

      setIsLoading(false);
    })();
  }, [db, roundId]);

  // Load existing results when stand/shooter changes to resume mid-round
  useEffect(() => {
    if (!currentStand || !currentShooter) return;
    (async () => {
      const existing = await getResultsForStandAndShooter(db, currentStand.id, currentShooter.id);
      if (existing.length > 0) {
        const lastResult = existing[existing.length - 1];
        const kills = existing.filter((r) => r.result === ShotResult.KILL).length;
        setKillCount(kills);
        setTotalRecorded(existing.length);
        const nextTarget = lastResult.target_number;
        const nextBird = lastResult.bird_number;
        if (nextBird < maxBirds) {
          setTargetNum(nextTarget);
          setBirdNum(nextBird + 1);
        } else if (nextTarget < (currentStand.num_targets ?? 0)) {
          setTargetNum(nextTarget + 1);
          setBirdNum(1);
        }
      } else {
        setKillCount(0);
        setTotalRecorded(0);
        setTargetNum(1);
        setBirdNum(1);
      }
    })();
  }, [currentStand?.id, currentShooter?.id]);

  // Compute shooter statuses when stand changes or when returning to shooter picker
  const refreshShooterStatuses = useCallback(
    async (stand: Stand) => {
      const statuses: Record<string, ShooterStatus> = {};
      const progress: Record<string, ShooterProgress> = {};
      const totalShots = (stand.num_targets ?? 0) * birdsPerTarget(stand.target_config as TargetConfig);

      for (const shooter of shooters) {
        const results = await getResultsForStandAndShooter(db, stand.id, shooter.id);
        const recorded = results.length;
        progress[shooter.id] = { recorded, total: totalShots };
        if (recorded === 0) {
          statuses[shooter.id] = 'not-started';
        } else if (recorded >= totalShots) {
          statuses[shooter.id] = 'completed';
        } else {
          statuses[shooter.id] = 'in-progress';
        }
      }

      setShooterStatuses(statuses);
      setShooterProgress(progress);
    },
    [db, shooters],
  );

  // Refresh statuses when the current stand changes
  useEffect(() => {
    if (!currentStand || shooters.length === 0) return;
    refreshShooterStatuses(currentStand);
  }, [currentStand?.id, shooters.length]);

  function handleSelectShooter(shooter: ShooterEntry) {
    const idx = shooters.findIndex((s) => s.id === shooter.id);
    if (idx >= 0) {
      setShooterIdx(idx);
      setTargetNum(1);
      setBirdNum(1);
      setKillCount(0);
      setTotalRecorded(0);
      setScoringPhase('scoring');
      if (isClubRound) setClubPhase('scoring');
    }
  }

  async function returnToShooterPicker() {
    if (currentStand) {
      await refreshShooterStatuses(currentStand);
    }
    setScoringPhase('shooter-picker');
    if (isClubRound) setClubPhase('shooter-picker');
  }

  // Navigate back within the scoring state machine
  function handleHeaderBack() {
    if (isClubRound) {
      switch (clubPhase) {
        case 'scoring':
          returnToShooterPicker();
          break;
        case 'shooter-picker':
          setCurrentClubStand(null);
          setClubPhase('stand-selector');
          break;
        case 'stand-selector':
          setSelectedPosition(null);
          setClubPhase('position-picker');
          break;
        default:
          router.back();
      }
    } else {
      if (scoringPhase === 'scoring') {
        returnToShooterPicker();
      } else {
        router.back();
      }
    }
  }

  // Compute contextual header title
  const headerTitle = useMemo(() => {
    if (isClubRound) {
      switch (clubPhase) {
        case 'position-picker': return 'Scoring';
        case 'stand-selector': return 'Choose Stand';
        case 'shooter-picker': return 'Choose Shooter';
        case 'scoring': return 'Scoring';
      }
    }
    return scoringPhase === 'shooter-picker' ? 'Choose Shooter' : 'Scoring';
  }, [isClubRound, clubPhase, scoringPhase]);

  // Whether the header back button should exit the round or navigate within the state machine
  const showInternalBack = isClubRound
    ? clubPhase !== 'position-picker'
    : scoringPhase === 'scoring';

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: headerTitle,
      headerLeft: showInternalBack
        ? () => (
            <TouchableOpacity onPress={handleHeaderBack} style={{ paddingRight: Spacing.sm }}>
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [navigation, headerTitle, showInternalBack, handleHeaderBack]);

  const standComplete = currentStand
    ? targetNum > (currentStand.num_targets ?? 0)
    : false;

  const isLastStand = standIdx === stands.length - 1;
  const isLastShooter = shooterIdx === shooters.length - 1;
  const allShootersCompleted = shooters.length > 0 && shooters.every(
    (s) => (shooterStatuses[s.id] ?? 'not-started') === 'completed',
  );

  // --- Scoring handler (shared) ---
  const handleScore = useCallback(
    async (result: ShotResult) => {
      if (!currentStand || !currentShooter || !user || standComplete) return;
      triggerHaptic();

      await recordTargetResult(db, {
        id: Crypto.randomUUID(),
        stand_id: currentStand.id,
        round_id: roundId!,
        shooter_entry_id: currentShooter.id,
        target_number: targetNum,
        bird_number: birdNum,
        result,
        recorded_by: user.id,
        device_id: deviceId,
      });

      if (result === ShotResult.KILL) setKillCount((c) => c + 1);
      setTotalRecorded((c) => c + 1);

      if (birdNum < maxBirds) {
        setBirdNum((b) => b + 1);
      } else if (targetNum < (currentStand.num_targets ?? 0)) {
        setTargetNum((t) => t + 1);
        setBirdNum(1);
      } else {
        setTargetNum(targetNum + 1);
      }
    },
    [currentStand, currentShooter, user, targetNum, birdNum, maxBirds, standComplete, db, deviceId],
  );

  // --- Custom mode navigation ---
  function handleReturnToShooterPicker() {
    returnToShooterPicker();
  }

  function handleNextStand() {
    if (!isLastStand) {
      setStandIdx((i) => i + 1);
      setScoringPhase('shooter-picker');
      setTargetNum(1);
      setBirdNum(1);
      setKillCount(0);
      setTotalRecorded(0);
    } else {
      handleFinish();
    }
  }

  // --- Club mode navigation ---
  function handleSelectPosition(position: PositionWithStands) {
    setSelectedPosition(position);
    setClubPhase('stand-selector');
  }

  async function handleSelectClubStand(clubStand: ClubStand) {
    if (!roundId) return;

    let standId = createdStandMap.get(clubStand.id);

    // Create the round stand from club template if it doesn't exist yet
    if (!standId) {
      standId = await deterministicUUID(`${roundId}:${clubStand.id}`);
      await createStand(db, {
        id: standId,
        round_id: roundId,
        stand_number: clubStand.stand_number,
        target_config: clubStand.target_config,
        presentation: clubStand.presentation,
        presentation_notes: clubStand.presentation_notes,
        num_targets: clubStand.num_targets,
        club_stand_id: clubStand.id,
        club_position_id: clubStand.club_position_id,
      });
      setCreatedStandMap((prev) => {
        const next = new Map(prev);
        next.set(clubStand.id, standId!);
        return next;
      });
    }

    // Load the created stand as the current stand
    const stand: Stand = {
      id: standId,
      round_id: roundId,
      stand_number: clubStand.stand_number,
      target_config: clubStand.target_config,
      presentation: clubStand.presentation,
      presentation_notes: clubStand.presentation_notes,
      num_targets: clubStand.num_targets,
      club_stand_id: clubStand.id,
      club_position_id: clubStand.club_position_id,
    };

    setCurrentClubStand(stand);
    setScoringPhase('shooter-picker');
    setClubPhase('shooter-picker');
  }

  function handleClubStandComplete() {
    // Mark this club stand as completed
    if (currentClubStand?.club_stand_id) {
      setCompletedClubStandIds((prev) => {
        const next = new Set(prev);
        next.add(currentClubStand.club_stand_id!);
        return next;
      });
    }
    // Return to position picker
    setCurrentClubStand(null);
    setSelectedPosition(null);
    setClubPhase('position-picker');
  }

  function handleClubReturnToShooterPicker() {
    returnToShooterPicker();
  }

  // --- Shared ---
  async function handleFinish() {
    if (!roundId) return;
    await updateRoundStatus(db, roundId, RoundStatus.COMPLETED);
    router.replace(`/round/${roundId}/summary`);
  }

  // Compute position statuses for PositionPicker
  const positionStatuses = useMemo(() => {
    const statuses: Record<string, PositionStatus> = {};
    for (const pos of clubPositions) {
      const allStandIds = pos.stands.map((s) => s.id);
      const allCompleted = allStandIds.length > 0 && allStandIds.every((id) => completedClubStandIds.has(id));
      const anyStarted = allStandIds.some((id) => createdStandMap.has(id));
      if (allCompleted) {
        statuses[pos.id] = 'completed';
      } else if (anyStarted) {
        statuses[pos.id] = 'in-progress';
      } else {
        statuses[pos.id] = 'not-started';
      }
    }
    return statuses;
  }, [clubPositions, completedClubStandIds, createdStandMap]);

  // --- Loading state ---
  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  // --- Club mode: position picker ---
  if (isClubRound && clubPhase === 'position-picker') {
    return (
      <PositionPicker
        positions={clubPositions}
        positionStatuses={positionStatuses}
        onSelectPosition={handleSelectPosition}
        onFinishRound={handleFinish}
      />
    );
  }

  // --- Club mode: stand selector ---
  if (isClubRound && clubPhase === 'stand-selector' && selectedPosition) {
    const posLabel = `Position ${selectedPosition.position_number}${selectedPosition.name ? ` — ${selectedPosition.name}` : ''}`;
    return (
      <StandSelector
        positionName={posLabel}
        stands={selectedPosition.stands}
        completedStandIds={completedClubStandIds}
        onSelectStand={handleSelectClubStand}
        onBack={() => setClubPhase('position-picker')}
      />
    );
  }

  // --- Club mode: shooter picker ---
  if (isClubRound && clubPhase === 'shooter-picker' && currentClubStand) {
    const standLabel = `Stand ${currentClubStand.stand_number}`;
    return (
      <ShooterPicker
        standLabel={standLabel}
        shooters={shooters}
        shooterStatuses={shooterStatuses}
        shooterProgress={shooterProgress}
        onSelectShooter={handleSelectShooter}
        onBack={() => {
          setCurrentClubStand(null);
          setClubPhase('stand-selector');
        }}
        onAllComplete={handleClubStandComplete}
        allCompleteLabel="Choose Next Position"
      />
    );
  }

  // --- Custom mode: shooter picker ---
  if (!isClubRound && scoringPhase === 'shooter-picker' && currentStand) {
    const standLabel = `Stand ${currentStand.stand_number}/${stands.length}`;
    return (
      <ShooterPicker
        standLabel={standLabel}
        shooters={shooters}
        shooterStatuses={shooterStatuses}
        shooterProgress={shooterProgress}
        onSelectShooter={handleSelectShooter}
        onAllComplete={isLastStand ? handleFinish : handleNextStand}
        allCompleteLabel={isLastStand ? 'Finish Round' : 'Next Stand'}
      />
    );
  }

  // --- Scoring UI (both modes) ---
  if (!currentStand || !currentShooter) {
    return <LoadingPlaceholder />;
  }

  const shooterHasConflict = conflicts.some(c => c.shooter_entry_id === currentShooter.id);

  return (
    <View style={styles.root}>
      {/* Top bar: score + progress */}
      <View style={styles.topBar}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Score</Text>
          {shooterHasConflict ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="warning" size={16} color="#EAB308" />
              <Text style={[styles.scoreValue, { fontSize: FontSize.sm, color: '#EAB308', marginLeft: 4, marginTop: 0 }]}>Sync Issue</Text>
            </View>
          ) : (
            <Text style={styles.scoreValue}>{killCount}/{totalRecorded}</Text>
          )}
        </View>
        <View style={styles.progressBox}>
          <Text style={styles.progressLabel}>
            Stand {currentStand.stand_number}{!isClubRound ? `/${stands.length}` : ''}
          </Text>
          <Text style={styles.progressDetail}>
            {PRESENTATION_LABELS[currentStand.presentation as PresentationType]}
          </Text>
        </View>
        <TouchableOpacity style={styles.shooterBox} onPress={returnToShooterPicker}>
          <Text style={styles.shooterLabel}>{currentShooter.shooter_name}</Text>
          <Text style={styles.changeShooterHint}>✎ Change</Text>
        </TouchableOpacity>
      </View>

      {/* Target info */}
      <View style={styles.targetInfo}>
        {!standComplete && (
          <Text style={styles.targetText}>
            Target {targetNum} of {currentStand.num_targets}
            {maxBirds > 1 ? ` · Bird ${birdNum}` : ''}
          </Text>
        )}
      </View>

      {/* Main scoring area */}
      <View style={styles.scoringArea}>
        {standComplete ? (
          <View style={styles.completedOverlay}>
            <Text style={styles.completedText}>Stand Complete!</Text>
            <Text style={styles.completedScore}>
              {killCount}/{totalRecorded}
            </Text>
            {isClubRound ? (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={handleClubReturnToShooterPicker}
              >
                <Text style={styles.nextBtnText}>Choose Next Shooter</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={handleReturnToShooterPicker}
              >
                <Text style={styles.nextBtnText}>Choose Next Shooter</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.scoreBtn, styles.killBtn]}
              onPress={() => handleScore(ShotResult.KILL)}
            >
              <Text style={styles.scoreBtnText}>KILL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scoreBtn, styles.lossBtn]}
              onPress={() => handleScore(ShotResult.LOSS)}
            >
              <Text style={styles.scoreBtnText}>LOSS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scoreBtn, styles.noShotBtn]}
              onPress={() => handleScore(ShotResult.NO_SHOT)}
            >
              <Text style={styles.noShotBtnText}>NO SHOT</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressBox: {
    flex: 1,
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  progressDetail: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  shooterBox: {
    flex: 1,
    alignItems: 'center',
  },
  shooterLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  shooterDetail: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  changeShooterHint: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  targetInfo: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  targetText: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  scoringArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  buttonsContainer: {
    gap: Spacing.md,
  },
  scoreBtn: {
    height: 80,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  killBtn: {
    backgroundColor: Colors.hit,
  },
  lossBtn: {
    backgroundColor: Colors.miss,
  },
  noShotBtn: {
    backgroundColor: Colors.bgTertiary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreBtnText: {
    fontSize: FontSize['3xl'],
    fontWeight: '800',
    color: '#FFFFFF',
  },
  noShotBtnText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  completedOverlay: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  completedText: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  completedScore: {
    fontSize: FontSize['5xl'],
    fontWeight: '800',
    color: Colors.hit,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  nextBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
