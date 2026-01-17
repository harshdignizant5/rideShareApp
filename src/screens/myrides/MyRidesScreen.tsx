import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

import {
  getCreatedRides,
  getJoinedRides,
  deleteRide,
} from '@services/authServices/authServices';
import { SET_CREATED_RIDES } from '@store/reducers/appReducer';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import RideCard, { RideData } from '../../components/RideCard';

const MyRidesScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created');

  const [joinedRides, setJoinedRides] = useState<RideData[]>([]);
  const createdRides = useSelector(
    (state: any) => state.appReducer.createdRides,
  );
  const [loading, setLoading] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'created') {
        fetchCreatedRides();
      } else if (activeTab === 'joined') {
        fetchJoinedRides();
      }
    }, [activeTab]),
  );

  useEffect(() => {
    if (route.params?.tab) {
      setActiveTab(route.params.tab);
      navigation.setParams({ tab: undefined });
    }
  }, [route.params]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const fetchCreatedRides = async () => {
    setLoading(true);
    try {
      const response = await getCreatedRides();
      console.log('getCreatedRides response', response.data.data);

      if (Array.isArray(response?.data?.data)) {
        const mappedRides = response.data.data.map((ride: any) => ({
          id: ride.id,
          from: ride.startLocation.address,
          to: ride.endLocation.address,
          time: new Date(ride.departureTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          user: ride.rider.name,
          status: ride.status,
          requests: ride.requestCount || 0,
          ...ride,
        }));
        // Sort by createdAt desc (newest first)
        mappedRides.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        dispatch({ type: SET_CREATED_RIDES, payload: mappedRides });
      }
    } catch (error: any) {
      console.error('Fetch My Created Rides Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not fetch your created rides',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedRides = async () => {
    setLoading(true);
    try {
      const response = await getJoinedRides();
      console.log('getJoinedRides response', response.data.data);

      if (Array.isArray(response?.data?.data)) {
        const mappedRides = response.data.data.map((ride: any) => ({
          id: ride.id,
          from: ride.startLocation.address,
          to: ride.endLocation.address,
          time: new Date(ride.departureTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          user: ride.rider.name,
          status: ride.status,
          requests: ride.requestCount || 0,
          ...ride,
        }));
        // Sort by createdAt desc (newest first)
        mappedRides.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setJoinedRides(mappedRides);
      }
    } catch (error: any) {
      console.error('Fetch My Joined Rides Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not fetch your joined rides',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRide = (rideId: string) => {
    Alert.alert('Delete Ride', 'Are you sure you want to delete this ride?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await deleteRide(rideId);
            Toast.show({
              type: 'success',
              text1: 'Ride Deleted',
              text2: 'Ride successfully deleted.',
            });
            // Remove locally instead of refetching
            dispatch({
              type: SET_CREATED_RIDES,
              payload: createdRides.filter(
                (ride: RideData) => ride.id !== rideId,
              ),
            });
          } catch (error: any) {
            console.error('Delete Ride Error:', error);
            Toast.show({
              type: 'error',
              text1: 'Delete Failed',
              text2: 'Could not delete ride.',
            });
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  /* eslint-disable react/no-unstable-nested-components */
  const renderItem = ({ item }: { item: RideData }) => (
    <RideCard
      item={item}
      showRequestsBadge={activeTab === 'created'}
      onDelete={
        activeTab === 'created' ? () => handleDeleteRide(item.id) : undefined
      }
      onPress={() => {
        navigation.navigate('MyRideDetails', {
          ride: item,
          showRequestsBadge: activeTab === 'created',
        });
      }}
    />
  );
  /* eslint-enable react/no-unstable-nested-components */
  /* eslint-enable react/no-unstable-nested-components */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rides</Text>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabsBackground}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'created' && styles.activeTab]}
            onPress={() => setActiveTab('created')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'created' && styles.activeTabText,
              ]}
            >
              Created
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'joined' && styles.activeTab]}
            onPress={() => setActiveTab('joined')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'joined' && styles.activeTabText,
              ]}
            >
              Joined
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'created' ? createdRides : joinedRides}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={
            activeTab === 'created' ? fetchCreatedRides : fetchJoinedRides
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No rides found</Text>
            </View>
          }
        />
      )}
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
  tabsContainer: {
    padding: perfectSize(24),
  },
  tabsBackground: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundInput,
    borderRadius: perfectSize(12),
    padding: perfectSize(4),
  },
  tab: {
    flex: 1,
    paddingVertical: perfectSize(8),
    alignItems: 'center',
    borderRadius: perfectSize(8),
  },
  activeTab: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: scaleAndClampFontSize(14),
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: perfectSize(24),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: perfectSize(50),
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: scaleAndClampFontSize(16),
  },
});

export default MyRidesScreen;
