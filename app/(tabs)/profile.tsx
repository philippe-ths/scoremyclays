import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { usePowerSync } from '@powersync/react';
import { Colors } from '@/lib/constants';
import type { Club } from '@/lib/types';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const db = usePowerSync();
  
  const [clubs, setClubs] = useState<Record<string, Club>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClubs = async () => {
      try {
        const allClubs = await db.getAll<Club>('SELECT * FROM clubs');
        const clubMap: Record<string, Club> = {};
        allClubs.forEach(club => {
          clubMap[club.id] = club;
        });
        setClubs(clubMap);
      } catch (err) {
        console.error('Error loading clubs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadClubs();
  }, [db]);

  if (isLoading || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  const favouriteClubIds: string[] = user.favourite_club_ids
    ? JSON.parse(user.favourite_club_ids)
    : [];
  const gearList: string[] = user.gear ? JSON.parse(user.gear) : [];
  const favouriteClubs = favouriteClubIds
    .map(id => clubs[id])
    .filter(Boolean);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              await signOut();
            } catch (err) {
              Alert.alert('Error', 'Failed to log out');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user.display_name || 'U')[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.displayName}>{user.display_name}</Text>
            <Text style={styles.userId}>@{user.user_id}</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          {/* Discoverable Status */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Discoverable</Text>
            <Text style={styles.infoValue}>
              {user.discoverable ? 'Visible in search' : 'Private (exact User ID only)'}
            </Text>
          </View>
        </View>

        {/* Favourite Clubs */}
        {favouriteClubs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favourite Clubs</Text>
            <View style={styles.clubList}>
              {favouriteClubs.map(club => (
                <View key={club.id} style={styles.clubListItem}>
                  <Text style={styles.clubListItemText}>{club.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Gear */}
        {gearList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gear</Text>
            <View style={styles.gearList}>
              {gearList.map((item, index) => (
                <View key={index} style={styles.gearListItem}>
                  <Text style={styles.gearListItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Member since {new Date(user.created_at).toLocaleDateString()}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: Colors.bgSecondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  clubList: {
    gap: 8,
  },
  clubListItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.bgSecondary,
    borderRadius: 8,
  },
  clubListItemText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  gearList: {
    gap: 8,
  },
  gearListItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.bgSecondary,
    borderRadius: 8,
  },
  gearListItemText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginBottom: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.miss,
    minHeight: 48,
  },
  logoutButtonText: {
    color: Colors.miss,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
