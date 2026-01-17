import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import Button from '../../components/common/Button';
import { useSelector, useDispatch } from 'react-redux';
import {
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} from '@store/actions/authActions';
import { persistor } from '@store/index';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { logoutApi } from '@services/authServices/authServices';
import socketEventHandler from '../../socket/socketEventHandler';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector((state: any) => state.authReducer.userData);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  console.log('userData', userData);

  const userProfile = {
    name: userData?.name,
    city: userData?.city,
    phone: userData?.phone || userData?.vehicleNumber,
    address: userData?.city,
    vehicle: userData?.vehicleNumber,
    stats: {
      created: 0,
      joined: 0,
      completed: 0,
    },
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsLoggingOut(true);
            dispatch(logoutRequest());

            // Call logout API
            const response = await logoutApi();

            console.log('Logout Response:', response?.data);

            if (response?.data?.success) {
              // Dispatch logout success
              dispatch(logoutSuccess());

              // Clear redux persist
              await persistor.purge();

              // Disconnect socket
              console.log('🔌 Disconnecting socket on logout...');
              socketEventHandler.cleanup();

              // Show success message
              Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2:
                  response?.data?.data?.message ||
                  'You have been logged out successfully',
              });

              // Navigate to Login screen with replace
              // Since ProfileScreen is inside TabNavigator which is inside Main,
              // we need to get the parent (root) navigator
              const parentNavigation = navigation.getParent();
              if (parentNavigation) {
                parentNavigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  }),
                );
              } else {
                // Fallback
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  }),
                );
              }
            } else {
              throw new Error('Logout failed');
            }
          } catch (error: any) {
            console.error('Logout Error:', error);

            dispatch(logoutFailure(error?.message || 'Logout failed'));

            // Even on error, clear local data and navigate to login
            await persistor.purge();
            dispatch(logoutSuccess());

            // Disconnect socket even on error
            console.log(
              '🔌 Disconnecting socket on logout (error fallback)...',
            );
            socketEventHandler.cleanup();

            Toast.show({
              type: 'error',
              text1: 'Logout Error',
              text2: 'You have been logged out locally',
            });

            const parentNavigation = navigation.getParent();
            if (parentNavigation) {
              parentNavigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                }),
              );
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                }),
              );
            }
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
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
        <Button
          title={isLoggingOut ? 'Logging out...' : 'Logout'}
          onPress={handleLogout}
          variant="danger"
          icon="↪️"
          style={{ marginTop: perfectSize(16) }}
          disabled={isLoggingOut}
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
