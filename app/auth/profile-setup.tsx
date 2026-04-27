import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { usePowerSync } from '@powersync/react';
import { color, radius, space } from '@/lib/design-system';
import type { Club } from '@/lib/types';
import { smcUpdateUserProfile, smcIsUserIdAvailable } from '@/db/queries/smc-users';
import {
  Body,
  BodySm,
  Button,
  Chip,
  H3,
  Meta,
  Screen,
  TextInput,
  Typography,
} from '@/components/ui';

export default function ProfileSetupScreen() {
  const { user, signOut, refreshUser } = useAuth();
  const db = usePowerSync();

  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [userIdAvailable, setUserIdAvailable] = useState(true);
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [discoverable, setDiscoverable] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubIds, setSelectedClubIds] = useState<string[]>([]);
  const [gear, setGear] = useState<string[]>([]);
  const [newGearItem, setNewGearItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const loadedClubs = await db.getAll<Club>('SELECT * FROM clubs ORDER BY name');
        setClubs(loadedClubs);
      } catch (err) {
        console.error('Error loading clubs:', err);
      }
    })();
  }, [db]);

  useEffect(() => {
    if (!userId.trim()) {
      setUserIdAvailable(true);
      return;
    }
    const timer = setTimeout(async () => {
      setCheckingUserId(true);
      try {
        const available = await smcIsUserIdAvailable(db, userId);
        setUserIdAvailable(available);
      } catch (err) {
        console.error('Error checking userId:', err);
      } finally {
        setCheckingUserId(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [userId, db]);

  const validateForm = (): boolean => {
    if (!displayName.trim()) return fail('Display name is required.');
    if (!userId.trim()) return fail('User ID is required.');
    if (!userIdAvailable) return fail('This User ID is already taken.');
    if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
      return fail('User ID can only contain letters, numbers, underscores, and hyphens.');
    }
    if (userId.length < 3) return fail('User ID must be at least 3 characters.');
    if (userId.length > 20) return fail('User ID must be 20 characters or less.');
    return true;
  };
  const fail = (msg: string) => {
    setError(msg);
    return false;
  };

  const handleCompleteProfile = async () => {
    if (!validateForm() || !user) return;
    setError(null);
    setLoading(true);
    try {
      await smcUpdateUserProfile(db, user.id, {
        display_name: displayName,
        user_id: userId,
        discoverable: discoverable ? 1 : 0,
        favourite_club_ids: JSON.stringify(selectedClubIds),
        gear: JSON.stringify(gear),
      });
      await refreshUser();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to complete profile.';
      setError(msg);
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const addGear = () => {
    if (newGearItem.trim()) {
      setGear([...gear, newGearItem.trim()]);
      setNewGearItem('');
    }
  };
  const removeGear = (index: number) => setGear(gear.filter((_, i) => i !== index));
  const toggleClub = (clubId: string) =>
    setSelectedClubIds((prev) =>
      prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId],
    );

  const confirmLogout = async () => {
    const run = async () => {
      try {
        await signOut();
      } catch {
        Alert.alert('Error', 'Failed to log out.');
      }
    };
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to log out?')) {
        await run();
      }
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel' },
        { text: 'Log Out', style: 'destructive', onPress: run },
      ]);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <H3>Complete Your Profile</H3>
          <Meta style={{ marginTop: space[1] }}>Set Up Your Account Details</Meta>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <BodySm tone="danger">{error}</BodySm>
          </View>
        ) : null}

        <View style={styles.section}>
          <H3>Basic Information</H3>
          <TextInput
            label="Display Name *"
            placeholder="Your name"
            value={displayName}
            onChangeText={setDisplayName}
            editable={!loading}
          />
          <View style={{ position: 'relative' }}>
            <TextInput
              label="User ID *"
              helperText="Unique handle for invites (3–20 characters; letters, numbers, underscore, hyphen)."
              placeholder="unique_handle"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              editable={!loading}
              errorText={
                userId.trim() && !userIdAvailable && !checkingUserId
                  ? 'Already Taken'
                  : undefined
              }
            />
            {checkingUserId ? (
              <ActivityIndicator
                size="small"
                color={color.primary}
                style={styles.userIdSpinner}
              />
            ) : null}
          </View>
          {userId.trim() && !checkingUserId && userIdAvailable ? (
            <BodySm tone="default" style={{ color: color.hit }}>
              ✓ Available
            </BodySm>
          ) : null}
        </View>

        <View style={styles.section}>
          <H3>Favourite Grounds</H3>
          <View style={styles.clubGrid}>
            {clubs.map((club) => (
              <Chip
                key={club.id}
                label={club.name}
                active={selectedClubIds.includes(club.id)}
                disabled={loading}
                onPress={() => toggleClub(club.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <H3>Gear</H3>
          <View style={styles.gearRow}>
            <View style={{ flex: 1 }}>
              <TextInput
                placeholder="e.g. Beretta 686 Silver Pigeon"
                value={newGearItem}
                onChangeText={setNewGearItem}
                editable={!loading}
              />
            </View>
            <Button
              label="Add"
              variant="primary"
              size="md"
              disabled={!newGearItem.trim() || loading}
              onPress={addGear}
            />
          </View>
          {gear.length > 0 ? (
            <View style={{ gap: space[2] }}>
              {gear.map((item, index) => (
                <View key={index} style={styles.gearItem}>
                  <Body style={{ flex: 1 }}>{item}</Body>
                  <Pressable onPress={() => removeGear(index)} disabled={loading} hitSlop={8}>
                    <Typography tone="muted" weight="600">
                      ✕
                    </Typography>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <View style={styles.discoverableRow}>
            <View style={{ flex: 1, gap: space[1] }}>
              <H3>Discoverable</H3>
              <BodySm tone="muted">
                Allow others to find you by display name in invite search. Your User ID is always searchable.
              </BodySm>
            </View>
            <Switch value={discoverable} onValueChange={setDiscoverable} disabled={loading} />
          </View>
        </View>

        <Button
          label={loading ? 'Saving…' : 'Complete Setup'}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading || !userIdAvailable}
          onPress={handleCompleteProfile}
        />

        <Pressable onPress={confirmLogout} disabled={loading} style={styles.logoutBtn}>
          <Typography tone="danger" weight="600">
            Log Out
          </Typography>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
    paddingVertical: space[8],
    gap: space[6],
  },
  header: {
    gap: space[1],
  },
  errorBox: {
    backgroundColor: color.missBg,
    borderRadius: radius.md,
    padding: space[3],
    borderLeftWidth: 4,
    borderLeftColor: color.miss,
  },
  section: {
    gap: space[3],
  },
  userIdSpinner: {
    position: 'absolute',
    right: space[3] + 2,
    top: 36,
  },
  clubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  gearRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[2],
  },
  gearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.bgSunken,
    paddingHorizontal: space[3],
    paddingVertical: space[3] - 2,
    borderRadius: radius.md,
  },
  discoverableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[4],
  },
  logoutBtn: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: color.miss,
    marginTop: space[2],
  },
});
