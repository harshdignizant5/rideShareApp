import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import Button from '../../components/common/Button';

const ProfileScreen = () => {
  // Mock Data
  const userProfile = {
    name: 'gfdgdf',
    city: 'geg',
    phone: '+1 234 567 8900',
    address: 'geg',
    vehicle: 'gdg',
    stats: {
      created: 0,
      joined: 0,
      completed: 0,
    },
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userCity}>{userProfile.city}</Text>
        </View>

        {/* Contact Information Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📞</Text>
            <Text style={styles.infoText}>{userProfile.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{userProfile.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🚲</Text>
            <Text style={styles.infoText}>{userProfile.vehicle}</Text>
          </View>
        </View>

        {/* Ride Statistics Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ride Statistics</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.stats.created}</Text>
              <Text style={styles.statLabel}>Created</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.stats.joined}</Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userProfile.stats.completed}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          icon="↪️"
          style={{ marginTop: perfectSize(16) }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: perfectSize(24),
    paddingTop: perfectSize(16),
    paddingBottom: perfectSize(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: scaleAndClampFontSize(24),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: perfectSize(24),
    gap: perfectSize(16),
  },
  profileCard: {
    backgroundColor: colors.background,
    borderRadius: perfectSize(16),
    padding: perfectSize(24),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: perfectSize(8),
  },
  avatarContainer: {
    width: perfectSize(80),
    height: perfectSize(80),
    borderRadius: perfectSize(40),
    backgroundColor: '#E7F5FF', // Light blue background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: perfectSize(16),
  },
  avatarIcon: {
    fontSize: scaleAndClampFontSize(40),
    color: colors.primary,
  },
  userName: {
    fontSize: scaleAndClampFontSize(20),
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: perfectSize(8),
  },
  userCity: {
    fontSize: scaleAndClampFontSize(16),
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: perfectSize(16),
    padding: perfectSize(20),
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: scaleAndClampFontSize(16),
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: perfectSize(20),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: perfectSize(16),
  },
  infoIcon: {
    fontSize: scaleAndClampFontSize(18),
    marginRight: perfectSize(16),
    width: perfectSize(24),
    textAlign: 'center',
  },
  infoText: {
    fontSize: scaleAndClampFontSize(16),
    color: colors.textPrimary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: perfectSize(16),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: scaleAndClampFontSize(24),
    fontWeight: '700',
    color: colors.primary,
    marginBottom: perfectSize(4),
  },
  statLabel: {
    fontSize: scaleAndClampFontSize(12),
    color: colors.textTertiary,
  },
});

export default ProfileScreen;
