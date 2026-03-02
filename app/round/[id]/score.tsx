import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/providers/AuthProvider';
import { getSquadByRound, listShooterEntries } from '@/db/queries/squads';
import { listStands } from '@/db/queries/stands';
import { recordTargetResult, getResultsForStandAndShooter } from '@/db/queries/scoring';
import { updateRoundStatus } from '@/db/queries/rounds';
import { Colors, Spacing, FontSize, BorderRadius, PRESENTATION_LABELS } from '@/lib/constants';
import {
  ShotResult,
  RoundStatus,
  TargetConfig,
  type Stand,
  type ShooterEntry,
  type PresentationType,
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

export default function ScoringScreen() {
  const { id: roundId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();

  const [stands, setStands] = useState<Stand[]>([]);
  const [shooters, setShooters] = useState<ShooterEntry[]>([]);
  const [standIdx, setStandIdx] = useState(0);
  const [shooterIdx, setShooterIdx] = useState(0);
  const [targetNum, setTargetNum] = useState(1);
  const [birdNum, setBirdNum] = useState(1);
  const [killCount, setKillCount] = useState(0);
  const [totalRecorded, setTotalRecorded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentStand = stands[standIdx] ?? null;
  const currentShooter = shooters[shooterIdx] ?? null;
  const maxBirds = currentStand ? birdsPerTarget(currentStand.target_config as TargetConfig) : 1;
  const deviceId = useMemo(() => `web-${user?.id?.slice(0, 8) ?? 'anon'}`, [user]);

  useEffect(() => {
    (async () => {
      if (!roundId) return;
      const s = await listStands(db, roundId);
      const squad = await getSquadByRound(db, roundId);
      if (squad) {
        const entries = await listShooterEntries(db, squad.id);
        setShooters(entries);
      }
      setStands(s);
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
        // Advance past completed targets
        const nextTarget = lastResult.target_number;
        const nextBird = lastResult.bird_number;
        if (nextBird < maxBirds) {
          setTargetNum(nextTarget);
          setBirdNum(nextBird + 1);
        } else if (nextTarget < (currentStand.num_targets ?? 0)) {
          setTargetNum(nextTarget + 1);
          setBirdNum(1);
        }
        // If all done, targets will be past the limit → standComplete triggers
      }
    })();
  }, [currentStand?.id, currentShooter?.id]);

  const standComplete = currentStand
    ? targetNum > (currentStand.num_targets ?? 0)
    : false;

  const isLastStand = standIdx === stands.length - 1;
  const isLastShooter = shooterIdx === shooters.length - 1;

  const handleScore = useCallback(
    async (result: ShotResult) => {
      if (!currentStand || !currentShooter || !user || standComplete) return;
      triggerHaptic();

      await recordTargetResult(db, {
        id: Crypto.randomUUID(),
        stand_id: currentStand.id,
        shooter_entry_id: currentShooter.id,
        target_number: targetNum,
        bird_number: birdNum,
        result,
        recorded_by: user.id,
        device_id: deviceId,
      });

      if (result === ShotResult.KILL) setKillCount((c) => c + 1);
      setTotalRecorded((c) => c + 1);

      // Advance to next bird/target
      if (birdNum < maxBirds) {
        setBirdNum((b) => b + 1);
      } else if (targetNum < (currentStand.num_targets ?? 0)) {
        setTargetNum((t) => t + 1);
        setBirdNum(1);
      } else {
        // This stand is done for this shooter - advance past
        setTargetNum(targetNum + 1);
      }
    },
    [currentStand, currentShooter, user, targetNum, birdNum, maxBirds, standComplete, db, deviceId],
  );

  function handleNextShooter() {
    if (!isLastShooter) {
      setShooterIdx((i) => i + 1);
      setTargetNum(1);
      setBirdNum(1);
      setKillCount(0);
      setTotalRecorded(0);
    } else {
      handleNextStand();
    }
  }

  function handleNextStand() {
    if (!isLastStand) {
      setStandIdx((i) => i + 1);
      setShooterIdx(0);
      setTargetNum(1);
      setBirdNum(1);
      setKillCount(0);
      setTotalRecorded(0);
    } else {
      handleFinish();
    }
  }

  async function handleFinish() {
    if (!roundId) return;
    await updateRoundStatus(db, roundId, RoundStatus.COMPLETED);
    router.replace(`/round/${roundId}/summary`);
  }

  if (isLoading || !currentStand || !currentShooter) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Top bar: score + progress */}
      <View style={styles.topBar}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{killCount}/{totalRecorded}</Text>
        </View>
        <View style={styles.progressBox}>
          <Text style={styles.progressLabel}>
            Stand {currentStand.stand_number}/{stands.length}
          </Text>
          <Text style={styles.progressDetail}>
            {PRESENTATION_LABELS[currentStand.presentation as PresentationType]}
          </Text>
        </View>
        <View style={styles.shooterBox}>
          <Text style={styles.shooterLabel}>{currentShooter.shooter_name}</Text>
          <Text style={styles.shooterDetail}>
            Shooter {shooterIdx + 1}/{shooters.length}
          </Text>
        </View>
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
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={isLastShooter && isLastStand ? handleFinish : handleNextShooter}
            >
              <Text style={styles.nextBtnText}>
                {isLastShooter && isLastStand
                  ? 'Finish Round'
                  : isLastShooter
                    ? 'Next Stand'
                    : 'Next Shooter'}
              </Text>
            </TouchableOpacity>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
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
