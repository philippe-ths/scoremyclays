import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { usePowerSync } from '@powersync/react';
import { color, fontFamily, radius, space } from '@/lib/design-system';
import type { Club } from '@/lib/types';
import {
  Body,
  Button,
  Card,
  H3,
  Label,
  Meta,
  PhotoHeader,
  Screen,
  Typography,
} from '@/components/ui';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const db = usePowerSync();

  const [clubs, setClubs] = useState<Record<string, Club>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const allClubs = await db.getAll<Club>('SELECT * FROM clubs');
        const clubMap: Record<string, Club> = {};
        allClubs.forEach((club) => {
          clubMap[club.id] = club;
        });
        setClubs(clubMap);
      } catch (err) {
        console.error('Error loading clubs:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [db]);

  if (isLoading || loading) {
    return (
      <Screen>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      </Screen>
    );
  }

  if (!user) return null;

  const favouriteClubIds: string[] = user.favourite_club_ids
    ? JSON.parse(user.favourite_club_ids)
    : [];
  const gearList: string[] = user.gear ? JSON.parse(user.gear) : [];
  const favouriteClubs = favouriteClubIds.map((id) => clubs[id]).filter(Boolean);

  const confirmLogout = () => {
    const run = async () => {
      try {
        await signOut();
      } catch {
        Alert.alert('Error', 'Failed to log out.');
      }
    };
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to log out?')) {
        void run();
      }
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel' },
        { text: 'Log Out', style: 'destructive', onPress: run },
      ]);
    }
  };

  return (
    <Screen edges={['left', 'right']}>
      <ScrollView>
        <PhotoHeader
          eyebrow={`@${user.user_id}`}
          title={user.display_name || 'Shooter'}
          height={220}
        />

        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Typography
              style={{
                fontFamily: fontFamily.displayBlack,
                fontSize: 28,
                color: color.primaryFg,
              }}
            >
              {(user.display_name || 'U')[0].toUpperCase()}
            </Typography>
          </View>
        </View>

        <View style={styles.section}>
          <H3>Account</H3>

          <Card padded style={styles.infoCard}>
            <Label>Email</Label>
            <Body>{user.email}</Body>
          </Card>

          <Card padded style={styles.infoCard}>
            <Label>Discoverable</Label>
            <Body>
              {user.discoverable ? 'Visible in Search' : 'Private (Exact User ID Only)'}
            </Body>
          </Card>
        </View>

        {favouriteClubs.length > 0 ? (
          <View style={styles.section}>
            <H3>Favourite Grounds</H3>
            <View style={{ gap: space[2] }}>
              {favouriteClubs.map((club) => (
                <Card key={club.id} padded style={styles.listItem}>
                  <Body weight="500">{club.name}</Body>
                </Card>
              ))}
            </View>
          </View>
        ) : null}

        {gearList.length > 0 ? (
          <View style={styles.section}>
            <H3>Gear</H3>
            <View style={{ gap: space[2] }}>
              {gearList.map((item, index) => (
                <Card key={index} padded style={styles.listItem}>
                  <Body>{item}</Body>
                </Card>
              ))}
            </View>
          </View>
        ) : null}

        <View style={[styles.section, styles.actions]}>
          <Button
            label="Edit Profile"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push('/profile/edit')}
          />
          <Pressable onPress={confirmLogout} style={styles.logoutBtn}>
            <Typography tone="danger" weight="600">
              Log Out
            </Typography>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Meta>Member since {new Date(user.created_at).toLocaleDateString()}</Meta>
        </View>
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
  avatarRow: {
    paddingHorizontal: space[5],
    marginTop: -32,
    marginBottom: space[4],
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: color.primary,
    borderWidth: 3,
    borderColor: color.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: space[5],
    paddingVertical: space[5],
    gap: space[3],
    borderBottomWidth: 1,
    borderBottomColor: color.border1,
  },
  infoCard: {
    gap: space[1],
  },
  listItem: {
    paddingHorizontal: space[4],
    paddingVertical: space[3],
  },
  actions: {
    gap: space[3],
    borderBottomWidth: 0,
  },
  logoutBtn: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: color.miss,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: space[6],
  },
});
